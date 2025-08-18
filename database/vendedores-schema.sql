-- V8 System - Schema Vendedores e Performance
-- Módulo de gestão de equipe e gamificação

-- Tabela principal de vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    foto_url VARCHAR(500),
    
    -- Performance tracking
    pontuacao INTEGER DEFAULT 0,
    nivel VARCHAR(20) DEFAULT 'iniciante', -- iniciante, intermediario, avancado, expert
    meta_mensal DECIMAL(10,2) DEFAULT 50000.00,
    comissao_percentual DECIMAL(5,2) DEFAULT 3.00,
    
    -- Status e controle
    status VARCHAR(20) DEFAULT 'ativo', -- ativo, inativo, suspenso, ferias
    data_contratacao DATE DEFAULT CURRENT_DATE,
    especialidades TEXT[], -- array de especialidades: ['SUV', 'Sedan', 'Premium']
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_vendedores_status ON vendedores(status);
CREATE INDEX IF NOT EXISTS idx_vendedores_nivel ON vendedores(nivel);
CREATE INDEX IF NOT EXISTS idx_vendedores_pontuacao ON vendedores(pontuacao DESC);

-- Métricas de performance por período
CREATE TABLE IF NOT EXISTS vendedores_metricas (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER REFERENCES vendedores(id) ON DELETE CASCADE,
    periodo DATE NOT NULL, -- primeiro dia do mês (2024-01-01)
    
    -- Números do período
    leads_recebidos INTEGER DEFAULT 0,
    leads_convertidos INTEGER DEFAULT 0,
    veiculos_vendidos INTEGER DEFAULT 0,
    valor_vendas DECIMAL(12,2) DEFAULT 0.00,
    comissao_ganha DECIMAL(10,2) DEFAULT 0.00,
    
    -- Pontuação e gamificação
    pontos_ganhos INTEGER DEFAULT 0,
    bonus_atingido BOOLEAN DEFAULT false,
    meta_atingida BOOLEAN DEFAULT false,
    
    -- Métricas calculadas
    taxa_conversao DECIMAL(5,2) DEFAULT 0.00, -- leads_convertidos / leads_recebidos * 100
    ticket_medio DECIMAL(10,2) DEFAULT 0.00, -- valor_vendas / veiculos_vendidos
    
    criado_em TIMESTAMP DEFAULT NOW(),
    
    -- Constraint para evitar duplicatas por vendedor/período
    UNIQUE(vendedor_id, periodo)
);

-- Habilitar RLS
ALTER TABLE vendedores_metricas ENABLE ROW LEVEL SECURITY;

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_vendedores_metricas_vendedor ON vendedores_metricas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_vendedores_metricas_periodo ON vendedores_metricas(periodo DESC);
CREATE INDEX IF NOT EXISTS idx_vendedores_metricas_conversao ON vendedores_metricas(taxa_conversao DESC);

-- Atualizar tabela de veículos para incluir vendedor responsável
ALTER TABLE veiculos ADD COLUMN IF NOT EXISTS vendedor_responsavel_id INTEGER REFERENCES vendedores(id);
ALTER TABLE veiculos ADD COLUMN IF NOT EXISTS margem_percentual DECIMAL(5,2);
ALTER TABLE veiculos ADD COLUMN IF NOT EXISTS custo_aquisicao DECIMAL(10,2);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION update_vendedores_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-update de timestamps
DROP TRIGGER IF EXISTS vendedores_updated_at ON vendedores;
CREATE TRIGGER vendedores_updated_at
    BEFORE UPDATE ON vendedores
    FOR EACH ROW
    EXECUTE FUNCTION update_vendedores_timestamp();

-- Função para calcular métricas automaticamente
CREATE OR REPLACE FUNCTION calculate_vendedor_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular taxa de conversão
    IF NEW.leads_recebidos > 0 THEN
        NEW.taxa_conversao = ROUND((NEW.leads_convertidos::DECIMAL / NEW.leads_recebidos::DECIMAL) * 100, 2);
    END IF;
    
    -- Calcular ticket médio
    IF NEW.veiculos_vendidos > 0 THEN
        NEW.ticket_medio = ROUND(NEW.valor_vendas / NEW.veiculos_vendidos, 2);
    END IF;
    
    -- Verificar se atingiu meta
    NEW.meta_atingida = NEW.valor_vendas >= (
        SELECT meta_mensal FROM vendedores WHERE id = NEW.vendedor_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para cálculo automático de métricas
DROP TRIGGER IF EXISTS calculate_metrics ON vendedores_metricas;
CREATE TRIGGER calculate_metrics
    BEFORE INSERT OR UPDATE ON vendedores_metricas
    FOR EACH ROW
    EXECUTE FUNCTION calculate_vendedor_metrics();

-- View para dashboard de vendedores
CREATE OR REPLACE VIEW dashboard_vendedores AS
SELECT 
    v.id,
    v.nome,
    v.email,
    v.telefone,
    v.foto_url,
    v.pontuacao,
    v.nivel,
    v.meta_mensal,
    v.comissao_percentual,
    v.status,
    v.data_contratacao,
    v.especialidades,
    
    -- Métricas do mês atual
    COALESCE(vm_atual.leads_recebidos, 0) as leads_mes_atual,
    COALESCE(vm_atual.leads_convertidos, 0) as conversoes_mes_atual,
    COALESCE(vm_atual.veiculos_vendidos, 0) as vendas_mes_atual,
    COALESCE(vm_atual.valor_vendas, 0) as faturamento_mes_atual,
    COALESCE(vm_atual.taxa_conversao, 0) as taxa_conversao_atual,
    COALESCE(vm_atual.ticket_medio, 0) as ticket_medio_atual,
    COALESCE(vm_atual.meta_atingida, false) as meta_atingida_atual,
    
    -- Totais acumulados (últimos 6 meses)
    COALESCE(totais.total_vendas, 0) as total_vendas_semestre,
    COALESCE(totais.total_faturamento, 0) as total_faturamento_semestre,
    COALESCE(totais.media_conversao, 0) as media_conversao_semestre,
    
    -- Ranking baseado em pontuação
    RANK() OVER (ORDER BY v.pontuacao DESC) as ranking_geral,
    RANK() OVER (ORDER BY COALESCE(vm_atual.valor_vendas, 0) DESC) as ranking_mes
    
FROM vendedores v
LEFT JOIN vendedores_metricas vm_atual ON (
    v.id = vm_atual.vendedor_id 
    AND vm_atual.periodo = DATE_TRUNC('month', CURRENT_DATE)
)
LEFT JOIN (
    SELECT 
        vendedor_id,
        SUM(veiculos_vendidos) as total_vendas,
        SUM(valor_vendas) as total_faturamento,
        AVG(taxa_conversao) as media_conversao
    FROM vendedores_metricas 
    WHERE periodo >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
    GROUP BY vendedor_id
) totais ON v.id = totais.vendedor_id
WHERE v.status = 'ativo'
ORDER BY v.pontuacao DESC;

-- Políticas RLS básicas (ajustar conforme necessário)
CREATE POLICY vendedores_policy ON vendedores FOR ALL USING (true);
CREATE POLICY vendedores_metricas_policy ON vendedores_metricas FOR ALL USING (true);