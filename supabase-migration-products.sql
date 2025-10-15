-- ============================================
-- SCRIPT DE MIGRAÇÃO - ATUALIZAR TABELA PRODUCTS
-- ============================================
-- Execute este script se você JÁ TEM a tabela products criada
-- e quer apenas ADICIONAR/ALTERAR colunas
-- ============================================

-- 1. ADICIONAR COLUNA category_id (chave estrangeira)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- 2. ADICIONAR COLUNA category_name (cache)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_name TEXT;

-- 3. ADICIONAR COLUNA subcategory_name (cache)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS subcategory_name TEXT;

-- 4. ADICIONAR COLUNA slug (URL-friendly)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 5. ADICIONAR COLUNAS DE IMAGEM
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- 6. ADICIONAR COLUNAS DE PREÇO
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price_label TEXT DEFAULT 'Sob Consulta',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL',
ADD COLUMN IF NOT EXISTS sku TEXT;

-- 7. ADICIONAR COLUNA features
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- 8. ADICIONAR METADATA
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 9. ADICIONAR COLUNAS SEO
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- 10. RENOMEAR COLUNA 'image' PARA 'image_url' (se necessário)
-- Descomente se você já tinha uma coluna 'image' e quer renomear
-- ALTER TABLE products RENAME COLUMN image TO image_url;

-- 11. ALTERAR TIPO DA COLUNA id PARA UUID (CUIDADO!)
-- Só execute se a tabela estiver vazia ou você quiser resetar os IDs
-- ALTER TABLE products DROP CONSTRAINT products_pkey;
-- ALTER TABLE products ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE products ALTER COLUMN id TYPE UUID USING gen_random_uuid();
-- ALTER TABLE products ADD PRIMARY KEY (id);

-- 12. CRIAR ÍNDICES PARA NOVAS COLUNAS
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING gin(features);

-- 13. ADICIONAR CONSTRAINT UNIQUE NO SKU
ALTER TABLE products ADD CONSTRAINT products_sku_unique UNIQUE (sku);

-- 14. ADICIONAR CONSTRAINT UNIQUE NO SLUG
ALTER TABLE products ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- 15. MIGRAR DADOS EXISTENTES (se você já tem produtos)
-- Atualizar image_url com valor da coluna antiga 'image' (se existir)
-- UPDATE products SET image_url = image WHERE image_url IS NULL AND image IS NOT NULL;

-- Gerar slugs automáticos baseados no nome (se não existirem)
UPDATE products 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Preencher category_name baseado no category_id
UPDATE products p
SET category_name = c.display_name
FROM categories c
WHERE p.category_id = c.id AND p.category_name IS NULL;

-- ============================================
-- VERIFICAÇÕES
-- ============================================

-- Ver estrutura atualizada da tabela products
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Ver relacionamento com categories
SELECT 
  p.id,
  p.name AS product_name,
  p.category_id,
  c.display_name AS category_display_name,
  p.image_url,
  p.price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 10;
