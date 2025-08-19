'use client';

import { useState } from 'react';

interface VendedoresDashboardProps {
  onNavigateToLista: () => void;
  onNavigateToAdicionar: () => void;
  onNavigateToConfiguracoes: () => void;
  onNavigateToEditar?: (vendedor: any) => void;
}

export function VendedoresDashboard({ 
  onNavigateToLista, 
  onNavigateToAdicionar, 
  onNavigateToConfiguracoes, 
  onNavigateToEditar 
}: VendedoresDashboardProps) {
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Vendedores - TESTE SIMPLES</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={onNavigateToLista}
          className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Ver Lista
        </button>
        <button 
          onClick={onNavigateToAdicionar}
          className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Adicionar
        </button>
        <button 
          onClick={onNavigateToConfiguracoes}
          className="p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Configurações
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">Este é um teste simples para verificar se o problema do botão V8 persiste.</p>
        <p className="text-gray-600">Role a página para baixo e observe o comportamento do botão V8.</p>
        
        {/* Conteúdo para criar scroll */}
        {Array.from({length: 30}).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium">Item {i + 1}</h3>
            <p className="text-gray-600">Conteúdo de teste para criar scroll na página</p>
          </div>
        ))}
      </div>
    </div>
  );
}