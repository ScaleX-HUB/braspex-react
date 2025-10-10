// Dados de exemplo para demonstração do Baserow
// Estes dados simulam o que viria do Baserow quando não configurado

import { mockProducts } from './mockProducts';

export const mockBaserowData = {
  // Usuário admin para demonstração
  users: [
    {
      id: 1,
      username: 'admin',
      password: 'Braspex2025!',
      role: 'admin',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login: new Date().toISOString()
    }
  ],

  // Produtos
  products: mockProducts,

  // Conteúdo do site com dados de exemplo
  content: [
    // Hero Section
    { id: 1, section: 'hero', field: 'title', value: 'Soluções Industrializadas' },
    { id: 2, section: 'hero', field: 'subtitle', value: 'para Construção Civil' },
    { id: 3, section: 'hero', field: 'description', value: 'Da engenharia ao resultado final: kits prontos para instalação, qualidade garantida e agilidade para sua obra.' },
    { id: 4, section: 'hero', field: 'buttonText', value: 'Solicitar Cotação' },
    { id: 5, section: 'hero', field: 'videoButtonText', value: 'Ver Vídeo' },

    // Vantagens Section
    { id: 6, section: 'vantagens', field: 'title', value: 'Vantagens dos Kits Braspex' },
    { id: 7, section: 'vantagens', field: 'subtitle', value: 'Por que escolher nossas soluções?' },
    { id: 8, section: 'vantagens', field: 'vantagem1', value: 'Qualidade Garantida' },
    { id: 9, section: 'vantagens', field: 'vantagem2', value: 'Entrega Rápida' },
    { id: 10, section: 'vantagens', field: 'vantagem3', value: 'Suporte Técnico' },
    { id: 11, section: 'vantagens', field: 'vantagem4', value: 'Preço Competitivo' },

    // Parceiros Section
    { id: 12, section: 'parceiros', field: 'title', value: 'Parceiros de Confiança' },
    { id: 13, section: 'parceiros', field: 'subtitle', value: 'Trabalhamos com as melhores empresas do mercado' },

    // Comparação Section
    { id: 14, section: 'comparacao', field: 'title', value: 'Tradicional vs BRASPEX' },
    { id: 15, section: 'comparacao', field: 'subtitle', value: 'Veja as vantagens da nossa metodologia' },

    // Kits Section
    { id: 16, section: 'kits', field: 'title', value: 'Nossos Kits' },
    { id: 17, section: 'kits', field: 'subtitle', value: 'Soluções completas para sua necessidade' },
    { id: 18, section: 'kits', field: 'kit1Title', value: 'Kit Residencial' },
    { id: 19, section: 'kits', field: 'kit1Description', value: 'Ideal para casas e pequenos projetos' },
    { id: 20, section: 'kits', field: 'kit2Title', value: 'Kit Comercial' },
    { id: 21, section: 'kits', field: 'kit2Description', value: 'Perfeito para estabelecimentos comerciais' },
    { id: 22, section: 'kits', field: 'kit3Title', value: 'Kit Industrial' },
    { id: 23, section: 'kits', field: 'kit3Description', value: 'Robusto para grandes estruturas' },

    // Fluxo Section
    { id: 24, section: 'fluxo', field: 'title', value: 'Como Funciona' },
    { id: 25, section: 'fluxo', field: 'subtitle', value: 'Nosso processo simplificado' },
    { id: 26, section: 'fluxo', field: 'step1', value: 'Análise do Projeto' },
    { id: 27, section: 'fluxo', field: 'step2', value: 'Desenvolvimento da Solução' },
    { id: 28, section: 'fluxo', field: 'step3', value: 'Fabricação dos Componentes' },
    { id: 29, section: 'fluxo', field: 'step4', value: 'Entrega e Montagem' },

    // Contato Section
    { id: 30, section: 'contato', field: 'title', value: 'Fale Conosco' },
    { id: 31, section: 'contato', field: 'subtitle', value: 'Estamos prontos para ajudar você' },
    { id: 32, section: 'contato', field: 'phone', value: '(11) 99999-9999' },
    { id: 33, section: 'contato', field: 'email', value: 'contato@braspex.com.br' },
    { id: 34, section: 'contato', field: 'address', value: 'São Paulo, SP' },

    // Footer Section
    { id: 35, section: 'footer', field: 'description', value: 'BRASPEX - Soluções industrializadas para construção civil' },
    { id: 36, section: 'footer', field: 'copyright', value: '© 2024 BRASPEX. Todos os direitos reservados.' }
  ],

  // Analytics com dados realistas
  analytics: [
    // Visitas dos últimos 30 dias
    ...Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const visitCount = Math.floor(Math.random() * 50) + 10; // 10-60 visitas por dia
      
      return Array.from({ length: visitCount }, (_, j) => ({
        id: i * 100 + j,
        date: new Date(date.getTime() + j * 1000 * 60 * Math.random()).toISOString(),
        user_agent: [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          'Mozilla/5.0 (Android 11; Mobile; rv:68.0)'
        ][Math.floor(Math.random() * 5)],
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        page: ['/', '/kits', '/contato', '/vantagens'][Math.floor(Math.random() * 4)]
      }));
    }).flat()
  ]
};

// Função para simular delay da API
export const mockApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};