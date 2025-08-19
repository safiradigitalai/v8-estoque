'use client';

import { useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { useVendedores } from '@/hooks/useVendedores';

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
  
  const { vendedores, isLoading, isError, refresh } = useVendedores();

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Users className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Erro ao carregar vendedores</h3>
        <button 
          onClick={refresh}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar Novamente</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* APENAS A SEGUNDA SEÇÃO - RANKING DE ELITE */}
      <section className="animate-fadeInUp">
        <div className="mb-8 lg:mb-12 group">
          <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
            <span className="font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 group-hover:text-purple-500 group-hover:shadow-purple-200 select-none">
              002
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-purple-200 group-hover:via-violet-200 group-hover:to-purple-200 transition-all duration-500" />
          </div>
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
            Ranking de Elite - Top Performers
          </h2>
        </div>

        {/* Top 5 Vendedores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {isLoading ? (
            Array.from({length: 5}).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            vendedores.slice(0, 5).map((vendedor) => (
              <div
                key={vendedor.id}
                className="group relative bg-white rounded-3xl border border-gray-100 p-6 transition-all duration-500 hover:shadow-strong cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {vendedor.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg bg-gradient-to-br from-yellow-400 to-amber-500 text-white">
                        #{vendedor.ranking_geral}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-300">
                          {vendedor.nome}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-xl border bg-green-100 text-green-800 border-green-200">
                          {vendedor.nivel}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-xl border bg-blue-100 text-blue-800 border-blue-200">
                          {vendedor.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{vendedor.vendas_mes_atual}</div>
                      <div className="text-xs text-gray-500">Vendas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{vendedor.pontuacao}</div>
                      <div className="text-xs text-gray-500">Pontos</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ver Todos Link */}
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateToLista}
            className="group inline-flex items-center space-x-3 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm font-medium cursor-pointer"
          >
            <span>Ver Todos os {vendedores.length} Vendedores</span>
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Conteúdo adicional para scroll */}
      <div className="space-y-4">
        {Array.from({length: 10}).map((_, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-xl">
            <h3 className="font-medium mb-2">Item de teste {i + 1}</h3>
            <p className="text-gray-600">Conteúdo para criar scroll e testar o botão V8</p>
          </div>
        ))}
      </div>
    </div>
  );
}