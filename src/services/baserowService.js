import axios from 'axios';
import { baserowConfig } from '../config/baserowConfig';
import { mockBaserowData, mockApiDelay } from '../data/mockData';

// Configurações do Baserow
const BASEROW_API_URL = baserowConfig.apiUrl;
const BASEROW_TOKEN = baserowConfig.token;
const DATABASE_ID = baserowConfig.databaseId;
const CONTENT_TABLE_ID = baserowConfig.tables.content;
const ANALYTICS_TABLE_ID = baserowConfig.tables.analytics;
const USERS_TABLE_ID = baserowConfig.tables.users;

// Verificar se Baserow está configurado
const isBaserowConfigured = () => {
  return BASEROW_TOKEN && DATABASE_ID && CONTENT_TABLE_ID && ANALYTICS_TABLE_ID && USERS_TABLE_ID;
};

// Configurar axios com headers padrão
const api = axios.create({
  baseURL: BASEROW_API_URL,
  headers: {
    'Authorization': `Token ${BASEROW_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Serviços de Autenticação
export const authService = {
  async login(username, password) {
    if (!isBaserowConfigured()) {
      // Usar dados mock
      await mockApiDelay(800);
      const user = mockBaserowData.users.find(u => 
        u.username === username && u.password === password && u.active
      );

      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        };
      } else {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }
    }

    try {
      // Buscar usuário na tabela de usuários
      const response = await api.get(`/database/rows/table/${USERS_TABLE_ID}/`, {
        params: {
          search: username,
        }
      });

      const users = response.data.results;
      const user = users.find(u => 
        u.username === username && u.password === password
      );

      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role || 'admin'
          }
        };
      } else {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro no servidor'
      };
    }
  }
};

// Serviços de Conteúdo
export const contentService = {
  async getAllContent() {
    if (!isBaserowConfigured()) {
      // Usar dados mock
      await mockApiDelay();
      const content = {};
      mockBaserowData.content.forEach(row => {
        const section = row.section;
        if (!content[section]) {
          content[section] = {};
        }
        content[section][row.field] = row.value;
      });
      return content;
    }

    try {
      const response = await api.get(`/database/rows/table/${CONTENT_TABLE_ID}/`);
      
      // Transformar os dados do Baserow no formato esperado pelo frontend
      const content = {};
      response.data.results.forEach(row => {
        const section = row.section;
        if (!content[section]) {
          content[section] = {};
        }
        content[section][row.field] = row.value;
      });

      return content;
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      return null;
    }
  },

  async updateContent(section, field, value) {
    if (!isBaserowConfigured()) {
      // Simular atualização nos dados mock
      await mockApiDelay(300);
      const existingIndex = mockBaserowData.content.findIndex(
        row => row.section === section && row.field === field
      );
      
      if (existingIndex >= 0) {
        mockBaserowData.content[existingIndex].value = value;
      } else {
        mockBaserowData.content.push({
          id: Date.now(),
          section,
          field,
          value
        });
      }
      return true;
    }

    try {
      // Primeiro, encontrar o registro existente
      const response = await api.get(`/database/rows/table/${CONTENT_TABLE_ID}/`, {
        params: {
          search: `${section}_${field}`,
        }
      });

      const existingRow = response.data.results.find(
        row => row.section === section && row.field === field
      );

      if (existingRow) {
        // Atualizar registro existente
        await api.patch(`/database/rows/table/${CONTENT_TABLE_ID}/${existingRow.id}/`, {
          value: value
        });
      } else {
        // Criar novo registro
        await api.post(`/database/rows/table/${CONTENT_TABLE_ID}/`, {
          section: section,
          field: field,
          value: value
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      return false;
    }
  },

  async resetContent() {
    try {
      // Buscar todos os registros
      const response = await api.get(`/database/rows/table/${CONTENT_TABLE_ID}/`);
      
      // Deletar todos os registros
      for (const row of response.data.results) {
        await api.delete(`/database/rows/table/${CONTENT_TABLE_ID}/${row.id}/`);
      }

      // Recriar conteúdo padrão
      await this.createDefaultContent();
      return true;
    } catch (error) {
      console.error('Erro ao resetar conteúdo:', error);
      return false;
    }
  },

  async createDefaultContent() {
    const defaultContent = {
      hero: {
        title: 'Construções Metálicas de Alta Performance',
        subtitle: 'Soluções industriais completas com tecnologia alemã',
        description: 'Especializados em estruturas metálicas para galpões industriais, com foco em eficiência, durabilidade e sustentabilidade.',
        buttonText: 'Solicitar Orçamento'
      },
      vantagens: {
        title: 'Por Que Escolher a BRASPEX?',
        subtitle: 'Vantagens que fazem a diferença',
        vantagem1: 'Tecnologia Alemã de Ponta',
        vantagem2: 'Equipe Especializada',
        vantagem3: 'Prazos Garantidos',
        vantagem4: 'Suporte Completo'
      },
      // ... outros conteúdos padrão
    };

    for (const [section, fields] of Object.entries(defaultContent)) {
      for (const [field, value] of Object.entries(fields)) {
        await api.post(`/database/rows/table/${CONTENT_TABLE_ID}/`, {
          section: section,
          field: field,
          value: value
        });
      }
    }
  }
};

// Serviços de Analytics
export const analyticsService = {
  async getAnalytics() {
    if (!isBaserowConfigured()) {
      // Usar dados mock
      await mockApiDelay(200);
      const visits = mockBaserowData.analytics;
      const totalViews = visits.length;
      
      // Calcular visualizações de hoje
      const today = new Date().toISOString().split('T')[0];
      const dailyViews = visits.filter(visit => 
        visit.date && visit.date.startsWith(today)
      ).length;

      // Formatar visitantes
      const visitors = visits.map(visit => ({
        date: visit.date,
        userAgent: visit.user_agent,
        ip: visit.ip_address
      }));

      return {
        totalViews,
        dailyViews,
        visitors: visitors.slice(-50).reverse() // Últimos 50 visitantes, mais recentes primeiro
      };
    }

    try {
      const response = await api.get(`/database/rows/table/${ANALYTICS_TABLE_ID}/`);
      
      const visits = response.data.results;
      const totalViews = visits.length;
      
      // Calcular visualizações de hoje
      const today = new Date().toISOString().split('T')[0];
      const dailyViews = visits.filter(visit => 
        visit.date && visit.date.startsWith(today)
      ).length;

      // Formatar visitantes
      const visitors = visits.map(visit => ({
        date: visit.date || new Date().toISOString(),
        userAgent: visit.user_agent || 'Unknown',
        ip: visit.ip_address || 'Unknown'
      }));

      return {
        totalViews,
        dailyViews,
        visitors: visitors.slice(-50) // Últimos 50 visitantes
      };
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      return {
        totalViews: 0,
        dailyViews: 0,
        visitors: []
      };
    }
  },

  async trackVisit() {
    if (!isBaserowConfigured()) {
      // Simular registro de visita nos dados mock
      mockBaserowData.analytics.push({
        id: Date.now(),
        date: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        page: window.location.pathname
      });
      return true;
    }

    try {
      await api.post(`/database/rows/table/${ANALYTICS_TABLE_ID}/`, {
        date: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: 'Client IP', // Em produção, você pode usar um serviço para detectar IP
        page: window.location.pathname
      });
      return true;
    } catch (error) {
      console.error('Erro ao registrar visita:', error);
      return false;
    }
  }
};

// Serviços de Produtos
export const productService = {
  async getAllProducts() {
    if (!isBaserowConfigured()) {
      // Usar dados mock
      await mockApiDelay();
      return mockBaserowData.products;
    }

    try {
      const response = await api.get(`/database/rows/table/${baserowConfig.tables.products}/`);
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  async getProductById(productId) {
    if (!isBaserowConfigured()) {
      await mockApiDelay();
      return mockBaserowData.products.find(p => p.id === productId);
    }

    try {
      const response = await api.get(`/database/rows/table/${baserowConfig.tables.products}/${productId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  },

  async getProductsByCategory(categoryId, subcategoryId = null) {
    if (!isBaserowConfigured()) {
      await mockApiDelay();
      return mockBaserowData.products.filter(p => {
        if (p.categoryId !== categoryId) return false;
        if (subcategoryId && p.subcategoryId !== subcategoryId) return false;
        return p.active;
      });
    }

    try {
      let params = { 'filter__categoryId__equal': categoryId };
      if (subcategoryId) {
        params['filter__subcategoryId__equal'] = subcategoryId;
      }
      params['filter__active__equal'] = true;

      const response = await api.get(`/database/rows/table/${baserowConfig.tables.products}/`, { params });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
  },

  async createProduct(productData) {
    if (!isBaserowConfigured()) {
      await mockApiDelay(500);
      const newProduct = {
        ...productData,
        id: Math.max(...mockBaserowData.products.map(p => p.id), 0) + 1
      };
      mockBaserowData.products.push(newProduct);
      return newProduct;
    }

    try {
      const response = await api.post(`/database/rows/table/${baserowConfig.tables.products}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  async updateProduct(productId, productData) {
    if (!isBaserowConfigured()) {
      await mockApiDelay(500);
      const index = mockBaserowData.products.findIndex(p => p.id === productId);
      if (index >= 0) {
        mockBaserowData.products[index] = { ...mockBaserowData.products[index], ...productData };
        return mockBaserowData.products[index];
      }
      throw new Error('Produto não encontrado');
    }

    try {
      const response = await api.patch(`/database/rows/table/${baserowConfig.tables.products}/${productId}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    if (!isBaserowConfigured()) {
      await mockApiDelay(300);
      const index = mockBaserowData.products.findIndex(p => p.id === productId);
      if (index >= 0) {
        mockBaserowData.products.splice(index, 1);
        return true;
      }
      return false;
    }

    try {
      await api.delete(`/database/rows/table/${baserowConfig.tables.products}/${productId}/`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
  },

  async searchProducts(query) {
    if (!isBaserowConfigured()) {
      await mockApiDelay();
      const lowerQuery = query.toLowerCase();
      return mockBaserowData.products.filter(p =>
        p.active && (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
        )
      );
    }

    try {
      const response = await api.get(`/database/rows/table/${baserowConfig.tables.products}/`, {
        params: {
          search: query,
          'filter__active__equal': true
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }
};

// Função para testar conexão
export const testConnection = async () => {
  if (!isBaserowConfigured()) {
    return {
      success: false,
      message: 'Baserow não configurado. Preencha as configurações primeiro.'
    };
  }

  try {
    const response = await api.get(`/database/${DATABASE_ID}/`);
    return {
      success: true,
      message: 'Conexão com Baserow estabelecida com sucesso!',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao conectar com Baserow: ' + error.message
    };
  }
};

// Função para verificar se está usando dados mock
export const isUsingMockData = () => {
  return !isBaserowConfigured();
};