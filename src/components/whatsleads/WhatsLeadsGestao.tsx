'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Phone,
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Users,
  Car,
  Menu,
  X
} from 'lucide-react';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';

// Types para leads
interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  status: 'novo' | 'qualificado' | 'proposta' | 'negociacao' | 'agendado' | 'convertido' | 'perdido';
  origem: 'whatsapp' | 'site' | 'indicacao' | 'telefone' | 'walk-in';
  interesse: {
    veiculo?: string;
    categoria?: string;
    valor_max?: number;
  };
  score: number; // 0-100
  ultima_interacao: string;
  data_criacao: string;
  vendedor_responsavel?: string;
  observacoes?: string;
  tags: string[];
}

// Mock data para demonstração
const leadsMock: Lead[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    telefone: '+55 11 99999-9999',
    email: 'carlos@email.com',
    status: 'qualificado',
    origem: 'whatsapp',
    interesse: {
      veiculo: 'Golf GTI',
      categoria: 'Hatchback',
      valor_max: 90000
    },
    score: 85,
    ultima_interacao: '2h atrás',
    data_criacao: '2024-01-15',
    vendedor_responsavel: 'João Santos',
    observacoes: 'Cliente interessado em financiamento',
    tags: ['hot', 'financiamento']
  },
  {
    id: '2',
    nome: 'Ana Santos',
    telefone: '+55 11 88888-8888',
    email: 'ana@email.com',
    status: 'proposta',
    origem: 'site',
    interesse: {
      veiculo: 'Civic',
      categoria: 'Sedan',
      valor_max: 120000
    },
    score: 92,
    ultima_interacao: '1 dia',
    data_criacao: '2024-01-10',
    vendedor_responsavel: 'Maria Silva',
    tags: ['premium', 'decisor']
  },
  {
    id: '3',
    nome: 'Roberto Lima',
    telefone: '+55 11 77777-7777',
    status: 'novo',
    origem: 'whatsapp',
    interesse: {
      categoria: 'SUV',
      valor_max: 80000
    },
    score: 45,
    ultima_interacao: '3h atrás',
    data_criacao: '2024-01-17',
    tags: ['first-time']
  }
];

interface WhatsLeadsGestaoProps {
  onVoltar: () => void;
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}

export function WhatsLeadsGestao({ 
  onVoltar, 
  onModuleChange, 
  onLogout, 
  onRefresh 
}: WhatsLeadsGestaoProps) {
  const [leads, setLeads] = useState<Lead[]>(leadsMock);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todos');
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estatísticas
  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    qualificados: leads.filter(l => l.status === 'qualificado').length,
    propostas: leads.filter(l => l.status === 'proposta').length,
    convertidos: leads.filter(l => l.status === 'convertido').length,
    score_medio: leads.reduce((acc, l) => acc + l.score, 0) / leads.length
  };

  // Filtrar leads
  const leadsFiltrados = leads.filter(lead => {
    const matchBusca = lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      lead.telefone.includes(busca) ||
                      lead.email?.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchOrigem = filtroOrigem === 'todos' || lead.origem === filtroOrigem;

    return matchBusca && matchStatus && matchOrigem;
  });

  // Cores por status
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'qualificado':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'proposta':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'negociacao':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agendado':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'convertido':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'perdido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Ícone por origem
  const getOrigemIcon = (origem: Lead['origem']) => {
    switch (origem) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'site':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'telefone':
        return <Phone className="w-4 h-4 text-purple-600" />;
      case 'indicacao':
        return <Users className="w-4 h-4 text-orange-600" />;
      case 'walk-in':
        return <User className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-6">
      {/* Mobile-First Header */}
      <header className="mb-6 sm:mb-8">
        
        {/* Mobile Layout */}
        <div className="sm:hidden">
          {/* Top Row: Back button + Title */}
          <div className="flex items-center space-x-4 px-4 py-4 border-b border-gray-100">
            <button
              onClick={onVoltar}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-light text-gray-900 tracking-wide mb-1">
                Gestão de Leads
              </h1>
              <div className="text-xs text-gray-500 font-light">
                Pipeline de vendas e conversões
              </div>
            </div>

            <button 
              onClick={() => setMostrarFiltros(true)}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          {/* Editorial Status */}
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-px bg-gray-300"></div>
              <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase">Pipeline de Leads</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-green-700 transition-colors duration-300">{stats.total}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-green-600 transition-colors duration-300">Total</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-green-300 transition-colors duration-300"></div>
              </div>
              
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">{stats.novos}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-blue-600 transition-colors duration-300">Novos</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-blue-300 transition-colors duration-300"></div>
              </div>
              
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-amber-700 transition-colors duration-300">{stats.qualificados}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-amber-600 transition-colors duration-300">Qualif.</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-amber-300 transition-colors duration-300"></div>
              </div>
              
              <div className="text-center group">
                <div className="text-lg font-extralight text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors duration-300">{stats.convertidos}</div>
                <div className="text-xs font-light text-gray-500 tracking-[0.1em] uppercase group-hover:text-emerald-600 transition-colors duration-300">Fechados</div>
                <div className="w-full h-px bg-gray-200 mt-2 group-hover:bg-emerald-300 transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block px-6 lg:px-8">
          <div className="flex items-center justify-between py-8 lg:py-12">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={onVoltar}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-extralight text-gray-900 tracking-wide lg:tracking-[0.3em] mb-1">
                  GESTÃO DE LEADS
                </h1>
                <div className="flex items-center space-x-3 lg:space-x-4 text-xs font-light text-gray-500 tracking-wide lg:tracking-[0.2em]">
                  <span>Pipeline de Vendas</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>{leadsFiltrados.length} leads ativos</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMostrarFiltros(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-light"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Filtros</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Novo Lead</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Busca Mobile-First */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar leads por nome, telefone ou email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
          />
        </div>
      </div>

      {/* Lista de Leads Mobile-First */}
      <div className="px-4 sm:px-6 lg:px-8">
        {leadsFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
            <p className="text-gray-600">Ajuste os filtros ou busque por outros termos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leadsFiltrados.map((lead) => (
              <div
                key={lead.id}
                className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{lead.nome}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          {getOrigemIcon(lead.origem)}
                          <span className="capitalize">{lead.origem}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{lead.ultima_interacao}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {lead.telefone}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setLeadSelecionado(lead);
                          setMostrarDetalhes(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interesse e Score */}
                  <div className="space-y-2">
                    {lead.interesse?.veiculo && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Car className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">{lead.interesse.veiculo}</span>
                        {lead.interesse.valor_max && (
                          <span className="text-green-600 font-medium">
                            até {formatValor(lead.interesse.valor_max)}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Score:</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              lead.score >= 80 ? 'bg-green-600' :
                              lead.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{lead.score}</span>
                      </div>
                      
                      {lead.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {lead.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{lead.nome}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getOrigemIcon(lead.origem)}
                          <span className="text-xs text-gray-500 capitalize">{lead.origem}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{lead.telefone}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center space-x-1">
                            <span>✉</span>
                            <span>{lead.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{lead.ultima_interacao}</span>
                        </div>
                      </div>

                      {/* Interesse */}
                      {lead.interesse && (
                        <div className="flex items-center space-x-4 text-sm mb-3">
                          {lead.interesse.veiculo && (
                            <div className="flex items-center space-x-1">
                              <Car className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">{lead.interesse.veiculo}</span>
                            </div>
                          )}
                          {lead.interesse.categoria && (
                            <span className="text-gray-600">{lead.interesse.categoria}</span>
                          )}
                          {lead.interesse.valor_max && (
                            <span className="text-green-600 font-medium">
                              até {formatValor(lead.interesse.valor_max)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Score e Tags */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Score:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  lead.score >= 80 ? 'bg-green-600' :
                                  lead.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{lead.score}</span>
                          </div>
                        </div>
                        
                        {lead.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {lead.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações Desktop */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setLeadSelecionado(lead);
                          setMostrarDetalhes(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button Mobile */}
      <div className="sm:hidden fixed bottom-20 right-4 z-40">
        <button className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modal de Filtros Mobile-First */}
      {mostrarFiltros && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filtros e Estatísticas</h2>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">Total</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">{stats.total}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Qualificados</span>
                    </div>
                    <p className="text-lg font-bold text-green-900">{stats.qualificados}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">Propostas</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-900">{stats.propostas}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">Score Médio</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900">{Math.round(stats.score_medio)}</p>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
                
                {/* Status */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Status</label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="novo">Novos</option>
                    <option value="qualificado">Qualificados</option>
                    <option value="proposta">Propostas</option>
                    <option value="negociacao">Negociação</option>
                    <option value="agendado">Agendados</option>
                    <option value="convertido">Convertidos</option>
                    <option value="perdido">Perdidos</option>
                  </select>
                </div>

                {/* Origem */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Origem</label>
                  <select
                    value={filtroOrigem}
                    onChange={(e) => setFiltroOrigem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="todos">Todas</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="site">Site</option>
                    <option value="telefone">Telefone</option>
                    <option value="indicacao">Indicação</option>
                    <option value="walk-in">Walk-in</option>
                  </select>
                </div>
              </div>

              {/* Pipeline Visual */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Pipeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Novos</span>
                    <span className="font-medium">{stats.novos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(stats.novos / stats.total) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-3">
                    <span className="text-gray-600">Qualificados</span>
                    <span className="font-medium">{stats.qualificados}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(stats.qualificados / stats.total) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-3">
                    <span className="text-gray-600">Convertidos</span>
                    <span className="font-medium">{stats.convertidos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${(stats.convertidos / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Lead Mobile-First */}
      {mostrarDetalhes && leadSelecionado && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:mx-4 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Lead</h2>
                <button
                  onClick={() => setMostrarDetalhes(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Nome</label>
                      <p className="font-medium">{leadSelecionado.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Telefone</label>
                      <p className="font-medium">{leadSelecionado.telefone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{leadSelecionado.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Origem</label>
                      <p className="font-medium capitalize">{leadSelecionado.origem}</p>
                    </div>
                  </div>
                </div>

                {/* Interesse */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Interesse</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Veículo</label>
                      <p className="font-medium">{leadSelecionado.interesse?.veiculo || 'Não especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Categoria</label>
                      <p className="font-medium">{leadSelecionado.interesse?.categoria || 'Não especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Valor Máximo</label>
                      <p className="font-medium">
                        {leadSelecionado.interesse?.valor_max 
                          ? formatValor(leadSelecionado.interesse.valor_max)
                          : 'Não informado'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Score</label>
                      <p className="font-medium">{leadSelecionado.score}/100</p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {leadSelecionado.observacoes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Observações</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {leadSelecionado.observacoes}
                    </p>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Editar
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Iniciar Conversa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Menu Modular */}
      <FloatingModularMenu
        currentModule="whatsleads"
        onModuleChange={onModuleChange}
        onLogout={onLogout}
      />
    </div>
  );
}