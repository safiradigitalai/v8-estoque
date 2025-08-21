'use client';

import { useState } from 'react';
import { Users, Plus, Settings, Award, TrendingUp, Target } from 'lucide-react';
import { VendedoresLayout } from '../layout/ModularLayout';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';
import { VendedoresDashboard } from './VendedoresDashboard';
import { VendedoresList } from './VendedoresList';
import { VendedoresForm } from './VendedoresForm';
import { VendedoresConfig } from './VendedoresConfig';

type VendedoresView = 'dashboard' | 'lista' | 'adicionar' | 'editar' | 'configuracoes';

interface VendedoresModuleProps {
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}

export function VendedoresModule({ 
  onModuleChange, 
  onLogout, 
  onRefresh
}: VendedoresModuleProps) {
  const [activeView, setActiveView] = useState<VendedoresView>('dashboard');
  const [selectedVendedor, setSelectedVendedor] = useState<any>(null);

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'overview':
        onModuleChange?.('overview');
        break;
      case 'estoque':
        onModuleChange?.('estoque');
        break;
      case 'whatsleads':
        onModuleChange?.('whatsleads');
        break;
      case 'vendedores':
        setActiveView('dashboard');
        break;
      case 'refresh':
        onRefresh?.();
        break;
      case 'logout':
        onLogout?.();
        break;
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <VendedoresDashboard
            onNavigateToLista={() => setActiveView('lista')}
            onNavigateToAdicionar={() => setActiveView('adicionar')}
            onNavigateToConfiguracoes={() => setActiveView('configuracoes')}
            onNavigateToEditar={(vendedor) => {
              setSelectedVendedor(vendedor);
              setActiveView('editar');
            }}
          />
        );
      case 'lista':
        return (
          <VendedoresList
            onVoltar={() => setActiveView('dashboard')}
            onAdicionar={() => setActiveView('adicionar')}
            onEditar={(vendedor) => {
              setSelectedVendedor(vendedor);
              setActiveView('editar');
            }}
          />
        );
      case 'adicionar':
        return (
          <VendedoresForm
            onVoltar={() => {
              setSelectedVendedor(null);
              setActiveView('dashboard');
            }}
            onSalvar={() => {
              setSelectedVendedor(null);
              setActiveView('dashboard');
            }}
          />
        );
      case 'editar':
        return (
          <VendedoresForm
            vendedor={selectedVendedor}
            onVoltar={() => {
              setSelectedVendedor(null);
              setActiveView('lista');
            }}
            onSalvar={() => {
              setSelectedVendedor(null);
              setActiveView('lista');
            }}
          />
        );
      case 'configuracoes':
        return (
          <VendedoresConfig
            onVoltar={() => setActiveView('dashboard')}
          />
        );
      default:
        return (
          <VendedoresDashboard
            onNavigateToLista={() => setActiveView('lista')}
            onNavigateToAdicionar={() => setActiveView('adicionar')}
            onNavigateToConfiguracoes={() => setActiveView('configuracoes')}
          />
        );
    }
  };

  return (
    <VendedoresLayout>
      {/* Header seguindo padrão luxury magazine */}
      <header className="bg-gradient-to-br from-white via-purple-50/30 to-violet-50/20 border-b border-white/20 shadow-lg shadow-purple-100/20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-violet-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/20 transition-all duration-500">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Vendedores
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    V8 Sistema
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => onRefresh?.()}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-purple-100/30 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-gray-600" />
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
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-600 via-violet-700 to-purple-800 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-900/20 transition-all duration-500">
                      <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      Gestão de Vendedores
                    </h1>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Performance, Ranking e Gamificação
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="flex items-center space-x-3">
                  
                  {/* Add Vendedor */}
                  <button 
                    onClick={() => setActiveView('adicionar')}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all duration-300 active:scale-95 group cursor-pointer"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="font-mono text-sm uppercase tracking-wider">Add</span>
                  </button>

                  {/* Config */}
                  <button 
                    onClick={() => setActiveView('configuracoes')}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 active:scale-95 group cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Config</span>
                  </button>

                  {/* Sync */}
                  <button 
                    onClick={() => onRefresh?.()}
                    className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 active:scale-95 group cursor-pointer"
                  >
                    <TrendingUp className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700">Sync</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 md:pb-12">
        {renderActiveView()}
      </main>

      {/* Floating Menu Modular */}
      <FloatingModularMenu
        currentModule="vendedores"
        onModuleChange={onModuleChange}
        onLogout={onLogout}
      />
    </VendedoresLayout>
  );
}