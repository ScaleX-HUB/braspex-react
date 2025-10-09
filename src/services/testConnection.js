/**
 * Script de teste para verificar conexão com Supabase
 * Execute no console do navegador ou como módulo
 */

import { supabase } from '../lib/supabaseClient';
import { textsAPI } from './textsAPI';
import { productsAPI } from './productsAPI';
import { analyticsAPI } from './analyticsAPI';
import { usersAPI } from './usersAPI';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  const results = {
    connection: false,
    texts: false,
    products: false,
    analytics: false,
    users: false,
    errors: []
  };

  try {
    // Teste 1: Conexão básica
    console.log('1️⃣ Testando conexão básica...');
    try {
      const response = await fetch(supabase.baseURL, {
        headers: supabase.getHeaders()
      });
      if (response.ok) {
        console.log('✅ Conexão estabelecida');
        results.connection = true;
      } else {
        throw new Error(`Status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro na conexão:', error.message);
      results.errors.push(`Conexão: ${error.message}`);
    }

    // Teste 2: Textos
    console.log('\n2️⃣ Testando API de textos...');
    try {
      const texts = await textsAPI.getAll();
      console.log(`✅ ${texts.length} textos encontrados`);
      results.texts = true;
    } catch (error) {
      console.error('❌ Erro nos textos:', error.message);
      results.errors.push(`Textos: ${error.message}`);
    }

    // Teste 3: Produtos
    console.log('\n3️⃣ Testando API de produtos...');
    try {
      const products = await productsAPI.getAll();
      console.log(`✅ ${products.length} produtos encontrados`);
      results.products = true;
    } catch (error) {
      console.error('❌ Erro nos produtos:', error.message);
      results.errors.push(`Produtos: ${error.message}`);
    }

    // Teste 4: Analytics
    console.log('\n4️⃣ Testando API de analytics...');
    try {
      const stats = await analyticsAPI.getStats();
      console.log(`✅ Analytics OK - ${stats.totalViews} visualizações totais`);
      results.analytics = true;
    } catch (error) {
      console.error('❌ Erro no analytics:', error.message);
      results.errors.push(`Analytics: ${error.message}`);
    }

    // Teste 5: Usuários (apenas listagem)
    console.log('\n5️⃣ Testando API de usuários...');
    try {
      const users = await usersAPI.getAll();
      console.log(`✅ ${users.length} usuários encontrados`);
      results.users = true;
    } catch (error) {
      console.error('❌ Erro nos usuários:', error.message);
      results.errors.push(`Usuários: ${error.message}`);
    }

    // Resumo
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log('====================');
    console.log(`Conexão: ${results.connection ? '✅' : '❌'}`);
    console.log(`Textos: ${results.texts ? '✅' : '❌'}`);
    console.log(`Produtos: ${results.products ? '✅' : '❌'}`);
    console.log(`Analytics: ${results.analytics ? '✅' : '❌'}`);
    console.log(`Usuários: ${results.users ? '✅' : '❌'}`);

    if (results.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      results.errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\n✅ Todos os testes passaram!');
    }

    return results;

  } catch (error) {
    console.error('\n💥 Erro crítico:', error);
    return results;
  }
};

// Teste rápido de conexão
export const quickTest = async () => {
  try {
    const texts = await textsAPI.getAll();
    console.log(`✅ Supabase conectado! ${texts.length} textos encontrados.`);
    return true;
  } catch (error) {
    console.error('❌ Supabase desconectado:', error.message);
    return false;
  }
};

// Testar autenticação
export const testAuth = async (username = 'admin', password = 'Braspex2025!') => {
  try {
    console.log(`🔐 Testando login com usuário "${username}"...`);
    const result = await usersAPI.login(username, password);
    
    if (result.success) {
      console.log('✅ Login bem-sucedido!');
      console.log('Usuário:', result.user);
      return true;
    } else {
      console.error('❌ Login falhou:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return false;
  }
};

// Exportar para uso no console
if (typeof window !== 'undefined') {
  window.testSupabase = testSupabaseConnection;
  window.quickTest = quickTest;
  window.testAuth = testAuth;
}
