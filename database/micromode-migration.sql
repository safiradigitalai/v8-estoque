-- Migração para suporte ao MicroMode
-- Adiciona campos necessários para automação do sistema

-- 1. Adicionar colunas na tabela veiculos para MicroMode
ALTER TABLE veiculos 
ADD COLUMN IF NOT EXISTS vendedor_id INTEGER REFERENCES vendedores(id),
ADD COLUMN IF NOT EXISTS data_reserva TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS data_liberacao_reserva TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS data_inicio_negociacao TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS vendedor_venda INTEGER REFERENCES vendedores(id);

-- 2. Atualizar constraints de status para incluir 'negociando'
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_status_check;
ALTER TABLE veiculos 
ADD CONSTRAINT veiculos_status_check 
CHECK (status IN ('disponivel','reservado','negociando','vendido'));

-- 3. Adicionar índices para performance do MicroMode
CREATE INDEX IF NOT EXISTS idx_veiculos_vendedor_id ON veiculos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_data_reserva ON veiculos(data_reserva);
CREATE INDEX IF NOT EXISTS idx_veiculos_status_vendedor ON veiculos(status, vendedor_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_micromode ON veiculos(status, vendedor_id, data_liberacao_reserva);

-- 4. Criar tabela de configurações do sistema (se não existir)
CREATE TABLE IF NOT EXISTS vendedores_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    
    -- Pontuação
    pontos_por_venda INTEGER DEFAULT 100,
    pontos_por_lead INTEGER DEFAULT 10,
    pontos_bonus_meta INTEGER DEFAULT 200,
    
    -- Multiplicadores por nível
    multiplicador_iniciante DECIMAL(3,2) DEFAULT 1.0,
    multiplicador_intermediario DECIMAL(3,2) DEFAULT 1.2,
    multiplicador_avancado DECIMAL(3,2) DEFAULT 1.5,
    multiplicador_expert DECIMAL(3,2) DEFAULT 2.0,
    
    -- Configurações MicroMode
    reserva_veiculo_dias INTEGER DEFAULT 3,
    tempo_max_negociacao_dias INTEGER DEFAULT 30,
    auto_atribuir_leads BOOLEAN DEFAULT true,
    notificar_metas BOOLEAN DEFAULT true,
    notificar_rankings BOOLEAN DEFAULT true,
    
    -- Metadados
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (id = 1)
);

-- 5. Inserir configuração padrão
INSERT INTO vendedores_config (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- 6. Criar tabela de logs do sistema
CREATE TABLE IF NOT EXISTS sistema_logs (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    dados JSONB,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_sistema_logs_tipo ON sistema_logs(tipo);
CREATE INDEX IF NOT EXISTS idx_sistema_logs_criado_em ON sistema_logs(criado_em);

-- 7. Habilitar RLS nas novas tabelas
ALTER TABLE vendedores_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sistema_logs ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento
CREATE POLICY "Enable all operations for all users" ON vendedores_config FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON sistema_logs FOR ALL USING (true);

-- 8. Função para limpeza automática de reservas vencidas
CREATE OR REPLACE FUNCTION limpar_reservas_vencidas()
RETURNS TABLE (
    veiculos_liberados INTEGER,
    detalhes JSONB
) AS $$
DECLARE
    count_liberados INTEGER := 0;
    reservas_vencidas JSONB;
BEGIN
    -- Buscar reservas vencidas
    SELECT json_agg(
        json_build_object(
            'veiculo_id', id,
            'marca', marca,
            'modelo', modelo,
            'vendedor_id', vendedor_id,
            'data_vencimento', data_liberacao_reserva
        )
    ) INTO reservas_vencidas
    FROM veiculos 
    WHERE status = 'reservado' 
    AND data_liberacao_reserva < NOW();
    
    -- Contar quantos serão liberados
    SELECT COUNT(*) INTO count_liberados
    FROM veiculos 
    WHERE status = 'reservado' 
    AND data_liberacao_reserva < NOW();
    
    -- Liberar reservas vencidas
    UPDATE veiculos 
    SET 
        status = 'disponivel',
        vendedor_id = NULL,
        data_reserva = NULL,
        data_liberacao_reserva = NULL
    WHERE status = 'reservado' 
    AND data_liberacao_reserva < NOW();
    
    -- Registrar log
    INSERT INTO sistema_logs (tipo, descricao, dados)
    VALUES (
        'cleanup_reservas_automatico',
        format('%s reservas vencidas foram liberadas automaticamente', count_liberados),
        json_build_object(
            'count', count_liberados,
            'reservas', COALESCE(reservas_vencidas, '[]'::jsonb),
            'timestamp', NOW()
        )
    );
    
    RETURN QUERY SELECT count_liberados, COALESCE(reservas_vencidas, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger para atualizar vendedor_venda quando status = vendido
CREATE OR REPLACE FUNCTION set_vendedor_venda()
RETURNS TRIGGER AS $$
BEGIN
    -- Se está marcando como vendido e tem vendedor_id, copiar para vendedor_venda
    IF NEW.status = 'vendido' AND NEW.vendedor_id IS NOT NULL AND OLD.status != 'vendido' THEN
        NEW.vendedor_venda := NEW.vendedor_id;
    END IF;
    
    -- Se está tirando de vendido, limpar vendedor_venda
    IF NEW.status != 'vendido' AND OLD.status = 'vendido' THEN
        NEW.vendedor_venda := NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_vendedor_venda ON veiculos;
CREATE TRIGGER trigger_vendedor_venda
    BEFORE UPDATE ON veiculos
    FOR EACH ROW
    EXECUTE FUNCTION set_vendedor_venda();

-- 10. View otimizada para MicroMode
CREATE OR REPLACE VIEW micromode_veiculos AS
SELECT 
    v.id,
    v.marca,
    v.modelo,
    v.ano,
    v.valor,
    v.status,
    v.classe_social,
    v.vendedor_id,
    v.data_reserva,
    v.data_liberacao_reserva,
    v.data_inicio_negociacao,
    
    -- Calcular dias restantes para reserva
    CASE 
        WHEN v.status = 'reservado' AND v.data_liberacao_reserva IS NOT NULL THEN
            GREATEST(0, EXTRACT(DAY FROM v.data_liberacao_reserva - NOW())::INTEGER)
        ELSE NULL
    END as dias_restantes,
    
    -- Informações da categoria
    c.nome as categoria_nome,
    c.slug as categoria_slug,
    c.icone as categoria_icone,
    
    -- Informações do vendedor
    vend.nome as vendedor_nome,
    vend.pontuacao as vendedor_pontuacao,
    
    -- Foto principal
    vf.url as foto_principal_url
    
FROM veiculos v
JOIN categorias c ON v.categoria_id = c.id
LEFT JOIN vendedores vend ON v.vendedor_id = vend.id
LEFT JOIN veiculo_fotos vf ON v.id = vf.veiculo_id AND vf.tipo = 'principal'
WHERE v.status IN ('disponivel', 'reservado', 'negociando')
ORDER BY 
    v.marca,
    CASE v.status 
        WHEN 'disponivel' THEN 1
        WHEN 'reservado' THEN 2  
        WHEN 'negociando' THEN 3
    END,
    v.valor DESC;

-- 11. Comentários para documentação
COMMENT ON TABLE vendedores_config IS 'Configurações globais do sistema de vendedores e MicroMode';
COMMENT ON TABLE sistema_logs IS 'Logs de operações automáticas do sistema';
COMMENT ON FUNCTION limpar_reservas_vencidas() IS 'Função para limpeza automática de reservas vencidas no MicroMode';
COMMENT ON VIEW micromode_veiculos IS 'View otimizada para o sistema MicroMode com dados de veículos, vendedores e categorias';

-- 12. Atualizar trigger existente para incluir novos campos
CREATE OR REPLACE FUNCTION trigger_atualizar_veiculo()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar classe social
    NEW.classe_social := calcular_classe_social(NEW.valor);
    
    -- Atualizar dias em estoque
    NEW.dias_estoque := calcular_dias_estoque(NEW.status, NEW.data_entrada, NEW.data_venda);
    
    -- Atualizar timestamp
    NEW.atualizado_em := NOW();
    
    -- Lógica específica do MicroMode
    -- Se está reservando, definir data de liberação
    IF NEW.status = 'reservado' AND OLD.status != 'reservado' AND NEW.data_reserva IS NOT NULL THEN
        -- Buscar configuração de dias
        SELECT reserva_veiculo_dias INTO NEW.data_liberacao_reserva 
        FROM vendedores_config 
        WHERE id = 1;
        
        -- Calcular data de liberação
        NEW.data_liberacao_reserva := NEW.data_reserva + (COALESCE(NEW.data_liberacao_reserva, 3) || ' days')::INTERVAL;
    END IF;
    
    -- Se saiu de reservado, limpar campos de reserva
    IF NEW.status != 'reservado' AND OLD.status = 'reservado' THEN
        NEW.data_reserva := NULL;
        NEW.data_liberacao_reserva := NULL;
    END IF;
    
    -- Se saiu de negociando, limpar campo de negociação
    IF NEW.status != 'negociando' AND OLD.status = 'negociando' THEN
        NEW.data_inicio_negociacao := NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mensagem de conclusão
DO $$
BEGIN
    RAISE NOTICE '✅ Migração MicroMode aplicada com sucesso!';
    RAISE NOTICE '📊 Novos campos: vendedor_id, data_reserva, data_liberacao_reserva, data_inicio_negociacao, vendedor_venda';
    RAISE NOTICE '🔧 Nova configuração: vendedores_config';
    RAISE NOTICE '📝 Logs: sistema_logs';
    RAISE NOTICE '🎯 View otimizada: micromode_veiculos';
    RAISE NOTICE '⚡ Função de limpeza: limpar_reservas_vencidas()';
END $$;