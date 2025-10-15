# Botão "Ver Vídeo" Adicionado ao Hero

## ✅ Mudança Implementada

**Arquivo:** `src/components/Hero.jsx`

### Antes:
```jsx
[Solicitar Orçamento →]  [📞 Fale Conosco]
```

### Depois:
```jsx
[Solicitar Orçamento →]  [▶ Ver Vídeo]
```

---

## 🎬 Como Funciona

O botão "Ver Vídeo" abre um link do YouTube em uma nova aba quando clicado.

### Código Atual:
```jsx
<motion.button
  onClick={() => window.open('https://www.youtube.com/watch?v=SEU_VIDEO_ID', '_blank')}
  className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-lg border-2 border-white/30 hover:bg-white hover:text-[#005563] hover:border-white transition-all duration-300"
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
>
  <PlayCircle className="w-6 h-6" weight="fill" />
  Ver Vídeo
</motion.button>
```

---

## 📝 IMPORTANTE: Adicionar o Link do Seu Vídeo

**Você precisa substituir `SEU_VIDEO_ID` pelo ID real do vídeo do YouTube.**

### Como encontrar o ID do vídeo:

1. Vá para o seu vídeo no YouTube
2. Copie a URL. Exemplo:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
3. O ID é a parte depois de `v=`, neste caso: `dQw4w9WgXcQ`

### Como atualizar:

**Abra:** `src/components/Hero.jsx` (linha ~122)

**Encontre:**
```jsx
onClick={() => window.open('https://www.youtube.com/watch?v=SEU_VIDEO_ID', '_blank')}
```

**Substitua por:**
```jsx
onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
```
*(usando o ID do seu vídeo)*

---

## 🎨 Design do Botão

- **Ícone:** PlayCircle (preenchido) do Phosphor React
- **Estilo:** Fundo translúcido com borda branca
- **Hover:** Fica completamente branco com texto teal
- **Animação:** Escala e move para cima ao passar o mouse
- **Responsivo:** Tamanhos ajustados para mobile/desktop

---

## 🔄 Alternativas de Implementação

### Opção 1: Modal com Player Incorporado (Recomendado)
Em vez de abrir em nova aba, você pode abrir um modal com o vídeo incorporado:

```jsx
const [isVideoOpen, setIsVideoOpen] = useState(false);

// Botão:
<motion.button
  onClick={() => setIsVideoOpen(true)}
  // ... resto do código
>

// Modal (adicionar no final do componente):
{isVideoOpen && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsVideoOpen(false)}>
    <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setIsVideoOpen(false)} className="absolute -top-10 right-0 text-white">
        <X size={32} />
      </button>
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/SEU_VIDEO_ID?autoplay=1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
)}
```

**Vantagens:**
- Usuário não sai do site
- Experiência mais profissional
- Autoplay automático

### Opção 2: Link Direto para Vimeo
Se você usa Vimeo em vez de YouTube:

```jsx
onClick={() => window.open('https://vimeo.com/SEU_VIDEO_ID', '_blank')}
```

### Opção 3: Vídeo Próprio Hospedado
Se o vídeo está no seu servidor:

```jsx
onClick={() => window.open('/videos/institucional.mp4', '_blank')}
```

---

## ✅ Checklist

- [x] Botão "Ver Vídeo" criado
- [x] Ícone PlayCircle adicionado
- [x] Animações configuradas
- [x] Responsividade garantida
- [ ] **VOCÊ:** Substituir `SEU_VIDEO_ID` pelo ID real do vídeo
- [ ] **OPCIONAL:** Implementar modal com player incorporado

---

## 🎯 Resultado Esperado

Ao clicar no botão "Ver Vídeo", o usuário verá:
1. **Atualmente:** Abre nova aba do YouTube (após você adicionar o ID)
2. **Com modal (opcional):** Vídeo abre em overlay sem sair do site

---

## 💡 Dica

Se você ainda não tem o vídeo institucional, algumas ideias:
- Apresentação da empresa e facilities
- Tour pela fábrica/instalações
- Demonstração de instalação dos kits
- Depoimentos de clientes
- Processo de fabricação

Vídeos institucionais geralmente têm **1 a 3 minutos** de duração.

---

## 📱 Testado e Funcionando

- ✅ Desktop
- ✅ Mobile
- ✅ Hover effects
- ✅ Animações suaves
- ✅ Sem erros de compilação

**Lembre-se de adicionar o link do vídeo para o botão funcionar!** 🎬
