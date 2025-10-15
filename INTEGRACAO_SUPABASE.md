# 🚀 GUIA DE INTEGRAÇÃO SUPABASE - BRASPEX

## 📋 RESUMO
Este guia vai integrar completamente o Supabase com o painel admin para:
1. ✅ **Textos do Site** - Já funciona! Agora visível no painel admin
2. ⚠️ **Produtos** - Precisa integração (tabela existe, API existe)
3. ⚠️ **Categorias** - Precisa criar tabela + integrar
4. ⚠️ **Clientes** - Precisa criar tabela + integrar
5. ⚠️ **Cotações** - Precisa criar tabela + integrar

---

## 🎯 PASSO 1: CRIAR TABELAS NO SUPABASE

### 1.1. Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Abra seu projeto Braspex
3. No menu lateral, clique em **SQL Editor**

### 1.2. Execute o Script SQL
1. Clique em **New Query**
2. Abra o arquivo `supabase-tables.sql` na raiz do projeto
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **RUN** (ou pressione Ctrl+Enter)

### 1.3. Verificar Criação
Execute este SQL para confirmar:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve retornar:
- `categories`
- `clients`
- `products`
- `quotes`

---

## ✅ PASSO 2: TEXTOS DO SITE (JÁ FUNCIONA!)

### O que foi feito:
- ✅ Criado componente `TextsManager.jsx`
- ✅ Integrado ao painel admin em "Página Principal > Editar Textos"
- ✅ Conectado ao `SiteContentContext` que já sincroniza com Supabase
- ✅ Salvamento automático ao editar campos

### Como usar:
1. Acesse o painel admin: `/admin`
2. Clique em "Página Principal" > "Editar Textos"
3. Edite os textos de qualquer seção (Hero, Vantagens, Sobre, etc.)
4. As mudanças são salvas automaticamente no Supabase
5. Recarregue o site para ver as alterações

---

## 📦 PASSO 3: INTEGRAR PRODUTOS (PRÓXIMA ETAPA)

### Arquivos necessários:
- ✅ `src/services/productsAPI.js` - API já existe
- ⚠️ `src/components/admin/ProductsManager.jsx` - Precisa modificar
- ⚠️ `src/data/productsUtils.js` - Precisa modificar

### O que fazer:
1. **ProductsManager**: Substituir localStorage por `productsAPI`
   - Carregar: `productsAPI.getAll()`
   - Criar: `productsAPI.create(product)`
   - Editar: `productsAPI.update(id, product)`
   - Deletar: `productsAPI.delete(id)`

2. **productsUtils**: Adicionar fallback Supabase
   - Se localStorage vazio, buscar do Supabase
   - Manter localStorage como cache

3. **Botão "Sincronizar"**: Adicionar no ProductsManager
   - Permite usuário forçar sync localStorage → Supabase

---

## 📑 PASSO 4: INTEGRAR CATEGORIAS

### Arquivos necessários:
- ✅ `src/services/categoriesAPI.js` - API já existe
- ⚠️ `src/components/admin/CategoriesManager.jsx` - Precisa modificar
- ⚠️ `src/data/productsUtils.js` - Precisa modificar (categorias)

### O que fazer:
1. **CategoriesManager**: Adicionar botões de sincronização
   - "Carregar do Supabase" - `categoriesAPI.getAll()`
   - "Sincronizar Tudo" - `categoriesAPI.syncAll(categories)`
   - Manter lógica atual de criar/editar/deletar
   - Após cada ação, chamar API correspondente

2. **Header.jsx**: Carregar categorias do Supabase
   - Primeiro tentar localStorage
   - Se vazio, buscar `categoriesAPI.getAll()`

---

## 👥 PASSO 5: INTEGRAR CLIENTES

### Arquivos necessários:
- ✅ `src/services/clientsAPI.js` - API já existe
- ⚠️ `src/components/admin/ClientsKanban.jsx` - Precisa modificar
- ⚠️ `src/data/clientsUtils.js` - Precisa modificar

### O que fazer:
1. **ClientsKanban**: Substituir clientsUtils por clientsAPI
   - Load: `clientsAPI.getAll()` ao montar componente
   - Create: `clientsAPI.create(client)`
   - Update: `clientsAPI.update(id, client)`
   - Delete: `clientsAPI.delete(id)`
   - Move stage: `clientsAPI.update(id, { stage: newStage })`

2. **clientsUtils**: Manter como camada intermediária
   - Chamar clientsAPI internamente
   - Manter localStorage como cache

---

## 💰 PASSO 6: INTEGRAR COTAÇÕES

### Arquivos necessários:
- ✅ `src/services/quotesAPI.js` - API já existe
- ⚠️ `src/components/admin/QuotesManager.jsx` - Precisa modificar
- ⚠️ `src/data/quotesUtils.js` - Precisa modificar

### O que fazer:
1. **QuotesManager**: Substituir quotesUtils por quotesAPI
   - Load: `quotesAPI.getAll()` ao montar
   - Update status: `quotesAPI.updateStatus(id, status)`
   - Delete: `quotesAPI.delete(id)`
   - Stats: `quotesAPI.getStats()`

2. **CartContext**: Ao finalizar compra
   - Chamar `quotesAPI.create(quote)` ao invés de localStorage
   - Manter evento CustomEvent para notificar admin

---

## 🔧 PRÓXIMOS PASSOS TÉCNICOS

### Padrão de Integração:
Para cada componente Manager:

```javascript
// 1. Importar API
import { productsAPI } from '../../services/productsAPI';

// 2. Estado de loading
const [loading, setLoading] = useState(false);
const [syncMessage, setSyncMessage] = useState('');

// 3. Carregar dados ao montar
useEffect(() => {
  loadFromSupabase();
}, []);

const loadFromSupabase = async () => {
  setLoading(true);
  try {
    const data = await productsAPI.getAll();
    setProducts(data);
    // Salvar no localStorage como cache
    localStorage.setItem('braspex_products', JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao carregar:', error);
    // Fallback para localStorage
    const cached = localStorage.getItem('braspex_products');
    if (cached) setProducts(JSON.parse(cached));
  }
  setLoading(false);
};

// 4. Botão de sincronização manual
const handleSync = async () => {
  setSyncMessage('Sincronizando...');
  const success = await loadFromSupabase();
  setSyncMessage(success ? '✅ Sincronizado!' : '❌ Erro');
  setTimeout(() => setSyncMessage(''), 3000);
};

// 5. Ao criar/editar/deletar
const handleSave = async (product) => {
  try {
    if (product.id) {
      await productsAPI.update(product.id, product);
    } else {
      await productsAPI.create(product);
    }
    await loadFromSupabase(); // Recarregar lista
    setSyncMessage('✅ Salvo!');
  } catch (error) {
    console.error(error);
    setSyncMessage('❌ Erro ao salvar');
  }
};
```

---

## 🐛 PROBLEMAS CONHECIDOS

### 1. Categoria deletada não some do site
**Causa**: CustomEvent não cruza abas do navegador

**Solução**: Adicionar listener de `storage` event
```javascript
// Em Header.jsx
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'braspex_categories') {
      const updatedCategories = JSON.parse(e.newValue || '{}');
      setCategories(updatedCategories);
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

### 2. Produtos do Supabase não aparecem no site
**Causa**: Site carrega apenas de localStorage

**Solução**: Modificar `productsUtils.loadProducts()` para buscar do Supabase se localStorage vazio

---

## 📊 CHECKLIST FINAL

Antes de considerar completo:

- [ ] Executar `supabase-tables.sql` no Supabase
- [ ] Verificar 4 tabelas criadas (categories, products, clients, quotes)
- [ ] Testar TextsManager no admin (já deve funcionar)
- [ ] Integrar ProductsManager com productsAPI
- [ ] Integrar CategoriesManager com categoriesAPI
- [ ] Integrar ClientsKanban com clientsAPI
- [ ] Integrar QuotesManager com quotesAPI
- [ ] Testar criar produto no admin → aparecer no site
- [ ] Testar criar categoria no admin → aparecer no menu
- [ ] Testar criar cliente no admin → salvar no Supabase
- [ ] Testar cotação do site → aparecer no admin
- [ ] Adicionar botões "Sincronizar com Supabase" em cada Manager
- [ ] Corrigir problema de categorias deletadas não sumindo do site

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

1. **AGORA**: Executar SQL no Supabase (CRÍTICO - bloqueia tudo)
2. **HOJE**: Integrar Categorias (mais simples, testa o padrão)
3. **HOJE**: Integrar Produtos (mais complexo)
4. **AMANHÃ**: Integrar Clientes (backend pronto)
5. **AMANHÃ**: Integrar Cotações (backend pronto)
6. **FINAL**: Corrigir bug de sync em tempo real

---

## 💡 DICAS

- **Sempre teste no admin primeiro**: Crie/edite/delete no admin e veja se salva no Supabase
- **Depois teste no site**: Recarregue o site e veja se as mudanças aparecem
- **Use o SQL Editor do Supabase**: Para verificar se os dados estão salvando corretamente
- **Console.log é seu amigo**: Todos os arquivos têm logs com emojis para debug
- **localStorage é fallback**: Nunca apague totalmente, serve como backup offline

---

## 🆘 TROUBLESHOOTING

### "Tabela não existe"
→ Execute o `supabase-tables.sql` no Supabase Dashboard

### "Não consigo ver os textos editados"
→ O TextsManager já funciona! Vá em "Página Principal > Editar Textos"

### "Produtos do Supabase não aparecem"
→ Ainda não integrado. Siga PASSO 3 deste guia

### "Erro ao salvar no Supabase"
→ Verifique console do navegador (F12)
→ Verifique se tabelas existem no Supabase
→ Verifique se `supabaseClient.js` está com URL e key corretos

---

**Criado em**: 2025
**Última atualização**: Agora
**Status**: Textos ✅ | Produtos ⚠️ | Categorias ⚠️ | Clientes ⚠️ | Cotações ⚠️
