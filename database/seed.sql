-- V8 System - Dados Iniciais (Seed Data)

-- Configuração inicial da loja
INSERT INTO loja_info (nome, cnpj, telefone, email, endereco, cidade, estado) 
VALUES (
    'V8 System Estoque',
    '12345678000199',
    '(11) 99999-9999',
    'contato@v8system.com.br',
    'Rua das Montadoras, 123',
    'São Paulo',
    'SP'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    atualizado_em = NOW();

-- Configuração das classes sociais
INSERT INTO classes_config (classe_a_min, classe_b_min, classe_c_min, classe_d_max)
VALUES (80000, 40000, 20000, 19999)
ON CONFLICT (id) DO UPDATE SET
    classe_a_min = EXCLUDED.classe_a_min,
    classe_b_min = EXCLUDED.classe_b_min,
    classe_c_min = EXCLUDED.classe_c_min,
    classe_d_max = EXCLUDED.classe_d_max,
    atualizado_em = NOW();

-- Dados iniciais das categorias
INSERT INTO categorias (nome, slug, icone, ordem) VALUES
('Hatch', 'hatch', '🚗', 1),
('Sedan', 'sedan', '🚙', 2),
('SUV', 'suv', '🚐', 3),
('Picape', 'picape', '🛻', 4),
('Utilitário', 'utilitario', '🚚', 5),
('Esportivo', 'esportivo', '🏎️', 6),
('Conversível', 'conversivel', '🏁', 7)
ON CONFLICT (slug) DO UPDATE SET
    nome = EXCLUDED.nome,
    icone = EXCLUDED.icone,
    ordem = EXCLUDED.ordem;

-- Veículos de exemplo para desenvolvimento
INSERT INTO veiculos (marca, modelo, ano, valor, categoria_id, km, cor, combustivel, cambio, portas, placa, codigo_interno, observacoes) 
VALUES 
    -- CLASSE A (Acima de R$ 80k)
    ('BMW', 'X5 xDrive30d', 2023, 450000, 3, 15000, 'Preto', 'diesel', 'automatico', 5, 'ABC1234', 'BMW001', 'SUV premium, revisões em dia'),
    ('Mercedes-Benz', 'C300 AMG', 2022, 320000, 2, 25000, 'Prata', 'gasolina', 'automatico', 4, 'DEF5678', 'MB001', 'Sedan esportivo, impecável'),
    ('Audi', 'A4 Avant', 2023, 280000, 2, 8000, 'Branco', 'flex', 'automatico', 4, 'GHI9012', 'AUDI001', 'Perfeito estado, único dono'),
    ('Porsche', '911 Carrera', 2021, 850000, 6, 12000, 'Amarelo', 'gasolina', 'automatico', 2, 'JKL3456', 'POR001', 'Esportivo icônico'),
    
    -- CLASSE B (R$ 40k - R$ 80k)
    ('Toyota', 'Corolla Altis', 2022, 65000, 2, 35000, 'Prata', 'flex', 'cvt', 4, 'MNO7890', 'TOY001', 'Híbrido, economia excepcional'),
    ('Honda', 'Civic Touring', 2023, 75000, 2, 18000, 'Preto', 'flex', 'cvt', 4, 'PQR1234', 'HON001', 'Sedã premium nacional'),
    ('Volkswagen', 'Tiguan Allspace', 2022, 78000, 3, 28000, 'Cinza', 'flex', 'automatico', 5, 'STU5678', 'VW001', 'SUV familiar, 7 lugares'),
    ('Nissan', 'Frontier LE', 2023, 72000, 4, 22000, 'Vermelho', 'diesel', 'automatico', 4, 'VWX9012', 'NIS001', 'Picape robusta, 4x4'),
    
    -- CLASSE C (R$ 20k - R$ 40k)
    ('Chevrolet', 'Onix Premier', 2021, 38000, 1, 45000, 'Branco', 'flex', 'automatico', 4, 'YZA3456', 'CHE001', 'Hatch completo, econômico'),
    ('Hyundai', 'HB20S Evolution', 2022, 35000, 2, 32000, 'Azul', 'flex', 'manual', 4, 'BCD7890', 'HYU001', 'Sedã compacto, bem cuidado'),
    ('Ford', 'EcoSport Titanium', 2020, 32000, 3, 55000, 'Cinza', 'flex', 'automatico', 5, 'EFG1234', 'FOR001', 'SUV compacto urbano'),
    ('Renault', 'Duster Intense', 2021, 36000, 3, 48000, 'Verde', 'flex', 'manual', 5, 'HIJ5678', 'REN001', 'SUV aventureiro, 4x4'),
    
    -- CLASSE D (Até R$ 20k)
    ('Volkswagen', 'Gol 1.0', 2018, 18000, 1, 78000, 'Branco', 'flex', 'manual', 4, 'KLM9012', 'VW002', 'Econômico, ideal primeiro carro'),
    ('Fiat', 'Uno Attractive', 2019, 16500, 1, 65000, 'Prata', 'flex', 'manual', 4, 'NOP3456', 'FIA001', 'Compacto urbano'),
    ('Ford', 'Ka SE 1.0', 2017, 19500, 1, 85000, 'Azul', 'flex', 'manual', 4, 'QRS7890', 'FOR002', 'Ágil e econômico'),
    ('Chevrolet', 'Celta LT', 2016, 15000, 1, 92000, 'Vermelho', 'flex', 'manual', 4, 'TUV1234', 'CHE002', 'Básico e confiável');

-- Simular algumas vendas para demonstração
UPDATE veiculos 
SET status = 'vendido', data_venda = CURRENT_DATE - INTERVAL '15 days'
WHERE codigo_interno IN ('CHE002', 'FOR002');

UPDATE veiculos 
SET status = 'reservado'
WHERE codigo_interno IN ('BMW001', 'TOY001');