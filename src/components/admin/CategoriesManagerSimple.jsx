import React, { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash, X, Package, Fire, Lightning, Gear, Cube } from 'phosphor-react';
import { categoriesAPI } from '../../services/categoriesAPI';

// Ícones disponíveis
const iconMap = { Package, Fire, Lightning, Gear, Cube };

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    icon: 'Package',
    color: '#005563',
    subcategories: []
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAllArray(); // Nova função que retorna array
      setCategories(data);
      console.log('✅ Categorias carregadas:', data);
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias: ' + error.message);
    }
  };

  const handleNewCategory = () => {
    setFormData({
      name: '',
      displayName: '',
      icon: 'Package',
      color: '#005563',
      subcategories: []
    });
    setEditingCategory(null);
    setIsEditing(true);
  };

  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      displayName: category.display_name || category.displayName,
      icon: category.icon || 'Package',
      color: category.color || '#005563',
      subcategories: category.subcategories || []
    });
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.displayName) {
      alert('Preencha o nome da categoria');
      return;
    }

    try {
      console.log('💾 Salvando categoria:', formData);

      const categoryData = {
        id: editingCategory?.id || null, // UUID se editando, null se criando
        name: formData.name || formData.displayName.toLowerCase().replace(/\s+/g, '-'),
        display_name: formData.displayName,
        icon: formData.icon,
        color: formData.color,
        subcategories: formData.subcategories,
        active: true,
        order_index: editingCategory?.order_index || categories.length + 1
      };

      if (editingCategory) {
        // Atualizar
        await categoriesAPI.update(editingCategory.id, categoryData);
        alert('Categoria atualizada com sucesso!');
      } else {
        // Criar
        await categoriesAPI.create(categoryData);
        alert('Categoria criada com sucesso!');
      }

      await loadCategories();
      setIsEditing(false);
      setEditingCategory(null);

      // Disparar evento
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    } catch (error) {
      console.error('❌ Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria: ' + error.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!confirm(`Deletar categoria "${category.display_name}"?`)) return;

    try {
      await categoriesAPI.deleteById(category.id);
      alert('Categoria deletada com sucesso!');
      await loadCategories();
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      alert('Erro ao deletar categoria: ' + error.message);
    }
  };

  const handleAddSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [
        ...formData.subcategories,
        { id: `sub-${Date.now()}`, name: '' }
      ]
    });
  };

  const handleRemoveSubcategory = (index) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index)
    });
  };

  const handleSubcategoryChange = (index, value) => {
    const newSubs = [...formData.subcategories];
    newSubs[index] = { ...newSubs[index], name: value };
    setFormData({ ...formData, subcategories: newSubs });
  };

  const IconComponent = iconMap[formData.icon] || Package;

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCategory}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450]"
            >
              Salvar Categoria
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Nome da Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Categoria *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563]"
              placeholder="Ex: Linha Pex"
            />
          </div>

          {/* Ícone e Cor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563]"
              >
                <option value="Package">Package</option>
                <option value="Fire">Fire</option>
                <option value="Lightning">Lightning</option>
                <option value="Gear">Gear</option>
                <option value="Cube">Cube</option>
              </select>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <IconComponent size={24} weight="bold" />
                Preview do ícone
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 px-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Subcategorias */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Subcategorias ({formData.subcategories.length})
              </label>
              <button
                onClick={handleAddSubcategory}
                className="text-sm text-[#005563] hover:underline flex items-center gap-1"
              >
                <Plus size={16} weight="bold" />
                Adicionar Subcategoria
              </button>
            </div>

            {formData.subcategories.map((sub, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                  placeholder="Nome da subcategoria"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563]"
                />
                <button
                  onClick={() => handleRemoveSubcategory(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            ))}

            {formData.subcategories.length === 0 && (
              <p className="text-sm text-gray-500 italic">Nenhuma subcategoria</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h2>
          <p className="text-gray-600 mt-1">Adicione, edite ou remova categorias de produtos</p>
        </div>
        <button
          onClick={handleNewCategory}
          className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] flex items-center gap-2"
        >
          <Plus size={20} weight="bold" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Package;
          return (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              style={{ borderTopColor: category.color, borderTopWidth: '4px' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon size={24} weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{category.display_name}</h3>
                      <p className="text-sm text-gray-500">ID: {category.name}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Subcategorias ({category.subcategories?.length || 0})
                  </p>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {category.subcategories.map((sub, idx) => (
                        <li key={idx}>• {sub.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Nenhuma subcategoria</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 px-3 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] flex items-center justify-center gap-2"
                  >
                    <PencilSimple size={18} weight="bold" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhuma categoria encontrada</p>
          <button
            onClick={handleNewCategory}
            className="mt-4 text-[#005563] hover:underline"
          >
            Criar primeira categoria
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
