import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// API para limpeza automática de reservas vencidas
// Esta API deve ser chamada periodicamente (ex: via cron job)
export async function POST() {
  try {
    console.log('🧹 Iniciando limpeza de reservas vencidas...');

    // Buscar reservas vencidas
    const agora = new Date().toISOString();
    
    const { data: reservasVencidas, error: buscaError } = await supabase
      .from('veiculos')
      .select('id, marca, modelo, vendedor_id, data_liberacao_reserva')
      .eq('status', 'reservado')
      .lt('data_liberacao_reserva', agora);

    if (buscaError) throw buscaError;

    if (!reservasVencidas || reservasVencidas.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma reserva vencida encontrada',
        reservas_liberadas: 0
      });
    }

    console.log(`📋 Encontradas ${reservasVencidas.length} reservas vencidas`);

    // Liberar todas as reservas vencidas
    const idsVencidos = reservasVencidas.map(r => r.id);
    
    const { data: veiculosLiberados, error: updateError } = await supabase
      .from('veiculos')
      .update({
        status: 'disponivel',
        vendedor_id: null,
        data_reserva: null,
        data_liberacao_reserva: null
      })
      .in('id', idsVencidos)
      .select('id, marca, modelo');

    if (updateError) throw updateError;

    // Log detalhado das liberações
    const liberacoes = reservasVencidas.map(reserva => ({
      veiculo_id: reserva.id,
      veiculo: `${reserva.marca} ${reserva.modelo}`,
      vendedor_id: reserva.vendedor_id,
      data_vencimento: reserva.data_liberacao_reserva
    }));

    console.log('🚗 Veículos liberados:', liberacoes);

    // Registrar log da operação
    const { error: logError } = await supabase
      .from('sistema_logs')
      .insert({
        tipo: 'cleanup_reservas',
        descricao: `${reservasVencidas.length} reservas vencidas foram liberadas automaticamente`,
        dados: {
          reservas_liberadas: liberacoes,
          timestamp: agora
        }
      });

    if (logError) {
      console.warn('⚠️ Erro ao registrar log:', logError);
    }

    return NextResponse.json({
      success: true,
      message: `${reservasVencidas.length} reservas vencidas foram liberadas`,
      reservas_liberadas: reservasVencidas.length,
      veiculos_liberados: liberacoes
    });

  } catch (error) {
    console.error('❌ Erro na limpeza de reservas:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro na limpeza de reservas vencidas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// GET para verificar status das reservas (monitoramento)
export async function GET() {
  try {
    const agora = new Date().toISOString();

    // Buscar estatísticas das reservas
    const { data: stats, error } = await supabase
      .from('veiculos')
      .select('status, data_liberacao_reserva, vendedor_id')
      .eq('status', 'reservado');

    if (error) throw error;

    const reservasAtivas = stats?.length || 0;
    const reservasVencidas = stats?.filter(r => 
      r.data_liberacao_reserva && r.data_liberacao_reserva < agora
    ).length || 0;
    const reservasValidas = reservasAtivas - reservasVencidas;

    // Próximas reservas a vencer (próximas 24h)
    const proximaVence = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const proximasVencer = stats?.filter(r => 
      r.data_liberacao_reserva && 
      r.data_liberacao_reserva > agora && 
      r.data_liberacao_reserva < proximaVence
    ).length || 0;

    return NextResponse.json({
      success: true,
      estatisticas: {
        reservas_ativas: reservasAtivas,
        reservas_validas: reservasValidas,
        reservas_vencidas: reservasVencidas,
        proximas_vencer_24h: proximasVencer,
        timestamp: agora
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status das reservas:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao verificar reservas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}