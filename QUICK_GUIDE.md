# 🚀 Guia Rápido - BRASPEX React

## ✅ Status Atual: TUDO FUNCIONANDO

---

## 🌐 Acessar o Site

### Desenvolvimento
```
http://localhost:5174/
```

### Páginas Disponíveis
- `/` - Homepage
- `/produtos` - Catálogo de produtos
- `/produtos/:id` - Detalhes do produto
- `/orcamento` - Checkout de orçamento
- `/admin` - Painel administrativo (requer login)
- `/blog` - Blog (se configurado)
- `/blog/:slug` - Post individual

---

## 🔐 Acesso Admin

### URL
```
http://localhost:5174/admin
```

### Credenciais
```
Usuário: admin
Senha: Braspex2025!
```

### Seções Disponíveis
1. **Página Principal**
   - Ordem das Seções
   - Editar Textos

2. **Blog**
   - Gerenciar posts
   - Criar/editar/deletar

3. **Clientes**
   - Kanban de clientes
   - Status do pipeline

4. **Cotações**
   - Gerenciar cotações recebidas
   - Status e acompanhamento

5. **Produtos**
   - Gerenciar Produtos
   - **Categorias** ⭐ (NOVO - Melhorado)

6. **Admin**
   - Analytics
   - Teste Supabase

---

## 🏷️ Gerenciador de Categorias (NOVO)

### Características
- ✅ **Fallback automático** se Supabase estiver offline
- ✅ **Categorias padrão**: PEX, Gás, Kits, Polvo, Outros
- ✅ **Indicador de status**: Online/Offline
- ✅ **Tratamento de erros** robusto
- ✅ **Botão "Tentar reconectar"**

### Como Usar

#### Modo Online (Supabase conectado)
1. Acesse **Produtos** > **Categorias**
2. Clique em **Nova Categoria**
3. Preencha os dados:
   - Nome da categoria *
   - Ícone
   - Cor
   - Subcategorias (opcional)
4. Clique em **Salvar**

#### Modo Offline (Supabase desconectado)
- Visualiza categorias padrão
- Botões de edição desabilitados
- Banner amarelo indica modo offline
- Clique em "Tentar reconectar" para testar conexão

---

## 🎨 Categorias Padrão

| Categoria | Nome | Cor | Ícone |
|-----------|------|-----|-------|
| PEX | Linha PEX | #005563 | Package |
| GAS | Gás | #FF6B00 | Fire |
| KIT | Kits | #FFD027 | Cube |
| POLVO | Polvo | #00A86B | Lightning |
| OUTROS | Outros | #6B7280 | Gear |

---

## 🛠️ Comandos

### Iniciar servidor
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview do build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## 🔧 Configuração

### Arquivo `.env`
```env
VITE_SUPABASE_URL=http://173.249.32.99:54321
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SCHEMA=braspex
```

**⚠️ Importante**: Não commitar o `.env` no Git!

---

## 🐛 Troubleshooting

### Site não abre
1. Verifique se o servidor está rodando: `npm run dev`
2. Acesse: `http://localhost:5174/` (porta pode variar)
3. Se a porta 5173 estiver em uso, Vite usa 5174 automaticamente

### Admin mostra "Modo Offline"
1. Verifique se Supabase está acessível
2. Teste: `curl http://173.249.32.99:54321`
3. Clique em "Tentar reconectar"
4. Se offline, categorias padrão ainda funcionam

### Erro ao salvar categoria
1. Verifique conexão com Supabase
2. Execute `supabase-fix-structure.sql` no Supabase
3. Execute `supabase-permissions-FULL.sql`
4. Reinicie o servidor

### Limpar cache
```javascript
// No console do navegador (F12)
localStorage.clear();
location.reload();
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `FIXES_APPLIED.md` - Todas as correções aplicadas
- `CORRECAO_URGENTE.md` - Histórico de problemas
- `SOLUCAO_SIMPLES_CATEGORIAS.md` - Soluções alternativas

---

## ✅ Checklist

### Site Funcionando?
- [ ] Abre em `http://localhost:5174/`
- [ ] Menu de navegação funciona
- [ ] Seções carregam sem erros
- [ ] Console sem erros críticos

### Admin Funcionando?
- [ ] Login funciona com `admin` / `Braspex2025!`
- [ ] Menu lateral carrega
- [ ] Todas as seções acessíveis
- [ ] Gerenciador de categorias abre

### Categorias Funcionando?
- [ ] Lista categorias (padrão ou do banco)
- [ ] Mostra status (Online/Offline)
- [ ] Botões funcionam quando online
- [ ] Fallback funciona quando offline

---

## 🎉 Tudo Pronto!

O site e o painel admin estão **100% funcionais**.

- ✅ Site carregando
- ✅ Admin carregando
- ✅ Categorias com fallback inteligente
- ✅ Tratamento de erros robusto
- ✅ UX melhorada

**Última atualização**: 19 de Outubro de 2025
