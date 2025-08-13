import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateVehicle, sanitizeVehicleData } from '@/lib/validation';
import type { VeiculoListParams, VeiculoResponse, CreateVeiculoRequest, ApiSuccess, ApiError } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extrair parâmetros da query
    const params: VeiculoListParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      marca: searchParams.get('marca') || undefined,
      categoria: searchParams.get('categoria') || undefined,
      classe_social: searchParams.get('classe_social') as 'A' | 'B' | 'C' | 'D' || undefined,
      status: searchParams.get('status') as 'disponivel' | 'reservado' | 'vendido' || undefined,
      valor_min: searchParams.get('valor_min') ? parseFloat(searchParams.get('valor_min')!) : undefined,
      valor_max: searchParams.get('valor_max') ? parseFloat(searchParams.get('valor_max')!) : undefined,
      search: searchParams.get('search') || undefined,
      sort_by: searchParams.get('sort_by') as 'valor' | 'marca' | 'modelo' | 'ano' || 'valor',
      sort_order: searchParams.get('sort_order') as 'asc' | 'desc' || 'desc'
    };

    // Construir query base
    let query = supabase
      .from('veiculos')
      .select(`
        *,
        categorias!inner(nome, slug, icone),
        veiculo_fotos!left(url, tipo, url_thumb)
      `);

    // Aplicar filtros
    if (params.marca) {
      query = query.ilike('marca', `%${params.marca}%`);
    }

    if (params.categoria) {
      query = query.eq('categorias.slug', params.categoria);
    }

    if (params.classe_social) {
      query = query.eq('classe_social', params.classe_social);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    } else {
      // Por padrão, não mostrar vendidos
      query = query.neq('status', 'vendido');
    }

    if (params.valor_min !== undefined) {
      query = query.gte('valor', params.valor_min);
    }

    if (params.valor_max !== undefined) {
      query = query.lte('valor', params.valor_max);
    }

    if (params.search) {
      query = query.or(`marca.ilike.%${params.search}%,modelo.ilike.%${params.search}%,placa.ilike.%${params.search}%`);
    }

    // Contar total de registros (para paginação)
    const { count, error: countError } = await supabase
      .from('veiculos')
      .select('*', { count: 'exact', head: true })
      .match(params.status ? { status: params.status } : {});

    if (countError) throw countError;

    // Aplicar ordenação
    const sortField = params.sort_by || 'valor';
    const sortOrder = params.sort_order === 'asc' ? true : false;
    query = query.order(sortField, { ascending: sortOrder });

    // Aplicar paginação
    const offset = ((params.page || 1) - 1) * (params.limit || 10);
    query = query.range(offset, offset + (params.limit || 10) - 1);

    const { data: veiculos, error } = await query;

    if (error) throw error;

    // Processar dados para incluir foto principal
    const veiculosProcessados = veiculos?.map(veiculo => {
      const fotoPrincipal = veiculo.veiculo_fotos?.find((f: { tipo: string }) => f.tipo === 'principal');
      return {
        id: veiculo.id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        valor: veiculo.valor,
        classe_social: veiculo.classe_social,
        status: veiculo.status,
        dias_estoque: veiculo.dias_estoque,
        km: veiculo.km,
        cor: veiculo.cor,
        combustivel: veiculo.combustivel,
        cambio: veiculo.cambio,
        categoria_nome: veiculo.categorias?.nome,
        categoria_slug: veiculo.categorias?.slug,
        categoria_icone: veiculo.categorias?.icone,
        foto_principal: fotoPrincipal?.url || null,
        foto_thumb: fotoPrincipal?.url_thumb || null
      };
    }) || [];

    // Calcular agregações
    const totalVeiculos = count || 0;
    const totalPages = Math.ceil(totalVeiculos / (params.limit || 10));
    const currentPage = params.page || 1;

    // Agregações dos dados filtrados
    const totalValor = veiculosProcessados.reduce((sum, v) => sum + v.valor, 0);
    const mediaValor = veiculosProcessados.length > 0 ? totalValor / veiculosProcessados.length : 0;
    const mediaKm = veiculosProcessados.length > 0 
      ? veiculosProcessados.reduce((sum, v) => sum + (v.km || 0), 0) / veiculosProcessados.length 
      : 0;
    const mediaDiasEstoque = veiculosProcessados.length > 0
      ? veiculosProcessados.reduce((sum, v) => sum + v.dias_estoque, 0) / veiculosProcessados.length
      : 0;

    const response: VeiculoResponse = {
      data: veiculosProcessados,
      pagination: {
        page: currentPage,
        limit: params.limit || 10,
        total: totalVeiculos,
        total_pages: totalPages,
        has_next: currentPage < totalPages,
        has_prev: currentPage > 1
      },
      filters_applied: params,
      aggregations: {
        total_valor: totalValor,
        media_valor: mediaValor,
        media_km: mediaKm,
        media_dias_estoque: mediaDiasEstoque
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Veículos list error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao listar veículos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiSuccess | ApiError>> {
  try {
    const rawBody = await request.json();

    // Sanitizar dados de entrada
    const sanitizedData = sanitizeVehicleData(rawBody);

    // Validação robusta
    const validation = await validateVehicle(sanitizedData, false);

    if (!validation.valid) {
      return NextResponse.json({
        error: 'Dados inválidos',
        message: 'Os dados fornecidos contêm erros de validação',
        validation_errors: validation.errors
      }, { status: 400 });
    }

    // Buscar configuração de classes para calcular classe social automaticamente
    const { data: classeConfig } = await supabase
      .from('classes_config')
      .select('*')
      .single();

    let classeSocial = 'D';
    if (classeConfig) {
      const { classe_a_min, classe_b_min, classe_c_min } = classeConfig;
      if (sanitizedData.valor >= classe_a_min) classeSocial = 'A';
      else if (sanitizedData.valor >= classe_b_min) classeSocial = 'B';
      else if (sanitizedData.valor >= classe_c_min) classeSocial = 'C';
    }

    // Preparar dados para inserção
    const vehicleData = {
      ...sanitizedData,
      classe_social: classeSocial,
      dias_estoque: 0,
      data_entrada: new Date().toISOString().split('T')[0], // Data atual
      status: sanitizedData.status || 'disponivel'
    };

    // Inserir veículo
    const { data: veiculo, error } = await supabase
      .from('veiculos')
      .insert(vehicleData)
      .select(`
        *,
        categorias!inner(id, nome, slug, icone)
      `)
      .single();

    if (error) {
      // Tratar erros específicos do PostgreSQL
      if (error.code === '23505') { // Unique violation
        const field = error.details?.includes('placa') ? 'placa' : 
                     error.details?.includes('codigo_interno') ? 'codigo_interno' : 'unknown';
        
        return NextResponse.json({
          error: 'Dados duplicados',
          message: `Já existe um veículo com este ${field === 'placa' ? 'placa' : 'código interno'}`,
          code: 'DUPLICATE_ENTRY',
          validation_errors: [{
            field,
            message: `${field === 'placa' ? 'Placa' : 'Código interno'} já está em uso`,
            code: 'DUPLICATE'
          }]
        }, { status: 409 });
      }
      
      throw error;
    }

    // Resposta de sucesso com warnings se houver
    const response: ApiSuccess = {
      success: true,
      data: veiculo,
      message: 'Veículo criado com sucesso'
    };

    if (validation.warnings.length > 0) {
      response.warnings = validation.warnings;
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Criar veículo error:', error);
    
    const errorResponse: ApiError = {
      error: 'Erro interno do servidor',
      message: 'Erro ao criar veículo',
      details: { message: error instanceof Error ? error.message : 'Erro desconhecido' }
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}