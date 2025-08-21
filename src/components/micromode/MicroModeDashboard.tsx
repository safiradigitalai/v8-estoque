'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Timer, 
  CheckCircle,
  Crown,
  Star,
  ArrowUp,
  Zap,
  Award
} from 'lucide-react';

interface MicroModeDashboardProps {
  vendedorId?: number;
  vendedorNome?: string;
  isAdmin?: boolean;
  onViewChange: (view: 'dashboard' | 'kanban' | 'ranking' | 'performance') => void;
}

interface VendedorStats {
  pontuacao: number;
  ranking: number;
  vendas_mes: number;
  meta_mensal: number;
  taxa_conversao: number;
  veiculos_reservados: number;
  veiculos_negociando: number;
  nivel: string;
  progresso_nivel: number;
}

export function MicroModeDashboard({ 
  vendedorId, 
  vendedorNome, 
  isAdmin,
  onViewChange 
}: MicroModeDashboardProps) {
  const [stats, setStats] = useState<VendedorStats>({
    pontuacao: 1250,
    ranking: 2,
    vendas_mes: 8,
    meta_mensal: 12,
    taxa_conversao: 65,
    veiculos_reservados: 3,
    veiculos_negociando: 2,
    nivel: 'intermediario',
    progresso_nivel: 75
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const progressoMeta = (stats.vendas_mes / stats.meta_mensal) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            MICRO<span className="text-3xl">MODE</span>
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="space-y-8 sm:space-y-12 pb-20 sm:pb-12 pt-6 sm:pt-8">
      {/* Hero Section - Enhanced Editorial Style */}
      <div className="relative px-6">
        <div className="text-center mb-12">
          <div className="w-24 h-px bg-gray-300 mx-auto mb-6 hover:bg-cyan-400 hover:w-32 transition-all duration-500"></div>
          {vendedorNome && (
            <p className="text-sm font-light text-gray-500 tracking-[0.2em] uppercase hover:text-cyan-600 transition-colors duration-300">
              Bem-vindo, {vendedorNome}
            </p>
          )}
        </div>

        {/* Status Cards - Padrão do Sistema */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Ranking Position */}
          <div className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-cyan-100 text-xs font-mono uppercase tracking-wider">
                  Ranking
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  #{stats.ranking}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {stats.pontuacao}
                  </span>
                  <span className="text-xs text-cyan-200">pontos</span>
                </div>
                <p className="text-cyan-200 text-xs">
                  Posição #{stats.ranking} no ranking
                </p>
              </div>
            </div>
          </div>

          {/* Meta Progress */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                  Meta Mensal
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  {Math.round((stats.vendas_mes / stats.meta_mensal) * 100)}%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {stats.vendas_mes}
                  </span>
                  <span className="text-xs text-blue-200">/ {stats.meta_mensal}</span>
                </div>
                <p className="text-blue-200 text-xs">
                  {Math.round((stats.vendas_mes / stats.meta_mensal) * 100)}% concluída
                </p>
              </div>
            </div>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                  Conversão
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  ↗ +2%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {stats.taxa_conversao}%
                  </span>
                  <span className="text-xs text-emerald-200">taxa</span>
                </div>
                <p className="text-emerald-200 text-xs">
                  Últimos 30 dias
                </p>
              </div>
            </div>
          </div>

          {/* Veículos Ativos */}
          <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-100 text-xs font-mono uppercase tracking-wider">
                  Veículos Ativos
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  {stats.veiculos_reservados + stats.veiculos_negociando}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {stats.veiculos_reservados}
                  </span>
                  <span className="text-xs text-purple-200">reservados</span>
                </div>
                <p className="text-purple-200 text-xs">
                  {stats.veiculos_negociando} negociando
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section - Mobile-First UX */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-light text-gray-800 tracking-wide mb-3 sm:mb-4">
            Ações Principais
          </h2>
          <div className="w-12 sm:w-16 h-px bg-gray-300 mx-auto"></div>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 max-w-6xl mx-auto">
          {/* Ver Veículos - Mobile-First */}
          <button
            onClick={() => onViewChange('kanban')}
            className="group w-full bg-white border border-gray-200 rounded-xl p-6 text-left transition-all duration-300 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100/50 active:scale-[0.98] lg:text-center lg:p-8 cursor-pointer"
          >
            <div className="flex items-center space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 lg:w-14 lg:h-14">
                <Zap className="w-6 h-6 text-white lg:w-7 lg:h-7" />
              </div>
              <div className="flex-1 lg:flex-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-cyan-700 transition-colors lg:text-xl lg:mb-2">
                  Veículos
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-cyan-600 transition-colors lg:text-base">
                  Sistema Kanban
                </p>
              </div>
            </div>
          </button>

          {/* Ver Ranking - Mobile-First */}
          <button
            onClick={() => onViewChange('ranking')}
            className="group w-full bg-white border border-gray-200 rounded-xl p-6 text-left transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 active:scale-[0.98] lg:text-center lg:p-8 cursor-pointer"
          >
            <div className="flex items-center space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 lg:w-14 lg:h-14">
                <Trophy className="w-6 h-6 text-white lg:w-7 lg:h-7" />
              </div>
              <div className="flex-1 lg:flex-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors lg:text-xl lg:mb-2">
                  Ranking
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-amber-600 transition-colors lg:text-base">
                  Competição
                </p>
              </div>
            </div>
          </button>

          {/* Performance - Mobile-First */}
          {vendedorId && (
            <button
              onClick={() => onViewChange('performance')}
              className="group w-full bg-white border border-gray-200 rounded-xl p-6 text-left transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 active:scale-[0.98] lg:text-center lg:p-8 cursor-pointer"
            >
              <div className="flex items-center space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 lg:w-14 lg:h-14">
                  <Star className="w-6 h-6 text-white lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 lg:flex-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors lg:text-xl lg:mb-2">
                    Performance
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors lg:text-base">
                    Meu Histórico
                  </p>
                </div>
              </div>
            </button>
          )}

        </div>
      </div>

      </div>
    </div>
  );
}