-- V8 System - Setup Completo Simplificado
-- Execute este arquivo completo no SQL Editor do Supabase

-- 1. CRIAR TABELAS BASE
-- =====================

-- Configuração da loja
CREATE TABLE IF NOT EXISTS loja_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nome VARCHAR(100) NOT NULL DEFAULT 'V8 System Estoque',
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

-- Classes socioeconômicas
CREATE TABLE IF NOT EXISTS classes_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    classe_a_min DECIMAL(10,2) NOT NULL DEFAULT 80000,
    classe_b_min DECIMAL(10,2) NOT NULL DEFAULT 40000,
    classe_c_min DECIMAL(10,2) NOT NULL DEFAULT 20000,
    classe_d_max DECIMAL(10,2) NOT NULL DEFAULT 19999,
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (id = 1)
);

-- Categorias de veículos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icone VARCHAR(10),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- Veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    classe_social CHAR(1) DEFAULT 'D',
    km INTEGER DEFAULT 0,
    cor VARCHAR(30),
    combustivel VARCHAR(20) DEFAULT 'flex',
    cambio VARCHAR(20) DEFAULT 'manual',
    portas INTEGER DEFAULT 4,
    placa VARCHAR(8),
    status VARCHAR(20) DEFAULT 'disponivel',
    codigo_interno VARCHAR(50) UNIQUE,
    observacoes TEXT,
    data_entrada DATE DEFAULT CURRENT_DATE,
    data_venda DATE NULL,
    dias_estoque INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (combustivel IN ('flex','gasolina','diesel','eletrico','hibrido')),
    CHECK (cambio IN ('manual','automatico','cvt')),
    CHECK (status IN ('disponivel','reservado','vendido')),
    CHECK (classe_social IN ('A','B','C','D'))
);

-- Fotos dos veículos
CREATE TABLE IF NOT EXISTS veiculo_fotos (
    id SERIAL PRIMARY KEY,
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'galeria',
    ordem INTEGER DEFAULT 0,
    url_thumb VARCHAR(500),
    url_medium VARCHAR(500),
    processada BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT NOW(),
    CHECK (tipo IN ('principal','galeria','vitrine'))
);

-- 2. CRIAR ÍNDICES
-- ================

CREATE INDEX IF NOT EXISTS idx_categorias_ordem ON categorias(ordem);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(status);
CREATE INDEX IF NOT EXISTS idx_veiculos_marca_categoria ON veiculos(marca, categoria_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_classe_social ON veiculos(classe_social);
CREATE INDEX IF NOT EXISTS idx_veiculos_valor_range ON veiculos(valor);
CREATE INDEX IF NOT EXISTS idx_veiculo_fotos_veiculo_tipo ON veiculo_fotos(veiculo_id, tipo);

-- 3. INSERIR DADOS INICIAIS
-- =========================

-- Configuração da loja
INSERT INTO loja_info (id, nome, cnpj, telefone, email, endereco, cidade, estado) 
VALUES (
    1,
    'V8 System Estoque',
    '12345678000199',
    '(11) 99999-9999',
    'contato@v8system.com.br',
    'Rua das Montadoras, 123',
    'São Paulo',
    'SP'
) ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome;

-- Configuração das classes
INSERT INTO classes_config (id, classe_a_min, classe_b_min, classe_c_min, classe_d_max)
VALUES (1, 80000, 40000, 20000, 19999)
ON CONFLICT (id) DO UPDATE SET classe_a_min = EXCLUDED.classe_a_min;

-- Categorias
INSERT INTO categorias (nome, slug, icone, ordem) VALUES
('Hatch', 'hatch', '🚗', 1),
('Sedan', 'sedan', '🚙', 2),
('SUV', 'suv', '🚐', 3),
('Picape', 'picape', '🛻', 4),
('Utilitário', 'utilitario', '🚚', 5),
('Esportivo', 'esportivo', '🏎️', 6),
('Conversível', 'conversivel', '🏁', 7)
ON CONFLICT (slug) DO NOTHING;

-- 4. INSERIR VEÍCULOS DE EXEMPLO
-- ===============================

-- Primeiro, vamos obter os IDs das categorias
DO $$
DECLARE
    cat_hatch INTEGER;
    cat_sedan INTEGER;
    cat_suv INTEGER;
    cat_picape INTEGER;
    cat_esportivo INTEGER;
BEGIN
    SELECT id INTO cat_hatch FROM categorias WHERE slug = 'hatch';
    SELECT id INTO cat_sedan FROM categorias WHERE slug = 'sedan';
    SELECT id INTO cat_suv FROM categorias WHERE slug = 'suv';
    SELECT id INTO cat_picape FROM categorias WHERE slug = 'picape';
    SELECT id INTO cat_esportivo FROM categorias WHERE slug = 'esportivo';

    -- Inserir veículos apenas se não existirem
    IF NOT EXISTS (SELECT 1 FROM veiculos WHERE codigo_interno = 'BMW001') THEN
        -- CLASSE A (Acima de R$ 80k)
        INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
        ('BMW', 'X5 xDrive30d', 2023, 450000, cat_suv, 'A', 15000, 'Preto', 'diesel', 'automatico', 5, 'ABC1234', 'BMW001', 'SUV premium, revisões em dia'),
        ('Mercedes-Benz', 'C300 AMG', 2022, 320000, cat_sedan, 'A', 25000, 'Prata', 'gasolina', 'automatico', 4, 'DEF5678', 'MB001', 'Sedan esportivo, impecável'),
        ('Audi', 'A4 Avant', 2023, 280000, cat_sedan, 'A', 8000, 'Branco', 'flex', 'automatico', 4, 'GHI9012', 'AUDI001', 'Perfeito estado, único dono'),
        ('Porsche', '911 Carrera', 2021, 850000, cat_esportivo, 'A', 12000, 'Amarelo', 'gasolina', 'automatico', 2, 'JKL3456', 'POR001', 'Esportivo icônico');
        
        -- CLASSE B (R$ 40k - R$ 80k)
        INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
        ('Toyota', 'Corolla Altis', 2022, 65000, cat_sedan, 'B', 35000, 'Prata', 'flex', 'cvt', 4, 'MNO7890', 'TOY001', 'Híbrido, economia excepcional'),
        ('Honda', 'Civic Touring', 2023, 75000, cat_sedan, 'B', 18000, 'Preto', 'flex', 'cvt', 4, 'PQR1234', 'HON001', 'Sedã premium nacional'),
        ('Volkswagen', 'Tiguan Allspace', 2022, 78000, cat_suv, 'B', 28000, 'Cinza', 'flex', 'automatico', 5, 'STU5678', 'VW001', 'SUV familiar, 7 lugares'),
        ('Nissan', 'Frontier LE', 2023, 72000, cat_picape, 'B', 22000, 'Vermelho', 'diesel', 'automatico', 4, 'VWX9012', 'NIS001', 'Picape robusta, 4x4');
        
        -- CLASSE C (R$ 20k - R$ 40k)
        INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
        ('Chevrolet', 'Onix Premier', 2021, 38000, cat_hatch, 'C', 45000, 'Branco', 'flex', 'automatico', 4, 'YZA3456', 'CHE001', 'Hatch completo, econômico'),
        ('Hyundai', 'HB20S Evolution', 2022, 35000, cat_sedan, 'C', 32000, 'Azul', 'flex', 'manual', 4, 'BCD7890', 'HYU001', 'Sedã compacto, bem cuidado'),
        ('Ford', 'EcoSport Titanium', 2020, 32000, cat_suv, 'C', 55000, 'Cinza', 'flex', 'automatico', 5, 'EFG1234', 'FOR001', 'SUV compacto urbano'),
        ('Renault', 'Duster Intense', 2021, 36000, cat_suv, 'C', 48000, 'Verde', 'flex', 'manual', 5, 'HIJ5678', 'REN001', 'SUV aventureiro, 4x4');
        
        -- CLASSE D (Até R$ 20k)
        INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
        ('Volkswagen', 'Gol 1.0', 2018, 18000, cat_hatch, 'D', 78000, 'Branco', 'flex', 'manual', 4, 'KLM9012', 'VW002', 'Econômico, ideal primeiro carro'),
        ('Fiat', 'Uno Attractive', 2019, 16500, cat_hatch, 'D', 65000, 'Prata', 'flex', 'manual', 4, 'NOP3456', 'FIA001', 'Compacto urbano'),
        ('Ford', 'Ka SE 1.0', 2017, 19500, cat_hatch, 'D', 85000, 'Azul', 'flex', 'manual', 4, 'QRS7890', 'FOR002', 'Ágil e econômico'),
        ('Chevrolet', 'Celta LT', 2016, 15000, cat_hatch, 'D', 92000, 'Vermelho', 'flex', 'manual', 4, 'TUV1234', 'CHE002', 'Básico e confiável');
        
        -- Simular algumas vendas
        UPDATE veiculos SET status = 'vendido', data_venda = CURRENT_DATE - INTERVAL '15 days' WHERE codigo_interno IN ('CHE002', 'FOR002');
        UPDATE veiculos SET status = 'reservado' WHERE codigo_interno IN ('BMW001', 'TOY001');
    END IF;
END $$;

-- 5. ATUALIZAR DIAS EM ESTOQUE
-- =============================

UPDATE veiculos 
SET dias_estoque = CASE 
    WHEN status = 'vendido' AND data_venda IS NOT NULL THEN 
        EXTRACT(DAY FROM data_venda - data_entrada)
    ELSE 
        EXTRACT(DAY FROM CURRENT_DATE - data_entrada)
END;

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
-- ======================================

ALTER TABLE loja_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculo_fotos ENABLE ROW LEVEL SECURITY;

-- Criar políticas públicas temporárias (ajuste conforme necessário)
CREATE POLICY "public_read_loja" ON loja_info FOR SELECT USING (true);
CREATE POLICY "public_read_classes" ON classes_config FOR SELECT USING (true);
CREATE POLICY "public_read_categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "public_read_veiculos" ON veiculos FOR SELECT USING (true);
CREATE POLICY "public_read_fotos" ON veiculo_fotos FOR SELECT USING (true);

-- Para permitir insert/update/delete, adicione políticas específicas conforme necessário

-- 7. MENSAGEM DE SUCESSO
-- ======================

DO $$
BEGIN
    RAISE NOTICE 'Setup do V8 System concluído com sucesso!';
    RAISE NOTICE 'Tabelas criadas: loja_info, classes_config, categorias, veiculos, veiculo_fotos';
    RAISE NOTICE 'Veículos de exemplo inseridos: 16 unidades (4 por classe social)';
END $$;