'use client';

import { useState } from 'react';
import { OverviewModule } from '@/components/overview/OverviewModule';
import { EstoqueModule } from '@/components/estoque/EstoqueModule';
import { WhatsLeadsModule } from '@/components/whatsleads/WhatsLeadsModule';
import { VendedoresModule } from '@/components/vendedores/VendedoresModule';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';

// Type para os módulos disponíveis
type ModuleId = 'overview' | 'estoque' | 'whatsleads' | 'vendedores';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { dashboard, isLoading, isError, refresh } = useDashboard();
  const [currentModule, setCurrentModule] = useState<ModuleId>('overview');
  const [estoqueNavigation, setEstoqueNavigation] = useState<{
    view?: 'dashboard' | 'listagem' | 'adicionar' | 'editar' | 'importar';
    origin?: 'overview' | 'dashboard' | 'listagem';
  }>({});

  // Mostrar loading se ainda está verificando autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            V<span className="text-3xl">8</span>
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  // Mostrar tela de login se não autenticado
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => window.location.reload()} />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.186-.833-2.964 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Erro no Sistema</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar os dados do inventário</p>
          <button 
            onClick={() => refresh()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Handler para mudança de módulo
  const handleModuleChange = (module: ModuleId, options?: {
    estoqueView?: 'dashboard' | 'listagem' | 'adicionar' | 'editar' | 'importar';
    estoqueOrigin?: 'overview' | 'dashboard' | 'listagem';
  }) => {
    setCurrentModule(module);
    
    // Se está indo para estoque, configurar navegação
    if (module === 'estoque' && options) {
      setEstoqueNavigation({
        view: options.estoqueView,
        origin: options.estoqueOrigin
      });
    } else {
      // Limpar navegação do estoque quando sair
      setEstoqueNavigation({});
    }
  };

  // Renderizar módulo atual
  const renderCurrentModule = () => {
    switch (currentModule) {
      case 'overview':
        return (
          <OverviewModule
            dashboard={dashboard}
            isLoading={isLoading}
            onRefresh={refresh}
            onModuleChange={handleModuleChange}
            onLogout={logout}
          />
        );
      case 'estoque':
        return (
          <EstoqueModule
            onModuleChange={handleModuleChange}
            onLogout={logout}
            initialView={estoqueNavigation.view}
            initialOrigin={estoqueNavigation.origin}
          />
        );
      case 'whatsleads':
        return (
          <WhatsLeadsModule
            onNavigateToConversas={() => console.log('Navegar para conversas')}
            onNavigateToLeads={() => console.log('Navegar para leads')}
            onNavigateToMetrics={() => console.log('Navegar para métricas')}
            onNavigateToConfig={() => console.log('Navegar para configurações')}
            onModuleChange={setCurrentModule}
            onRefresh={refresh}
            onLogout={logout}
          />
        );
      case 'vendedores':
        return (
          <VendedoresModule
            onModuleChange={handleModuleChange}
            onLogout={logout}
            onRefresh={refresh}
          />
        );
      default:
        return null;
    }
  };

  return renderCurrentModule();
}