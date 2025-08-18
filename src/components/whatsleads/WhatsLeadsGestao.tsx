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
  Car
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
        return 'bg-blue-100 text-blue-800';
      case 'qualificado':
        return 'bg-green-100 text-green-800';
      case 'proposta':
        return 'bg-yellow-100 text-yellow-800';
      case 'negociacao':
        return 'bg-orange-100 text-orange-800';
      case 'agendado':
        return 'bg-purple-100 text-purple-800';
      case 'convertido':
        return 'bg-emerald-100 text-emerald-800';
      case 'perdido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onVoltar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Gestão de Leads</h1>
              <p className="text-gray-600">Pipeline de vendas e conversões</p>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar com Estatísticas */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-6">
          {/* Estatísticas Rápidas */}
          <div>
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
          <div>
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

        {/* Área Principal */}
        <div className="flex-1 flex flex-col">
          {/* Busca e Filtros */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar leads por nome, telefone ou email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Filtros</span>
              </button>
            </div>
          </div>

          {/* Lista de Leads */}
          <div className="flex-1 overflow-y-auto p-4">
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
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{lead.nome}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
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

                      {/* Ações */}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Lead */}
      {mostrarDetalhes && leadSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Lead</h2>
                <button
                  onClick={() => setMostrarDetalhes(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-4">
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
                <div className="flex justify-end space-x-3 pt-4 border-t">
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
        onRefresh={onRefresh}
        onLogout={onLogout}
        setShowMobileSearch={() => {}}
      />
    </div>
  );
}