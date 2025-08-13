import { Veiculo, Categoria, DashboardItem } from './database';

// Dashboard API Types
export interface DashboardResponse {
  resumo: {
    total_veiculos: number;
    valor_total: number;
    valor_medio: number;
    ultima_atualizacao: string;
    por_status: Record<'disponivel' | 'reservado' | 'vendido', number>;
  };
  hierarquia: Array<{
    marca: string;
    total_veiculos: number;
    valor_total: number;
    categorias: Array<{
      nome: string;
      slug: string;
      icone: string;
      total_veiculos: number;
      valor_total: number;
      classes: Record<'A' | 'B' | 'C' | 'D', {
        quantidade: number;
        valor: number;
        percentual: number;
      }>;
    }>;
  }>;
}

// Veículos API Types
export interface VeiculoListParams {
  page?: number;
  limit?: number;
  marca?: string;
  categoria?: string;
  classe_social?: 'A' | 'B' | 'C' | 'D';
  status?: 'disponivel' | 'reservado' | 'vendido';
  valor_min?: number;
  valor_max?: number;
  search?: string;
  sort_by?: 'valor' | 'marca' | 'modelo' | 'ano' | 'km' | 'dias_estoque';
  sort_order?: 'asc' | 'desc';
}

export interface VeiculoResponse {
  data: Array<DashboardItem>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  filters_applied: VeiculoListParams;
  aggregations: {
    total_valor: number;
    media_valor: number;
    media_km: number;
    media_dias_estoque: number;
  };
}

export interface CreateVeiculoRequest {
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  categoria_id: number;
  km?: number;
  cor?: string;
  combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
  cambio?: 'manual' | 'automatico' | 'cvt';
  portas?: number;
  placa?: string;
  codigo_interno?: string;
  observacoes?: string;
}

export interface UpdateVeiculoRequest extends Partial<CreateVeiculoRequest> {
  status?: 'disponivel' | 'reservado' | 'vendido';
  data_venda?: string;
}

export interface VeiculoDetalhe extends Veiculo {
  categoria: Categoria;
  fotos: Array<{
    id: number;
    url: string;
    tipo: 'principal' | 'galeria' | 'vitrine';
    ordem: number;
    url_thumb?: string;
    url_medium?: string;
  }>;
}

// Upload API Types
export interface UploadFotoRequest {
  veiculo_id: number;
  tipo: 'principal' | 'galeria' | 'vitrine';
  file: File;
}

export interface UploadFotoResponse {
  success: boolean;
  foto?: {
    id: number;
    url: string;
    url_thumb?: string;
    url_medium?: string;
  };
  error?: string;
}

// Filters API Types
export interface FiltersResponse {
  marcas: Array<{
    nome: string;
    count: number;
  }>;
  categorias: Array<{
    id: number;
    nome: string;
    slug: string;
    icone: string;
    count: number;
  }>;
  classes: Record<'A' | 'B' | 'C' | 'D', {
    count: number;
    valor_min: number;
    valor_max: number;
  }>;
  valor_range: {
    min: number;
    max: number;
  };
  ano_range: {
    min: number;
    max: number;
  };
}

// Import System Types
export interface FileUpload {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed' | 'cancelled';
  import_type: 'csv' | 'excel' | 'json' | 'api';
  source_type: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export interface ImportLog {
  id: number;
  file_upload_id: number;
  row_number: number;
  source_data: Record<string, any>;
  processed_data?: Record<string, any>;
  status: 'pending' | 'processed' | 'error' | 'skipped' | 'duplicate';
  veiculo_id?: number;
  validation_errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

export interface FieldMapping {
  id: number;
  name: string;
  description?: string;
  source_type: string;
  field_map: Record<string, string>;
  data_transformations: Record<string, any>;
  validation_rules: Record<string, any>;
  active: boolean;
  default_mapping: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportUploadRequest {
  file: File;
  import_type: 'csv' | 'excel';
  source_type: string;
}

export interface ImportProcessRequest {
  preview_only?: boolean;
  mapping_id?: number;
}

export interface ImportPreviewResponse {
  success: boolean;
  data: {
    headers: string[];
    preview: Array<{
      row_number: number;
      original_data: Record<string, any>;
      transformed_data: Record<string, any>;
      validation_errors: Array<{
        field: string;
        message: string;
        value?: any;
      }>;
      status: 'valid' | 'error';
    }>;
    mapping: FieldMapping;
  };
}

export interface ImportProcessResponse {
  success: boolean;
  data: {
    processed: number;
    errors: number;
    duplicates: number;
    skipped: number;
  };
}

// Enhanced Vehicle Validation
export interface VehicleValidationError {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

export interface VehicleValidationResult {
  valid: boolean;
  errors: VehicleValidationError[];
  warnings: VehicleValidationError[];
}

// Batch Operations
export interface BatchOperation {
  action: 'create' | 'update' | 'delete';
  data: any;
  id?: number;
}

export interface BatchOperationResult {
  success: boolean;
  operation: BatchOperation;
  result?: any;
  error?: string;
}

export interface BatchResponse {
  success: boolean;
  results: BatchOperationResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Error Types
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
  validation_errors?: VehicleValidationError[];
}

// Success Response
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
  warnings?: VehicleValidationError[];
}