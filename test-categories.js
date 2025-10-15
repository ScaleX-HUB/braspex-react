import { supabase } from './src/lib/supabaseClient.js';

async function testCategories() {
  console.log('🧪 Testando categorias no Supabase...\n');
  
  // Testar se existe tabela product_categories
  const { data, error } = await supabase.query('/product_categories?select=*');
  
  if (error) {
    console.log('❌ Erro ao buscar categorias:', error);
    console.log('\n💡 A tabela product_categories NÃO existe no Supabase');
    console.log('📝 Você precisa criar essa tabela se quiser usar categorias do banco');
  } else {
    console.log('✅ Categorias encontradas:', data.length);
    console.log('📦 Dados:', JSON.stringify(data, null, 2));
  }
}

testCategories();
