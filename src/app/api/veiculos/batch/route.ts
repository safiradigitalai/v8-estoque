import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateVehicle, sanitizeVehicleData } from '@/lib/validation';
import type { BatchOperation, BatchResponse, BatchOperationResult, ApiError } from '@/types/api';

export async function POST(request: NextRequest): Promise<NextResponse<BatchResponse | ApiError>> {
  try {
    const { operations }: { operations: BatchOperation[] } = await request.json();

    if (!Array.isArray(operations) || operations.length === 0) {
      return NextResponse.json({
        error: 'Operações inválidas',
        message: 'Lista de operações deve ser fornecida e não pode estar vazia'
      }, { status: 400 });
    }

    if (operations.length > 100) {
      return NextResponse.json({
        error: 'Muitas operações',
        message: 'Máximo de 100 operações por batch'
      }, { status: 400 });
    }

    const results: BatchOperationResult[] = [];
    let successCount = 0;
    let failedCount = 0;

    // Buscar configuração de classes uma vez para todas as operações
    const { data: classeConfig } = await supabase
      .from('classes_config')
      .select('*')
      .single();

    // Processar cada operação
    for (const operation of operations) {
      const result: BatchOperationResult = {
        success: false,
        operation
      };

      try {
        switch (operation.action) {
          case 'create':
            result.result = await handleBatchCreate(operation.data, classeConfig);
            result.success = true;
            successCount++;
            break;

          case 'update':
            if (!operation.id) {
              throw new Error('ID é obrigatório para operações de atualização');
            }
            result.result = await handleBatchUpdate(operation.id, operation.data, classeConfig);
            result.success = true;
            successCount++;
            break;

          case 'delete':
            if (!operation.id) {
              throw new Error('ID é obrigatório para operações de exclusão');
            }
            await handleBatchDelete(operation.id);
            result.result = { deleted: true };
            result.success = true;
            successCount++;
            break;

          default:
            throw new Error(`Ação não suportada: ${operation.action}`);
        }
      } catch (error) {
        result.error = error instanceof Error ? error.message : 'Erro desconhecido';
        failedCount++;
      }

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: operations.length,
        successful: successCount,
        failed: failedCount
      }
    });

  } catch (error) {
    console.error('Batch operation error:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
      message: 'Erro ao processar operações em lote',
      details: { message: error instanceof Error ? error.message : 'Erro desconhecido' }
    }, { status: 500 });
  }
}

// Função para criar veículo no batch
async function handleBatchCreate(data: any, classeConfig: any): Promise<any> {
  // Sanitizar e validar
  const sanitizedData = sanitizeVehicleData(data);
  const validation = await validateVehicle(sanitizedData, false);

  if (!validation.valid) {
    throw new Error(`Validação falhou: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Calcular classe social
  let classeSocial = 'D';
  if (classeConfig) {
    const { classe_a_min, classe_b_min, classe_c_min } = classeConfig;
    if (sanitizedData.valor >= classe_a_min) classeSocial = 'A';
    else if (sanitizedData.valor >= classe_b_min) classeSocial = 'B';
    else if (sanitizedData.valor >= classe_c_min) classeSocial = 'C';
  }

  const vehicleData = {
    ...sanitizedData,
    classe_social: classeSocial,
    dias_estoque: 0,
    data_entrada: new Date().toISOString().split('T')[0],
    status: sanitizedData.status || 'disponivel'
  };

  const { data: veiculo, error } = await supabase
    .from('veiculos')
    .insert(vehicleData)
    .select()
    .single();

  if (error) throw error;
  return veiculo;
}

// Função para atualizar veículo no batch
async function handleBatchUpdate(id: number, data: any, classeConfig: any): Promise<any> {
  // Sanitizar e validar
  const sanitizedData = sanitizeVehicleData({ ...data, id });
  const validation = await validateVehicle(sanitizedData, true);

  if (!validation.valid) {
    throw new Error(`Validação falhou: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Preparar dados de atualização
  const updateData: any = { ...sanitizedData };
  delete updateData.id; // Remover ID dos dados de atualização

  // Recalcular classe social se valor foi alterado
  if (sanitizedData.valor !== undefined && classeConfig) {
    const { classe_a_min, classe_b_min, classe_c_min } = classeConfig;
    let classeSocial = 'D';
    if (sanitizedData.valor >= classe_a_min) classeSocial = 'A';
    else if (sanitizedData.valor >= classe_b_min) classeSocial = 'B';
    else if (sanitizedData.valor >= classe_c_min) classeSocial = 'C';
    updateData.classe_social = classeSocial;
  }

  // Se status mudou para vendido, definir data_venda
  if (data.status === 'vendido' && !data.data_venda) {
    updateData.data_venda = new Date().toISOString().split('T')[0];
  }

  // Se status mudou de vendido para outro, limpar data_venda
  if (data.status && data.status !== 'vendido') {
    updateData.data_venda = null;
  }

  updateData.atualizado_em = new Date().toISOString();

  const { data: veiculo, error } = await supabase
    .from('veiculos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Veículo não encontrado');
    }
    throw error;
  }

  return veiculo;
}

// Função para deletar veículo no batch
async function handleBatchDelete(id: number): Promise<void> {
  // Verificar se veículo existe
  const { data: exists } = await supabase
    .from('veiculos')
    .select('id')
    .eq('id', id)
    .single();

  if (!exists) {
    throw new Error('Veículo não encontrado');
  }

  // Deletar veículo (fotos serão deletadas automaticamente por CASCADE)
  const { error } = await supabase
    .from('veiculos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// GET para obter template de operações batch
export async function GET(): Promise<NextResponse> {
  const template = {
    operations: [
      {
        action: "create",
        data: {
          marca: "TOYOTA",
          modelo: "Corolla",
          ano: 2023,
          valor: 85000,
          categoria_id: 1,
          km: 15000,
          cor: "branco",
          combustivel: "flex",
          cambio: "automatico",
          portas: 4,
          observacoes: "Veículo em excelente estado"
        }
      },
      {
        action: "update", 
        id: 123,
        data: {
          valor: 78000,
          status: "reservado"
        }
      },
      {
        action: "delete",
        id: 456
      }
    ]
  };

  return NextResponse.json({
    success: true,
    message: "Template para operações em lote",
    data: template,
    limits: {
      max_operations_per_batch: 100,
      supported_actions: ["create", "update", "delete"]
    }
  });
}