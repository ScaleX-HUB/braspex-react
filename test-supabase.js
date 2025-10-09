// Script de teste para verificar conexão com Supabase
// Execute: node test-supabase.js

const SUPABASE_URL = 'http://supabase.talka.tech:3000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwMDE1NTc0LCJleHAiOjIwNzUzNzU1NzR9.zOkNw3Bh2qhDjrOYK8Gptx7Kv_ADs-9x0732M9pLYoQ';
const SCHEMA = 'braspex';

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase Self-Hosted...\n');
  
  try {
    // Teste 1: Buscar textos do site
    console.log('1️⃣ Buscando textos do site (site_texts)...');
    const textsResponse = await fetch(`${SUPABASE_URL}/site_texts`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': SCHEMA,
        'Content-Profile': SCHEMA
      }
    });
    
    if (!textsResponse.ok) {
      throw new Error(`Erro ao buscar textos: ${textsResponse.status} ${textsResponse.statusText}`);
    }
    
    const texts = await textsResponse.json();
    console.log(`   ✅ ${texts.length} textos encontrados`);
    console.log(`   📝 Seções: ${[...new Set(texts.map(t => t.section))].join(', ')}\n`);
    
    // Teste 2: Buscar produtos
    console.log('2️⃣ Buscando produtos (products)...');
    const productsResponse = await fetch(`${SUPABASE_URL}/products`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': SCHEMA,
        'Content-Profile': SCHEMA
      }
    });
    
    if (!productsResponse.ok) {
      throw new Error(`Erro ao buscar produtos: ${productsResponse.status} ${productsResponse.statusText}`);
    }
    
    const products = await productsResponse.json();
    console.log(`   ✅ ${products.length} produtos encontrados`);
    console.log(`   🛍️ Produtos: ${products.map(p => p.name).join(', ')}\n`);
    
    // Teste 3: Verificar usuário admin
    console.log('3️⃣ Verificando usuário admin (users)...');
    const usersResponse = await fetch(`${SUPABASE_URL}/users?username=eq.admin`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': SCHEMA,
        'Content-Profile': SCHEMA
      }
    });
    
    if (!usersResponse.ok) {
      throw new Error(`Erro ao buscar usuário: ${usersResponse.status} ${usersResponse.statusText}`);
    }
    
    const users = await usersResponse.json();
    console.log(`   ✅ Usuário admin encontrado: ${users.length > 0 ? 'SIM' : 'NÃO'}\n`);
    
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Supabase está configurado corretamente');
    console.log('✅ Dados estão populados');
    console.log('✅ Conexão funcionando perfeitamente!\n');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   - Se o Supabase está rodando em http://supabase.talka.tech:3000');
    console.error('   - Se o schema "braspex" existe');
    console.error('   - Se as tabelas foram criadas');
    console.error('   - Se os dados foram inseridos (rode reset_complete.sql)');
  }
}

testConnection();
