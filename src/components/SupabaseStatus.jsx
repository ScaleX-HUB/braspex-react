import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { quickTest } from '../services/testConnection';

/**
 * Componente para exibir status da conexão com Supabase
 * Uso: <SupabaseStatus />
 */
const SupabaseStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, connected, disconnected
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    setError(null);

    try {
      const isConnected = await quickTest();
      setStatus(isConnected ? 'connected' : 'disconnected');
    } catch (err) {
      setStatus('disconnected');
      setError(err.message);
    }
  };

  useEffect(() => {
    checkConnection();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Supabase Conectado'
        };
      case 'disconnected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Supabase Desconectado'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 animate-pulse" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Verificando...'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}
      title={error || config.label}
    >
      <Database className="w-4 h-4 text-gray-500" />
      <span className={`${config.color}`}>{config.icon}</span>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
      {error && (
        <span className="text-xs text-gray-500" title={error}>
          ⚠️
        </span>
      )}
      <button
        onClick={checkConnection}
        className="text-xs text-gray-500 hover:text-gray-700 ml-2"
        title="Verificar novamente"
      >
        🔄
      </button>
    </div>
  );
};

export default SupabaseStatus;
