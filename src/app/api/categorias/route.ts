import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome, slug, icone')
      .order('nome', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao carregar categorias',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}