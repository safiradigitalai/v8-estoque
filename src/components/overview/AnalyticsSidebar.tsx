'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, Users, MessageCircle, X } from 'lucide-react';
import { OverviewTab } from './TabsNavigation';

interface AnalyticsSidebarProps {
  activeTab: OverviewTab;
  onTabChange: (tab: OverviewTab) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const analyticsOptions = [
  {
    id: 'inventory' as OverviewTab,
    label: 'Inventário & Financeiro',
    icon: BarChart3,
    description: 'Métricas detalhadas de estoque e performance financeira',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    id: 'team' as OverviewTab,
    label: 'Equipe & Performance',
    icon: Users,
    description: 'Rankings e métricas da equipe de vendas',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    id: 'leads' as OverviewTab,
    label: 'Leads & Conversões',
    icon: MessageCircle,
    description: 'Pipeline e conversões de leads',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200'
  }
];

export function AnalyticsSidebar({ activeTab, onTabChange, isOpen, onToggle }: AnalyticsSidebarProps) {
  const [hoveredOption, setHoveredOption] = useState<OverviewTab | null>(null);

  return (
    <>
      {/* Backdrop para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-[calc(100%-4rem)]'}
        w-80 md:w-96
      `}>
        {/* Container principal */}
        <div className="h-full bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl shadow-gray-900/10">
          
          {/* Header da sidebar */}
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 tracking-tight">
                  Análises Detalhadas
                </h3>
                <p className="text-sm text-gray-500">
                  Explore métricas específicas
                </p>
              </div>
              
              {/* Botão de fechar para mobile */}
              <button
                onClick={onToggle}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Lista de opções analíticas */}
          <div className="p-6 space-y-4">
            {analyticsOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeTab === option.id;
              const isHovered = hoveredOption === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onTabChange(option.id);
                    // Não fecha automaticamente no desktop para permitir navegação rápida
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? `${option.bgColor} ${option.borderColor} border-2 shadow-lg` 
                      : 'bg-gray-50/50 hover:bg-gray-100/70 border border-gray-200/50 hover:border-gray-300/50'
                    }
                    hover:shadow-md active:scale-[0.98]
                  `}
                >
                  <div className="flex items-start space-x-4">
                    {/* Ícone */}
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-white/80 shadow-sm' 
                        : 'bg-white/60 group-hover:bg-white/80'
                      }
                    `}>
                      <Icon className={`
                        w-5 h-5 transition-colors duration-200
                        ${isActive ? option.color : 'text-gray-600 group-hover:' + option.color}
                      `} />
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`
                        font-medium mb-1 transition-colors duration-200
                        ${isActive ? option.color : 'text-gray-900 group-hover:' + option.color}
                      `}>
                        {option.label}
                      </h4>
                      <p className={`
                        text-sm leading-relaxed transition-colors duration-200
                        ${isActive ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-600'}
                      `}>
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Indicador de ativo */}
                    {isActive && (
                      <div className={`
                        w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')} animate-pulse
                      `} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer da sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100/50 bg-gradient-to-t from-white via-white to-transparent">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                Visualização Executiva
              </p>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-xs text-gray-500">
                  Status sempre visível
                </span>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Toggle button - sempre visível */}
        <button
          onClick={onToggle}
          className={`
            absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full
            w-10 h-16 bg-white/95 backdrop-blur-sm border border-gray-200/50 border-r-0
            rounded-l-xl shadow-lg hover:shadow-xl transition-all duration-300
            flex items-center justify-center group hover:bg-blue-50
            ${isOpen ? 'hover:bg-red-50' : ''}
          `}
        >
          {isOpen ? (
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          )}
        </button>
      </div>
    </>
  );
}