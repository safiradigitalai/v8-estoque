import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Tipos para processamento
interface ProcessResponse {
  success: boolean;
  data?: {
    processed: number;
    errors: number;
    duplicates: number;
    skipped: number;
    preview?: Array<any>;
  };
  error?: string;
  details?: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface ProcessLogEntry {
  file_upload_id: number;
  row_number: number;
  source_data: any;
  processed_data: any;
  validation_errors: ValidationError[];
  status: string;
  error_message?: string;
  veiculo_id?: number;
}

// Função para validar dados de veículo
function validateVehicleData(data: any, rules: any): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, rule]: [string, any]) => {
    const value = data[field];

    // Campo obrigatório
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push({ field, message: 'Campo obrigatório', value });
      return;
    }

    // Se campo não está preenchido e não é obrigatório, pular outras validações
    if (!value && !rule.required) return;

    // Validações específicas
    if (rule.min_length && value.toString().length < rule.min_length) {
      errors.push({ field, message: `Mínimo ${rule.min_length} caracteres`, value });
    }

    if (rule.max_length && value.toString().length > rule.max_length) {
      errors.push({ field, message: `Máximo ${rule.max_length} caracteres`, value });
    }

    if (rule.min && parseFloat(value) < rule.min) {
      errors.push({ field, message: `Valor mínimo: ${rule.min}`, value });
    }

    if (rule.max && parseFloat(value) > rule.max) {
      errors.push({ field, message: `Valor máximo: ${rule.max}`, value });
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push({ field, message: `Valor deve ser: ${rule.enum.join(', ')}`, value });
    }
  });

  return errors;
}

// Função para transformar dados
function transformData(data: any, fieldMap: any): any {
  const transformed: any = {};

  Object.entries(fieldMap).forEach(([targetField, sourceField]) => {
    const value = data[sourceField as string];
    if (value !== undefined && value !== null && value !== '') {
      transformed[targetField] = value;
    }
  });

  return transformed;
}

// Função para processar linha CSV
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ upload_id: string }> }
): Promise<NextResponse<ProcessResponse>> {
  try {
    const params = await context.params;
    const uploadId = parseInt(params.upload_id);
    const body = await request.json();
    const { preview_only = false, mapping_id } = body;

    if (isNaN(uploadId)) {
      return NextResponse.json({
        success: false,
        error: 'ID de upload inválido'
      }, { status: 400 });
    }

    // Buscar informações do upload
    const { data: upload, error: uploadError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json({
        success: false,
        error: 'Upload não encontrado'
      }, { status: 404 });
    }

    // Buscar mapeamento de campos
    const { data: fieldMapping } = await supabase
      .from('field_mappings')
      .select('*')
      .eq('id', mapping_id || 1) // Usar mapeamento padrão se não especificado
      .single();

    if (!fieldMapping) {
      return NextResponse.json({
        success: false,
        error: 'Mapeamento de campos não encontrado'
      }, { status: 400 });
    }

    // Atualizar status para processando
    if (!preview_only) {
      await supabase
        .from('file_uploads')
        .update({ status: 'processing' })
        .eq('id', uploadId);
    }

    // Ler arquivo
    const fileContent = await readFile(upload.file_path, 'utf-8');
    
    let rows: any[] = [];
    let headers: string[] = [];

    // Processar baseado no tipo
    if (upload.import_type === 'csv') {
      const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length === 0) {
        throw new Error('Arquivo CSV vazio');
      }

      headers = parseCSVLine(lines[0]);
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        
        rows.push(row);
      }
    }

    // Buscar categoria padrão se não encontrar
    const { data: categorias } = await supabase
      .from('categorias')
      .select('id, nome')
      .eq('ativo', true)
      .order('ordem')
      .limit(1);

    const defaultCategoryId = categorias?.[0]?.id || 1;

    // Processar dados
    let processedCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    let skippedCount = 0;
    const previewData: any[] = [];
    const maxPreview = 10;

    for (let i = 0; i < rows.length; i++) {
      const rowData = rows[i];
      const rowNumber = i + 1;

      try {
        // Transformar dados usando mapeamento
        const transformedData = transformData(rowData, fieldMapping.field_map);
        
        // Adicionar categoria padrão se não especificada
        if (!transformedData.categoria_id) {
          transformedData.categoria_id = defaultCategoryId;
        }

        // Validar dados
        const validationErrors = validateVehicleData(transformedData, fieldMapping.validation_rules);

        // Para preview, incluir primeiras linhas
        if (preview_only && previewData.length < maxPreview) {
          previewData.push({
            row_number: rowNumber,
            original_data: rowData,
            transformed_data: transformedData,
            validation_errors: validationErrors,
            status: validationErrors.length > 0 ? 'error' : 'valid'
          });
        }

        if (!preview_only) {
          // Registrar no log de importação
          const logEntry: ProcessLogEntry = {
            file_upload_id: uploadId,
            row_number: rowNumber,
            source_data: rowData,
            processed_data: transformedData,
            validation_errors: validationErrors,
            status: 'pending'
          };

          if (validationErrors.length > 0) {
            logEntry.status = 'error';
            logEntry.error_message = `Erros de validação: ${validationErrors.map(e => e.message).join(', ')}`;
            errorCount++;
          } else {
            // Verificar duplicatas (por placa ou modelo+marca+ano)
            let isDuplicate = false;
            
            if (transformedData.placa) {
              const { data: existing } = await supabase
                .from('veiculos')
                .select('id')
                .eq('placa', transformedData.placa)
                .limit(1);
                
              if (existing && existing.length > 0) {
                isDuplicate = true;
              }
            }

            if (!isDuplicate && transformedData.marca && transformedData.modelo && transformedData.ano) {
              const { data: existing } = await supabase
                .from('veiculos')
                .select('id')
                .eq('marca', transformedData.marca)
                .eq('modelo', transformedData.modelo)
                .eq('ano', transformedData.ano)
                .limit(1);
                
              if (existing && existing.length > 0) {
                isDuplicate = true;
              }
            }

            if (isDuplicate) {
              logEntry.status = 'duplicate';
              duplicateCount++;
            } else {
              // Tentar criar veículo
              try {
                const { data: veiculo, error: createError } = await supabase
                  .from('veiculos')
                  .insert(transformedData)
                  .select()
                  .single();

                if (createError) throw createError;

                logEntry.status = 'processed';
                logEntry.veiculo_id = veiculo.id;
                processedCount++;
              } catch (createError) {
                logEntry.status = 'error';
                logEntry.error_message = createError instanceof Error ? createError.message : 'Erro desconhecido';
                errorCount++;
              }
            }
          }

          // Salvar log
          await supabase.from('import_logs').insert(logEntry);
        }

      } catch (error) {
        console.error(`Erro ao processar linha ${rowNumber}:`, error);
        
        if (!preview_only) {
          await supabase.from('import_logs').insert({
            file_upload_id: uploadId,
            row_number: rowNumber,
            source_data: rowData,
            status: 'error',
            error_message: error instanceof Error ? error.message : 'Erro desconhecido'
          });
          errorCount++;
        }
      }
    }

    // Atualizar status final do upload
    if (!preview_only) {
      await supabase
        .from('file_uploads')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          valid_rows: processedCount,
          error_rows: errorCount
        })
        .eq('id', uploadId);
    }

    const response: ProcessResponse = {
      success: true,
      data: {
        processed: processedCount,
        errors: errorCount,
        duplicates: duplicateCount,
        skipped: skippedCount
      }
    };

    if (preview_only) {
      response.data!.preview = previewData;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Process import error:', error);
    
    // Atualizar status para erro
    try {
      const params = await context.params;
      const uploadId = parseInt(params.upload_id);
      
      if (!isNaN(uploadId)) {
        await supabase
          .from('file_uploads')
          .update({ status: 'failed' })
          .eq('id', uploadId);
      }
    } catch (updateError) {
      console.error('Erro ao atualizar status:', updateError);
    }

    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}