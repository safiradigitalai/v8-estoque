export interface Database {
  public: {
    Tables: {
      loja_info: {
        Row: {
          id: number;
          nome: string;
          cnpj: string | null;
          telefone: string | null;
          email: string | null;
          endereco: string | null;
          cidade: string | null;
          estado: string | null;
          logo_url: string | null;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: number;
          nome: string;
          cnpj?: string | null;
          telefone?: string | null;
          email?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          estado?: string | null;
          logo_url?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: number;
          nome?: string;
          cnpj?: string | null;
          telefone?: string | null;
          email?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          estado?: string | null;
          logo_url?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      classes_config: {
        Row: {
          id: number;
          classe_a_min: number;
          classe_b_min: number;
          classe_c_min: number;
          classe_d_max: number;
          atualizado_em: string;
        };
        Insert: {
          id?: number;
          classe_a_min?: number;
          classe_b_min?: number;
          classe_c_min?: number;
          classe_d_max?: number;
          atualizado_em?: string;
        };
        Update: {
          id?: number;
          classe_a_min?: number;
          classe_b_min?: number;
          classe_c_min?: number;
          classe_d_max?: number;
          atualizado_em?: string;
        };
      };
      categorias: {
        Row: {
          id: number;
          nome: string;
          slug: string;
          icone: string | null;
          ordem: number;
          ativo: boolean;
        };
        Insert: {
          id?: number;
          nome: string;
          slug: string;
          icone?: string | null;
          ordem?: number;
          ativo?: boolean;
        };
        Update: {
          id?: number;
          nome?: string;
          slug?: string;
          icone?: string | null;
          ordem?: number;
          ativo?: boolean;
        };
      };
      veiculos: {
        Row: {
          id: number;
          marca: string;
          modelo: string;
          ano: number;
          valor: number;
          categoria_id: number;
          classe_social: 'A' | 'B' | 'C' | 'D';
          km: number;
          cor: string | null;
          combustivel: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
          cambio: 'manual' | 'automatico' | 'cvt';
          portas: number;
          placa: string | null;
          status: 'disponivel' | 'reservado' | 'vendido';
          codigo_interno: string | null;
          observacoes: string | null;
          data_entrada: string;
          data_venda: string | null;
          dias_estoque: number;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: number;
          marca: string;
          modelo: string;
          ano: number;
          valor: number;
          categoria_id: number;
          km?: number;
          cor?: string | null;
          combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
          cambio?: 'manual' | 'automatico' | 'cvt';
          portas?: number;
          placa?: string | null;
          status?: 'disponivel' | 'reservado' | 'vendido';
          codigo_interno?: string | null;
          observacoes?: string | null;
          data_entrada?: string;
          data_venda?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: number;
          marca?: string;
          modelo?: string;
          ano?: number;
          valor?: number;
          categoria_id?: number;
          km?: number;
          cor?: string | null;
          combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
          cambio?: 'manual' | 'automatico' | 'cvt';
          portas?: number;
          placa?: string | null;
          status?: 'disponivel' | 'reservado' | 'vendido';
          codigo_interno?: string | null;
          observacoes?: string | null;
          data_entrada?: string;
          data_venda?: string | null;
          criado_em?: string;
          atualizado_em?: string;
        };
      };
      veiculo_fotos: {
        Row: {
          id: number;
          veiculo_id: number;
          url: string;
          tipo: 'principal' | 'galeria' | 'vitrine';
          ordem: number;
          url_thumb: string | null;
          url_medium: string | null;
          processada: boolean;
          criado_em: string;
        };
        Insert: {
          id?: number;
          veiculo_id: number;
          url: string;
          tipo?: 'principal' | 'galeria' | 'vitrine';
          ordem?: number;
          url_thumb?: string | null;
          url_medium?: string | null;
          processada?: boolean;
          criado_em?: string;
        };
        Update: {
          id?: number;
          veiculo_id?: number;
          url?: string;
          tipo?: 'principal' | 'galeria' | 'vitrine';
          ordem?: number;
          url_thumb?: string | null;
          url_medium?: string | null;
          processada?: boolean;
          criado_em?: string;
        };
      };
    };
    Views: {
      dashboard_estoque: {
        Row: {
          id: number;
          marca: string;
          modelo: string;
          ano: number;
          valor: number;
          classe_social: 'A' | 'B' | 'C' | 'D';
          status: 'disponivel' | 'reservado' | 'vendido';
          dias_estoque: number;
          categoria_nome: string;
          categoria_slug: string;
          categoria_icone: string | null;
          foto_principal: string | null;
          foto_thumb: string | null;
        };
      };
    };
  };
}

// Tipos derivados para uso na aplicação
export type LojaInfo = Database['public']['Tables']['loja_info']['Row'];
export type ClassesConfig = Database['public']['Tables']['classes_config']['Row'];
export type Categoria = Database['public']['Tables']['categorias']['Row'];
export type Veiculo = Database['public']['Tables']['veiculos']['Row'];
export type VeiculoFoto = Database['public']['Tables']['veiculo_fotos']['Row'];
export type DashboardItem = Database['public']['Views']['dashboard_estoque']['Row'];

export type CreateVeiculo = Database['public']['Tables']['veiculos']['Insert'];
export type UpdateVeiculo = Database['public']['Tables']['veiculos']['Update'];
export type CreateVeiculoFoto = Database['public']['Tables']['veiculo_fotos']['Insert'];

// Tipos para o módulo de vendedores
export interface Vendedor {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  foto_url: string | null;
  pontuacao: number;
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
  meta_mensal: number;
  comissao_percentual: number;
  status: 'ativo' | 'inativo' | 'suspenso' | 'ferias';
  data_contratacao: string;
  especialidades: string[] | null;
  criado_em: string;
  atualizado_em: string;
}

export interface VendedorMetricas {
  id: number;
  vendedor_id: number;
  periodo: string;
  leads_recebidos: number;
  leads_convertidos: number;
  veiculos_vendidos: number;
  valor_vendas: number;
  comissao_ganha: number;
  pontos_ganhos: number;
  bonus_atingido: boolean;
  meta_atingida: boolean;
  taxa_conversao: number;
  ticket_medio: number;
  criado_em: string;
}

export interface DashboardVendedor {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  foto_url: string | null;
  pontuacao: number;
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
  meta_mensal: number;
  comissao_percentual: number;
  status: 'ativo' | 'inativo' | 'suspenso' | 'ferias';
  data_contratacao: string;
  especialidades: string[] | null;
  
  // Métricas do mês atual
  leads_mes_atual: number;
  conversoes_mes_atual: number;
  vendas_mes_atual: number;
  faturamento_mes_atual: number;
  taxa_conversao_atual: number;
  ticket_medio_atual: number;
  meta_atingida_atual: boolean;
  
  // Totais acumulados (últimos 6 meses)
  total_vendas_semestre: number;
  total_faturamento_semestre: number;
  media_conversao_semestre: number;
  
  // Rankings
  ranking_geral: number;
  ranking_mes: number;
}