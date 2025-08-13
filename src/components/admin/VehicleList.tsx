'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, Filter, Upload, MoreVertical, Car, MapPin, Gauge } from 'lucide-react';

// Tipos
interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  classe_social: 'A' | 'B' | 'C' | 'D';
  status: 'disponivel' | 'reservado' | 'vendido';
  dias_estoque: number;
  km?: number;
  cor?: string;
  combustivel?: string;
  cambio?: string;
  placa?: string;
  categoria_nome?: string;
  categoria_slug?: string;
  foto_principal?: string;
  foto_thumb?: string;
}

interface VehicleListProps {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onView: (vehicle: Vehicle) => void;
  onAdd: () => void;
  onImport: () => void;
}

export function VehicleList({ onEdit, onDelete, onView, onAdd, onImport }: VehicleListProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicles, setSelectedVehicles] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/veiculos?${params}`);
      const data = await response.json();

      if (response.ok && data.data) {
        setVehicles(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 1 // Permitir 1 casa decimal para melhor precisão
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'reservado':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'vendido':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getClassColor = (classe: string) => {
    switch (classe) {
      case 'A':
        return 'bg-violet-500';
      case 'B':
        return 'bg-cyan-400';
      case 'C':
        return 'bg-sky-400';
      case 'D':
        return 'bg-fuchsia-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleSelectVehicle = (id: number) => {
    const newSelection = new Set(selectedVehicles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedVehicles(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedVehicles.size === vehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(vehicles.map(v => v.id)));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-200 to-cyan-200 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* List Skeleton */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <div className="animate-pulse">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-24" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com controles */}
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden">
        <div className="p-8">
          {/* Título e estatísticas */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">Gestão de Veículos</h1>
                <p className="text-gray-600 mt-1">Administre seu inventário automotivo</p>
              </div>
            </div>

            {/* Ações principais */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onImport}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-700 hover:text-violet-700 border border-white/40 hover:border-violet-200"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Importar</span>
              </button>

              <button
                onClick={onAdd}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 hover:from-violet-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Veículo</span>
              </button>
            </div>
          </div>

          {/* Controles de busca e filtro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Busca */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400"
              />
            </div>

            {/* Filtro de Status */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 appearance-none"
              >
                <option value="all">Todos os status</option>
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
          </div>

          {/* Ações em lote (se houver seleções) */}
          {selectedVehicles.size > 0 && (
            <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-violet-700 font-medium">
                  {selectedVehicles.size} veículo(s) selecionado(s)
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-sm bg-white rounded-lg hover:bg-violet-100 transition-colors text-violet-700">
                    Exportar
                  </button>
                  <button className="px-4 py-2 text-sm bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">
                    Ações em Lote
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indicador de progresso */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-20" />
      </div>

      {/* Lista de veículos */}
      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Nenhum veículo encontrado</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Ajuste os filtros ou adicione novos veículos ao inventário'
                : 'Comece adicionando seu primeiro veículo ao inventário'
              }
            </p>
            <button
              onClick={onAdd}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:from-violet-600 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Veículo</span>
            </button>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Checkbox de seleção */}
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.has(vehicle.id)}
                      onChange={() => handleSelectVehicle(vehicle.id)}
                      className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
                    />

                    {/* Imagem do veículo ou placeholder */}
                    <div className="relative w-20 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                      {vehicle.foto_thumb ? (
                        <img
                          src={vehicle.foto_thumb}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-8 h-8 text-white opacity-60" />
                        </div>
                      )}
                      
                      {/* Indicador de classe social */}
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getClassColor(vehicle.classe_social)} shadow-lg`} />
                    </div>

                    {/* Informações principais */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {vehicle.marca} {vehicle.modelo}
                        </h3>
                        <span className="text-sm text-gray-500">• {vehicle.ano}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        {vehicle.categoria_nome && (
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-violet-400" />
                            <span>{vehicle.categoria_nome}</span>
                          </span>
                        )}
                        
                        {vehicle.km && (
                          <span className="flex items-center space-x-1">
                            <Gauge className="w-3 h-3" />
                            <span>{vehicle.km.toLocaleString()} km</span>
                          </span>
                        )}
                        
                        {vehicle.placa && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{vehicle.placa}</span>
                          </span>
                        )}
                      </div>

                      {/* Status e valor */}
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status === 'disponivel' ? 'Disponível' : 
                           vehicle.status === 'reservado' ? 'Reservado' : 'Vendido'}
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          {vehicle.dias_estoque} dias em estoque
                        </span>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(vehicle.valor)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Classe {vehicle.classe_social}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onView(vehicle)}
                        className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-600 hover:text-blue-600"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-600 hover:text-violet-600"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(vehicle)}
                        className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-600 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de progresso sutil */}
              <div className="h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-lg'
                  : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}