-- ============================================
-- SCRIPT SQL PARA CRIAR TABELAS NO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================

-- 1. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT DEFAULT 'Package',
  logo TEXT,
  color TEXT DEFAULT '#005563',
  subcategories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por nome
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Comentários
COMMENT ON TABLE categories IS 'Categorias de produtos (PEX, GÁS, KIT, POLVO, OUTROS)';
COMMENT ON COLUMN categories.name IS 'ID único da categoria (slug)';
COMMENT ON COLUMN categories.display_name IS 'Nome de exibição da categoria';
COMMENT ON COLUMN categories.subcategories IS 'Array JSON de subcategorias [{id, name, slug}]';

-- ============================================

-- 2. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT NOT NULL,
  subcategory_id TEXT,
  image TEXT,
  price DECIMAL(10, 2),
  specifications JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Comentários
COMMENT ON TABLE products IS 'Catálogo de produtos';
COMMENT ON COLUMN products.specifications IS 'Especificações técnicas do produto (material, acabamento, capacity, dimensions, diametros, normas)';

-- ============================================

-- 3. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'prospect', 'client', 'inactive')),
  inactive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_stage ON clients(stage);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Comentários
COMMENT ON TABLE clients IS 'Cadastro de clientes (leads, prospects, clientes ativos e inativos)';
COMMENT ON COLUMN clients.stage IS 'Estágio do cliente no funil: lead, prospect, client, inactive';

-- ============================================

-- 4. TABELA DE COTAÇÕES
CREATE TABLE IF NOT EXISTS quotes (
  id BIGSERIAL PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  source TEXT DEFAULT 'cart' CHECK (source IN ('cart', 'contact-form')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes((customer->>'email'));

-- Comentários
COMMENT ON TABLE quotes IS 'Cotações recebidas de clientes';
COMMENT ON COLUMN quotes.customer IS 'Dados do cliente {name, email, phone, company, message, etc}';
COMMENT ON COLUMN quotes.items IS 'Array de produtos cotados [{id, name, quantity, price}]';
COMMENT ON COLUMN quotes.source IS 'Origem da cotação: cart (carrinho) ou contact-form (formulário)';
COMMENT ON COLUMN quotes.status IS 'Status: pending, contacted, converted, cancelled';

-- ============================================

-- 5. HABILITAR ROW LEVEL SECURITY (RLS) - OPCIONAL
-- Se você quiser proteger as tabelas, descomente as linhas abaixo:

-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (opcional)
-- CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);

-- ============================================

-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Para verificar se as tabelas foram criadas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
