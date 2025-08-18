'use client';

import { useState } from 'react';
import { OverviewLayout } from '../layout/ModularLayout';
import { OverviewTab } from './TabsNavigation';
import { OverviewAccessKeys } from './OverviewAccessKeys';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';
import { InventoryFinancialTab } from './tabs/InventoryFinancialTab';
import { TeamPerformanceTab } from './tabs/TeamPerformanceTab';
import { LeadsConversionsTab } from './tabs/LeadsConversionsTab';

// Interface para os dados do dashboard (reutilizando a estrutura atual)
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
  hierarquia?: Array<{
    marca: string;
    total_veiculos: number;
    valor_total: number;
    categorias: Array<{
      nome: string;
      slug: string;
      total_veiculos: number;
      valor_total: number;
      classes: Record<'A' | 'B' | 'C' | 'D', {
        quantidade: number;
        valor: number;
        percentual: number;
      }>;
    }>;
  }>;
}

interface OverviewModuleProps {
  dashboard?: DashboardData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
}

export function OverviewModule({ 
  dashboard, 
  isLoading = false, 
  onRefresh,
  onModuleChange,
  onLogout 
}: OverviewModuleProps) {
  const [activeTheme, setActiveTheme] = useState<OverviewTab>('inventory');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Cores do ícone V8 baseado na tab ativa
  const getHeaderIconColor = () => {
    switch (activeTheme) {
      case 'inventory':
        return 'from-blue-600 via-blue-700 to-blue-800';
      case 'team':
        return 'from-purple-600 via-violet-700 to-purple-800';
      case 'leads':
        return 'from-green-600 via-emerald-700 to-green-800';
      default:
        return 'from-blue-600 via-blue-700 to-blue-800';
    }
  };

  const renderActiveTheme = () => {
    switch (activeTheme) {
      case 'inventory':
        return (
          <InventoryFinancialTab
            dashboard={dashboard}
            isLoading={isLoading}
            showMobileSearch={showMobileSearch}
            setShowMobileSearch={setShowMobileSearch}
          />
        );
      case 'team':
        return (
          <TeamPerformanceTab
            isLoading={isLoading}
          />
        );
      case 'leads':
        return (
          <LeadsConversionsTab
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading && !dashboard) {
    return (
      <OverviewLayout>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-12">
              <div className="h-12 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-48 shimmer" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 shimmer" />
            </div>
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shimmer" />
                ))}
              </div>
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }
          
          .shimmer {
            background: linear-gradient(
              90deg,
              #f1f5f9 0px,
              #e2e8f0 40px,
              #f1f5f9 80px
            );
            background-size: 200px 100%;
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </OverviewLayout>
    );
  }

  return (
    <OverviewLayout>
      {/* Header do Overview */}
      <header className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-b border-white/20 shadow-lg shadow-blue-100/20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Header principal */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getHeaderIconColor()} rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 transition-all duration-500`}>
                    <span className="text-white font-bold text-sm">V8</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {activeTheme === 'inventory' && 'Inventário'}
                    {activeTheme === 'team' && 'Equipe'}
                    {activeTheme === 'leads' && 'Leads'}
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    V8 Sistema
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (onRefresh && typeof onRefresh === 'function') {
                      onRefresh();
                    }
                  }}
                  disabled={isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  <svg className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Chaves de Acesso Mobile - Linha separada para melhor UX */}
            <div className="pb-4">
              <OverviewAccessKeys
                activeTheme={activeTheme}
                onThemeChange={setActiveTheme}
              />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block py-8 lg:py-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${getHeaderIconColor()} rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 transition-all duration-500`}>
                      <span className="text-white font-bold text-2xl lg:text-3xl">V8</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      {activeTheme === 'inventory' && 'Inventário & Financeiro'}
                      {activeTheme === 'team' && 'Equipe & Performance'}
                      {activeTheme === 'leads' && 'Leads & Conversões'}
                    </h1>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        {activeTheme === 'inventory' && 'Estoque & Métricas Financeiras'}
                        {activeTheme === 'team' && 'Performance da Equipe de Vendas'}
                        {activeTheme === 'leads' && 'Pipeline & Conversões de Leads'}
                      </span>
                      
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Chaves de Acesso */}
                <OverviewAccessKeys
                  activeTheme={activeTheme}
                  onThemeChange={setActiveTheme}
                />
                
                {/* Botão Sync */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (onRefresh && typeof onRefresh === 'function') {
                        onRefresh();
                      }
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 disabled:opacity-50 active:scale-95 group cursor-pointer"
                  >
                    <svg className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Sync</span>
                  </button>
                  
                  {isLoading && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Conteúdo da Visão Ativa - Sempre visível */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 md:pb-12">
        
        {/* Conteúdo da tab */}
        {renderActiveTheme()}
      </main>

      {/* Floating Menu Modular */}
      <FloatingModularMenu
        currentModule={
          activeTheme === 'inventory' ? 'overview' : 
          activeTheme === 'team' ? 'vendedores' : 
          activeTheme === 'leads' ? 'whatsleads' : 'overview'
        }
        onModuleChange={onModuleChange}
        onRefresh={onRefresh}
        onLogout={onLogout}
        setShowMobileSearch={setShowMobileSearch}
      />
    </OverviewLayout>
  );
}