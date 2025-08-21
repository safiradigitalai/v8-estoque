'use client';

import { useState, useEffect } from 'react';
import { Kanban, Trophy, Users, Clock, Target } from 'lucide-react';
import { MicroModeDashboard } from './MicroModeDashboard';
import { VeiculosKanban } from './VeiculosKanban';
import { RankingVendedores } from './RankingVendedores';
import { PerformanceVendedor } from './PerformanceVendedor';

interface MicroModeModuleProps {
  vendedorId?: number;
  vendedorNome?: string;
  isAdmin?: boolean;
  onLogout: () => void;
}

type MicroModeView = 'dashboard' | 'kanban' | 'ranking' | 'performance';

export function MicroModeModule({ 
  vendedorId, 
  vendedorNome, 
  isAdmin = false, 
  onLogout 
}: MicroModeModuleProps) {
  const [currentView, setCurrentView] = useState<MicroModeView>('dashboard');
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show menu when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsMenuVisible(true);
      }
      // Hide menu when scrolling down significantly
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsMenuVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MicroModeDashboard
            vendedorId={vendedorId}
            vendedorNome={vendedorNome}
            isAdmin={isAdmin}
            onViewChange={setCurrentView}
          />
        );
      case 'kanban':
        return (
          <VeiculosKanban
            vendedorId={vendedorId}
            isAdmin={isAdmin}
            onVoltar={() => setCurrentView('dashboard')}
          />
        );
      case 'ranking':
        return (
          <RankingVendedores
            vendedorId={vendedorId}
            isAdmin={isAdmin}
            onVoltar={() => setCurrentView('dashboard')}
          />
        );
      case 'performance':
        return (
          <PerformanceVendedor
            vendedorId={vendedorId}
            onVoltar={() => setCurrentView('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header do MicroMode */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.25)] transition-all duration-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                  <span className="text-white font-bold text-sm">V8</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">V8 Sistema</h1>
                  <p className="text-xs text-cyan-600 font-medium">Portal de Vendas</p>
                </div>
              </div>
              
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação - Desktop Only */}
      {currentView !== 'dashboard' && (
        <div className="hidden sm:block bg-white border-b border-gray-200 flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 px-1 py-4 text-sm font-medium text-gray-500 hover:text-cyan-600 border-b-2 border-transparent hover:border-cyan-300 transition-all duration-300 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('kanban')}
                className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                  currentView === 'kanban'
                    ? 'text-cyan-600 border-cyan-600 shadow-[0_1px_4px_rgba(6,182,212,0.2)]'
                    : 'text-gray-500 hover:text-cyan-600 border-transparent hover:border-cyan-300'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>Veículos</span>
              </button>

              <button
                onClick={() => setCurrentView('ranking')}
                className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                  currentView === 'ranking'
                    ? 'text-cyan-600 border-cyan-600 shadow-[0_1px_4px_rgba(6,182,212,0.2)]'
                    : 'text-gray-500 hover:text-cyan-600 border-transparent hover:border-cyan-300'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Ranking</span>
              </button>

              {vendedorId && (
                <button
                  onClick={() => setCurrentView('performance')}
                  className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                    currentView === 'performance'
                      ? 'text-cyan-600 border-cyan-600 shadow-[0_2px_8px_rgba(6,182,212,0.3)]'
                      : 'text-gray-500 hover:text-cyan-600 border-transparent hover:border-cyan-300'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Performance</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto bg-white">
        {renderCurrentView()}
      </main>

      {/* Mobile Bottom Navigation - Global */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 transition-transform duration-300 ${
        isMenuVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-cyan-600 bg-cyan-50/50'
                : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50/30'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-xs font-light tracking-wider">DASH</span>
          </button>
          
          <button
            onClick={() => setCurrentView('kanban')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer ${
              currentView === 'kanban'
                ? 'text-cyan-600 bg-cyan-50/50'
                : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50/30'
            }`}
          >
            <Kanban className="w-5 h-5" />
            <span className="text-xs font-light tracking-wider">CARDS</span>
          </button>
          
          <button
            onClick={() => setCurrentView('ranking')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer ${
              currentView === 'ranking'
                ? 'text-cyan-600 bg-cyan-50/50'
                : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50/30'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-light tracking-wider">RANK</span>
          </button>
          
          {vendedorId && (
            <button
              onClick={() => setCurrentView('performance')}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 cursor-pointer ${
                currentView === 'performance'
                  ? 'text-cyan-600 bg-cyan-50/50'
                  : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50/30'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs font-light tracking-wider">PERF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}