-- ============================================
-- SIMPLIFICAR CATEGORIAS - ESTRUTURA LIMPA
-- ============================================

-- PASSO 1: LIMPAR TABELA CATEGORIES
TRUNCATE TABLE braspex.categories CASCADE;

-- PASSO 2: REMOVER COLUNAS DESNECESSÁRIAS
ALTER TABLE braspex.categories DROP COLUMN IF EXISTS logo;
ALTER TABLE braspex.categories DROP COLUMN IF EXISTS slug;
ALTER TABLE braspex.categories DROP COLUMN IF EXISTS description;

-- PASSO 3: GARANTIR QUE COLUNAS NECESSÁRIAS EXISTEM
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS display_name TEXT NOT NULL;
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Package';
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#005563';
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE braspex.categories ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;

-- PASSO 4: GARANTIR PERMISSÕES TOTAIS
GRANT ALL ON braspex.categories TO anon;
GRANT ALL ON braspex.categories TO authenticated;
GRANT ALL ON braspex.categories TO service_role;
GRANT ALL ON braspex.categories TO postgres;

-- PASSO 5: DESABILITAR RLS
ALTER TABLE braspex.categories DISABLE ROW LEVEL SECURITY;

-- PASSO 6: INSERIR 5 CATEGORIAS PADRÃO
INSERT INTO braspex.categories (id, name, display_name, icon, color, order_index, active, subcategories, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'pex', 'Linha Pex', 'Package', '#E31E24', 1, true, 
   '[{"id":"conexoes","name":"Conexões"},{"id":"ferramentas","name":"Ferramentas"},{"id":"tubos","name":"Tubos"},{"id":"valvulas","name":"Válvulas / Registros"}]'::jsonb,
   NOW(), NOW()),
  
  (gen_random_uuid(), 'gas', 'Linha Pex Gás', 'Fire', '#FFD027', 2, true, 
   '[{"id":"conexoes","name":"Conexões"},{"id":"ferramentas","name":"Ferramentas"},{"id":"tubos","name":"Tubos"}]'::jsonb,
   NOW(), NOW()),
  
  (gen_random_uuid(), 'kit', 'Sistema Kit', 'Cube', '#6B7280', 3, true, 
   '[{"id":"hidraulicos","name":"Kits Hidráulicos"},{"id":"componentes","name":"Componentes para Kits Hidráulicos"}]'::jsonb,
   NOW(), NOW()),
  
  (gen_random_uuid(), 'polvo', 'Sistema Polvo', 'Lightning', '#10B981', 4, true, '[]'::jsonb, NOW(), NOW()),
  
  (gen_random_uuid(), 'outros', 'Outros Sistemas', 'Gear', '#005563', 5, true, 
   '[{"id":"rayper","name":"Rayper"},{"id":"smartban","name":"Smartban"},{"id":"assessoria","name":"Assessoria / Projetos"}]'::jsonb,
   NOW(), NOW());

-- PASSO 7: VERIFICAR RESULTADO
SELECT id, name, display_name, icon, color, order_index, 
       jsonb_array_length(subcategories) as "Qtd Subcategorias"
FROM braspex.categories
ORDER BY order_index;

-- PASSO 8: VERIFICAR ESTRUTURA DA TABELA
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'braspex' 
AND table_name = 'categories'
ORDER BY ordinal_position;
