import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface VehiclesResponse {
  success: boolean;
  vehicles?: any[];
  total?: number;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<VehiclesResponse>> {
  try {
    // Buscar veículos diretamente da tabela veiculos com joins para categoria
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('veiculos')
      .select(`
        *,
        categorias (
          nome,
          slug,
          icone
        )
      `)
      .order('id', { ascending: false });

    if (vehiclesError) {
      console.error('Erro ao buscar veículos:', vehiclesError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao carregar veículos'
      }, { status: 500 });
    }

    // Formatar dados para compatibilidade com o frontend
    const formattedVehicles = vehicles?.map(vehicle => ({
      ...vehicle,
      categoria_nome: vehicle.categorias?.nome || '',
      categoria_slug: vehicle.categorias?.slug || '',
      categoria_icone: vehicle.categorias?.icone || '',
      foto_principal: null, // Por enquanto sem fotos
      foto_thumb: null // Por enquanto sem fotos
    })) || [];

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles,
      total: formattedVehicles.length
    });

  } catch (error) {
    console.error('Erro interno na API de veículos:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<VehiclesResponse>> {
  try {
    const body = await request.json();
    
    const {
      marca,
      modelo,
      ano,
      valor,
      categoria_id,
      km,
      cor,
      combustivel,
      cambio,
      portas,
      placa,
      codigo_interno,
      observacoes,
      status = 'disponivel'
    } = body;

    // Validações básicas
    if (!marca || !modelo || !ano || !valor || !categoria_id) {
      return NextResponse.json({
        success: false,
        error: 'Campos obrigatórios: marca, modelo, ano, valor e categoria'
      }, { status: 400 });
    }

    // Inserir novo veículo
    const { data: newVehicle, error: insertError } = await supabase
      .from('veiculos')
      .insert({
        marca: marca.trim(),
        modelo: modelo.trim(),
        ano: parseInt(ano),
        valor: parseFloat(valor),
        categoria_id: parseInt(categoria_id),
        km: km ? parseInt(km) : null,
        cor: cor?.trim() || null,
        combustivel: combustivel || null,
        cambio: cambio || null,
        portas: portas ? parseInt(portas) : null,
        placa: placa?.trim().toUpperCase() || null,
        codigo_interno: codigo_interno?.trim() || null,
        observacoes: observacoes?.trim() || null,
        status,
        data_entrada: new Date().toISOString()
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Erro ao inserir veículo:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar veículo'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      vehicles: [newVehicle]
    });

  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse<VehiclesResponse>> {
  try {
    const body = await request.json();
    
    const {
      id,
      marca,
      modelo,
      ano,
      valor,
      categoria_id,
      km,
      cor,
      combustivel,
      cambio,
      portas,
      placa,
      codigo_interno,
      observacoes,
      status = 'disponivel'
    } = body;

    // Validações básicas
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID do veículo é obrigatório para edição'
      }, { status: 400 });
    }

    if (!marca || !modelo || !ano || !valor || !categoria_id) {
      return NextResponse.json({
        success: false,
        error: 'Campos obrigatórios: marca, modelo, ano, valor e categoria'
      }, { status: 400 });
    }

    // Atualizar veículo
    const { data: updatedVehicle, error: updateError } = await supabase
      .from('veiculos')
      .update({
        marca: marca.trim(),
        modelo: modelo.trim(),
        ano: parseInt(ano),
        valor: parseFloat(valor),
        categoria_id: parseInt(categoria_id),
        km: km ? parseInt(km) : null,
        cor: cor?.trim() || null,
        combustivel: combustivel || null,
        cambio: cambio || null,
        portas: portas ? parseInt(portas) : null,
        placa: placa?.trim().toUpperCase() || null,
        codigo_interno: codigo_interno?.trim() || null,
        observacoes: observacoes?.trim() || null,
        status,
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select('*')
      .single();

    if (updateError) {
      console.error('Erro ao atualizar veículo:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao atualizar veículo'
      }, { status: 500 });
    }

    if (!updatedVehicle) {
      return NextResponse.json({
        success: false,
        error: 'Veículo não encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vehicles: [updatedVehicle]
    });

  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}