'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Car,
  Zap,
  AlertCircle,
  ArrowRight,
  Clock,
  Target,
  Eye,
  EyeOff,
  Star,
  Settings
} from 'lucide-react';

// Hook para dados do dashboard
function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
        setError(null);
      } else {
        setError('Erro ao carregar dados');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refresh: fetchDashboard };
}

interface EstoqueDashboardProps {
  onNavigateToListagem: () => void;
  onNavigateToAdd: () => void;
  onNavigateToImport: () => void;
}

export function EstoqueDashboard({ 
  onNavigateToListagem, 
  onNavigateToAdd, 
  onNavigateToImport 
}: EstoqueDashboardProps) {
  const { data, isLoading, error, refresh } = useDashboard();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {/* Header Loading */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-200 rounded-3xl mx-auto shimmer" />
              <div className="w-96 h-12 bg-gradient-to-r from-emerald-200 to-green-200 rounded mx-auto shimmer" />
              <div className="w-64 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto shimmer" />
            </div>

            {/* Cards Loading */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shimmer" />
              ))}
            </div>

            {/* Actions Loading */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shimmer" />
              ))}
            </div>
          </div>

          <style jsx global>{`
            @keyframes shimmer {
              0% { background-position: -200px 0; }
              100% { background-position: calc(200px + 100%) 0; }
            }
            
            .shimmer {
              background: linear-gradient(90deg, #f1f5f9 0px, #e2e8f0 40px, #f1f5f9 80px);
              background-size: 200px 100%;
              animation: shimmer 1.5s infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-light text-gray-900">Erro ao Carregar</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={refresh}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const resumo = data?.resumo || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
      {/* Header seguindo padrão Overview */}
      <header className="bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/20 border-b border-white/20 shadow-lg shadow-blue-100/20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Header principal */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/20 transition-all duration-500">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Inventário
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    V8 Sistema
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (refresh && typeof refresh === 'function') {
                      refresh();
                    }
                  }}
                  disabled={isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  <svg className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block py-8 lg:py-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-900/20 transition-all duration-500">
                      <Package className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      Inventário & Gestão
                    </h1>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Central de Controle de Estoque
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Botão Sync */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (refresh && typeof refresh === 'function') {
                        refresh();
                      }
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95 group cursor-pointer"
                  >
                    <svg className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Sync</span>
                  </button>
                  
                  {isLoading && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur opacity-30 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 md:pb-12">

        {/* Métricas em Duas Colunas - Estoque & Vitrine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Coluna 1: Status do Estoque */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Status do Estoque</h3>
                <p className="text-gray-600 text-sm">Controle geral do inventário</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total em Estoque */}
              <div className="bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                      Total Estoque
                    </p>
                    <Car className="w-4 h-4 text-amber-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{resumo.total_veiculos || 0}</span>
                      <span className="text-xs text-amber-200">veículos</span>
                    </div>
                    <p className="text-amber-200 text-xs">
                      {formatCurrency(resumo.valor_total || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disponíveis */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                      Disponíveis
                    </p>
                    <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                      {Math.round(((resumo.por_status?.disponivel || 0) / (resumo.total_veiculos || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{resumo.por_status?.disponivel || 0}</span>
                      <span className="text-xs text-blue-200">prontos</span>
                    </div>
                    <p className="text-blue-200 text-xs">
                      Para comercialização
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservados */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                      Reservados
                    </p>
                    <Clock className="w-4 h-4 text-amber-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{resumo.por_status?.reservado || 0}</span>
                      <span className="text-xs text-amber-200">em processo</span>
                    </div>
                    <p className="text-amber-200 text-xs">
                      Negociação ativa
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendidos */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-100 text-xs font-mono uppercase tracking-wider">
                      Vendidos (mês)
                    </p>
                    <TrendingUp className="w-4 h-4 text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{resumo.por_status?.vendido || 0}</span>
                      <span className="text-xs text-green-200">unidades</span>
                    </div>
                    <p className="text-green-200 text-xs">
                      Faturamento mensal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Status da Vitrine */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Status da Vitrine</h3>
                <p className="text-gray-600 text-sm">Visibilidade online da loja</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Vitrine Ativa */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                      Vitrine Ativa
                    </p>
                    <Eye className="w-4 h-4 text-blue-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{resumo.por_status?.disponivel || 0}</span>
                      <span className="text-xs text-blue-200">visíveis</span>
                    </div>
                    <p className="text-blue-200 text-xs">
                      Exposição pública
                    </p>
                  </div>
                </div>
              </div>

              {/* Ocultos */}
              <div className="bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-red-100 text-xs font-mono uppercase tracking-wider">
                      Ocultos
                    </p>
                    <EyeOff className="w-4 h-4 text-red-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">8</span>
                      <span className="text-xs text-red-200">privados</span>
                    </div>
                    <p className="text-red-200 text-xs">
                      Fora da vitrine
                    </p>
                  </div>
                </div>
              </div>

              {/* Em Destaque */}
              <div className="bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-yellow-100 text-xs font-mono uppercase tracking-wider">
                      Em Destaque
                    </p>
                    <Star className="w-4 h-4 text-yellow-200 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">3</span>
                      <span className="text-xs text-yellow-200">premium</span>
                    </div>
                    <p className="text-yellow-200 text-xs">
                      Posição especial
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-100 text-xs font-mono uppercase tracking-wider">
                      Taxa Conversão
                    </p>
                    <TrendingUp className="w-4 h-4 text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">8.5%</span>
                      <span className="text-xs text-green-200">mensal</span>
                    </div>
                    <p className="text-green-200 text-xs">
                      ↗ +2.1% vs anterior
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ferramentas de Gestão - Acesso Rápido */}
        <div className="mb-20">
          {/* Header Simples */}
          <div className="mb-8">
            <div className="flex items-baseline space-x-6 mb-4">
              <span className="font-mono text-xs text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 hover:text-emerald-500 select-none">
                02
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-emerald-200 to-gray-200" />
              <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                Ferramentas de Gestão
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Acesso rápido às principais funcionalidades do sistema
            </p>
          </div>

          {/* Ferramentas Grid - Mobile First */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Gerenciar Catálogo */}
            <button 
              onClick={onNavigateToListagem}
              className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-amber-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 active:scale-[0.98] text-left cursor-pointer"
              style={{ minHeight: '120px' }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center transition-colors">
                  <Settings className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                      Gerenciar Catálogo
                    </h3>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      G
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Controlar estoque e vitrine de veículos
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{resumo.por_status?.disponivel || 0} disponíveis</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{resumo.total_veiculos || 0} total</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Novo Registro */}
            <button 
              onClick={onNavigateToAdd}
              className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 active:scale-[0.98] text-left cursor-pointer"
              style={{ minHeight: '120px' }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      Novo Registro
                    </h3>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      N
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Cadastrar novo veículo no sistema
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Cadastro rápido</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>8 campos</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Importação em Lote */}
            <button 
              onClick={onNavigateToImport}
              className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-purple-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 active:scale-[0.98] text-left cursor-pointer"
              style={{ minHeight: '120px' }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      Importação em Lote
                    </h3>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      I
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Importar planilhas Excel ou CSV
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Até 1000 itens</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>CSV, Excel</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>


        {/* Editorial Market Leaders Section */}
        {data?.hierarquia && data.hierarquia.length > 0 && (
          <div className="mb-20">
            {/* Section Header */}
            <div className="flex items-baseline space-x-6 mb-12">
              <span className="font-mono text-xs text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 hover:text-emerald-500 select-none">
                03
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-emerald-200 to-gray-200" />
              <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                Líderes de Mercado
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 p-10">
              <div className="mb-10">
                <p className="font-mono text-sm text-gray-600 uppercase tracking-widest mb-3">
                  Ranking por Valor de Inventário
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Distribuição estratégica das principais marcas em portfólio, ordenadas por representação patrimonial
                </p>
              </div>

              <div className="space-y-3">
                {data.hierarquia.slice(0, 5).map((marca: any, index: number) => (
                  <div key={marca.marca} className="bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Posição e Nome */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                              <span className="font-mono text-sm font-bold text-emerald-700">
                                {index + 1}
                              </span>
                            </div>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs">👑</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {marca.marca}
                            </h3>
                            <div className="hidden sm:flex items-center space-x-3 mt-1">
                              <span className="text-sm text-gray-600 font-mono">
                                {marca.total_veiculos} veículos
                              </span>
                              <span className="text-sm text-gray-500 font-mono">
                                {((marca.valor_total / resumo.valor_total) * 100).toFixed(1)}% do portfolio
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Valor */}
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(marca.valor_total)}
                          </p>
                          <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                            Valor Total
                          </p>
                        </div>
                      </div>
                      
                      {/* Mobile Info Row */}
                      <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-mono">
                            {marca.total_veiculos} veículos
                          </span>
                          <span className="text-gray-500 font-mono">
                            {((marca.valor_total / resumo.valor_total) * 100).toFixed(1)}% portfolio
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editorial Styles */}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          /* Custom hover effects for editorial cards */
          article:hover .editorial-icon {
            transform: scale(1.1) rotate(3deg);
          }
          
          .editorial-icon {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </main>
    </div>
  );
}