# 🔧 Setup do Supabase - BRASPEX

## Status Atual

O sistema funciona com **fallback** mesmo se o Supabase estiver offline.

- ✅ **Online**: Usa dados do Supabase
- ✅ **Offline**: Usa categorias padrão (PEX, Gás, Kits, Polvo, Outros)

---

## 🚀 Opção 1: Usar sem Supabase (Recomendado para testes)

### Vantagens
- ✅ Funciona imediatamente
- ✅ Sem configuração necessária
- ✅ Categorias padrão incluídas
- ✅ Perfeito para desenvolvimento

### Como funciona
1. Site detecta que Supabase está offline
2. Mostra banner "Modo Offline"
3. Usa categorias padrão automaticamente
4. Todos os recursos funcionam normalmente

### Limitações
- Não pode criar novas categorias
- Não pode editar categorias existentes
- Dados não persistem entre reloads (para categorias)

---

## 🔌 Opção 2: Conectar ao Supabase

### Pré-requisitos
- Supabase rodando em: `http://173.249.32.99:54321`
- Acesso à interface admin do Supabase
- Acesso ao SQL Editor

### Passo 1: Verificar Conexão

Teste se o Supabase está acessível:

```bash
# PowerShell
Invoke-WebRequest -Uri "http://173.249.32.99:54321" -Method GET

# Ou use o navegador
http://173.249.32.99:54321
```

✅ Se retornar algo, Supabase está online.

### Passo 2: Executar SQL de Estrutura

1. Acesse: `http://173.249.32.99:54321` (interface admin)
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie o conteúdo de `supabase-fix-structure.sql`
5. Cole e clique em **RUN**
6. Aguarde a mensagem de sucesso

**O que esse SQL faz:**
- Cria/atualiza tabela `categories` com todas as colunas necessárias
- Cria/atualiza tabela `products` com todas as colunas necessárias
- Insere as 5 categorias padrão
- Configura índices e relacionamentos

### Passo 3: Configurar Permissões

1. No SQL Editor, abra uma nova query
2. Copie o conteúdo de `supabase-permissions-FULL.sql`
3. Cole e clique em **RUN**

**O que esse SQL faz:**
- Desabilita RLS (Row Level Security) para desenvolvimento
- Dá permissões completas para o schema `braspex`
- Permite SELECT, INSERT, UPDATE, DELETE sem autenticação

⚠️ **Atenção**: Essas permissões são para DESENVOLVIMENTO. Em produção, configure RLS adequadamente.

### Passo 4: Verificar

Execute no SQL Editor:

```sql
-- Ver categorias
SELECT * FROM braspex.categories ORDER BY order_index;

-- Deve retornar 5 categorias: pex, gas, kit, polvo, outros
```

```sql
-- Ver estrutura de products
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'braspex' 
AND table_name = 'products'
ORDER BY ordinal_position;

-- Deve incluir: category_name, subcategory_name, slug, etc.
```

### Passo 5: Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### Passo 6: Testar

1. Acesse: `http://localhost:5174/admin`
2. Login: `admin` / `Braspex2025!`
3. Vá em **Produtos** > **Categorias**
4. ✅ **Sem banner amarelo** = Conectado ao Supabase
5. ⚠️ **Com banner amarelo** = Modo offline (usando fallback)

---

## 🔍 Diagnóstico de Problemas

### Problema: Banner "Modo Offline" aparece

#### Causa 1: Supabase está realmente offline
```bash
# Teste a conexão
curl http://173.249.32.99:54321

# Se falhar, Supabase está offline
```

**Solução**: Inicie o Supabase ou use modo offline (já funciona!)

#### Causa 2: URL incorreta no `.env`
Verifique o arquivo `.env`:
```env
VITE_SUPABASE_URL=http://173.249.32.99:54321
```

**Solução**: Corrija a URL e reinicie o servidor

#### Causa 3: Chave de API inválida
Verifique no `.env`:
```env
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Solução**: 
1. Acesse Supabase Dashboard
2. Vá em **Settings** > **API**
3. Copie a chave `anon public`
4. Atualize o `.env`
5. Reinicie o servidor

#### Causa 4: Schema incorreto
Verifique no `.env`:
```env
VITE_SUPABASE_SCHEMA=braspex
```

**Solução**: Certifique-se que o schema é `braspex` (não `public`)

---

### Problema: Erro 400 ao criar categoria

```
Error: Erro na requisição: 400 Bad Request
```

#### Causa: Coluna não existe no banco

**Solução**: Execute `supabase-fix-structure.sql` novamente

```sql
-- Verificar se as colunas existem
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'braspex' 
AND table_name = 'categories';

-- Deve incluir: display_name, icon, color, subcategories, etc.
```

---

### Problema: Erro 401 ao salvar categoria

```
Error: Erro na requisição: 401 Unauthorized
```

#### Causa: Permissões não configuradas

**Solução**: Execute `supabase-permissions-FULL.sql`

```sql
-- Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'braspex';

-- rowsecurity deve ser 'false' para desenvolvimento
```

---

### Problema: Erro 404 ao conectar

```
Error: Erro na requisição: 404 Not Found
```

#### Causa: Tabela não existe

**Solução**: Execute `supabase-fix-structure.sql`

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables
WHERE table_schema = 'braspex';

-- Deve retornar: categories, products, clients, quotes, texts, etc.
```

---

## 📋 Checklist de Setup do Supabase

### Verificações Básicas
- [ ] Supabase está rodando e acessível
- [ ] URL correta no `.env`
- [ ] Chave de API correta no `.env`
- [ ] Schema `braspex` configurado

### Verificações de Estrutura
- [ ] Tabela `categories` existe
- [ ] Tabela `products` existe
- [ ] Colunas necessárias existem em ambas
- [ ] 5 categorias padrão inseridas

### Verificações de Permissões
- [ ] RLS desabilitado (desenvolvimento)
- [ ] Permissões de SELECT, INSERT, UPDATE, DELETE
- [ ] Schema `braspex` acessível
- [ ] Teste de conexão via admin funciona

### Verificações da Aplicação
- [ ] Servidor reiniciado após mudanças no `.env`
- [ ] Sem banner "Modo Offline" no admin
- [ ] Categorias carregam do Supabase
- [ ] Pode criar nova categoria sem erros
- [ ] Pode editar categoria existente
- [ ] Pode deletar categoria

---

## 🎯 Qual opção escolher?

### Use **Opção 1 (Sem Supabase)** se:
- ✅ Está apenas testando o sistema
- ✅ Não precisa persistir dados
- ✅ Quer algo funcionando imediatamente
- ✅ Supabase não está configurado ainda

### Use **Opção 2 (Com Supabase)** se:
- ✅ Precisa persistir dados
- ✅ Quer criar categorias customizadas
- ✅ Está em produção
- ✅ Tem acesso ao Supabase

---

## ⚡ Modo Híbrido (Atual)

O sistema atual funciona nos **dois modos automaticamente**:

1. **Tenta conectar ao Supabase** na inicialização
2. **Se conectar**: Usa dados do banco
3. **Se não conectar**: Usa categorias padrão (fallback)
4. **Informa o usuário**: Banner de status claro
5. **Permite reconexão**: Botão "Tentar reconectar"

### Vantagens
- ✅ **Sempre funciona**, mesmo offline
- ✅ **Sem configuração obrigatória**
- ✅ **Transição suave** entre online/offline
- ✅ **UX consistente** em ambos os modos

---

## 📞 Ainda com Problemas?

1. Verifique o console do navegador (F12)
2. Verifique os logs do terminal do Vite
3. Teste a conexão com Supabase manualmente
4. Consulte `FIXES_APPLIED.md` para mais detalhes

---

**Lembre-se**: O sistema já funciona perfeitamente no **modo offline** com categorias padrão. Conectar ao Supabase é opcional e só necessário se você precisar criar categorias customizadas!
