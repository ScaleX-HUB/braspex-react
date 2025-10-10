import React, { useState } from 'react';
import { Lock, Eye, EyeSlash } from 'phosphor-react';
import { usersAPI } from '../services/usersAPI';
import AdminPanel from './AdminPanel';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Credenciais fixas como fallback
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Braspex2025!'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Tentar autenticação com Supabase
      const result = await usersAPI.login(credentials.username, credentials.password);
      
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', JSON.stringify(result.user));
      } else {
        // Fallback para credenciais fixas se Supabase não estiver configurado
        if (credentials.username === ADMIN_CREDENTIALS.username && 
            credentials.password === ADMIN_CREDENTIALS.password) {
          setIsAuthenticated(true);
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminUser', JSON.stringify({ 
            username: 'admin', 
            role: 'admin' 
          }));
        } else {
          setError('Credenciais inválidas. Por favor, tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      // Fallback para credenciais fixas em caso de erro
      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', JSON.stringify({ 
          username: 'admin', 
          role: 'admin' 
        }));
      } else {
        setError('Erro de conexão. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setCredentials({ username: '', password: '' });
  };

  if (isAuthenticated) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#005563] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">BRASPEX - Acesso Restrito</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent pr-12"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#005563] text-white py-3 rounded-lg font-semibold hover:bg-[#004449] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;