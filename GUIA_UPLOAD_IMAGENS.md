# 📸 GUIA DE UPLOAD DE IMAGENS - SUPABASE STORAGE

## 🎯 OBJETIVO
Configurar o Supabase Storage para fazer upload de imagens de produtos e acessá-las publicamente.

---

## 🗂️ PARTE 1: CRIAR O BUCKET NO SUPABASE

### Passo 1: Acessar Storage
1. Abra o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto **Braspex**
3. No menu lateral, clique em **Storage**

### Passo 2: Criar Bucket "products"
1. Clique em **New Bucket** (botão verde)
2. Preencha:
   - **Name**: `products`
   - **Public bucket**: ✅ **Marque esta opção** (permite acesso público às imagens)
3. Clique em **Create Bucket**

### Passo 3: Configurar Políticas de Acesso
1. Clique no bucket **products** que acabou de criar
2. Clique na aba **Policies**
3. Adicione as seguintes políticas:

#### Política 1: SELECT (Leitura Pública)
```sql
-- Permitir que QUALQUER PESSOA veja as imagens
CREATE POLICY "Public Access - SELECT"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');
```

#### Política 2: INSERT (Upload por Autenticados)
```sql
-- Permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated Upload - INSERT"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');
```

#### Política 3: UPDATE (Atualização por Autenticados)
```sql
-- Permitir que usuários autenticados atualizem imagens
CREATE POLICY "Authenticated Update - UPDATE"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products');
```

#### Política 4: DELETE (Remoção por Autenticados)
```sql
-- Permitir que usuários autenticados deletem imagens
CREATE POLICY "Authenticated Delete - DELETE"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

---

## 📋 PARTE 2: EXECUTAR SCRIPTS SQL

### Opção A: Criar Tabelas do Zero
Se você **NÃO TEM** nenhuma tabela criada:

1. Abra **SQL Editor** no Supabase Dashboard
2. Copie TODO o conteúdo de `supabase-tables-updated.sql`
3. Cole no SQL Editor
4. Clique em **RUN** (Ctrl+Enter)
5. Verifique se retornou sucesso ✅

### Opção B: Atualizar Tabela Existente
Se você **JÁ TEM** a tabela `products` (como no seu print):

1. Abra **SQL Editor** no Supabase Dashboard
2. Copie TODO o conteúdo de `supabase-migration-products.sql`
3. Cole no SQL Editor
4. Clique em **RUN** (Ctrl+Enter)
5. Verifique se adicionou as colunas ✅

### Verificar se funcionou:
```sql
-- Ver colunas da tabela products
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
```

Deve mostrar as novas colunas:
- `category_id` (integer)
- `image_url` (text)
- `image_path` (text)
- `thumbnail_url` (text)
- `gallery` (jsonb)
- `slug` (text)
- `sku` (text)
- `featured` (boolean)
- E outras...

---

## 🔗 PARTE 3: ESTRUTURA DE URLs DAS IMAGENS

### Formato da URL Pública:
```
https://[SEU_PROJECT_ID].supabase.co/storage/v1/object/public/products/[CAMINHO_DO_ARQUIVO]
```

### Exemplos:
```
https://xxxxx.supabase.co/storage/v1/object/public/products/chassi-metalico.png
https://xxxxx.supabase.co/storage/v1/object/public/products/categorias/pex-logo.png
https://xxxxx.supabase.co/storage/v1/object/public/products/12345-uuid/imagem-principal.jpg
```

### Como Usar no Banco:

#### Produto com imagem:
```sql
INSERT INTO products (name, slug, image_url, image_path, category_id, price) VALUES (
  'Chassi Metálicos',
  'chassi-metalicos',
  'https://xxxxx.supabase.co/storage/v1/object/public/products/chassi-metalico.png',
  'products/chassi-metalico.png',
  1, -- ID da categoria PEX
  NULL -- Sob consulta
);
```

---

## 🖼️ PARTE 4: FAZER UPLOAD DE IMAGENS

### Método 1: Via Dashboard (Manual)
1. Vá em **Storage** > **products**
2. Clique em **Upload File**
3. Selecione a imagem do seu computador
4. Após upload, clique com botão direito na imagem
5. Clique em **Copy URL**
6. Cole esta URL no campo `image_url` do produto

### Método 2: Via Código (Futuro - Painel Admin)
Vamos criar um componente de upload no painel admin que:
1. Seleciona arquivo
2. Faz upload para Supabase Storage
3. Retorna URL pública
4. Salva automaticamente no produto

Código exemplo:
```javascript
import { supabase } from '../lib/supabaseClient';

async function uploadProductImage(file, productId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;
  
  // Upload
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file);
  
  if (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }
  
  // Gerar URL pública
  const { data: publicData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);
  
  return {
    url: publicData.publicUrl,
    path: filePath
  };
}
```

---

## 📦 PARTE 5: ATUALIZAR PRODUTOS EXISTENTES

Se você já tem produtos com URLs antigas, atualize:

```sql
-- Atualizar produto específico com nova imagem
UPDATE products 
SET 
  image_url = 'https://xxxxx.supabase.co/storage/v1/object/public/products/chassi-metalico.png',
  image_path = 'products/chassi-metalico.png'
WHERE id = '32296e95-c153-4eca-b778-d831beaa6f76a';

-- Atualizar todos os produtos setando um placeholder
UPDATE products 
SET image_url = 'https://via.placeholder.com/500x300?text=' || name
WHERE image_url IS NULL;
```

---

## 🔄 PARTE 6: RELACIONAR PRODUTOS COM CATEGORIAS

### Ver categorias disponíveis:
```sql
SELECT id, name, display_name FROM categories;
```

### Atualizar category_id dos produtos:
```sql
-- Produto "Chassi Metálicos" → Categoria "PEX"
UPDATE products 
SET 
  category_id = 1, -- ID da categoria PEX
  category_name = 'PEX'
WHERE name = 'Chassi Metálicos';

-- Produto "AirTechno Multicamada" → Categoria "Kit"
UPDATE products 
SET 
  category_id = 3, -- ID da categoria Kit
  category_name = 'Kit Ar-Condicionado'
WHERE name LIKE '%AirTechno%';
```

### Ver produtos com suas categorias:
```sql
SELECT 
  p.id,
  p.name AS produto,
  c.display_name AS categoria,
  p.image_url,
  p.price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY c.display_name, p.name;
```

---

## ✅ CHECKLIST FINAL

Antes de considerar completo:

- [ ] Bucket "products" criado no Supabase Storage
- [ ] Bucket configurado como PÚBLICO
- [ ] Políticas de acesso configuradas (SELECT público)
- [ ] Tabela `categories` criada com dados iniciais
- [ ] Tabela `products` atualizada com novas colunas:
  - [ ] `category_id` (chave estrangeira)
  - [ ] `image_url` (URL pública)
  - [ ] `image_path` (caminho no storage)
  - [ ] `gallery` (array de imagens)
  - [ ] `slug` (URL-friendly)
  - [ ] `sku` (código único)
- [ ] Produtos existentes atualizados com `category_id`
- [ ] Upload de imagens testado (manual via dashboard)
- [ ] URLs públicas funcionando (abrir no navegador)

---

## 🆘 TROUBLESHOOTING

### Erro: "Policy violation"
→ Verifique se o bucket está como **Public** e tem políticas de SELECT públicas

### Erro: "Bucket not found"
→ Certifique-se de criar o bucket com nome exato: `products`

### URL da imagem não abre
→ Verifique se o bucket é público
→ Teste a URL: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/products/teste.png`

### Categoria não aparece no select do produto
→ Execute o script de criação de categorias (`supabase-tables-updated.sql`)
→ Verifique: `SELECT * FROM categories;`

### Produtos não têm category_id
→ Execute: `UPDATE products SET category_id = 1 WHERE category_id IS NULL;`
→ Ou adicione manualmente categoria por categoria

---

## 📚 PRÓXIMOS PASSOS

1. ✅ **Criar bucket e tabelas** (este guia)
2. ⏭️ **Fazer upload de imagens dos produtos** (via dashboard)
3. ⏭️ **Atualizar produtos com category_id correto**
4. ⏭️ **Integrar painel admin com Supabase** (ver INTEGRACAO_SUPABASE.md)
5. ⏭️ **Criar componente de upload no admin** (futuro)

---

**Criado em**: 15/10/2025
**Última atualização**: Agora
