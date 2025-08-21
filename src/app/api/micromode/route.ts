import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Interface para as ações do MicroMode
interface MicroModeAction {
  action: 'reservar' | 'negociar' | 'vender' | 'liberar' | 'cancelar';
  veiculo_id: number;
  vendedor_id: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: MicroModeAction = await request.json();
    const { action, veiculo_id, vendedor_id } = body;

    // Buscar configurações do sistema
    const { data: config } = await supabase
      .from('vendedores_config')
      .select('reserva_veiculo_dias, pontos_por_venda')
      .single();

    const diasReserva = config?.reserva_veiculo_dias || 3;
    const pontosPorVenda = config?.pontos_por_venda || 100;

    let updateData: any = {};
    let vendedorUpdate: any = null;
    let responseMessage = '';

    switch (action) {
      case 'reservar':
        // Reservar veículo por X dias
        updateData = {
          status: 'reservado',
          vendedor_id: vendedor_id,
          data_reserva: new Date().toISOString(),
          data_liberacao_reserva: new Date(Date.now() + diasReserva * 24 * 60 * 60 * 1000).toISOString()
        };
        responseMessage = `Veículo reservado por ${diasReserva} dias`;
        break;

      case 'negociar':
        // Marcar como negociando
        updateData = {
          status: 'negociando',
          vendedor_id: vendedor_id,
          data_inicio_negociacao: new Date().toISOString()
        };
        responseMessage = 'Veículo marcado como negociando';
        break;

      case 'vender':
        // Finalizar venda - AUTOMAÇÃO PRINCIPAL
        updateData = {
          status: 'vendido',
          data_venda: new Date().toISOString(),
          vendedor_venda: vendedor_id
        };

        // Atualizar pontuação do vendedor
        const { data: vendedor } = await supabase
          .from('vendedores')
          .select('pontuacao')
          .eq('id', vendedor_id)
          .single();

        if (vendedor) {
          vendedorUpdate = {
            pontuacao: (vendedor.pontuacao || 0) + pontosPorVenda
          };
        }

        responseMessage = `Venda finalizada! +${pontosPorVenda} pontos`;
        break;

      case 'liberar':
        // Liberar reserva/negociação
        updateData = {
          status: 'disponivel',
          vendedor_id: null,
          data_reserva: null,
          data_liberacao_reserva: null,
          data_inicio_negociacao: null
        };
        responseMessage = 'Veículo liberado para outros vendedores';
        break;

      case 'cancelar':
        // Cancelar negociação
        updateData = {
          status: 'disponivel',
          vendedor_id: null,
          data_inicio_negociacao: null
        };
        responseMessage = 'Negociação cancelada';
        break;

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        );
    }

    // Atualizar veículo
    const { data: veiculo, error: veiculoError } = await supabase
      .from('veiculos')
      .update(updateData)
      .eq('id', veiculo_id)
      .select()
      .single();

    if (veiculoError) throw veiculoError;

    // Atualizar vendedor se necessário
    if (vendedorUpdate) {
      const { error: vendedorError } = await supabase
        .from('vendedores')
        .update(vendedorUpdate)
        .eq('id', vendedor_id);

      if (vendedorError) {
        console.error('Erro ao atualizar vendedor:', vendedorError);
      }

      // Registrar a venda nas métricas
      if (action === 'vender') {
        const periodo = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const { data: metricaExistente } = await supabase
          .from('vendedor_metricas')
          .select('*')
          .eq('vendedor_id', vendedor_id)
          .eq('periodo', periodo)
          .single();

        if (metricaExistente) {
          // Atualizar métrica existente
          await supabase
            .from('vendedor_metricas')
            .update({
              veiculos_vendidos: metricaExistente.veiculos_vendidos + 1,
              valor_vendas: metricaExistente.valor_vendas + veiculo.valor,
              pontos_ganhos: metricaExistente.pontos_ganhos + pontosPorVenda
            })
            .eq('id', metricaExistente.id);
        } else {
          // Criar nova métrica
          await supabase
            .from('vendedor_metricas')
            .insert({
              vendedor_id,
              periodo,
              veiculos_vendidos: 1,
              valor_vendas: veiculo.valor,
              pontos_ganhos: pontosPorVenda,
              leads_recebidos: 0,
              leads_convertidos: 1
            });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      veiculo: veiculo,
      pontos_ganhos: action === 'vender' ? pontosPorVenda : 0
    });

  } catch (error) {
    console.error('Erro no MicroMode:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// API para buscar veículos organizados por marca (Kanban)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendedorId = searchParams.get('vendedor_id');

    // Buscar veículos com informações organizadas
    const { data: veiculos, error } = await supabase
      .from('veiculos')
      .select(`
        id,
        marca,
        modelo,
        ano,
        valor,
        status,
        classe_social,
        vendedor_id,
        data_reserva,
        data_liberacao_reserva,
        data_inicio_negociacao,
        categorias!inner(nome, slug, icone)
      `)
      .in('status', ['disponivel', 'reservado', 'negociando'])
      .order('marca', { ascending: true })
      .order('valor', { ascending: false });

    if (error) throw error;

    // Buscar vendedores separadamente para evitar conflito de relacionamentos
    const vendedorIds = veiculos?.filter(v => v.vendedor_id).map(v => v.vendedor_id) || [];
    let vendedoresMap: Record<number, string> = {};
    
    if (vendedorIds.length > 0) {
      const { data: vendedores } = await supabase
        .from('vendedores')
        .select('id, nome')
        .in('id', vendedorIds);
      
      vendedoresMap = vendedores?.reduce((acc, v) => ({ ...acc, [v.id]: v.nome }), {}) || {};
    }

    // Organizar por marca
    const kanbanData = veiculos?.reduce((acc: any, veiculo: any) => {
      const marca = veiculo.marca;
      
      if (!acc[marca]) {
        acc[marca] = {
          id: marca.toLowerCase().replace(/\s+/g, '-'),
          titulo: marca.toUpperCase(),
          marca: marca,
          icone: veiculo.categorias?.icone || '🚗',
          veiculos: []
        };
      }

      // Calcular dias restantes para reserva
      let diasRestantes = null;
      if (veiculo.status === 'reservado' && veiculo.data_liberacao_reserva) {
        const agora = new Date();
        const liberacao = new Date(veiculo.data_liberacao_reserva);
        diasRestantes = Math.max(0, Math.ceil((liberacao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)));
      }

      acc[marca].veiculos.push({
        ...veiculo,
        categoria: veiculo.categorias?.nome,
        vendedor_nome: veiculo.vendedor_id ? vendedoresMap[veiculo.vendedor_id] : null,
        dias_restantes: diasRestantes
      });

      return acc;
    }, {});

    // Converter para array
    const columns = Object.values(kanbanData || {});

    return NextResponse.json({
      success: true,
      columns,
      vendedor_id: vendedorId ? parseInt(vendedorId) : null
    });

  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao carregar veículos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}