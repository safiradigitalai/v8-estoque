'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  ArrowLeft,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface RankingVendedoresProps {
  vendedorId?: number;
  isAdmin?: boolean;
  onVoltar: () => void;
}

interface VendedorRanking {
  id: number;
  nome: string;
  foto_url?: string;
  pontuacao: number;
  posicao: number;
  posicao_anterior: number;
  vendas_mes: number;
  meta_mensal: number;
  taxa_conversao: number;
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
  badge?: string;
  tendencia: 'subindo' | 'descendo' | 'estavel';
}

export function RankingVendedores({ vendedorId, isAdmin, onVoltar }: RankingVendedoresProps) {
  const [ranking, setRanking] = useState<VendedorRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dados simulados
    const mockRanking: VendedorRanking[] = [
      {
        id: 1,
        nome: 'João Silva',
        pontuacao: 2450,
        posicao: 1,
        posicao_anterior: 2,
        vendas_mes: 15,
        meta_mensal: 12,
        taxa_conversao: 85,
        nivel: 'expert',
        badge: '🏆 TOP PERFORMER',
        tendencia: 'subindo'
      },
      {
        id: 2,
        nome: 'Maria Santos',
        pontuacao: 2180,
        posicao: 2,
        posicao_anterior: 1,
        vendas_mes: 12,
        meta_mensal: 12,
        taxa_conversao: 78,
        nivel: 'avancado',
        badge: '⭐ VENDEDOR DO MÊS',
        tendencia: 'descendo'
      },
      {
        id: 3,
        nome: 'Carlos Oliveira',
        pontuacao: 1890,
        posicao: 3,
        posicao_anterior: 3,
        vendas_mes: 10,
        meta_mensal: 10,
        taxa_conversao: 72,
        nivel: 'avancado',
        tendencia: 'estavel'
      },
      {
        id: 4,
        nome: 'Ana Costa',
        pontuacao: 1650,
        posicao: 4,
        posicao_anterior: 5,
        vendas_mes: 8,
        meta_mensal: 8,
        taxa_conversao: 68,
        nivel: 'intermediario',
        tendencia: 'subindo'
      },
      {
        id: 5,
        nome: 'Pedro Lima',
        pontuacao: 1420,
        posicao: 5,
        posicao_anterior: 4,
        vendas_mes: 6,
        meta_mensal: 8,
        taxa_conversao: 65,
        nivel: 'intermediario',
        tendencia: 'descendo'
      }
    ];

    setTimeout(() => {
      setRanking(mockRanking);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getNivelConfig = (nivel: string) => {
    const configs = {
      'expert': { color: 'text-purple-600 bg-purple-50', label: 'EXPERT', icon: '👑' },
      'avancado': { color: 'text-blue-600 bg-blue-50', label: 'AVANÇADO', icon: '⭐' },
      'intermediario': { color: 'text-green-600 bg-green-50', label: 'INTERMEDIÁRIO', icon: '📈' },
      'iniciante': { color: 'text-gray-600 bg-gray-50', label: 'INICIANTE', icon: '🌱' }
    };
    return configs[nivel as keyof typeof configs];
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subindo':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'descendo':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankingIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-600" />;
      case 2:
        return <Trophy className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-light text-gray-600">{posicao}</span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            RANKING
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6">
      {/* Mobile-First Ranking Header */}
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
                Rankings
              </h1>
              <div className="text-xs text-gray-500 font-light">
                Competição de Vendas • {new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          {/* Status Editorial */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-px bg-gray-300"></div>
              <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase">Status da Competição</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-extralight text-gray-900 mb-1">Atualizado agora</div>
              <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase">Tempo Real</div>
              <div className="w-full h-px bg-gray-200 mt-2"></div>
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
                  RANKINGS
                </h1>
                <div className="flex items-center space-x-3 lg:space-x-4 text-xs font-light text-gray-500 tracking-wide lg:tracking-[0.2em]">
                  <span>Competição de Vendas</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>

            <div className="text-xs font-light tracking-wider text-gray-500">
              Atualizado em tempo real
            </div>
          </div>
        </div>
      </header>

      {/* Podium - Top 3 */}
      <section className="mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-3 justify-center">
            <div className="w-8 h-px bg-gray-300"></div>
            <h2 className="text-base sm:text-lg font-light text-gray-800 tracking-[0.15em]">
              TOP PERFORMERS
            </h2>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {ranking.slice(0, 3).map((vendedor, index) => (
            <div 
              key={vendedor.id}
              className={`p-4 sm:p-6 border border-gray-100 rounded-lg transition-all duration-300 hover:shadow-sm ${
                vendedor.id === vendedorId ? 'bg-cyan-50 border-cyan-200' : 'bg-white'
              } ${index === 0 ? 'sm:order-2' : index === 1 ? 'sm:order-1' : 'sm:order-3'}`}
            >
              {/* Mobile Layout */}
              <div className="sm:hidden flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getRankingIcon(vendedor.posicao)}
                </div>
                
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-light text-gray-600">
                    {vendedor.nome.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {vendedor.nome}
                  </h3>
                  <div className="text-lg font-light text-gray-700">
                    {vendedor.pontuacao} pts
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-light mt-1 ${getNivelConfig(vendedor.nivel).color}`}>
                    <span>{getNivelConfig(vendedor.nivel).icon}</span>
                    <span>{getNivelConfig(vendedor.nivel).label}</span>
                  </div>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden sm:block text-center">
                {/* Posição */}
                <div className="flex justify-center mb-6">
                  {getRankingIcon(vendedor.posicao)}
                </div>

                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-lg font-light text-gray-600">
                    {vendedor.nome.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Nome e Badge */}
                <h3 className="text-lg font-light text-gray-800 tracking-wide mb-2">
                  {vendedor.nome}
                </h3>
                
                {vendedor.badge && (
                  <div className="text-xs font-light text-gray-600 mb-4 tracking-wider">
                    {vendedor.badge}
                  </div>
                )}

                {/* Pontuação */}
                <div className="text-2xl font-extralight text-gray-800 mb-2">
                  {vendedor.pontuacao}
                </div>
                <div className="text-xs font-light text-gray-500 tracking-wider uppercase mb-4">
                  Pontos
                </div>

                {/* Nível */}
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-light tracking-wider ${getNivelConfig(vendedor.nivel).color}`}>
                  <span>{getNivelConfig(vendedor.nivel).icon}</span>
                  <span>{getNivelConfig(vendedor.nivel).label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Classificação Completa */}
      <section>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-px bg-gray-300"></div>
            <h2 className="text-base sm:text-lg font-light text-gray-800 tracking-[0.15em]">
              CLASSIFICAÇÃO COMPLETA
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-0 sm:divide-y sm:divide-gray-100 sm:border sm:border-gray-100 sm:rounded-lg sm:bg-white">
          {ranking.map((vendedor) => (
            <div 
              key={vendedor.id}
              className={`p-4 sm:p-6 transition-all duration-300 rounded-lg sm:rounded-none ${
                vendedor.id === vendedorId ? 'bg-cyan-50 border border-cyan-200 sm:border-0 sm:bg-cyan-50' : 'bg-white border border-gray-100 sm:border-0 sm:bg-transparent hover:bg-gray-50'
              }`}
            >
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-xl font-light text-gray-700 w-6 text-center">
                      {vendedor.posicao}
                    </div>
                    {getTendenciaIcon(vendedor.tendencia)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-light text-gray-600">
                      {vendedor.nome.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {vendedor.nome}
                    </h3>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-light mt-1 ${getNivelConfig(vendedor.nivel).color}`}>
                      <span>{getNivelConfig(vendedor.nivel).icon}</span>
                      <span>{getNivelConfig(vendedor.nivel).label}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-light text-gray-900">
                      {vendedor.pontuacao}
                    </div>
                    <div className="text-xs text-gray-500">pts</div>
                  </div>
                </div>
                
                {/* Stats Mobile */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{vendedor.vendas_mes}</div>
                    <div className="text-xs text-gray-500">Vendas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{vendedor.taxa_conversao}%</div>
                    <div className="text-xs text-gray-500">Conversão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{Math.round((vendedor.vendas_mes / vendedor.meta_mensal) * 100)}%</div>
                    <div className="text-xs text-gray-500">Meta</div>
                  </div>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                {/* Posição e Info Principal */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-extralight text-gray-600 w-8 text-center">
                      {vendedor.posicao}
                    </div>
                    {getTendenciaIcon(vendedor.tendencia)}
                  </div>

                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-light text-gray-600">
                      {vendedor.nome.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-gray-800 tracking-wide">
                      {vendedor.nome}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-light tracking-wider ${getNivelConfig(vendedor.nivel).color}`}>
                        <span>{getNivelConfig(vendedor.nivel).icon}</span>
                        <span>{getNivelConfig(vendedor.nivel).label}</span>
                      </div>
                      {vendedor.badge && (
                        <span className="text-xs font-light text-gray-500 tracking-wider">
                          {vendedor.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Métricas Desktop */}
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-light text-gray-800">
                      {vendedor.pontuacao}
                    </div>
                    <div className="text-xs font-light text-gray-500 tracking-wider uppercase">
                      Pontos
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-light text-gray-800">
                      {vendedor.vendas_mes}/{vendedor.meta_mensal}
                    </div>
                    <div className="text-xs font-light text-gray-500 tracking-wider uppercase">
                      Meta
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-light text-gray-800">
                      {vendedor.taxa_conversao}%
                    </div>
                    <div className="text-xs font-light text-gray-500 tracking-wider uppercase">
                      Conversão
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}