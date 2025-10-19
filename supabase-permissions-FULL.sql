-- ============================================
-- GRANT TOTAL DE PERMISSÕES - CATEGORIAS
-- ============================================

-- PASSO 1: Dar permissão total para anônimos (público)
GRANT ALL ON braspex.categories TO anon;
GRANT ALL ON braspex.products TO anon;

-- PASSO 2: Dar permissão total para autenticados
GRANT ALL ON braspex.categories TO authenticated;
GRANT ALL ON braspex.products TO authenticated;

-- PASSO 3: Dar permissão total para service_role (admin do Supabase)
GRANT ALL ON braspex.categories TO service_role;
GRANT ALL ON braspex.products TO service_role;

-- PASSO 4: Dar permissão para postgres (dono do schema)
GRANT ALL ON braspex.categories TO postgres;
GRANT ALL ON braspex.products TO postgres;

-- PASSO 5: Desabilitar RLS completamente
ALTER TABLE braspex.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE braspex.products DISABLE ROW LEVEL SECURITY;

-- PASSO 6: Remover todas as policies (se existirem)
DROP POLICY IF EXISTS "Enable read access for all users" ON braspex.categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON braspex.categories;
DROP POLICY IF EXISTS "Enable update for users based on email" ON braspex.categories;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON braspex.categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON braspex.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON braspex.products;
DROP POLICY IF EXISTS "Enable update for users based on email" ON braspex.products;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON braspex.products;

-- PASSO 7: Verificar permissões
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'braspex'
AND table_name IN ('categories', 'products')
ORDER BY table_name, grantee;

-- PASSO 8: Verificar RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Ativo?"
FROM pg_tables
WHERE schemaname = 'braspex' 
AND tablename IN ('categories', 'products');
