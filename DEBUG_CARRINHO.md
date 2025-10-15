# 🐛 DEBUG - PROBLEMA COM CARRINHO

## O QUE FOI FEITO:

### 1. ✅ Logs de Debug Adicionados

**CartContext.jsx:**
- 🛒 Log quando `addToCart()` é chamado
- ✅ Log quando produto é adicionado com sucesso
- ✅ Log quando quantidade é aumentada
- 💾 Log quando carrinho é salvo no localStorage
- ❌ Log quando produto é inválido

**ProductsShowcase.jsx:**
- 📦 Log dos produtos carregados
- ⭐ Log dos produtos em destaque
- 🔘 Log quando botão de adicionar é clicado

### 2. ✅ Validação no `addToCart()`

Agora a função valida se o produto é válido antes de adicionar:
```javascript
if (!product || !product.id) {
  console.error('❌ Produto inválido:', product);
  return;
}
```

---

## 🔍 COMO DEBUGAR:

### Passo 1: Abrir Console do Navegador
1. Pressione **F12** (ou Ctrl+Shift+I)
2. Vá na aba **Console**
3. Limpe o console (ícone 🚫 ou Ctrl+L)

### Passo 2: Testar Adicionar ao Carrinho
1. Na página inicial, role até "Produtos em Destaque"
2. Clique no botão amarelo com ícone de carrinho 🛒
3. Observe o console

### Passo 3: Analisar os Logs

**O que você DEVE ver se funcionar:**
```
📦 Produtos carregados: Array(3) [...]
⭐ Produtos em destaque: Array(3) [...]
🔘 Botão clicado - Produto: {id: 1, name: "...", ...}
🛒 Adicionando ao carrinho: {id: 1, name: "...", ...}
✅ Adicionando novo produto ao carrinho
💾 Carrinho salvo: 1 itens
```

**O que indica PROBLEMA:**

❌ **Nenhum log aparece ao clicar:**
- O botão não está capturando o clique
- Possível problema com event handler
- Verificar se o botão está coberto por outro elemento

❌ **Aparece "Produto inválido":**
```
🔘 Botão clicado - Produto: {id: undefined, ...}
❌ Produto inválido: {id: undefined}
```
- Produto não tem `id` definido
- Verificar `productsUtils.js`

❌ **Log para mas carrinho não atualiza:**
```
🛒 Adicionando ao carrinho: {...}
✅ Adicionando novo produto ao carrinho
💾 Carrinho salvo: 0 itens  ← PROBLEMA AQUI
```
- Estado não está sendo atualizado
- Problema no `setCartItems`

---

## 🔧 POSSÍVEIS CAUSAS E SOLUÇÕES:

### Causa 1: Produtos sem ID
**Sintoma:** Log mostra `{id: undefined}`

**Solução:** Verificar `productsUtils.js` - garantir que produtos têm ID único

```javascript
// Em productsUtils.js
export const saveProducts = (products) => {
  const productsWithId = products.map((p, index) => ({
    ...p,
    id: p.id || `product-${Date.now()}-${index}` // Gerar ID se não existir
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithId));
};
```

### Causa 2: CartContext não está envolvendo componente
**Sintoma:** Erro no console: "useCart must be used within a CartProvider"

**Solução:** Já verificado - CartProvider está correto no App.jsx ✅

### Causa 3: Multiple renders causando conflito
**Sintoma:** Logs aparecem mas carrinho volta a 0

**Solução:** Adicionar `key` único nos produtos:
```jsx
{featuredProducts.map((product) => (
  <motion.div key={`product-${product.id}`} ...>
))}
```

### Causa 4: localStorage bloqueado
**Sintoma:** Erro de permissão ao salvar

**Solução:** Verificar se localStorage está habilitado:
```javascript
// Testar no console do navegador:
localStorage.setItem('test', 'test');
console.log(localStorage.getItem('test')); // Deve retornar 'test'
```

### Causa 5: Produtos não estão carregando
**Sintoma:** Log mostra `📦 Produtos carregados: Array(0) []`

**Solução:** Verificar se há produtos no localStorage:
```javascript
// No console do navegador:
JSON.parse(localStorage.getItem('braspex_products'))
```

Se retornar `null` ou `[]`, você precisa adicionar produtos pelo painel admin.

---

## 🎯 TESTE RÁPIDO NO CONSOLE:

Cole estes comandos no console do navegador (F12):

```javascript
// 1. Verificar se CartContext está funcionando
window.__CART_TEST__ = true;

// 2. Ver produtos no localStorage
console.log('Produtos:', JSON.parse(localStorage.getItem('braspex_products')));

// 3. Ver carrinho atual
console.log('Carrinho:', JSON.parse(localStorage.getItem('braspex_cart')));

// 4. Testar adicionar produto manualmente
const testProduct = {
  id: 'test-1',
  name: 'Produto Teste',
  price: 100,
  image: 'https://via.placeholder.com/300'
};

// Adicionar ao carrinho manualmente
let cart = JSON.parse(localStorage.getItem('braspex_cart') || '[]');
cart.push({ ...testProduct, quantity: 1 });
localStorage.setItem('braspex_cart', JSON.stringify(cart));
console.log('✅ Produto teste adicionado! Recarregue a página.');
```

Se o teste manual funcionar e adicionar ao carrinho, o problema é no clique do botão ou na passagem do produto.

---

## 📋 CHECKLIST DE VERIFICAÇÃO:

Execute cada item e marque:

- [ ] Console abre sem erros? (F12)
- [ ] Logs aparecem ao carregar a página?
  - [ ] `📦 Produtos carregados`
  - [ ] `⭐ Produtos em destaque`
- [ ] Log aparece ao clicar no botão?
  - [ ] `🔘 Botão clicado`
- [ ] Log mostra produto com ID válido?
  - [ ] `🛒 Adicionando ao carrinho: {id: "...", ...}`
- [ ] Produto tem todas as propriedades?
  - [ ] `id` ✓
  - [ ] `name` ✓
  - [ ] `price` ✓
  - [ ] `image` ✓
- [ ] Carrinho é salvo?
  - [ ] `💾 Carrinho salvo: 1 itens`
- [ ] Contador no header atualiza?
  - [ ] Badge com número aparece
- [ ] localStorage tem o carrinho?
  - [ ] `braspex_cart` no localStorage

---

## 🚨 SE NADA FUNCIONAR:

### Opção 1: Limpar tudo e começar do zero

```javascript
// No console (F12):
localStorage.clear();
location.reload();
```

Depois adicione produtos pelo painel admin.

### Opção 2: Verificar se há conflito de versões

```bash
# No terminal:
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Opção 3: Usar versão simplificada do addToCart

Se nada funcionar, podemos simplificar:

```javascript
const addToCart = (product) => {
  // Versão super simples para debug
  const cart = JSON.parse(localStorage.getItem('braspex_cart') || '[]');
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem('braspex_cart', JSON.stringify(cart));
  setCartItems(cart);
  alert('Produto adicionado!'); // Feedback visual
};
```

---

## 📱 ONDE RELATAR RESULTADO:

Após fazer os testes, me informe:

1. **Quais logs apareceram no console?**
2. **O botão está clicável?** (cursor muda, animação funciona)
3. **O localStorage está funcionando?** (teste manual funcionou?)
4. **Há algum erro no console?** (vermelho ❌)
5. **O número no carrinho atualiza no header?**

Com essas informações consigo identificar exatamente o problema! 🔍
