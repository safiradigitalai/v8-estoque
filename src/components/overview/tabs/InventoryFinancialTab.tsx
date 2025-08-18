'use client';

import { useState } from 'react';
import { Search, Minus } from 'lucide-react';
import { NewEditorialList } from '../../editorial/NewEditorialList';

// Componente de Seção Editorial reutilizado
function EditorialSection({ 
  titulo, 
  numero, 
  children,
  color = 'blue'
}: {
  titulo: string;
  numero: string;
  children: React.ReactNode;
  color?: 'blue' | 'cyan' | 'indigo' | 'slate';
}) {
  const colorClasses = {
    blue: 'group-hover:text-blue-500 group-hover:shadow-blue-200',
    cyan: 'group-hover:text-cyan-400 group-hover:shadow-cyan-200',
    indigo: 'group-hover:text-indigo-500 group-hover:shadow-indigo-200',
    slate: 'group-hover:text-slate-500 group-hover:shadow-slate-200'
  };

  return (
    <section className="animate-fadeInUp">
      <div className="mb-8 lg:mb-12 group">
        <div className="flex items-baseline space-x-6 mb-4 lg:mb-6">
          <span className={`font-mono text-xs lg:text-sm text-gray-400 tracking-widest transition-all duration-300 cursor-pointer hover:scale-110 ${colorClasses[color]} select-none`}>
            {numero}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-blue-200 group-hover:via-indigo-200 group-hover:to-blue-200 transition-all duration-500" />
        </div>
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

// Grid Editorial reutilizado
function EditorialGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-12 lg:space-y-16">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
      {children}
    </div>
  );
}

interface DashboardData {
  resumo: {
    total_veiculos: number;
    valor_total: number;
    por_status: {
      disponivel: number;
      reservado: number;
      vendido: number;
    };
  };
  hierarquia?: Array<{
    marca: string;
    total_veiculos: number;
    valor_total: number;
    categorias: Array<{
      nome: string;
      slug: string;
      total_veiculos: number;
      valor_total: number;
      classes: Record<'A' | 'B' | 'C' | 'D', {
        quantidade: number;
        valor: number;
        percentual: number;
      }>;
    }>;
  }>;
}

interface InventoryFinancialTabProps {
  dashboard?: DashboardData;
  isLoading?: boolean;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
}

export function InventoryFinancialTab({ 
  dashboard, 
  isLoading = false,
  showMobileSearch,
  setShowMobileSearch 
}: InventoryFinancialTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  // Filtrar hierarquia baseado na busca
  const marcasFiltradas = dashboard?.hierarquia?.filter(marca => 
    marca.marca.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <EditorialGrid>
      {/* Seção de Métricas Compactas */}
      <div className="space-y-4 md:space-y-6">
        {/* Header Compacto */}
        <div className="text-center space-y-2 md:space-y-3">
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1" />
            <h2 className="text-lg md:text-2xl font-light text-gray-900 tracking-tight">
              Inventário & Financeiro
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent flex-1" />
          </div>
          <p className="text-gray-600 font-mono text-xs md:text-sm uppercase tracking-widest">
            Visão consolidada do estoque
          </p>
        </div>

        {/* Cards de Métricas - 4 cards no padrão das outras tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Total de Veículos */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 text-xs font-mono uppercase tracking-wider">
                  Total Inventário
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  ↗ +12%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {dashboard?.resumo.total_veiculos || 0}
                  </span>
                  <span className="text-xs text-blue-200">veículos</span>
                </div>
                <p className="text-blue-200 text-xs">
                  Meta: 240 ({Math.round(((dashboard?.resumo.total_veiculos || 0) / 240) * 100)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Valor do Inventário */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-indigo-100 text-xs font-mono uppercase tracking-wider">
                  Valor Total
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  ↗ +8%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {formatCurrency(dashboard?.resumo.valor_total || 0)}
                  </span>
                </div>
                <p className="text-indigo-200 text-xs">
                  Valor médio: {formatCurrency((dashboard?.resumo.valor_total || 0) / (dashboard?.resumo.total_veiculos || 1))}
                </p>
              </div>
            </div>
          </div>

          {/* Disponíveis */}
          <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-100 text-xs font-mono uppercase tracking-wider">
                  Disponível
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  ↗ +5%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {dashboard?.resumo.por_status.disponivel || 0}
                  </span>
                  <span className="text-xs text-emerald-200">unidades</span>
                </div>
                <p className="text-emerald-200 text-xs">
                  {Math.round(((dashboard?.resumo.por_status.disponivel || 0) / (dashboard?.resumo.total_veiculos || 1)) * 100)}% do estoque
                </p>
              </div>
            </div>
          </div>

          {/* Reservados */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-amber-100 text-xs font-mono uppercase tracking-wider">
                  Reservados
                </p>
                <span className="text-xs font-mono bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  ↘ {dashboard?.resumo.por_status.reservado || 0}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {dashboard?.resumo.por_status.reservado || 0}
                  </span>
                  <span className="text-xs text-amber-200">aguardando</span>
                </div>
                <p className="text-amber-200 text-xs">
                  {dashboard?.resumo.por_status.vendido || 0} vendidos no mês
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Seção de Busca Editorial */}
      <div className="my-12 lg:my-16 group">
        <div className={`relative flex items-center space-x-4 lg:space-x-6 py-8 border-b-2 transition-all duration-300 ${
          isSearchFocused 
            ? 'border-gradient-to-r from-blue-400 via-indigo-400 to-blue-400' 
            : 'border-gray-200 group-hover:border-blue-200'
        }`}>
          {/* Search icon */}
          <div className="relative">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest whitespace-nowrap group-hover:text-blue-500 transition-colors">
              Buscar
            </span>
            {isSearchFocused && (
              <div className="absolute inset-0 bg-blue-400 blur-md opacity-20 animate-pulse" />
            )}
          </div>
          
          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Digite o nome da marca..."
              className={`w-full text-lg lg:text-xl font-light bg-transparent border-none outline-none placeholder-gray-400 py-2 transition-all duration-300 ${
                isSearchFocused ? 'text-blue-700 placeholder-blue-300' : 'text-gray-900'
              }`}
            />
            
            {/* Search feedback */}
            {searchTerm && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  <span>{marcasFiltradas.length}</span>
                  <span>resultado{marcasFiltradas.length !== 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-10 h-10 md:w-6 md:h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Minus className="w-4 h-4 md:w-3 md:h-3" />
                </button>
              </div>
            )}
            
            {/* Typing indicator */}
            {isSearchFocused && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Search suggestions */}
        {isSearchFocused && !searchTerm && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-400/10 rounded-lg border border-blue-400/20">
            <p className="text-sm text-gray-600 mb-2 font-medium">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {dashboard?.hierarquia?.slice(0, 4).map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSearchTerm(item.marca)}
                  className="px-4 py-3 md:px-3 md:py-1 bg-white text-blue-500 rounded-full text-sm md:text-xs hover:bg-blue-500/10 hover:shadow-sm transition-all duration-200 border border-blue-400/30 active:scale-95"
                  style={{ minHeight: '44px' }}
                >
                  {item.marca}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Marcas Editorial */}
      <EditorialSection
        titulo="Análise por Marca"
        numero="03"
        color="indigo"
      >
        <NewEditorialList
          items={marcasFiltradas}
          isLoading={isLoading}
        />
      </EditorialSection>
    </EditorialGrid>
  );
}