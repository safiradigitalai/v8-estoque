-- V8 System - Schema para Sistema de Importação
-- Extensão do banco para suportar importação de dados

-- Tabela para controle de uploads de arquivos
CREATE TABLE IF NOT EXISTS file_uploads (
    id SERIAL PRIMARY KEY,
    
    -- Metadados do arquivo
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    
    -- Status do processamento
    status VARCHAR(20) DEFAULT 'uploaded',
    processed_at TIMESTAMP NULL,
    
    -- Tipo de importação
    import_type VARCHAR(50) NOT NULL, -- 'csv', 'excel', 'api'
    source_type VARCHAR(50), -- 'manual', 'olx', 'webmotors', etc
    
    -- Controle de qualidade
    total_rows INTEGER DEFAULT 0,
    valid_rows INTEGER DEFAULT 0,
    error_rows INTEGER DEFAULT 0,
    
    -- Auditoria
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (status IN ('uploaded', 'processing', 'completed', 'failed', 'cancelled')),
    CHECK (import_type IN ('csv', 'excel', 'json', 'api')),
    CHECK (file_size > 0),
    CHECK (total_rows >= 0),
    CHECK (valid_rows >= 0),
    CHECK (error_rows >= 0)
);

-- Índices para file_uploads
CREATE INDEX IF NOT EXISTS idx_file_uploads_status ON file_uploads(status);
CREATE INDEX IF NOT EXISTS idx_file_uploads_type ON file_uploads(import_type, source_type);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created ON file_uploads(created_at);

-- Habilitar RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON file_uploads FOR ALL USING (true);

-- Tabela para log detalhado de importação
CREATE TABLE IF NOT EXISTS import_logs (
    id SERIAL PRIMARY KEY,
    file_upload_id INTEGER NOT NULL REFERENCES file_uploads(id) ON DELETE CASCADE,
    
    -- Identificação da linha/registro
    row_number INTEGER NOT NULL,
    source_data JSONB NOT NULL, -- Dados originais do arquivo/API
    
    -- Status do processamento
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE SET NULL,
    
    -- Erros e validações
    validation_errors JSONB DEFAULT '[]'::jsonb,
    processed_data JSONB, -- Dados após processamento/limpeza
    error_message TEXT,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP NULL,
    
    -- Constraints
    CHECK (status IN ('pending', 'processed', 'error', 'skipped', 'duplicate')),
    CHECK (row_number > 0)
);

-- Índices para import_logs
CREATE INDEX IF NOT EXISTS idx_import_logs_file ON import_logs(file_upload_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status);
CREATE INDEX IF NOT EXISTS idx_import_logs_veiculo ON import_logs(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_errors ON import_logs USING GIN(validation_errors);

-- Habilitar RLS
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON import_logs FOR ALL USING (true);

-- Tabela para mapeamento de campos (flexibilidade)
CREATE TABLE IF NOT EXISTS field_mappings (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    source_type VARCHAR(50) NOT NULL, -- 'csv_default', 'olx', 'webmotors', etc
    
    -- Mapeamento de campos
    field_map JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Exemplo: {"marca": "brand", "modelo": "model", "valor": "price"}
    
    -- Configurações de processamento
    data_transformations JSONB DEFAULT '{}'::jsonb,
    -- Exemplo: {"valor": {"type": "currency", "multiply": 1}, "ano": {"type": "year", "min": 1990}}
    
    validation_rules JSONB DEFAULT '{}'::jsonb,
    -- Exemplo: {"marca": {"required": true, "min_length": 2}, "valor": {"required": true, "min": 1000}}
    
    -- Status
    active BOOLEAN DEFAULT true,
    default_mapping BOOLEAN DEFAULT false,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (source_type IS NOT NULL AND source_type != '')
);

-- Índices para field_mappings
CREATE INDEX IF NOT EXISTS idx_field_mappings_source ON field_mappings(source_type);
CREATE INDEX IF NOT EXISTS idx_field_mappings_active ON field_mappings(active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_field_mappings_default ON field_mappings(source_type) WHERE default_mapping = true;

-- Habilitar RLS
ALTER TABLE field_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON field_mappings FOR ALL USING (true);

-- Tabela para controle de APIs externas
CREATE TABLE IF NOT EXISTS external_api_configs (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    name VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL, -- 'olx', 'webmotors', 'fipe', etc
    description TEXT,
    
    -- Configuração da API
    base_url VARCHAR(500) NOT NULL,
    auth_method VARCHAR(50) DEFAULT 'none', -- 'none', 'api_key', 'oauth', 'basic'
    auth_config JSONB DEFAULT '{}'::jsonb,
    headers JSONB DEFAULT '{}'::jsonb,
    
    -- Rate limiting
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    
    -- Configurações de importação
    field_mapping_id INTEGER REFERENCES field_mappings(id),
    batch_size INTEGER DEFAULT 100,
    auto_import BOOLEAN DEFAULT false,
    
    -- Status
    active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP NULL,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (auth_method IN ('none', 'api_key', 'oauth', 'basic')),
    CHECK (rate_limit_per_minute > 0),
    CHECK (rate_limit_per_hour > 0),
    CHECK (batch_size > 0)
);

-- Índices para external_api_configs
CREATE INDEX IF NOT EXISTS idx_external_api_provider ON external_api_configs(provider);
CREATE INDEX IF NOT EXISTS idx_external_api_active ON external_api_configs(active);

-- Habilitar RLS
ALTER TABLE external_api_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON external_api_configs FOR ALL USING (true);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers de atualização
DROP TRIGGER IF EXISTS update_file_uploads_updated_at ON file_uploads;
CREATE TRIGGER update_file_uploads_updated_at 
    BEFORE UPDATE ON file_uploads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_field_mappings_updated_at ON field_mappings;
CREATE TRIGGER update_field_mappings_updated_at 
    BEFORE UPDATE ON field_mappings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_external_api_configs_updated_at ON external_api_configs;
CREATE TRIGGER update_external_api_configs_updated_at 
    BEFORE UPDATE ON external_api_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dados iniciais para field_mappings (mapeamento padrão CSV)
INSERT INTO field_mappings (name, description, source_type, field_map, validation_rules, default_mapping) VALUES 
('CSV Padrão', 'Mapeamento padrão para arquivos CSV com campos básicos', 'csv_default', 
'{
  "marca": "marca",
  "modelo": "modelo", 
  "ano": "ano",
  "valor": "valor",
  "km": "quilometragem",
  "cor": "cor",
  "combustivel": "combustivel",
  "cambio": "cambio",
  "portas": "portas",
  "placa": "placa",
  "observacoes": "observacoes"
}'::jsonb,
'{
  "marca": {"required": true, "min_length": 2, "max_length": 50},
  "modelo": {"required": true, "min_length": 1, "max_length": 100},
  "ano": {"required": true, "min": 1990, "max": 2025},
  "valor": {"required": true, "min": 1000, "max": 10000000},
  "km": {"min": 0, "max": 1000000},
  "combustivel": {"enum": ["flex", "gasolina", "diesel", "eletrico", "hibrido"]},
  "cambio": {"enum": ["manual", "automatico", "cvt"]},
  "portas": {"min": 2, "max": 5}
}'::jsonb, 
true)
ON CONFLICT (name) DO NOTHING;

-- View para estatísticas de importação
CREATE OR REPLACE VIEW import_statistics AS
SELECT 
    fu.id as upload_id,
    fu.filename,
    fu.import_type,
    fu.source_type,
    fu.status as upload_status,
    fu.total_rows,
    fu.valid_rows,
    fu.error_rows,
    fu.created_at as uploaded_at,
    fu.processed_at,
    
    -- Estatísticas detalhadas dos logs
    COUNT(il.id) as total_log_entries,
    COUNT(CASE WHEN il.status = 'processed' THEN 1 END) as processed_count,
    COUNT(CASE WHEN il.status = 'error' THEN 1 END) as error_count,
    COUNT(CASE WHEN il.status = 'duplicate' THEN 1 END) as duplicate_count,
    COUNT(CASE WHEN il.status = 'skipped' THEN 1 END) as skipped_count,
    
    -- Taxa de sucesso
    CASE 
        WHEN COUNT(il.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN il.status = 'processed' THEN 1 END)::numeric / COUNT(il.id)::numeric) * 100, 2)
        ELSE 0 
    END as success_rate
    
FROM file_uploads fu
LEFT JOIN import_logs il ON fu.id = il.file_upload_id
GROUP BY fu.id, fu.filename, fu.import_type, fu.source_type, fu.status, 
         fu.total_rows, fu.valid_rows, fu.error_rows, fu.created_at, fu.processed_at
ORDER BY fu.created_at DESC;