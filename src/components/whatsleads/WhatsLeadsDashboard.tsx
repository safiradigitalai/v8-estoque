'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Upload, 
  Users, 
  TrendingUp, 
  Phone,
  Clock,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Star,
  Settings,
  Zap,
  Target,
  CheckCircle,
  UserCheck
} from 'lucide-react';

// Hook para dados do dashboard de WhatsLeads
function useWhatsLeadsDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leads');
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

interface WhatsLeadsDashboardProps {
  onNavigateToConversas: () => void;
  onNavigateToLeads: () => void;
  onNavigateToConfig: () => void;
}

export function WhatsLeadsDashboard({ 
  onNavigateToConversas, 
  onNavigateToLeads, 
  onNavigateToConfig 
}: WhatsLeadsDashboardProps) {
  const { data, isLoading, error, refresh } = useWhatsLeadsDashboard();

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {/* Header Loading */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-3xl mx-auto shimmer" />
              <div className="w-96 h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded mx-auto shimmer" />
              <div className="w-64 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto shimmer" />
            </div>

            {/* Cards Loading */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shimmer" />
              ))}
            </div>

            {/* Actions Loading */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shimmer" />
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
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-light text-gray-900">Erro ao Carregar</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={refresh}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Dados mock para demonstração (será substituído pela API real)
  const resumo = data?.resumo || {
    total_conversas: 45,
    leads_ativos: 28,
    conversoes_mes: 12,
    taxa_resposta: 85,
    tempo_medio_resposta: 8, // minutos
    leads_novos_hoje: 5
  };

  return (
    <div className="space-y-8">
      {/* Métricas em Duas Colunas - Conversas & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        
        {/* Coluna 1: Status das Conversas */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Status das Conversas</h3>
              <p className="text-gray-600 text-sm">Atividade do WhatsApp Business</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total de Conversas */}
            <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-green-100 text-xs font-mono uppercase tracking-wider">
                    Conversas Ativas
                  </p>
                  <MessageCircle className="w-4 h-4 text-green-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{resumo.total_conversas}</span>
                    <span className="text-xs text-green-200">chats</span>
                  </div>
                  <p className="text-green-200 text-xs">
                    +{resumo.leads_novos_hoje} novos hoje
                  </p>
                </div>
              </div>
            </div>

            {/* Taxa de Resposta */}
            <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                    Taxa Resposta
                  </p>
                  <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                    ↗ +5%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{resumo.taxa_resposta}%</span>
                    <span className="text-xs text-blue-200">média</span>
                  </div>
                  <p className="text-blue-200 text-xs">
                    Tempo médio: {resumo.tempo_medio_resposta}min
                  </p>
                </div>
              </div>
            </div>

            {/* Leads Ativos */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                    Leads Ativos
                  </p>
                  <Users className="w-4 h-4 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{resumo.leads_ativos}</span>
                    <span className="text-xs text-amber-200">em pipeline</span>
                  </div>
                  <p className="text-amber-200 text-xs">
                    Em negociação ativa
                  </p>
                </div>
              </div>
            </div>

            {/* Conversões */}
            <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-100 text-xs font-mono uppercase tracking-wider">
                    Conversões (mês)
                  </p>
                  <TrendingUp className="w-4 h-4 text-purple-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{resumo.conversoes_mes}</span>
                    <span className="text-xs text-purple-200">vendas</span>
                  </div>
                  <p className="text-purple-200 text-xs">
                    ↗ +15% vs anterior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Status do Pipeline */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Pipeline de Vendas</h3>
              <p className="text-gray-600 text-sm">Funil de conversão de leads</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Leads Qualificados */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-indigo-100 text-xs font-mono uppercase tracking-wider">
                    Qualificados
                  </p>
                  <UserCheck className="w-4 h-4 text-indigo-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">18</span>
                    <span className="text-xs text-indigo-200">leads</span>
                  </div>
                  <p className="text-indigo-200 text-xs">
                    64% do pipeline
                  </p>
                </div>
              </div>
            </div>

            {/* Propostas Enviadas */}
            <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-cyan-100 text-xs font-mono uppercase tracking-wider">
                    Propostas
                  </p>
                  <Clock className="w-4 h-4 text-cyan-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">8</span>
                    <span className="text-xs text-cyan-200">enviadas</span>
                  </div>
                  <p className="text-cyan-200 text-xs">
                    Aguardando resposta
                  </p>
                </div>
              </div>
            </div>

            {/* Agendamentos */}
            <div className="bg-gradient-to-br from-teal-500 via-green-600 to-teal-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-teal-100 text-xs font-mono uppercase tracking-wider">
                    Agendamentos
                  </p>
                  <Star className="w-4 h-4 text-teal-200 fill-current" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">6</span>
                    <span className="text-xs text-teal-200">visitas</span>
                  </div>
                  <p className="text-teal-200 text-xs">
                    Próximos 7 dias
                  </p>
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                    Taxa Conversão
                  </p>
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">42.8%</span>
                    <span className="text-xs text-emerald-200">mensal</span>
                  </div>
                  <p className="text-emerald-200 text-xs">
                    ↗ +3.2% vs anterior
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
            <span className="font-mono text-xs text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 hover:text-green-500 select-none">
              02
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-green-200 to-gray-200" />
            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
              Ferramentas de Atendimento
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Acesso rápido às principais funcionalidades do WhatsLeads
          </p>
        </div>

        {/* Ferramentas Grid - Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Central de Conversas */}
          <button 
            onClick={onNavigateToConversas}
            className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-green-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/50 active:scale-[0.98] text-left cursor-pointer"
            style={{ minHeight: '120px' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    Central de Conversas
                  </h3>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    C
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Interface de chat em tempo real
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{resumo.total_conversas} conversas</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{resumo.leads_novos_hoje} novas hoje</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Gestão de Leads */}
          <button 
            onClick={onNavigateToLeads}
            className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 active:scale-[0.98] text-left cursor-pointer"
            style={{ minHeight: '120px' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Gestão de Leads
                  </h3>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    L
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Pipeline e funil de vendas
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{resumo.leads_ativos} ativos</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{resumo.conversoes_mes} convertidos</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Configurações WhatsApp */}
          <button 
            onClick={onNavigateToConfig}
            className="group w-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-purple-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 active:scale-[0.98] text-left cursor-pointer"
            style={{ minHeight: '120px' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    Configurações
                  </h3>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    S
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  WhatsApp Business API
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>API conectada</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{resumo.taxa_resposta}% resposta</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}