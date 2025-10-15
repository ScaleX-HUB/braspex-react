import supabase from '../lib/supabaseClient';

/**
 * API para gerenciar CLIENTES no Supabase
 * Tabela: clients
 * Campos: id, name, email, phone, company, address, city, state, zip_code, notes, stage, inactive, created_at, updated_at
 */

export const clientsAPI = {
  /**
   * Buscar todos os clientes
   */
  getAll: async () => {
    try {
      const { data, error } = await supabase.get('clients');
      
      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        return [];
      }

      // Converter snake_case para camelCase
      const clients = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zip_code,
        notes: client.notes,
        stage: client.stage,
        inactive: client.inactive,
        createdAt: client.created_at,
        updatedAt: client.updated_at
      }));

      console.log('✅ Clientes carregados do Supabase:', clients.length);
      return clients;
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      return [];
    }
  },

  /**
   * Criar novo cliente
   */
  create: async (clientData) => {
    try {
      const data = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zipCode,
        notes: clientData.notes,
        stage: clientData.stage || 'lead',
        inactive: clientData.inactive || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase.insert('clients', data);

      if (error) {
        console.error('❌ Erro ao criar cliente:', error);
        return null;
      }

      console.log('✅ Cliente criado no Supabase:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      return null;
    }
  },

  /**
   * Atualizar cliente
   */
  update: async (clientId, clientData) => {
    try {
      const data = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zipCode,
        notes: clientData.notes,
        stage: clientData.stage,
        inactive: clientData.inactive,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.update('clients', clientId, data);

      if (error) {
        console.error('❌ Erro ao atualizar cliente:', error);
        return false;
      }

      console.log('✅ Cliente atualizado no Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      return false;
    }
  },

  /**
   * Deletar cliente
   */
  delete: async (clientId) => {
    try {
      const { error } = await supabase.delete('clients', { id: clientId });

      if (error) {
        console.error('❌ Erro ao deletar cliente:', error);
        return false;
      }

      console.log('✅ Cliente deletado do Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar cliente:', error);
      return false;
    }
  },

  /**
   * Buscar cliente por email
   */
  findByEmail: async (email) => {
    try {
      const { data, error } = await supabase.get('clients', {
        email: email.toLowerCase()
      });

      if (error) {
        console.error('❌ Erro ao buscar cliente por email:', error);
        return null;
      }

      if (data && data.length > 0) {
        const client = data[0];
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          address: client.address,
          city: client.city,
          state: client.state,
          zipCode: client.zip_code,
          notes: client.notes,
          stage: client.stage,
          inactive: client.inactive,
          createdAt: client.created_at,
          updatedAt: client.updated_at
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar cliente por email:', error);
      return null;
    }
  }
};
