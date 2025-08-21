'use client';

import { useState } from 'react';
import { Package, Plus, Upload, BarChart3, Search, Filter, Grid, List } from 'lucide-react';
import { EstoqueLayout } from '../layout/ModularLayout';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';
import { EstoqueDashboard } from './EstoqueDashboard';
import { EstoqueListagem } from './EstoqueListagem';
import { EstoqueForm } from './EstoqueForm';

type EstoqueView = 'dashboard' | 'listagem' | 'adicionar' | 'editar' | 'importar';
type NavigationOrigin = 'dashboard' | 'listagem' | 'overview';

interface EstoqueModuleProps {
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
  initialView?: EstoqueView;
  initialOrigin?: NavigationOrigin;
}

export function EstoqueModule({ 
  onModuleChange, 
  onLogout, 
  initialView = 'dashboard',
  initialOrigin = 'dashboard'
}: EstoqueModuleProps) {
  const [currentView, setCurrentView] = useState<EstoqueView>(initialView);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [navigationOrigin, setNavigationOrigin] = useState<NavigationOrigin>(initialOrigin);

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'overview':
        onModuleChange?.('overview');
        break;
      case 'estoque':
        setCurrentView('dashboard');
        break;
      case 'whatsleads':
        onModuleChange?.('whatsleads');
        break;
      case 'vendedores':
        onModuleChange?.('vendedores');
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'logout':
        onLogout?.();
        break;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <EstoqueDashboard
            onNavigateToListagem={() => {
              setNavigationOrigin('dashboard');
              setCurrentView('listagem');
            }}
            onNavigateToAdd={() => {
              setNavigationOrigin('dashboard');
              setCurrentView('adicionar');
            }}
            onNavigateToImport={() => {
              setNavigationOrigin('dashboard');
              setCurrentView('importar');
            }}
          />
        );
      case 'listagem':
        return (
          <EstoqueListagem
            onBack={() => setCurrentView('dashboard')}
            onAdd={() => {
              setNavigationOrigin('listagem');
              setCurrentView('adicionar');
            }}
            onEdit={(vehicle) => {
              setSelectedVehicle(vehicle);
              setNavigationOrigin('listagem');
              setCurrentView('editar');
            }}
            onImport={() => {
              setNavigationOrigin('listagem');
              setCurrentView('importar');
            }}
          />
        );
      case 'adicionar':
        return (
          <EstoqueForm
            title="Adicionar Veículo"
            onBack={() => {
              setSelectedVehicle(null);
              // Voltar para a origem
              if (navigationOrigin === 'overview') {
                onModuleChange?.('overview');
              } else if (navigationOrigin === 'dashboard') {
                setCurrentView('dashboard');
              } else {
                setCurrentView('listagem');
              }
            }}
            onSave={() => {
              setSelectedVehicle(null);
              // Voltar para a origem após salvar
              if (navigationOrigin === 'overview') {
                onModuleChange?.('overview');
              } else if (navigationOrigin === 'dashboard') {
                setCurrentView('dashboard');
              } else {
                setCurrentView('listagem');
              }
            }}
          />
        );
      case 'editar':
        return (
          <EstoqueForm
            title="Editar Veículo"
            vehicle={selectedVehicle}
            onBack={() => {
              setSelectedVehicle(null);
              // Edição sempre volta para listagem
              setCurrentView('listagem');
            }}
            onSave={() => {
              setSelectedVehicle(null);
              // Edição sempre volta para listagem
              setCurrentView('listagem');
            }}
          />
        );
      case 'importar':
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 p-12">
                <Upload className="w-16 h-16 text-emerald-600 mx-auto" />
                <h2 className="text-2xl font-light text-gray-900">Importação de Veículos</h2>
                <p className="text-gray-600">Em desenvolvimento...</p>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <EstoqueLayout>
      {renderContent()}
      
      {/* Floating Menu */}
      <FloatingModularMenu
        currentModule="estoque"
        onModuleChange={onModuleChange}
        onLogout={onLogout}
      />
    </EstoqueLayout>
  );
}