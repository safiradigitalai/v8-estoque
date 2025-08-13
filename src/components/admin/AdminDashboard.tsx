'use client';

import { useState, useCallback } from 'react';
import { VehicleList } from './VehicleList';
import { VehicleForm } from './VehicleForm';
import { EditorialDashboard } from '../editorial/EditorialDashboard';
import { FloatingModularMenu } from '../editorial/EditorialDashboard';

// Tipos para os diferentes modos
type AdminMode = 'dashboard' | 'vehicle-list' | 'vehicle-form' | 'import' | 'statistics';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  classe_social: 'A' | 'B' | 'C' | 'D';
  status: 'disponivel' | 'reservado' | 'vendido';
  dias_estoque: number;
  km?: number;
  cor?: string;
  combustivel?: string;
  cambio?: string;
  placa?: string;
  categoria_nome?: string;
  categoria_slug?: string;
  foto_principal?: string;
  foto_thumb?: string;
}

interface VehicleFormData {
  id?: number;
  marca: string;
  modelo: string;
  ano: number | string;
  valor: number | string;
  categoria_id: number | string;
  km?: number | string;
  cor?: string;
  combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
  cambio?: 'manual' | 'automatico' | 'cvt';
  portas?: number | string;
  placa?: string;
  codigo_interno?: string;
  observacoes?: string;
  status?: 'disponivel' | 'reservado' | 'vendido';
}

interface AdminDashboardProps {
  initialAction?: string;
  onBackToHome?: () => void;
}

export function AdminDashboard({ initialAction, onBackToHome }: AdminDashboardProps = {}) {
  const getInitialMode = (action?: string): AdminMode => {
    switch (action) {
      case 'vehicles': return 'vehicle-list';
      case 'add-vehicle': return 'vehicle-form';
      case 'import': return 'import';
      case 'stats': return 'statistics';
      default: return 'vehicle-list'; // Por padrão, vai para lista de veículos
    }
  };

  const [currentMode, setCurrentMode] = useState<AdminMode>(getInitialMode(initialAction));
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manipular ações do menu flutuante
  const handleMenuAction = useCallback((action: string) => {
    switch (action) {
      case 'home':
        // Voltar para o EditorialDashboard principal
        if (onBackToHome) {
          onBackToHome();
        }
        break;
      case 'vehicles':
        setCurrentMode('vehicle-list');
        setEditingVehicle(null);
        break;
      case 'add-vehicle':
        setCurrentMode('vehicle-form');
        setEditingVehicle(null);
        break;
      case 'import':
        setCurrentMode('import');
        setEditingVehicle(null);
        break;
      case 'stats':
        setCurrentMode('statistics');
        setEditingVehicle(null);
        break;
      case 'search':
        // Implementar busca global
        console.log('Busca global');
        break;
      default:
        console.log(`Ação não implementada: ${action}`);
    }
  }, []);

  // Manipular edição de veículo
  const handleEditVehicle = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setCurrentMode('vehicle-form');
  }, []);

  // Manipular visualização de veículo
  const handleViewVehicle = useCallback((vehicle: Vehicle) => {
    // Implementar modal de visualização ou navegação para detalhes
    console.log('Visualizar veículo:', vehicle);
  }, []);

  // Manipular exclusão de veículo
  const handleDeleteVehicle = useCallback(async (vehicle: Vehicle) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o veículo ${vehicle.marca} ${vehicle.modelo} (${vehicle.ano})?`
    );
    
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/veiculos/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Recarregar a lista de veículos
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erro ao excluir veículo: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      alert('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manipular salvamento de veículo
  const handleSaveVehicle = useCallback(async (data: VehicleFormData) => {
    try {
      setIsLoading(true);
      
      // Preparar dados para envio
      const vehicleData = {
        ...data,
        ano: typeof data.ano === 'string' ? parseInt(data.ano) || 0 : data.ano,
        valor: typeof data.valor === 'string' ? parseFloat(data.valor.toString()) || 0 : data.valor,
        categoria_id: typeof data.categoria_id === 'string' ? parseInt(data.categoria_id) || 0 : data.categoria_id,
        km: data.km ? (typeof data.km === 'string' ? parseInt(data.km) || 0 : data.km) : undefined,
        portas: data.portas ? (typeof data.portas === 'string' ? parseInt(data.portas) || 4 : data.portas) : 4
      };

      const isUpdate = editingVehicle?.id;
      const url = isUpdate ? `/api/veiculos/${editingVehicle.id}` : '/api/veiculos';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const result = await response.json();

      if (result.success) {
        // Sucesso - voltar para lista
        setCurrentMode('vehicle-list');
        setEditingVehicle(null);
        return { 
          success: true, 
          warnings: result.warnings || [] 
        };
      } else {
        // Erro de validação
        return { 
          success: false, 
          errors: result.validation_errors || [{ 
            field: 'general', 
            message: result.error || 'Erro desconhecido' 
          }] 
        };
      }
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      return {
        success: false,
        errors: [{
          field: 'general',
          message: 'Erro interno. Tente novamente.'
        }]
      };
    } finally {
      setIsLoading(false);
    }
  }, [editingVehicle]);

  // Cancelar edição
  const handleCancelEdit = useCallback(() => {
    setEditingVehicle(null);
    setCurrentMode('vehicle-list');
  }, []);

  // Renderizar conteúdo baseado no modo atual
  const renderContent = () => {
    switch (currentMode) {
      case 'dashboard':
        // Este caso não deveria ser usado - sempre volta para o EditorialDashboard principal
        return null;

      case 'vehicle-list':
        return (
          <div className="p-6">
            <VehicleList
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              onView={handleViewVehicle}
              onAdd={() => setCurrentMode('vehicle-form')}
              onImport={() => setCurrentMode('import')}
            />
          </div>
        );

      case 'vehicle-form':
        return (
          <div className="p-6">
            <VehicleForm
              vehicle={editingVehicle ? {
                id: editingVehicle.id,
                marca: editingVehicle.marca,
                modelo: editingVehicle.modelo,
                ano: editingVehicle.ano,
                valor: editingVehicle.valor,
                categoria_id: 1, // Precisaríamos buscar isso da API
                km: editingVehicle.km,
                cor: editingVehicle.cor,
                combustivel: editingVehicle.combustivel as any,
                cambio: editingVehicle.cambio as any,
                portas: 4, // Valor padrão
                placa: editingVehicle.placa,
                codigo_interno: '', // Precisaríamos buscar isso da API
                observacoes: '',
                status: editingVehicle.status
              } : undefined}
              onSave={handleSaveVehicle}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
              title={editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            />
          </div>
        );

      case 'import':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Importação de Veículos</h2>
              <p className="text-gray-600 mb-6">Funcionalidade em desenvolvimento</p>
              <button
                onClick={() => setCurrentMode('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:from-violet-600 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Estatísticas Avançadas</h2>
              <p className="text-gray-600 mb-6">Funcionalidade em desenvolvimento</p>
              <button
                onClick={() => setCurrentMode('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:from-violet-600 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Página não encontrada</h2>
              <p className="text-gray-600 mb-6">O modo solicitado não existe</p>
              <button
                onClick={() => setCurrentMode('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:from-violet-600 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/20">
      {renderContent()}
      
      {/* Menu flutuante sempre presente */}
      <FloatingModularMenu
        onAction={handleMenuAction}
        onRefresh={() => window.location.reload()}
        setShowMobileSearch={() => {}}
      />
    </div>
  );
}