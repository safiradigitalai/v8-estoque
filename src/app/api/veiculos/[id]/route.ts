import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import type { UpdateVeiculoRequest, VeiculoDetalhe } from '@/types/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do veículo inválido' },
        { status: 400 }
      );
    }

    // Buscar veículo com detalhes completos
    const { data: veiculo, error } = await supabase
      .from('veiculos')
      .select(`
        *,
        categorias!inner(id, nome, slug, icone),
        veiculo_fotos(id, url, tipo, ordem, url_thumb, url_medium)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Veículo não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Processar dados para resposta
    const veiculoDetalhe: VeiculoDetalhe = {
      ...veiculo,
      categoria: veiculo.categorias,
      fotos: veiculo.veiculo_fotos?.sort((a: { tipo: string; ordem: number }, b: { tipo: string; ordem: number }) => {
        // Foto principal primeiro, depois por ordem
        if (a.tipo === 'principal') return -1;
        if (b.tipo === 'principal') return 1;
        return a.ordem - b.ordem;
      }) || []
    };

    return NextResponse.json({ 
      success: true, 
      data: veiculoDetalhe 
    });

  } catch (error) {
    console.error('Get veículo error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar veículo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body: UpdateVeiculoRequest = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do veículo inválido' },
        { status: 400 }
      );
    }

    // Se o valor foi alterado, recalcular classe social
    const updateData: UpdateVeiculoRequest & { classe_social?: string; atualizado_em?: string } = { ...body };
    
    if (body.valor !== undefined) {
      const classeConfig = await supabase
        .from('classes_config')
        .select('*')
        .single();

      if (classeConfig.data) {
        const { classe_a_min, classe_b_min, classe_c_min } = classeConfig.data;
        let classeSocial = 'D';
        if (body.valor >= classe_a_min) classeSocial = 'A';
        else if (body.valor >= classe_b_min) classeSocial = 'B';
        else if (body.valor >= classe_c_min) classeSocial = 'C';
        
        updateData.classe_social = classeSocial;
      }
    }

    // Se status mudou para vendido, definir data_venda
    if (body.status === 'vendido' && !body.data_venda) {
      updateData.data_venda = new Date().toISOString().split('T')[0];
    }

    // Se status mudou de vendido para outro, limpar data_venda
    if (body.status && body.status !== 'vendido') {
      updateData.data_venda = undefined;
    }

    // Adicionar timestamp de atualização
    updateData.atualizado_em = new Date().toISOString();

    const { data: veiculo, error } = await supabase
      .from('veiculos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Veículo não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data: veiculo,
      message: 'Veículo atualizado com sucesso'
    });

  } catch (error) {
    console.error('Update veículo error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao atualizar veículo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do veículo inválido' },
        { status: 400 }
      );
    }

    // Verificar se veículo existe
    const { data: exists } = await supabase
      .from('veiculos')
      .select('id')
      .eq('id', id)
      .single();

    if (!exists) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Deletar veículo (fotos serão deletadas automaticamente por CASCADE)
    const { error } = await supabase
      .from('veiculos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Veículo deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete veículo error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao deletar veículo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}