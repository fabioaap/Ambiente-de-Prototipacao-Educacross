# 📋 Backlog de Issues - Educacross Prototyping Platform

**Data de Criação:** 17/11/2025  
**Última Atualização:** 17/11/2025  
**Total de Issues:** 11

---

## 📊 Resumo Executivo

Este diretório contém **issues estruturadas** prontas para criação no GitHub Issues, organizadas por prioridade e categoria.

### Status Geral

| Categoria | Total | Status | Prioridade |
|-----------|-------|--------|------------|
| **Sprint 6** | 1 | 🔄 EM ANDAMENTO | P1 (High) |
| **Technical Debt P1** | 3 | 📋 BACKLOG | P1 (Critical/High) |
| **Technical Debt P2** | 7 | 📋 BACKLOG | P2 (Medium) |
| **TOTAL** | **11** | — | — |

### Esforço Total Estimado

| Prioridade | Esforço | Issues |
|------------|---------|--------|
| **P1** | 4.5h | 4 issues |
| **P2** | 6.25h | 7 issues |
| **TOTAL** | **10.75h** | 11 issues |

---

## 🎯 Sprint 6 (P1 - High Priority)

### Layout Mobile

| ID | Título | Esforço | Status |
|----|--------|---------|--------|
| **M1** | [Corrigir Layout Mobile Quebrado](sprint-6/M1-corrigir-layout-mobile.md) | 2-3h | 🔄 EM ANDAMENTO |

**Objetivo:** Refatorar layout mobile da página de documentação do ambiente de prototipação.

**Problemas:**
- ❌ Conflitos entre estilos desktop e mobile
- ❌ Media queries duplicadas
- ❌ Header mobile com z-index incorreto
- ❌ Sidebar com comportamento inconsistente

**Arquivos:** `docs/ambiente-prototipacao/styles.css`, `docs/ambiente-prototipacao/index.html`

---

## 🚨 Technical Debt P1 (Critical/High)

### Problemas Críticos que Requerem Atenção Imediata

| ID | Título | Esforço | Recorrências | Impacto |
|----|--------|---------|--------------|---------|
| **P1-001** | [Consolidar Diretórios Duplicados no Back-office](technical-debt-p1/P1-001-consolidar-diretorios-backoffice.md) | 0.5h | 2x | Confusão de paths, cópia manual de assets |
| **P1-002** | [MCP Figma Auth Intermitente](technical-debt-p1/P1-002-mcp-figma-auth-intermitente.md) | 1.0h | 5x | Fallback lento, verificação manual |
| **P1-003** | [Validators Não Comparam com Figma Source](technical-debt-p1/P1-003-validators-figma-source.md) | 1.0h | 3x | Falsos positivos, perda de sincronização |

### Detalhamento

#### P1-001: Consolidar Diretórios Duplicados
- **Problema:** 2 diretórios similares no Back-office (com 2 espaços vs travessão)
- **Impacto:** Assets precisam ser copiados manualmente para ambos
- **Solução:** Renomear para padrão único, atualizar refs
- **Tags:** `path-conflict` `assets` `backoffice`

#### P1-002: MCP Figma Auth Intermitente
- **Problema:** Autenticação MCP falhando intermitentemente (5x desde 10/11)
- **Impacto:** Fallback para REST API (mais lenta)
- **Solução:** Token refresh automático + circuit breaker pattern
- **Tags:** `mcp` `figma` `auth` `resilience`

#### P1-003: Validators Não Comparam com Figma Source
- **Problema:** Validadores comparam HTML vs HTML snapshot (não Figma)
- **Impacto:** Falsos positivos, divergência de design
- **Solução:** Usar `mcp_figma_get_design_context` + diff visual
- **Tags:** `validation` `figma` `false-positive`

---

## 🟡 Technical Debt P2 (Medium Priority)

### Melhorias de Qualidade e Automação

| ID | Título | Esforço | Categoria | Impacto |
|----|--------|---------|-----------|---------|
| **P2-001** | [SVG Logos com Aspect Ratio Distorcido](technical-debt-p2/P2-001-svg-aspect-ratio.md) | 0.25h | Visual | Logos distorcidos |
| **P2-002** | [Storybook Sem Integration Tests](technical-debt-p2/P2-002-storybook-integration-tests.md) | 2.0h | Testing | Sem validação automatizada |
| **P2-003** | [Tokens DTCG Não Aplicados em Componentes](technical-debt-p2/P2-003-tokens-dtcg-aplicacao.md) | 1.5h | Design System | Inconsistência de design |
| **P2-004** | [Protótipos Sem Validação TypeScript](technical-debt-p2/P2-004-typescript-validation-vanilla.md) | 0.5h | Type Safety | Erros de tipos em vanilla JS |
| **P2-005** | [Falta CI/CD para GitHub Pages](technical-debt-p2/P2-005-ci-cd-github-pages.md) | 1.0h | Automation | Deploy manual |
| **P2-006** | [Mocks Sem Schema Validation](technical-debt-p2/P2-006-mocks-schema-validation.md) | 0.75h | Data Quality | Dados inconsistentes |
| **P2-007** | [README Desatualizado com Estrutura Antiga](technical-debt-p2/P2-007-readme-desatualizado.md) | 0.5h | Documentation | Onboarding ruim |

### Agrupamento por Tema

#### 🎨 Design & Visual (2 issues - 1.75h)
- P2-001: SVG aspect ratio
- P2-003: Tokens DTCG

#### 🧪 Testing & Quality (2 issues - 2.75h)
- P2-002: Storybook integration tests
- P2-006: Mocks schema validation

#### 🤖 Automation (2 issues - 1.5h)
- P2-004: TypeScript validation vanilla
- P2-005: CI/CD GitHub Pages

#### 📚 Documentation (1 issue - 0.5h)
- P2-007: README desatualizado

---

## 🗂️ Estrutura de Diretórios

```
.github/issues/
├── README.md                          # Este arquivo
├── templates/
│   └── issue-template.md              # Template padrão
├── sprint-6/
│   └── M1-corrigir-layout-mobile.md   # Sprint 6 - Mobile layout
├── technical-debt-p1/
│   ├── P1-001-consolidar-diretorios-backoffice.md
│   ├── P1-002-mcp-figma-auth-intermitente.md
│   └── P1-003-validators-figma-source.md
└── technical-debt-p2/
    ├── P2-001-svg-aspect-ratio.md
    ├── P2-002-storybook-integration-tests.md
    ├── P2-003-tokens-dtcg-aplicacao.md
    ├── P2-004-typescript-validation-vanilla.md
    ├── P2-005-ci-cd-github-pages.md
    ├── P2-006-mocks-schema-validation.md
    └── P2-007-readme-desatualizado.md
```

---

## 📝 Como Usar Este Backlog

### 1. Criar Issue no GitHub

Cada arquivo `.md` contém uma issue completa pronta para ser copiada:

```bash
# Abrir arquivo
cat .github/issues/sprint-6/M1-corrigir-layout-mobile.md

# Copiar conteúdo e criar issue no GitHub
# ou usar CLI:
gh issue create --title "M1: Corrigir Layout Mobile" --body-file .github/issues/sprint-6/M1-corrigir-layout-mobile.md
```

### 2. Priorizar Issues

**P0 (Crítico):** Ação imediata, bloqueia tudo  
**P1 (Alto):** Esta semana, impacta produtividade  
**P2 (Médio):** Próximas 2 semanas, melhoria importante  
**P3 (Baixo):** Backlog, melhoria opcional  

### 3. Estimativas de Esforço

| Esforço | Tempo | Descrição |
|---------|-------|-----------|
| **Low** | <0.5h | Quick fix, config change |
| **Medium** | 0.5-2h | Feature implementation, refactor |
| **High** | 2-4h | Complex feature, multiple files |
| **Very High** | >4h | Architecture change, breaking change |

### 4. Labels Sugeridas

```
# Prioridade
priority:p0-critical
priority:p1-high
priority:p2-medium
priority:p3-low

# Categoria
category:bug
category:enhancement
category:documentation
category:automation
category:technical-debt

# Status
status:backlog
status:in-progress
status:review
status:blocked

# Esforço
effort:low
effort:medium
effort:high

# Componente
component:front-office
component:back-office
component:games
component:storybook
component:ci-cd
component:validation
```

---

## 🎯 Roadmap Sugerido

### Semana 1 (18-22 Nov)
**Foco:** P1 + Sprint 6

- [ ] **M1:** Corrigir layout mobile (2-3h)
- [ ] **P1-001:** Consolidar diretórios Back-office (0.5h)
- [ ] **P1-002:** MCP Figma auth (1h)

**Total:** ~4.5h

### Semana 2 (25-29 Nov)
**Foco:** P1 + P2 High Impact

- [ ] **P1-003:** Validators Figma source (1h)
- [ ] **P2-002:** Storybook integration tests (2h)
- [ ] **P2-005:** CI/CD GitHub Pages (1h)

**Total:** ~4h

### Semana 3 (02-06 Dez)
**Foco:** P2 Restantes

- [ ] **P2-003:** Tokens DTCG (1.5h)
- [ ] **P2-006:** Mocks schema validation (0.75h)
- [ ] **P2-004:** TypeScript validation vanilla (0.5h)
- [ ] **P2-007:** README desatualizado (0.5h)
- [ ] **P2-001:** SVG aspect ratio (0.25h)

**Total:** ~3.5h

---

## 📚 Referências

### Documentação Base
- **[BACKLOG.md](../../docs/BACKLOG.md)** - Backlog completo com detalhamento de sprints
- **[TECHNICAL_DEBT.md](../../docs/TECHNICAL_DEBT.md)** - Débito técnico categorizado
- **[STATUS_REPORT.md](../../docs/STATUS_REPORT.md)** - Estado atual do projeto

### Guias de Processo
- **[GIT_WORKFLOW.md](../../docs/GIT_WORKFLOW.md)** - Conventional commits pt-BR
- **[DAILY_OPERATIONS.md](../../docs/DAILY_OPERATIONS.md)** - Workflows por papel

### Arquitetura
- **[ADR-0006](../../docs/adr/ADR-0006-unified-prototyping-platform.md)** - Plataforma unificada
- **[ADR-0007](../../docs/adr/ADR-0007-vanilla-js-for-frontoffice-backoffice.md)** - Vanilla JS decision

---

## 🤖 Automação

### Criação em Batch (GitHub CLI)

```bash
# Criar todas as issues P1
for file in .github/issues/technical-debt-p1/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create --title "$title" --body-file "$file" --label "priority:p1-high,technical-debt"
done

# Criar todas as issues P2
for file in .github/issues/technical-debt-p2/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create --title "$title" --body-file "$file" --label "priority:p2-medium,technical-debt"
done
```

### Sync com Backlog

```bash
# Verificar inconsistências entre .github/issues/ e docs/BACKLOG.md
npm run backlog:sync
```

---

## 💡 Dicas

1. **Sempre verificar dependências:** Algumas issues dependem de outras (ex: P2-003 depende de tokens funcionando)
2. **Estimar conservadoramente:** Adicione 20-30% buffer em estimativas
3. **Documentar decisões:** Usar comments nas issues para registrar discussões
4. **Atualizar status:** Mover issues entre colunas do projeto conforme progresso
5. **Retrospectiva:** Revisar semanalmente o que foi feito vs estimado

---

## 📞 Suporte

**Criado por:** DevOps Agent  
**Contato:** GitHub Issues ou Slack #educacross-dev  
**Última Review:** 17/11/2025  

---

**Status:** ✅ Backlog Completo e Pronto para Execução
