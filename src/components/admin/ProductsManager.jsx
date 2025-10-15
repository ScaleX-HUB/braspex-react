import React, { useState, useEffect } from 'react';
import { Package, Plus, PencilSimple, Trash, Eye, Upload, Image as ImageIcon, CurrencyCircleDollar, ArrowsClockwise } from 'phosphor-react';
import { productsAPI } from '../../services/productsAPI';
import { loadCategories, useCategoriesSync } from '../../data/productsUtils';

const ProductsManager = () => {
  const [categories, setCategories] = useState({});
  const [categoriesArray, setCategoriesArray] = useState([]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    image: '',
    price: '',
    specifications: {
      material: '',
      capacity: '',
      dimensions: '',
      acabamento: '',
      diametros: [],
      normas: []
    },
    active: true
  });

  // Garantir que specifications sempre existe
  useEffect(() => {
    if (!formData.specifications) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          material: '',
          capacity: '',
          dimensions: '',
          acabamento: '',
          diametros: [],
          normas: []
        }
      }));
    }
  }, [formData]);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const cats = loadCategories();
    setCategories(cats);
    setCategoriesArray(Object.values(cats));
    loadProducts();
  }, []);

  // Sincronizar quando categorias forem atualizadas
  useCategoriesSync((updatedCategories) => {
    setCategories(updatedCategories);
    setCategoriesArray(Object.values(updatedCategories));
  });

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedSubcategory, products]);

  const loadProducts = async () => {
    try {
      const productsData = await productsAPI.getAll(true); // true = incluir inativos no admin
      console.log('✅ Produtos carregados do Supabase:', productsData.length);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos do Supabase: ' + error.message);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategoryId === selectedSubcategory);
    }

    setFilteredProducts(filtered);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      image: '',
      price: '',
      specifications: {
        material: '',
        capacity: '',
        dimensions: '',
        normas: []
      },
      active: true
    });
    setImagePreview('');
    setIsEditing(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    setIsEditing(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productsAPI.delete(id);
        await loadProducts(); // Recarregar do Supabase
        alert('Produto excluído com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao excluir produto:', error);
        alert('Erro ao excluir produto: ' + error.message);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular upload - na prática você faria upload para Supabase Storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      alert('Por favor, preencha pelo menos o nome e a categoria');
      return;
    }

    try {
      if (currentProduct) {
        // Atualizar produto existente
        await productsAPI.update(currentProduct.id, formData);
        alert('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        await productsAPI.create(formData);
        alert('Produto criado com sucesso!');
      }

      await loadProducts(); // Recarregar do Supabase
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const getCategoryName = (catId) => {
    const cat = categoriesArray.find(c => c.id === catId);
    return cat?.name || catId;
  };

  const getSubcategoryName = (catId, subId) => {
    const cat = categoriesArray.find(c => c.id === catId);
    const sub = cat?.subcategories?.find(s => s.id === subId);
    return sub?.name || subId;
  };

  const availableSubcategories = formData.categoryId 
    ? categoriesArray.find(c => c.id === formData.categoryId)?.subcategories || []
    : [];

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
            >
              <Plus size={20} weight="bold" />
              {currentProduct ? 'Atualizar Produto' : 'Criar Produto'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Imagem do Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Produto
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload size={20} />
                  Upload de Imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Recomendado: JPG ou PNG, máximo 2MB
                </p>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Ou cole a URL da imagem"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Nome e Descrição */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Ex: Kit PPR Completo - Água Quente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Descrição detalhada do produto"
              />
            </div>
          </div>

          {/* Categoria e Subcategoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  categoryId: e.target.value,
                  subcategoryId: '' 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categoriesArray.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoria
              </label>
              <select
                value={formData.subcategoryId}
                onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                disabled={!formData.categoryId}
              >
                <option value="">Selecione uma subcategoria</option>
                {availableSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preço (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CurrencyCircleDollar size={20} />
              Preço (Opcional)
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Ex: R$ 1.250,00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Deixe em branco para "Consultar Preço"
            </p>
          </div>

          {/* Especificações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Especificações Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.specifications?.material || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...(formData.specifications || {}), material: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="Ex: PPR, PEX, Latão"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade
                </label>
                <input
                  type="text"
                  value={formData.specifications?.capacity || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...(formData.specifications || {}), capacity: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="Ex: Até 90°C, 10 bar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensões
                </label>
                <input
                  type="text"
                  value={formData.specifications?.dimensions || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...(formData.specifications || {}), dimensions: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="Ex: 20mm, 25mm, 32mm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acabamento
                </label>
                <input
                  type="text"
                  value={formData.specifications?.acabamento || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...(formData.specifications || {}), acabamento: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="Ex: Natural, Cromado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetros (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.diametros?.join(', ') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { 
                      ...(formData.specifications || {}), 
                      diametros: e.target.value.split(',').map(n => n.trim()).filter(n => n)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder='Ex: 1/2", 3/4", 1"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Normas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.normas?.join(', ') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { 
                      ...(formData.specifications || {}), 
                      normas: e.target.value.split(',').map(n => n.trim()).filter(n => n)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  placeholder="Ex: NBR 15884, ISO 21003"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-[#005563] focus:ring-[#005563] border-gray-300 rounded"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Produto ativo (visível no site)
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package size={32} weight="bold" />
            Gerenciar Produtos
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} de {products.length} produtos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (window.confirm('Tem certeza que deseja restaurar os produtos originais? Todas as alterações serão perdidas.')) {
                const restored = await restoreOriginalProducts();
                setProducts(restored);
                setFilteredProducts(restored);
                alert('Produtos originais restaurados com sucesso!');
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowsClockwise size={20} weight="bold" />
            Restaurar Originais
          </button>
          <button
            onClick={handleNewProduct}
            className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
          >
            <Plus size={20} weight="bold" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
            >
              <option value="all">Todas as Categorias</option>
              {categoriesArray.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategoria
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              disabled={selectedCategory === 'all'}
            >
              <option value="all">Todas as Subcategorias</option>
              {selectedCategory !== 'all' && 
                categoriesArray
                  .find(c => c.id === selectedCategory)
                  ?.subcategories?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))
              }
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Nenhum produto encontrado</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagem */}
              <div className="relative h-48 bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={64} className="text-gray-300" />
                  </div>
                )}
                {!product.active && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    INATIVO
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {getCategoryName(product.categoryId)}
                  </span>
                  {product.subcategoryId && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                      {getSubcategoryName(product.categoryId, product.subcategoryId)}
                    </span>
                  )}
                </div>

                {product.price && (
                  <div className="text-lg font-bold text-[#005563]">
                    {product.price}
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <PencilSimple size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsManager;
