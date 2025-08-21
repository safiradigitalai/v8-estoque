'use client';

import { useState } from 'react';
import { MicroModeModule } from '@/components/micromode/MicroModeModule';
import { MicroModeLoginScreen } from '@/components/micromode/MicroModeLoginScreen';
import { useAuth } from '@/hooks/useAuth';

export default function MicroModePage() {
  const { isAuthenticated, isLoading: authLoading, logout, login } = useAuth();
  const [vendedorData, setVendedorData] = useState<{
    id: number;
    nome: string;
    isAdmin?: boolean;
  } | null>(null);

  // Simular dados do vendedor logado - em produção viria do contexto de auth
  const mockVendedorData = {
    id: 1,
    nome: 'João Silva',
    isAdmin: false
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-4xl font-extralight text-gray-400 tracking-[0.2em] animate-pulse">
            MICRO<span className="text-3xl">MODE</span>
          </div>
          <div className="w-16 h-px bg-gray-300 animate-pulse"></div>
          <p className="text-xs font-light text-gray-400 tracking-[0.2em] uppercase">Verificando acesso</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <MicroModeLoginScreen 
        onLoginSuccess={(username) => {
          // Atualizar o estado de autenticação no hook
          login(username);
          // Em produção, os dados do vendedor viriam da API de auth
          setVendedorData(mockVendedorData);
        }} 
      />
    );
  }

  return (
    <MicroModeModule
      vendedorId={vendedorData?.id || mockVendedorData.id}
      vendedorNome={vendedorData?.nome || mockVendedorData.nome}
      isAdmin={vendedorData?.isAdmin || mockVendedorData.isAdmin}
      onLogout={() => {
        setVendedorData(null);
        logout();
      }}
    />
  );
}