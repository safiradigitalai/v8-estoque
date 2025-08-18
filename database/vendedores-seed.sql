-- V8 System - Dados de exemplo para vendedores
-- Seeds realistas para desenvolvimento e demonstração

-- Inserir vendedores de exemplo
INSERT INTO vendedores (nome, email, telefone, foto_url, pontuacao, nivel, meta_mensal, comissao_percentual, especialidades, data_contratacao) VALUES
-- Top performers
('Carlos Silva', 'carlos.silva@v8system.com', '(11) 99999-1001', '/avatars/carlos.jpg', 2850, 'expert', 80000.00, 4.5, ARRAY['Premium', 'SUV', 'Importados'], '2022-03-15'),
('Marina Santos', 'marina.santos@v8system.com', '(11) 99999-1002', '/avatars/marina.jpg', 2620, 'expert', 75000.00, 4.0, ARRAY['Sedan', 'Executivo', 'Híbridos'], '2021-08-10'),
('Ricardo Oliveira', 'ricardo.oliveira@v8system.com', '(11) 99999-1003', '/avatars/ricardo.jpg', 2340, 'avancado', 70000.00, 3.8, ARRAY['Hatchback', 'Compactos', 'Primeiro carro'], '2022-11-20'),

-- Intermediários
('Ana Paula Costa', 'ana.costa@v8system.com', '(11) 99999-1004', '/avatars/ana.jpg', 1980, 'avancado', 65000.00, 3.5, ARRAY['SUV', 'Familiar', 'Segurança'], '2023-02-14'),
('Thiago Fernandes', 'thiago.fernandes@v8system.com', '(11) 99999-1005', '/avatars/thiago.jpg', 1720, 'intermediario', 55000.00, 3.2, ARRAY['Esportivos', 'Performance', 'Jovens'], '2023-05-08'),
('Juliana Ribeiro', 'juliana.ribeiro@v8system.com', '(11) 99999-1006', '/avatars/juliana.jpg', 1580, 'intermediario', 50000.00, 3.0, ARRAY['Econômicos', 'Sustentabilidade', 'Custo-benefício'], '2023-07-22'),

-- Novatos
('Pedro Almeida', 'pedro.almeida@v8system.com', '(11) 99999-1007', '/avatars/pedro.jpg', 890, 'iniciante', 35000.00, 2.5, ARRAY['Básicos', 'Entrada'], '2024-01-10'),
('Camila Torres', 'camila.torres@v8system.com', '(11) 99999-1008', '/avatars/camila.jpg', 720, 'iniciante', 30000.00, 2.5, ARRAY['Feminino', 'Segurança', 'Praticidade'], '2024-02-15'),

-- Especialista em premium
('Roberto Machado', 'roberto.machado@v8system.com', '(11) 99999-1009', '/avatars/roberto.jpg', 2190, 'expert', 90000.00, 5.0, ARRAY['Luxury', 'Premium', 'Importados', 'VIP'], '2020-06-01'),

-- Vendedora em férias
('Larissa Moreira', 'larissa.moreira@v8system.com', '(11) 99999-1010', '/avatars/larissa.jpg', 1420, 'intermediario', 45000.00, 3.0, ARRAY['Compactos', 'Urbano'], '2023-09-12');

-- Atualizar status de alguns vendedores
UPDATE vendedores SET status = 'ferias' WHERE nome = 'Larissa Moreira';

-- Inserir métricas dos últimos 6 meses para cada vendedor
-- Janeiro 2024
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
-- Carlos Silva (Top performer)
(1, '2024-01-01', 45, 12, 8, 320000.00, 180),
-- Marina Santos  
(2, '2024-01-01', 38, 11, 7, 275000.00, 165),
-- Ricardo Oliveira
(3, '2024-01-01', 42, 9, 6, 180000.00, 135),
-- Ana Paula Costa
(4, '2024-01-01', 35, 8, 5, 225000.00, 120),
-- Thiago Fernandes
(5, '2024-01-01', 28, 6, 4, 160000.00, 95),
-- Juliana Ribeiro
(6, '2024-01-01', 32, 7, 5, 140000.00, 110),
-- Pedro Almeida (Novato)
(7, '2024-01-01', 15, 2, 1, 45000.00, 25),
-- Camila Torres (Novata)
(8, '2024-01-01', 12, 1, 1, 35000.00, 20),
-- Roberto Machado (Premium)
(9, '2024-01-01', 25, 8, 4, 420000.00, 200),
-- Larissa Moreira
(10, '2024-01-01', 22, 5, 3, 95000.00, 75);

-- Fevereiro 2024
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
(1, '2024-02-01', 52, 14, 9, 385000.00, 210),
(2, '2024-02-01', 41, 12, 8, 290000.00, 180),
(3, '2024-02-01', 38, 8, 5, 165000.00, 125),
(4, '2024-02-01', 39, 9, 6, 245000.00, 135),
(5, '2024-02-01', 31, 7, 5, 175000.00, 115),
(6, '2024-02-01', 29, 6, 4, 125000.00, 95),
(7, '2024-02-01', 18, 3, 2, 65000.00, 45),
(8, '2024-02-01', 16, 2, 2, 48000.00, 35),
(9, '2024-02-01', 28, 9, 5, 475000.00, 225),
(10, '2024-02-01', 25, 6, 4, 120000.00, 85);

-- Março 2024
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
(1, '2024-03-01', 48, 13, 8, 365000.00, 195),
(2, '2024-03-01', 44, 10, 7, 265000.00, 155),
(3, '2024-03-01', 35, 10, 7, 210000.00, 150),
(4, '2024-03-01', 33, 7, 5, 205000.00, 115),
(5, '2024-03-01', 29, 8, 6, 185000.00, 125),
(6, '2024-03-01', 31, 8, 6, 155000.00, 120),
(7, '2024-03-01', 22, 4, 3, 85000.00, 60),
(8, '2024-03-01', 19, 3, 2, 55000.00, 45),
(9, '2024-03-01', 22, 7, 4, 395000.00, 175),
(10, '2024-03-01', 27, 7, 5, 135000.00, 95);

-- Abril 2024
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
(1, '2024-04-01', 46, 15, 10, 425000.00, 230),
(2, '2024-04-01', 39, 11, 8, 305000.00, 175),
(3, '2024-04-01', 40, 9, 6, 195000.00, 140),
(4, '2024-04-01', 36, 8, 6, 235000.00, 125),
(5, '2024-04-01', 33, 9, 7, 205000.00, 145),
(6, '2024-04-01', 28, 7, 5, 145000.00, 105),
(7, '2024-04-01', 25, 5, 4, 115000.00, 85),
(8, '2024-04-01', 21, 4, 3, 75000.00, 65),
(9, '2024-04-01', 26, 8, 5, 445000.00, 200),
(10, '2024-04-01', 24, 6, 4, 125000.00, 85);

-- Maio 2024
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
(1, '2024-05-01', 51, 16, 11, 465000.00, 250),
(2, '2024-05-01', 42, 13, 9, 335000.00, 195),
(3, '2024-05-01', 37, 11, 8, 235000.00, 165),
(4, '2024-05-01', 40, 10, 7, 275000.00, 150),
(5, '2024-05-01', 35, 10, 8, 225000.00, 160),
(6, '2024-05-01', 34, 9, 7, 175000.00, 135),
(7, '2024-05-01', 28, 6, 5, 135000.00, 105),
(8, '2024-05-01', 24, 5, 4, 95000.00, 85),
(9, '2024-05-01', 29, 10, 6, 520000.00, 240),
-- Larissa estava de férias em maio
(10, '2024-05-01', 0, 0, 0, 0.00, 0);

-- Junho 2024 (mês atual - dados parciais)
INSERT INTO vendedores_metricas (vendedor_id, periodo, leads_recebidos, leads_convertidos, veiculos_vendidos, valor_vendas, pontos_ganhos) VALUES
(1, '2024-06-01', 35, 11, 8, 355000.00, 180),
(2, '2024-06-01', 29, 9, 6, 245000.00, 135),
(3, '2024-06-01', 31, 8, 6, 185000.00, 120),
(4, '2024-06-01', 28, 7, 5, 195000.00, 105),
(5, '2024-06-01', 26, 7, 5, 165000.00, 110),
(6, '2024-06-01', 25, 6, 4, 125000.00, 90),
(7, '2024-06-01', 20, 4, 3, 95000.00, 70),
(8, '2024-06-01', 18, 3, 2, 65000.00, 55),
(9, '2024-06-01', 21, 7, 4, 385000.00, 170),
(10, '2024-06-01', 19, 4, 3, 95000.00, 65);

-- Atualizar pontuação total dos vendedores baseado nas métricas
UPDATE vendedores SET pontuacao = (
    SELECT COALESCE(SUM(pontos_ganhos), 0) 
    FROM vendedores_metricas 
    WHERE vendedor_id = vendedores.id
);

-- Inserir alguns veículos com vendedores responsáveis
UPDATE veiculos SET 
    vendedor_responsavel_id = CASE 
        WHEN id % 9 = 1 THEN 1  -- Carlos Silva
        WHEN id % 9 = 2 THEN 2  -- Marina Santos  
        WHEN id % 9 = 3 THEN 3  -- Ricardo Oliveira
        WHEN id % 9 = 4 THEN 4  -- Ana Paula Costa
        WHEN id % 9 = 5 THEN 5  -- Thiago Fernandes
        WHEN id % 9 = 6 THEN 6  -- Juliana Ribeiro
        WHEN id % 9 = 7 THEN 7  -- Pedro Almeida
        WHEN id % 9 = 8 THEN 8  -- Camila Torres
        WHEN id % 9 = 0 THEN 9  -- Roberto Machado
    END,
    margem_percentual = CASE
        WHEN valor > 200000 THEN 15.5  -- Carros premium
        WHEN valor > 100000 THEN 12.8  -- Carros médios
        ELSE 8.5                       -- Carros básicos
    END,
    custo_aquisicao = valor * 0.85  -- 85% do valor de venda
WHERE vendedor_responsavel_id IS NULL;