> Fonte de verdade: use `.prompts/instructions.xml` como system prompt.
> Blocos referenciados: `.prompts/blocks/`.

# Instruções para Agentes AI - Educacross Prototyping Platform

## 🎯 Visão Geral

Esta é uma **Plataforma Unificada de Prototipagem** para validação de 3 produtos educacionais antes da implementação em Vue.js:
- **Front-office** (Professor) — Envio de missões gamificadas em lote → **Vanilla JS**
- **Backoffice** (Admin) — Banco de questões e gerenciamento → **Vanilla JS**
- **Games** (Aluno) — Plataforma de jogos educacionais → **React + TypeScript**

**Arquitetura por Produto (ADR-0007):**
- **Front/Back-office:** Vanilla JS + HTML + CSS (deploy estático, handoff fácil para Vue.js)
- **Games:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Storybook + Vitest

## 🗂️ Estrutura Crítica

```
.prompts/                          # System prompts modulares (fonte de verdade)
  ├── instructions.xml             # Prompt principal (inclui blocos)
  └── blocks/                      # Pilares: core, discovery, design_system, arch_clean, etc.

Front-office/                      # 🎓 Vanilla JS - Interface Professor
  └── Adicionar modal de visualizaçãoaprovação no Banco de Questões/
      └── prototipo-modal-aprovacao/
          ├── demo-interativo.html
          └── DOCUMENTACAO-TECNICA.txt

Back-office/                       # 🏢 Vanilla JS - Interface Admin
  └── Gerador de Questões por IA – BackOffice/
      └── banco-de-questoes.html

apps/                              # 🎮 Games - React prototypes
  ├── proto/                       # Next.js (stage futuro)
  └── prototipo/stage01/           # Landing pages e protótipos iniciais

packages/                          # Design system compartilhado (TODOS os produtos)
  ├── tokens/                      # DTCG tokens (Style Dictionary)
  └── ui/                          # Componentes React reutilizáveis (Games)

src/                               # 🎮 Games - Protótipo principal (Vite + React)
  ├── components/                  # Componentes específicos do protótipo
  │   ├── ui/                      # UI base (Button, Card, Badge + stories)
  │   └── *.stories.tsx            # Storybook stories (Dashboard, etc.)
  ├── mocks/                       # Dados mock (mission-batch.ts, missions.ts)
  │   └── mission-batch.ts         # Mock de turmas, missões, alunos
  └── types/                       # TypeScript types

docs/                              # Documentação viva
  ├── journeys/                    # Especificações de fluxos de usuário
  │   ├── 01-professor-frontend.md # Jornada do Professor (Vanilla JS)
  │   ├── 02-admin-backoffice.md   # Jornada do Admin (Vanilla JS)
  │   └── 03-student-games-platform.md # Jornada do Aluno (React)
  ├── adr/                         # Architecture Decision Records
  │   ├── ADR-0006-unified-prototyping-platform.md
  │   └── ADR-0007-vanilla-js-for-frontoffice-backoffice.md
  ├── DAILY_OPERATIONS.md          # Workflows por role (dev, designer, PM)
  ├── GIT_WORKFLOW.md              # Conventional commits em pt-BR
  └── STORYBOOK_GUIDE.md           # Como criar stories (Games apenas)

.storybook/                        # Config Storybook (Games apenas)
  └── main.ts                      # Stories de src/**, apps/**, packages/**
```

## ⚙️ Workflows Essenciais

### 🎓 Front-office / 🏢 Back-office (Vanilla JS)
```powershell
# Desenvolvimento
python -m http.server 8080         # Servir HTMLs localmente
# Abrir: http://localhost:8080/Front-office/ ou /Back-office/

# Edição
code Front-office/                 # VS Code com LiveServer extension
# Salvar HTML → Auto-refresh no navegador

# Validação
python universal_validator.py --path=Front-office --type=html
python universal_validator.py --path=Back-office --type=html

# Deploy
# Copiar HTMLs para dist/ ou GitHub Pages
```

### 🎮 Games (React + TypeScript)
```powershell
# Setup inicial
npm install                        # Instalar dependências
npm run check-env                  # Verificar ambiente

# Desenvolvimento
npm run dev                        # Vite dev server (http://localhost:5173)
npm run storybook                  # Storybook (http://localhost:6006)

# Build & Validação
npm run check-mocks                # Validar mocks (progress: 0)
npm run build                      # Build produção (roda check-mocks antes)
npm run check-types                # TypeScript check
npm run test                       # Vitest
npm run test:coverage              # Coverage report

# Preview
npm run preview                    # Preview build local
npm run preview:live               # Preview + watch mode
```

### 📝 Python Validators (Todos os produtos)
```powershell
# Validação universal de protótipos
python universal_validator.py --path=. --output=json
python interactive_validator.py    # Modo interativo
python ci_validator.py             # CI/CD check
```

## 🎨 Convenções do Projeto

### 1. **Idioma: 100% pt-BR**
- Commits, código, docs, UI, variáveis — TUDO em português do Brasil
- Exceção: APIs externas e bibliotecas (React, TypeScript, etc.)

**Vanilla JS (Front/Back-office):**
```javascript
// ✅ Correto
const turmasSelecionadas = []
function enviarMissaoEmLote(turmaId) {...}
const botaoEnviar = document.getElementById('btn-enviar')

// ❌ Errado  
const selectedClasses = []
function sendMissionBatch(classId) {...}
const submitButton = document.getElementById('btn-submit')
```

**React (Games):**
```typescript
// ✅ Correto
export const turmasMock: Turma[] = [...]
const enviarMissaoEmLote = (turmaId: string) => {...}

// ❌ Errado  
export const classesMock: Class[] = [...]
const sendMissionBatch = (classId: string) => {...}
```

### 2. **Commits: Conventional Commits em pt-BR**
```bash
# Formato obrigatório
<tipo>(<escopo>): <mensagem>

# Exemplos válidos
feat(components): adicionar ClassSelector com filtros
fix(storybook): corrigir carregamento de Badge.stories
docs(journeys): atualizar jornada do professor
chore(mocks): zerar progress de missões para build

# Tipos: feat, fix, docs, style, refactor, test, chore
# Escopos: components, storybook, docs, mocks, types, config
```

### 3. **Design System: shadcn/ui + Vuexy Theme**
- **Base:** shadcn/ui com Tailwind CSS (Games apenas)
- **Tema:** Vuexy aesthetics (roxo `#7367ef`, verde `#28c76f`, etc.)
- **CSS Variables:** Definidas em `index.css` (HSL com `var(--primary)`, etc.)

**Front/Back-office (Vanilla JS):**
```html
<style>
  :root {
    --primary: #7367ef;
    --success: #28c76f;
    --danger: #ea5455;
  }
  .btn-primary {
    background: var(--primary);
    color: white;
  }
</style>
<button class="btn-primary">Enviar</button>
```

**Games (React):**
```typescript
// Componentes: src/components/ui/ (button.tsx, card.tsx, badge.tsx)
<Button variant="default">Primário</Button>   // --primary (#7367ef)
<Button variant="destructive">Erro</Button>   // --destructive
<Button variant="outline">Contorno</Button>
```

- **Stories:** Cada componente React tem `.stories.tsx` com múltiplas variants

### 4. **Storybook: Documentação Viva (Games apenas)**
- **Stories:** Todo componente em `src/components/**` tem `*.stories.tsx`
- **Estrutura:** `title: 'UI/Button'` (organização hierárquica)
- **Auto-docs:** `tags: ['autodocs']` para gerar docs automáticas
- **Controls:** ArgTypes para testar variações (variant, size, disabled)

```typescript
// Template story
export const Primary: Story = {
  args: {
    children: 'Botão',
    variant: 'default',
    size: 'default',
  },
}
```

**Nota:** Front/Back-office (Vanilla JS) não usa Storybook.

### 5. **Mocks: Dados Centralizados (Games apenas)**
- **Localização:** `src/mocks/mission-batch.ts`, `src/mocks/missions.ts`
- **Exports:** `turmasMock`, `missoesMock`, `alunosMock`, `enviosAnterioresMock`
- **Validação Pre-Build:** Script `check-mocks.cjs` valida que `progress: 0` em todos mocks (evita estados inconsistentes em build)

```typescript
// src/mocks/mission-batch.ts
export const turmasMock: Turma[] = [
  { id: '1', nome: '7º Ano A', totalAlunos: 30, escola: 'Escola ABC' },
  // ...
]
```

**Nota:** Front/Back-office (Vanilla JS) usa dados inline ou JSON separados.

### 6. **Jornadas: Especificação de Fluxos**
- **Formato:** Markdown estruturado em `docs/journeys/`
- **Template:** Persona → Objetivo → Fluxo (8 etapas) → Critérios de Aceitação → Componentes Necessários
- **Exemplos:** `01-professor-frontend.md` documenta o fluxo completo de envio de missões em lote

## 🏛️ Arquitetura & Decisões

### ADR-0006: Unified Prototyping Platform
**Decisão:** Centralizar prototipagem em 3 pilares:
1. **Storybook** — Catálogo de componentes (http://localhost:6006)
2. **Jornadas Markdown** — Especificação de fluxos (docs/journeys/)
3. **Protótipos Funcionais** — Validação com usuários (apps/prototipo/)

**Razão:** Eliminar dispersão de conhecimento, agilizar handoff para Vue.js, reduzir retrabalho design↔dev.

### ADR-0007: Vanilla JS para Front-office e Back-office
**Decisão:** Usar stacks diferentes por produto:
- **Front/Back-office:** Vanilla JS + HTML + CSS (simplicidade, deploy estático)
- **Games:** React + TypeScript (complexidade, state management)

**Razão:**
- ✅ Simplicidade de deploy (HTML estático)
- ✅ Performance (sem overhead de framework)
- ✅ Facilidade de manutenção para time não-React
- ✅ Redução de bundle size
- ✅ Prototipagem mais rápida
- ✅ Facilitar handoff para Vue.js no futuro

### Stack Decisions
- **Vanilla JS (Front/Back):** Deploy imediato, handoff fácil para Vue.js
- **React (Games):** Prototipagem de jogos complexos (não é stack final)
- **Vite:** Build rápido para iteração ágil
- **Storybook:** Design system as documentation
- **Vitest:** Testes rápidos (jsdom)
- **shadcn/ui:** Componentes acessíveis e customizáveis

## 🔒 Validações Críticas

### Pre-Commit Checklist
```bash
npm run check-types      # TypeScript sem erros
npm run test             # Testes passando
npm run storybook        # Stories renderizam corretamente
npm run check-mocks      # Mocks válidos (progress: 0)
```

### CI/CD Validation
- `ci_validator.py` — Valida estrutura do projeto (HTML, CSS, JS, configs)
- `universal_validator.py` — Scanner universal de arquivos (Front/Back/Games)

## 🔗 Integrações & Dependencies

### Design System
- **Tokens:** `packages/tokens/tokens.json` (DTCG format)
- **Style Dictionary:** Gera CSS vars de tokens
- **Figma → Code:** Futuro Code Connect (Figma Dev Mode)

### Testing Stack
- **Unit:** Vitest + @testing-library/react
- **Visual:** Storybook stories servem como testes visuais
- **E2E:** Futuro (Playwright/Cypress)

### External Services (Futuro)
- **Autenticação:** LDAP/Escola (docs mencionam login escolar)
- **Backend:** Node.js + NestJS (não implementado ainda)
- **Deploy:** GitHub Pages (arquivos estáticos: `index.html`, `404.html`, `.nojekyll`)

## 📚 Fontes de Verdade

1. **System Prompt:** `.prompts/instructions.xml` + `.prompts/blocks/*.md`
2. **Arquitetura:** `docs/adr/ADR-0006-unified-prototyping-platform.md`, `docs/adr/ADR-0007-vanilla-js-for-frontoffice-backoffice.md`
3. **Workflows:** `docs/DAILY_OPERATIONS.md`, `docs/GIT_WORKFLOW.md`
4. **Especificações:** `docs/journeys/*.md`
5. **Componentes (Games):** Storybook (http://localhost:6006) + `src/components/**/*.stories.tsx`
6. **Protótipos (Front/Back):** HTMLs em `Front-office/` e `Back-office/`

## 🚨 Regras Não-Negociáveis

1. **pt-BR everywhere:** Código, commits, docs, UI
2. **Storybook first:** Componente → Story → Validação → PR
3. **Mock validation:** `progress: 0` antes de build
4. **Conventional commits:** `<tipo>(<escopo>): mensagem`
5. **ADR para decisões arquiteturais:** `docs/adr/ADR-XXXX.md`
6. **Journeys como spec:** Não implementar sem jornada documentada

## 🎓 Onboarding Rápido

**5 minutos (Games):**
1. Ler: `README.md` + `docs/STATUS_REPORT.md`
2. Rodar: `npm install && npm run storybook`
3. Abrir: http://localhost:6006

**5 minutos (Front/Back-office):**
1. Ler: `README.md` + HTMLs em `Front-office/` e `Back-office/`
2. Rodar: `python -m http.server 8080`
3. Abrir: http://localhost:8080/Front-office/

**30 minutos:**
1. Ler: `docs/DAILY_OPERATIONS.md` (seu papel)
2. Ler: Uma jornada (`docs/journeys/01-professor-frontend.md`)
3. Explorar: Storybook UI Components (Games) ou HTMLs (Front/Back)

**Para AI Agents:**
- Sempre consultar `.prompts/instructions.xml` antes de grandes mudanças
- Validar com `npm run check-types && npm run test` antes de finalizar (Games)
- Validar com `python universal_validator.py` antes de finalizar (Front/Back)
- Seguir estrutura de resposta em `.prompts/blocks/01_core.md`