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

// Error Types
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Success Response
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}