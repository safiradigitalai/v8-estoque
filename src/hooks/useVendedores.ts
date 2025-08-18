'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DashboardVendedor } from '@/types/database';

interface VendedoresResponse {
  success: boolean;
  data: DashboardVendedor[];
  meta?: {
    total: number;
    mock: boolean;
  };
  error?: string;
}

const fetcher = async (url: string): Promise<VendedoresResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao carregar vendedores');
  return res.json();
};

export function useVendedores() {
  const { data, error, mutate, isLoading } = useSWR<VendedoresResponse>(
    '/api/vendedores',
    fetcher,
    {
      refreshInterval: 60000, // Refresh a cada 60s
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // Subscription para updates em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('vendedores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendedores'
        },
        (payload) => {
          console.log('Vendedor alterado:', payload);
          mutate(); // Revalida dados dos vendedores
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendedores_metricas'
        },
        (payload) => {
          console.log('Métricas de vendedor alteradas:', payload);
          mutate(); // Revalida dados dos vendedores
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    vendedores: data?.data || [],
    isLoading,
    isError: error,
    refresh: mutate,
    meta: data?.meta
  };
}