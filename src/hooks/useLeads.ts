'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface LeadsResumo {
  total_leads: number;
  leads_hoje: number;
  conversoes_total: number;
  conversoes_mes: number;
  taxa_conversao: number;
  follow_ups_pendentes: number;
}

export interface LeadOrigem {
  nome: string;
  cor: string;
  leads: number;
  conversoes: number;
  taxa_conversao: number;
}

export interface LeadPipeline {
  etapa: string;
  cor: string;
  ordem: number;
  quantidade: number;
}

export interface LeadAlerta {
  id: number;
  cliente: string;
  telefone: string;
  tipo_ultimo_contato: string;
  horas_pendente: number;
  urgencia: 'baixa' | 'media' | 'alta';
  proxima_acao: string;
  vendedor: string;
}

export interface LeadsData {
  resumo: LeadsResumo;
  origens: LeadOrigem[];
  pipeline: LeadPipeline[];
  alertas: LeadAlerta[];
}

interface LeadsResponse {
  success: boolean;
  data?: LeadsData;
  error?: string;
}

const fetcher = async (url: string): Promise<LeadsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao carregar leads');
  return res.json();
};

export function useLeads() {
  const { data, error, mutate, isLoading } = useSWR<LeadsResponse>(
    '/api/leads?overview=true',
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
      .channel('leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Lead alterado:', payload);
          mutate(); // Revalida dados dos leads
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads_interacoes'
        },
        (payload) => {
          console.log('Interação de lead alterada:', payload);
          mutate(); // Revalida dados dos leads
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads_pipeline'
        },
        (payload) => {
          console.log('Pipeline de lead alterado:', payload);
          mutate(); // Revalida dados dos leads
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    leadsData: data?.data || null,
    isLoading,
    isError: error,
    refresh: mutate,
    success: data?.success || false
  };
}

// Hook para criar novos leads
export function useCreateLead() {
  const { mutate } = useSWR('/api/leads?overview=true');

  const createLead = async (leadData: {
    nome: string;
    telefone?: string;
    email?: string;
    origem_id: number;
    vendedor_id?: number;
    interesse?: string;
    valor_estimado?: number;
    prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
  }) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar lead');
      }

      // Revalida os dados após criação
      mutate();

      return result;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  };

  return { createLead };
}