-- ============================================
-- CORRIGIR ESTRUTURA DO SUPABASE - BRASPEX
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. VERIFICAR E AJUSTAR TABELA PRODUCTS
-- Adicionar colunas que estão faltando

-- Verificar se a coluna category_name existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'category_name'
    ) THEN
        ALTER TABLE products ADD COLUMN category_name TEXT;
        RAISE NOTICE 'Coluna category_name adicionada';
    ELSE
        RAISE NOTICE 'Coluna category_name já existe';
    END IF;
END $$;

-- Verificar se a coluna subcategory_name existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'subcategory_name'
    ) THEN
        ALTER TABLE products ADD COLUMN subcategory_name TEXT;
        RAISE NOTICE 'Coluna subcategory_name adicionada';
    ELSE
        RAISE NOTICE 'Coluna subcategory_name já existe';
    END IF;
END $$;

-- Verificar se a coluna slug existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE products ADD COLUMN slug TEXT;
        RAISE NOTICE 'Coluna slug adicionada';
    ELSE
        RAISE NOTICE 'Coluna slug já existe';
    END IF;
END $$;

-- Verificar se a coluna image_path existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'image_path'
    ) THEN
        ALTER TABLE products ADD COLUMN image_path TEXT;
        RAISE NOTICE 'Coluna image_path adicionada';
    ELSE
        RAISE NOTICE 'Coluna image_path já existe';
    END IF;
END $$;

-- Verificar se a coluna featured existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'featured'
    ) THEN
        ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna featured adicionada';
    ELSE
        RAISE NOTICE 'Coluna featured já existe';
    END IF;
END $$;

-- ============================================
-- 2. VERIFICAR E AJUSTAR TABELA CATEGORIES
-- ============================================

-- Verificar se a coluna slug existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE categories ADD COLUMN slug TEXT;
        RAISE NOTICE 'Coluna slug adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna slug já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna description existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE categories ADD COLUMN description TEXT;
        RAISE NOTICE 'Coluna description adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna description já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna active existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'active'
    ) THEN
        ALTER TABLE categories ADD COLUMN active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Coluna active adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna active já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna order_index existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE categories ADD COLUMN order_index INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna order_index adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna order_index já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna color existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'color'
    ) THEN
        ALTER TABLE categories ADD COLUMN color TEXT DEFAULT '#005563';
        RAISE NOTICE 'Coluna color adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna color já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna logo existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'logo'
    ) THEN
        ALTER TABLE categories ADD COLUMN logo TEXT;
        RAISE NOTICE 'Coluna logo adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna logo já existe em categories';
    END IF;
END $$;

-- Verificar se a coluna subcategories existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'subcategories'
    ) THEN
        ALTER TABLE categories ADD COLUMN subcategories JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna subcategories adicionada em categories';
    ELSE
        RAISE NOTICE 'Coluna subcategories já existe em categories';
    END IF;
END $$;

-- ============================================
-- 3. ATUALIZAR CATEGORIA PEX EXISTENTE
-- ============================================

-- Atualizar a categoria PEX com todas as informações
UPDATE categories
SET 
    slug = name,
    color = COALESCE(color, '#005563'),
    active = COALESCE(active, true),
    order_index = COALESCE(order_index, 1),
    subcategories = COALESCE(subcategories, '[]'::jsonb)
WHERE name = 'pex';

-- ============================================
-- 4. INSERIR CATEGORIAS PADRÃO (se não existirem)
-- ============================================

-- Gas
INSERT INTO categories (name, display_name, slug, icon, color, description, order_index, active, subcategories)
VALUES ('gas', 'Gás', 'gas', 'Fire', '#FF6B00', 'Tubulação para gás residencial e comercial', 2, true, '[]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    slug = EXCLUDED.slug,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

-- Kit
INSERT INTO categories (name, display_name, slug, icon, color, description, order_index, active, subcategories)
VALUES ('kit', 'Kits', 'kit', 'Cube', '#FFD027', 'Kits completos de instalação', 3, true, '[]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    slug = EXCLUDED.slug,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

-- Polvo
INSERT INTO categories (name, display_name, slug, icon, color, description, order_index, active, subcategories)
VALUES ('polvo', 'Polvo', 'polvo', 'Lightning', '#00A86B', 'Distribuidor tipo polvo', 4, true, '[]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    slug = EXCLUDED.slug,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

-- Outros
INSERT INTO categories (name, display_name, slug, icon, color, description, order_index, active, subcategories)
VALUES ('outros', 'Outros', 'outros', 'Gear', '#6B7280', 'Outros produtos e acessórios', 5, true, '[]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    slug = EXCLUDED.slug,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

-- ============================================
-- 5. VERIFICAR ESTRUTURA FINAL
-- ============================================

-- Ver todas as colunas da tabela products
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'products'
ORDER BY ordinal_position;

-- Ver todas as colunas da tabela categories
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'categories'
ORDER BY ordinal_position;

-- Ver todas as categorias
SELECT 
    id,
    name,
    display_name,
    icon,
    color,
    active,
    order_index
FROM categories
ORDER BY order_index;
