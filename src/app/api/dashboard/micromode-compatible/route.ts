import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { calculateCompatibleStats } from '@/lib/micromode-compatibility';
import type { DashboardResponse } from '@/types/api';

// Versão do dashboard compatível com MicroMode
export async function GET() {
  try {
    // Query principal para dashboard - dados hierárquicos (incluindo negociando)
    const { data: hierarquiaData, error: hierarquiaError } = await supabase
      .from('veiculos')
      .select(`
        marca,
        valor,
        classe_social,
        status,
        categorias!inner(nome, slug, icone, ordem)
      `)
      .in('status', ['disponivel', 'reservado', 'negociando']) // Incluir negociando
      .order('marca', { ascending: true })
      .returns<Array<{
        marca: string;
        valor: number;
        classe_social: string;
        status: string;
        categorias: {
          nome: string;
          slug: string;
          icone: string;
          ordem: number;
        };
      }>>();

    if (hierarquiaError) throw hierarquiaError;

    // Query para resumo executivo (incluindo negociando)
    const { data: resumoData, error: resumoError } = await supabase
      .from('veiculos')
      .select('valor, status')
      .neq('status', 'vendido');

    if (resumoError) throw resumoError;

    // Query para contadores por status (incluindo negociando)
    const { data: statusData, error: statusError } = await supabase
      .from('veiculos')
      .select('status')
      .neq('status', 'vendido');

    if (statusError) throw statusError;

    // Processar dados do resumo
    const totalVeiculos = resumoData?.length || 0;
    const valorTotal = resumoData?.reduce((sum, v) => sum + (v.valor || 0), 0) || 0;
    const valorMedio = totalVeiculos > 0 ? valorTotal / totalVeiculos : 0;

    // Calcular estatísticas compatíveis com MicroMode
    const statsCompativeis = calculateCompatibleStats(statusData || []);

    // Para compatibilidade com Overview, incluir negociando em reservado
    const porStatusLegado = {
      disponivel: statsCompativeis.disponivel,
      reservado: statsCompativeis.reservado, // Já inclui negociando
      vendido: statsCompativeis.vendido
    };

    // Adicionar estatísticas separadas para MicroMode
    const porStatusMicroMode = {
      disponivel: statsCompativeis.disponivel,
      reservado: statsCompativeis.reservado - statsCompativeis.negociando, // Reservado real
      negociando: statsCompativeis.negociando,
      vendido: statsCompativeis.vendido
    };

    // Processar hierarquia: Marca → Categoria → Classe Social
    const hierarquiaMap = new Map<string, {
      marca: string;
      total_veiculos: number;
      valor_total: number;
      categorias: Map<string, {
        nome: string;
        slug: string;
        icone: string;
        total_veiculos: number;
        valor_total: number;
        classes: Record<'A' | 'B' | 'C' | 'D', {
          quantidade: number;
          valor: number;
          percentual: number;
        }>;
      }>;
    }>();

    hierarquiaData?.forEach((item) => {
      const marca = item.marca;
      const categoria = item.categorias;
      const classe = item.classe_social;
      const valor = item.valor;

      // Inicializar marca se não existir
      if (!hierarquiaMap.has(marca)) {
        hierarquiaMap.set(marca, {
          marca,
          total_veiculos: 0,
          valor_total: 0,
          categorias: new Map()
        });
      }

      const marcaData = hierarquiaMap.get(marca)!;
      marcaData.total_veiculos++;
      marcaData.valor_total += valor;

      // Inicializar categoria se não existir
      const catKey = categoria.slug;
      if (!marcaData.categorias.has(catKey)) {
        marcaData.categorias.set(catKey, {
          nome: categoria.nome,
          slug: categoria.slug,
          icone: categoria.icone,
          total_veiculos: 0,
          valor_total: 0,
          classes: {
            A: { quantidade: 0, valor: 0, percentual: 0 },
            B: { quantidade: 0, valor: 0, percentual: 0 },
            C: { quantidade: 0, valor: 0, percentual: 0 },
            D: { quantidade: 0, valor: 0, percentual: 0 }
          }
        });
      }

      const catData = marcaData.categorias.get(catKey)!;
      catData.total_veiculos++;
      catData.valor_total += valor;
      catData.classes[classe as keyof typeof catData.classes].quantidade++;
      catData.classes[classe as keyof typeof catData.classes].valor += valor;
    });

    // Converter Maps para Arrays e calcular percentuais
    const hierarquia = Array.from(hierarquiaMap.values()).map(marca => {
      const categorias = Array.from(marca.categorias.values()).map((cat) => {
        // Calcular percentuais das classes
        Object.keys(cat.classes).forEach(classe => {
          const classData = cat.classes[classe as keyof typeof cat.classes];
          classData.percentual = cat.total_veiculos > 0 
            ? (classData.quantidade / cat.total_veiculos) * 100 
            : 0;
        });

        return cat;
      });

      return {
        ...marca,
        categorias: categorias.sort((a, b) => a.nome.localeCompare(b.nome))
      };
    }).sort((a, b) => b.valor_total - a.valor_total);

    // Resposta compatível com Overview + dados extras para MicroMode
    const response: DashboardResponse & {
      micromode?: {
        por_status: typeof porStatusMicroMode;
        stats_detalhadas: typeof statsCompativeis;
      }
    } = {
      resumo: {
        total_veiculos: totalVeiculos,
        valor_total: valorTotal,
        valor_medio: valorMedio,
        ultima_atualizacao: new Date().toISOString(),
        por_status: porStatusLegado // Compatibilidade com Overview
      },
      hierarquia,
      // Dados extras para MicroMode
      micromode: {
        por_status: porStatusMicroMode,
        stats_detalhadas: statsCompativeis
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Dashboard MicroMode error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao carregar dashboard compatível',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}