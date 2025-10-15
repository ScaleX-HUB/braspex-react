// Utilitário para gerenciar clientes
import { useEffect } from 'react';

const STORAGE_KEY = 'braspex_clients';

/**
 * Carrega clientes do localStorage
 */
export const loadClients = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const clients = JSON.parse(stored);
      console.log('✅ Clientes carregados do localStorage:', clients.length);
      return clients;
    }
  } catch (e) {
    console.error('❌ Erro ao carregar clientes:', e);
  }
  
  return [];
};

/**
 * Salva clientes no localStorage
 */
export const saveClients = (clients) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    console.log('✅ Clientes salvos no localStorage:', clients.length);
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('clientsUpdated', { detail: clients }));
    
    return true;
  } catch (e) {
    console.error('❌ Erro ao salvar clientes:', e);
    return false;
  }
};

/**
 * Adiciona um novo cliente
 */
export const addClient = (clientData) => {
  const clients = loadClients();
  
  const newClient = {
    id: Date.now(),
    ...clientData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedClients = [...clients, newClient];
  saveClients(updatedClients);
  
  return newClient;
};

/**
 * Atualiza um cliente existente
 */
export const updateClient = (clientId, clientData) => {
  const clients = loadClients();
  const updatedClients = clients.map(client => 
    client.id === clientId 
      ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
      : client
  );
  
  saveClients(updatedClients);
  return updatedClients.find(c => c.id === clientId);
};

/**
 * Deleta um cliente
 */
export const deleteClient = (clientId) => {
  const clients = loadClients();
  const updatedClients = clients.filter(c => c.id !== clientId);
  saveClients(updatedClients);
  return true;
};

/**
 * Busca cliente por email
 */
export const findClientByEmail = (email) => {
  const clients = loadClients();
  return clients.find(c => c.email.toLowerCase() === email.toLowerCase());
};

/**
 * Hook para sincronizar mudanças de clientes
 */
export const useClientsSync = (callback) => {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('clientsUpdated', handler);
    return () => window.removeEventListener('clientsUpdated', handler);
  }, [callback]);
};

/**
 * Estatísticas de clientes
 */
export const getClientsStats = () => {
  const clients = loadClients();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    total: clients.length,
    today: clients.filter(c => new Date(c.createdAt) >= today).length,
    thisWeek: clients.filter(c => new Date(c.createdAt) >= thisWeekStart).length,
    thisMonth: clients.filter(c => new Date(c.createdAt) >= thisMonthStart).length,
    active: clients.filter(c => !c.inactive).length,
    inactive: clients.filter(c => c.inactive).length
  };
};
