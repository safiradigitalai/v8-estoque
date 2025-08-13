'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DashboardResponse } from '@/types/api';

const fetcher = async (url: string): Promise<DashboardResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao carregar dashboard');
  return res.json();
};

export function useDashboard() {
  const { data, error, mutate, isLoading } = useSWR<DashboardResponse>(
    '/api/dashboard',
    fetcher,
    {
      refreshInterval: 30000, // Refresh a cada 30s
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // Subscription para updates em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('dashboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'veiculos'
        },
        (payload) => {
          console.log('Veículo alterado:', payload);
          mutate(); // Revalida dados do dashboard
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    dashboard: data,
    isLoading,
    isError: error,
    refresh: mutate
  };
}