-- ============================================
-- CORRIGIR CATEGORIAS E PERMISSÕES
-- ============================================

-- PASSO 1: Desabilitar RLS (Row Level Security)
ALTER TABLE braspex.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE braspex.products DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Corrigir categoria PEX (trocar ID de 'pex' para UUID)

-- Primeiro, atualizar produtos que apontam para 'pex'
DO $$
DECLARE
    pex_uuid UUID;
    new_pex_uuid UUID;
BEGIN
    -- Gerar novo UUID para PEX
    new_pex_uuid := gen_random_uuid();
    
    -- Verificar se existe categoria com id='pex' (string)
    IF EXISTS (SELECT 1 FROM braspex.categories WHERE id::text = 'pex') THEN
        -- Criar nova categoria PEX com UUID correto
        INSERT INTO braspex.categories (
            id, name, display_name, icon, logo, color, subcategories, active, order_index, slug, description, created_at, updated_at
        )
        SELECT 
            new_pex_uuid,
            name,
            display_name,
            icon,
            logo,
            color,
            subcategories,
            active,
            order_index,
            COALESCE(slug, name),
            COALESCE(description, ''),
            created_at,
            updated_at
        FROM braspex.categories 
        WHERE id::text = 'pex'
        ON CONFLICT (id) DO NOTHING;
        
        -- Atualizar produtos que apontam para 'pex' antigo
        UPDATE braspex.products 
        SET category_id = new_pex_uuid::text
        WHERE category_id = 'pex';
        
        -- Deletar categoria PEX antiga
        DELETE FROM braspex.categories WHERE id::text = 'pex';
        
        RAISE NOTICE 'Categoria PEX corrigida. Novo UUID: %', new_pex_uuid;
    END IF;
END $$;

-- PASSO 3: Garantir que todas as categorias têm os campos necessários
UPDATE braspex.categories
SET 
    slug = COALESCE(slug, name),
    description = COALESCE(description, ''),
    active = COALESCE(active, true),
    order_index = COALESCE(order_index, 0),
    color = COALESCE(color, '#005563'),
    subcategories = COALESCE(subcategories, '[]'::jsonb)
WHERE slug IS NULL OR description IS NULL;

-- PASSO 4: Verificar resultado
SELECT 
    id,
    name,
    display_name,
    icon,
    color,
    active,
    order_index,
    slug,
    CASE 
        WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        THEN '✅ UUID válido'
        ELSE '❌ ID inválido'
    END as "Validação ID"
FROM braspex.categories
ORDER BY order_index;

-- PASSO 5: Verificar RLS
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '❌ RLS ATIVO (vai dar erro 401)'
        ELSE '✅ RLS DESABILITADO (vai funcionar)'
    END as "Status RLS"
FROM pg_tables
WHERE schemaname = 'braspex' 
AND tablename IN ('categories', 'products');
