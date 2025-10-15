// Utilitário para gerenciar cotações
import { useEffect } from 'react';

const STORAGE_KEY = 'braspex_quotes';

/**
 * Carrega cotações do localStorage
 */
export const loadQuotes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('❌ Erro ao carregar cotações:', e);
  }
  
  return [];
};

/**
 * Salva cotação
 */
export const saveQuote = (quoteData) => {
  try {
    const quotes = loadQuotes();
    
    const newQuote = {
      id: Date.now(),
      ...quoteData,
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, contacted, converted, cancelled
    };
    
    const updatedQuotes = [newQuote, ...quotes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
    
    // Disparar evento para notificação
    window.dispatchEvent(new CustomEvent('quoteReceived', { detail: newQuote }));
    window.dispatchEvent(new CustomEvent('quotesUpdated', { detail: updatedQuotes }));
    
    console.log('✅ Cotação salva:', newQuote);
    return newQuote;
  } catch (e) {
    console.error('❌ Erro ao salvar cotação:', e);
    return null;
  }
};

/**
 * Atualiza status de uma cotação
 */
export const updateQuoteStatus = (quoteId, newStatus) => {
  try {
    const quotes = loadQuotes();
    const updatedQuotes = quotes.map(q => 
      q.id === quoteId ? { ...q, status: newStatus, updatedAt: new Date().toISOString() } : q
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
    window.dispatchEvent(new CustomEvent('quotesUpdated', { detail: updatedQuotes }));
    
    return true;
  } catch (e) {
    console.error('❌ Erro ao atualizar cotação:', e);
    return false;
  }
};

/**
 * Deleta cotação
 */
export const deleteQuote = (quoteId) => {
  try {
    const quotes = loadQuotes();
    const updatedQuotes = quotes.filter(q => q.id !== quoteId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
    window.dispatchEvent(new CustomEvent('quotesUpdated', { detail: updatedQuotes }));
    
    return true;
  } catch (e) {
    console.error('❌ Erro ao deletar cotação:', e);
    return false;
  }
};

/**
 * Hook para sincronizar cotações
 */
export const useQuotesSync = (callback) => {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('quotesUpdated', handler);
    return () => window.removeEventListener('quotesUpdated', handler);
  }, [callback]);
};

/**
 * Hook para notificação de nova cotação
 */
export const useQuoteNotification = (callback) => {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('quoteReceived', handler);
    return () => window.removeEventListener('quoteReceived', handler);
  }, [callback]);
};

/**
 * Conta cotações por status
 */
export const getQuotesStats = () => {
  const quotes = loadQuotes();
  
  return {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    contacted: quotes.filter(q => q.status === 'contacted').length,
    converted: quotes.filter(q => q.status === 'converted').length,
    cancelled: quotes.filter(q => q.status === 'cancelled').length,
    today: quotes.filter(q => {
      const quoteDate = new Date(q.createdAt);
      const today = new Date();
      return quoteDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: quotes.filter(q => {
      const quoteDate = new Date(q.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return quoteDate >= weekAgo;
    }).length
  };
};
