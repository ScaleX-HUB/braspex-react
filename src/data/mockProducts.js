// Dados de exemplo de produtos para demonstração
// Baseado nas imagens de referência fornecidas

export const mockProducts = [
  // Produtos PEX - Conexões
  {
    id: 1,
    name: 'Adaptador Cobre Solda - PEX',
    description: 'Adaptador para conexão entre tubos de cobre e PEX com solda',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/adaptador-cobre-solda-pex.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural',
      normas: ['NBR 15939']
    },
    active: true
  },
  {
    id: 2,
    name: 'Anel',
    description: 'Anel de vedação para conexões PEX',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/anel-pex.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural'
    },
    active: true
  },
  {
    id: 3,
    name: 'Bucha de Redução (Macho/Fêmea)',
    description: 'Bucha de redução para conexões de diferentes diâmetros',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/bucha-reducao.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural',
      diametros: ['1/2" x 3/4"', '3/4" x 1"']
    },
    active: true
  },
  {
    id: 4,
    name: 'Misturador Tipo "Ducha"',
    description: 'Misturador de água fria e quente para ducha higiênica',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/misturador-ducha.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Cromado',
      tipo: 'Embutir'
    },
    active: true
  },
  {
    id: 5,
    name: 'Niple (Macho/Macho)',
    description: 'Niple de redução macho/macho em latão',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/niple-macho-macho.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural',
      diametros: ['1/2"', '3/4"', '1"']
    },
    active: true
  },
  {
    id: 6,
    name: 'Niple de Redução (Macho/Macho)',
    description: 'Niple de redução para conexão de tubos de diferentes diâmetros',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/niple-reducao.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural'
    },
    active: true
  },
  {
    id: 7,
    name: 'Conector Curto com Rosca Fêmea Móvel',
    description: 'Conector curto com rosca fêmea móvel para instalações hidráulicas',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/conector-curto-rosca.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural'
    },
    active: true
  },
  {
    id: 8,
    name: 'Conector Fixo com Rosca Fêmea',
    description: 'Conector fixo com rosca fêmea para tubos PEX',
    categoryId: 'pex',
    subcategoryId: 'pex-conexoes',
    image: '/products/conector-fixo-rosca.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural'
    },
    active: true
  },

  // Produtos GAS - Conexões
  {
    id: 101,
    name: 'Conexão GAS para Gás Natural',
    description: 'Conexão especial para instalações de gás natural',
    categoryId: 'gas',
    subcategoryId: 'gas-conexoes',
    image: '/products/conexao-gas-natural.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural',
      normas: ['NBR 15526']
    },
    active: true
  },
  {
    id: 102,
    name: 'Conector GAS Reto',
    description: 'Conector reto para tubulação de gás',
    categoryId: 'gas',
    subcategoryId: 'gas-conexoes',
    image: '/products/conector-gas-reto.jpg',
    specifications: {
      material: 'Latão',
      acabamento: 'Natural'
    },
    active: true
  },

  // Produtos GAS - Tubos
  {
    id: 103,
    name: 'Tubo PEX Amarelo para Gás',
    description: 'Tubo PEX amarelo específico para instalações de gás',
    categoryId: 'gas',
    subcategoryId: 'gas-tubos',
    image: '/products/tubo-pex-gas.jpg',
    specifications: {
      material: 'PEX',
      cor: 'Amarelo',
      diametros: ['16mm', '20mm', '25mm'],
      normas: ['NBR 15526']
    },
    active: true
  },

  // Produtos KIT - Kits Hidráulicos
  {
    id: 201,
    name: 'Kit Hidráulico Completo - Banheiro',
    description: 'Kit completo para instalação hidráulica de banheiro',
    categoryId: 'kit',
    subcategoryId: 'kit-hidraulicos',
    image: '/products/kit-banheiro.jpg',
    specifications: {
      itens_inclusos: [
        'Tubos PEX',
        'Conexões',
        'Registros',
        'Suportes',
        'Abraçadeiras'
      ]
    },
    active: true
  },

  // Produtos KIT - Componentes
  {
    id: 202,
    name: 'Te Ducha Higiênica',
    description: 'Te para instalação de ducha higiênica',
    categoryId: 'kit',
    subcategoryId: 'kit-componentes',
    childId: 'kit-te-ducha',
    subchildId: 'kit-te-ducha-item',
    image: '/products/te-ducha.jpg',
    specifications: {
      material: 'Latão cromado',
      tipo: 'Embutir'
    },
    active: true
  },
  {
    id: 203,
    name: 'Tampa de Inspeção',
    description: 'Tampa de inspeção para caixa de passagem',
    categoryId: 'kit',
    subcategoryId: 'kit-componentes',
    childId: 'kit-te-ducha',
    subchildId: 'kit-tampa-inspecao',
    image: '/products/tampa-inspecao.jpg',
    specifications: {
      material: 'ABS',
      cor: 'Branco'
    },
    active: true
  },

  // Produtos POLVO
  {
    id: 301,
    name: 'Sistema Polvo Multicamada',
    description: 'Sistema polvo com tubo multicamada para distribuição',
    categoryId: 'polvo',
    subcategoryId: null,
    image: '/products/polvo-multicamada.jpg',
    specifications: {
      material: 'Multicamada',
      aplicacao: 'Água fria e quente'
    },
    active: true
  },

  // Outros - Rayper
  {
    id: 401,
    name: 'Perfil Rayper 20x20',
    description: 'Perfil estrutural Rayper para fixação',
    categoryId: 'outros',
    subcategoryId: 'outros-rayper',
    image: '/products/rayper-perfil.jpg',
    specifications: {
      dimensoes: '20x20mm',
      material: 'Aço galvanizado'
    },
    active: true
  },

  // Outros - Smartban
  {
    id: 402,
    name: 'Sistema Smartban',
    description: 'Sistema inteligente de gerenciamento hidráulico',
    categoryId: 'outros',
    subcategoryId: 'outros-smartban',
    image: '/products/smartban-sistema.jpg',
    specifications: {
      tipo: 'Digital',
      conectividade: 'Wi-Fi'
    },
    active: true
  }
];

// Helper functions para produtos
export const getProductsByCategory = (categoryId, subcategoryId = null, childId = null, subchildId = null) => {
  return mockProducts.filter(product => {
    if (!product.active) return false;
    if (product.categoryId !== categoryId) return false;
    if (subcategoryId && product.subcategoryId !== subcategoryId) return false;
    if (childId && product.childId !== childId) return false;
    if (subchildId && product.subchildId !== subchildId) return false;
    return true;
  });
};

export const getProductById = (productId) => {
  return mockProducts.find(product => product.id === productId);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.active && (
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getAllActiveProducts = () => {
  return mockProducts.filter(product => product.active);
};
