-- V8 System - RESET COMPLETO E SETUP LIMPO
-- Este script REMOVE tudo e recria do zero

-- ==========================================
-- PARTE 1: LIMPAR TUDO (RESET COMPLETO)
-- ==========================================

-- Remover triggers se existirem
DROP TRIGGER IF EXISTS trigger_veiculo_update ON veiculos;

-- Remover funções se existirem
DROP FUNCTION IF EXISTS trigger_atualizar_veiculo() CASCADE;
DROP FUNCTION IF EXISTS calcular_classe_social(DECIMAL) CASCADE;
DROP FUNCTION IF EXISTS calcular_dias_estoque(VARCHAR, DATE, DATE) CASCADE;

-- Remover views se existirem
DROP VIEW IF EXISTS dashboard_estoque CASCADE;

-- Remover políticas RLS se existirem
DROP POLICY IF EXISTS "public_read_loja" ON loja_info;
DROP POLICY IF EXISTS "public_read_classes" ON classes_config;
DROP POLICY IF EXISTS "public_read_categorias" ON categorias;
DROP POLICY IF EXISTS "public_read_veiculos" ON veiculos;
DROP POLICY IF EXISTS "public_read_fotos" ON veiculo_fotos;
DROP POLICY IF EXISTS "dev_all_loja" ON loja_info;
DROP POLICY IF EXISTS "dev_all_classes" ON classes_config;
DROP POLICY IF EXISTS "dev_all_categorias" ON categorias;
DROP POLICY IF EXISTS "dev_all_veiculos" ON veiculos;
DROP POLICY IF EXISTS "dev_all_fotos" ON veiculo_fotos;
DROP POLICY IF EXISTS "Enable all operations for all users" ON loja_info;
DROP POLICY IF EXISTS "Enable all operations for all users" ON classes_config;
DROP POLICY IF EXISTS "Enable all operations for all users" ON categorias;
DROP POLICY IF EXISTS "Enable all operations for all users" ON veiculos;
DROP POLICY IF EXISTS "Enable all operations for all users" ON veiculo_fotos;

-- Remover tabelas
DROP TABLE IF EXISTS veiculo_fotos CASCADE;
DROP TABLE IF EXISTS veiculos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS classes_config CASCADE;
DROP TABLE IF EXISTS loja_info CASCADE;

-- ==========================================
-- PARTE 2: CRIAR ESTRUTURA LIMPA
-- ==========================================

-- Configuração da loja
CREATE TABLE loja_info (
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
CREATE TABLE classes_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    classe_a_min DECIMAL(10,2) NOT NULL DEFAULT 80000,
    classe_b_min DECIMAL(10,2) NOT NULL DEFAULT 40000,
    classe_c_min DECIMAL(10,2) NOT NULL DEFAULT 20000,
    classe_d_max DECIMAL(10,2) NOT NULL DEFAULT 19999,
    atualizado_em TIMESTAMP DEFAULT NOW(),
    CHECK (id = 1)
);

-- Categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icone VARCHAR(10),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- Veículos (SEM TRIGGERS!)
CREATE TABLE veiculos (
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
    CONSTRAINT chk_combustivel CHECK (combustivel IN ('flex','gasolina','diesel','eletrico','hibrido')),
    CONSTRAINT chk_cambio CHECK (cambio IN ('manual','automatico','cvt')),
    CONSTRAINT chk_status CHECK (status IN ('disponivel','reservado','vendido')),
    CONSTRAINT chk_classe CHECK (classe_social IN ('A','B','C','D'))
);

-- Fotos
CREATE TABLE veiculo_fotos (
    id SERIAL PRIMARY KEY,
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'galeria',
    ordem INTEGER DEFAULT 0,
    url_thumb VARCHAR(500),
    url_medium VARCHAR(500),
    processada BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_tipo CHECK (tipo IN ('principal','galeria','vitrine'))
);

-- ==========================================
-- PARTE 3: CRIAR ÍNDICES
-- ==========================================

CREATE INDEX idx_categorias_ordem ON categorias(ordem);
CREATE INDEX idx_categorias_slug ON categorias(slug);
CREATE INDEX idx_veiculos_status ON veiculos(status);
CREATE INDEX idx_veiculos_marca ON veiculos(marca);
CREATE INDEX idx_veiculos_classe ON veiculos(classe_social);
CREATE INDEX idx_veiculos_valor ON veiculos(valor);

-- ==========================================
-- PARTE 4: INSERIR DADOS
-- ==========================================

-- Configuração inicial
INSERT INTO loja_info (id, nome, cnpj, telefone, email, endereco, cidade, estado) 
VALUES (1, 'V8 System Estoque', '12345678000199', '(11) 99999-9999', 'contato@v8system.com.br', 
        'Rua das Montadoras, 123', 'São Paulo', 'SP');

INSERT INTO classes_config (id, classe_a_min, classe_b_min, classe_c_min, classe_d_max)
VALUES (1, 80000, 40000, 20000, 19999);

-- Categorias
INSERT INTO categorias (nome, slug, icone, ordem) VALUES
('Hatch', 'hatch', '🚗', 1),
('Sedan', 'sedan', '🚙', 2),
('SUV', 'suv', '🚐', 3),
('Picape', 'picape', '🛻', 4),
('Utilitário', 'utilitario', '🚚', 5),
('Esportivo', 'esportivo', '🏎️', 6),
('Conversível', 'conversivel', '🏁', 7);

-- ==========================================
-- PARTE 5: INSERIR VEÍCULOS
-- ==========================================

-- Inserir veículos diretamente com IDs fixos das categorias
-- CLASSE A (Acima de 80k)
INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
('BMW', 'X5 xDrive30d', 2023, 450000, 3, 'A', 15000, 'Preto', 'diesel', 'automatico', 5, 'ABC1234', 'BMW001', 'SUV premium, revisões em dia'),
('Mercedes-Benz', 'C300 AMG', 2022, 320000, 2, 'A', 25000, 'Prata', 'gasolina', 'automatico', 4, 'DEF5678', 'MB001', 'Sedan esportivo, impecável'),
('Audi', 'A4 Avant', 2023, 280000, 2, 'A', 8000, 'Branco', 'flex', 'automatico', 4, 'GHI9012', 'AUDI001', 'Perfeito estado, único dono'),
('Porsche', '911 Carrera', 2021, 850000, 6, 'A', 12000, 'Amarelo', 'gasolina', 'automatico', 2, 'JKL3456', 'POR001', 'Esportivo icônico');

-- CLASSE B (40k a 80k)
INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
('Toyota', 'Corolla Altis', 2022, 65000, 2, 'B', 35000, 'Prata', 'flex', 'cvt', 4, 'MNO7890', 'TOY001', 'Híbrido, economia excepcional'),
('Honda', 'Civic Touring', 2023, 75000, 2, 'B', 18000, 'Preto', 'flex', 'cvt', 4, 'PQR1234', 'HON001', 'Sedã premium nacional'),
('Volkswagen', 'Tiguan Allspace', 2022, 78000, 3, 'B', 28000, 'Cinza', 'flex', 'automatico', 5, 'STU5678', 'VW001', 'SUV familiar, 7 lugares'),
('Nissan', 'Frontier LE', 2023, 72000, 4, 'B', 22000, 'Vermelho', 'diesel', 'automatico', 4, 'VWX9012', 'NIS001', 'Picape robusta, 4x4');

-- CLASSE C (20k a 40k)
INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
('Chevrolet', 'Onix Premier', 2021, 38000, 1, 'C', 45000, 'Branco', 'flex', 'automatico', 4, 'YZA3456', 'CHE001', 'Hatch completo, econômico'),
('Hyundai', 'HB20S Evolution', 2022, 35000, 2, 'C', 32000, 'Azul', 'flex', 'manual', 4, 'BCD7890', 'HYU001', 'Sedã compacto, bem cuidado'),
('Ford', 'EcoSport Titanium', 2020, 32000, 3, 'C', 55000, 'Cinza', 'flex', 'automatico', 5, 'EFG1234', 'FOR001', 'SUV compacto urbano'),
('Renault', 'Duster Intense', 2021, 36000, 3, 'C', 48000, 'Verde', 'flex', 'manual', 5, 'HIJ5678', 'REN001', 'SUV aventureiro, 4x4');

-- CLASSE D (Até 20k)
INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, classe_social, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) VALUES
('Volkswagen', 'Gol 1.0', 2018, 18000, 1, 'D', 78000, 'Branco', 'flex', 'manual', 4, 'KLM9012', 'VW002', 'Econômico, ideal primeiro carro'),
('Fiat', 'Uno Attractive', 2019, 16500, 1, 'D', 65000, 'Prata', 'flex', 'manual', 4, 'NOP3456', 'FIA001', 'Compacto urbano'),
('Ford', 'Ka SE 1.0', 2017, 19500, 1, 'D', 85000, 'Azul', 'flex', 'manual', 4, 'QRS7890', 'FOR002', 'Ágil e econômico'),
('Chevrolet', 'Celta LT', 2016, 15000, 1, 'D', 92000, 'Vermelho', 'flex', 'manual', 4, 'TUV1234', 'CHE002', 'Básico e confiável');

-- Atualizar dias em estoque (cálculo simples)
UPDATE veiculos 
SET dias_estoque = (CURRENT_DATE - data_entrada);

-- Simular vendas e reservas
UPDATE veiculos 
SET status = 'vendido', 
    data_venda = CURRENT_DATE - INTERVAL '15 days',
    dias_estoque = 15
WHERE codigo_interno IN ('CHE002', 'FOR002');

UPDATE veiculos 
SET status = 'reservado' 
WHERE codigo_interno IN ('BMW001', 'TOY001');

-- ==========================================
-- PARTE 6: HABILITAR RLS
-- ==========================================

ALTER TABLE loja_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculo_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas abertas para desenvolvimento
CREATE POLICY "allow_all_loja" ON loja_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classes" ON classes_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_categorias" ON categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_veiculos" ON veiculos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_fotos" ON veiculo_fotos FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- PARTE 7: RESULTADO FINAL
-- ==========================================

SELECT 
    'Setup concluído!' as status,
    COUNT(*) as total_veiculos,
    COUNT(DISTINCT marca) as total_marcas,
    COUNT(CASE WHEN status = 'disponivel' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN status = 'reservado' THEN 1 END) as reservados,
    COUNT(CASE WHEN status = 'vendido' THEN 1 END) as vendidos
FROM veiculos;