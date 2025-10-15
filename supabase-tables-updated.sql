-- ============================================
-- SCRIPT SQL ATUALIZADO - BRASPEX
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script cria/atualiza as tabelas com relacionamentos corretos
-- ============================================

-- LIMPAR TABELAS EXISTENTES (CUIDADO EM PRODUÇÃO!)
-- Descomente as linhas abaixo apenas na primeira vez
-- DROP TABLE IF EXISTS quotes CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- 1. TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- 'pex', 'gas', 'kit', 'polvo', 'outros' (slug único)
  display_name TEXT NOT NULL, -- Nome para exibição: "PEX", "Gás", "Kit"
  slug TEXT UNIQUE NOT NULL, -- URL-friendly (igual ao name por padrão)
  icon TEXT DEFAULT 'Package', -- Ícone Phosphor React
  logo TEXT, -- URL do logo da categoria
  color TEXT DEFAULT '#005563', -- Cor em HEX
  description TEXT, -- Descrição da categoria
  subcategories JSONB DEFAULT '[]'::jsonb, -- Array: [{"id": "tubos", "name": "Tubos", "slug": "tubos"}]
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0, -- Ordem de exibição no menu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- Comentários
COMMENT ON TABLE categories IS 'Categorias de produtos (PEX, Gás, Kit, Polvo, Outros)';
COMMENT ON COLUMN categories.name IS 'Identificador único da categoria (ex: pex, gas)';
COMMENT ON COLUMN categories.display_name IS 'Nome de exibição (ex: PEX, Gás)';
COMMENT ON COLUMN categories.subcategories IS 'Array JSON de subcategorias: [{"id": "tubos", "name": "Tubos"}]';

-- ============================================
-- 2. TABELA DE PRODUTOS (ATUALIZADA)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly do produto
  description TEXT,
  
  -- RELACIONAMENTO COM CATEGORIA (Chave Estrangeira)
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT, -- Cache do nome da categoria para facilitar queries
  subcategory_id TEXT, -- ID da subcategoria (ex: "tubos", "conexoes")
  subcategory_name TEXT, -- Nome da subcategoria (cache)
  
  -- IMAGENS (Supabase Storage)
  image_url TEXT, -- URL principal da imagem
  image_path TEXT, -- Caminho no Storage: "products/uuid/imagem.png"
  thumbnail_url TEXT, -- URL da miniatura (opcional)
  gallery JSONB DEFAULT '[]'::jsonb, -- Array de URLs adicionais: ["url1", "url2"]
  
  -- PREÇO
  price NUMERIC(10, 2), -- NULL = "Sob consulta"
  price_label TEXT DEFAULT 'Sob Consulta',
  currency TEXT DEFAULT 'BRL',
  sku TEXT UNIQUE, -- Código SKU único do produto
  
  -- ESPECIFICAÇÕES TÉCNICAS
  specifications JSONB DEFAULT '{}'::jsonb, -- {"material": "PEX", "diametro": "20mm"}
  features JSONB DEFAULT '[]'::jsonb, -- ["Alta resistência", "Fácil instalação"]
  
  -- METADATA
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false, -- Produto em destaque na home
  stock_status TEXT DEFAULT 'in_stock', -- 'in_stock', 'out_of_stock', 'on_demand'
  order_index INTEGER DEFAULT 0, -- Ordem de exibição
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Índice GIN para busca dentro do JSON
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING gin(specifications);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING gin(features);

-- Comentários
COMMENT ON TABLE products IS 'Catálogo de produtos com relacionamento à tabela categories';
COMMENT ON COLUMN products.category_id IS 'ID da categoria (chave estrangeira para categories.id)';
COMMENT ON COLUMN products.image_path IS 'Caminho no Supabase Storage bucket "products"';
COMMENT ON COLUMN products.gallery IS 'Array JSON de URLs de imagens adicionais';
COMMENT ON COLUMN products.specifications IS 'JSON de especificações técnicas';
COMMENT ON COLUMN products.stock_status IS 'Status de estoque: in_stock, out_of_stock, on_demand';

-- ============================================
-- 3. TABELA DE CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- ENDEREÇO
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- METADATA
  notes TEXT,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'prospect', 'client', 'inactive')),
  inactive BOOLEAN DEFAULT false,
  
  -- TAGS (opcional)
  tags TEXT[], -- Array de tags: ['vip', 'corporativo']
  
  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_stage ON clients(stage);
CREATE INDEX IF NOT EXISTS idx_clients_inactive ON clients(inactive);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Comentários
COMMENT ON TABLE clients IS 'Cadastro de clientes (leads, prospects, clientes ativos)';
COMMENT ON COLUMN clients.stage IS 'Estágio no funil: lead, prospect, client, inactive';

-- ============================================
-- 4. TABELA DE COTAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  
  -- CLIENTE (pode não estar cadastrado ainda)
  customer JSONB NOT NULL, -- {"name": "João", "email": "...", "phone": "..."}
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL, -- Opcional: link com cliente cadastrado
  
  -- ITENS DO PEDIDO
  items JSONB DEFAULT '[]'::jsonb, -- Array de produtos: [{"product_id": "...", "quantity": 2}]
  
  -- ORIGEM E STATUS
  source TEXT DEFAULT 'cart' CHECK (source IN ('cart', 'contact-form', 'whatsapp', 'phone')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'cancelled', 'closed')),
  
  -- VALORES
  total_value NUMERIC(10, 2), -- Valor total (calculado ou informado)
  notes TEXT, -- Observações da cotação
  
  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_source ON quotes(source);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes((customer->>'email'));

-- Comentários
COMMENT ON TABLE quotes IS 'Cotações recebidas pelo site (carrinho ou formulário)';
COMMENT ON COLUMN quotes.customer IS 'JSON com dados do cliente: {name, email, phone, company}';
COMMENT ON COLUMN quotes.items IS 'Array de produtos: [{"product_id": "uuid", "name": "...", "quantity": 2}]';

-- ============================================
-- 5. TRIGGERS PARA UPDATED_AT
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para quotes
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. DADOS INICIAIS - CATEGORIAS
-- ============================================

-- Inserir categorias padrão (se não existirem)
INSERT INTO categories (name, display_name, slug, icon, color, description, order_index) VALUES
  ('pex', 'PEX', 'pex', 'Package', '#005563', 'Tubulação PEX para água quente e fria', 1),
  ('gas', 'Gás', 'gas', 'Fire', '#FF6B00', 'Tubulação para gás residencial e comercial', 2),
  ('kit', 'Kits', 'kit', 'Cube', '#FFD027', 'Kits completos de instalação', 3),
  ('polvo', 'Polvo', 'polvo', 'Lightning', '#00A86B', 'Distribuidor tipo polvo', 4),
  ('outros', 'Outros', 'outros', 'Gear', '#6B7280', 'Outros produtos e acessórios', 5)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 7. STORAGE BUCKET PARA IMAGENS (VIA DASHBOARD)
-- ============================================

-- IMPORTANTE: Execute no Dashboard do Supabase:
-- 1. Vá em Storage
-- 2. Crie um bucket chamado "products"
-- 3. Configure como PÚBLICO (Public bucket)
-- 4. Defina políticas:
--    - SELECT: Público (anyone)
--    - INSERT: Apenas autenticados
--    - UPDATE: Apenas autenticados
--    - DELETE: Apenas autenticados

-- ============================================
-- 8. RLS (ROW LEVEL SECURITY) - OPCIONAL
-- ============================================

-- Desabilitar RLS temporariamente para desenvolvimento
-- Em produção, habilite e configure as políticas

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- VERIFICAR TABELAS CRIADAS:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- VERIFICAR COLUNAS DA TABELA PRODUCTS:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position;
