'use client';

import { useState } from 'react';
import { BarChart3, Users, MessageCircle } from 'lucide-react';

export type OverviewTab = 'inventory' | 'team' | 'leads';

interface Tab {
  id: OverviewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface TabsNavigationProps {
  activeTab: OverviewTab;
  onTabChange: (tab: OverviewTab) => void;
  className?: string;
}

const tabs: Tab[] = [
  {
    id: 'inventory',
    label: 'Inventário & Financeiro',
    icon: BarChart3,
    description: 'Métricas de estoque e performance financeira'
  },
  {
    id: 'team',
    label: 'Equipe & Performance',
    icon: Users,
    description: 'Rankings e métricas da equipe de vendas'
  },
  {
    id: 'leads',
    label: 'Leads & Conversões',
    icon: MessageCircle,
    description: 'Pipeline e conversões de leads'
  }
];

export function TabsNavigation({ activeTab, onTabChange, className = '' }: TabsNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<OverviewTab | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* Background mais sutil e discreto */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/30 via-white/60 to-gray-50/30 backdrop-blur-sm rounded-lg border border-gray-200/30 shadow-sm" />
      
      {/* Container principal */}
      <div className="relative px-4 py-3">
        {/* Header das tabs - mais discreto */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-600 tracking-tight">
              Análise Detalhada
            </h3>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Navegue pelas seções analíticas
            </p>
          </div>
          
          {/* Indicador discreto */}
          <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-lg border border-gray-200/50">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <span className="text-xs font-mono text-gray-600 font-medium">
              {tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
            </span>
          </div>
        </div>
        
        {/* Navegação das tabs - compacta */}
        <div className="flex flex-col sm:flex-row gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`
                  relative flex-1 group text-left p-3 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 hover:shadow-sm active:scale-[0.98]'
                  }
                  border ${isActive ? 'border-blue-400/30' : 'border-gray-200/60 hover:border-blue-200/60'}
                `}
                style={{ minHeight: '64px' }}
              >
                {/* Indicador de aba ativa */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-white/60 via-white to-white/60 rounded-full" />
                )}
                
                {/* Conteúdo da tab - compacto */}
                <div className="flex items-center space-x-3">
                  {/* Ícone menor */}
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-gray-100 group-hover:bg-blue-100'
                    }
                  `}>
                    <Icon className={`
                      w-4 h-4 transition-all duration-300
                      ${isActive 
                        ? 'text-white' 
                        : 'text-blue-600 group-hover:text-blue-700'
                      }
                    `} />
                  </div>
                  
                  {/* Labels compactos */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`
                      font-medium transition-colors duration-300 text-sm
                      ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-blue-800'}
                    `}>
                      {tab.label}
                    </h4>
                    <p className={`
                      text-xs leading-tight transition-colors duration-300 line-clamp-1
                      ${isActive 
                        ? 'text-blue-100' 
                        : 'text-gray-500 group-hover:text-blue-600'
                      }
                    `}>
                      {tab.description}
                    </p>
                  </div>
                </div>
                
                {/* Efeito shimmer para tab ativa */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full rounded-xl" />
                )}
                
                {/* Linha de conexão inferior */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Barra de progresso/conexão */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>
    </div>
  );
}