import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';

// Interfaces
interface VeiculoMicroMode {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  status: 'disponivel' | 'reservado' | 'negociando' | 'vendido';
  classe_social: 'A' | 'B' | 'C' | 'D';
  vendedor_id?: number;
  vendedor_nome?: string;
  categoria: string;
  dias_restantes?: number;
  data_reserva?: string;
  data_inicio_negociacao?: string;
}

interface KanbanColumn {
  id: string;
  titulo: string;
  marca: string;
  icone: string;
  veiculos: VeiculoMicroMode[];
}

interface MicroModeStats {
  total_veiculos: number;
  disponiveis: number;
  reservados: number;
  negociando: number;
  meus_reservados: number;
  meus_negociando: number;
}

// Hook principal do MicroMode
export function useMicroMode(vendedorId?: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados dos veículos organizados por marca
  const { data, error: swrError, mutate } = useSWR(
    vendedorId ? `/api/micromode?vendedor_id=${vendedorId}` : '/api/micromode',
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao carregar veículos');
      }
      return response.json();
    },
    {
      refreshInterval: 30000, // Atualizar a cada 30 segundos
      revalidateOnFocus: true,
      dedupingInterval: 5000
    }
  );

  const columns: KanbanColumn[] = data?.columns || [];

  // Calcular estatísticas
  const stats: MicroModeStats = {
    total_veiculos: columns.reduce((acc, col) => acc + col.veiculos.length, 0),
    disponiveis: columns.reduce((acc, col) => acc + col.veiculos.filter(v => v.status === 'disponivel').length, 0),
    reservados: columns.reduce((acc, col) => acc + col.veiculos.filter(v => v.status === 'reservado').length, 0),
    negociando: columns.reduce((acc, col) => acc + col.veiculos.filter(v => v.status === 'negociando').length, 0),
    meus_reservados: vendedorId ? columns.reduce((acc, col) => acc + col.veiculos.filter(v => v.status === 'reservado' && v.vendedor_id === vendedorId).length, 0) : 0,
    meus_negociando: vendedorId ? columns.reduce((acc, col) => acc + col.veiculos.filter(v => v.status === 'negociando' && v.vendedor_id === vendedorId).length, 0) : 0
  };

  // Função para executar ações no veículo
  const executeAction = useCallback(async (
    action: 'reservar' | 'negociar' | 'vender' | 'liberar' | 'cancelar',
    veiculoId: number,
    vendedorIdAction?: number
  ) => {
    if (!vendedorIdAction && !vendedorId) {
      throw new Error('ID do vendedor é obrigatório');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/micromode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          veiculo_id: veiculoId,
          vendedor_id: vendedorIdAction || vendedorId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro na operação');
      }

      // Revalidar dados
      await mutate();

      return {
        success: true,
        message: result.message,
        pontos_ganhos: result.pontos_ganhos || 0
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [vendedorId, mutate]);

  // Ações específicas
  const reservarVeiculo = useCallback((veiculoId: number) => 
    executeAction('reservar', veiculoId), [executeAction]);

  const iniciarNegociacao = useCallback((veiculoId: number) => 
    executeAction('negociar', veiculoId), [executeAction]);

  const finalizarVenda = useCallback((veiculoId: number) => 
    executeAction('vender', veiculoId), [executeAction]);

  const liberarVeiculo = useCallback((veiculoId: number) => 
    executeAction('liberar', veiculoId), [executeAction]);

  const cancelarNegociacao = useCallback((veiculoId: number) => 
    executeAction('cancelar', veiculoId), [executeAction]);

  // Refresh manual
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    // Dados
    columns,
    stats,
    vendedorId: data?.vendedor_id || vendedorId,
    
    // Estados
    isLoading: isLoading || !data,
    error: error || swrError?.message,
    
    // Ações
    reservarVeiculo,
    iniciarNegociacao,
    finalizarVenda,
    liberarVeiculo,
    cancelarNegociacao,
    executeAction,
    refresh
  };
}

// Hook para verificar e limpar reservas vencidas
export function useReservasCleanup() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);

  const runCleanup = useCallback(async () => {
    setIsRunning(true);
    
    try {
      const response = await fetch('/api/micromode/cleanup', {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLastCleanup(new Date());
        console.log('🧹 Limpeza executada:', result);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erro na limpeza:', error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, []);

  // Verificar status das reservas
  const { data: reservasStats } = useSWR(
    '/api/micromode/cleanup',
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao verificar reservas');
      return response.json();
    },
    {
      refreshInterval: 60000 // Verificar a cada minuto
    }
  );

  return {
    isRunning,
    lastCleanup,
    reservasStats: reservasStats?.estatisticas,
    runCleanup
  };
}

// Hook para estatísticas do vendedor no MicroMode
export function useMicroModeVendedor(vendedorId: number) {
  const { data, error } = useSWR(
    `/api/vendedores/${vendedorId}/micromode-stats`,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar stats do vendedor');
      return response.json();
    },
    {
      refreshInterval: 60000
    }
  );

  return {
    stats: data?.stats,
    ranking: data?.ranking,
    performance: data?.performance,
    isLoading: !data && !error,
    error: error?.message
  };
}