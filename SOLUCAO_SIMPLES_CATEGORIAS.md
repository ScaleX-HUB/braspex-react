# 🔥 SOLUÇÃO SIMPLES PARA CATEGORIAS

## Problema
O erro 401 persiste mesmo após desabilitar RLS. Isso indica que:
1. O Supabase não está aceitando requisições UPDATE/DELETE
2. Pode haver problema de autenticação
3. A API REST do Supabase pode estar bloqueando

## ✅ SOLUÇÃO: Usar categorias FIXAS no código

Ao invés de tentar editar no banco (que dá erro 401), vamos:
1. **Manter categorias FIXAS** no código (não editáveis pelo admin)
2. **Apenas subcategorias editáveis** (mais simples)
3. **Focar no que funciona**: produtos já estão funcionando!

## 🎯 Implementação

### Opção 1: Categorias Hardcoded (RECOMENDADO)
- PEX, GAS, KIT, POLVO, OUTROS → **fixas no código**
- Subcategorias → **editáveis** (sem problemas de permissão)
- Admin pode adicionar/remover **apenas subcategorias**

### Opção 2: Desabilitar edição de categorias no Admin
- Manter as 5 categorias atuais
- Remover botões de Editar/Deletar categorias
- Admin gerencia **apenas produtos e subcategorias**

### Opção 3: Tentar grant de permissões SQL (complexo)
- Dar permissões diretas no PostgreSQL
- Pode não funcionar com self-hosted Supabase
- Requer acesso root ao banco

## 📋 Qual solução você prefere?

**A mais rápida é a Opção 1** - vou implementar agora se você quiser!
