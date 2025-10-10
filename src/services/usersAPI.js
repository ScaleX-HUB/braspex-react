/**
 * API para gerenciamento de usuários no Supabase
 * Tabela: users
 * 
 * Estrutura:
 * - id: integer (primary key)
 * - username: text
 * - password: text (hash bcrypt)
 * - role: text (admin, editor, etc)
 * - active: boolean
 * - created_at: timestamp
 * - last_login: timestamp
 */

import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'users';

export const usersAPI = {
  /**
   * Autenticar usuário
   * ⚠️ Em produção, use bcrypt ou autenticação adequada
   */
  async login(username, password) {
    try {
      const data = await supabase.get(TABLE_NAME, {
        username,
        active: true
      });

      if (data.length === 0) {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }

      const user = data[0];

      // ⚠️ ATENÇÃO: Em produção, use bcrypt.compare()
      // Para desenvolvimento, comparação direta
      if (user.password !== password) {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }

      // Atualizar último login
      await supabase.update(
        TABLE_NAME,
        { id: user.id },
        { last_login: new Date().toISOString() }
      );

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro no servidor'
      };
    }
  },

  /**
   * Buscar todos os usuários
   */
  async getAll(includeInactive = false) {
    try {
      const filters = includeInactive ? {} : { active: true };
      const data = await supabase.get(TABLE_NAME, filters, {
        order: 'username.asc'
      });
      // Remover senhas da resposta
      return data.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active,
        created_at: user.created_at,
        last_login: user.last_login
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  /**
   * Buscar usuário por ID
   */
  async getById(id) {
    try {
      const data = await supabase.get(TABLE_NAME, { id });
      if (data.length === 0) return null;

      const user = data[0];
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active,
        created_at: user.created_at,
        last_login: user.last_login
      };
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Criar novo usuário
   * ⚠️ Em produção, use bcrypt.hash() para a senha
   */
  async create(userData) {
    try {
      const data = await supabase.insert(TABLE_NAME, {
        username: userData.username,
        password: userData.password, // ⚠️ Em produção: bcrypt.hash(password, 10)
        role: userData.role || 'admin',
        active: userData.active !== undefined ? userData.active : true,
        created_at: new Date().toISOString(),
        last_login: null
      });
      
      const user = data[0];
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  /**
   * Atualizar usuário
   */
  async update(id, userData) {
    try {
      const updateData = {};

      if (userData.username !== undefined) updateData.username = userData.username;
      if (userData.password !== undefined) {
        // ⚠️ Em produção: bcrypt.hash(password, 10)
        updateData.password = userData.password;
      }
      if (userData.role !== undefined) updateData.role = userData.role;
      if (userData.active !== undefined) updateData.active = userData.active;

      const data = await supabase.update(TABLE_NAME, { id }, updateData);
      
      const user = data[0];
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active
      };
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Desativar usuário (soft delete)
   */
  async deactivate(id) {
    try {
      await this.update(id, { active: false });
      return true;
    } catch (error) {
      console.error(`Erro ao desativar usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar usuário permanentemente
   */
  async delete(id) {
    try {
      await supabase.delete(TABLE_NAME, { id });
      return true;
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error);
      throw error;
    }
  }
};
