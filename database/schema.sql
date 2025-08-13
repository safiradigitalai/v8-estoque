-- V8 System - Schema Completo do Banco de Dados
-- PostgreSQL/Supabase optimized

-- Configuração da loja (singleton)
CREATE TABLE IF NOT EXISTS loja_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(14),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    cidade VARCHAR(50),
    estado CHAR(2),
    logo_url VARCHAR(500),
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (id = 1)
);

-- Habilitar RLS
ALTER TABLE loja_info ENABLE ROW LEVEL SECURITY;

-- Classes socioeconômicas (configurável)
CREATE TABLE IF NOT EXISTS classes_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    classe_a_min DECIMAL(10,2) NOT NULL DEFAULT 80000,
    classe_b_min DECIMAL(10,2) NOT NULL DEFAULT 40000,
    classe_c_min DECIMAL(10,2) NOT NULL DEFAULT 20000,
    classe_d_max DECIMAL(10,2) NOT NULL DEFAULT 19999,
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (id = 1)
);

-- Habilitar RLS
ALTER TABLE classes_config ENABLE ROW LEVEL SECURITY;

-- Categorias de veículos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icone VARCHAR(10), -- emoji
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_ordem ON categorias(ordem);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);

-- Habilitar RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Entidade principal - veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id SERIAL PRIMARY KEY,
    
    -- Dados obrigatórios
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    
    -- Classificação automática (será calculada via trigger)
    classe_social CHAR(1) DEFAULT 'D',
    
    -- Dados complementares
    km INTEGER DEFAULT 0,
    cor VARCHAR(30),
    combustivel VARCHAR(20) DEFAULT 'flex',
    cambio VARCHAR(20) DEFAULT 'manual',
    portas INTEGER DEFAULT 4,
    placa VARCHAR(8),
    
    -- Status operacional
    status VARCHAR(20) DEFAULT 'disponivel',
    codigo_interno VARCHAR(50) UNIQUE,
    observacoes TEXT,
    
    -- Controle temporal
    data_entrada DATE DEFAULT CURRENT_DATE,
    data_venda DATE NULL,
    dias_estoque INTEGER DEFAULT 0,
    
    -- Metadados
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (combustivel IN ('flex','gasolina','diesel','eletrico','hibrido')),
    CHECK (cambio IN ('manual','automatico','cvt')),
    CHECK (status IN ('disponivel','reservado','vendido')),
    CHECK (classe_social IN ('A','B','C','D')),
    CHECK (ano >= 1990 AND ano <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CHECK (valor > 0)
);

-- Índices otimizados para queries
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(status);
CREATE INDEX IF NOT EXISTS idx_veiculos_marca_categoria ON veiculos(marca, categoria_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_classe_social ON veiculos(classe_social);
CREATE INDEX IF NOT EXISTS idx_veiculos_valor_range ON veiculos(valor);
CREATE INDEX IF NOT EXISTS idx_veiculos_dashboard ON veiculos(status, marca, categoria_id, classe_social);

-- Habilitar RLS
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

-- Fotos dos veículos
CREATE TABLE IF NOT EXISTS veiculo_fotos (
    id SERIAL PRIMARY KEY,
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'galeria',
    ordem INTEGER DEFAULT 0,
    
    -- Otimização imagem
    url_thumb VARCHAR(500),
    url_medium VARCHAR(500),
    processada BOOLEAN DEFAULT false,
    
    criado_em TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (tipo IN ('principal','galeria','vitrine'))
);

-- Índices para fotos
CREATE INDEX IF NOT EXISTS idx_veiculo_fotos_veiculo_tipo ON veiculo_fotos(veiculo_id, tipo);
CREATE UNIQUE INDEX IF NOT EXISTS idx_veiculo_fotos_principal ON veiculo_fotos(veiculo_id) WHERE tipo = 'principal';

-- Habilitar RLS
ALTER TABLE veiculo_fotos ENABLE ROW LEVEL SECURITY;

-- Função para calcular classe social
CREATE OR REPLACE FUNCTION calcular_classe_social(valor_veiculo DECIMAL)
RETURNS CHAR(1) AS $$
DECLARE
    config classes_config%ROWTYPE;
BEGIN
    SELECT * INTO config FROM classes_config WHERE id = 1;
    
    IF valor_veiculo >= config.classe_a_min THEN
        RETURN 'A';
    ELSIF valor_veiculo >= config.classe_b_min THEN
        RETURN 'B';
    ELSIF valor_veiculo >= config.classe_c_min THEN
        RETURN 'C';
    ELSE
        RETURN 'D';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular dias em estoque
CREATE OR REPLACE FUNCTION calcular_dias_estoque(
    status_veiculo VARCHAR,
    data_entrada DATE,
    data_venda DATE
) RETURNS INTEGER AS $$
BEGIN
    IF status_veiculo = 'vendido' AND data_venda IS NOT NULL THEN
        RETURN EXTRACT(DAY FROM data_venda - data_entrada);
    ELSE
        RETURN EXTRACT(DAY FROM CURRENT_DATE - data_entrada);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar classe social e dias em estoque
CREATE OR REPLACE FUNCTION trigger_atualizar_veiculo()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar classe social
    NEW.classe_social := calcular_classe_social(NEW.valor);
    
    -- Atualizar dias em estoque
    NEW.dias_estoque := calcular_dias_estoque(NEW.status, NEW.data_entrada, NEW.data_venda);
    
    -- Atualizar timestamp
    NEW.atualizado_em := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_veiculo_update ON veiculos;
CREATE TRIGGER trigger_veiculo_update
    BEFORE INSERT OR UPDATE ON veiculos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_atualizar_veiculo();

-- View otimizada para dashboard (query principal)
CREATE OR REPLACE VIEW dashboard_estoque AS
SELECT 
    v.id,
    v.marca,
    v.modelo,
    v.ano,
    v.valor,
    v.classe_social,
    v.status,
    v.dias_estoque,
    c.nome as categoria_nome,
    c.slug as categoria_slug,
    c.icone as categoria_icone,
    fp.url as foto_principal,
    fp.url_thumb as foto_thumb
FROM veiculos v
JOIN categorias c ON v.categoria_id = c.id
LEFT JOIN veiculo_fotos fp ON v.id = fp.veiculo_id AND fp.tipo = 'principal'
WHERE v.status IN ('disponivel', 'reservado')
ORDER BY v.marca, c.ordem, v.valor DESC;

-- Políticas RLS (Row Level Security)
-- Para simplificar desenvolvimento inicial, permitir acesso total
-- Em produção, implementar políticas baseadas em usuários/roles

CREATE POLICY "Enable all operations for all users" ON loja_info FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON classes_config FOR ALL USING (true);  
CREATE POLICY "Enable all operations for all users" ON categorias FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON veiculos FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON veiculo_fotos FOR ALL USING (true);

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('veiculo-fotos', 'veiculo-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para fotos
CREATE POLICY "Enable all operations on veiculo-fotos bucket" ON storage.objects
FOR ALL USING (bucket_id = 'veiculo-fotos');