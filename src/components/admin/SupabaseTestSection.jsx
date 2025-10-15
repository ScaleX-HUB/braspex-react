import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { productsAPI } from '../../services/productsAPI';
import { textsAPI } from '../../services/textsAPI';
import { Database, CheckCircle, XCircle, Package, Article } from 'phosphor-react';

const SupabaseTestSection = () => {
  const [tests, setTests] = useState({ products: null, texts: null, connection: null });
  const [testing, setTesting] = useState(false);

  const runAllTests = async () => {
    setTesting(true);
    const results = { products: null, texts: null, connection: null };

    try {
      const startProducts = Date.now();
      const products = await productsAPI.getAll(true);
      const timeProducts = Date.now() - startProducts;
      
      results.products = {
        status: 'success',
        message: ' produtos encontrados',
        time: timeProducts,
        data: products.slice(0, 5).map(p => ({ name: p.name, category: p.category, active: p.active }))
      };
    } catch (error) {
      results.products = { status: 'error', message: error.message, time: 0, data: [] };
    }

    try {
      const startTexts = Date.now();
      const textsFormatted = await textsAPI.getAllFormatted();
      const timeTexts = Date.now() - startTexts;
      const sections = Object.keys(textsFormatted);
      const totalFields = Object.values(textsFormatted).reduce((sum, section) => sum + Object.keys(section).length, 0);
      
      results.texts = {
        status: 'success',
        message: ' campos em  seções',
        time: timeTexts,
        data: {
          sections: sections,
          example: textsFormatted.hero ? { section: 'hero', title: textsFormatted.hero.title?.substring(0, 50) + '...' } : null
        }
      };
    } catch (error) {
      results.texts = { status: 'error', message: error.message, time: 0, data: {} };
    }

    results.connection = {
      status: (results.products.status === 'success' && results.texts.status === 'success') ? 'success' : 'error',
      message: (results.products.status === 'success' && results.texts.status === 'success') ? 'Todos os testes passaram!' : 'Alguns testes falharam',
      config: { url: supabase.baseURL, schema: supabase.schema, environment: supabase.isDevelopment ? 'Desenvolvimento' : 'Produção' }
    };

    setTests(results);
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teste de Conexão Supabase</h2>
          <p className="text-gray-600 mt-1">Verifique a conectividade e os dados no banco</p>
        </div>
        <button onClick={runAllTests} disabled={testing} className="bg-[#005563] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <Database className="w-5 h-5" />
          {testing ? 'Testando...' : 'Executar Testes'}
        </button>
      </div>
      {tests.connection && (
        <>
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração Atual</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between"><span className="text-gray-600">URL Base:</span><span className="text-gray-900 font-semibold">{tests.connection.config.url}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Schema:</span><span className="text-gray-900 font-semibold">{tests.connection.config.schema}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Ambiente:</span><span className="text-gray-900 font-semibold">{tests.connection.config.environment}</span></div>
            </div>
          </div>
          <div className={'rounded-xl p-6 border-2 ' + (tests.connection.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
            <div className="flex items-center gap-3">
              {tests.connection.status === 'success' ? <CheckCircle className="w-8 h-8 text-green-600" weight="fill" /> : <XCircle className="w-8 h-8 text-red-600" weight="fill" />}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tests.connection.status === 'success' ? ' Conexão OK' : ' Conexão com Problemas'}</h3>
                <p className="text-sm text-gray-700">{tests.connection.message}</p>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.products && (
          <div className={'rounded-lg p-6 border-2 ' + (tests.products.status === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')}>
            <div className="flex items-center gap-2 mb-3">
              {tests.products.status === 'success' ? <CheckCircle className="w-6 h-6 text-green-600" weight="fill" /> : <XCircle className="w-6 h-6 text-red-600" weight="fill" />}
              <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Package className="w-5 h-5" />Produtos</h4>
            </div>
            <p className="text-sm text-gray-700 mb-1">{tests.products.message}</p>
            <p className="text-xs text-gray-500 mb-3">Tempo: {tests.products.time}ms</p>
            {tests.products.data.length > 0 && (
              <div className="mt-3 bg-white rounded p-3 border border-gray-200">
                <p className="font-semibold text-xs text-gray-600 mb-2">Produtos encontrados:</p>
                <ul className="space-y-1">
                  {tests.products.data.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">
                       {p.name} <span className="text-gray-500">({p.category})</span>
                      {p.active ? <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Ativo</span> : <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Inativo</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {tests.texts && (
          <div className={'rounded-lg p-6 border-2 ' + (tests.texts.status === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')}>
            <div className="flex items-center gap-2 mb-3">
              {tests.texts.status === 'success' ? <CheckCircle className="w-6 h-6 text-green-600" weight="fill" /> : <XCircle className="w-6 h-6 text-red-600" weight="fill" />}
              <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Article className="w-5 h-5" />Textos do Site</h4>
            </div>
            <p className="text-sm text-gray-700 mb-1">{tests.texts.message}</p>
            <p className="text-xs text-gray-500 mb-3">Tempo: {tests.texts.time}ms</p>
            {tests.texts.data.sections && (
              <div className="mt-3 bg-white rounded p-3 border border-gray-200">
                <p className="font-semibold text-xs text-gray-600 mb-2">Seções encontradas:</p>
                <div className="flex flex-wrap gap-1">
                  {tests.texts.data.sections.map((s, i) => (<span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{s}</span>))}
                </div>
                {tests.texts.data.example && (<p className="text-xs text-gray-600 mt-2">Exemplo: <span className="text-gray-900">{tests.texts.data.example.title}</span></p>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseTestSection;
