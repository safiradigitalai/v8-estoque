const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up V8 System database...\n');
    
    // Test connection
    console.log('📡 Testing connection...');
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && !error.message.includes('relation "_test" does not exist')) {
      throw error;
    }
    console.log('✅ Connection successful!\n');
    
    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Warning: ${error.message}`);
        }
      }
    }
    console.log('✅ Schema created successfully!\n');
    
    // Execute seed data
    console.log('🌱 Seeding initial data...');
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    const seedStatements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`⚠️  Seed warning: ${error.message}`);
        }
      }
    }
    console.log('✅ Seed data inserted successfully!\n');
    
    // Verify setup
    console.log('🔍 Verifying setup...');
    const { data: categorias } = await supabase.from('categorias').select('*');
    const { data: veiculos } = await supabase.from('veiculos').select('*');
    
    console.log(`📊 Found ${categorias?.length || 0} categories`);
    console.log(`🚗 Found ${veiculos?.length || 0} vehicles`);
    
    if (categorias?.length > 0) {
      console.log('\n📋 Categories:');
      categorias.forEach(cat => {
        console.log(`  ${cat.icone} ${cat.nome} (${cat.slug})`);
      });
    }
    
    if (veiculos?.length > 0) {
      console.log('\n🚗 Sample vehicles by class:');
      const byClass = veiculos.reduce((acc, v) => {
        acc[v.classe_social] = (acc[v.classe_social] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(byClass).forEach(([classe, count]) => {
        console.log(`  Classe ${classe}: ${count} vehicles`);
      });
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();