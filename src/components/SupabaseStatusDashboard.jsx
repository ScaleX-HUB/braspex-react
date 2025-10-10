import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Warning, ArrowClockwise, Database, Table } from 'phosphor-react';
import { supabase } from '../lib/supabaseClient';
import { textsAPI } from '../services/textsAPI';
import { productsAPI } from '../services/productsAPI';
import { usersAPI } from '../services/usersAPI';

const SupabaseStatusDashboard = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    tables: {
      site_texts: { exists: false, count: 0, error: null },
      products: { exists: false, count: 0, error: null },
      users: { exists: false, count: 0, error: null },
      analytics: { exists: false, count: 0, error: null }
    },
    lastCheck: null
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const newStatus = {
        loading: false,
        connected: true,
        tables: {},
        lastCheck: new Date().toISOString()
      };

      // Testar cada tabela
      const tables = [
        { name: 'site_texts', api: textsAPI },
        { name: 'products', api: productsAPI },
        { name: 'users', api: usersAPI }
      ];

      for (const table of tables) {
        try {
          const response = await supabase.get(table.name);
          newStatus.tables[table.name] = {
            exists: true,
            count: response.length,
            error: null
          };
        } catch (error) {
          newStatus.tables[table.name] = {
            exists: false,
            count: 0,
            error: error.message
          };
          newStatus.connected = false;
        }
      }

      // Analytics (opcional)
      try {
        const analyticsResponse = await supabase.get('analytics');
        newStatus.tables.analytics = {
          exists: true,
          count: analyticsResponse.length,
          error: null
        };
      } catch (error) {
        newStatus.tables.analytics = {
          exists: false,
          count: 0,
          error: error.message
        };
      }

      setStatus(newStatus);
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        tables: {},
        lastCheck: new Date().toISOString(),
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const StatusIcon = ({ connected, loading }) => {
    if (loading) {
      return <ArrowClockwise className="w-6 h-6 text-blue-500 animate-spin" />;
    }
    return connected 
      ? <CheckCircle className="w-6 h-6 text-green-500" weight="fill" />
      : <XCircle className="w-6 h-6 text-red-500" weight="fill" />;
  };

  const TableStatus = ({ name, data }) => {
    const getStatusColor = () => {
      if (data.error) return 'bg-red-50 border-red-200';
      if (data.count === 0) return 'bg-yellow-50 border-yellow-200';
      return 'bg-green-50 border-green-200';
    };

    const getStatusIcon = () => {
      if (data.error) return <XCircle className="w-5 h-5 text-red-500" weight="fill" />;
      if (data.count === 0) return <Warning className="w-5 h-5 text-yellow-500" weight="fill" />;
      return <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />;
    };

    return (
      <div className={`border-2 rounded-lg p-4 ${getStatusColor()} transition-all duration-300`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">{name}</span>
          </div>
          {getStatusIcon()}
        </div>
        
        {data.exists ? (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Registros:</span> {data.count}
            </p>
            {data.count === 0 && (
              <p className="text-xs text-yellow-700">
                ⚠️ Tabela vazia - execute o script reset_complete.sql
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-red-600 font-medium">
              Erro ao acessar tabela
            </p>
            {data.error && (
              <p className="text-xs text-red-500 break-words">
                {data.error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Status do Supabase</h2>
            <p className="text-sm text-gray-600">
              {status.lastCheck && `Última verificação: ${new Date(status.lastCheck).toLocaleTimeString('pt-BR')}`}
            </p>
          </div>
        </div>
        <button
          onClick={checkConnection}
          disabled={status.loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <ArrowClockwise className={`w-5 h-5 ${status.loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Status Geral */}
      <div className={`border-2 rounded-lg p-4 mb-6 ${
        status.loading ? 'bg-blue-50 border-blue-200' :
        status.connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          <StatusIcon connected={status.connected} loading={status.loading} />
          <div>
            <p className="font-semibold text-gray-900">
              {status.loading ? 'Verificando conexão...' :
               status.connected ? 'Conectado ao Supabase' : 'Falha na conexão'}
            </p>
            <p className="text-sm text-gray-600">
              {import.meta.env.VITE_SUPABASE_URL || 'URL não configurada'}
            </p>
          </div>
        </div>
      </div>

      {/* Status das Tabelas */}
      {!status.loading && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Tabelas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.tables).map(([name, data]) => (
              <TableStatus key={name} name={name} data={data} />
            ))}
          </div>
        </>
      )}

      {/* Ações Recomendadas */}
      {!status.loading && !status.connected && (
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Warning className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Ações Recomendadas:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Verifique se o Supabase está rodando em <code className="bg-yellow-100 px-1 rounded">http://supabase.talka.tech:3000</code></li>
                <li>Execute o script <code className="bg-yellow-100 px-1 rounded">database/fix_permissions.sql</code></li>
                <li>Execute o script <code className="bg-yellow-100 px-1 rounded">database/reset_complete.sql</code></li>
                <li>Verifique as variáveis de ambiente no arquivo <code className="bg-yellow-100 px-1 rounded">.env</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseStatusDashboard;
