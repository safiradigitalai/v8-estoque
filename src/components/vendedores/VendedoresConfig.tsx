'use client';

import { useState } from 'react';
import { 
  ArrowLeft,
  Save,
  Settings,
  Award,
  Target,
  TrendingUp,
  Star,
  Trophy,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  Check
} from 'lucide-react';

interface VendedoresConfigProps {
  onVoltar: () => void;
}

interface ConfiguracoesPontuacao {
  pontos_por_venda: number;
  pontos_por_lead_convertido: number;
  pontos_por_meta_atingida: number;
  multiplicador_nivel_expert: number;
  multiplicador_nivel_avancado: number;
  multiplicador_nivel_intermediario: number;
  bonus_primeiro_lugar: number;
  bonus_segundo_lugar: number;
  bonus_terceiro_lugar: number;
  penalidade_sem_venda: number;
  dias_reset_ranking: number;
  valor_minimo_venda_pontos: number;
}

interface ConfiguracoesGerais {
  meta_equipe_mensal: number;
  comissao_padrao: number;
  reserva_veiculo_dias: number;
  negociacao_veiculo_dias: number;
  auto_atribuir_leads: boolean;
  notificar_metas: boolean;
  notificar_rankings: boolean;
}

const niveisMultiplicadores = [
  { nivel: 'expert', label: 'Expert', cor: 'text-purple-600', multiplicador_atual: 2.0 },
  { nivel: 'avancado', label: 'Avançado', cor: 'text-blue-600', multiplicador_atual: 1.5 },
  { nivel: 'intermediario', label: 'Intermediário', cor: 'text-green-600', multiplicador_atual: 1.2 },
  { nivel: 'iniciante', label: 'Iniciante', cor: 'text-gray-600', multiplicador_atual: 1.0 }
];

export function VendedoresConfig({ onVoltar }: VendedoresConfigProps) {
  const [activeTab, setActiveTab] = useState<'pontuacao' | 'gerais' | 'micromode'>('pontuacao');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados das configurações
  const [configPontuacao, setConfigPontuacao] = useState<ConfiguracoesPontuacao>({
    pontos_por_venda: 100,
    pontos_por_lead_convertido: 25,
    pontos_por_meta_atingida: 500,
    multiplicador_nivel_expert: 2.0,
    multiplicador_nivel_avancado: 1.5,
    multiplicador_nivel_intermediario: 1.2,
    bonus_primeiro_lugar: 1000,
    bonus_segundo_lugar: 500,
    bonus_terceiro_lugar: 250,
    penalidade_sem_venda: -50,
    dias_reset_ranking: 30,
    valor_minimo_venda_pontos: 10000
  });

  const [configGerais, setConfigGerais] = useState<ConfiguracoesGerais>({
    meta_equipe_mensal: 300000,
    comissao_padrao: 3.0,
    reserva_veiculo_dias: 3,
    negociacao_veiculo_dias: 7,
    auto_atribuir_leads: true,
    notificar_metas: true,
    notificar_rankings: true
  });

  const salvarConfiguracoes = async () => {
    setIsSubmitting(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onVoltar}
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-light text-gray-900">Configurações</h1>
            <p className="text-gray-600 text-sm">
              Configure pontuação, regras e automações do sistema
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Configurações salvas!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pontuacao')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'pontuacao'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Sistema de Pontuação</span>
          </button>
          
          <button
            onClick={() => setActiveTab('gerais')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'gerais'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações Gerais</span>
          </button>

          <button
            onClick={() => setActiveTab('micromode')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'micromode'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>MicroMode</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab: Sistema de Pontuação */}
          {activeTab === 'pontuacao' && (
            <div className="space-y-8">
              
              {/* Pontos Base */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Pontos Base</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontos por Venda
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.pontos_por_venda}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        pontos_por_venda: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pontos ganhos por cada venda realizada</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontos por Lead Convertido
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.pontos_por_lead_convertido}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        pontos_por_lead_convertido: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pontos por lead que vira venda</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bônus Meta Atingida
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.pontos_por_meta_atingida}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        pontos_por_meta_atingida: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Bônus ao atingir a meta mensal</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Mínimo para Pontos (R$)
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.valor_minimo_venda_pontos}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        valor_minimo_venda_pontos: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Venda mínima para ganhar pontos</p>
                  </div>
                </div>
              </div>

              {/* Multiplicadores por Nível */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Multiplicadores por Nível</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {niveisMultiplicadores.map((nivel) => (
                    <div key={nivel.nivel}>
                      <label className={`block text-sm font-medium mb-2 ${nivel.cor}`}>
                        Multiplicador - {nivel.label}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={nivel.multiplicador_atual}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setConfigPontuacao(prev => ({
                            ...prev,
                            [`multiplicador_nivel_${nivel.nivel}`]: value
                          }));
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Multiplica todos os pontos ganhos por {nivel.multiplicador_atual}x
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bônus de Ranking */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Bônus de Ranking Mensal</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-700 mb-2">
                      🥇 Primeiro Lugar
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.bonus_primeiro_lugar}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        bonus_primeiro_lugar: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🥈 Segundo Lugar
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.bonus_segundo_lugar}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        bonus_segundo_lugar: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      🥉 Terceiro Lugar
                    </label>
                    <input
                      type="number"
                      value={configPontuacao.bonus_terceiro_lugar}
                      onChange={(e) => setConfigPontuacao(prev => ({
                        ...prev,
                        bonus_terceiro_lugar: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Configurações Gerais */}
          {activeTab === 'gerais' && (
            <div className="space-y-8">
              
              {/* Metas e Comissões */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Metas e Comissões</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta da Equipe (R$/mês)
                    </label>
                    <input
                      type="number"
                      value={configGerais.meta_equipe_mensal}
                      onChange={(e) => setConfigGerais(prev => ({
                        ...prev,
                        meta_equipe_mensal: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Meta coletiva da equipe de vendas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comissão Padrão (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={configGerais.comissao_padrao}
                      onChange={(e) => setConfigGerais(prev => ({
                        ...prev,
                        comissao_padrao: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comissão padrão para novos vendedores</p>
                  </div>
                </div>
              </div>

              {/* Regras do MicroMode */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Regras do MicroMode</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reserva de Veículo (dias)
                    </label>
                    <input
                      type="number"
                      value={configGerais.reserva_veiculo_dias}
                      onChange={(e) => setConfigGerais(prev => ({
                        ...prev,
                        reserva_veiculo_dias: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-gray-500 mt-1">Duração da reserva de veículo</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Negociação (dias)
                    </label>
                    <input
                      type="number"
                      value={configGerais.negociacao_veiculo_dias}
                      onChange={(e) => setConfigGerais(prev => ({
                        ...prev,
                        negociacao_veiculo_dias: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      min="1"
                      max="60"
                    />
                    <p className="text-xs text-gray-500 mt-1">Duração máxima da negociação</p>
                  </div>
                </div>
              </div>

              {/* Automações */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span>Automações</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Atribuição Automática de Leads</h4>
                      <p className="text-xs text-gray-500">Distribui leads baseado no ranking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configGerais.auto_atribuir_leads}
                        onChange={(e) => setConfigGerais(prev => ({
                          ...prev,
                          auto_atribuir_leads: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notificar Metas</h4>
                      <p className="text-xs text-gray-500">Alerta quando vendor atinge meta</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configGerais.notificar_metas}
                        onChange={(e) => setConfigGerais(prev => ({
                          ...prev,
                          notificar_metas: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notificar Rankings</h4>
                      <p className="text-xs text-gray-500">Alerta mudanças no ranking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configGerais.notificar_rankings}
                        onChange={(e) => setConfigGerais(prev => ({
                          ...prev,
                          notificar_rankings: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: MicroMode Preview */}
          {activeTab === 'micromode' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">MicroMode - Visão Geral</h3>
                </div>
                
                <p className="text-gray-700 mb-6">
                  O MicroMode é onde os vendedores interagem com o sistema gamificado,
                  podendo reservar veículos, gerenciar negociações e competir no ranking.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Visualizar cards de veículos por marca</li>
                      <li>• Reservar veículos por {configGerais.reserva_veiculo_dias} dias</li>
                      <li>• Marcar status "Negociando"</li>
                      <li>• Finalizar vendas e ganhar pontos</li>
                      <li>• Ver ranking em tempo real</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Acesso dos Vendedores</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Login com credenciais próprias</li>
                      <li>• Interface otimizada mobile-first</li>
                      <li>• Notificações de metas e rankings</li>
                      <li>• Link de satisfação do cliente</li>
                      <li>• Histórico de performance</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Próxima Etapa</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        O MicroMode será implementado em uma fase posterior, 
                        com interface dedicada aos vendedores e integração completa 
                        com o sistema de pontuação configurado aqui.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between">
        <button
          onClick={onVoltar}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          onClick={salvarConfiguracoes}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}