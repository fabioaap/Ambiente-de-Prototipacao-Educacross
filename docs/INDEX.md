# 📚 Índice Completo de Documentação

Bem-vindo! Este arquivo lista toda a documentação disponível para a Plataforma de Prototipagem Unificada.

---

## 🚀 Quick Start (5 minutos)

**Se você tem 5 minutos:**
1. Leia: [STATUS_REPORT.md](./STATUS_REPORT.md) — O que foi entregue
2. Rode: `npm run storybook`
3. Abra: `http://localhost:6006`

**Se você tem 15 minutos:**
1. Leia: [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md) — Seu workflow diário
2. Explore: Storybook UI Components
3. Leia: Uma jornada em [journeys/](./journeys/)

---

## 📖 Documentação por Tipo

### 🎯 **Para Entender o Projeto**
| Documento | Tempo | Descrição |
|-----------|-------|-----------|
| [README.md](../README.md) | 10 min | Overview geral do projeto |
| [STATUS_REPORT.md](./STATUS_REPORT.md) | 5 min | O que foi entregue (esta semana) |
| [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md) | 15 min | Arquitetura e decisões técnicas |

### 👨‍💼 **Para Operação Diária**
| Documento | Tempo | Para Quem |
|-----------|-------|-----------|
| [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md) | 10 min | Dev, Designer, PM |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | 15 min | Dev (commits e PRs) |
| [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md) | 20 min | Dev (criar stories) |
| [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md) | 20 min | PM (especificar fluxos) |

### 🎓 **Para Aprender a Documentar**
| Documento | Tópico | Tempo |
|-----------|--------|-------|
| [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md) | Como criar stories | 20 min |
| [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md) | Como documentar jornadas | 20 min |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | Como fazer commits e PRs | 15 min |

### 📍 **Jornadas de Usuário (Especificações)**
| Jornada | Persona | Plataforma | Status |
|---------|---------|-----------|--------|
| [01-professor-frontend.md](./journeys/01-professor-frontend.md) | Professor | Front-office | ✅ Completa |
| [02-admin-backoffice.md](./journeys/02-admin-backoffice.md) | Admin | Backoffice | ✅ Completa |
| [03-student-games-platform.md](./journeys/03-student-games-platform.md) | Aluno | Games | ✅ Completa |

### 🏛️ **Arquitetura e Decisões**
| Documento | Tópico | Status |
|-----------|--------|--------|
| [ADR-0004](./adr/ADR-0004-adocao-estetica-vuexy.md) | Adoção Vuexy aesthetics | ✅ Aprovado |
| [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md) | Plataforma unificada | ✅ Aprovado |

---

## 🎯 Guias por Papel

### 👨‍💻 **Se você é Developer**

**Começar:**
1. Leia: [README.md](../README.md) — Setup e stack
2. Rode: `npm run storybook`
3. Leia: [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md)

**Criar componente:**
1. Leia: [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md#-desenvolvedor-frontend)
2. Leia: Jornada relevante em [journeys/](./journeys/)
3. Siga: Exemplo em [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md#-exemplo-completo-card)

**Fazer commit:**
1. Leia: [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
2. Siga: Checklist antes de push

### 👨‍🎨 **Se você é Designer**

**Começar:**
1. Abra: Storybook em `http://localhost:6006`
2. Leia: [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md#-designer)
3. Explore: Componentes UI base

**Validar componentes:**
1. Abra: Story relevante no Storybook
2. Use: Controls para testar variações
3. Compare: Com design no Figma
4. Aprove: Comentando no PR

### 📊 **Se você é Product Manager**

**Começar:**
1. Leia: [STATUS_REPORT.md](./STATUS_REPORT.md) — Status atual
2. Leia: Uma jornada em [journeys/](./journeys/)
3. Leia: [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md#--product-manager)

**Documentar requisito:**
1. Leia: [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md)
2. Edite: Jornada relevante em [journeys/](./journeys/)
3. Comunique: Mudanças ao dev no Slack

### 🏗️ **Se você é Tech Lead**

**Começar:**
1. Leia: [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md) — Arquitetura
2. Leia: [STATUS_REPORT.md](./STATUS_REPORT.md)
3. Verifique: [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md#-dev) — Se está sendo seguido

**Orientar time:**
1. Compartilhe: [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) com devs
2. Compartilhe: [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md) com devs
3. Revise: Commits e PRs seguindo padrões

---

## 📑 Estrutura de Pastas

```
Protótipo Enviar Missão Escola em Lote/
│
├─ README.md                           ← Leia PRIMEIRO
├─ package.json
├─ tsconfig.json
│
├─ docs/                               ← Toda documentação aqui
│  ├─ INDEX.md                         ← Você está aqui
│  ├─ STATUS_REPORT.md                 ← Status semanal
│  ├─ DAILY_OPERATIONS.md              ← Workflow diário
│  ├─ STORYBOOK_GUIDE.md               ← Como usar Storybook
│  ├─ JOURNEYS_GUIDE.md                ← Como documentar jornadas
│  ├─ GIT_WORKFLOW.md                  ← Como fazer commits
│  │
│  ├─ adr/                             ← Arquitetura & Decisões
│  │  ├─ ADR-0000-template.md
│  │  ├─ ADR-0004-adocao-estetica-vuexy.md
│  │  └─ ADR-0006-unified-prototyping-platform.md
│  │
│  └─ journeys/                        ← Especificações de jornadas
│     ├─ 01-professor-frontend.md
│     ├─ 02-admin-backoffice.md
│     └─ 03-student-games-platform.md
│
├─ .storybook/                         ← Config do Storybook
│  ├─ main.ts
│  ├─ preview.ts
│  └─ tsconfig.json
│
├─ src/                                ← Código fonte
│  ├─ components/
│  │  ├─ Dashboard.tsx
│  │  ├─ Dashboard.stories.tsx
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Button.stories.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ Card.stories.tsx
│  │  │  ├─ Badge.tsx
│  │  │  └─ Badge.stories.tsx
│  │  └─ ...
│  ├─ Welcome.stories.mdx              ← Welcome do Storybook
│  ├─ DesignSystem.mdx                 ← Design system overview
│  └─ mocks/
│     └─ missions.ts
│
└─ apps/                               ← Protótipos específicos
   └─ prototipo/
      ├─ stage01/
      └─ ...
```

---

## 🔍 Como Encontrar Algo

### "Quero saber como usar Storybook"
→ [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md)

### "Preciso entender a jornada do professor"
→ [journeys/01-professor-frontend.md](./journeys/01-professor-frontend.md)

### "Como faço meu primeiro commit?"
→ [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)

### "Qual é meu workflow diário?"
→ [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md)

### "Por que escolhemos Storybook?"
→ [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md)

### "Quais são as cores da paleta?"
→ [../README.md](../README.md#-stack-padrão)

### "Quanto foi entregue esta semana?"
→ [STATUS_REPORT.md](./STATUS_REPORT.md)

### "Qual é a arquitetura do projeto?"
→ [ADR-0006](./adr/ADR-0006-unified-prototyping-platform.md#-estrutura-arquitetônica)

---

## ⏱️ Tempo Estimado de Leitura por Perfil

### 👨‍💻 Developer (Primeira Vez)
1. README.md — 10 min
2. DAILY_OPERATIONS.md (seção Dev) — 10 min
3. STORYBOOK_GUIDE.md — 20 min
4. GIT_WORKFLOW.md — 15 min
5. Uma jornada — 15 min
**Total: ~70 minutos**

### 👨‍🎨 Designer (Primeira Vez)
1. README.md — 10 min
2. DAILY_OPERATIONS.md (seção Designer) — 10 min
3. STORYBOOK_GUIDE.md (seção "Como Usar") — 10 min
4. Uma jornada — 15 min
**Total: ~45 minutos**

### 📊 PM (Primeira Vez)
1. STATUS_REPORT.md — 5 min
2. DAILY_OPERATIONS.md (seção PM) — 10 min
3. JOURNEYS_GUIDE.md — 20 min
4. Uma jornada — 15 min
**Total: ~50 minutos**

---

## 🆘 Troubleshooting & FAQs

### "Storybook não abre"
→ [DAILY_OPERATIONS.md#-troubleshooting-rápido](./DAILY_OPERATIONS.md#-troubleshooting-rápido)

### "Como criar meu primeiro componente?"
→ [STORYBOOK_GUIDE.md#-exemplo-completo-card](./STORYBOOK_GUIDE.md#-exemplo-completo-card)

### "Component não aparece no Storybook"
→ [DAILY_OPERATIONS.md#-component-não-aparece-no-storybook](./DAILY_OPERATIONS.md#-component-não-aparece-no-storybook)

### "Qual é a diferença entre Feature/Bug/Docs?"
→ [GIT_WORKFLOW.md#-tipos-válidos](./GIT_WORKFLOW.md#-tipos-válidos)

---

## 📞 Contatos por Tópico

| Tópico | Contato | Slack |
|--------|---------|-------|
| Storybook / Componentes | Dev Lead | #tech |
| Jornadas / Specs | PM | #product |
| Design System / Figma | Designer Lead | #design |
| Arquitetura / Tech | Tech Lead | #architecture |

---

## 📊 Estatísticas da Documentação

| Métrica | Valor |
|---------|-------|
| **Documentos totais** | 10+ |
| **Jornadas de usuário** | 3 |
| **ADRs** | 2 |
| **Guias práticos** | 4 |
| **Palavras totais** | ~15.000 |
| **Tempo de leitura completo** | ~3 horas |
| **Atualizado em** | 2024-11-04 |

---

## ✅ Checklist de Onboarding

Ao chegar no projeto, complete:

- [ ] Clonar repositório
- [ ] Rodar `npm install`
- [ ] Abrir Storybook: `npm run storybook`
- [ ] Ler README.md
- [ ] Ler DAILY_OPERATIONS.md (sua seção)
- [ ] Ler 1-2 jornadas
- [ ] Fazer primeiro commit (teste)
- [ ] Apresentar para tech lead

---

## 🚀 Próximas Atualizações

| Data | Tipo | Descrição |
|------|------|-----------|
| 2024-11-11 | Docs | Adicionar mais componentes ao Storybook |
| 2024-11-18 | Guide | Setup de Chromatic |
| 2024-11-25 | ADR | Integração com Figma |
| 2024-12-01 | Docs | Handoff para Vue.js team |

---

## 📚 Recursos Externos

- **Storybook Oficial:** https://storybook.js.org/
- **React Documentação:** https://react.dev/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **Tailwind CSS:** https://tailwindcss.com/

---

**Última atualização:** 04/11/2024  
**Versão:** 1.0.0  
**Status:** ✅ Completo