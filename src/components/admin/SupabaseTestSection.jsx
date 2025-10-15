import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database, CheckCircle, XCircle, Warning } from 'phosphor-react';

const SupabaseTestSection = () => {
  const [supabaseTest, setSupabaseTest] = useState(null);
  const [testingSupabase, setTestingSupabase] = useState(false);

  const testSupabaseConnection = async () => {
    setTestingSupabase(true);
    setSupabaseTest(null);

    try {
      // Teste 1: Buscar produtos usando a API customizada
      const products = await supabase.get('products', {}, { limit: 5 });

      console.log('✅ Produtos encontrados:', products);

      // Teste 2: Contar total de produtos
      const allProducts = await supabase.get('products');

      setSupabaseTest({
        status: 'success',
        message: 'Conexão com Supabase estabelecida com sucesso!',
        details: {
          productsCount: allProducts?.length || 0,
          sampleProducts: products?.map(p => p.name).slice(0, 3) || [],
          timestamp: new Date().toLocaleString('pt-BR')
        }
      });
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setSupabaseTest({
        status: 'error',
        message: 'Erro ao conectar com Supabase',
        details: {
          error: error.message,
          code: error.code,
          hint: error.hint
        }
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Teste de Conexão Supabase</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <Database className="w-12 h-12 text-[#005563]" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Status da Conexão
            </h3>
            <p className="text-gray-600">
              Verifique a conectividade com o banco de dados Supabase
            </p>
          </div>
        </div>

        <button
          onClick={testSupabaseConnection}
          disabled={testingSupabase}
          className="bg-[#005563] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Database className="w-5 h-5" />
          {testingSupabase ? 'Testando...' : 'Testar Conexão'}
        </button>

        {supabaseTest && (
          <div
            className={`mt-6 p-4 rounded-lg border-2 ${
              supabaseTest.status === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {supabaseTest.status === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" weight="fill" />
              )}
              <h4
                className={`font-semibold ${
                  supabaseTest.status === 'success'
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {supabaseTest.message}
              </h4>
            </div>

            <div className="mt-4 space-y-2">
              <h5 className="font-medium text-gray-700">Detalhes:</h5>
              <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                {JSON.stringify(supabaseTest.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!supabaseTest && !testingSupabase && (
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <div className="flex items-center gap-3">
              <Warning className="w-6 h-6 text-blue-600" />
              <p className="text-blue-800">
                Clique no botão acima para testar a conexão com o Supabase
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Informações da Configuração
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">URL do Projeto:</span>
            <span className="font-mono text-sm text-gray-600">
              {import.meta.env.VITE_SUPABASE_URL ? '✓ Configurado' : '✗ Não configurado'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">API Key:</span>
            <span className="font-mono text-sm text-gray-600">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configurado' : '✗ Não configurado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTestSection;
