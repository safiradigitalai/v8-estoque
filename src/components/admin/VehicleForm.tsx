'use client';

import { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Car, Calendar, DollarSign, Gauge, Settings, MapPin } from 'lucide-react';

// Tipos para o formulário
interface VehicleFormData {
  id?: number;
  marca: string;
  modelo: string;
  ano: number | string;
  valor: number | string;
  categoria_id: number | string;
  km?: number | string;
  cor?: string;
  combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido';
  cambio?: 'manual' | 'automatico' | 'cvt';
  portas?: number | string;
  placa?: string;
  codigo_interno?: string;
  observacoes?: string;
  status?: 'disponivel' | 'reservado' | 'vendido';
}

interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

interface VehicleFormProps {
  vehicle?: VehicleFormData;
  onSave: (data: VehicleFormData) => Promise<{ success: boolean; errors?: ValidationError[]; warnings?: ValidationError[] }>;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

// Dados estáticos para os selects
const combustivelOptions = [
  { value: 'flex', label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' }
];

const cambioOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'cvt', label: 'CVT' }
];

const statusOptions = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' }
];

export function VehicleForm({ vehicle, onSave, onCancel, isLoading = false, title = 'Novo Veículo' }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: '',
    modelo: '',
    ano: '',
    valor: '',
    categoria_id: '',
    km: '',
    cor: '',
    combustivel: 'flex',
    cambio: 'manual',
    portas: '4',
    placa: '',
    codigo_interno: '',
    observacoes: '',
    status: 'disponivel',
    ...vehicle
  });

  const [valorDisplay, setValorDisplay] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  const [categorias, setCategorias] = useState<Array<{id: number; nome: string; icone?: string}>>([]);

  // Buscar categorias ao montar o componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Inicializar valor display quando carregar veículo
  useEffect(() => {
    if (vehicle?.valor) {
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(vehicle.valor));
      setValorDisplay(formatted);
    }
  }, [vehicle]);


  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      if (data.success && data.data) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erros do campo específico quando o usuário edita
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setValidationErrors([]);
    setWarnings([]);

    try {
      const result = await onSave(formData);
      
      if (result.success) {
        if (result.warnings && result.warnings.length > 0) {
          setWarnings(result.warnings);
        }
      } else if (result.errors) {
        setValidationErrors(result.errors);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setValidationErrors([{
        field: 'general',
        message: 'Erro interno. Tente novamente.'
      }]);
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field);
  };

  const hasFieldError = (field: string) => {
    return validationErrors.some(error => error.field === field);
  };

  const formatarMoedaBrasil = (valor: string) => {
    // Remove tudo que não é dígito
    let v = valor.replace(/\D/g, '');
    
    // Se não tem nada, retorna vazio
    if (v === '') return '';
    
    // Converte para número e divide por 100 para ter centavos
    let numero = parseInt(v) / 100;
    
    // Formata usando o padrão brasileiro
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const extrairValorNumerico = (valorFormatado: string) => {
    // Remove formatação e converte para número
    const numeroLimpo = valorFormatado.replace(/[^\d]/g, '');
    if (numeroLimpo === '') return 0;
    return parseInt(numeroLimpo) / 100;
  };

  const handleValorChange = (value: string) => {
    // Formata automaticamente enquanto digita
    const valorFormatado = formatarMoedaBrasil(value);
    setValorDisplay(valorFormatado);
    
    // Salva o valor numérico real
    const valorNumerico = extrairValorNumerico(valorFormatado);
    handleInputChange('valor', valorNumerico);
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-violet-50/20 rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden backdrop-blur-sm">
      {/* Header sofisticado */}
      <div className="relative p-6 border-b border-white/20 bg-gradient-to-r from-violet-500/10 via-cyan-400/10 to-emerald-400/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900 tracking-tight">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">Preencha os dados do veículo</p>
            </div>
          </div>
          
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 flex items-center justify-center group"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
        
        {/* Indicador de progresso sutil */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-20" />
      </div>

      {/* Alertas de erro e warning */}
      {validationErrors.length > 0 && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Erros de validação:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="m-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 mb-2">Avisos:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Seção: Dados Básicos */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Dados Básicos</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marca */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>Marca *</span>
              </label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('marca') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="Ex: TOYOTA, VOLKSWAGEN"
                disabled={isLoading}
              />
              {getFieldError('marca') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('marca')?.message}</span>
                </p>
              )}
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Modelo *</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('modelo') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="Ex: Corolla, Golf"
                disabled={isLoading}
              />
              {getFieldError('modelo') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('modelo')?.message}</span>
                </p>
              )}
            </div>

            {/* Ano */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Ano *</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.ano}
                onChange={(e) => {
                  // Permite apenas números e limita a 4 dígitos
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  handleInputChange('ano', value ? parseInt(value) : '');
                }}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('ano') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="2024"
                maxLength={4}
                disabled={isLoading}
              />
              {getFieldError('ano') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('ano')?.message}</span>
                </p>
              )}
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Valor *</span>
              </label>
              <input
                type="text"
                value={valorDisplay}
                onChange={(e) => handleValorChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('valor') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="R$ 0,00"
                disabled={isLoading}
              />
              {getFieldError('valor') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('valor')?.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Seção: Especificações Técnicas */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Especificações</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoria *</label>
              <select
                value={formData.categoria_id}
                onChange={(e) => handleInputChange('categoria_id', parseInt(e.target.value) || '')}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 ${
                  hasFieldError('categoria_id') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                disabled={isLoading}
              >
                <option value="">Selecionar categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.icone || ''} {categoria.nome}
                  </option>
                ))}
              </select>
              {getFieldError('categoria_id') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('categoria_id')?.message}</span>
                </p>
              )}
            </div>

            {/* Quilometragem */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Gauge className="w-4 h-4" />
                <span>Quilometragem</span>
              </label>
              <input
                type="number"
                value={formData.km}
                onChange={(e) => handleInputChange('km', parseInt(e.target.value) || '')}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('km') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="Ex: 50000"
                min="0"
                disabled={isLoading}
              />
              {getFieldError('km') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('km')?.message}</span>
                </p>
              )}
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cor</label>
              <input
                type="text"
                value={formData.cor}
                onChange={(e) => handleInputChange('cor', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400"
                placeholder="Ex: Branco, Preto"
                disabled={isLoading}
              />
            </div>

            {/* Combustível */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Combustível</label>
              <select
                value={formData.combustivel}
                onChange={(e) => handleInputChange('combustivel', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80"
                disabled={isLoading}
              >
                {combustivelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Câmbio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Câmbio</label>
              <select
                value={formData.cambio}
                onChange={(e) => handleInputChange('cambio', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80"
                disabled={isLoading}
              >
                {cambioOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Portas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Portas</label>
              <select
                value={formData.portas}
                onChange={(e) => handleInputChange('portas', parseInt(e.target.value) || '')}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80"
                disabled={isLoading}
              >
                <option value="2">2 portas</option>
                <option value="3">3 portas</option>
                <option value="4">4 portas</option>
                <option value="5">5 portas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Identificação */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Identificação</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placa */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Placa</label>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('placa') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="ABC1234"
                maxLength={7}
                disabled={isLoading}
              />
              {getFieldError('placa') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('placa')?.message}</span>
                </p>
              )}
            </div>

            {/* Código Interno */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Código Interno</label>
              <input
                type="text"
                value={formData.codigo_interno}
                onChange={(e) => handleInputChange('codigo_interno', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 ${
                  hasFieldError('codigo_interno') ? 'ring-2 ring-red-500 bg-red-50/60' : ''
                }`}
                placeholder="Ex: V001"
                disabled={isLoading}
              />
              {getFieldError('codigo_interno') && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{getFieldError('codigo_interno')?.message}</span>
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80"
                disabled={isLoading}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Observações</label>
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-0 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-violet-500 focus:bg-white/80 placeholder-gray-400 resize-none"
            placeholder="Informações adicionais sobre o veículo..."
            rows={3}
            maxLength={1000}
            disabled={isLoading}
          />
        </div>

        {/* Botões de ação */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-700 hover:text-gray-900 font-medium"
            disabled={isLoading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-500 to-cyan-400 hover:from-violet-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Salvar Veículo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}