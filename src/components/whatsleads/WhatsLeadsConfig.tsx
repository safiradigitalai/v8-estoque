'use client';

import { useState } from 'react';
import { 
  ArrowLeft,
  Settings,
  MessageCircle,
  Bell,
  Users,
  Zap,
  Shield,
  Database,
  Save,
  AlertCircle,
  Check,
  X,
  Key,
  Globe,
  Smartphone
} from 'lucide-react';

interface WhatsLeadsConfigProps {
  onVoltar: () => void;
}

export function WhatsLeadsConfig({ onVoltar }: WhatsLeadsConfigProps) {
  const [activeTab, setActiveTab] = useState<'api' | 'notificacoes' | 'automacao' | 'equipe'>('api');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estados para configurações
  const [apiConfig, setApiConfig] = useState({
    whatsappToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    webhookUrl: '',
    webhookVerifyToken: ''
  });

  const [notificationConfig, setNotificationConfig] = useState({
    novasMensagens: true,
    novosLeads: true,
    leadsSemResposta: true,
    tempoMaximoResposta: 30,
    alertaEmail: true,
    alertaWhatsApp: false
  });

  const handleSave = async () => {
    setSaving(true);
    // Simular salvamento
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">WhatsApp Business API</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token de Acesso
                  </label>
                  <input
                    type="password"
                    value={apiConfig.whatsappToken}
                    onChange={(e) => setApiConfig({...apiConfig, whatsappToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="EAAxxxxxxxxxxxxxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Token permanente da API do WhatsApp Business
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={apiConfig.phoneNumberId}
                    onChange={(e) => setApiConfig({...apiConfig, phoneNumberId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="1234567890123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Account ID
                  </label>
                  <input
                    type="text"
                    value={apiConfig.businessAccountId}
                    onChange={(e) => setApiConfig({...apiConfig, businessAccountId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="9876543210987654"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Webhook Configuration</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Webhook URL
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={apiConfig.webhookUrl}
                          onChange={(e) => setApiConfig({...apiConfig, webhookUrl: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                          placeholder="https://seu-dominio.com/api/webhook/whatsapp"
                        />
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Testar
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verify Token
                      </label>
                      <input
                        type="text"
                        value={apiConfig.webhookVerifyToken}
                        onChange={(e) => setApiConfig({...apiConfig, webhookVerifyToken: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="seu_token_verificacao_seguro"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Token usado para verificar a autenticidade do webhook
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Certifique-se de que o webhook está configurado no painel do Meta</li>
                        <li>O SSL/HTTPS é obrigatório para webhooks</li>
                        <li>Teste a conexão antes de salvar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Notificações</h3>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Novas Mensagens</h4>
                      <p className="text-sm text-gray-600">Receber alerta quando uma nova mensagem chegar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationConfig.novasMensagens}
                        onChange={(e) => setNotificationConfig({...notificationConfig, novasMensagens: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Novos Leads</h4>
                      <p className="text-sm text-gray-600">Notificar quando um novo lead for capturado</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationConfig.novosLeads}
                        onChange={(e) => setNotificationConfig({...notificationConfig, novosLeads: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Leads sem Resposta</h4>
                      <p className="text-sm text-gray-600">Alertar sobre leads aguardando resposta</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationConfig.leadsSemResposta}
                        onChange={(e) => setNotificationConfig({...notificationConfig, leadsSemResposta: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {notificationConfig.leadsSemResposta && (
                    <div className="mt-4 pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempo máximo de resposta (minutos)
                      </label>
                      <input
                        type="number"
                        value={notificationConfig.tempoMaximoResposta}
                        onChange={(e) => setNotificationConfig({...notificationConfig, tempoMaximoResposta: parseInt(e.target.value)})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        min="5"
                        max="120"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Canais de Notificação</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notificationConfig.alertaEmail}
                        onChange={(e) => setNotificationConfig({...notificationConfig, alertaEmail: e.target.checked})}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notificationConfig.alertaWhatsApp}
                        onChange={(e) => setNotificationConfig({...notificationConfig, alertaWhatsApp: e.target.checked})}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automacao':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Automação de Mensagens</h3>
              
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Mensagem de Boas-vindas</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    rows={4}
                    placeholder="Olá! Bem-vindo à nossa concessionária..."
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Ativo</span>
                    </label>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Adicionar variáveis
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Resposta Fora do Horário</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    rows={4}
                    placeholder="Obrigado pelo contato! Nosso horário de atendimento é..."
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Ativo</span>
                    </label>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Configurar horários
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Follow-up Automático</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enviar após (horas)
                      </label>
                      <input
                        type="number"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        defaultValue="24"
                      />
                    </div>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      rows={4}
                      placeholder="Olá! Vi que você demonstrou interesse em..."
                    />
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Ativo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'equipe':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gestão da Equipe</h3>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Distribuição de Leads</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="distribuicao"
                        className="w-4 h-4 text-green-600 border-gray-300"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">Round Robin (distribuição igual)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="distribuicao"
                        className="w-4 h-4 text-green-600 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Por disponibilidade</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="distribuicao"
                        className="w-4 h-4 text-green-600 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Por performance</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="distribuicao"
                        className="w-4 h-4 text-green-600 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Manual</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Vendedores Ativos</h4>
                  <div className="space-y-2">
                    {['João Silva', 'Maria Santos', 'Pedro Oliveira'].map((vendedor) => (
                      <div key={vendedor} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-700">
                              {vendedor.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{vendedor}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Adicionar Vendedor
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Limites de Atendimento</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Máximo de conversas simultâneas por vendedor
                      </label>
                      <input
                        type="number"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        defaultValue="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Máximo de leads ativos por vendedor
                      </label>
                      <input
                        type="number"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        defaultValue="30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onVoltar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Configurações WhatsLeads</h1>
                <p className="text-sm text-gray-600">Gerencie as configurações do módulo</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {saved && (
              <div className="flex items-center space-x-2 text-green-600 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Salvo com sucesso!</span>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar com Tabs */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'api' 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Key className="w-5 h-5" />
              <span className="font-medium">API WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('notificacoes')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'notificacoes' 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notificações</span>
            </button>

            <button
              onClick={() => setActiveTab('automacao')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'automacao' 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="font-medium">Automação</span>
            </button>

            <button
              onClick={() => setActiveTab('equipe')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'equipe' 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Equipe</span>
            </button>
          </nav>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 mb-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Status da API</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Conectado</span>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}