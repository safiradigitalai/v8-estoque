import { supabase } from '@/lib/supabase';
import type { VehicleValidationError, VehicleValidationResult, CreateVeiculoRequest, UpdateVeiculoRequest } from '@/types/api';

// Mapeamento de marcas conhecidas para normalização
const BRAND_NORMALIZATION_MAP: Record<string, string> = {
  // Volkswagen variações
  'VOLKSWAGEN': 'Volkswagen',
  'VW': 'Volkswagen',
  'VOLKS': 'Volkswagen',
  
  // Mercedes variações
  'MERCEDES-BENZ': 'Mercedes-Benz',
  'MERCEDES': 'Mercedes-Benz',
  'BENZ': 'Mercedes-Benz',
  
  // BMW variações
  'BMW': 'BMW',
  
  // Audi variações
  'AUDI': 'Audi',
  
  // Toyota variações
  'TOYOTA': 'Toyota',
  
  // Honda variações
  'HONDA': 'Honda',
  
  // Ford variações
  'FORD': 'Ford',
  
  // Chevrolet variações
  'CHEVROLET': 'Chevrolet',
  'CHEVY': 'Chevrolet',
  
  // Fiat variações
  'FIAT': 'Fiat',
  
  // Nissan variações
  'NISSAN': 'Nissan',
  
  // Hyundai variações
  'HYUNDAI': 'Hyundai',
  
  // Renault variações
  'RENAULT': 'Renault',
  
  // Peugeot variações
  'PEUGEOT': 'Peugeot',
  
  // Citroen variações
  'CITROEN': 'Citroën',
  'CITROËN': 'Citroën',
  
  // Porsche variações
  'PORSCHE': 'Porsche',
  
  // Mitsubishi variações
  'MITSUBISHI': 'Mitsubishi',
  
  // Jeep variações
  'JEEP': 'Jeep',
  
  // Land Rover variações
  'LAND ROVER': 'Land Rover',
  'LANDROVER': 'Land Rover',
  
  // Jaguar variações
  'JAGUAR': 'Jaguar',
  
  // Volvo variações
  'VOLVO': 'Volvo'
};

/**
 * Normaliza o nome da marca seguindo padrões consistentes
 */
export function normalizeBrandName(brand: string): string {
  if (!brand) return '';
  
  // Converter para uppercase para comparação
  const upperBrand = brand.toString().trim().toUpperCase();
  
  // Verificar se existe no mapeamento
  if (BRAND_NORMALIZATION_MAP[upperBrand]) {
    return BRAND_NORMALIZATION_MAP[upperBrand];
  }
  
  // Se não está no mapeamento, usar formato Title Case
  return brand
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Tipos de validação
interface BaseValidationRule {
  required: boolean;
  message: string;
}

interface StringValidationRule extends BaseValidationRule {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  transform?: (value: string) => string;
}

interface NumberValidationRule extends BaseValidationRule {
  type: 'number';
  min?: number;
  max?: number;
}

interface EnumValidationRule extends BaseValidationRule {
  type: 'enum';
  enum: string[];
}

type ValidationRule = StringValidationRule | NumberValidationRule | EnumValidationRule;

// Schema de validação para veículos
export const vehicleValidationSchema: Record<string, ValidationRule> = {
  // Campos obrigatórios
  marca: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s\-]+$/,
    message: 'Marca deve conter apenas letras, números, espaços e hifens'
  },
  modelo: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s\-/.()]+$/,
    message: 'Modelo deve conter apenas letras, números, espaços e caracteres especiais básicos'
  },
  ano: {
    required: true,
    type: 'number',
    min: 1990,
    max: new Date().getFullYear() + 1,
    message: `Ano deve estar entre 1990 e ${new Date().getFullYear() + 1}`
  },
  valor: {
    required: true,
    type: 'number',
    min: 1000,
    max: 10000000,
    message: 'Valor deve estar entre R$ 1.000 e R$ 10.000.000'
  },
  categoria_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Categoria é obrigatória'
  },

  // Campos opcionais
  km: {
    required: false,
    type: 'number',
    min: 0,
    max: 1000000,
    message: 'Quilometragem deve estar entre 0 e 1.000.000 km'
  },
  cor: {
    required: false,
    type: 'string',
    maxLength: 30,
    pattern: /^[a-zA-ZÀ-ÿ\s\-]+$/,
    message: 'Cor deve conter apenas letras, espaços e hifens'
  },
  combustivel: {
    required: false,
    type: 'enum',
    enum: ['flex', 'gasolina', 'diesel', 'eletrico', 'hibrido'],
    message: 'Combustível deve ser: flex, gasolina, diesel, elétrico ou híbrido'
  },
  cambio: {
    required: false,
    type: 'enum',
    enum: ['manual', 'automatico', 'cvt'],
    message: 'Câmbio deve ser: manual, automático ou CVT'
  },
  portas: {
    required: false,
    type: 'number',
    min: 2,
    max: 5,
    message: 'Número de portas deve estar entre 2 e 5'
  },
  placa: {
    required: false,
    type: 'string',
    pattern: /^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/,
    transform: (value: string) => value?.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    message: 'Placa deve seguir o formato ABC1234 ou ABC1D23 (Mercosul)'
  },
  codigo_interno: {
    required: false,
    type: 'string',
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\-_]+$/,
    message: 'Código interno deve conter apenas letras, números, hifens e underscores'
  },
  observacoes: {
    required: false,
    type: 'string',
    maxLength: 1000,
    message: 'Observações não podem exceder 1000 caracteres'
  },
  status: {
    required: false,
    type: 'enum',
    enum: ['disponivel', 'reservado', 'vendido'],
    message: 'Status deve ser: disponível, reservado ou vendido'
  }
};

// Função para validar um campo específico
export function validateField(field: string, value: any, schema: any): VehicleValidationError[] {
  const errors: VehicleValidationError[] = [];
  const rule = schema[field];

  if (!rule) return errors;

  // Transformar valor se necessário
  if (rule.transform && value) {
    value = rule.transform(value);
  }

  // Campo obrigatório
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push({
      field,
      message: `${field} é obrigatório`,
      code: 'REQUIRED',
      value
    });
    return errors; // Se obrigatório e vazio, não validar outros aspectos
  }

  // Se campo não obrigatório e vazio, não validar
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return errors;
  }

  // Validação de tipo
  if (rule.type && value !== undefined && value !== null && value !== '') {
    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push({
        field,
        message: `${field} deve ser texto`,
        code: 'INVALID_TYPE',
        value
      });
    } else if (rule.type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        errors.push({
          field,
          message: `${field} deve ser um número válido`,
          code: 'INVALID_NUMBER',
          value
        });
        return errors; // Se não é número válido, não validar ranges
      }
      value = numValue; // Converter para número para próximas validações
    }
  }

  // Validação de comprimento mínimo
  if (rule.minLength && value.toString().length < rule.minLength) {
    errors.push({
      field,
      message: `${field} deve ter pelo menos ${rule.minLength} caracteres`,
      code: 'MIN_LENGTH',
      value
    });
  }

  // Validação de comprimento máximo
  if (rule.maxLength && value.toString().length > rule.maxLength) {
    errors.push({
      field,
      message: `${field} deve ter no máximo ${rule.maxLength} caracteres`,
      code: 'MAX_LENGTH',
      value
    });
  }

  // Validação de valor mínimo
  if (rule.min && value < rule.min) {
    errors.push({
      field,
      message: `${field} deve ser maior ou igual a ${rule.min}`,
      code: 'MIN_VALUE',
      value
    });
  }

  // Validação de valor máximo
  if (rule.max && value > rule.max) {
    errors.push({
      field,
      message: `${field} deve ser menor ou igual a ${rule.max}`,
      code: 'MAX_VALUE',
      value
    });
  }

  // Validação de padrão regex
  if (rule.pattern && !rule.pattern.test(value.toString())) {
    errors.push({
      field,
      message: rule.message || `${field} não atende ao formato requerido`,
      code: 'PATTERN_MISMATCH',
      value
    });
  }

  // Validação de enum
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push({
      field,
      message: rule.message || `${field} deve ser um dos valores: ${rule.enum.join(', ')}`,
      code: 'INVALID_ENUM',
      value
    });
  }

  return errors;
}

// Função principal de validação
export async function validateVehicle(
  data: CreateVeiculoRequest | UpdateVeiculoRequest,
  isUpdate = false
): Promise<VehicleValidationResult> {
  const errors: VehicleValidationError[] = [];
  const warnings: VehicleValidationError[] = [];

  // Validar cada campo
  Object.keys(vehicleValidationSchema).forEach(field => {
    const fieldErrors = validateField(field, data[field as keyof typeof data], vehicleValidationSchema);
    errors.push(...fieldErrors);
  });

  // Validações específicas que requerem consulta ao banco
  
  // 1. Validar se categoria existe
  if (data.categoria_id) {
    const { data: categoria } = await supabase
      .from('categorias')
      .select('id, ativo')
      .eq('id', data.categoria_id)
      .single();

    if (!categoria) {
      errors.push({
        field: 'categoria_id',
        message: 'Categoria não encontrada',
        code: 'CATEGORY_NOT_FOUND',
        value: data.categoria_id
      });
    } else if (!categoria.ativo) {
      warnings.push({
        field: 'categoria_id',
        message: 'Categoria está inativa',
        code: 'CATEGORY_INACTIVE',
        value: data.categoria_id
      });
    }
  }

  // 2. Validar duplicação de placa
  if (data.placa) {
    const placaRule = vehicleValidationSchema.placa as StringValidationRule;
    const transformedPlaca = placaRule.transform ? placaRule.transform(data.placa) : data.placa;
    
    let query = supabase
      .from('veiculos')
      .select('id')
      .eq('placa', transformedPlaca);

    // Se é update, excluir o próprio veículo
    if (isUpdate && (data as any).id) {
      query = query.neq('id', (data as any).id);
    }

    const { data: existing } = await query.limit(1);

    if (existing && existing.length > 0) {
      errors.push({
        field: 'placa',
        message: 'Já existe um veículo com esta placa',
        code: 'DUPLICATE_PLATE',
        value: data.placa
      });
    }
  }

  // 3. Validar duplicação de código interno
  if (data.codigo_interno) {
    let query = supabase
      .from('veiculos')
      .select('id')
      .eq('codigo_interno', data.codigo_interno);

    if (isUpdate && (data as any).id) {
      query = query.neq('id', (data as any).id);
    }

    const { data: existing } = await query.limit(1);

    if (existing && existing.length > 0) {
      errors.push({
        field: 'codigo_interno',
        message: 'Já existe um veículo com este código interno',
        code: 'DUPLICATE_CODE',
        value: data.codigo_interno
      });
    }
  }

  // 4. Validações de negócio
  if (data.ano && data.ano < 2000 && data.km && data.km < 50000) {
    warnings.push({
      field: 'km',
      message: 'Quilometragem muito baixa para a idade do veículo',
      code: 'SUSPICIOUS_MILEAGE',
      value: data.km
    });
  }

  if (data.valor && data.ano) {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - data.ano;
    
    // Carros muito antigos não deveriam ter valores muito altos
    if (vehicleAge > 20 && data.valor > 100000) {
      warnings.push({
        field: 'valor',
        message: 'Valor alto para a idade do veículo',
        code: 'HIGH_VALUE_OLD_CAR',
        value: data.valor
      });
    }
    
    // Carros novos com valor muito baixo
    if (vehicleAge < 2 && data.valor < 30000) {
      warnings.push({
        field: 'valor',
        message: 'Valor baixo para veículo novo',
        code: 'LOW_VALUE_NEW_CAR',
        value: data.valor
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Função para sanitizar dados antes da validação
export function sanitizeVehicleData(data: any): any {
  const sanitized = { ...data };

  // Aplicar transformações definidas no schema
  Object.keys(vehicleValidationSchema).forEach(field => {
    const rule = vehicleValidationSchema[field as keyof typeof vehicleValidationSchema];
    if (rule.type === 'string' && (rule as StringValidationRule).transform && sanitized[field]) {
      sanitized[field] = (rule as StringValidationRule).transform!(sanitized[field]);
    }
  });

  // Limpezas específicas - normalizar marca para formato consistente
  if (sanitized.marca) {
    sanitized.marca = normalizeBrandName(sanitized.marca.toString().trim());
  }
  
  if (sanitized.modelo) {
    sanitized.modelo = sanitized.modelo.toString().trim();
  }
  
  if (sanitized.cor) {
    sanitized.cor = sanitized.cor.toString().trim().toLowerCase();
  }

  // Converter strings numéricas
  ['ano', 'valor', 'km', 'portas', 'categoria_id'].forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      const num = parseFloat(sanitized[field]);
      if (!isNaN(num)) {
        sanitized[field] = num;
      }
    }
  });

  return sanitized;
}