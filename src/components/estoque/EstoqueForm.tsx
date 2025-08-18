'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  Upload, 
  X,
  Car,
  DollarSign,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  AlertCircle,
  Check
} from 'lucide-react';

// Interface para dados do formulário
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

interface EstoqueFormProps {
  title: string;
  vehicle?: VehicleFormData;
  onBack: () => void;
  onSave: () => void;
}

// Opções para selects
const combustivelOptions = [
  { value: '', label: 'Selecione o combustível' },
  { value: 'flex', label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' }
];

const cambioOptions = [
  { value: '', label: 'Selecione o câmbio' },
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'cvt', label: 'CVT' }
];

const statusOptions = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' }
];

export function EstoqueForm({ title, vehicle, onBack, onSave }: EstoqueFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: '',
    modelo: '',
    ano: '',
    valor: '',
    categoria_id: '',
    km: '',
    cor: '',
    combustivel: undefined,
    cambio: undefined,
    portas: '',
    placa: '',
    codigo_interno: '',
    observacoes: '',
    status: 'disponivel'
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    fetchCategorias();
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erros do campo quando o usuário começar a digitar
    if (errors.some(error => error.field === field)) {
      setErrors(prev => prev.filter(error => error.field !== field));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files].slice(0, 5)); // Máximo 5 fotos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.marca.trim()) {
      newErrors.push({ field: 'marca', message: 'Marca é obrigatória' });
    }

    if (!formData.modelo.trim()) {
      newErrors.push({ field: 'modelo', message: 'Modelo é obrigatório' });
    }

    if (!formData.ano || formData.ano < 1900 || formData.ano > new Date().getFullYear() + 1) {
      newErrors.push({ field: 'ano', message: 'Ano deve ser válido' });
    }

    if (!formData.valor || Number(formData.valor) <= 0) {
      newErrors.push({ field: 'valor', message: 'Valor deve ser maior que zero' });
    }

    if (!formData.categoria_id) {
      newErrors.push({ field: 'categoria_id', message: 'Categoria é obrigatória' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Implementar salvamento real via API
      const response = await fetch('/api/vehicles', {
        method: vehicle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: vehicle?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar veículo');
      }

      const result = await response.json();
      
      if (result.success) {
        onSave();
      } else {
        throw new Error(result.error || 'Erro ao salvar veículo');
      }
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setErrors([{ field: 'form', message: 'Erro ao salvar veículo. Tente novamente.' }]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    // Limpar estados antes de voltar
    setErrors([]);
    setWarnings([]);
    setIsSaving(false);
    onBack();
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numericValue) / 100);
    return formattedValue;
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-light text-gray-900">{title}</h1>
              <p className="text-gray-600 font-mono text-sm">
                Preencha os dados do veículo
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>

        {/* Erro global do formulário */}
        {errors.some(error => error.field === 'form') && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">
                {errors.find(error => error.field === 'form')?.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    getFieldError('marca') 
                      ? 'border-red-300 focus:border-red-300' 
                      : 'border-white/40 focus:border-emerald-300'
                  }`}
                  placeholder="Ex: Toyota, Honda, BMW..."
                />
                {getFieldError('marca') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('marca')?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    getFieldError('modelo') 
                      ? 'border-red-300 focus:border-red-300' 
                      : 'border-white/40 focus:border-emerald-300'
                  }`}
                  placeholder="Ex: Corolla, Civic, X3..."
                />
                {getFieldError('modelo') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('modelo')?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano *
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.ano}
                  onChange={(e) => handleInputChange('ano', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    getFieldError('ano') 
                      ? 'border-red-300 focus:border-red-300' 
                      : 'border-white/40 focus:border-emerald-300'
                  }`}
                  placeholder="2024"
                />
                {getFieldError('ano') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('ano')?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.valor}
                    onChange={(e) => handleInputChange('valor', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      getFieldError('valor') 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-white/40 focus:border-emerald-300'
                    }`}
                    placeholder="50000"
                  />
                </div>
                {getFieldError('valor') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('valor')?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => handleInputChange('categoria_id', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    getFieldError('categoria_id') 
                      ? 'border-red-300 focus:border-red-300' 
                      : 'border-white/40 focus:border-emerald-300'
                  }`}
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
                {getFieldError('categoria_id') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('categoria_id')?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900">Detalhes Técnicos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.km}
                    onChange={(e) => handleInputChange('km', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <input
                  type="text"
                  value={formData.cor}
                  onChange={(e) => handleInputChange('cor', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                  placeholder="Branco, Prata, Preto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combustível
                </label>
                <select
                  value={formData.combustivel || ''}
                  onChange={(e) => handleInputChange('combustivel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                >
                  {combustivelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câmbio
                </label>
                <select
                  value={formData.cambio || ''}
                  onChange={(e) => handleInputChange('cambio', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                >
                  {cambioOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Portas
                </label>
                <input
                  type="number"
                  min="2"
                  max="5"
                  value={formData.portas}
                  onChange={(e) => handleInputChange('portas', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa
                </label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                rows={4}
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all duration-300"
                placeholder="Informações adicionais sobre o veículo..."
              />
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900">Fotos do Veículo</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Clique para enviar</span> ou arraste as fotos
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG até 5MB (máx. 5 fotos)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}