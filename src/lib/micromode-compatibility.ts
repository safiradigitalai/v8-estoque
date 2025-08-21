// Camada de compatibilidade para integração do MicroMode com módulos existentes

import { VehicleStatus, LegacyVehicleStatus, toLegacyStatus, isVehicleInProcess } from '@/types/vehicle-status';

// Função para adaptar dados de veículos para módulos legados
export function adaptVehicleForLegacyModule(vehicle: any) {
  return {
    ...vehicle,
    // Mapear status para compatibilidade
    status: toLegacyStatus(vehicle.status as VehicleStatus),
    // Adicionar flag para identificar se está em negociação
    is_negotiating: vehicle.status === 'negociando',
    // Manter status original para referência
    original_status: vehicle.status,
    // Adicionar informações do vendedor se existir
    assigned_vendor: vehicle.vendedor_id ? {
      id: vehicle.vendedor_id,
      name: vehicle.vendedor_nome,
      since: vehicle.data_reserva || vehicle.data_inicio_negociacao
    } : null
  };
}

// Função para adaptar lista de veículos
export function adaptVehicleListForLegacyModule(vehicles: any[]) {
  return vehicles.map(adaptVehicleForLegacyModule);
}

// Função para ordenar veículos considerando status de negociação
export function sortVehiclesForDisplay(vehicles: any[], sortBy: string = 'status') {
  if (sortBy === 'status') {
    return vehicles.sort((a, b) => {
      // Prioridade: disponível > reservado > negociando > vendido
      const statusPriority = {
        'disponivel': 1,
        'reservado': 2,
        'negociando': 3,
        'vendido': 4
      };
      
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 999;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 999;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Se mesmo status, ordenar por valor (maior primeiro)
      return (b.valor || 0) - (a.valor || 0);
    });
  }
  
  return vehicles;
}

// Função para filtrar veículos por status (incluindo compatibilidade)
export function filterVehiclesByStatus(vehicles: any[], status: LegacyVehicleStatus | VehicleStatus) {
  if (status === 'reservado') {
    // No contexto legado, "reservado" inclui tanto reservado quanto negociando
    return vehicles.filter(v => v.status === 'reservado' || v.status === 'negociando');
  }
  
  return vehicles.filter(v => v.status === status);
}

// Função para calcular estatísticas compatíveis
export function calculateCompatibleStats(vehicles: any[]) {
  const stats = {
    disponivel: 0,
    reservado: 0, // Inclui negociando para compatibilidade
    negociando: 0, // Separado para MicroMode
    vendido: 0,
    total: vehicles.length
  };
  
  vehicles.forEach(vehicle => {
    switch (vehicle.status) {
      case 'disponivel':
        stats.disponivel++;
        break;
      case 'reservado':
        stats.reservado++;
        break;
      case 'negociando':
        stats.reservado++; // Para compatibilidade legada
        stats.negociando++; // Para MicroMode
        break;
      case 'vendido':
        stats.vendido++;
        break;
    }
  });
  
  return stats;
}

// Função para verificar se ações estão disponíveis para um veículo
export function getAvailableActions(vehicle: any, vendorId?: number) {
  const actions = {
    canEdit: false,
    canMarkAsSold: false,
    canToggleVitrine: false,
    canReserve: false,
    canNegotiate: false,
    canFinalizeSale: false,
    canRelease: false,
    microModeActions: [] as string[]
  };
  
  const isOwner = vendorId && vehicle.vendedor_id === vendorId;
  
  switch (vehicle.status) {
    case 'disponivel':
      actions.canEdit = true;
      actions.canMarkAsSold = true;
      actions.canToggleVitrine = true;
      actions.canReserve = true;
      actions.canNegotiate = true;
      actions.microModeActions = ['reservar', 'negociar'];
      break;
      
    case 'reservado':
      actions.canEdit = false;
      actions.canMarkAsSold = isOwner;
      actions.canToggleVitrine = false;
      if (isOwner) {
        actions.canNegotiate = true;
        actions.canRelease = true;
        actions.microModeActions = ['negociar', 'liberar'];
      }
      break;
      
    case 'negociando':
      actions.canEdit = false;
      actions.canMarkAsSold = isOwner;
      actions.canToggleVitrine = false;
      if (isOwner) {
        actions.canFinalizeSale = true;
        actions.canRelease = true;
        actions.microModeActions = ['vender', 'cancelar'];
      }
      break;
      
    case 'vendido':
      actions.canEdit = false;
      actions.canMarkAsSold = false;
      actions.canToggleVitrine = false;
      break;
  }
  
  return actions;
}

// Função para validar operações antes de executar
export function validateOperation(vehicle: any, operation: string, vendorId?: number) {
  const actions = getAvailableActions(vehicle, vendorId);
  
  const operationMap: Record<string, keyof typeof actions> = {
    'edit': 'canEdit',
    'markAsSold': 'canMarkAsSold',
    'toggleVitrine': 'canToggleVitrine',
    'reserve': 'canReserve',
    'negotiate': 'canNegotiate',
    'finalizeSale': 'canFinalizeSale',
    'release': 'canRelease'
  };
  
  const actionKey = operationMap[operation];
  if (actionKey && !actions[actionKey]) {
    throw new Error(`Operação '${operation}' não permitida para veículo no status '${vehicle.status}'`);
  }
  
  return true;
}

// Interface para webhook/notificações quando status muda
export interface StatusChangeNotification {
  vehicleId: number;
  oldStatus: VehicleStatus;
  newStatus: VehicleStatus;
  vendorId?: number;
  vendorName?: string;
  timestamp: string;
  source: 'micromode' | 'estoque' | 'admin';
}

// Função para criar notificação de mudança de status
export function createStatusChangeNotification(
  vehicleId: number,
  oldStatus: VehicleStatus,
  newStatus: VehicleStatus,
  source: 'micromode' | 'estoque' | 'admin',
  vendorId?: number,
  vendorName?: string
): StatusChangeNotification {
  return {
    vehicleId,
    oldStatus,
    newStatus,
    vendorId,
    vendorName,
    timestamp: new Date().toISOString(),
    source
  };
}

// Função para sincronizar dados entre módulos
export async function syncVehicleData(vehicleId: number, updates: any) {
  // Esta função seria chamada sempre que um módulo atualiza um veículo
  // para garantir que todos os módulos vejam dados consistentes
  
  // TODO: Implementar cache/invalidação se necessário
  // TODO: Implementar webhooks para notificar outros módulos
  
  console.log(`🔄 Sincronizando dados do veículo ${vehicleId}:`, updates);
  
  return updates;
}