'use client';

import { useState } from 'react';
import { WhatsLeadsDashboard } from './WhatsLeadsDashboard';
import { WhatsLeadsConversas } from './WhatsLeadsConversas';
import { WhatsLeadsGestao } from './WhatsLeadsGestao';
import { WhatsLeadsConfig } from './WhatsLeadsConfig';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';

interface WhatsLeadsModuleProps {
  onNavigateToConversas: () => void;
  onNavigateToLeads: () => void;
  onNavigateToMetrics: () => void;
  onNavigateToConfig: () => void;
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}

export function WhatsLeadsModule({ 
  onNavigateToConversas, 
  onNavigateToLeads, 
  onNavigateToMetrics,
  onNavigateToConfig,
  onModuleChange,
  onLogout,
  onRefresh
}: WhatsLeadsModuleProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'conversas' | 'leads' | 'metrics' | 'config'>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <WhatsLeadsDashboard
            onNavigateToConversas={() => setActiveView('conversas')}
            onNavigateToLeads={() => setActiveView('leads')}
            onNavigateToConfig={() => setActiveView('config')}
          />
        );
      case 'conversas':
        return (
          <WhatsLeadsConversas
            onVoltar={() => setActiveView('dashboard')}
            onModuleChange={onModuleChange}
            onRefresh={onRefresh}
            onLogout={onLogout}
          />
        );
      case 'leads':
        return (
          <WhatsLeadsGestao
            onVoltar={() => setActiveView('dashboard')}
            onModuleChange={onModuleChange}
            onRefresh={onRefresh}
            onLogout={onLogout}
          />
        );
      case 'metrics':
        return <div>Métricas e Analytics - Em Desenvolvimento</div>;
      case 'config':
        return (
          <WhatsLeadsConfig
            onVoltar={() => setActiveView('dashboard')}
          />
        );
      default:
        return (
          <WhatsLeadsDashboard
            onNavigateToConversas={() => setActiveView('conversas')}
            onNavigateToLeads={() => setActiveView('leads')}
            onNavigateToConfig={() => setActiveView('config')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Header seguindo padrão dos outros módulos */}
      <header className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 border-b border-white/20 shadow-lg shadow-blue-100/20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl flex items-center justify-center shadow-xl shadow-green-900/20 transition-all duration-500">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.690"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    WhatsLeads
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    V8 Sistema
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <button className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300 active:scale-95 cursor-pointer">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block py-8 lg:py-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 rounded-3xl flex items-center justify-center shadow-xl shadow-green-900/20 transition-all duration-500">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.690"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      WhatsLeads & Conversas
                    </h1>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Central de Atendimento e Gestão de Leads
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 active:scale-95 group cursor-pointer">
                    <svg className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Sync</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 md:pb-12">
        {renderActiveView()}
      </main>

      {/* Floating Menu Modular */}
      <FloatingModularMenu
        currentModule="whatsleads"
        onModuleChange={onModuleChange}
        onRefresh={onRefresh}
        onLogout={onLogout}
        setShowMobileSearch={() => {}}
      />
    </div>
  );
}