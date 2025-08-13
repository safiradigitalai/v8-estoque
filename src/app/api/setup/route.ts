import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client com service role para operações administrativas
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'create-tables') {
      // Criar tabelas uma por vez
      await createTables();
      return NextResponse.json({ success: true, message: 'Tables created successfully' });
    }
    
    if (action === 'seed-data') {
      await seedData();
      return NextResponse.json({ success: true, message: 'Data seeded successfully' });
    }
    
    if (action === 'verify') {
      const verification = await verifySetup();
      return NextResponse.json({ success: true, data: verification });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

async function createTables() {
  // Configuração da loja
  await supabaseAdmin.from('loja_info').upsert({
    id: 1,
    nome: 'V8 System Estoque',
    cnpj: '12345678000199',
    telefone: '(11) 99999-9999',
    email: 'contato@v8system.com.br',
    endereco: 'Rua das Montadoras, 123',
    cidade: 'São Paulo',
    estado: 'SP'
  });

  // Configuração das classes
  await supabaseAdmin.from('classes_config').upsert({
    id: 1,
    classe_a_min: 80000,
    classe_b_min: 40000,
    classe_c_min: 20000,
    classe_d_max: 19999
  });

  // Categorias
  const categorias = [
    { nome: 'Hatch', slug: 'hatch', icone: '🚗', ordem: 1 },
    { nome: 'Sedan', slug: 'sedan', icone: '🚙', ordem: 2 },
    { nome: 'SUV', slug: 'suv', icone: '🚐', ordem: 3 },
    { nome: 'Picape', slug: 'picape', icone: '🛻', ordem: 4 },
    { nome: 'Utilitário', slug: 'utilitario', icone: '🚚', ordem: 5 },
    { nome: 'Esportivo', slug: 'esportivo', icone: '🏎️', ordem: 6 },
    { nome: 'Conversível', slug: 'conversivel', icone: '🏁', ordem: 7 }
  ];

  for (const categoria of categorias) {
    await supabaseAdmin.from('categorias').upsert(categoria);
  }
}

async function seedData() {
  // Buscar IDs das categorias
  const { data: categorias } = await supabaseAdmin.from('categorias').select('id, slug');
  const catMap = categorias?.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, number>) || {};

  // Veículos de exemplo
  const veiculos = [
    // CLASSE A (Acima de R$ 80k)
    {
      marca: 'BMW',
      modelo: 'X5 xDrive30d',
      ano: 2023,
      valor: 450000,
      categoria_id: catMap.suv,
      km: 15000,
      cor: 'Preto',
      combustivel: 'diesel',
      cambio: 'automatico',
      portas: 5,
      placa: 'ABC1234',
      codigo_interno: 'BMW001',
      observacoes: 'SUV premium, revisões em dia'
    },
    {
      marca: 'Mercedes-Benz',
      modelo: 'C300 AMG',
      ano: 2022,
      valor: 320000,
      categoria_id: catMap.sedan,
      km: 25000,
      cor: 'Prata',
      combustivel: 'gasolina',
      cambio: 'automatico',
      portas: 4,
      placa: 'DEF5678',
      codigo_interno: 'MB001',
      observacoes: 'Sedan esportivo, impecável'
    },
    {
      marca: 'Audi',
      modelo: 'A4 Avant',
      ano: 2023,
      valor: 280000,
      categoria_id: catMap.sedan,
      km: 8000,
      cor: 'Branco',
      combustivel: 'flex',
      cambio: 'automatico',
      portas: 4,
      placa: 'GHI9012',
      codigo_interno: 'AUDI001',
      observacoes: 'Perfeito estado, único dono'
    },
    {
      marca: 'Porsche',
      modelo: '911 Carrera',
      ano: 2021,
      valor: 850000,
      categoria_id: catMap.esportivo,
      km: 12000,
      cor: 'Amarelo',
      combustivel: 'gasolina',
      cambio: 'automatico',
      portas: 2,
      placa: 'JKL3456',
      codigo_interno: 'POR001',
      observacoes: 'Esportivo icônico'
    },
    
    // CLASSE B (R$ 40k - R$ 80k)
    {
      marca: 'Toyota',
      modelo: 'Corolla Altis',
      ano: 2022,
      valor: 65000,
      categoria_id: catMap.sedan,
      km: 35000,
      cor: 'Prata',
      combustivel: 'flex',
      cambio: 'cvt',
      portas: 4,
      placa: 'MNO7890',
      codigo_interno: 'TOY001',
      observacoes: 'Híbrido, economia excepcional'
    },
    {
      marca: 'Honda',
      modelo: 'Civic Touring',
      ano: 2023,
      valor: 75000,
      categoria_id: catMap.sedan,
      km: 18000,
      cor: 'Preto',
      combustivel: 'flex',
      cambio: 'cvt',
      portas: 4,
      placa: 'PQR1234',
      codigo_interno: 'HON001',
      observacoes: 'Sedã premium nacional'
    },
    {
      marca: 'Volkswagen',
      modelo: 'Tiguan Allspace',
      ano: 2022,
      valor: 78000,
      categoria_id: catMap.suv,
      km: 28000,
      cor: 'Cinza',
      combustivel: 'flex',
      cambio: 'automatico',
      portas: 5,
      placa: 'STU5678',
      codigo_interno: 'VW001',
      observacoes: 'SUV familiar, 7 lugares'
    },
    {
      marca: 'Nissan',
      modelo: 'Frontier LE',
      ano: 2023,
      valor: 72000,
      categoria_id: catMap.picape,
      km: 22000,
      cor: 'Vermelho',
      combustivel: 'diesel',
      cambio: 'automatico',
      portas: 4,
      placa: 'VWX9012',
      codigo_interno: 'NIS001',
      observacoes: 'Picape robusta, 4x4'
    },
    
    // CLASSE C (R$ 20k - R$ 40k)
    {
      marca: 'Chevrolet',
      modelo: 'Onix Premier',
      ano: 2021,
      valor: 38000,
      categoria_id: catMap.hatch,
      km: 45000,
      cor: 'Branco',
      combustivel: 'flex',
      cambio: 'automatico',
      portas: 4,
      placa: 'YZA3456',
      codigo_interno: 'CHE001',
      observacoes: 'Hatch completo, econômico'
    },
    {
      marca: 'Hyundai',
      modelo: 'HB20S Evolution',
      ano: 2022,
      valor: 35000,
      categoria_id: catMap.sedan,
      km: 32000,
      cor: 'Azul',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 4,
      placa: 'BCD7890',
      codigo_interno: 'HYU001',
      observacoes: 'Sedã compacto, bem cuidado'
    },
    {
      marca: 'Ford',
      modelo: 'EcoSport Titanium',
      ano: 2020,
      valor: 32000,
      categoria_id: catMap.suv,
      km: 55000,
      cor: 'Cinza',
      combustivel: 'flex',
      cambio: 'automatico',
      portas: 5,
      placa: 'EFG1234',
      codigo_interno: 'FOR001',
      observacoes: 'SUV compacto urbano'
    },
    {
      marca: 'Renault',
      modelo: 'Duster Intense',
      ano: 2021,
      valor: 36000,
      categoria_id: catMap.suv,
      km: 48000,
      cor: 'Verde',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 5,
      placa: 'HIJ5678',
      codigo_interno: 'REN001',
      observacoes: 'SUV aventureiro, 4x4'
    },
    
    // CLASSE D (Até R$ 20k)
    {
      marca: 'Volkswagen',
      modelo: 'Gol 1.0',
      ano: 2018,
      valor: 18000,
      categoria_id: catMap.hatch,
      km: 78000,
      cor: 'Branco',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 4,
      placa: 'KLM9012',
      codigo_interno: 'VW002',
      observacoes: 'Econômico, ideal primeiro carro'
    },
    {
      marca: 'Fiat',
      modelo: 'Uno Attractive',
      ano: 2019,
      valor: 16500,
      categoria_id: catMap.hatch,
      km: 65000,
      cor: 'Prata',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 4,
      placa: 'NOP3456',
      codigo_interno: 'FIA001',
      observacoes: 'Compacto urbano'
    },
    {
      marca: 'Ford',
      modelo: 'Ka SE 1.0',
      ano: 2017,
      valor: 19500,
      categoria_id: catMap.hatch,
      km: 85000,
      cor: 'Azul',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 4,
      placa: 'QRS7890',
      codigo_interno: 'FOR002',
      observacoes: 'Ágil e econômico'
    },
    {
      marca: 'Chevrolet',
      modelo: 'Celta LT',
      ano: 2016,
      valor: 15000,
      categoria_id: catMap.hatch,
      km: 92000,
      cor: 'Vermelho',
      combustivel: 'flex',
      cambio: 'manual',
      portas: 4,
      placa: 'TUV1234',
      codigo_interno: 'CHE002',
      observacoes: 'Básico e confiável'
    }
  ];

  // Calcular classe social para cada veículo
  const veiculosComClasse = veiculos.map(veiculo => ({
    ...veiculo,
    classe_social: veiculo.valor >= 80000 ? 'A' : 
                  veiculo.valor >= 40000 ? 'B' :
                  veiculo.valor >= 20000 ? 'C' : 'D'
  }));

  // Inserir veículos
  for (const veiculo of veiculosComClasse) {
    await supabaseAdmin.from('veiculos').upsert(veiculo);
  }

  // Simular algumas vendas
  await supabaseAdmin.from('veiculos')
    .update({ 
      status: 'vendido', 
      data_venda: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    .in('codigo_interno', ['CHE002', 'FOR002']);

  await supabaseAdmin.from('veiculos')
    .update({ status: 'reservado' })
    .in('codigo_interno', ['BMW001', 'TOY001']);
}

async function verifySetup() {
  const { data: categorias } = await supabaseAdmin.from('categorias').select('*');
  const { data: veiculos } = await supabaseAdmin.from('veiculos').select('*');
  const { data: loja } = await supabaseAdmin.from('loja_info').select('*').single();
  
  const byClass = veiculos?.reduce((acc, v) => {
    acc[v.classe_social] = (acc[v.classe_social] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    categorias: categorias?.length || 0,
    veiculos: veiculos?.length || 0,
    loja_configurada: !!loja,
    distribuicao_classes: byClass
  };
}