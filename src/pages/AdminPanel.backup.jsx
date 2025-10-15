import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Eye, Users, Calendar, ChartBar, FloppyDisk, ArrowLeft, Package, Plus, Trash, PencilSimple, ArrowUp, ArrowDown, Database, CheckCircle, XCircle, Warning } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/productsAPI';
import { supabase } from '../lib/supabaseClient';

const AdminPanel = () => {
  const { content, analytics, updateContent, resetContent, loading } = useSiteContent();
  const [activeSection, setActiveSection] = useState('analytics');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [supabaseTest, setSupabaseTest] = useState(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const navigate = useNavigate();

  const sections = [
    { id: 'analytics', name: 'Analytics', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'supabase-test', name: 'Teste Supabase', icon: <Database className="w-5 h-5" /> },
    { id: 'produtos', name: 'Produtos', icon: <Package className="w-5 h-5" /> },
    { id: 'hero', name: 'Hero/Banner', icon: <Eye className="w-5 h-5" /> },
    { id: 'vantagens', name: 'Vantagens', icon: <Users className="w-5 h-5" /> },
    { id: 'parceiros', name: 'Parceiros', icon: <Users className="w-5 h-5" /> },
    { id: 'comparacao', name: 'Comparação', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'fluxo', name: 'Fluxo', icon: <Calendar className="w-5 h-5" /> },
    { id: 'contato', name: 'Contato', icon: <Users className="w-5 h-5" /> },
    { id: 'footer', name: 'Footer', icon: <Eye className="w-5 h-5" /> }
  ];

  // Carregar produtos do Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      
      // Tentar buscar do Supabase primeiro
      try {
        const data = await productsAPI.getAll(true); // Incluir inativos no admin
        console.log('✅ Produtos carregados do Supabase:', data.length);
        setProducts(data);
      } catch (supabaseError) {
        // Se falhar, usar mockProducts como fallback
        console.warn('⚠️ Supabase não disponível, usando mockProducts:', supabaseError.message);
        const { mockProducts } = await import('../data/mockProducts');
        console.log('✅ Produtos carregados do mockProducts:', mockProducts.length);
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      // Último fallback: array vazio
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Função refresh para recarregar produtos
  const refresh = () => {
    loadProducts();
  };

  const handleContentChange = async (section, field, value) => {
    // Atualizar imediatamente o estado local para responsividade
    setUnsavedChanges(true);
    
    // Salvar no Supabase/localStorage em background
    try {
      await updateContent(section, field, value);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleSave = async () => {
    try {
      // As alterações já são salvas automaticamente pelo updateContent
      setUnsavedChanges(false);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar alterações: ' + error.message);
    }
  };

  // Funções de gerenciamento de produtos
  const handleAddProduct = () => {
    setEditingProduct({
      id: null,
      name: '',
      description: '',
      category_id: '',
      subcategory_id: '',
      image_url: '',
      specifications: {},
      active: true,
      featured: false,
      order_index: products.length
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await supabase.delete('products', { id: productId });
        refresh();
        alert('Produto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir produto: ' + error.message);
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.category_id) {
      alert('Por favor, preencha o nome e a categoria do produto.');
      return;
    }

    try {
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description || '',
        category_id: editingProduct.category_id,
        subcategory_id: editingProduct.subcategory_id || null,
        image_url: editingProduct.image_url || '',
        specifications: editingProduct.specifications || {},
        active: editingProduct.active !== false,
        featured: editingProduct.featured || false,
        order_index: editingProduct.order_index || products.length
      };

      console.log('💾 Salvando produto:', productData);

      try {
        // Tentar salvar no Supabase primeiro
        if (editingProduct.id) {
          console.log('📝 Atualizando produto ID:', editingProduct.id);
          const result = await supabase.update('products', { id: editingProduct.id }, productData);
          console.log('✅ Produto atualizado no Supabase:', result);
          alert('Produto atualizado com sucesso!');
        } else {
          console.log('➕ Adicionando novo produto no Supabase');
          const result = await supabase.insert('products', productData);
          console.log('✅ Produto adicionado no Supabase:', result);
          alert('Produto adicionado com sucesso!');
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase não disponível:', supabaseError.message);
        
        // Fallback: salvar nos mockProducts (localStorage)
        const { mockProducts, saveProducts } = await import('../data/mockProducts');
        const productsArray = [...mockProducts];
        
        if (editingProduct.id) {
          // Atualizar produto existente
          const index = productsArray.findIndex(p => p.id === editingProduct.id);
          if (index !== -1) {
            productsArray[index] = { 
              ...productsArray[index], 
              ...productData,
              // Converter campos para formato mockProducts
              categoryId: productData.category_id,
              subcategoryId: productData.subcategory_id,
              image: productData.image_url
            };
            console.log('✅ Produto atualizado nos mockProducts');
          }
        } else {
          // Adicionar novo produto
          const newProduct = {
            id: Math.max(...productsArray.map(p => p.id), 0) + 1,
            ...productData,
            // Converter campos para formato mockProducts
            categoryId: productData.category_id,
            subcategoryId: productData.subcategory_id,
            image: productData.image_url,
            created_at: new Date().toISOString()
          };
          productsArray.push(newProduct);
          console.log('✅ Produto adicionado nos mockProducts:', newProduct);
        }
        
        // Salvar no localStorage
        saveProducts(productsArray);
        
        alert('⚠️ Supabase indisponível.\n\n✅ Produto salvo localmente!\n\n💡 Execute o SQL para criar a tabela e sincronizar.\n\n🔄 Recarregue a página para ver as alterações.');
      }

      refresh();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('❌ Erro ao salvar produto:', error);
      console.error('Stack trace:', error.stack);
      alert(`Erro ao salvar produto:\n\n${error.message}\n\nVerifique o console (F12) para mais detalhes.`);
    }
  };

  // Função para converter imagem local para base64
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Nenhum arquivo selecionado'));
        return;
      }

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        reject(new Error('Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.'));
        return;
      }

      // Validar tamanho (máximo 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        reject(new Error('Arquivo muito grande. Tamanho máximo: 2MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64 = e.target.result;
        console.log('✅ Imagem convertida para base64');
        resolve(base64);
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('📸 Processando imagem:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
      const base64 = await handleImageUpload(file);
      
      setEditingProduct({
        ...editingProduct,
        image_url: base64
      });

      alert(`✅ Imagem carregada: ${file.name}\n\nTamanho: ${(file.size / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error);
      alert(`Erro ao fazer upload da imagem:\n\n${error.message}`);
    }
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleMoveProductUp = async (index) => {
    if (index === 0) return;
    
    const currentProduct = products[index];
    const previousProduct = products[index - 1];
    
    try {
      await supabase.update('products', { id: currentProduct.id }, { order_index: index - 1 });
      await supabase.update('products', { id: previousProduct.id }, { order_index: index });
      refresh();
    } catch (error) {
      alert('Erro ao reordenar produtos: ' + error.message);
    }
  };

  const handleMoveProductDown = async (index) => {
    if (index === products.length - 1) return;
    
    const currentProduct = products[index];
    const nextProduct = products[index + 1];
    
    try {
      await supabase.update('products', { id: currentProduct.id }, { order_index: index + 1 });
      await supabase.update('products', { id: nextProduct.id }, { order_index: index });
      refresh();
    } catch (error) {
      alert('Erro ao reordenar produtos: ' + error.message);
    }
  };

  // Função de teste do Supabase
  const testSupabaseConnection = async () => {
    setTestingSupabase(true);
    const results = {
      connectionTest: { status: 'pending', message: '', time: 0 },
      productsTest: { status: 'pending', message: '', data: [], time: 0 },
      siteTextsTest: { status: 'pending', message: '', data: [], time: 0 },
      usersTest: { status: 'pending', message: '', data: [], time: 0 },
      config: {
        url: supabase.baseURL,
        schema: supabase.schema,
        isDevelopment: supabase.isDevelopment
      }
    };

    try {
      // Teste 1: Conexão básica com products
      const start1 = Date.now();
      try {
        const productsData = await supabase.get('products', {}, { limit: 5 });
        const time1 = Date.now() - start1;
        results.productsTest = {
          status: 'success',
          message: `${productsData.length} produtos encontrados`,
          data: productsData,
          time: time1
        };
      } catch (error) {
        results.productsTest = {
          status: 'error',
          message: error.message,
          data: [],
          time: Date.now() - start1
        };
      }

      // Teste 2: site_texts
      const start2 = Date.now();
      try {
        const textsData = await supabase.get('site_texts', {}, { limit: 5 });
        const time2 = Date.now() - start2;
        results.siteTextsTest = {
          status: 'success',
          message: `${textsData.length} textos encontrados`,
          data: textsData,
          time: time2
        };
      } catch (error) {
        results.siteTextsTest = {
          status: 'error',
          message: error.message,
          data: [],
          time: Date.now() - start2
        };
      }

      // Teste 3: users
      const start3 = Date.now();
      try {
        const usersData = await supabase.get('users', {}, { limit: 5 });
        const time3 = Date.now() - start3;
        results.usersTest = {
          status: 'success',
          message: `${usersData.length} usuários encontrados`,
          data: usersData,
          time: time3
        };
      } catch (error) {
        results.usersTest = {
          status: 'error',
          message: error.message,
          data: [],
          time: Date.now() - start3
        };
      }

      // Teste geral de conexão
      const hasAnySuccess = results.productsTest.status === 'success' || 
                           results.siteTextsTest.status === 'success' || 
                           results.usersTest.status === 'success';
      
      results.connectionTest = {
        status: hasAnySuccess ? 'success' : 'error',
        message: hasAnySuccess ? 'Conexão estabelecida com sucesso' : 'Falha na conexão com Supabase',
        time: 0
      };

    } catch (error) {
      results.connectionTest = {
        status: 'error',
        message: error.message,
        time: 0
      };
    }

    setSupabaseTest(results);
    setTestingSupabase(false);
  };

  // Função para popular o banco com dados default
  const populateDefaultData = async () => {
    if (!confirm('Isso vai popular o banco de dados com os textos padrão. Continuar?')) {
      return;
    }

    setTestingSupabase(true);
    try {
      const textsAPI = (await import('../services/textsAPI')).textsAPI;
      const DEFAULT_CONTENT = content; // Usar o conteúdo atual do contexto
      
      let successCount = 0;
      let errorCount = 0;

      // Popular cada seção e campo
      for (const section of Object.keys(DEFAULT_CONTENT)) {
        for (const field of Object.keys(DEFAULT_CONTENT[section])) {
          try {
            await textsAPI.updateByField(section, field, DEFAULT_CONTENT[section][field]);
            successCount++;
          } catch (error) {
            console.error(`Erro ao popular ${section}.${field}:`, error);
            errorCount++;
          }
        }
      }

      alert(`✅ Dados populados!\n\n${successCount} campos inseridos\n${errorCount} erros`);
      
      // Re-testar conexão
      await testSupabaseConnection();
    } catch (error) {
      alert(`Erro ao popular dados: ${error.message}`);
    } finally {
      setTestingSupabase(false);
    }
  };

  const renderSupabaseTest = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teste de Conexão Supabase</h2>
        <div className="flex gap-3">
          <button
            onClick={populateDefaultData}
            disabled={testingSupabase}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {testingSupabase ? 'Populando...' : 'Popular Dados'}
          </button>
          <button
            onClick={testSupabaseConnection}
            disabled={testingSupabase}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Database className="w-5 h-5 mr-2" />
            {testingSupabase ? 'Testando...' : 'Executar Testes'}
          </button>
        </div>
      </div>

      {/* Configuração Atual */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração Atual</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">URL Base:</span>
            <span className="text-gray-900 font-semibold">{supabaseTest?.config.url || supabase.baseURL}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Schema:</span>
            <span className="text-gray-900 font-semibold">{supabaseTest?.config.schema || supabase.schema}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ambiente:</span>
            <span className="text-gray-900 font-semibold">
              {(supabaseTest?.config.isDevelopment ?? supabase.isDevelopment) ? 'Desenvolvimento' : 'Produção'}
            </span>
          </div>
        </div>
      </div>

      {supabaseTest && (
        <>
          {/* Status de Conexão Geral */}
          <div className={`rounded-xl p-6 border-2 ${
            supabaseTest.connectionTest.status === 'success' 
              ? 'bg-green-50 border-green-200' 
              : supabaseTest.connectionTest.status === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-3">
              {supabaseTest.connectionTest.status === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
              {supabaseTest.connectionTest.status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
              {supabaseTest.connectionTest.status === 'pending' && <Warning className="w-8 h-8 text-yellow-600" />}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {supabaseTest.connectionTest.status === 'success' ? '✅ Conexão OK' : 
                   supabaseTest.connectionTest.status === 'error' ? '❌ Conexão Falhou' : 
                   '⏳ Testando...'}
                </h3>
                <p className="text-sm text-gray-700">{supabaseTest.connectionTest.message}</p>
              </div>
            </div>
          </div>

          {/* Testes Individuais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Teste Products */}
            <div className={`rounded-lg p-4 border ${
              supabaseTest.productsTest.status === 'success' 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {supabaseTest.productsTest.status === 'success' 
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <XCircle className="w-5 h-5 text-red-600" />
                }
                <h4 className="font-semibold text-gray-900">Products</h4>
              </div>
              <p className="text-sm text-gray-700 mb-1">{supabaseTest.productsTest.message}</p>
              <p className="text-xs text-gray-500">Tempo: {supabaseTest.productsTest.time}ms</p>
              {supabaseTest.productsTest.data.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">Produtos encontrados:</p>
                  <ul className="list-disc list-inside">
                    {supabaseTest.productsTest.data.map((p, i) => (
                      <li key={i}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Teste Site Texts */}
            <div className={`rounded-lg p-4 border ${
              supabaseTest.siteTextsTest.status === 'success' 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {supabaseTest.siteTextsTest.status === 'success' 
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <XCircle className="w-5 h-5 text-red-600" />
                }
                <h4 className="font-semibold text-gray-900">Site Texts</h4>
              </div>
              <p className="text-sm text-gray-700 mb-1">{supabaseTest.siteTextsTest.message}</p>
              <p className="text-xs text-gray-500">Tempo: {supabaseTest.siteTextsTest.time}ms</p>
              {supabaseTest.siteTextsTest.data.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">Seções encontradas:</p>
                  <p>{[...new Set(supabaseTest.siteTextsTest.data.map(t => t.section))].join(', ')}</p>
                </div>
              )}
            </div>

            {/* Teste Users */}
            <div className={`rounded-lg p-4 border ${
              supabaseTest.usersTest.status === 'success' 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {supabaseTest.usersTest.status === 'success' 
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <XCircle className="w-5 h-5 text-red-600" />
                }
                <h4 className="font-semibold text-gray-900">Users</h4>
              </div>
              <p className="text-sm text-gray-700 mb-1">{supabaseTest.usersTest.message}</p>
              <p className="text-xs text-gray-500">Tempo: {supabaseTest.usersTest.time}ms</p>
              {supabaseTest.usersTest.data.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">Usuários encontrados:</p>
                  <ul className="list-disc list-inside">
                    {supabaseTest.usersTest.data.map((u, i) => (
                      <li key={i}>{u.username} ({u.role})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mensagens de Erro Detalhadas */}
          {(supabaseTest.productsTest.status === 'error' || 
            supabaseTest.siteTextsTest.status === 'error' || 
            supabaseTest.usersTest.status === 'error') && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Erros Detectados:</h3>
              <div className="space-y-2 text-sm">
                {supabaseTest.productsTest.status === 'error' && (
                  <div>
                    <strong className="text-red-800">Products:</strong>
                    <p className="text-red-700 font-mono text-xs">{supabaseTest.productsTest.message}</p>
                  </div>
                )}
                {supabaseTest.siteTextsTest.status === 'error' && (
                  <div>
                    <strong className="text-red-800">Site Texts:</strong>
                    <p className="text-red-700 font-mono text-xs">{supabaseTest.siteTextsTest.message}</p>
                  </div>
                )}
                {supabaseTest.usersTest.status === 'error' && (
                  <div>
                    <strong className="text-red-800">Users:</strong>
                    <p className="text-red-700 font-mono text-xs">{supabaseTest.usersTest.message}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Possíveis Soluções:</h4>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  <li>Verifique se o Supabase está rodando em <code className="bg-yellow-200 px-1 rounded">http://173.249.32.99:54321</code></li>
                  <li>Confirme que o schema <code className="bg-yellow-200 px-1 rounded">braspex</code> existe</li>
                  <li>Execute os scripts SQL fornecidos para criar as tabelas</li>
                  <li>Verifique as variáveis de ambiente no arquivo <code className="bg-yellow-200 px-1 rounded">.env</code></li>
                  <li>Teste a conexão rodando: <code className="bg-yellow-200 px-1 rounded">node test-supabase.js</code></li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics do Site</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Visualizações</p>
              <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Visualizações Hoje</p>
              <p className="text-3xl font-bold">{analytics.dailyViews}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Últimos Visitantes</p>
              <p className="text-3xl font-bold">{analytics.visitors.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Visitas</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.visitors.slice(-10).reverse().map((visitor, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(visitor.date).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-600 truncate max-w-md">
                  {(visitor.userAgent && typeof visitor.userAgent === 'string') ? visitor.userAgent.split(' ')[0] : 'Desconhecido'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductsManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use as setas para alterar a ordem de exibição no site
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#003d47] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      {loadingProducts ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      ) : (
        <>
          {/* Formulário de Produto */}
          {showProductForm && editingProduct && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-[#005563]">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    placeholder="Ex: Sistema PPR"
                  />
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    rows={3}
                    placeholder="Descrição detalhada do produto"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    placeholder="Ex: Kits de Água Fria e Quente"
                  />
                </div>

                {/* URL da Imagem */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Produto
                  </label>
                  <div className="space-y-3">
                    {/* Input de URL */}
                    <div>
                      <input
                        type="text"
                        value={editingProduct.image_url || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                        placeholder="URL da imagem: /imagemppr.png ou https://..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cole a URL da imagem ou faça upload de arquivo local
                      </p>
                    </div>

                    {/* Botão de Upload */}
                    <div>
                      <input
                        type="file"
                        id="image-upload-input"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload-input"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Package className="w-5 h-5" />
                        📤 Upload Imagem Local
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Suporte: JPG, PNG, WebP, GIF (máximo 2MB)
                      </p>
                    </div>
                    
                    {/* Preview da imagem */}
                    {editingProduct.image_url && (
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <img 
                          src={editingProduct.image_url} 
                          alt="Preview" 
                          className="w-24 h-24 object-contain rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Preview da imagem</p>
                          <p className="text-xs text-gray-500 truncate max-w-md">{editingProduct.image_url.substring(0, 80)}...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features/Variações (uma por linha)
                  </label>
                  <textarea
                    value={Array.isArray(editingProduct.features) ? editingProduct.features.join('\n') : ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct, 
                      features: e.target.value.split('\n').filter(f => f.trim())
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    rows={4}
                    placeholder="Kit Chuveiro Tê Misturador&#10;Kit Chuveiro Monocomando"
                  />
                </div>

                {/* Status Ativo */}
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.active}
                    onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                    className="w-4 h-4 text-[#005563] border-gray-300 rounded focus:ring-[#005563]"
                    id="product-active"
                  />
                  <label htmlFor="product-active" className="ml-2 text-sm font-medium text-gray-700">
                    Produto Ativo (visível no site)
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Salvar Produto
                </button>
                <button
                  onClick={handleCancelProductForm}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Produtos com Controle de Ordem */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveProductUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-600 hover:text-[#005563] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </button>
                          <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                          <button
                            onClick={() => handleMoveProductDown(index)}
                            disabled={index === products.length - 1}
                            className="p-1 text-gray-600 hover:text-[#005563] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.category || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-[#005563] hover:text-[#FFD027] mr-3"
                          title="Editar"
                        >
                          <PencilSimple className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {products.length === 0 && !loadingProducts && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum produto cadastrado</p>
                  <button
                    onClick={handleAddProduct}
                    className="mt-4 text-[#005563] hover:text-[#FFD027] font-medium"
                  >
                    Adicionar primeiro produto
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderContentEditor = (sectionId) => {
    const sectionContent = content[sectionId];
    
    // Verificar se o conteúdo existe
    if (!sectionContent || typeof sectionContent !== 'object') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Editar {sections.find(s => s.id === sectionId)?.name}
          </h2>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800">
              ⚠️ Nenhum conteúdo encontrado para esta seção.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Esta seção ainda não possui dados no contexto. Verifique o SiteContentContext.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Editar {sections.find(s => s.id === sectionId)?.name}
        </h2>
        
        <div className="space-y-4">
          {Object.entries(sectionContent).map(([field, value]) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {field === 'description' || value.length > 50 ? (
                <textarea
                  value={value}
                  onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Site
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo - BRASPEX
              </h1>
              {/* Status da conexão removido */}
            </div>
            
            <div className="flex items-center space-x-3">
              {unsavedChanges && (
                <span className="text-sm text-amber-600 font-medium">
                  Alterações não salvas
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FloppyDisk className="w-4 h-4 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seções</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="ml-3">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeSection === 'analytics' && renderAnalytics()}
              {activeSection === 'supabase-test' && renderSupabaseTest()}
              {activeSection === 'produtos' && renderProductsManager()}
              {activeSection !== 'analytics' && activeSection !== 'supabase-test' && activeSection !== 'produtos' && renderContentEditor(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;