import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Teste simples - buscar dados que existem
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      return NextResponse.json({ 
        error: 'Erro na conexão',
        details: error.message 
      });
    }

    // Verificar se tabelas existem
    const tableNames = tables?.map(t => t.table_name) || [];
    const requiredTables = ['veiculos', 'categorias', 'classes_config', 'loja_info'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));

    return NextResponse.json({
      success: true,
      database_status: {
        tables_found: tableNames,
        required_tables: requiredTables,
        missing_tables: missingTables,
        ready: missingTables.length === 0
      }
    });

  } catch (error) {
    console.error('Dashboard simple error:', error);
    return NextResponse.json({ 
      error: 'Erro no dashboard',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}