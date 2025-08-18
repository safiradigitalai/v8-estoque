'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Archive, 
  Star,
  Paperclip,
  Smile,
  ArrowLeft,
  Clock,
  CheckCheck,
  Check,
  Users,
  Filter,
  MessageCircle
} from 'lucide-react';
import { FloatingModularMenu } from '../navigation/FloatingModularMenu';

// Types para conversas
interface Conversa {
  id: string;
  nome: string;
  numero: string;
  avatar?: string;
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  status: 'online' | 'offline' | 'digitando';
  tipo: 'lead' | 'cliente' | 'outros';
}

interface Mensagem {
  id: string;
  conteudo: string;
  tipo: 'enviada' | 'recebida';
  horario: string;
  status: 'enviando' | 'enviada' | 'entregue' | 'lida';
  anexo?: {
    tipo: 'imagem' | 'documento' | 'audio';
    url: string;
    nome?: string;
  };
}

// Mock data para demonstração
const conversasMock: Conversa[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    numero: '+55 11 99999-9999',
    ultimaMensagem: 'Oi, tenho interesse no Golf GTI...',
    horario: '10:30',
    naoLidas: 2,
    status: 'online',
    tipo: 'lead'
  },
  {
    id: '2',
    nome: 'Ana Santos',
    numero: '+55 11 88888-8888',
    ultimaMensagem: 'Quando posso agendar uma visita?',
    horario: '09:15',
    naoLidas: 0,
    status: 'offline',
    tipo: 'cliente'
  },
  {
    id: '3',
    nome: 'Roberto Lima',
    numero: '+55 11 77777-7777',
    ultimaMensagem: 'Vocês têm financiamento?',
    horario: 'Ontem',
    naoLidas: 1,
    status: 'digitando',
    tipo: 'lead'
  }
];

const mensagensMock: Record<string, Mensagem[]> = {
  '1': [
    {
      id: '1',
      conteudo: 'Olá! Vi o anúncio do Golf GTI no site. Ainda está disponível?',
      tipo: 'recebida',
      horario: '10:28',
      status: 'lida'
    },
    {
      id: '2',
      conteudo: 'Olá Carlos! Sim, o Golf GTI 2023 ainda está disponível. Gostaria de mais informações?',
      tipo: 'enviada',
      horario: '10:29',
      status: 'lida'
    },
    {
      id: '3',
      conteudo: 'Oi, tenho interesse no Golf GTI...',
      tipo: 'recebida',
      horario: '10:30',
      status: 'entregue'
    }
  ]
};

interface WhatsLeadsConversasProps {
  onVoltar: () => void;
  onModuleChange?: (module: 'overview' | 'estoque' | 'whatsleads' | 'vendedores') => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}

export function WhatsLeadsConversas({ 
  onVoltar, 
  onModuleChange, 
  onLogout, 
  onRefresh 
}: WhatsLeadsConversasProps) {
  const [conversas, setConversas] = useState<Conversa[]>(conversasMock);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [busca, setBusca] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Carregar mensagens da conversa ativa
  useEffect(() => {
    if (conversaAtiva) {
      setMensagens(mensagensMock[conversaAtiva] || []);
    }
  }, [conversaAtiva]);

  // Filtrar conversas
  const conversasFiltradas = conversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(busca.toLowerCase()) ||
    conversa.numero.includes(busca)
  );

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const novaMsg: Mensagem = {
      id: Date.now().toString(),
      conteudo: novaMensagem,
      tipo: 'enviada',
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'enviando'
    };

    setMensagens(prev => [...prev, novaMsg]);
    setNovaMensagem('');

    // Simular envio
    setTimeout(() => {
      setMensagens(prev =>
        prev.map(msg =>
          msg.id === novaMsg.id ? { ...msg, status: 'entregue' } : msg
        )
      );
    }, 1000);
  };

  const conversa = conversas.find(c => c.id === conversaAtiva);

  // Renderizar status da mensagem
  const renderStatusMensagem = (status: Mensagem['status']) => {
    switch (status) {
      case 'enviando':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'enviada':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'entregue':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'lida':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // Vista mobile: mostrar apenas lista ou chat
  if (isMobile) {
    if (conversaAtiva) {
      return (
        <div className="h-screen bg-white flex flex-col">
          {/* Header do Chat Mobile */}
          <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
            <button
              onClick={() => setConversaAtiva(null)}
              className="p-1 hover:bg-green-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {conversa?.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{conversa?.nome}</h3>
              <p className="text-xs text-green-100">
                {conversa?.status === 'online' ? 'Online' : 
                 conversa?.status === 'digitando' ? 'Digitando...' : 'Offline'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-green-700 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-green-700 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${mensagem.tipo === 'enviada' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    mensagem.tipo === 'enviada'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{mensagem.conteudo}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <span className="text-xs opacity-70">{mensagem.horario}</span>
                    {mensagem.tipo === 'enviada' && renderStatusMensagem(mensagem.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem Mobile */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                  placeholder="Digite uma mensagem..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleEnviarMensagem}
                disabled={!novaMensagem.trim()}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Lista de conversas mobile
    return (
      <div className="h-screen bg-white">
        {/* Header Mobile */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onVoltar}
                className="p-1 hover:bg-green-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">Conversas</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-green-700 rounded-full">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-green-700 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Busca Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 bg-green-700 text-white placeholder-green-300 rounded-lg focus:outline-none focus:bg-green-600"
            />
          </div>
        </div>

        {/* Lista de Conversas Mobile */}
        <div className="flex-1 overflow-y-auto">
          {conversasFiltradas.map((conversa) => (
            <button
              key={conversa.id}
              onClick={() => setConversaAtiva(conversa.id)}
              className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold">
                      {conversa.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  {conversa.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversa.nome}</h3>
                    <span className="text-xs text-gray-500">{conversa.horario}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversa.status === 'digitando' ? (
                        <span className="text-green-600 italic">Digitando...</span>
                      ) : (
                        conversa.ultimaMensagem
                      )}
                    </p>
                    {conversa.naoLidas > 0 && (
                      <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversa.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Vista Desktop
  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar de Conversas */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onVoltar}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {conversasFiltradas.map((conversa) => (
            <button
              key={conversa.id}
              onClick={() => setConversaAtiva(conversa.id)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${
                conversaAtiva === conversa.id ? 'bg-green-50 border-r-2 border-r-green-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    conversa.tipo === 'lead' ? 'bg-blue-100' : 
                    conversa.tipo === 'cliente' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className={`font-bold ${
                      conversa.tipo === 'lead' ? 'text-blue-700' : 
                      conversa.tipo === 'cliente' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {conversa.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  {conversa.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversa.nome}</h3>
                    <span className="text-xs text-gray-500">{conversa.horario}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversa.status === 'digitando' ? (
                        <span className="text-green-600 italic">Digitando...</span>
                      ) : (
                        conversa.ultimaMensagem
                      )}
                    </p>
                    {conversa.naoLidas > 0 && (
                      <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversa.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {conversaAtiva ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold">
                      {conversa?.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{conversa?.nome}</h3>
                    <p className="text-sm text-gray-600">{conversa?.numero}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${mensagem.tipo === 'enviada' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      mensagem.tipo === 'enviada'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{mensagem.conteudo}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className={`text-xs ${
                        mensagem.tipo === 'enviada' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {mensagem.horario}
                      </span>
                      {mensagem.tipo === 'enviada' && renderStatusMensagem(mensagem.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                    placeholder="Digite uma mensagem..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleEnviarMensagem}
                  disabled={!novaMensagem.trim()}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Estado vazio
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Selecione uma conversa</h3>
              <p className="text-gray-600">Escolha uma conversa da lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>

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