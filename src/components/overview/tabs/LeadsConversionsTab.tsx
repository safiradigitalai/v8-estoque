'use client';

import { MessageCircle, TrendingUp, Users, Phone, Mail, AlertCircle } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { EmptyState } from '@/components/common/EmptyState';

interface LeadsConversionsTabProps {
  isLoading?: boolean;
}

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

export function LeadsConversionsTab({ isLoading: propIsLoading }: LeadsConversionsTabProps) {
  const { leadsData, isLoading, isError, refresh } = useLeads();
  
  // Estado de loading combinado
  const loading = propIsLoading || isLoading;

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0.0%';
    return `${value.toFixed(1)}%`;
  };

  const formatTempo = (horas: number) => {
    if (horas < 24) {
      return `${Math.round(horas)} horas`;
    } else {
      const dias = Math.floor(horas / 24);
      return `${dias} dia${dias > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <EditorialGrid>
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gradient-to-r from-gray-100 to-green-100 rounded-xl shimmer" />
            <div className="h-64 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl shimmer" />
          </div>
        </div>
      </EditorialGrid>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar leads"
        description="Não foi possível carregar os dados de leads. Verifique sua conexão e tente novamente."
        action={{
          label: "Tentar novamente",
          onClick: refresh
        }}
      />
    );
  }

  if (!leadsData) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nenhum lead encontrado"
        description="Não há leads cadastrados no sistema ou todos estão arquivados."
      />
    );
  }

  const { resumo, origens, pipeline, alertas } = leadsData;

  return (
    <EditorialGrid>
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3 animate-fadeInUp">
        <div className="flex items-center justify-center space-x-3 md:space-x-4">
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1" />
          <h2 className="text-lg md:text-2xl font-light text-gray-900 tracking-tight">
            Leads & Conversões
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1" />
        </div>
        <p className="text-gray-600 font-mono text-xs md:text-sm uppercase tracking-widest">
          Pipeline e conversões de leads
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fadeInUp">
        {/* Total de Leads */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <MessageCircle className="w-6 h-6 text-green-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                +12%
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-green-100 text-xs font-mono uppercase tracking-wider">
                Total Leads
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{resumo.total_leads}</span>
                <span className="text-xs text-green-200">mês</span>
              </div>
              <p className="text-green-200 text-xs">
                +{resumo.leads_hoje} hoje
              </p>
            </div>
          </div>
        </div>

        {/* Conversões */}
        <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-blue-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                +8%
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                Conversões
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{resumo.conversoes_mes}</span>
                <span className="text-xs text-blue-200">vendas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-6 h-6 text-purple-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                ↗ +3%
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-purple-100 text-xs font-mono uppercase tracking-wider">
                Taxa Conversão
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{formatPercentage(resumo.taxa_conversao)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Follow-ups Pendentes */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-6 h-6 text-amber-200" />
              <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                ⚠ {resumo.follow_ups_pendentes}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                Follow-ups
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-bold">{resumo.follow_ups_pendentes}</span>
                <span className="text-xs text-amber-200">pendentes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visual e Origens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeInUp">
        {/* Pipeline de Vendas */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Funil de Vendas</h3>
            <p className="text-sm text-gray-600">Distribuição de leads por etapa</p>
          </div>
          
          <div className="space-y-4">
            {pipeline.map((etapa, index) => {
              const total = pipeline.reduce((acc, e) => acc + e.quantidade, 0);
              const percentage = (etapa.quantidade / total) * 100;
              
              return (
                <div key={etapa.etapa} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{etapa.etapa}</span>
                    <span className="text-sm text-gray-600">{etapa.quantidade}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        backgroundColor: etapa.cor,
                        width: `${percentage}%`,
                        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{formatPercentage(percentage)} do total</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Origens de Leads */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Origens dos Leads</h3>
            <p className="text-sm text-gray-600">Performance por canal</p>
          </div>
          
          <div className="space-y-4">
            {origens.map((origem, index) => (
              <div 
                key={origem.nome} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: origem.cor }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{origem.nome}</p>
                    <p className="text-sm text-gray-600">{origem.leads} leads</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{origem.conversoes}</p>
                  <p className="text-sm text-gray-600">{formatPercentage(origem.taxa_conversao)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas e Follow-ups */}
      <div className="animate-fadeInUp">
        <div className="mb-8">
          <div className="flex items-baseline space-x-6 mb-4">
            <span className="font-mono text-xs text-gray-400 tracking-widest">02</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
          <h2 className="text-xl lg:text-2xl font-light tracking-tight text-gray-900">
            Alertas de Follow-up
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertas.map((alerta, index) => {
            const urgenciaConfig = {
              alta: { color: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700', icon: '🚨' },
              media: { color: 'border-yellow-200 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
              baixa: { color: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: '📅' }
            };
            
            const config = urgenciaConfig[alerta.urgencia as keyof typeof urgenciaConfig];
            
            return (
              <div
                key={alerta.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${config.color}`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{alerta.cliente}</p>
                      <p className="text-sm text-gray-600 capitalize">{alerta.tipo_ultimo_contato}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                    {alerta.urgencia}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Pendente há <span className="font-medium">{formatTempo(alerta.horas_pendente)}</span>
                    </p>
                    {alerta.proxima_acao && (
                      <p className="text-xs text-gray-500 mt-1">
                        Próxima: {alerta.proxima_acao}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Vendedor: {alerta.vendedor}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </EditorialGrid>
  );
}