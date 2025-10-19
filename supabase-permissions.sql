-- ============================================
-- CONFIGURAR PERMISSÕES RLS (Row Level Security)
-- Schema: braspex
-- ============================================

-- ====== TABELA: categories ======

-- Desabilitar RLS temporariamente (ou configurar policies corretas)
ALTER TABLE braspex.categories DISABLE ROW LEVEL SECURITY;

-- Ou, se preferir manter RLS ativo, criar policies de acesso público:
-- ALTER TABLE braspex.categories ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Permitir leitura pública de categorias" ON braspex.categories;
-- CREATE POLICY "Permitir leitura pública de categorias"
-- ON braspex.categories FOR SELECT
-- USING (true);

-- DROP POLICY IF EXISTS "Permitir escrita para usuários autenticados" ON braspex.categories;
-- CREATE POLICY "Permitir escrita para usuários autenticados"
-- ON braspex.categories FOR ALL
-- USING (true)
-- WITH CHECK (true);


-- ====== TABELA: products ======

-- Desabilitar RLS temporariamente (ou configurar policies corretas)
ALTER TABLE braspex.products DISABLE ROW LEVEL SECURITY;

-- Ou, se preferir manter RLS ativo:
-- ALTER TABLE braspex.products ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON braspex.products;
-- CREATE POLICY "Permitir leitura pública de produtos"
-- ON braspex.products FOR SELECT
-- USING (true);

-- DROP POLICY IF EXISTS "Permitir escrita para usuários autenticados" ON braspex.products;
-- CREATE POLICY "Permitir escrita para usuários autenticados"
-- ON braspex.products FOR ALL
-- USING (true)
-- WITH CHECK (true);


-- ====== VERIFICAR STATUS ======
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS Ativo"
FROM pg_tables
WHERE schemaname = 'braspex' 
AND tablename IN ('categories', 'products');
