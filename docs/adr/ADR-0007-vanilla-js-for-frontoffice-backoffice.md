# ADR-0007: Vanilla JS para Front-office e Back-office

**Status:** Aceito ✅  
**Data:** 2025-11-13  
**Contexto:** Definição de stack tecnológica para cada produto da plataforma  
**Decisor:** Time de Produto + Tech Lead  
**Supersede:** Parcialmente ADR-0006 (mantém arquitetura unificada, muda stack)

---

## 🎯 Problema

A plataforma tem 3 produtos distintos com necessidades diferentes:
- **Front-office (Professor):** Interface administrativa, formulários, CRUD
- **Back-office (Admin):** Gerenciamento, banco de questões, aprovações
- **Games (Aluno):** Jogos educacionais interativos, animações, gamificação

Usar React em todos os produtos traz:
- ❌ Overhead de framework onde não é necessário
- ❌ Bundle size maior para interfaces simples
- ❌ Complexidade de build/deploy para protótipos estáticos
- ❌ Barreira de entrada para time não-React
- ❌ Handoff mais complexo para Vue.js no futuro

---

## 💡 Decisão

**Adotar stack tecnológica específica por produto:**

### 🎓 Front-office (Professor)
**Stack:** Vanilla JS + HTML + CSS  
**Razão:** Interface administrativa simples, formulários, operações CRUD

**Benefícios:**
- ✅ Deploy imediato (HTML estático)
- ✅ Performance máxima (sem framework overhead)
- ✅ Manutenção simplificada
- ✅ Bundle size mínimo
- ✅ Prototipagem rápida
- ✅ Handoff direto para Vue.js

**Localização:** `Front-office/`

### 🏢 Back-office (Admin)
**Stack:** Vanilla JS + HTML + CSS  
**Razão:** Interface administrativa, gerenciamento, banco de questões

**Benefícios:**
- ✅ Deploy imediato (HTML estático)
- ✅ Performance máxima (sem framework overhead)
- ✅ Manutenção simplificada
- ✅ Bundle size mínimo
- ✅ Prototipagem rápida
- ✅ Handoff direto para Vue.js

**Localização:** `Back-office/`

### 🎮 Games (Aluno)
**Stack:** React + TypeScript + Vite + Storybook  
**Razão:** Jogos interativos complexos, animações, estado reativo

**Benefícios:**
- ✅ Component reusability para jogos
- ✅ State management robusto
- ✅ Ecosystem rico (libs de animação, física, etc.)
- ✅ TypeScript para safety
- ✅ Hot reload para iteração rápida

**Localização:** `src/`, `apps/proto/`, `packages/`

---

## 🏗️ Nova Estrutura Arquitetônica

```
📦 Educacross Prototyping Platform
│
├─ 🎓 Front-office (Vanilla JS)
│  └─ Front-office/
│     └─ Adicionar modal de visualizaçãoaprovação no Banco de Questões/
│        └─ prototipo-modal-aprovacao/
│           ├─ demo-interativo.html
│           └─ DOCUMENTACAO-TECNICA.txt
│
├─ 🏢 Back-office (Vanilla JS)
│  └─ Back-office/
│     └─ Gerador de Questões por IA – BackOffice/
│        └─ banco-de-questoes.html
│
└─ 🎮 Games (React + Vite)
   ├─ src/                         # Componentes React
   ├─ apps/proto/                  # Next.js prototypes
   ├─ packages/                    # Design system compartilhado
   │  ├─ tokens/                   # DTCG tokens
   │  └─ ui/                       # Componentes reutilizáveis
   └─ .storybook/                  # Documentação viva
```

---

## 🎨 Design System Unificado

**Mesmo design system (Vuexy) para todos os produtos:**

### Vanilla JS (Front/Back-office)
- CSS Variables (`:root { --primary: #7367ef; }`)
- Utility classes Tailwind-like (se necessário)
- Tokens copiados de `packages/tokens/tokens.json`

### React (Games)
- Tailwind CSS + shadcn/ui
- Componentes em `packages/ui/`
- Stories em Storybook

**Resultado:** Consistência visual, implementações diferentes.

---

## 📋 Convenções por Stack

### Vanilla JS (Front/Back-office)

**Estrutura de Arquivo:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Nome da Página</title>
  <style>
    /* CSS inline ou externo */
    :root {
      --primary: #7367ef;
      --success: #28c76f;
      /* Tokens do Vuexy */
    }
  </style>
</head>
<body>
  <!-- HTML -->
  <script>
    // JS inline ou externo
    // 100% pt-BR (nomes de variáveis, funções, comentários)
  </script>
</body>
</html>
```

**Convenções:**
- Idioma: 100% pt-BR
- Nomes de variáveis: `const turmasSelecionadas = []`
- Funções: `function enviarMissaoEmLote() {...}`
- IDs: `id="seletor-turmas"`
- Classes: `class="btn-primary"`

**Deploy:**
- Copiar HTML para `dist/` ou root
- Abrir direto no navegador ou via `python -m http.server`

### React (Games)

**Mantém convenções atuais:**
- TypeScript obrigatório
- Storybook first
- Conventional commits pt-BR
- Testes com Vitest

---

## 📝 Workflows Atualizados

### 🎓 Front-office / 🏢 Back-office

```powershell
# Desenvolvimento
python -m http.server 8080         # Servir HTMLs localmente
# Abrir: http://localhost:8080/Front-office/...

# Validação
python universal_validator.py --path=Front-office --type=html
python universal_validator.py --path=Back-office --type=html

# Deploy
# Copiar HTMLs para GitHub Pages ou servidor estático
```

### 🎮 Games

```powershell
# Desenvolvimento
npm run dev                        # Vite dev server
npm run storybook                  # Storybook

# Build
npm run build                      # Build produção
npm run preview                    # Preview build

# Validação
npm run check-types                # TypeScript
npm run test                       # Vitest
npm run check-mocks                # Validar mocks
```

---

## 🔄 Migração Futura para Vue.js

### Front-office / Back-office (Vanilla → Vue.js)
**Facilidade:** ⭐⭐⭐⭐⭐ (Muito fácil)
- HTML direto vira template Vue
- CSS mantém estrutura
- JS vira métodos/computed/watch
- Sem conversão de JSX/React

### Games (React → Vue.js)
**Facilidade:** ⭐⭐⭐ (Moderado)
- Componentes React → SFC Vue
- Hooks → Composition API
- Props/Events mantém conceito
- Design system reutilizável (tokens/CSS)

---

## ⚖️ Consequências

### Positivas ✅
1. **Performance:** HTML estático = carregamento instantâneo
2. **Simplicidade:** Menos ferramentas, menos configuração
3. **Deploy:** Arrastar HTML para servidor
4. **Manutenção:** Time pode editar HTML sem conhecer React
5. **Prototipagem:** Iteração rápida sem rebuild
6. **Handoff:** Vue.js aceita HTML nativo facilmente
7. **Bundle Size:** Front/Back-office < 50KB vs React ~200KB

### Negativas ❌
1. **Component Reusability:** Menor entre Front/Back-office
2. **State Management:** Manual (sem Zustand/Redux)
3. **Type Safety:** Sem TypeScript (vanilla JS)
4. **Testing:** Testes manuais ou Selenium (sem Vitest)
5. **Hot Reload:** Refresh manual vs HMR

### Mitigações 🛡️
- **Reusability:** Compartilhar snippets HTML/CSS via `packages/snippets/`
- **State:** Usar Web Components se crescer complexidade
- **Type Safety:** JSDoc comments para hints
- **Testing:** Python validators + validação manual
- **Hot Reload:** LiveServer VS Code extension

---

## 📚 Documentação Atualizada

**Arquivos a atualizar:**
- [x] `.github/copilot-instructions.md` — Nova estrutura de stack
- [ ] `docs/DAILY_OPERATIONS.md` — Workflows por produto
- [ ] `docs/journeys/01-professor-frontend.md` — Especificar Vanilla JS
- [ ] `docs/journeys/02-admin-backoffice.md` — Especificar Vanilla JS
- [ ] `docs/journeys/03-student-games-platform.md` — Manter React
- [ ] `README.md` — Atualizar quick start

---

## 🔗 Referências

- ADR-0006: Unified Prototyping Platform (arquitetura base)
- ADR-0004: Adoção Estética Vuexy (design system)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) — Alternativa futura
- [Vanilla JS Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

## 📊 Métricas de Sucesso

| Métrica | Baseline (React) | Meta (Vanilla) |
|---------|------------------|----------------|
| Bundle Size | ~200KB | < 50KB |
| First Load | ~1.5s | < 0.5s |
| Deploy Time | 5 min (build) | < 1 min (copy) |
| Onboarding | 1 dia (React) | < 2h (HTML) |
| Handoff Vue.js | Moderado | Fácil |

---

**Status:** ✅ Aceito  
**Próximos Passos:**
1. Atualizar `.github/copilot-instructions.md`
2. Criar estrutura de pastas padronizada
3. Documentar snippets reutilizáveis
4. Atualizar jornadas com stack específica
