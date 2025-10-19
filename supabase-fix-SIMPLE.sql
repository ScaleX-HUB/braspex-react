-- ============================================
-- PASSO 1: ADICIONAR COLUNAS EM PRODUCTS
-- ============================================

-- Adicionar category_name
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS category_name TEXT;

-- Adicionar subcategory_name  
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS subcategory_name TEXT;

-- Adicionar slug
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Adicionar image_path
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Adicionar featured
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Adicionar gallery
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- Adicionar features
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Adicionar sku
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS sku TEXT;

-- Adicionar thumbnail_url
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Adicionar price_label
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS price_label TEXT DEFAULT 'Sob Consulta';

-- Adicionar stock_status
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';

-- Adicionar order_index
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Adicionar meta_title
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS meta_title TEXT;

-- Adicionar meta_description
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Adicionar meta_keywords
ALTER TABLE braspex.products ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- ============================================
-- PASSO 2: ADICIONAR COLUNAS EM CATEGORIES
-- ============================================

-- Adicionar slug
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS slug TEXT;

-- Adicionar description
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar active
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Adicionar order_index
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Adicionar color
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#005563';

-- Adicionar logo
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS logo TEXT;

-- Adicionar subcategories
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- PASSO 3: ATUALIZAR CATEGORIA PEX
-- ============================================

UPDATE braspex.categories
SET 
    slug = COALESCE(slug, name),
    color = COALESCE(color, '#005563'),
    active = COALESCE(active, true),
    order_index = COALESCE(order_index, 1),
    subcategories = COALESCE(subcategories, '[]'::jsonb),
    description = COALESCE(description, '')
WHERE name = 'pex';

-- ============================================
-- PASSO 4: INSERIR CATEGORIAS PADRÃO
-- ============================================

-- Gas (só insere se não existir)
INSERT INTO braspex.categories (id, name, display_name, slug, icon, color, description, order_index, active, subcategories)
SELECT gen_random_uuid(), 'gas', 'Gás', 'gas', 'Fire', '#FF6B00', 'Tubulação para gás residencial e comercial', 2, true, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM braspex.categories WHERE name = 'gas');

-- Kit (só insere se não existir)
INSERT INTO braspex.categories (id, name, display_name, slug, icon, color, description, order_index, active, subcategories)
SELECT gen_random_uuid(), 'kit', 'Kits', 'kit', 'Cube', '#FFD027', 'Kits completos de instalação', 3, true, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM braspex.categories WHERE name = 'kit');

-- Polvo (só insere se não existir)
INSERT INTO braspex.categories (id, name, display_name, slug, icon, color, description, order_index, active, subcategories)
SELECT gen_random_uuid(), 'polvo', 'Polvo', 'polvo', 'Lightning', '#00A86B', 'Distribuidor tipo polvo', 4, true, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM braspex.categories WHERE name = 'polvo');

-- Outros (só insere se não existir)
INSERT INTO braspex.categories (id, name, display_name, slug, icon, color, description, order_index, active, subcategories)
SELECT gen_random_uuid(), 'outros', 'Outros', 'outros', 'Gear', '#6B7280', 'Outros produtos e acessórios', 5, true, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM braspex.categories WHERE name = 'outros');

-- ============================================
-- PASSO 5: VERIFICAR RESULTADO
-- ============================================

-- Ver colunas de products
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'braspex' 
AND table_name = 'products'
ORDER BY ordinal_position;

-- Ver todas as categorias
SELECT id, name, display_name, icon, color, active, order_index
FROM braspex.categories
ORDER BY order_index;
