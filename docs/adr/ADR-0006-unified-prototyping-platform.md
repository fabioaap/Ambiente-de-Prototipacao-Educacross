# ADR-0006: Arquitetura da Plataforma de Prototipagem Unificada

**Status:** Aceito ✅  
**Data:** 2024-11-04  
**Contexto:** Necessidade de um sistema único para prototipar, documentar e validar jornadas de usuário antes da implementação Vue.js  
**Decisor:** Time de Produto + Tech Lead  

---

## 🎯 Problema

O time precisa de um espaço centralizado para:
1. **Prototipar** 3 plataformas (Front-office, Backoffice, Games)
2. **Documentar** jornadas de usuário
3. **Validar** com designers, PMs e stakeholders
4. **Handoff** para desenvolvimento em Vue.js

Dispersar isso em múltiplas ferramentas causa:
- ❌ Falta de fonte de verdade
- ❌ Retrabalho (designer→dev→designer)
- ❌ Perda de contexto
- ❌ Lentidão em decisões

---

## 💡 Decisão

Implementar uma **Plataforma de Prototipagem Unificada** com 3 pilares:

### Pilar 1️⃣: **Storybook** (Documentação + Componentes)
- **O quê:** Catálogo vivo de componentes com Stories
- **Por quê:** Fonte de verdade para componentes
- **Como:** 
  - Cada componente com múltiplas Stories
  - Auto-docs com ejemplos
  - Controls para testar variações
- **Resultado:** Designers veem o componente final antes da implementação

### Pilar 2️⃣: **Jornadas em Markdown** (Especificação)
- **O quê:** Documentação de fluxos de usuário
- **Por quê:** Comunicação clara entre product/design/tech
- **Como:**
  - Pasta `docs/journeys/`
  - 3 jornadas: Professor (FO), Admin (BO), Aluno (Games)
  - Formato padrão: Persona → Objetivo → Fluxo → Componentes
- **Resultado:** Todos entendem o que deve ser feito

### Pilar 3️⃣: **Protótipos Funcionais** (Validação)
- **O quê:** Implementações React dos fluxos
- **Por quê:** Validar com usuários antes de escalar
- **Como:**
  - `apps/prototipo/stage01/` para landing pages
  - Componentes em `packages/ui-vuexy/` (compartilhados)
  - Mocks centralizados em `src/mocks/`
- **Resultado:** Feedback rápido, iteração ágil

---

## 🏗️ Estrutura Arquitetônica

```
Plataforma de Prototipagem
│
├─ 📚 Storybook (http://localhost:6006)
│  ├─ UI Components (Button, Card, Badge, etc)
│  │  ├─ Button.stories.tsx
│  │  ├─ Card.stories.tsx
│  │  └─ Badge.stories.tsx
│  ├─ Complex Components (Dashboard, Forms, etc)
│  │  └─ Dashboard.stories.tsx
│  └─ System Documentation (Design System, Colors, etc)
│     └─ DesignSystem.mdx
│
├─ 📍 Jornadas de Usuário (docs/journeys/)
│  ├─ 01-professor-frontend.md       (Front-office)
│  ├─ 02-admin-backoffice.md         (Backoffice)
│  └─ 03-student-games-platform.md   (Games)
│
├─ 🎨 Protótipos Funcionais
│  ├─ apps/prototipo/stage01/        (Landing page)
│  │  ├─ page.tsx
│  │  ├─ components/
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ HowItWorksSection.tsx
│  │  │  ├─ BenefitsSection.tsx
│  │  │  ├─ CtaSection.tsx
│  │  │  └─ FooterSection.tsx
│  │  └─ page.test.tsx
│  │
│  ├─ packages/ui-vuexy/             (Componentes reutilizáveis)
│  │  ├─ src/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ Form/
│  │  │  └─ ...
│  │  └─ package.json
│  │
│  └─ src/components/                (Principais)
│     ├─ Dashboard.tsx
│     ├─ Dashboard.stories.tsx
│     └─ ui/
│        ├─ button.tsx
│        ├─ Button.stories.tsx
│        └─ ...
│
└─ 📋 Mocks Centralizados
   └─ src/mocks/
      ├─ missions.ts
      └─ users.ts
```

---

## 🔄 Fluxo de Desenvolvimento

### Fase 1️⃣: Specification (Product + Design)
1. **PM define** objetivo da jornada
2. **Designer mockup** no Figma
3. **Documentar** em `docs/journeys/01-*.md`
4. **Validar** com stakeholders

### Fase 2️⃣: Prototyping (Frontend Dev)
1. **Cria componentes** em React/TypeScript
2. **Adiciona Stories** ao Storybook
3. **Implementa mockup** da jornada
4. **Expõe em `apps/prototipo/`**

### Fase 3️⃣: Validation (Product + Users)
1. **Testa** com usuários reais
2. **Coleta feedback** via Storybook/protótipo
3. **Itera** rapidamente
4. **Aprova** para escala

### Fase 4️⃣: Handoff (Tech Lead)
1. **ADR** finalizado com decisões
2. **Storybook** pronto com todos os componentes
3. **Jornadas** 100% especificadas
4. **Vue.js team** recebe specs + componentes + stories

---

## 📊 Componentes por Plataforma

### 🎓 Front-office (Professor)
```
Componentes Necessários:
├─ ClassSelector
├─ MissionCatalog
├─ MissionFilters
├─ StudentSelector
├─ ParametrizationForm
├─ ReviewModal
├─ ProgressBar
└─ SuccessNotification

Stories: 15-20 total
Telas: 5-7 mockups
```

### 🏢 Backoffice (Admin)
```
Componentes Necessários:
├─ AdminDashboard
├─ MissionManager
├─ BatchMonitor
├─ EngagementAnalytics
├─ TeacherManagement
├─ ReportGenerator
├─ AlertManager
└─ AuditLog

Stories: 20-25 total
Telas: 8-10 mockups
```

### 🎮 Games Platform (Aluno)
```
Componentes Necessários:
├─ StudentHome
├─ MissionCatalog
├─ MissionGame
├─ SuccessModal
├─ RankingBoard
├─ StudentProfile
├─ NotificationCenter
└─ BadgeDisplay

Stories: 15-20 total
Telas: 6-8 mockups
```

---

## ✅ Critérios de Sucesso

| Critério | Métrica | Target |
|----------|---------|--------|
| **Cobertura de Componentes** | % Stories escritas | 100% |
| **Documentação** | Jornadas completas | 3/3 |
| **Funcionalidade** | Testes passando | ≥ 80% |
| **Performance** | Storybook build | < 30s |
| **Engajamento** | Feedback loops | < 24h |
| **Documentação de Código** | Autodocs no Storybook | 100% |

---

## 🚀 Roadmap de Implementação

### Sprint 1 (Semana 1-2) ✅
- [x] Setup Storybook
- [x] Criar componentes UI base (Button, Card, Badge)
- [x] Stories para componentes base
- [x] Documentar jornadas (especificação)
- [x] Setup `packages/ui-vuexy/`

### Sprint 2 (Semana 3-4) ⏳
- [ ] Implementar componentes Front-office (ClassSelector, MissionCatalog)
- [ ] Adicionar Stories para Front-office
- [ ] Integração com Figma
- [ ] Testes visuais com Chromatic

### Sprint 3 (Semana 5-6) ⏳
- [ ] Implementar componentes Backoffice
- [ ] Adicionar Stories para Backoffice
- [ ] Criar mockups interativos
- [ ] Validação com Admin (persona)

### Sprint 4 (Semana 7-8) ⏳
- [ ] Implementar componentes Games Platform
- [ ] Adicionar Stories para Games
- [ ] Gamificação (animações, feedback)
- [ ] Teste com alunos (persona)

### Sprint 5 (Semana 9-10) ⏳
- [ ] Refinamentos baseado em feedback
- [ ] Documentação final (README, ADRs)
- [ ] Handoff para Vue.js team
- [ ] Deploy estático do Storybook

---

## 🔌 Integrações Futuras

### 1. **Figma → Storybook** (storybook-connect)
```
Figma Design File
    ↓
storybook-connect addon
    ↓
Link em cada Story
    ↓
Designers veem componente real no Figma
```

### 2. **Storybook → Chromatic**
```
Push para Git
    ↓
Chromatic detecta mudanças
    ↓
Visual regression testing
    ↓
Feedback automático
```

### 3. **CI/CD Pipeline**
```
Push para main
    ↓
Build Storybook
    ↓
Rodar testes
    ↓
Deploy static site
    ↓
URL estável (https://prototipo.educacross.com)
```

---

## 📚 Documentação Associada

- **Jornadas:** `docs/journeys/`
- **Guia Storybook:** `docs/STORYBOOK_GUIDE.md`
- **Guia Jornadas:** `docs/JOURNEYS_GUIDE.md`
- **README:** `README.md`

---

## 🎓 Benefícios

✅ **Para Product:** Validação rápida de ideias  
✅ **Para Design:** Fonte de verdade dos componentes  
✅ **Para Frontend:** Documentação automatizada  
✅ **Para Vue.js Team:** Handoff com especificação completa  
✅ **Para Stakeholders:** Visibilidade do progresso  

---

## ⚠️ Riscos e Mitigação

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Overhead de documentação | Alto | Automaticar com Storybook |
| Falta de sincronização Figma-Code | Médio | Usar storybook-connect |
| Mudanças de requisito | Médio | Versionamento em ADRs |
| Performance do Storybook | Baixo | Build otimizado, lazy loading |

---

## 📝 Decisões Relacionadas

- **ADR-0004:** Adoção estética Vuexy
- **ADR-0005:** Setup de prototipagem multi-plataforma
- **Future ADRs:** Figma integration, Vue.js handoff

---

## ✍️ Aprovação

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Product Manager | [Nome] | [Data] | ⏳ |
| Tech Lead | [Nome] | [Data] | ⏳ |
| Design Lead | [Nome] | [Data] | ⏳ |
| CTO | [Nome] | [Data] | ⏳ |

---

**Referências:**
- Storybook Docs: https://storybook.js.org/
- Component Driven Development: https://www.componentdriven.org/
- Atomic Design: https://atomicdesign.bradfrost.com/