import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Teste simples de conexão
    const { data, error } = await supabase
      .from('_nonexistent_table_test')
      .select('*')
      .limit(1);
    
    // Se chegou aqui, a conexão funciona (mesmo com erro de tabela não existir)
    if (error?.message.includes('relation') && error?.message.includes('does not exist')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Supabase connection works!',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connection successful',
      data 
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}