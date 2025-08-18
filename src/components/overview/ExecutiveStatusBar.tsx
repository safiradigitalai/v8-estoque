'use client';

import { TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, BarChart3 } from 'lucide-react';

interface DashboardData {
  resumo: {
    total_veiculos: number;
    valor_total: number;
    por_status: {
      disponivel: number;
      reservado: number;
      vendido: number;
    };
  };
}

interface ExecutiveStatusBarProps {
  dashboard?: DashboardData;
  isLoading?: boolean;
}

export function ExecutiveStatusBar({ dashboard, isLoading = false }: ExecutiveStatusBarProps) {
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg shadow-blue-100/20 p-6 mb-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusMetrics = [
    {
      id: 'total',
      label: 'Total Inventário',
      value: dashboard?.resumo.total_veiculos || 0,
      unit: 'veículos',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700',
      textColor: 'text-blue-100',
      change: '+12%',
      changeType: 'positive' as const,
      priority: 'high' as const
    },
    {
      id: 'disponivel',
      label: 'Disponível',
      value: dashboard?.resumo.por_status.disponivel || 0,
      unit: 'unidades',
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700',
      textColor: 'text-emerald-100',
      change: '+5%',
      changeType: 'positive' as const,
      priority: 'high' as const
    },
    {
      id: 'reservado',
      label: 'Reservado',
      value: dashboard?.resumo.por_status.reservado || 0,
      unit: 'unidades',
      icon: Clock,
      color: 'bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700',
      textColor: 'text-amber-100',
      change: '-3%',
      changeType: 'negative' as const,
      priority: 'medium' as const
    },
    {
      id: 'vendido',
      label: 'Vendido',
      value: dashboard?.resumo.por_status.vendido || 0,
      unit: 'unidades',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700',
      textColor: 'text-purple-100',
      change: '+15%',
      changeType: 'positive' as const,
      priority: 'medium' as const
    },
    {
      id: 'valor',
      label: 'Valor Total',
      value: formatCurrency(dashboard?.resumo.valor_total || 0),
      unit: '',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700',
      textColor: 'text-indigo-100',
      change: '+8%',
      changeType: 'positive' as const,
      priority: 'high' as const
    },
    {
      id: 'alerts',
      label: 'Alertas',
      value: 3,
      unit: 'pendentes',
      icon: AlertCircle,
      color: 'bg-gradient-to-br from-red-500 via-pink-600 to-red-700',
      textColor: 'text-red-100',
      change: '+2',
      changeType: 'negative' as const,
      priority: 'urgent' as const
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg shadow-blue-100/20 p-6 mb-8">
      {/* Header do Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-light text-gray-900 tracking-tight">
            Status Executivo
          </h2>
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">
            Visão consolidada em tempo real
          </p>
        </div>
        
        {/* Indicador de tempo real */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200/50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-emerald-700 font-medium uppercase tracking-wide">
            Live
          </span>
        </div>
      </div>

      {/* Grid de Métricas Executivas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isUrgent = metric.priority === 'urgent';
          const isHigh = metric.priority === 'high';
          
          return (
            <div
              key={metric.id}
              className={`
                relative p-4 rounded-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer
                ${metric.color}
                ${isUrgent ? 'ring-2 ring-red-400/50 animate-pulse' : ''}
                ${isHigh ? 'col-span-1 md:col-span-1' : ''}
              `}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Background pattern para urgentes */}
              {isUrgent && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              )}
              
              <div className="relative z-10">
                {/* Header com ícone e mudança */}
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${metric.textColor}`} />
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-mono font-medium
                    ${metric.changeType === 'positive' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500/20 text-red-100'
                    }
                  `}>
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                
                {/* Label */}
                <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${metric.textColor}`}>
                  {metric.label}
                </p>
                
                {/* Valor principal */}
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold leading-none">
                      {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString('pt-BR')}
                    </span>
                    {metric.unit && (
                      <span className={`text-xs font-mono ${metric.textColor}`}>
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Efeito hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transform -skew-x-12 transition-all duration-500 hover:translate-x-full" />
            </div>
          );
        })}
      </div>

      {/* Barra de resumo executivo */}
      <div className="mt-6 pt-4 border-t border-gray-100/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {((dashboard?.resumo.por_status.disponivel || 0) / (dashboard?.resumo.total_veiculos || 1) * 100).toFixed(1)}%
              </span> disponível
            </span>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {((dashboard?.resumo.por_status.reservado || 0) / (dashboard?.resumo.total_veiculos || 1) * 100).toFixed(1)}%
              </span> em negociação
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Última atualização:</span>
            <span className="font-mono">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}