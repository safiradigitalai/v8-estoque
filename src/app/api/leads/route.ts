import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Interface para dados de leads
interface LeadData {
  resumo: {
    total_conversas: number;
    leads_ativos: number;
    conversoes_mes: number;
    taxa_resposta: number;
    tempo_medio_resposta: number;
    leads_novos_hoje: number;
  };
  leads?: Array<{
    id: string;
    nome: string;
    telefone: string;
    email?: string;
    status: string;
    origem: string;
    interesse: any;
    score: number;
    ultima_interacao: string;
    data_criacao: string;
    vendedor_responsavel?: string;
    observacoes?: string;
    tags: string[];
  }>;
}

export async function GET(request: NextRequest): Promise<NextResponse<LeadData | { error: string }>> {
  try {
    // Buscar dados da tabela de leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select(`
        *,
        vendedores (
          nome
        )
      `)
      .order('criado_em', { ascending: false });

    if (leadsError) {
      console.error('Erro ao buscar leads:', leadsError);
    }

    // Buscar conversas ativas do WhatsApp (mock data por enquanto)
    const conversasAtivas = 45;
    const leadsAtivos = leads?.filter(l => ['novo', 'qualificado', 'proposta', 'negociacao'].includes(l.status)).length || 28;
    const conversoesMes = leads?.filter(l => l.status === 'convertido' && 
      new Date(l.atualizado_em).getMonth() === new Date().getMonth()).length || 12;

    // Calcular métricas
    const resumo = {
      total_conversas: conversasAtivas,
      leads_ativos: leadsAtivos,
      conversoes_mes: conversoesMes,
      taxa_resposta: 85, // Mock data - implementar cálculo real
      tempo_medio_resposta: 8, // Mock data - implementar cálculo real
      leads_novos_hoje: leads?.filter(l => 
        new Date(l.criado_em).toDateString() === new Date().toDateString()).length || 5
    };

    // Processar dados dos leads
    const leadsProcessados = leads?.map(lead => ({
      id: lead.id,
      nome: lead.nome,
      telefone: lead.telefone,
      email: lead.email,
      status: lead.status,
      origem: lead.origem || 'whatsapp',
      interesse: {
        veiculo: lead.veiculo_interesse,
        categoria: lead.categoria_interesse,
        valor_max: lead.valor_maximo
      },
      score: lead.score || 50,
      ultima_interacao: calcularTempoRelativo(lead.atualizado_em),
      data_criacao: lead.criado_em,
      vendedor_responsavel: lead.vendedores?.nome,
      observacoes: lead.observacoes,
      tags: lead.tags ? JSON.parse(lead.tags) : []
    })) || [];

    // Adaptar response para compatibilidade com Overview tab
    const overviewData = {
      resumo: {
        total_leads: leads?.length || 0,
        leads_hoje: resumo.leads_novos_hoje,
        conversoes_total: resumo.conversoes_mes,
        conversoes_mes: resumo.conversoes_mes,
        taxa_conversao: Math.round(resumo.conversoes_mes / (leads?.length || 1) * 100),
        follow_ups_pendentes: leads?.filter(l => l.status === 'qualificado').length || 0
      },
      origens: [
        { nome: 'WhatsApp', cor: '#25D366', leads: resumo.total_conversas, conversoes: resumo.conversoes_mes, taxa_conversao: 35 },
        { nome: 'Site', cor: '#3B82F6', leads: Math.round(resumo.total_conversas * 0.3), conversoes: Math.round(resumo.conversoes_mes * 0.4), taxa_conversao: 28 },
        { nome: 'Indicação', cor: '#F59E0B', leads: Math.round(resumo.total_conversas * 0.2), conversoes: Math.round(resumo.conversoes_mes * 0.3), taxa_conversao: 45 }
      ],
      pipeline: [
        { etapa: 'Novos', cor: '#3B82F6', ordem: 1, quantidade: leads?.filter(l => l.status === 'novo').length || 0 },
        { etapa: 'Qualificados', cor: '#10B981', ordem: 2, quantidade: leads?.filter(l => l.status === 'qualificado').length || 0 },
        { etapa: 'Propostas', cor: '#F59E0B', ordem: 3, quantidade: leads?.filter(l => l.status === 'proposta').length || 0 },
        { etapa: 'Convertidos', cor: '#8B5CF6', ordem: 4, quantidade: leads?.filter(l => l.status === 'convertido').length || 0 }
      ],
      alertas: []
    };

    // Detectar se é uma chamada do Overview (baseado em user-agent ou header específico)
    const userAgent = request.headers.get('user-agent') || '';
    const isOverviewTab = request.url.includes('overview=true') || userAgent.includes('overview');

    if (isOverviewTab) {
      return NextResponse.json({
        success: true,
        data: overviewData
      });
    }

    // Retorno padrão para WhatsLeads module
    const response: LeadData = {
      resumo,
      leads: leadsProcessados
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro interno na API de leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean; data?: any; error?: string }>> {
  try {
    const body = await request.json();
    
    const {
      nome,
      telefone,
      email,
      origem = 'whatsapp',
      veiculo_interesse,
      categoria_interesse,
      valor_maximo,
      observacoes,
      vendedor_id
    } = body;

    // Validações básicas
    if (!nome || !telefone) {
      return NextResponse.json({
        success: false,
        error: 'Nome e telefone são obrigatórios'
      }, { status: 400 });
    }

    // Inserir novo lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email?.trim() || null,
        origem,
        status: 'novo',
        veiculo_interesse: veiculo_interesse?.trim() || null,
        categoria_interesse: categoria_interesse?.trim() || null,
        valor_maximo: valor_maximo ? parseFloat(valor_maximo) : null,
        observacoes: observacoes?.trim() || null,
        vendedor_id: vendedor_id ? parseInt(vendedor_id) : null,
        score: 50, // Score inicial padrão
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Erro ao inserir lead:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar lead'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: newLead
    });

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse<{ success: boolean; data?: any; error?: string }>> {
  try {
    const body = await request.json();
    
    const {
      id,
      nome,
      telefone,
      email,
      status,
      veiculo_interesse,
      categoria_interesse,
      valor_maximo,
      observacoes,
      vendedor_id,
      score
    } = body;

    // Validações básicas
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID do lead é obrigatório para edição'
      }, { status: 400 });
    }

    if (!nome || !telefone) {
      return NextResponse.json({
        success: false,
        error: 'Nome e telefone são obrigatórios'
      }, { status: 400 });
    }

    // Atualizar lead
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email?.trim() || null,
        status: status || 'novo',
        veiculo_interesse: veiculo_interesse?.trim() || null,
        categoria_interesse: categoria_interesse?.trim() || null,
        valor_maximo: valor_maximo ? parseFloat(valor_maximo) : null,
        observacoes: observacoes?.trim() || null,
        vendedor_id: vendedor_id ? parseInt(vendedor_id) : null,
        score: score ? parseInt(score) : null,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select('*')
      .single();

    if (updateError) {
      console.error('Erro ao atualizar lead:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao atualizar lead'
      }, { status: 500 });
    }

    if (!updatedLead) {
      return NextResponse.json({
        success: false,
        error: 'Lead não encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedLead
    });

  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função helper para calcular tempo relativo
function calcularTempoRelativo(dataString: string): string {
  const agora = new Date();
  const data = new Date(dataString);
  const diffMs = agora.getTime() - data.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}min atrás`;
  } else if (diffHoras < 24) {
    return `${diffHoras}h atrás`;
  } else if (diffDias === 1) {
    return 'Ontem';
  } else {
    return `${diffDias} dias atrás`;
  }
}