import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { FiltersResponse } from '@/types/api';

export async function GET() {
  try {
    // Buscar todas as marcas únicas com contadores
    const { data: marcasData, error: marcasError } = await supabase
      .from('veiculos')
      .select('marca')
      .neq('status', 'vendido');

    if (marcasError) throw marcasError;

    // Buscar categorias com contadores
    const { data: categoriasData, error: categoriasError } = await supabase
      .from('categorias')
      .select(`
        id, nome, slug, icone,
        veiculos!inner(id)
      `)
      .neq('veiculos.status', 'vendido');

    if (categoriasError) throw categoriasError;

    // Buscar dados para ranges e classes
    const { data: rangesData, error: rangesError } = await supabase
      .from('veiculos')
      .select('valor, ano, classe_social')
      .neq('status', 'vendido');

    if (rangesError) throw rangesError;

    // Processar marcas
    const marcasMap = new Map<string, number>();
    marcasData?.forEach(item => {
      const marca = item.marca;
      marcasMap.set(marca, (marcasMap.get(marca) || 0) + 1);
    });

    const marcas = Array.from(marcasMap.entries())
      .map(([nome, count]) => ({ nome, count }))
      .sort((a, b) => b.count - a.count);

    // Processar categorias
    const categoriasMap = new Map<number, {
      id: number;
      nome: string;
      slug: string;
      icone: string;
      count: number;
    }>();
    categoriasData?.forEach(item => {
      if (!categoriasMap.has(item.id)) {
        categoriasMap.set(item.id, {
          id: item.id,
          nome: item.nome,
          slug: item.slug,
          icone: item.icone,
          count: 0
        });
      }
      if (item.veiculos) {
        categoriasMap.get(item.id)!.count++;
      }
    });

    const categorias = Array.from(categoriasMap.values())
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count);

    // Processar classes sociais
    const classesMap = new Map<string, { count: number; valores: number[] }>();
    rangesData?.forEach(item => {
      const classe = item.classe_social;
      if (!classesMap.has(classe)) {
        classesMap.set(classe, { count: 0, valores: [] });
      }
      const classData = classesMap.get(classe)!;
      classData.count++;
      classData.valores.push(item.valor);
    });

    const classes: Record<'A' | 'B' | 'C' | 'D', {
      count: number;
      valor_min: number;
      valor_max: number;
      valor_medio: number;
    }> = {
      A: { count: 0, valor_min: 0, valor_max: 0, valor_medio: 0 },
      B: { count: 0, valor_min: 0, valor_max: 0, valor_medio: 0 },
      C: { count: 0, valor_min: 0, valor_max: 0, valor_medio: 0 },
      D: { count: 0, valor_min: 0, valor_max: 0, valor_medio: 0 }
    };

    classesMap.forEach((data, classe) => {
      if (classe in classes) {
        classes[classe as keyof typeof classes] = {
          count: data.count,
          valor_min: data.valores.length > 0 ? Math.min(...data.valores) : 0,
          valor_max: data.valores.length > 0 ? Math.max(...data.valores) : 0,
          valor_medio: data.valores.length > 0 ? data.valores.reduce((sum, val) => sum + val, 0) / data.valores.length : 0
        };
      }
    });

    // Calcular ranges globais
    const valores = rangesData?.map(item => item.valor) || [];
    const anos = rangesData?.map(item => item.ano) || [];

    const valorRange = {
      min: valores.length > 0 ? Math.min(...valores) : 0,
      max: valores.length > 0 ? Math.max(...valores) : 0
    };

    const anoRange = {
      min: anos.length > 0 ? Math.min(...anos) : new Date().getFullYear(),
      max: anos.length > 0 ? Math.max(...anos) : new Date().getFullYear()
    };

    const response: FiltersResponse = {
      marcas,
      categorias,
      classes,
      valor_range: valorRange,
      ano_range: anoRange
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Filters error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao carregar filtros',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}