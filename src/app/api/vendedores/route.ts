import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { DashboardVendedor } from '@/types/database';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodo = url.searchParams.get('periodo');
    
    // Se um período específico foi solicitado, buscar dados customizados
    if (periodo) {
      // Buscar vendedores ativos com métricas do período específico
      const { data: vendedores, error } = await supabase
        .from('vendedores')
        .select(`
          id, nome, email, telefone, foto_url, pontuacao, nivel, meta_mensal, 
          comissao_percentual, status, data_contratacao, especialidades,
          vendedores_metricas!inner(
            leads_recebidos, leads_convertidos, veiculos_vendidos, 
            valor_vendas, taxa_conversao, ticket_medio, meta_atingida
          )
        `)
        .eq('vendedores_metricas.periodo', periodo)
        .order('pontuacao', { ascending: false });

      if (error) throw error;

      // Transformar dados para o formato esperado
      const vendedoresFormatados = vendedores?.map((v: any) => ({
        ...v,
        leads_mes_atual: v.vendedores_metricas[0]?.leads_recebidos || 0,
        conversoes_mes_atual: v.vendedores_metricas[0]?.leads_convertidos || 0,
        vendas_mes_atual: v.vendedores_metricas[0]?.veiculos_vendidos || 0,
        faturamento_mes_atual: v.vendedores_metricas[0]?.valor_vendas || 0,
        taxa_conversao_atual: v.vendedores_metricas[0]?.taxa_conversao || 0,
        ticket_medio_atual: v.vendedores_metricas[0]?.ticket_medio || 0,
        meta_atingida_atual: v.vendedores_metricas[0]?.meta_atingida || false,
        total_vendas_semestre: 0,
        total_faturamento_semestre: 0,
        media_conversao_semestre: 0,
        ranking_geral: 0,
        ranking_mes: 0
      })) || [];

      // Calcular rankings para o período
      vendedoresFormatados.forEach((vendedor, index) => {
        vendedor.ranking_geral = index + 1;
        vendedor.ranking_mes = index + 1;
      });

      return NextResponse.json({
        success: true,
        data: vendedoresFormatados,
        meta: {
          total: vendedoresFormatados.length,
          periodo: periodo,
          mock: false
        }
      });
    }
    
    // Buscar dados da view dashboard_vendedores (comportamento padrão)
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.nome || !body.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: vendedor, error } = await supabase
      .from('vendedores')
      .update({
        nome: body.nome,
        email: body.email,
        telefone: body.telefone || null,
        foto_url: body.foto_url || null,
        nivel: body.nivel || 'iniciante',
        meta_mensal: body.meta_mensal || 30000,
        comissao_percentual: body.comissao_percentual || 2.5,
        status: body.status || 'ativo',
        especialidades: body.especialidades || []
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar vendedor:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar vendedor', details: error.message },
        { status: 500 }
      );
    }

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendedor,
      message: 'Vendedor atualizado com sucesso'
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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      );
    }

    const { data: vendedor, error } = await supabase
      .from('vendedores')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao deletar vendedor:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar vendedor', details: error.message },
        { status: 500 }
      );
    }

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vendedor removido com sucesso'
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