// Estrutura de categorias e subcategorias de produtos
export const productCategories = {
  PEX: {
    id: 'pex',
    name: 'PEX',
    displayName: 'Linha Pex ',
    logo: '/imagempert.png', // Logo vermelho
    color: '#E31E24', // Vermelho
    subcategories: [
      {
        id: 'pex-conexoes',
        name: 'Conexões',
        slug: 'conexoes'
      },
      {
        id: 'pex-ferramentas',
        name: 'Ferramentas',
        slug: 'ferramentas'
      },
      {
        id: 'pex-tubos',
        name: 'Tubos',
        slug: 'tubos'
      },
      {
        id: 'pex-valvulas',
        name: 'Válvulas / Registros',
        slug: 'valvulas-registros'
      }
    ]
  },
  GAS: {
    id: 'gas',
    name: 'GAS',
    displayName: 'Linha Pex Gás',
    logo: '/imagemppr.png', // Logo amarelo  AS
    color: '#FFD027', // Amarelo
    subcategories: [
      {
        id: 'gas-conexoes',
        name: 'Conexões',
        slug: 'conexoes'
      },
      {
        id: 'gas-ferramentas',
        name: 'Ferramentas',
        slug: 'ferramentas'
      },
      {
        id: 'gas-tubos',
        name: 'Tubos',
        slug: 'tubos'
      }
    ]
  },
  KIT: {
    id: 'kit',
    name: 'KIT',
    displayName: 'Sistema Kit',
    logo: '/kitsbraspex.png', // Logo cinza KIT
    color: '#6B7280', // Cinza
    subcategories: [
      {
        id: 'kit-hidraulicos',
        name: 'Kits Hidráulicos',
        slug: 'kits-hidraulicos'
      },
      {
        id: 'kit-componentes',
        name: 'Componentes para Kits Hidráulicos',
        slug: 'componentes-kits-hidraulicos',
        children: [
          {
            id: 'kit-te-ducha',
            name: 'Te Ducha Higiênica',
            slug: 'te-ducha-higienica',
            children: [
              { id: 'kit-te-ducha-item', name: 'Te Ducha Higiênica', slug: 'te-ducha-higienica-item' },
              { id: 'kit-tampa-inspecao', name: 'Tampa de Inspeção', slug: 'tampa-inspecao' },
              { id: 'kit-ponto-filtro', name: 'Ponto de Filtro', slug: 'ponto-filtro' },
              { id: 'kit-coifas', name: 'Coifas Vedantes', slug: 'coifas-vedantes' },
              { id: 'kit-capa-cromada', name: 'Capa Cromada', slug: 'capa-cromada' },
              { id: 'kit-abracadeiras', name: 'Abraçadeiras', slug: 'abracadeiras' }
            ]
          }
        ]
      }
    ]
  },
  POLVO: {
    id: 'polvo',
    name: 'POLVO',
    displayName: 'Sistema Polvo',
    logo: '/multicamadaairtecno.png', // Logo verde POLVO
    color: '#10B981', // Verde
    subcategories: []
  },
  OUTROS: {
    id: 'outros',
    name: 'OUTROS',
    displayName: 'Outros Sistemas',
    color: '#005563', // Cor principal do site
    subcategories: [
      {
        id: 'outros-rayper',
        name: 'Rayper',
        slug: 'rayper'
      },
      {
        id: 'outros-smartban',
        name: 'Smartban',
        slug: 'smartban'
      },
      {
        id: 'outros-assessoria',
        name: 'Assessoria / Projetos para sistemas industrializados',
        slug: 'assessoria-projetos'
      }
    ]
  }
};

// Helper function para obter todas as categorias principais
export const getMainCategories = () => {
  return Object.values(productCategories);
};

// Helper function para obter uma categoria pelo ID
export const getCategoryById = (categoryId) => {
  return Object.values(productCategories).find(cat => cat.id === categoryId);
};

// Helper function para obter uma subcategoria
export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  
  return category.subcategories.find(sub => sub.id === subcategoryId);
};

// Helper function para criar estrutura plana de navegação
export const getFlatNavigationStructure = () => {
  const structure = [];
  
  Object.values(productCategories).forEach(category => {
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(subcategory => {
        structure.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
          slug: `${category.id}/${subcategory.slug}`
        });
        
        // Adicionar children se existirem
        if (subcategory.children) {
          subcategory.children.forEach(child => {
            structure.push({
              categoryId: category.id,
              categoryName: category.name,
              subcategoryId: subcategory.id,
              subcategoryName: subcategory.name,
              childId: child.id,
              childName: child.name,
              slug: `${category.id}/${subcategory.slug}/${child.slug}`
            });
            
            // Adicionar sub-children se existirem
            if (child.children) {
              child.children.forEach(subchild => {
                structure.push({
                  categoryId: category.id,
                  categoryName: category.name,
                  subcategoryId: subcategory.id,
                  subcategoryName: subcategory.name,
                  childId: child.id,
                  childName: child.name,
                  subchildId: subchild.id,
                  subchildName: subchild.name,
                  slug: `${category.id}/${subcategory.slug}/${child.slug}/${subchild.slug}`
                });
              });
            }
          });
        }
      });
    }
  });
  
  return structure;
};
