'use client';

import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  List,
  Crown,
  DollarSign,
  UserCheck,
  Calendar,
  Filter,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  UserX,
  Coffee,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { useVendedores } from '@/hooks/useVendedores';
import { EmptyState } from '../common/EmptyState';

interface VendedoresDashboardProps {
  onNavigateToLista: () => void;
  onNavigateToAdicionar: () => void;
  onNavigateToConfiguracoes: () => void;
  onNavigateToEditar?: (vendedor: any) => void;
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
  isPrimeiro = false,
  size = 'w-16 h-16', 
  textSize = 'text-lg',
  borderClass = ''
}: {
  vendedor: { nome: string; foto_url?: string | null };
  isPrimeiro?: boolean;
  size?: string;
  textSize?: string;
  borderClass?: string;
}) {
  const [imageError, setImageError] = useState(false);
  
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

  if (!vendedor.foto_url || imageError) {
    return (
      <div className={`${size} lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center border-3 shadow-lg transition-all duration-300 group-hover:scale-105 text-white font-bold ${textSize} lg:text-xl ${getAvatarColor(vendedor.nome)} ${borderClass}`}>
        {getInitials(vendedor.nome)}
      </div>
    );
  }

  return (
    <img 
      src={vendedor.foto_url}
      alt={vendedor.nome}
      onError={() => setImageError(true)}
      className={`${size} lg:w-18 lg:h-18 rounded-2xl object-cover border-3 shadow-lg transition-all duration-300 group-hover:scale-105 ${borderClass}`}
    />
  );
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

export function VendedoresDashboard({ 
  onNavigateToLista, 
  onNavigateToAdicionar, 
  onNavigateToConfiguracoes, 
  onNavigateToEditar 
}: VendedoresDashboardProps) {
  
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('atual');
  
  // Determinar período para API
  const periodo = filtroPeriodo === 'atual' ? undefined : filtroPeriodo;
  const { vendedores, isLoading, isError, refresh } = useVendedores(periodo);

  // Funções de ação
  const handleEditVendedor = (vendedor: any) => {
    if (onNavigateToEditar) {
      onNavigateToEditar(vendedor);
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

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Users className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Erro ao carregar vendedores</h3>
        <button 
          onClick={refresh}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar Novamente</span>
        </button>
      </div>
    );
  }

  // Calcular métricas gerais
  const vendedoresAtivos = vendedores.filter(v => v.status === 'ativo');
  const totalVendas = vendedores.reduce((sum, v) => sum + v.vendas_mes_atual, 0);
  const faturamentoTotal = vendedores.reduce((sum, v) => sum + v.faturamento_mes_atual, 0);
  const conversaoMedia = vendedores.length > 0 
    ? vendedores.reduce((sum, v) => sum + v.taxa_conversao_atual, 0) / vendedores.length 
    : 0;

  // Top 5 vendedores por pontuação total (ranking geral)
  const topVendedores = vendedores
    .filter(v => v.status === 'ativo')
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Seção Editorial - Métricas Executivas */}
      <section className="animate-fadeInUp">
        <div className="mb-8 lg:mb-12 group">
          <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
            <span className="font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 group-hover:text-purple-500 group-hover:shadow-purple-200 select-none">
              001
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-purple-200 group-hover:via-violet-200 group-hover:to-purple-200 transition-all duration-500" />
          </div>
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
            Métricas Executivas da Equipe
          </h2>
        </div>
        
        {/* Editorial Luxury Stats Grid - SEM backdrop-blur */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Vendedores */}
          <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-100 text-xs font-mono uppercase tracking-wider">
                  Equipe Ativa
                </p>
                <span className="text-xs font-mono bg-white/30 rounded px-1.5 py-0.5">
                  ↗ +{vendedores.filter(v => v.status === 'ferias').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {vendedoresAtivos.length}
                </span>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5 text-purple-200" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Vendas do Mês */}
          <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                  Vendas Mês
                </p>
                <span className="text-xs font-mono bg-white/30 rounded px-1.5 py-0.5">
                  {totalVendas >= 50 ? '↗ Meta' : '↘ ' + Math.round((totalVendas / 50) * 100) + '%'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {totalVendas}
                </span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-5 h-5 text-emerald-200" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Faturamento */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                  Faturamento
                </p>
                <span className="text-xs font-mono bg-white/30 rounded px-1.5 py-0.5">
                  ↗ +15%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg lg:text-xl font-bold tracking-tight">
                  {formatCurrency(faturamentoTotal)}
                </span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-5 h-5 text-blue-200" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Taxa Conversão */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                  Conversão
                </p>
                <span className="text-xs font-mono bg-white/30 rounded px-1.5 py-0.5">
                  {conversaoMedia >= 30 ? '↗ Meta' : '↘ ' + Math.round((conversaoMedia / 30) * 100) + '%'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {conversaoMedia.toFixed(1)}%
                </span>
                <div className="flex items-center space-x-1">
                  <Target className="w-5 h-5 text-amber-200" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Quick Action Cards - SEM backdrop-blur */}
        <div className="mt-8 lg:mt-12">
          <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            
            {/* Seletor de Período */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Período:</span>
              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="bg-gray-100 border border-gray-200/50 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="atual">Atual (2025-08)</option>
                <option value="2024-06-01">Junho 2024</option>
                <option value="2024-05-01">Maio 2024</option>
                <option value="2024-04-01">Abril 2024</option>
                <option value="2024-03-01">Março 2024</option>
                <option value="2024-02-01">Fevereiro 2024</option>
                <option value="2024-01-01">Janeiro 2024</option>
              </select>
            </div>

            {/* Botão Ver Todos - Canto Direito */}
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={onNavigateToLista}
                className="group relative inline-flex items-center space-x-3 px-6 py-3 bg-white border-2 border-gray-200/60 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-purple-200/60 hover:text-purple-600 shadow-lg hover:shadow-xl hover:shadow-purple-100/20 transition-all duration-300 text-sm font-medium cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-violet-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <List className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 font-semibold tracking-wide">Ver Todos os Vendedores</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Editorial - Ranking de Elite */}
      <section className="animate-fadeInUp">
        <div className="mb-8 lg:mb-12 group">
          <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
            <span className="font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 group-hover:text-purple-500 group-hover:shadow-purple-200 select-none">
              002
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-purple-200 group-hover:via-violet-200 group-hover:to-purple-200 transition-all duration-500" />
          </div>
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
            Ranking de Elite - Top Performers
          </h2>
        </div>

        {/* Top 5 Vendedores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {isLoading ? (
            Array.from({length: 5}).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            topVendedores.map((vendedor, index) => {
              const ranking = index + 1; // Ranking baseado na posição atual após ordenação
              const isPrimeiro = ranking === 1;
              const isTopTres = ranking <= 3;

              return (
                <div
                  key={vendedor.id}
                  className={`group relative bg-white rounded-3xl border transition-all duration-500 hover:shadow-strong cursor-pointer ${
                    isPrimeiro 
                      ? 'border-yellow-300/50 bg-gradient-to-br from-white via-yellow-50/30 to-amber-50/30 shadow-lg hover:shadow-yellow-200/25' 
                      : isTopTres 
                        ? 'border-purple-200/50 bg-gradient-to-br from-white via-purple-50/20 to-violet-50/10 shadow-md hover:shadow-purple-100/25'
                        : 'border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-medium'
                  } p-6 lg:p-8`}
                >
                  {/* Elite Header com Ranking Badge */}
                  {isPrimeiro && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/25 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar Premium */}
                      <div className="relative">
                        <VendedorAvatar 
                          vendedor={vendedor}
                          isPrimeiro={isPrimeiro}
                          borderClass={
                            isPrimeiro ? 'border-yellow-300' :
                            isTopTres ? 'border-purple-300' : 
                            'border-gray-200'
                          }
                        />
                        
                        {/* Ranking Badge */}
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-110 ${
                          ranking === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                          ranking === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                          ranking === 3 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white' :
                          'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
                        }`}>
                          #{ranking}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-300">
                            {vendedor.nome}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all duration-300 ${getNivelColor(vendedor.nivel)} group-hover:scale-105`}>
                            {vendedor.nivel}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-xl border transition-all duration-300 ${getStatusColor(vendedor.status)} group-hover:scale-105`}>
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

                  {/* Meta Progress & Status */}
                  <div className="space-y-4 mb-6">
                    {vendedor.meta_atingida_atual ? (
                      <div className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/50 text-emerald-800 rounded-2xl text-xs font-medium shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                        <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Meta Conquistada</span>
                      </div>
                    ) : (
                      <div className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-200/50 text-purple-800 rounded-2xl text-xs font-medium shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                        <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Em Progresso</span>
                      </div>
                    )}

                    {/* Progress Bar Luxury */}
                    <div className="relative">
                      <div className="w-full bg-gray-200/60 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-700 ease-out ${
                            vendedor.meta_atingida_atual ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-purple-400 to-violet-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (vendedor.faturamento_mes_atual / vendedor.meta_mensal) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      {vendedor.meta_atingida_atual && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <UserCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métricas Grid Executivo */}
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{vendedor.vendas_mes_atual}</div>
                      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">Vendas</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{vendedor.pontuacao}</div>
                      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">Pontos</div>
                    </div>
                  </div>

                  {/* Faturamento Executive */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-mono text-xs uppercase tracking-wider">Faturamento</span>
                      <span className="font-bold text-gray-900">{formatCurrency(vendedor.faturamento_mes_atual)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Meta: {formatCurrency(vendedor.meta_mensal)} | {Math.round((vendedor.faturamento_mes_atual / vendedor.meta_mensal) * 100)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Ver Todos Link */}
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateToLista}
            className="group relative inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-white via-gray-50 to-white border-2 border-gray-200/60 text-gray-700 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:via-violet-50 hover:to-purple-50 hover:border-purple-200/60 hover:text-purple-600 shadow-lg hover:shadow-xl hover:shadow-purple-100/20 transition-all duration-300 text-sm font-medium cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center space-x-3">
              <span className="font-semibold tracking-wide">Ver Todos os {vendedores.length} Vendedores</span>
              <List className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}