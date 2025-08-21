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
  Smartphone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface WhatsLeadsConfigProps {
  onVoltar: () => void;
}

export function WhatsLeadsConfig({ onVoltar }: WhatsLeadsConfigProps) {
  const [activeTab, setActiveTab] = useState<'api' | 'notificacoes' | 'automacao' | 'equipe'>('api');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('whatsapp-api');

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

  const tabs = [
    { id: 'api', label: 'API', icon: Database, color: 'text-blue-600' },
    { id: 'notificacoes', label: 'Notificações', icon: Bell, color: 'text-purple-600' },
    { id: 'automacao', label: 'Automação', icon: Settings, color: 'text-amber-600' },
    { id: 'equipe', label: 'Equipe', icon: Users, color: 'text-green-600' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'api':
        return (
          <div className="space-y-6">
            {/* WhatsApp Business API */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => toggleSection('whatsapp-api')}
                className="w-full px-4 sm:px-6 py-5 flex items-center justify-between bg-blue-50/30 hover:bg-blue-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Database className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-800 transition-colors duration-300">WhatsApp Business API</h3>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Configurações de conexão com a API</p>
                  </div>
                </div>
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {expandedSection === 'whatsapp-api' ? 
                    <ChevronUp className="w-5 h-5 text-blue-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  }
                </div>
              </button>
              
              {expandedSection === 'whatsapp-api' && (
                <div className="px-4 sm:px-6 pb-6 space-y-6 animate-slideDown">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                        Token de Acesso
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={apiConfig.whatsappToken}
                          onChange={(e) => setApiConfig({...apiConfig, whatsappToken: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-300 hover:border-gray-300"
                          placeholder="EAAxxxxxxxxxxxxxxxx"
                        />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 pl-1">
                        Token permanente da API do WhatsApp Business
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                          Phone Number ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={apiConfig.phoneNumberId}
                            onChange={(e) => setApiConfig({...apiConfig, phoneNumberId: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-300 hover:border-gray-300"
                            placeholder="1234567890123456"
                          />
                          <div className="absolute inset-0 rounded-lg bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                          Business Account ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={apiConfig.businessAccountId}
                            onChange={(e) => setApiConfig({...apiConfig, businessAccountId: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-300 hover:border-gray-300"
                            placeholder="9876543210987654"
                          />
                          <div className="absolute inset-0 rounded-lg bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Webhook Configuration */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => toggleSection('webhook')}
                className="w-full px-4 sm:px-6 py-5 flex items-center justify-between bg-purple-50/30 hover:bg-purple-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Settings className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-800 transition-colors duration-300">Webhook Configuration</h3>
                    <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">URL e tokens de verificação</p>
                  </div>
                </div>
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {expandedSection === 'webhook' ? 
                    <ChevronUp className="w-5 h-5 text-purple-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                  }
                </div>
              </button>
              
              {expandedSection === 'webhook' && (
                <div className="px-4 sm:px-6 pb-6 space-y-6 animate-slideDown">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-purple-700 transition-colors duration-200">
                        Webhook URL
                      </label>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={apiConfig.webhookUrl}
                            onChange={(e) => setApiConfig({...apiConfig, webhookUrl: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all duration-300 hover:border-gray-300"
                            placeholder="https://seu-dominio.com/api/webhook/whatsapp"
                          />
                          <div className="absolute inset-0 rounded-lg bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:scale-95 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                          Testar
                        </button>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-purple-700 transition-colors duration-200">
                        Verify Token
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={apiConfig.webhookVerifyToken}
                          onChange={(e) => setApiConfig({...apiConfig, webhookVerifyToken: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all duration-300 hover:border-gray-300"
                          placeholder="seu_token_verificacao_seguro"
                        />
                        <div className="absolute inset-0 rounded-lg bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 pl-1">
                        Token usado para verificar a autenticidade do webhook
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-3 text-amber-900">Importante:</p>
                          <ul className="space-y-2 text-xs leading-relaxed">
                            <li className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>Certifique-se de que o webhook está configurado no painel do Meta</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>O SSL/HTTPS é obrigatório para webhooks</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>Teste a conexão antes de salvar</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-6">
            {/* Alertas de Sistema */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Novas Mensagens</h4>
                      <p className="text-sm text-gray-600">Receber alerta quando uma nova mensagem chegar</p>
                    </div>
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

              <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Novos Leads</h4>
                      <p className="text-sm text-gray-600">Notificar quando um novo lead for capturado</p>
                    </div>
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

              <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Leads sem Resposta</h4>
                      <p className="text-sm text-gray-600">Alertar sobre leads aguardando resposta</p>
                    </div>
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
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo máximo de resposta (minutos)
                    </label>
                    <input
                      type="number"
                      value={notificationConfig.tempoMaximoResposta}
                      onChange={(e) => setNotificationConfig({...notificationConfig, tempoMaximoResposta: parseInt(e.target.value)})}
                      className="w-full sm:w-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                      min="5"
                      max="120"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Canais de Notificação */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Canais de Notificação</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationConfig.alertaEmail}
                    onChange={(e) => setNotificationConfig({...notificationConfig, alertaEmail: e.target.checked})}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">✉️</span>
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationConfig.alertaWhatsApp}
                    onChange={(e) => setNotificationConfig({...notificationConfig, alertaWhatsApp: e.target.checked})}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'automacao':
        return (
          <div className="space-y-6">
            {/* Mensagem de Boas-vindas */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mensagem de Boas-vindas</h4>
                    <p className="text-sm text-gray-600">Primeira mensagem automática para novos contatos</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                rows={4}
                placeholder="Olá! Bem-vindo à nossa concessionária..."
                defaultValue="Olá! Bem-vindo à nossa concessionária V8. Como posso ajudá-lo hoje?"
              />
              <div className="mt-3 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Adicionar variáveis
                </button>
                <div className="text-xs text-gray-500">
                  Variáveis: {'{nome}'}, {'{empresa}'}, {'{horario}'}
                </div>
              </div>
            </div>

            {/* Resposta Fora do Horário */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Resposta Fora do Horário</h4>
                    <p className="text-sm text-gray-600">Mensagem automática fora do expediente</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                rows={4}
                placeholder="Obrigado pelo contato! Nosso horário de atendimento é..."
                defaultValue="Obrigado pelo contato! Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos em breve!"
              />
              <div className="mt-3">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Configurar horários
                </button>
              </div>
            </div>

            {/* Follow-up Automático */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Follow-up Automático</h4>
                    <p className="text-sm text-gray-600">Reativar conversas paradas</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enviar após (horas)
                  </label>
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                    defaultValue="24"
                  />
                </div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                  rows={4}
                  placeholder="Olá! Vi que você demonstrou interesse em..."
                  defaultValue="Olá! Vi que você demonstrou interesse em nossos veículos. Posso ajudá-lo com mais informações?"
                />
              </div>
            </div>
          </div>
        );

      case 'equipe':
        return (
          <div className="space-y-6">
            {/* Distribuição de Leads */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Leads</h3>
              <div className="space-y-3">
                {[
                  { id: 'round-robin', label: 'Round Robin (distribuição igual)', desc: 'Distribui leads igualmente entre vendedores' },
                  { id: 'disponibilidade', label: 'Por disponibilidade', desc: 'Considera status online/offline' },
                  { id: 'performance', label: 'Por performance', desc: 'Prioriza vendedores com melhor performance' },
                  { id: 'manual', label: 'Manual', desc: 'Atribuição manual pelo gestor' }
                ].map((option, index) => (
                  <label key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="distribuicao"
                      className="w-5 h-5 text-green-600 border-gray-300 mt-1"
                      defaultChecked={index === 0}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Vendedores Ativos */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vendedores Ativos</h3>
              <div className="space-y-3">
                {['João Silva', 'Maria Santos', 'Pedro Oliveira'].map((vendedor) => (
                  <div key={vendedor} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-700">
                          {vendedor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{vendedor}</div>
                        <div className="text-sm text-gray-600">Online</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Adicionar Vendedor
              </button>
            </div>

            {/* Limites de Atendimento */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Limites de Atendimento</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de conversas simultâneas por vendedor
                  </label>
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                    defaultValue="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de leads ativos por vendedor
                  </label>
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                    defaultValue="30"
                  />
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
                Configurações
              </h1>
              <div className="text-xs text-gray-500 font-light">
                WhatsLeads - Configurações do módulo
              </div>
            </div>

            {/* Save Button Mobile */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-xs font-medium active:scale-95"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  <span>Salvando</span>
                </>
              ) : saved ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  <span>Salvar</span>
                </>
              )}
            </button>
          </div>
          
          {/* Editorial Tab Navigation */}
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-px bg-gray-300"></div>
              <div className="text-xs font-light text-gray-500 tracking-[0.15em] uppercase">Configurações</div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  </button>
                );
              })}
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
                  CONFIGURAÇÕES
                </h1>
                <div className="flex items-center space-x-3 lg:space-x-4 text-xs font-light text-gray-500 tracking-wide lg:tracking-[0.2em]">
                  <span>WhatsLeads</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>Módulo de Gestão</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">API Conectada</span>
                </div>
              </div>

              {saved && (
                <div className="flex items-center space-x-2 text-green-600 animate-pulse">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Salvo!</span>
                </div>
              )}
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                      isActive
                        ? 'text-green-600 border-green-600'
                        : 'text-gray-500 hover:text-green-600 border-transparent hover:border-green-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        {renderTabContent()}
      </div>

    </div>
  );
}