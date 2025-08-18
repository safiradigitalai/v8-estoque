import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { DashboardVendedor } from '@/types/database';

export async function GET() {
  try {
    
    // Buscar dados da view dashboard_vendedores
    const { data: vendedores, error } = await supabase
      .from('dashboard_vendedores')
      .select('*')
      .order('ranking_geral', { ascending: true });

    if (error) {
      console.error('Erro ao buscar vendedores:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendedores,
      meta: {
        total: vendedores.length,
        mock: false
      }
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.nome || !body.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: vendedor, error } = await supabase
      .from('vendedores')
      .insert([{
        nome: body.nome,
        email: body.email,
        telefone: body.telefone || null,
        foto_url: body.foto_url || null,
        nivel: body.nivel || 'iniciante',
        meta_mensal: body.meta_mensal || 30000,
        comissao_percentual: body.comissao_percentual || 2.5,
        especialidades: body.especialidades || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar vendedor:', error);
      return NextResponse.json(
        { error: 'Erro ao criar vendedor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendedor,
      message: 'Vendedor criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}