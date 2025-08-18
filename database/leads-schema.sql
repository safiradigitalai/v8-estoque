-- =====================================================
-- V8 Sistema de Estoque - Schema para Módulo de Leads
-- =====================================================

-- Tabela de origens dos leads
CREATE TABLE IF NOT EXISTS origens_leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    cor VARCHAR(20) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    webhook_url TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela principal de leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    origem_id INTEGER REFERENCES origens_leads(id),
    vendedor_id INTEGER REFERENCES vendedores(id),
    status VARCHAR(50) DEFAULT 'novo',
    prioridade VARCHAR(20) DEFAULT 'normal', -- baixa, normal, alta, urgente
    interesse TEXT,
    observacoes TEXT,
    valor_estimado DECIMAL(12,2),
    data_primeiro_contato TIMESTAMP,
    data_ultimo_contato TIMESTAMP,
    data_conversao TIMESTAMP,
    data_follow_up TIMESTAMP,
    convertido BOOLEAN DEFAULT false,
    veiculo_interesse_id INTEGER REFERENCES veiculos(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de etapas do pipeline
CREATE TABLE IF NOT EXISTS pipeline_etapas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ordem INTEGER NOT NULL,
    cor VARCHAR(20) DEFAULT '#6B7280',
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico do pipeline
CREATE TABLE IF NOT EXISTS leads_pipeline (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    etapa_id INTEGER REFERENCES pipeline_etapas(id),
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_saida TIMESTAMP,
    observacoes TEXT,
    criado_por INTEGER REFERENCES vendedores(id)
);

-- Tabela de interações/conversas
CREATE TABLE IF NOT EXISTS leads_interacoes (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    vendedor_id INTEGER REFERENCES vendedores(id),
    tipo VARCHAR(50) NOT NULL, -- call, whatsapp, email, visit, etc
    direção VARCHAR(20) DEFAULT 'outbound', -- inbound, outbound
    conteudo TEXT,
    data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracao_minutos INTEGER,
    resultado VARCHAR(100),
    proxima_acao VARCHAR(200),
    data_proxima_acao TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de métricas de leads por vendedor/período
CREATE TABLE IF NOT EXISTS leads_metricas (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER REFERENCES vendedores(id),
    origem_id INTEGER REFERENCES origens_leads(id),
    periodo DATE NOT NULL, -- YYYY-MM-01 para métricas mensais
    leads_recebidos INTEGER DEFAULT 0,
    leads_contactados INTEGER DEFAULT 0,
    leads_convertidos INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0,
    tempo_medio_conversao_dias DECIMAL(5,1) DEFAULT 0,
    valor_total_convertido DECIMAL(12,2) DEFAULT 0,
    ticket_medio DECIMAL(12,2) DEFAULT 0,
    follow_ups_realizados INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vendedor_id, origem_id, periodo)
);

-- =====================================================
-- INSERÇÃO DE DADOS INICIAIS
-- =====================================================

-- Origens dos leads
INSERT INTO origens_leads (nome, slug, cor, icone) VALUES
('WhatsApp', 'whatsapp', '#25D366', '💬'),
('Instagram', 'instagram', '#E4405F', '📷'),
('Facebook', 'facebook', '#1877F2', '👥'),
('Site', 'site', '#6366F1', '🌐'),
('Indicação', 'indicacao', '#F59E0B', '🤝'),
('Google Ads', 'google-ads', '#4285F4', '🎯'),
('Stand/Loja', 'loja', '#8B5CF6', '🏪'),
('Telefone', 'telefone', '#EF4444', '📞')
ON CONFLICT (slug) DO NOTHING;

-- Etapas do pipeline
INSERT INTO pipeline_etapas (nome, ordem, cor, descricao) VALUES
('Novo Lead', 1, '#6B7280', 'Lead recém chegado, aguardando primeiro contato'),
('Contato Inicial', 2, '#3B82F6', 'Primeiro contato realizado, qualificando interesse'),
('Negociação', 3, '#F59E0B', 'Lead interessado, discutindo condições'),
('Proposta Enviada', 4, '#F97316', 'Proposta formal enviada, aguardando resposta'),
('Fechamento', 5, '#10B981', 'Negociação avançada, prestes a fechar'),
('Convertido', 6, '#059669', 'Lead convertido em venda'),
('Perdido', 7, '#EF4444', 'Lead perdido ou desistiu')
ON CONFLICT DO NOTHING;

-- =====================================================
-- INSERÇÃO DE DADOS MOCK REALISTAS
-- =====================================================

-- Leads de exemplo (últimos 30 dias)
INSERT INTO leads (nome, telefone, email, origem_id, vendedor_id, status, prioridade, interesse, valor_estimado, data_primeiro_contato, data_ultimo_contato, convertido) VALUES
-- Leads do WhatsApp
('Maria Silva Santos', '(11) 99999-2001', 'maria.silva@email.com', 1, 1, 'negociacao', 'alta', 'SUV para família', 85000, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
('João Pedro Costa', '(11) 99999-2002', 'joao.costa@email.com', 1, 2, 'convertido', 'normal', 'Sedan executivo', 120000, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '3 days', true),
('Ana Carolina Lima', '(11) 99999-2003', 'ana.lima@email.com', 1, 1, 'proposta', 'alta', 'Hatch compacto', 45000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
('Roberto Machado Jr', '(11) 99999-2004', null, 1, 3, 'contato_inicial', 'normal', 'Picape', 75000, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', false),

-- Leads do Instagram
('Fernanda Oliveira', '(11) 99999-2005', 'fernanda@email.com', 2, 2, 'negociacao', 'normal', 'SUV Premium', 180000, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 days', false),
('Carlos Eduardo', '(11) 99999-2006', null, 2, 4, 'novo', 'baixa', 'Primeiro carro', 35000, CURRENT_TIMESTAMP - INTERVAL '6 hours', null, false),
('Patricia Santos', '(11) 99999-2007', 'patricia.s@email.com', 2, 1, 'perdido', 'normal', 'Sedan', 65000, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '15 days', false),

-- Leads do Facebook
('Marcos Vinícius', '(11) 99999-2008', 'marcos.v@email.com', 3, 3, 'fechamento', 'alta', 'Esportivo', 350000, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
('Juliana Ferreira', '(11) 99999-2009', 'ju.ferreira@email.com', 3, 5, 'contato_inicial', 'normal', 'SUV familiar', 95000, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days', false),

-- Leads do Site
('Ricardo Almeida', '(11) 99999-2010', 'ricardo.almeida@email.com', 4, 2, 'convertido', 'normal', 'Sedan premium', 275000, CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '5 days', true),
('Camila Torres', '(11) 99999-2011', 'camila.torres@email.com', 4, 6, 'negociacao', 'alta', 'Hatch premium', 55000, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false),

-- Leads de Indicação
('Bruno Henrique', '(11) 99999-2012', null, 5, 1, 'proposta', 'alta', 'SUV de luxo', 420000, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
('Larissa Mendes', '(11) 99999-2013', 'larissa.m@email.com', 5, 4, 'contato_inicial', 'normal', 'Compacto', 42000, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', false);

-- Pipeline dos leads (história)
INSERT INTO leads_pipeline (lead_id, etapa_id, data_entrada, data_saida, criado_por) VALUES
-- Maria Silva (ID 1) - Atualmente em negociação
(1, 1, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '2 hours', 1),
(1, 2, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 day', 1),
(1, 3, CURRENT_TIMESTAMP - INTERVAL '1 day', null, 1),

-- João Pedro (ID 2) - Convertido
(2, 1, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 2),
(2, 2, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 2),
(2, 3, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '7 days', 2),
(2, 4, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '4 days', 2),
(2, 5, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 2),
(2, 6, CURRENT_TIMESTAMP - INTERVAL '3 days', null, 2);

-- Interações de exemplo
INSERT INTO leads_interacoes (lead_id, vendedor_id, tipo, direção, conteudo, data_interacao, duracao_minutos, resultado, proxima_acao, data_proxima_acao) VALUES
(1, 1, 'whatsapp', 'inbound', 'Cliente interessada em SUV para família com 3 filhos', CURRENT_TIMESTAMP - INTERVAL '2 days', null, 'Interesse confirmado', 'Agendar test drive', CURRENT_TIMESTAMP + INTERVAL '1 day'),
(1, 1, 'call', 'outbound', 'Ligação para detalhar opções de SUV. Cliente quer financiamento.', CURRENT_TIMESTAMP - INTERVAL '1 day', 15, 'Negociando condições', 'Enviar simulação financiamento', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
(2, 2, 'whatsapp', 'inbound', 'Cliente quer sedan executivo para trabalho', CURRENT_TIMESTAMP - INTERVAL '15 days', null, 'Qualificado', 'Apresentar opções', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(2, 2, 'visit', 'inbound', 'Cliente visitou loja e fez test drive do Mercedes C200', CURRENT_TIMESTAMP - INTERVAL '10 days', 60, 'Muito interessado', 'Preparar proposta', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(2, 2, 'call', 'outbound', 'Proposta aceita! Cliente confirmou compra.', CURRENT_TIMESTAMP - INTERVAL '3 days', 20, 'Venda confirmada', 'Documentação', null);

-- =====================================================
-- VIEWS PARA DASHBOARD DE LEADS
-- =====================================================

-- View para dashboard consolidado de leads
CREATE OR REPLACE VIEW dashboard_leads AS
WITH leads_stats AS (
    SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE DATE(criado_em) = CURRENT_DATE) as leads_hoje,
        COUNT(*) FILTER (WHERE convertido = true) as conversoes_total,
        COUNT(*) FILTER (WHERE convertido = true AND DATE(data_conversao) >= DATE_TRUNC('month', CURRENT_DATE)) as conversoes_mes,
        ROUND(
            (COUNT(*) FILTER (WHERE convertido = true)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
            1
        ) as taxa_conversao,
        COUNT(*) FILTER (WHERE data_follow_up <= CURRENT_TIMESTAMP AND convertido = false) as follow_ups_pendentes
    FROM leads 
    WHERE criado_em >= DATE_TRUNC('month', CURRENT_DATE)
),
origem_stats AS (
    SELECT 
        ol.nome,
        ol.cor,
        COUNT(l.id) as leads,
        COUNT(l.id) FILTER (WHERE l.convertido = true) as conversoes,
        ROUND(
            (COUNT(l.id) FILTER (WHERE l.convertido = true)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100, 
            1
        ) as taxa_conversao
    FROM origens_leads ol
    LEFT JOIN leads l ON ol.id = l.origem_id 
        AND l.criado_em >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE ol.ativo = true
    GROUP BY ol.id, ol.nome, ol.cor
    ORDER BY leads DESC
),
pipeline_stats AS (
    SELECT 
        pe.nome as etapa,
        pe.cor,
        pe.ordem,
        COUNT(lp.id) as quantidade
    FROM pipeline_etapas pe
    LEFT JOIN leads_pipeline lp ON pe.id = lp.etapa_id 
        AND lp.data_saida IS NULL
    WHERE pe.ativo = true
    GROUP BY pe.id, pe.nome, pe.cor, pe.ordem
    ORDER BY pe.ordem
)
SELECT 
    'dashboard' as tipo,
    (SELECT row_to_json(leads_stats) FROM leads_stats) as resumo,
    (SELECT json_agg(origem_stats) FROM origem_stats) as origens,
    (SELECT json_agg(pipeline_stats) FROM pipeline_stats) as pipeline;

-- View para alertas de follow-up
CREATE OR REPLACE VIEW alertas_followup AS
SELECT 
    l.id,
    l.nome as cliente,
    l.telefone,
    CASE 
        WHEN li.tipo = 'whatsapp' THEN 'WhatsApp'
        WHEN li.tipo = 'call' THEN 'Ligação'
        WHEN li.tipo = 'email' THEN 'E-mail'
        ELSE 'Contato'
    END as tipo_ultimo_contato,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - GREATEST(l.data_ultimo_contato, l.data_follow_up)))::INTEGER / 3600 as horas_pendente,
    CASE 
        WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - GREATEST(l.data_ultimo_contato, l.data_follow_up)))::INTEGER / 3600 <= 24 THEN 'baixa'
        WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - GREATEST(l.data_ultimo_contato, l.data_follow_up)))::INTEGER / 3600 <= 48 THEN 'media'
        ELSE 'alta'
    END as urgencia,
    li.proxima_acao,
    v.nome as vendedor
FROM leads l
JOIN vendedores v ON l.vendedor_id = v.id
LEFT JOIN LATERAL (
    SELECT tipo, proxima_acao
    FROM leads_interacoes 
    WHERE lead_id = l.id 
    ORDER BY data_interacao DESC 
    LIMIT 1
) li ON true
WHERE l.convertido = false 
    AND (l.data_follow_up <= CURRENT_TIMESTAMP OR l.data_ultimo_contato <= CURRENT_TIMESTAMP - INTERVAL '2 days')
ORDER BY horas_pendente DESC
LIMIT 10;

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÕES AUTOMÁTICAS
-- =====================================================

-- Trigger para atualizar data de atualização
CREATE OR REPLACE FUNCTION update_leads_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_update_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_timestamp();

-- Trigger para atualizar métricas quando lead é convertido
CREATE OR REPLACE FUNCTION update_leads_metricas()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.convertido = false AND NEW.convertido = true THEN
        -- Atualizar métricas do vendedor
        INSERT INTO leads_metricas (
            vendedor_id, 
            origem_id, 
            periodo,
            leads_convertidos,
            valor_total_convertido
        ) VALUES (
            NEW.vendedor_id,
            NEW.origem_id,
            DATE_TRUNC('month', CURRENT_DATE),
            1,
            COALESCE(NEW.valor_estimado, 0)
        )
        ON CONFLICT (vendedor_id, origem_id, periodo) 
        DO UPDATE SET
            leads_convertidos = leads_metricas.leads_convertidos + 1,
            valor_total_convertido = leads_metricas.valor_total_convertido + COALESCE(NEW.valor_estimado, 0),
            taxa_conversao = ROUND(
                (leads_metricas.leads_convertidos + 1)::DECIMAL / 
                NULLIF((SELECT COUNT(*) FROM leads WHERE vendedor_id = NEW.vendedor_id AND origem_id = NEW.origem_id AND DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', CURRENT_DATE)), 0) * 100,
                2
            ),
            ticket_medio = ROUND(
                (leads_metricas.valor_total_convertido + COALESCE(NEW.valor_estimado, 0)) / 
                NULLIF(leads_metricas.leads_convertidos + 1, 0),
                2
            ),
            atualizado_em = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_conversion_metrics
    AFTER UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_metricas();

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON leads(origem_id);
CREATE INDEX IF NOT EXISTS idx_leads_vendedor ON leads(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_leads_data_criacao ON leads(criado_em);
CREATE INDEX IF NOT EXISTS idx_leads_convertido ON leads(convertido);
CREATE INDEX IF NOT EXISTS idx_leads_followup ON leads(data_follow_up) WHERE convertido = false;
CREATE INDEX IF NOT EXISTS idx_pipeline_lead ON leads_pipeline(lead_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_lead ON leads_interacoes(lead_id);
CREATE INDEX IF NOT EXISTS idx_metricas_vendedor_periodo ON leads_metricas(vendedor_id, periodo);