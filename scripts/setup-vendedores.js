#!/usr/bin/env node

/**
 * Script para configurar o módulo de vendedores no banco de dados
 * Executa: node scripts/setup-vendedores.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQLFile(filePath, description) {
  try {
    console.log(`\n📄 Executando: ${description}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Dividir em comandos separados (por ';' no final da linha)
    const commands = sql
      .split(/;\s*\n/)
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_command: command });
        
        if (error) {
          // Alguns erros são esperados (tabela já existe, etc.)
          if (error.message.includes('already exists') || 
              error.message.includes('já existe') ||
              error.message.includes('duplicate')) {
            console.log(`⚠️  Aviso: ${error.message.split('\n')[0]}`);
          } else {
            console.error(`❌ Erro executando comando: ${error.message}`);
            console.error(`Comando: ${command.substring(0, 100)}...`);
          }
        }
      }
    }
    
    console.log(`✅ ${description} concluído`);
    
  } catch (error) {
    console.error(`❌ Erro ao executar ${description}:`, error.message);
    throw error;
  }
}

async function setupVendedores() {
  console.log('🚀 Iniciando configuração do módulo de vendedores...\n');
  
  try {
    // 1. Executar schema de vendedores
    await executeSQLFile(
      path.join(__dirname, '../database/vendedores-schema.sql'),
      'Schema de vendedores e métricas'
    );
    
    // 2. Executar dados de exemplo
    await executeSQLFile(
      path.join(__dirname, '../database/vendedores-seed.sql'),
      'Dados de exemplo para vendedores'
    );
    
    // 3. Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas criadas...');
    
    const { data: vendedores, error: vendedoresError } = await supabase
      .from('vendedores')
      .select('count(*)')
      .single();
    
    if (vendedoresError) {
      console.log('⚠️  Tabela vendedores não encontrada - usando dados mock');
    } else {
      console.log(`✅ Tabela vendedores: ${vendedores?.count || 0} registros`);
    }
    
    const { data: metricas, error: metricasError } = await supabase
      .from('vendedores_metricas')
      .select('count(*)')
      .single();
    
    if (metricasError) {
      console.log('⚠️  Tabela vendedores_metricas não encontrada');
    } else {
      console.log(`✅ Tabela vendedores_metricas: ${metricas?.count || 0} registros`);
    }
    
    // 4. Testar a view dashboard_vendedores
    console.log('\n🔍 Testando view dashboard_vendedores...');
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboard_vendedores')
      .select('nome, pontuacao, ranking_geral')
      .limit(3);
    
    if (dashboardError) {
      console.log('⚠️  View dashboard_vendedores não disponível');
    } else {
      console.log('✅ View dashboard_vendedores funcionando:');
      dashboard?.forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.nome} - ${v.pontuacao} pts (Ranking #${v.ranking_geral})`);
      });
    }
    
    console.log('\n🎉 Configuração do módulo de vendedores concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Reinicie o servidor de desenvolvimento (npm run dev)');
    console.log('   2. Acesse o Overview → Tab "Equipe & Performance"');
    console.log('   3. Verifique se os dados estão sendo exibidos corretamente');
    
  } catch (error) {
    console.error('\n💥 Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

// Função auxiliar para SQL direto (fallback)
async function execSQLDirect(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql_command: sql });
  if (error) throw error;
  return data;
}

// Registrar função exec_sql se não existir
async function ensureExecSQLFunction() {
  try {
    await supabase.rpc('exec_sql', { sql_command: 'SELECT 1' });
  } catch (error) {
    console.log('📝 Criando função auxiliar exec_sql...');
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_command text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_command;
      END;
      $$;
    `;
    
    const { error: funcError } = await supabase.rpc('query', { sql: createFunctionSQL });
    if (funcError) {
      console.log('⚠️  Não foi possível criar função auxiliar, executando comandos diretamente');
    }
  }
}

// Executar setup
(async () => {
  await ensureExecSQLFunction();
  await setupVendedores();
})();