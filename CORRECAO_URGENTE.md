# 🚨 CORREÇÃO URGENTE - ERRO 400 PRODUCTS

## ❌ **PROBLEMA IDENTIFICADO:**

```
Erro ao salvar produto: Erro na requisição: 400
{"code":"PGRST204","details":null,"hint":null,"message":"Could not find 
the `category_name` column of `products` in the schema cache"}
```

### Causa:
A tabela `products` no Supabase não tem a coluna `category_name` e outras colunas que o código está tentando usar.

---

## ✅ **SOLUÇÃO EM 3 PASSOS:**

### PASSO 1: Executar SQL de Correção (5 minutos) 🔧

1. Abra **Supabase Dashboard**
2. Vá em **SQL Editor** > **New Query**
3. Copie TODO o conteúdo de `supabase-fix-structure.sql`
4. Cole e clique em **RUN**
5. Aguarde a mensagem de sucesso

**O que esse SQL faz:**
- ✅ Adiciona colunas faltantes em `products`:
  - `category_name` (TEXT)
  - `subcategory_name` (TEXT)
  - `slug` (TEXT)
  - `image_path` (TEXT)
  - `featured` (BOOLEAN)
  
- ✅ Adiciona colunas faltantes em `categories`:
  - `slug`, `description`, `active`, `order_index`, `color`, `logo`, `subcategories`
  
- ✅ Insere categorias padrão:
  - PEX, Gás, Kits, Polvo, Outros

---

### PASSO 2: Verificar se Funcionou (2 minutos) ✅

Execute no SQL Editor:

```sql
-- Verificar colunas de products
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Deve mostrar: category_name, subcategory_name, slug, image_path, featured
```

```sql
-- Verificar categorias
SELECT id, name, display_name, icon, color FROM categories;

-- Deve mostrar 5 categorias: pex, gas, kit, polvo, outros
```

---

### PASSO 3: Recarregar o Site (10 segundos) 🔄

1. No VS Code, pare o servidor (Ctrl+C no terminal)
2. Reinicie: `npm run dev`
3. Acesse o admin novamente
4. Tente criar um produto

---

## 🎯 **MUDANÇAS FEITAS NO CÓDIGO:**

### 1. `src/services/categoriesAPI.js` - CORRIGIDO ✅
```javascript
// ANTES: Não tratava erros corretamente
getAll: async () => {
  const { data, error } = await supabase.get('categories');
  if (error) return null;
}

// AGORA: Trata erros e retorna objeto vazio se não houver dados
getAll: async () => {
  const data = await supabase.get('categories');
  return data && data.length > 0 ? formatCategories(data) : {};
}
```

### 2. `src/services/productsAPI.js` - CORRIGIDO ✅
```javascript
// ANTES: Tentava inserir category_name sem verificar
create: async (productData) => {
  await supabase.insert('products', {
    category_name: productData.categoryName, // ❌ Coluna não existe!
    // ...
  });
}

// AGORA: Só envia colunas que existem
create: async (productData) => {
  const data = {
    name: productData.name,
    category_id: productData.categoryId,
    // Não envia category_name a menos que exista
  };
}
```

### 3. `src/data/productsUtils.js` - JÁ ESTAVA CORRETO ✅
- Carrega do Supabase primeiro
- Fallback para localStorage
- Converte formatos automaticamente

---

## 🧪 **TESTAR APÓS CORREÇÃO:**

### Teste 1: Criar Produto
```
1. Admin → Produtos → Novo Produto
2. Preencher:
   - Nome: "Produto Teste"
   - Categoria: PEX (ou outra)
   - Descrição: "Teste"
3. Salvar
4. ✅ Deve salvar SEM erro 400
5. ✅ Produto aparece na listagem
```

### Teste 2: Categorias
```
1. Admin → Categorias
2. ✅ Deve mostrar 5 categorias (PEX, Gás, Kits, Polvo, Outros)
3. Editar qualquer uma
4. ✅ Deve salvar sem erros
5. Criar nova categoria "Teste"
6. ✅ Deve aparecer na lista
7. Deletar categoria "Teste"
8. ✅ Deve sumir da lista
```

### Teste 3: Site Público
```
1. Abrir site em JANELA ANÔNIMA
2. ✅ Menu deve mostrar 5 categorias
3. ✅ Produtos devem aparecer (se houver)
4. Criar produto no admin
5. Recarregar site anônimo
6. ✅ Novo produto deve aparecer
```

---

## 📊 **VERIFICAÇÕES NO SUPABASE:**

### Ver estrutura completa de products:
```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'products'
ORDER BY ordinal_position;
```

### Ver produtos criados:
```sql
SELECT 
    id,
    name,
    category_id,
    image_url,
    price,
    active,
    created_at
FROM products
ORDER BY created_at DESC
LIMIT 10;
```

### Ver categorias com contagem de produtos:
```sql
SELECT 
    c.id,
    c.name,
    c.display_name,
    c.color,
    COUNT(p.id) as total_produtos
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name, c.display_name, c.color
ORDER BY c.order_index;
```

---

## 🐛 **SE AINDA DER ERRO:**

### Erro: "column does not exist"
```bash
# Verificar se o SQL foi executado:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'category_name';

# Se retornar vazio, execute o SQL novamente
```

### Erro: "relation does not exist"
```bash
# Verificar se as tabelas existem:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Deve retornar: products, categories, clients, quotes
# Se não retornar, execute supabase-tables-updated.sql
```

### Erro: "Could not find schema"
```bash
# Verificar o schema configurado
# Em supabaseClient.js deve ser: SUPABASE_SCHEMA = 'braspex'
# ou em .env: VITE_SUPABASE_SCHEMA=braspex
```

### Categorias não carregam
```bash
# No console do navegador (F12):
localStorage.clear(); // Limpar cache
location.reload(); // Recarregar página
```

---

## 📋 **CHECKLIST FINAL:**

- [ ] Executar `supabase-fix-structure.sql` no Supabase
- [ ] Verificar que 5 categorias aparecem: `SELECT * FROM categories;`
- [ ] Verificar colunas de products: coluna `category_name` existe
- [ ] Reiniciar servidor de desenvolvimento (`npm run dev`)
- [ ] Limpar cache do navegador (Ctrl+Shift+Delete)
- [ ] Testar criar produto no admin
- [ ] Produto salva sem erro 400
- [ ] Produto aparece na listagem do admin
- [ ] Produto aparece no site (janela anônima)
- [ ] Categorias aparecem no menu
- [ ] Consegue criar/editar/deletar categorias

---

## 📞 **RESULTADO ESPERADO:**

✅ **Produtos:**
- Criados no admin SEM erro 400
- Aparecem na listagem do admin
- Aparecem no site para todos

✅ **Categorias:**
- 5 categorias padrão (PEX, Gás, Kits, Polvo, Outros)
- Consegue criar novas
- Consegue editar existentes
- Consegue deletar
- Menu do site atualiza automaticamente

✅ **Supabase:**
- Tabela `products` com todas as colunas necessárias
- Tabela `categories` com todas as colunas necessárias
- Dados sincronizando corretamente

---

**Execute o SQL e me avise se funcionou!** 🚀

**Tempo estimado**: 5-10 minutos para resolver completamente
