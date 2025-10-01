import React, { useState } from 'react';
import { testConnection } from '../services/baserowService';
import { Gear, CheckCircle, XCircle } from 'phosphor-react';

const BaserowSetup = () => {
  const [config, setConfig] = useState({
    apiUrl: 'https://api.baserow.io/api',
    token: '',
    databaseId: '',
    contentTableId: '',
    analyticsTableId: '',
    usersTableId: ''
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    // Em um ambiente real, você salvaria essas configurações em um arquivo de configuração
    // ou em variáveis de ambiente
    localStorage.setItem('baserowConfig', JSON.stringify(config));
    alert('Configurações salvas! Recarregue a página para aplicar as mudanças.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Gear className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Configuração do Baserow</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Como configurar o Baserow:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Crie uma conta no Baserow.io ou configure sua instância</li>
          <li>Crie um novo Database</li>
          <li>Crie as tabelas necessárias (veja a documentação no arquivo de configuração)</li>
          <li>Gere um token de API nas configurações da sua conta</li>
          <li>Preencha os campos abaixo com suas informações</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da API do Baserow
          </label>
          <input
            type="text"
            value={config.apiUrl}
            onChange={(e) => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://api.baserow.io/api"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token de API
          </label>
          <input
            type="password"
            value={config.token}
            onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Seu token de API do Baserow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID do Database
          </label>
          <input
            type="text"
            value={config.databaseId}
            onChange={(e) => setConfig(prev => ({ ...prev, databaseId: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ID do seu database no Baserow"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Tabela Conteúdo
            </label>
            <input
              type="text"
              value={config.contentTableId}
              onChange={(e) => setConfig(prev => ({ ...prev, contentTableId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ID da tabela de conteúdo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Tabela Analytics
            </label>
            <input
              type="text"
              value={config.analyticsTableId}
              onChange={(e) => setConfig(prev => ({ ...prev, analyticsTableId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ID da tabela de analytics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Tabela Usuários
            </label>
            <input
              type="text"
              value={config.usersTableId}
              onChange={(e) => setConfig(prev => ({ ...prev, usersTableId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ID da tabela de usuários"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleTest}
            disabled={testing || !config.token}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? 'Testando...' : 'Testar Conexão'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Salvar Configurações
          </button>
        </div>

        {testResult && (
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {testResult.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaserowSetup;