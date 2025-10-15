// Teste para ver o conteúdo real dos textos

const SUPABASE_URL = 'http://173.249.32.99:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwMDE1NTc0LCJleHAiOjIwNzUzNzU1NzR9.zOkNw3Bh2qhDjrOYK8Gptx7Kv_ADs-9x0732M9pLYoQ';
const SCHEMA = 'braspex';

async function testContent() {
  console.log('📋 Verificando conteúdo dos textos...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_texts?section=eq.hero`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': SCHEMA,
        'Content-Profile': SCHEMA
      }
    });
    
    const texts = await response.json();
    console.log('🏠 HERO SECTION:');
    texts.forEach(t => {
      console.log(`  ${t.field}: ${t.value.substring(0, 60)}...`);
    });
    
    console.log('\n📊 Verificando produtos...\n');
    const productsResp = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': SCHEMA,
        'Content-Profile': SCHEMA
      }
    });
    
    const products = await productsResp.json();
    console.log('🛍️ PRODUTOS:');
    products.forEach(p => {
      console.log(`  - ${p.name} (${p.category})`);
      console.log(`    Descrição: ${p.description.substring(0, 60)}...`);
      console.log(`    Ativo: ${p.active ? 'SIM' : 'NÃO'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testContent();
