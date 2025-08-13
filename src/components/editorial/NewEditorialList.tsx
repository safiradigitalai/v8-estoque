'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface CategoryData {
  nome: string;
  slug: string;
  total_veiculos: number;
  valor_total: number;
  classes: Record<'A' | 'B' | 'C' | 'D', {
    quantidade: number;
    valor: number;
    percentual: number;
  }>;
}

interface BrandData {
  marca: string;
  total_veiculos: number;
  valor_total: number;
  categorias: CategoryData[];
}

interface VehicleData {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  classe_social: string;
  status: string;
  km: number;
  categoria_nome: string;
}


// Market Performance Component (simplified - no tags)
function MarketPerformance({ data }: { data: BrandData }) {
  const totalValue = data.valor_total;
  const vehicleCount = data.total_veiculos;
  const avgValue = totalValue / vehicleCount;
  
  const performance = avgValue > 150000 ? 'premium' : avgValue > 80000 ? 'mid' : 'entry';
  
  const performanceConfig = {
    premium: { color: 'from-violet-500 to-purple-600', accent: 'bg-violet-500' },
    mid: { color: 'from-cyan-400 to-blue-500', accent: 'bg-cyan-400' },
    entry: { color: 'from-emerald-400 to-green-500', accent: 'bg-emerald-400' }
  };
  
  const config = performanceConfig[performance];
  
  return (
    <div className={`w-3 h-3 rounded-full ${config.accent} shadow-lg shadow-current/30`} />
  );
}



// Vehicle Card Component
function VehicleCard({ vehicle, index }: { vehicle: VehicleData; index: number }) {
  const statusColors = {
    disponivel: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    reservado: 'bg-amber-100 text-amber-700 border-amber-200',
    vendido: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const classColors = {
    A: 'bg-violet-500',
    B: 'bg-cyan-400', 
    C: 'bg-sky-400',
    D: 'bg-fuchsia-500'
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
              {vehicle.modelo || 'Modelo não informado'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {vehicle.marca} • {vehicle.categoria_nome || 'Categoria'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${classColors[vehicle.classe_social as keyof typeof classColors] || 'bg-gray-400'}`} />
            <span className="text-xs font-mono text-gray-500">{vehicle.classe_social}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {vehicle.valor ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0
              }).format(vehicle.valor) : 'Preço sob consulta'}
            </span>
            
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColors[vehicle.status as keyof typeof statusColors] || statusColors.disponivel}`}>
              {vehicle.status === 'disponivel' ? 'Disponível' : 
               vehicle.status === 'reservado' ? 'Reservado' : 
               vehicle.status === 'vendido' ? 'Vendido' : vehicle.status}
            </div>
          </div>
          
          {vehicle.ano && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Ano: {vehicle.ano}</span>
              {vehicle.km && <span>• {vehicle.km.toLocaleString('pt-BR')} km</span>}
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>ID: {vehicle.id}</span>
              <span>#{index + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// New Sophisticated List Component
export function NewEditorialList({ 
  items, 
  isLoading = false 
}: {
  items: BrandData[];
  isLoading?: boolean;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryVehicles, setCategoryVehicles] = useState<VehicleData[]>([]);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(value);
  };

  const fetchCategoryVehicles = async (marca: string, categoria: CategoryData) => {
    const categorySlug = categoria.slug;
    const categoryName = categoria.nome;
    setLoadingCategory(`${marca}-${categoryName}`);
    try {
      const response = await fetch(`/api/veiculos?marca=${encodeURIComponent(marca)}&categoria=${encodeURIComponent(categorySlug)}&limit=50`);
      const data = await response.json();
      
      if (data.success !== false && data.data) {
        setCategoryVehicles(data.data);
        setExpandedCategory(`${marca}-${categoryName}`);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoadingCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-200 to-cyan-200 rounded-2xl" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-2 bg-gray-200 rounded w-full" />
                  </div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Simplified Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="font-medium">{items.length} marcas</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium">{items.reduce((sum, item) => sum + item.total_veiculos, 0)} veículos</span>
          <span className="text-gray-300 hidden md:inline">•</span>
          <span className="font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent hidden md:inline">
            {formatCurrency(items.reduce((sum, item) => sum + item.valor_total, 0))}
          </span>
        </div>
      </div>

      {/* Enhanced Brand Cards */}
      <div className="grid gap-6">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          
          return (
            <article
              key={index}
              className="group relative bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl border-0 shadow-sm hover:shadow-2xl hover:shadow-violet-100/30 transition-all duration-700 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.01] backdrop-blur-sm"
            >
              {/* Refined Continuous Header */}
              <div className="relative p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {/* Simplified Brand Identity */}
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl shadow-gray-900/20 transform group-hover:scale-110 transition-transform duration-500">
                        <span className="text-white font-bold text-lg md:text-xl">
                          {item.marca.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight leading-tight truncate">
                        {item.marca}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2 text-sm md:text-base">
                        <span className="font-medium text-gray-700">{item.total_veiculos} veículos</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent truncate">
                          {formatCurrency(item.valor_total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance indicator */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <MarketPerformance data={item} />
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                {/* Continuous Progress Flow */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.categorias?.slice(0, 4).map((cat: CategoryData, i: number) => {
                      const totalVehicles = item.categorias?.reduce((sum, c) => sum + c.total_veiculos, 0) || 1;
                      const percentage = (cat.total_veiculos / totalVehicles) * 100;
                      
                      return (
                        <div key={i} className="relative group/cat">
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 hover:border-violet-200/60 transition-all duration-300 hover:shadow-lg hover:shadow-violet-100/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-600 truncate">{cat.nome}</span>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${i % 4 === 0 ? 'from-violet-400 to-purple-500' : i % 4 === 1 ? 'from-cyan-400 to-blue-500' : i % 4 === 2 ? 'from-emerald-400 to-green-500' : 'from-pink-400 to-rose-500'}`} />
                            </div>
                            
                            <div className="flex items-end space-x-2">
                              <span className="text-lg font-bold text-gray-800">{cat.total_veiculos}</span>
                              <span className="text-xs text-gray-400 mb-0.5">un</span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r transition-all duration-1000 delay-${i * 200} ${i % 4 === 0 ? 'from-violet-400 to-purple-500' : i % 4 === 1 ? 'from-cyan-400 to-blue-500' : i % 4 === 2 ? 'from-emerald-400 to-green-500' : 'from-pink-400 to-rose-500'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Seamless Expand Control */}
                <div className="mt-6">
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="flex items-center justify-center w-full py-4 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group/expand border-0 hover:shadow-lg hover:shadow-violet-100/30 active:scale-[0.98]"
                    style={{ minHeight: '44px' }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 flex items-center justify-center transition-all duration-500 transform ${ isExpanded ? 'rotate-45 scale-110' : 'group-hover/expand:scale-110'}`}>
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover/expand:text-violet-700 transition-colors">
                        {isExpanded ? 'Ocultar detalhes' : `Ver detalhes (${item.categorias?.length || 0})`}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Refined Expanded Content */}
              {isExpanded && item.categorias && (
                <div className="bg-gradient-to-br from-white via-violet-50/20 to-cyan-50/10 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="grid gap-4">
                      {item.categorias.map((categoria: CategoryData, catIndex: number) => (
                        <div key={catIndex} className="space-y-3">
                          <button 
                            onClick={() => fetchCategoryVehicles(item.marca, categoria)}
                            disabled={loadingCategory === `${item.marca}-${categoria.nome}`}
                            className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-5 border-0 hover:bg-white/90 hover:shadow-xl hover:shadow-violet-100/20 transition-all duration-300 group/cat text-left active:scale-[0.98]"
                            style={{ minHeight: '44px' }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h5 className="text-lg font-medium text-gray-900 group-hover/cat:text-violet-700 transition-colors truncate">
                                    {categoria.nome}
                                  </h5>
                                  {loadingCategory === `${item.marca}-${categoria.nome}` && (
                                    <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="font-semibold text-gray-700">{categoria.total_veiculos} veículos</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent truncate">
                                    {formatCurrency(categoria.valor_total)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 flex items-center justify-center group-hover/cat:scale-110 transition-transform duration-300 flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>

                          {/* Vehicle Details Section */}
                          {expandedCategory === `${item.marca}-${categoria.nome}` && (
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="flex items-center justify-between mb-4">
                                <h6 className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                                  Veículos da categoria
                                </h6>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setExpandedCategory(null);
                                  }}
                                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-white"
                                >
                                  Fechar
                                </button>
                              </div>
                              
                              {categoryVehicles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                  {categoryVehicles.map((vehicle, vIndex) => (
                                    <VehicleCard key={vehicle.id} vehicle={vehicle} index={vIndex} />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <p>Nenhum veículo encontrado nesta categoria</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}