'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Target,
  Percent,
  Award,
  Tag,
  Camera,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import type { DashboardVendedor } from '@/types/database';

interface VendedoresFormProps {
  vendedor?: DashboardVendedor; // Se undefined = modo adicionar
  onVoltar: () => void;
  onSalvar: () => void;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  foto_url: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
  meta_mensal: string;
  comissao_percentual: string;
  status: 'ativo' | 'inativo' | 'suspenso' | 'ferias';
  especialidades: string[];
}

const niveisOptions = [
  { value: 'iniciante', label: 'Iniciante', description: 'Vendedor em treinamento' },
  { value: 'intermediario', label: 'Intermediário', description: 'Vendedor com experiência' },
  { value: 'avancado', label: 'Avançado', description: 'Vendedor experiente' },
  { value: 'expert', label: 'Expert', description: 'Vendedor especialista' }
];

const statusOptions = [
  { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
  { value: 'ferias', label: 'Férias', color: 'bg-blue-100 text-blue-800' },
  { value: 'inativo', label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  { value: 'suspenso', label: 'Suspenso', color: 'bg-red-100 text-red-800' }
];

const especialidadesSuggestions = [
  'Premium', 'SUV', 'Sedan', 'Hatchback', 'Importados', 
  'Nacionais', 'Híbridos', 'Elétricos', 'Executivo', 
  'Esportivos', 'Familiares', 'Primeiro Carro'
];

export function VendedoresForm({ vendedor, onVoltar, onSalvar }: VendedoresFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    foto_url: '',
    nivel: 'iniciante',
    meta_mensal: '50000',
    comissao_percentual: '3.0',
    status: 'ativo',
    especialidades: []
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novaEspecialidade, setNovaEspecialidade] = useState('');

  const isEditMode = !!vendedor;

  // Preencher dados se em modo edição
  useEffect(() => {
    if (vendedor) {
      setFormData({
        nome: vendedor.nome,
        email: vendedor.email || '',
        telefone: vendedor.telefone || '',
        foto_url: vendedor.foto_url || '',
        nivel: vendedor.nivel,
        meta_mensal: vendedor.meta_mensal.toString(),
        comissao_percentual: vendedor.comissao_percentual.toString(),
        status: vendedor.status,
        especialidades: vendedor.especialidades || []
      });
    }
  }, [vendedor]);

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const metaValue = parseFloat(formData.meta_mensal);
    if (isNaN(metaValue) || metaValue <= 0) {
      newErrors.meta_mensal = 'Meta deve ser um valor positivo';
    }

    const comissaoValue = parseFloat(formData.comissao_percentual);
    if (isNaN(comissaoValue) || comissaoValue < 0 || comissaoValue > 100) {
      newErrors.comissao_percentual = 'Comissão deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        meta_mensal: parseFloat(formData.meta_mensal),
        comissao_percentual: parseFloat(formData.comissao_percentual),
        ...(isEditMode && { id: vendedor.id })
      };

      const url = '/api/vendedores';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar vendedor');
      }

      onSalvar();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      // TODO: Adicionar toast de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adicionar especialidade
  const adicionarEspecialidade = (especialidade: string) => {
    if (especialidade && !formData.especialidades.includes(especialidade)) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, especialidade]
      }));
      setNovaEspecialidade('');
    }
  };

  // Remover especialidade
  const removerEspecialidade = (index: number) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onVoltar}
          className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-2xl font-light text-gray-900">
            {isEditMode ? 'Editar Vendedor' : 'Adicionar Vendedor'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isEditMode 
              ? 'Atualize as informações do vendedor' 
              : 'Preencha os dados do novo vendedor'
            }
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Informações Básicas</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Nome */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                  errors.nome ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors.nome && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.nome}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="vendedor@empresa.com"
                />
              </div>
              {errors.email && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Foto URL */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Foto
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.foto_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, foto_url: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações Profissionais */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Configurações Profissionais</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Nível */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData(prev => ({ ...prev, nivel: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 cursor-pointer"
              >
                {niveisOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Meta Mensal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Mensal (R$) *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.meta_mensal}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_mensal: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.meta_mensal ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="50000"
                />
              </div>
              {errors.meta_mensal && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.meta_mensal}</span>
                </div>
              )}
            </div>

            {/* Comissão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comissão (%) *
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.comissao_percentual}
                  onChange={(e) => setFormData(prev => ({ ...prev, comissao_percentual: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.comissao_percentual ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="3.0"
                />
              </div>
              {errors.comissao_percentual && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.comissao_percentual}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
          </div>

          {/* Especialidades Atuais */}
          {formData.especialidades.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.especialidades.map((esp, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    <span>{esp}</span>
                    <button
                      type="button"
                      onClick={() => removerEspecialidade(index)}
                      className="w-4 h-4 flex items-center justify-center hover:bg-purple-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adicionar Nova Especialidade */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <input
                type="text"
                value={novaEspecialidade}
                onChange={(e) => setNovaEspecialidade(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarEspecialidade(novaEspecialidade);
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Digite uma especialidade"
              />
              <button
                type="button"
                onClick={() => adicionarEspecialidade(novaEspecialidade)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Adicionar
              </button>
            </div>

            {/* Sugestões */}
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Sugestões:</span>
              <div className="flex flex-wrap gap-2">
                {especialidadesSuggestions
                  .filter(sugestao => !formData.especialidades.includes(sugestao))
                  .map((sugestao) => (
                    <button
                      key={sugestao}
                      type="button"
                      onClick={() => adicionarEspecialidade(sugestao)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {sugestao}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onVoltar}
            className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium cursor-pointer hover:scale-105"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-300 font-medium cursor-pointer hover:scale-105 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Atualizar' : 'Salvar'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}