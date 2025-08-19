'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Edit,
  MoreVertical,
  Users,
  Star,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Award,
  Target,
  DollarSign,
  Trash2,
  UserX,
  Coffee,
  Heart,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useVendedores } from '@/hooks/useVendedores';
import type { DashboardVendedor } from '@/types/database';

interface VendedoresListProps {
  onVoltar: () => void;
  onAdicionar: () => void;
  onEditar: (vendedor: DashboardVendedor) => void;
}

// Função helper para formatar valores monetários
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Função para determinar cor do badge de status
function getStatusColor(status: string) {
  switch (status) {
    case 'ativo': return 'bg-green-100 text-green-800 border-green-200';
    case 'ferias': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'inativo': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'suspenso': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Função para obter iniciais do nome
function getInitials(nome: string): string {
  return nome
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Função para gerar cor consistente baseada no nome
function getAvatarColor(nome: string): string {
  const colors = [
    'bg-gradient-to-br from-purple-500 to-violet-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600', 
    'bg-gradient-to-br from-emerald-500 to-green-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-teal-500 to-cyan-600',
    'bg-gradient-to-br from-red-500 to-rose-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600'
  ];
  
  // Usar o hash do nome para sempre ter a mesma cor para o mesmo nome
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Componente Menu de Ações do Vendedor
function VendedorActionsMenu({ 
  vendedor, 
  onEdit, 
  onDelete, 
  onChangeStatus 
}: {
  vendedor: any;
  onEdit: (vendedor: any) => void;
  onDelete: (vendedor: any) => void;
  onChangeStatus: (vendedor: any, status: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'ativo', label: 'Ativo', icon: UserCheck, color: 'text-emerald-600' },
    { value: 'ferias', label: 'Férias', icon: Coffee, color: 'text-blue-600' },
    { value: 'doente', label: 'Licença Médica', icon: Heart, color: 'text-red-600' },
    { value: 'suspenso', label: 'Suspenso', icon: UserX, color: 'text-orange-600' },
    { value: 'inativo', label: 'Inativo', icon: AlertTriangle, color: 'text-gray-600' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 cursor-pointer hover:scale-110"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-100/50 z-20 overflow-hidden">
            
            {/* Editar */}
            <button
              onClick={() => {
                onEdit(vendedor);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4 text-blue-500" />
              <span>Editar Vendedor</span>
            </button>

            {/* Separador */}
            <div className="h-px bg-gray-100 mx-2" />

            {/* Alterar Status */}
            <div className="px-2 py-2">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider px-2 mb-1">
                Alterar Status
              </div>
              {statusOptions.filter(opt => opt.value !== vendedor.status).map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChangeStatus(vendedor, option.value);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Icon className={`w-4 h-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Separador */}
            <div className="h-px bg-gray-100 mx-2" />

            {/* Deletar */}
            <button
              onClick={() => {
                onDelete(vendedor);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remover Vendedor</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Componente Avatar com fallback automático
function VendedorAvatar({ 
  vendedor, 
  size = 'w-12 h-12', 
  textSize = 'text-sm'
}: {
  vendedor: { nome: string; foto_url?: string | null };
  size?: string;
  textSize?: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  if (!vendedor.foto_url || imageError) {
    return (
      <div className={`${size} rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-sm ${getAvatarColor(vendedor.nome)}`}>
        {getInitials(vendedor.nome)}
      </div>
    );
  }

  return (
    <img 
      src={vendedor.foto_url}
      alt={vendedor.nome}
      onError={() => setImageError(true)}
      className={`${size} rounded-full object-cover border-2 border-white shadow-sm`}
    />
  );
}

// Função para determinar cor do badge de nível
function getNivelColor(nivel: string) {
  switch (nivel) {
    case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'avancado': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'intermediario': return 'bg-green-100 text-green-800 border-green-200';
    case 'iniciante': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function VendedoresList({ onVoltar, onAdicionar, onEditar }: VendedoresListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('atual');
  
  // Determinar período para API
  const periodo = filtroPeriodo === 'atual' ? undefined : filtroPeriodo;
  const { vendedores, isLoading, isError, refresh } = useVendedores(periodo);

  // Funções de ação
  const handleEditVendedor = (vendedor: any) => {
    if (onEditar) {
      onEditar(vendedor);
    }
  };

  const handleDeleteVendedor = async (vendedor: any) => {
    if (confirm(`Tem certeza que deseja remover ${vendedor.nome}? Esta ação não pode ser desfeita.`)) {
      try {
        const response = await fetch(`/api/vendedores?id=${vendedor.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          refresh(); // Recarregar lista
          // TODO: Adicionar toast de sucesso
        } else {
          // TODO: Adicionar toast de erro
          console.error('Erro ao deletar vendedor');
        }
      } catch (error) {
        console.error('Erro ao deletar vendedor:', error);
        // TODO: Adicionar toast de erro
      }
    }
  };

  const handleChangeStatus = async (vendedor: any, newStatus: string) => {
    try {
      const response = await fetch('/api/vendedores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: vendedor.id,
          ...vendedor,
          status: newStatus
        })
      });

      if (response.ok) {
        refresh(); // Recarregar lista
        // TODO: Adicionar toast de sucesso
      } else {
        // TODO: Adicionar toast de erro
        console.error('Erro ao alterar status');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      // TODO: Adicionar toast de erro
    }
  };
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtrar e buscar vendedores
  const vendedoresFiltrados = useMemo(() => {
    return vendedores.filter(vendedor => {
      const matchSearch = searchTerm === '' || 
        vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = filtroStatus === 'todos' || vendedor.status === filtroStatus;
      const matchNivel = filtroNivel === 'todos' || vendedor.nivel === filtroNivel;
      
      return matchSearch && matchStatus && matchNivel;
    });
  }, [vendedores, searchTerm, filtroStatus, filtroNivel, filtroPeriodo]);

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Users className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Erro ao carregar vendedores</h3>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 cursor-pointer hover:scale-105"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onVoltar}
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-light text-gray-900">Todos os Vendedores</h1>
            <p className="text-gray-600 text-sm">
              {vendedoresFiltrados.length} de {vendedores.length} vendedores
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onAdicionar}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-medium cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          
          {/* Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro Período */}
          <div>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="atual">Atual (2025)</option>
              <option value="2024-06-01">Junho 2024</option>
              <option value="2024-05-01">Maio 2024</option>
              <option value="2024-04-01">Abril 2024</option>
              <option value="2024-03-01">Março 2024</option>
              <option value="2024-02-01">Fevereiro 2024</option>
              <option value="2024-01-01">Janeiro 2024</option>
            </select>
          </div>

          {/* Filtro Status */}
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="ferias">Férias</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>

          {/* Filtro Nível */}
          <div>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="todos">Todos os Níveis</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : vendedoresFiltrados.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {vendedores.length === 0 ? 'Nenhum vendedor cadastrado' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {vendedores.length === 0 
              ? (filtroPeriodo === 'atual' 
                  ? 'Não há dados para o período atual (2025). Selecione um período histórico para ver dados.'
                  : `Não há dados para o período selecionado (${filtroPeriodo}).`)
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {vendedores.length === 0 && (
            <button
              onClick={onAdicionar}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Vendedor</span>
            </button>
          )}
        </div>
      ) : (
        /* Lista de Vendedores */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendedoresFiltrados.map((vendedor) => (
            <div
              key={vendedor.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <VendedorAvatar vendedor={vendedor} />
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-all duration-300">
                      {vendedor.nome}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getNivelColor(vendedor.nivel)}`}>
                        {vendedor.nivel}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vendedor.status)}`}>
                        {vendedor.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu de Ações */}
                <VendedorActionsMenu 
                  vendedor={vendedor}
                  onEdit={handleEditVendedor}
                  onDelete={handleDeleteVendedor}
                  onChangeStatus={handleChangeStatus}
                />
              </div>

              {/* Informações de Contato */}
              <div className="space-y-2 mb-4">
                {vendedor.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{vendedor.email}</span>
                  </div>
                )}
                {vendedor.telefone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{vendedor.telefone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {new Date(vendedor.data_contratacao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-gray-900">{vendedor.pontuacao}</span>
                  </div>
                  <span className="text-xs text-gray-500">Pontos</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{vendedor.vendas_mes_atual}</div>
                  <span className="text-xs text-gray-500">Vendas</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{vendedor.taxa_conversao_atual.toFixed(1)}%</div>
                  <span className="text-xs text-gray-500">Conversão</span>
                </div>
              </div>

              {/* Rankings */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-gray-900">#{vendedor.ranking_geral}</span>
                  </div>
                  <span className="text-xs text-gray-500">Ranking Geral</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-gray-900">#{vendedor.ranking_mes}</span>
                  </div>
                  <span className="text-xs text-gray-500">Este Mês</span>
                </div>
              </div>

              {/* Faturamento e Meta */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Faturamento</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(vendedor.faturamento_mes_atual)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Meta</span>
                    <span className="text-gray-900">
                      {Math.round((vendedor.faturamento_mes_atual / vendedor.meta_mensal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        vendedor.meta_atingida_atual ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (vendedor.faturamento_mes_atual / vendedor.meta_mensal) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Meta: {formatCurrency(vendedor.meta_mensal)}
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              {vendedor.especialidades && vendedor.especialidades.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {vendedor.especialidades.slice(0, 3).map((esp, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                      >
                        {esp}
                      </span>
                    ))}
                    {vendedor.especialidades.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                        +{vendedor.especialidades.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}