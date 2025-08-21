// Tipos unificados para status de veículos
// Compatibilidade entre todos os módulos do sistema

export type VehicleStatus = 'disponivel' | 'reservado' | 'negociando' | 'vendido';

export type LegacyVehicleStatus = 'disponivel' | 'reservado' | 'vendido';

// Mapeamento para compatibilidade com módulos existentes
export const statusMapping = {
  // Status do MicroMode -> Status para módulos legados
  toLegacy: {
    'disponivel': 'disponivel',
    'reservado': 'reservado', 
    'negociando': 'reservado', // Negociando é tratado como reservado nos módulos legados
    'vendido': 'vendido'
  } as Record<VehicleStatus, LegacyVehicleStatus>,

  // Status legado -> Status do MicroMode
  fromLegacy: {
    'disponivel': 'disponivel',
    'reservado': 'reservado', // Pode ser reservado ou negociando
    'vendido': 'vendido'
  } as Record<LegacyVehicleStatus, VehicleStatus>
};

// Labels para exibição
export const statusLabels = {
  'disponivel': 'Disponível',
  'reservado': 'Reservado', 
  'negociando': 'Negociando',
  'vendido': 'Vendido'
} as Record<VehicleStatus, string>;

// Cores para status
export const statusColors = {
  'disponivel': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200'
  },
  'reservado': {
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700',
    border: 'border-yellow-200'
  },
  'negociando': {
    bg: 'bg-blue-100',
    text: 'text-blue-700', 
    border: 'border-blue-200'
  },
  'vendido': {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200'
  }
} as Record<VehicleStatus, {bg: string, text: string, border: string}>;

// Função para verificar se um status é válido
export function isValidStatus(status: string): status is VehicleStatus {
  return ['disponivel', 'reservado', 'negociando', 'vendido'].includes(status);
}

// Função para converter status para compatibilidade legada
export function toLegacyStatus(status: VehicleStatus): LegacyVehicleStatus {
  return statusMapping.toLegacy[status];
}

// Função para verificar se um veículo está disponível para ações
export function isVehicleAvailable(status: VehicleStatus): boolean {
  return status === 'disponivel';
}

// Função para verificar se um veículo está em processo (reservado ou negociando)
export function isVehicleInProcess(status: VehicleStatus): boolean {
  return status === 'reservado' || status === 'negociando';
}

// Função para verificar se um veículo foi vendido
export function isVehicleSold(status: VehicleStatus): boolean {
  return status === 'vendido';
}

// Função para obter a prioridade de ordenação (para listas)
export function getStatusPriority(status: VehicleStatus): number {
  const priorities = {
    'disponivel': 1,
    'reservado': 2,
    'negociando': 3, // Negociando vai para o final
    'vendido': 4
  };
  return priorities[status] || 999;
}