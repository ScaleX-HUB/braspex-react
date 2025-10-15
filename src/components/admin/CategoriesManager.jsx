import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  FloppyDisk, 
  X,
  Tag,
  FolderOpen,
  ArrowsClockwise
} from 'phosphor-react';

// Funções de gerenciamento de categorias
const STORAGE_KEY = 'braspex_categories';

const loadCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erro ao carregar categorias:', e);
  }
  
  // Fallback para categorias padrão
  return {
    pex: {
      id: 'pex',
      name: 'pex',
      displayName: 'PEX',
      logo: '/pex-logo.png',
      color: '#005563',
      subcategories: [
        { id: 'conexoes', name: 'Conexões' },
        { id: 'ferramentas', name: 'Ferramentas' },
        { id: 'tubos', name: 'Tubos' },
        { id: 'valvulas', name: 'Válvulas' }
      ]
    },
    gas: {
      id: 'gas',
      name: 'gas',
      displayName: 'GÁS',
      logo: '/gas-logo.png',
      color: '#FF6B00',
      subcategories: [
        { id: 'reguladores', name: 'Reguladores' },
        { id: 'mangueiras', name: 'Mangueiras' },
        { id: 'conexoes', name: 'Conexões' }
      ]
    },
    kit: {
      id: 'kit',
      name: 'kit',
      displayName: 'KIT',
      logo: '/kit-logo.png',
      color: '#FFD027',
      subcategories: [
        { id: 'residencial', name: 'Residencial' },
        { id: 'industrial', name: 'Industrial' },
        { id: 'comercial', name: 'Comercial' }
      ]
    },
    polvo: {
      id: 'polvo',
      name: 'polvo',
      displayName: 'POLVO',
      logo: '/polvo-logo.png',
      color: '#00A86B',
      subcategories: []
    },
    outros: {
      id: 'outros',
      name: 'outros',
      displayName: 'OUTROS',
      logo: '/outros-logo.png',
      color: '#6C757D',
      subcategories: []
    }
  };
};

const saveCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    // Disparar evento para sincronização
    window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }));
    return true;
  } catch (e) {
    console.error('Erro ao salvar categorias:', e);
    return false;
  }
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    displayName: '',
    logo: '',
    color: '#005563',
    subcategories: []
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    const cats = loadCategories();
    setCategories(cats);
  }, []);

  const handleNewCategory = () => {
    setFormData({
      id: '',
      name: '',
      displayName: '',
      logo: '',
      color: '#005563',
      subcategories: []
    });
    setEditingCategory(null);
    setIsEditing(true);
  };

  const handleEditCategory = (catId) => {
    const cat = categories[catId];
    setFormData({
      id: cat.id,
      name: cat.name,
      displayName: cat.displayName,
      logo: cat.logo || '',
      color: cat.color || '#005563',
      subcategories: cat.subcategories || []
    });
    setEditingCategory(catId);
    setIsEditing(true);
  };

  const handleDeleteCategory = (catId) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria? Todos os produtos desta categoria ficarão sem categoria.')) {
      const updatedCategories = { ...categories };
      delete updatedCategories[catId];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      alert('Categoria deletada com sucesso!');
    }
  };

  const handleSaveCategory = () => {
    if (!formData.id || !formData.displayName) {
      alert('Por favor, preencha pelo menos o ID e o Nome de Exibição');
      return;
    }

    // Gerar name baseado no id se não fornecido
    const categoryData = {
      ...formData,
      name: formData.name || formData.id
    };

    const updatedCategories = {
      ...categories,
      [formData.id]: categoryData
    };

    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setIsEditing(false);
    alert(editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
  };

  const handleAddSubcategory = () => {
    if (!subcategoryForm.id || !subcategoryForm.name) {
      alert('Preencha ID e Nome da subcategoria');
      return;
    }

    const newSubcategory = {
      id: subcategoryForm.id,
      name: subcategoryForm.name
    };

    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, newSubcategory]
    });

    setSubcategoryForm({ id: '', name: '' });
  };

  const handleRemoveSubcategory = (index) => {
    const updatedSubcategories = formData.subcategories.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subcategories: updatedSubcategories
    });
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar as categorias padrão? Todas as alterações serão perdidas.')) {
      localStorage.removeItem(STORAGE_KEY);
      const defaultCategories = loadCategories();
      setCategories(defaultCategories);
      alert('Categorias padrão restauradas com sucesso!');
    }
  };

  const categoriesArray = Object.values(categories);

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="space-y-6">
          {/* ID e Display Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID da Categoria * (sem espaços, minúsculo)
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s/g, '') })}
                disabled={!!editingCategory}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent disabled:bg-gray-100"
                placeholder="ex: pex, gas, kit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Exibição *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="ex: PEX, GÁS, KIT"
              />
            </div>
          </div>

          {/* Name (internal) e Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (interno, opcional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Preenche automaticamente se vazio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor (HEX)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="#005563"
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Logo
            </label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="/pex-logo.png"
            />
            {formData.logo && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                <span className="text-sm text-gray-600">Preview:</span>
                <img src={formData.logo} alt="Logo preview" className="h-12 object-contain" />
              </div>
            )}
          </div>

          {/* Subcategorias */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FolderOpen size={20} weight="bold" />
              Subcategorias
            </h3>

            {/* Lista de Subcategorias */}
            {formData.subcategories.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.subcategories.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{sub.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({sub.id})</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSubcategory(index)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar Subcategoria */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                value={subcategoryForm.id}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, id: e.target.value.toLowerCase().replace(/\s/g, '') })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="ID da subcategoria (ex: conexoes)"
              />
              <input
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Nome (ex: Conexões)"
              />
            </div>
            <button
              onClick={handleAddSubcategory}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} weight="bold" />
              Adicionar Subcategoria
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleSaveCategory}
              className="flex-1 px-6 py-3 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <FloppyDisk size={20} weight="bold" />
              Salvar Categoria
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag size={28} weight="bold" className="text-[#005563]" />
              Gerenciar Categorias
            </h2>
            <p className="text-gray-600 mt-1">
              Adicione, edite ou remova categorias e subcategorias de produtos
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRestoreDefaults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <ArrowsClockwise size={20} weight="bold" />
              Restaurar Padrão
            </button>
            <button
              onClick={handleNewCategory}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
            >
              <Plus size={20} weight="bold" />
              Nova Categoria
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesArray.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header da Categoria */}
            <div 
              className="p-4 text-white"
              style={{ backgroundColor: category.color || '#005563' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{category.displayName}</h3>
                {category.logo && (
                  <img src={category.logo} alt={category.displayName} className="h-8 object-contain opacity-80" />
                )}
              </div>
              <p className="text-sm opacity-90">ID: {category.id}</p>
            </div>

            {/* Subcategorias */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Subcategorias ({category.subcategories?.length || 0})
              </h4>
              {category.subcategories && category.subcategories.length > 0 ? (
                <div className="space-y-1 mb-4">
                  {category.subcategories.map((sub) => (
                    <div key={sub.id} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-[#005563]">•</span>
                      {sub.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4">Nenhuma subcategoria</p>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category.id)}
                  className="flex-1 px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center justify-center gap-2"
                >
                  <PencilSimple size={18} weight="bold" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categoriesArray.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <Tag size={48} weight="light" className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Nenhuma categoria cadastrada</p>
          <button
            onClick={handleNewCategory}
            className="px-6 py-3 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} weight="bold" />
            Criar Primeira Categoria
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
