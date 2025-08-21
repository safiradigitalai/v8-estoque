'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Trophy,
  Zap
} from 'lucide-react';

interface PerformanceVendedorProps {
  vendedorId?: number;
  onVoltar: () => void;
}

interface PerformanceData {
  vendedor: {
    id: number;
    nome: string;
    nivel: string;
    pontuacao_total: number;
    ranking_atual: number;
  };
  metricas_mes: {
    vendas: number;
    meta: number;
    faturamento: number;
    pontos_ganhos: number;
    taxa_conversao: number;
    ticket_medio: number;
  };
  historico_6_meses: Array<{
    mes: string;
    vendas: number;
    faturamento: number;
    pontos: number;
    ranking: number;
  }>;
  conquistas: Array<{
    id: number;
    titulo: string;
    descricao: string;
    data_conquista: string;
    icone: string;
  }>;
}

export function PerformanceVendedor({ vendedorId, onVoltar }: PerformanceVendedorProps) {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dados simulados
    const mockData: PerformanceData = {
      vendedor: {
        id: vendedorId || 1,
        nome: 'João Silva',
        nivel: 'expert',
        pontuacao_total: 2450,
        ranking_atual: 1
      },
      metricas_mes: {
        vendas: 15,
        meta: 12,
        faturamento: 2850000,
        pontos_ganhos: 450,
        taxa_conversao: 85,
        ticket_medio: 190000
      },
      historico_6_meses: [
        { mes: 'Mar/25', vendas: 10, faturamento: 1900000, pontos: 300, ranking: 3 },
        { mes: 'Abr/25', vendas: 12, faturamento: 2280000, pontos: 360, ranking: 2 },
        { mes: 'Mai/25', vendas: 14, faturamento: 2660000, pontos: 420, ranking: 1 },
        { mes: 'Jun/25', vendas: 11, faturamento: 2090000, pontos: 330, ranking: 2 },
        { mes: 'Jul/25', vendas: 13, faturamento: 2470000, pontos: 390, ranking: 1 },
        { mes: 'Ago/25', vendas: 15, faturamento: 2850000, pontos: 450, ranking: 1 }
      ],
      conquistas: [
        {
          id: 1,
          titulo: 'Top Performer',
          descricao: 'Ficou em 1º lugar por 3 meses consecutivos',
          data_conquista: '2025-08-01',
          icone: 'Trophy'
        },
        {
          id: 2,
          titulo: 'Meta Destroyer',
          descricao: 'Bateu a meta por 6 meses seguidos',
          data_conquista: '2025-07-15',
          icone: 'Target'
        },
        {
          id: 3,
          titulo: 'Conversion Master',
          descricao: 'Atingiu 85% de taxa de conversão',
          data_conquista: '2025-06-20',
          icone: 'Zap'
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [vendedorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            PERFORMANCE
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const progressoMeta = (data.metricas_mes.vendas / data.metricas_mes.meta) * 100;

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6">
      {/* Mobile-First Performance Header */}
      <header className="mb-8 sm:mb-12">
        
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
                Performance
              </h1>
              <div className="text-xs text-gray-500 font-light">
                {data.vendedor.nome} • #{data.vendedor.ranking_atual}º lugar
              </div>
            </div>
          </div>
          
          {/* Editorial Status */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-px bg-gray-300"></div>
              <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase">Meu Desempenho</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-purple-700 transition-colors duration-300">{data.vendedor.pontuacao_total}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-purple-600 transition-colors duration-300">Pontos</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-purple-300 transition-colors duration-300"></div>
              </div>
              
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-cyan-700 transition-colors duration-300">{data.vendedor.nivel}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-cyan-600 transition-colors duration-300">Nível</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-cyan-300 transition-colors duration-300"></div>
              </div>
              
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">{Math.round(progressoMeta)}%</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-blue-600 transition-colors duration-300">Meta</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-blue-300 transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={onVoltar}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-extralight text-gray-900 tracking-wide lg:tracking-[0.3em] mb-1">
                  PERFORMANCE
                </h1>
                <div className="flex items-center space-x-3 lg:space-x-4 text-xs font-light text-gray-500 tracking-wide lg:tracking-[0.2em]">
                  <span>Meu Desempenho</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>

            <div className="text-xs font-light tracking-wider text-gray-500">
              {data.vendedor.nome} • #{data.vendedor.ranking_atual}º lugar
            </div>
          </div>
        </div>
      </header>

      {/* Métricas do Mês Atual */}
      <section className="mb-8 sm:mb-12">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-px bg-gray-300"></div>
            <h2 className="text-base sm:text-lg font-light text-gray-800 tracking-[0.15em]">
              MÉTRICAS {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg sm:border-0 sm:bg-transparent">
          <div className="p-4 sm:p-8">
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6 lg:gap-8">
            {/* Meta Progress */}
            <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-extralight text-white mb-2">
                  {data.metricas_mes.vendas}/{data.metricas_mes.meta}
                </div>
                <div className="text-xs font-light text-blue-100 tracking-[0.15em] uppercase mb-4">
                  Meta do Mês
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm font-light text-blue-100">
                  {Math.round(progressoMeta)}% concluída
                </div>
              </div>
            </div>

            {/* Faturamento */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-extralight text-white mb-2">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(data.metricas_mes.faturamento)}
                </div>
                <div className="text-xs font-light text-emerald-100 tracking-[0.15em] uppercase mb-4">
                  Faturamento
                </div>
                <div className="text-sm font-light text-emerald-100">
                  Ticket médio: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact',
                    maximumFractionDigits: 0
                  }).format(data.metricas_mes.ticket_medio)}
                </div>
              </div>
            </div>

            {/* Pontuação */}
            <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-extralight text-white mb-2">
                  {data.metricas_mes.pontos_ganhos}
                </div>
                <div className="text-xs font-light text-purple-100 tracking-[0.15em] uppercase mb-4">
                  Pontos Ganhos
                </div>
                <div className="text-sm font-light text-purple-100">
                  Total: {data.vendedor.pontuacao_total} pts
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Histórico 6 Meses */}
      <section className="mb-8 sm:mb-12">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-px bg-gray-300"></div>
            <h2 className="text-base sm:text-lg font-light text-gray-800 tracking-[0.15em]">
              HISTÓRICO 6 MESES
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg sm:border-0 sm:bg-transparent">
          <div className="p-4 sm:p-8">
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-4">
              {data.historico_6_meses.map((mes, index) => {
                const colors = [
                  'from-blue-50 to-blue-100/50 border-blue-200',
                  'from-emerald-50 to-emerald-100/50 border-emerald-200', 
                  'from-purple-50 to-purple-100/50 border-purple-200',
                  'from-amber-50 to-amber-100/50 border-amber-200',
                  'from-cyan-50 to-cyan-100/50 border-cyan-200',
                  'from-indigo-50 to-indigo-100/50 border-indigo-200'
                ];
                const rankingColors = [
                  'text-blue-700', 'text-emerald-700', 'text-purple-700', 
                  'text-amber-700', 'text-cyan-700', 'text-indigo-700'
                ];
                return (
                  <div key={index} className={`bg-gradient-to-br ${colors[index]} border rounded-lg p-4 transition-all duration-300 hover:shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium text-gray-900">{mes.mes}</h3>
                      <div className={`text-lg font-light ${rankingColors[index]}`}>#{mes.ranking}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{mes.vendas}</div>
                        <div className="text-xs text-gray-500">vendas</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{mes.pontos}</div>
                        <div className="text-xs text-gray-500">pontos</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            notation: 'compact',
                            maximumFractionDigits: 0
                          }).format(mes.faturamento)}
                        </div>
                        <div className="text-xs text-gray-500">faturamento</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-6 gap-6">
              {data.historico_6_meses.map((mes, index) => {
                const hoverColors = [
                  'hover:text-blue-700', 'hover:text-emerald-700', 'hover:text-purple-700',
                  'hover:text-amber-700', 'hover:text-cyan-700', 'hover:text-indigo-700'
                ];
                const accentColors = [
                  'hover:bg-blue-300', 'hover:bg-emerald-300', 'hover:bg-purple-300',
                  'hover:bg-amber-300', 'hover:bg-cyan-300', 'hover:bg-indigo-300'
                ];
                return (
                  <div key={index} className="text-center group">
                    <div className={`text-sm font-light text-gray-500 tracking-wider uppercase mb-4 ${hoverColors[index]} transition-colors duration-300`}>
                      {mes.mes}
                    </div>
                    <div className="space-y-1 mb-4">
                      <div className={`w-full h-px bg-gray-200 ${accentColors[index]} transition-colors duration-300`}></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-lg font-light text-gray-800">
                          {mes.vendas}
                        </div>
                        <div className="text-xs font-light text-gray-500 tracking-wider">
                          vendas
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-light text-gray-800">
                          #{mes.ranking}
                        </div>
                        <div className="text-xs font-light text-gray-500 tracking-wider">
                          posição
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-light text-gray-800">
                          {mes.pontos}
                        </div>
                        <div className="text-xs font-light text-gray-500 tracking-wider">
                          pontos
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Conquistas */}
      <section>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-px bg-gray-300"></div>
            <h2 className="text-base sm:text-lg font-light text-gray-800 tracking-[0.15em]">
              CONQUISTAS RECENTES
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg sm:border-0 sm:bg-transparent">
          <div className="p-4 sm:p-8">
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
              {data.conquistas.map((conquista, index) => {
                const gradients = [
                  'from-amber-400 via-yellow-500 to-orange-600',
                  'from-cyan-400 via-blue-500 to-indigo-600', 
                  'from-purple-400 via-pink-500 to-red-500'
                ];
                const textColors = [
                  'text-amber-100',
                  'text-cyan-100',
                  'text-purple-100'
                ];
                return (
                  <div key={conquista.id} className={`p-6 sm:p-8 bg-gradient-to-br ${gradients[index]} rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:scale-105 text-white relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        {conquista.icone === 'Trophy' && <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-white" />}
                        {conquista.icone === 'Target' && <Target className="w-8 h-8 lg:w-10 lg:h-10 text-white" />}
                        {conquista.icone === 'Zap' && <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-white" />}
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-3 sm:mb-4">
                        {conquista.titulo}
                      </h3>
                      
                      <p className={`text-sm font-light ${textColors[index]} mb-4 sm:mb-6 leading-relaxed`}>
                        {conquista.descricao}
                      </p>
                      
                      <div className={`text-xs font-light ${textColors[index]} tracking-wider bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block`}>
                        {new Date(conquista.data_conquista).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}