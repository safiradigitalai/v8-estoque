'use client';

import { Users, TrendingUp, Target, Award, Star, Crown, AlertCircle } from 'lucide-react';
import { useVendedores } from '@/hooks/useVendedores';
import { EmptyState } from '@/components/common/EmptyState';
import type { DashboardVendedor } from '@/types/database';

interface TeamPerformanceTabProps {
  isLoading?: boolean;
}

// Componente de Seção Editorial reutilizado
function EditorialSection({ 
  titulo, 
  numero, 
  children,
  color = 'blue'
}: {
  titulo: string;
  numero: string;
  children: React.ReactNode;
  color?: 'blue' | 'cyan' | 'indigo' | 'slate';
}) {
  const colorClasses = {
    blue: 'group-hover:text-blue-500 group-hover:shadow-blue-200',
    cyan: 'group-hover:text-cyan-400 group-hover:shadow-cyan-200',
    indigo: 'group-hover:text-indigo-500 group-hover:shadow-indigo-200',
    slate: 'group-hover:text-slate-500 group-hover:shadow-slate-200'
  };

  return (
    <section className="animate-fadeInUp">
      <div className="mb-8 lg:mb-12 group">
        <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
          <span className={`font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 ${colorClasses[color]} select-none`}>
            {numero}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-blue-200 group-hover:via-indigo-200 group-hover:to-blue-200 transition-all duration-500" />
        </div>
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

// Grid Editorial reutilizado
function EditorialGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-12 lg:space-y-16">
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
      `}</style>
      {children}
    </div>
  );
}

export function TeamPerformanceTab({ isLoading: propIsLoading }: TeamPerformanceTabProps) {
  const { vendedores, isLoading, isError, refresh } = useVendedores();

  // Estado de loading combinado
  const loading = propIsLoading || isLoading;

  if (loading) {
    return (
      <EditorialGrid>
        <div className="animate-pulse space-y-12">
          {/* Loading state com o mesmo padrão editorial */}
          <div className="space-y-8">
            <div className="flex items-baseline space-x-6">
              <div className="w-12 h-4 bg-gradient-to-r from-gray-200 to-gray-300 shimmer" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="w-96 h-8 bg-gradient-to-r from-gray-200 to-gray-300 shimmer" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 shimmer" />
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 shimmer" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 shimmer w-3/4" />
                </div>
              </div>
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
      </EditorialGrid>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar equipe"
        description="Não foi possível carregar os dados da equipe. Verifique sua conexão e tente novamente."
        action={{
          label: "Tentar novamente",
          onClick: refresh
        }}
      />
    );
  }

  if (!vendedores || vendedores.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum vendedor encontrado"
        description="Não há vendedores cadastrados no sistema ou todos estão inativos."
      />
    );
  }

  // Calcular métricas da equipe
  const totalVendedores = vendedores.length;
  const vendedoresAtivos = vendedores.filter(v => v.status === 'ativo').length;
  const metaEquipe = vendedores.reduce((sum, v) => sum + v.meta_mensal, 0);
  const faturamentoEquipe = vendedores.reduce((sum, v) => sum + v.faturamento_mes_atual, 0);
  const vendasEquipe = vendedores.reduce((sum, v) => sum + v.vendas_mes_atual, 0);
  const conversaoMedia = vendedores.reduce((sum, v) => sum + v.taxa_conversao_atual, 0) / vendedores.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getNivelInfo = (nivel: string) => {
    switch (nivel) {
      case 'expert':
        return { label: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100', icon: Crown };
      case 'avancado':
        return { label: 'Avançado', color: 'text-blue-600', bg: 'bg-blue-100', icon: Award };
      case 'intermediario':
        return { label: 'Intermediário', color: 'text-green-600', bg: 'bg-green-100', icon: Star };
      default:
        return { label: 'Iniciante', color: 'text-gray-600', bg: 'bg-gray-100', icon: Target };
    }
  };

  return (
    <EditorialGrid>
      {/* Header padrão igual inventário/leads */}
      <div className="text-center space-y-2 md:space-y-3 animate-fadeInUp">
        <div className="flex items-center justify-center space-x-3 md:space-x-4">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1" />
          <h2 className="text-lg md:text-2xl font-light text-gray-900 tracking-tight">
            Equipe & Performance
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent flex-1" />
        </div>
        <p className="text-gray-600 font-mono text-xs md:text-sm uppercase tracking-widest">
          Performance da equipe de vendas
        </p>
      </div>

      {/* Métricas Principais - Cards gradiente como inventário */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fadeInUp">
        {/* Meta da Equipe */}
        <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-6 h-6 text-blue-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                {((faturamentoEquipe / metaEquipe) * 100) >= 100 ? '✓' : `${((faturamentoEquipe / metaEquipe) * 100).toFixed(0)}%`}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                Meta Equipe
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{((faturamentoEquipe / metaEquipe) * 100).toFixed(1)}%</span>
                <span className="text-xs text-blue-200">atingido</span>
              </div>
              <p className="text-blue-200 text-xs">
                {formatCurrency(faturamentoEquipe)} / {formatCurrency(metaEquipe)}
              </p>
            </div>
          </div>
        </div>

        {/* Vendas Totais */}
        <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                +{vendasEquipe}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                Vendas
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{vendasEquipe}</span>
                <span className="text-xs text-emerald-200">este mês</span>
              </div>
              <p className="text-emerald-200 text-xs">
                {conversaoMedia.toFixed(1)}% conversão
              </p>
            </div>
          </div>
        </div>

        {/* Equipe Ativa */}
        <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-6 h-6 text-purple-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                {vendedoresAtivos}/{totalVendedores}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-purple-100 text-xs font-mono uppercase tracking-wider">
                Equipe
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{vendedoresAtivos}</span>
                <span className="text-xs text-purple-200">ativos</span>
              </div>
              <p className="text-purple-200 text-xs">
                {vendedores.filter(v => v.meta_atingida_atual).length} na meta
              </p>
            </div>
          </div>
        </div>

        {/* Performance Média */}
        <div className="bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-6 h-6 text-orange-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                Médio
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-orange-100 text-xs font-mono uppercase tracking-wider">
                Ticket Médio
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg md:text-xl font-bold">{formatCurrency(faturamentoEquipe / vendedoresAtivos)}</span>
              </div>
              <p className="text-orange-200 text-xs">
                Por vendedor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings da Equipe */}
      <EditorialSection titulo="Rankings da Equipe" numero="02" color="indigo">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {vendedores
            .sort((a, b) => a.ranking_mes - b.ranking_mes)
            .map((vendedor, index) => {
              const nivelInfo = getNivelInfo(vendedor.nivel);
              const NivelIcon = nivelInfo.icon;
              const progressoMeta = Math.min((vendedor.faturamento_mes_atual / vendedor.meta_mensal) * 100, 100);
              
              return (
                <div key={vendedor.id} className="group">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-gray-900/5 group-hover:shadow-xl group-hover:shadow-gray-900/10 transition-all duration-500">
                    {/* Header Editorial */}
                    <div className="p-6 border-b border-gray-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Posição no ranking */}
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="font-mono text-lg font-bold text-gray-700">
                              #{vendedor.ranking_mes}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-light text-gray-900 tracking-tight mb-1">
                              {vendedor.nome}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-mono ${nivelInfo.bg} ${nivelInfo.color} tracking-wider`}>
                                <NivelIcon className="w-3 h-3" />
                                <span>{nivelInfo.label.toUpperCase()}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Meta */}
                        <div className="text-right">
                          <div className={`text-xl font-light ${vendedor.meta_atingida_atual ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {progressoMeta.toFixed(1)}%
                          </div>
                          <div className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                            {vendedor.meta_atingida_atual ? 'Meta Atingida' : 'Em Andamento'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Métricas */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">Faturamento</h4>
                          <p className="text-lg font-light text-gray-900">{formatCurrency(vendedor.faturamento_mes_atual)}</p>
                          <p className="font-mono text-xs text-gray-500">Meta: {formatCurrency(vendedor.meta_mensal)}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">Performance</h4>
                          <p className="text-lg font-light text-gray-900">{vendedor.vendas_mes_atual} vendas</p>
                          <p className="font-mono text-xs text-gray-500">{vendedor.taxa_conversao_atual.toFixed(1)}% conversão</p>
                        </div>
                      </div>
                      
                      {/* Barra de progresso editorial */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Progresso da Meta</span>
                          <span className="font-mono text-xs text-gray-500">{progressoMeta.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1">
                          <div 
                            className={`h-1 transition-all duration-1000 ${vendedor.meta_atingida_atual ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </EditorialSection>
    </EditorialGrid>
  );
}