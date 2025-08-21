'use client';

import React, { useState, useRef } from 'react';
import { 
  Clock, 
  Timer, 
  CheckCircle, 
  Lock, 
  Eye, 
  ArrowLeft,
  Star,
  DollarSign,
  Calendar,
  AlertCircle,
  Zap,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useMicroMode } from '@/hooks/useMicroMode';

// Interfaces locais
interface VeiculoMicroMode {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  status: 'disponivel' | 'reservado' | 'negociando' | 'vendido';
  classe_social: 'A' | 'B' | 'C' | 'D';
  vendedor_id?: number;
  vendedor_nome?: string;
  categoria: string;
  dias_restantes?: number;
  data_reserva?: string;
  data_inicio_negociacao?: string;
}

interface VeiculosKanbanProps {
  vendedorId?: number;
  isAdmin?: boolean;
  onVoltar: () => void;
}

export function VeiculosKanban({ 
  vendedorId, 
  isAdmin, 
  onVoltar 
}: VeiculosKanbanProps) {
  const [selectedVeiculo, setSelectedVeiculo] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hook do MicroMode com dados reais
  const {
    columns,
    stats,
    isLoading,
    error,
    reservarVeiculo,
    iniciarNegociacao,
    finalizarVenda,
    liberarVeiculo,
    cancelarNegociacao,
    refresh
  } = useMicroMode(vendedorId);

  // Funções de navegação do Kanban
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Largura aproximada de uma coluna
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Verificar scroll quando colunas mudarem
  React.useEffect(() => {
    checkScrollButtons();
    const handleScroll = () => checkScrollButtons();
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener('scroll', handleScroll);
        }
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [columns]);

  const handleAction = async (action: string, veiculoId: number) => {
    setActionLoading(veiculoId);
    
    try {
      let result;
      switch (action) {
        case 'reservar':
          result = await reservarVeiculo(veiculoId);
          break;
        case 'negociar':
          result = await iniciarNegociacao(veiculoId);
          break;
        case 'vender':
          result = await finalizarVenda(veiculoId);
          break;
        case 'liberar':
          result = await liberarVeiculo(veiculoId);
          break;
        case 'cancelar':
          result = await cancelarNegociacao(veiculoId);
          break;
        default:
          throw new Error('Ação inválida');
      }

      // Mostrar feedback de sucesso
      if (result.pontos_ganhos > 0) {
        // TODO: Implementar toast de sucesso com pontos ganhos
        console.log(`🎉 ${result.message} - +${result.pontos_ganhos} pontos!`);
      }
      
    } catch (error) {
      console.error('Erro na ação:', error);
      // TODO: Implementar toast de erro
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (veiculo: VeiculoMicroMode) => {
    switch (veiculo.status) {
      case 'disponivel':
        return (
          <div className="px-3 py-1 bg-green-500/90 text-white text-xs font-light tracking-[0.1em] backdrop-blur-sm hover:bg-emerald-500 hover:shadow-[0_0_4px_rgba(16,185,129,0.4)] transition-all duration-300">
            DISPONÍVEL
          </div>
        );
      case 'reservado':
        return (
          <div className="px-3 py-1 bg-orange-500/90 text-white text-xs font-light tracking-[0.1em] backdrop-blur-sm hover:bg-orange-400 hover:shadow-[0_0_4px_rgba(251,146,60,0.4)] transition-all duration-300">
            RESERVADO {veiculo.dias_restantes ? `(${veiculo.dias_restantes}d)` : ''}
          </div>
        );
      case 'negociando':
        return (
          <div className="px-3 py-1 bg-blue-500/90 text-white text-xs font-light tracking-[0.1em] backdrop-blur-sm hover:bg-cyan-500 hover:shadow-[0_0_4px_rgba(6,182,212,0.4)] transition-all duration-300">
            NEGOCIANDO
          </div>
        );
      case 'vendido':
        return (
          <div className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full hover:text-emerald-700 hover:bg-emerald-50 hover:shadow-[0_0_3px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CheckCircle className="w-3 h-3" />
            <span className="font-light tracking-wider">VENDIDO</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getClasseBadge = (classe: string) => {
    const classes = {
      'A': { bg: 'bg-purple-500/90', hover: 'hover:bg-purple-400 hover:shadow-[0_0_4px_rgba(168,85,247,0.4)]', label: 'PREMIUM' },
      'B': { bg: 'bg-blue-500/90', hover: 'hover:bg-blue-400 hover:shadow-[0_0_4px_rgba(59,130,246,0.4)]', label: 'LUXURY' },
      'C': { bg: 'bg-green-500/90', hover: 'hover:bg-green-400 hover:shadow-[0_0_4px_rgba(34,197,94,0.4)]', label: 'COMFORT' },
      'D': { bg: 'bg-gray-500/90', hover: 'hover:bg-gray-400 hover:shadow-[0_0_4px_rgba(107,114,128,0.4)]', label: 'ESSENTIAL' }
    };
    
    const config = classes[classe as keyof typeof classes];
    return (
      <div className={`text-xs px-3 py-1 text-white font-light tracking-[0.1em] backdrop-blur-sm transition-all duration-300 ${config.bg} ${config.hover}`}>
        {config.label}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            KANBAN
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Carregando veículos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-6">
          <button
            onClick={onVoltar}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-light tracking-wider uppercase">Voltar</span>
          </button>
        </div>
        
        <div className="bg-white border border-gray-100 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-light text-gray-800 tracking-wide mb-4">
            ERRO AO CARREGAR VEÍCULOS
          </h2>
          <p className="text-sm font-light text-gray-500 mb-8">
            {error}
          </p>
          <button
            onClick={refresh}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white hover:bg-gray-900 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-light tracking-wider">TENTAR NOVAMENTE</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      {/* Editorial Layout Container - Full Screen */}
      <div className="h-full flex flex-col">
        {/* Mobile-First Inventory Header */}
        <header className="border-b border-gray-100 bg-white shadow-sm flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            
            {/* Mobile Layout */}
            <div className="sm:hidden">
              {/* Top Row: Back button + Title */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={onVoltar}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <h1 className="text-xl font-light text-gray-900 tracking-wide mb-1">
                    Estoque
                  </h1>
                  <div className="text-xs text-gray-500 font-light">
                    Coleção Automotiva • {new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                
                <button
                  onClick={refresh}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              {/* Editorial Stats Collection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-px bg-gray-300"></div>
                  <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase">Status da Coleção</div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <div className="flex items-center justify-between space-x-6">
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-gray-900 mb-1 group-hover:text-gray-700 transition-colors duration-300">{stats.disponiveis}</div>
                    <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-gray-600 transition-colors duration-300">Disponível</div>
                    <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-gray-300 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="text-2xl font-extralight text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">{stats.negociando}</div>
                    <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-blue-600 transition-colors duration-300">Ativo</div>
                    <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-blue-300 transition-colors duration-300"></div>
                  </div>
                  
                  {vendedorId && (
                    <div className="text-center group">
                      <div className="text-2xl font-extralight text-gray-900 mb-1 group-hover:text-cyan-700 transition-colors duration-300">{stats.meus_reservados + stats.meus_negociando}</div>
                      <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-cyan-600 transition-colors duration-300">Pessoal</div>
                      <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-cyan-300 transition-colors duration-300"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Title Section */}
              <div className="flex items-center space-x-6 lg:space-x-8">
                <button
                  onClick={onVoltar}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extralight text-gray-900 tracking-wide lg:tracking-[0.3em] mb-1">
                    ESTOQUE
                  </h1>
                  <div className="flex items-center space-x-3 lg:space-x-4 text-xs font-light text-gray-500 tracking-wide lg:tracking-[0.2em]">
                    <span>Coleção Automotiva</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span>{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-4 lg:space-x-6 text-xs font-light tracking-[0.15em] uppercase">
                  <div className="text-center">
                    <div className="text-lg font-extralight text-gray-900">{stats.disponiveis}</div>
                    <div className="text-gray-500">Disponível</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-lg font-extralight text-gray-900">{stats.negociando}</div>
                    <div className="text-gray-500">Ativo</div>
                  </div>
                  {vendedorId && (
                    <>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-lg font-extralight text-gray-900">{stats.meus_reservados + stats.meus_negociando}</div>
                        <div className="text-gray-500">Pessoal</div>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={refresh}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - True Full Container */}
        <main className="flex-1 bg-gray-50/30 relative overflow-hidden">
          {/* Full Screen Kanban Board */}
          <div className="w-full h-full absolute inset-0">
            {/* Editorial Navigation - Mobile & Desktop */}
            <div className="absolute left-4 sm:left-6 right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex justify-between">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`pointer-events-auto w-12 h-12 lg:w-10 lg:h-10 transition-all duration-300 flex items-center justify-center ${
                  canScrollLeft 
                    ? 'text-cyan-600 lg:text-gray-600 lg:hover:text-cyan-600 lg:hover:shadow-[0_0_6px_rgba(6,182,212,0.3)] cursor-pointer lg:hover:scale-110' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-6 h-6 lg:w-5 lg:h-5 transition-all duration-300" />
              </button>
              
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`pointer-events-auto w-12 h-12 lg:w-10 lg:h-10 transition-all duration-300 flex items-center justify-center ${
                  canScrollRight 
                    ? 'text-cyan-600 lg:text-gray-600 lg:hover:text-cyan-600 lg:hover:shadow-[0_0_6px_rgba(6,182,212,0.3)] cursor-pointer lg:hover:scale-110' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-6 h-6 lg:w-5 lg:h-5 transition-all duration-300" />
              </button>
            </div>
            
            {/* True Full Width Container */}
            <div 
              ref={scrollContainerRef}
              className="w-full h-full flex overflow-x-auto scroll-smooth pb-20 sm:pb-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {columns.map((column, columnIndex) => (
                <div 
                  key={column.id} 
                  className="min-w-[320px] sm:min-w-[380px] flex-shrink-0 h-full"
                >
                  {/* Editorial Column Container - Subtle Neon */}
                  <div className="h-full bg-white border-l border-gray-100 last:border-r flex flex-col overflow-hidden group hover:bg-gray-50/30 transition-all duration-500 hover:border-l-cyan-400/30 hover:shadow-[0_0_12px_rgba(6,182,212,0.08)]">
                    {/* Enhanced Editorial Header */}
                    <div className="p-6 border-b border-gray-100 group-hover:border-b-cyan-400/15 transition-all duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-extralight text-gray-900 tracking-[0.2em] mb-1 group-hover:text-cyan-900 transition-colors duration-300">
                            {column.titulo}
                          </h3>
                          <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase group-hover:text-cyan-600 transition-colors duration-300">
                            {column.veiculos.length} Items • Collection #{columnIndex + 1}
                          </div>
                        </div>
                        
                        <div className="text-xs font-light text-gray-400 tracking-wider uppercase group-hover:text-cyan-500 transition-colors duration-300">
                          {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                      
                      {/* Neon Progress Line */}
                      <div className="w-full h-px bg-gray-200 overflow-hidden group-hover:bg-cyan-100 transition-colors duration-300">
                        <div 
                          className="h-full bg-gray-900 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:shadow-[0_0_4px_rgba(6,182,212,0.4)] transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(100, (column.veiculos.length / 8) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* RPG Catalog Style Cards - Compact & Editorial */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-2">
                      {column.veiculos.map((veiculo, index) => (
                        <div 
                          key={veiculo.id}
                          className="group border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-cyan-50/20 hover:to-blue-50/15 hover:border-b-cyan-300/20 transition-all duration-300 cursor-pointer hover:shadow-[0_1px_4px_rgba(6,182,212,0.08)]"
                          onClick={() => setSelectedVeiculo(veiculo)}
                        >
                          {/* Enhanced RPG Card Layout */}
                          <div className="p-4 group-hover:p-5 transition-all duration-300">
                            {/* Header: Model + Status */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-light text-gray-900 tracking-wide mb-1 truncate group-hover:text-cyan-900 group-hover:font-normal transition-all duration-300">
                                  {veiculo.modelo}
                                </h4>
                                <div className="text-xs text-gray-500 font-light tracking-wider uppercase group-hover:text-cyan-600 transition-colors duration-300">
                                  {veiculo.marca} • {veiculo.ano} • {veiculo.categoria}
                                </div>
                              </div>
                              
                              <div className="ml-4 flex flex-col items-end space-y-1 group-hover:scale-105 transition-transform duration-300">
                                {getStatusBadge(veiculo)}
                                {getClasseBadge(veiculo.classe_social)}
                              </div>
                            </div>
                            
                            {/* Enhanced Price with Neon Glow */}
                            <div className="mb-3">
                              <div className="text-lg font-extralight text-gray-900 tracking-wide group-hover:text-cyan-900 group-hover:text-xl group-hover:font-light transition-all duration-300">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                  minimumFractionDigits: 0
                                }).format(veiculo.valor)}
                              </div>
                            </div>

                            {/* Enhanced Vendor Info with Neon Pulse */}
                            {(veiculo.status === 'reservado' || veiculo.status === 'negociando') && veiculo.vendedor_nome && (
                              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:bg-cyan-500 group-hover:shadow-[0_0_3px_rgba(6,182,212,0.5)] transition-all duration-300"></div>
                                <span className="font-light tracking-wider">{veiculo.vendedor_nome}</span>
                                {veiculo.dias_restantes && (
                                  <>
                                    <span className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">•</span>
                                    <span className="text-orange-600 font-light group-hover:text-orange-500 group-hover:font-medium transition-all duration-300">
                                      {veiculo.dias_restantes}d restantes
                                    </span>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Action Buttons - Minimal Editorial */}
                            <div className="flex flex-wrap gap-2">
                              {veiculo.status === 'disponivel' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('reservar', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-cyan-400 hover:text-cyan-700 hover:bg-cyan-50/50 hover:shadow-[0_0_6px_rgba(6,182,212,0.2)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'RESERVANDO...' : 'RESERVAR'}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('negociar', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 bg-gray-900 text-white hover:bg-cyan-600 hover:shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'NEGOCIANDO...' : 'NEGOCIAR'}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('vender', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'VENDENDO...' : 'VENDIDO'}
                                  </button>
                                </>
                              )}

                              {veiculo.status === 'reservado' && veiculo.vendedor_id === vendedorId && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('negociar', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 bg-gray-900 text-white hover:bg-cyan-600 hover:shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'NEGOCIANDO...' : 'NEGOCIAR'}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('vender', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'VENDENDO...' : 'VENDIDO'}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('liberar', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50/50 hover:shadow-[0_0_6px_rgba(251,146,60,0.2)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'LIBERANDO...' : 'LIBERAR'}
                                  </button>
                                </>
                              )}

                              {veiculo.status === 'negociando' && veiculo.vendedor_id === vendedorId && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('vender', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'VENDENDO...' : 'VENDIDO'}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction('cancelar', veiculo.id);
                                    }}
                                    disabled={actionLoading === veiculo.id}
                                    className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-red-400 hover:text-red-700 hover:bg-red-50/50 hover:shadow-[0_0_6px_rgba(248,113,113,0.2)] transition-all duration-300 text-xs font-light tracking-wider disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    {actionLoading === veiculo.id ? 'CANCELANDO...' : 'CANCELAR'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {column.veiculos.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-8 h-8 border border-gray-300 border-dashed mx-auto mb-4"></div>
                            <p className="text-xs font-light tracking-[0.15em] uppercase text-gray-500">
                              Nenhum veículo {column.marca}
                            </p>
                            <p className="text-xs font-light text-gray-400 mt-1 tracking-wider">
                              CATÁLOGO VAZIO
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}