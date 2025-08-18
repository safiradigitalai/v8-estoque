'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Car,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  AlertCircle,
  EyeOff,
  Star,
  ShoppingCart,
  Check,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

// Interface para veículo
interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
  classe_social: 'A' | 'B' | 'C' | 'D';
  status: 'disponivel' | 'reservado' | 'vendido';
  vitrine_status: 'visivel' | 'oculto' | 'destaque';
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

interface EstoqueListagemProps {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onImport: () => void;
}

export function EstoqueListagem({ onBack, onAdd, onEdit, onImport }: EstoqueListagemProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vitrineFilter, setVitrineFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Erro ao carregar veículos');
      }
      
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reservado':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'vendido':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getClasseColor = (classe: string) => {
    switch (classe) {
      case 'A':
        return 'bg-purple-100 text-purple-700';
      case 'B':
        return 'bg-blue-100 text-blue-700';
      case 'C':
        return 'bg-green-100 text-green-700';
      case 'D':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getVitrineColor = (vitrine_status: string) => {
    switch (vitrine_status) {
      case 'visivel':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'oculto':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'destaque':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleToggleVitrine = async (vehicleId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'visivel' ? 'oculto' : 'visivel';
    console.log(`Toggling vitrine for vehicle ${vehicleId} to ${newStatus}`);
  };

  const handleMarkAsSold = async (vehicleId: number) => {
    console.log(`Marking vehicle ${vehicleId} as sold and hiding from vitrine`);
  };

  const handleToggleDestaque = async (vehicleId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'destaque' ? 'visivel' : 'destaque';
    console.log(`Toggling destaque for vehicle ${vehicleId} to ${newStatus}`);
  };

  const handleDelete = async (vehicleId: number) => {
    if (confirm('Tem certeza que deseja deletar este veículo?')) {
      console.log(`Deleting vehicle ${vehicleId}`);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesVitrine = vitrineFilter === 'all' || vehicle.vitrine_status === vitrineFilter;
    
    return matchesSearch && matchesStatus && matchesVitrine;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-200 rounded-3xl mx-auto shimmer" />
              <div className="w-96 h-12 bg-gradient-to-r from-emerald-200 to-green-200 rounded mx-auto shimmer" />
              <div className="w-64 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto shimmer" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-light text-gray-900">Erro ao Carregar</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchVehicles}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20">
      {/* Header seguindo padrão Overview */}
      <header className="bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/20 border-b border-white/20 shadow-lg shadow-blue-100/20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Header principal */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/20 transition-all duration-500">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Catálogo
                  </h1>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    V8 Sistema
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Toggle Mobile */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${
                        viewMode === 'grid' 
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${
                        viewMode === 'list' 
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block py-8 lg:py-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-900/20 transition-all duration-500">
                      <Settings className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900">
                      Catálogo Premium
                    </h1>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Gestão & Controle de Coleção
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* View Toggle Desktop */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-1.5 shadow-lg shadow-gray-100/20">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                        viewMode === 'grid' 
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                        viewMode === 'list' 
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Botão Voltar */}
                <div className="relative">
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 active:scale-95 group cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-amber-600 group-hover:scale-110 transition-all duration-300" />
                    <span className="font-mono text-sm uppercase tracking-wider text-gray-700 group-hover:text-amber-700">Voltar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 md:pb-12">

        {/* Search & Filter Section - Elegante mas no nosso padrão */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 p-8 mb-12 shadow-xl shadow-gray-100/20">
          <div className="space-y-6">
            {/* Search Header */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-light text-gray-900 tracking-tight">Busca Avançada</h2>
              <p className="text-gray-600">Encontre veículos em nossa coleção exclusiva</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por marca, modelo..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-emerald-600 transition-colors">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Status do Veículo
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 hover:border-amber-300"
                >
                  <option value="all">Todos os Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>

              {/* Vitrine Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4 inline mr-2" />
                  Status da Vitrine
                </label>
                <select
                  value={vitrineFilter}
                  onChange={(e) => setVitrineFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                >
                  <option value="all">Todas as Vitrines</option>
                  <option value="visivel">Visível</option>
                  <option value="oculto">Oculto</option>
                  <option value="destaque">Em Destaque</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Ações Rápidas
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={onAdd}
                    className="flex-1 px-4 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all duration-300 font-medium text-sm"
                  >
                    + Novo
                  </button>
                  <button
                    onClick={onImport}
                    className="flex-1 px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-300 font-medium text-sm"
                  >
                    Importar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-gray-700 font-medium">
                {filteredVehicles.length} veículos encontrados
              </p>
              {(searchTerm || statusFilter !== 'all' || vitrineFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setVitrineFilter('all');
                  }}
                  className="text-sm text-gray-500 hover:text-amber-600 underline transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Collection - Editorial Magazine Style */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-400/10 to-emerald-500/10 blur-3xl opacity-30" />
              <div className="relative space-y-6">
                <Car className="w-20 h-20 text-gray-300 mx-auto" />
                <div className="space-y-3">
                  <h3 className="text-2xl font-light text-gray-900 tracking-wide">Coleção Vazia</h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    {searchTerm || statusFilter !== 'all' || vitrineFilter !== 'all' 
                      ? 'Nenhum veículo encontrado com os filtros aplicados'
                      : 'Comece criando sua primeira obra-prima automotiva'
                    }
                  </p>
                </div>
                {!searchTerm && statusFilter === 'all' && vitrineFilter === 'all' && (
                  <button
                    onClick={onAdd}
                    className="px-8 py-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all duration-300 shadow-lg shadow-amber-500/20 font-medium"
                  >
                    Adicionar Primeiro Veículo
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredVehicles.map((vehicle, index) => (
              <article 
                key={vehicle.id}
                className={`group relative bg-white rounded-3xl border border-gray-200/60 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-700 hover:scale-[1.02] overflow-hidden ${
                  viewMode === 'list' ? 'p-8' : 'p-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Editorial Header Section */}
                <div className="relative p-8 pb-6">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent opacity-50" />
                  
                  {/* Vehicle Number & Classification */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs text-gray-400 tracking-[0.2em] uppercase">
                        #{String(vehicle.id).padStart(3, '0')}
                      </span>
                      <div className="w-8 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>
                    
                    {vehicle.vitrine_status === 'destaque' && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 blur-sm opacity-30" />
                        <div className="relative flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium tracking-wide">Destaque</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Identity */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-light text-gray-900 tracking-tight leading-tight mb-1">
                        {vehicle.marca}
                      </h3>
                      <p className="text-lg text-gray-600 font-light tracking-wide">
                        {vehicle.modelo}
                      </p>
                    </div>
                    
                    {/* Editorial Status Tags */}
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status === 'disponivel' ? 'Disponível' : 
                         vehicle.status === 'reservado' ? 'Reservado' : 'Vendido'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${getVitrineColor(vehicle.vitrine_status)}`}>
                        {vehicle.vitrine_status === 'visivel' ? 'Vitrine' : 
                         vehicle.vitrine_status === 'oculto' ? 'Privado' : 'Destaque'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${getClasseColor(vehicle.classe_social)}`}>
                        Classe {vehicle.classe_social}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specifications Grid - Editorial Style */}
                <div className="px-8 pb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="group/spec">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/spec:bg-emerald-100 transition-colors">
                            <Calendar className="w-4 h-4 text-gray-500 group-hover/spec:text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Ano</p>
                            <p className="text-sm font-medium text-gray-900">{vehicle.ano}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group/spec">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/spec:bg-blue-100 transition-colors">
                            <Fuel className="w-4 h-4 text-gray-500 group-hover/spec:text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Combustível</p>
                            <p className="text-sm font-medium text-gray-900">{vehicle.combustivel || 'Premium'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="group/spec">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/spec:bg-purple-100 transition-colors">
                            <Gauge className="w-4 h-4 text-gray-500 group-hover/spec:text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Quilometragem</p>
                            <p className="text-sm font-medium text-gray-900">{vehicle.km ? `${vehicle.km.toLocaleString()} km` : 'Zero KM'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group/spec">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/spec:bg-amber-100 transition-colors">
                            <Settings className="w-4 h-4 text-gray-500 group-hover/spec:text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Câmbio</p>
                            <p className="text-sm font-medium text-gray-900">{vehicle.cambio || 'Automático'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Section - Editorial */}
                <div className="px-8 pb-6">
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Investimento</p>
                        <p className="text-3xl font-light text-gray-900 tracking-tight">
                          {formatCurrency(vehicle.valor)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Estoque</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {vehicle.dias_estoque} dias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Action Bar */}
                <div className="bg-gray-50/80 border-t border-gray-200/60 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Vitrine Toggle */}
                      <button
                        onClick={() => handleToggleVitrine(vehicle.id, vehicle.vitrine_status || 'visivel')}
                        disabled={vehicle.status === 'vendido'}
                        className={`group/btn w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${
                          vehicle.status === 'vendido' 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : vehicle.vitrine_status === 'oculto' 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-lg hover:shadow-red-500/20' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow-lg hover:shadow-blue-500/20'
                        }`}
                        title={
                          vehicle.status === 'vendido' 
                            ? 'Veículos vendidos saem automaticamente da vitrine' 
                            : vehicle.vitrine_status === 'oculto' 
                              ? 'Mostrar na Vitrine' 
                              : 'Ocultar da Vitrine'
                        }
                      >
                        {vehicle.status === 'vendido' ? 
                          <X className="w-4 h-4" /> :
                          vehicle.vitrine_status === 'oculto' ? 
                            <EyeOff className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" /> :
                            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        }
                      </button>
                      
                      {/* Feature Toggle */}
                      <button
                        onClick={() => handleToggleDestaque(vehicle.id, vehicle.vitrine_status || 'visivel')}
                        disabled={vehicle.status === 'vendido'}
                        className={`group/btn w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${
                          vehicle.status === 'vendido' 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : vehicle.vitrine_status === 'destaque' 
                              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-500/20' 
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:shadow-lg hover:shadow-gray-500/20'
                        }`}
                        title={
                          vehicle.status === 'vendido' 
                            ? 'Veículos vendidos não podem ter destaque' 
                            : vehicle.vitrine_status === 'destaque' 
                              ? 'Remover Destaque' 
                              : 'Adicionar Destaque'
                        }
                      >
                        <Star className={`w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300 ${
                          vehicle.vitrine_status === 'destaque' && vehicle.status !== 'vendido' ? 'fill-current' : ''
                        }`} />
                      </button>
                      
                      {/* Mark as Sold */}
                      <button
                        onClick={() => handleMarkAsSold(vehicle.id)}
                        disabled={vehicle.status === 'vendido'}
                        className={`group/btn w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${
                          vehicle.status === 'vendido'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-100 text-amber-600 hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-500/20'
                        }`}
                        title={vehicle.status === 'vendido' ? 'Já está vendido' : 'Marcar como Vendido'}
                      >
                        {vehicle.status === 'vendido' ? 
                          <Check className="w-4 h-4" /> :
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        }
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="group/btn w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        title="Editar Veículo"
                      >
                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="group/btn w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                        title="Deletar Veículo"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Styles - Mantendo elegância */}
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
          
          @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
          }
          
          .shimmer {
            background: linear-gradient(90deg, #f1f5f9 0px, #e2e8f0 40px, #f1f5f9 80px);
            background-size: 200px 100%;
            animation: shimmer 1.5s infinite;
          }
          
          /* Enhanced focus states for accessibility */
          button:focus-visible {
            outline: 2px solid #10b981;
            outline-offset: 2px;
          }
        `}</style>
      </main>
    </div>
  );
}