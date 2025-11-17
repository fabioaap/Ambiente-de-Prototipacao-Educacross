# 🚀 Guia Rápido: Criação de Issues no GitHub

**Data:** 17/11/2025  
**Status:** ✅ Backlog Completo

---

## 📋 O Que Foi Criado

Backlog completo de **11 issues** estruturadas e prontas para criação no GitHub Issues:

- **1 issue Sprint 6** (P1 - High) - Layout mobile quebrado
- **3 issues P1** (Critical/High) - Débito técnico crítico  
- **7 issues P2** (Medium) - Melhorias de qualidade

**Localização:** `.github/issues/`

---

## 🎯 Como Criar as Issues no GitHub

### Opção 1: Criar Manualmente (Interface Web)

1. Acesse: https://github.com/fabioaap/Ambiente-de-Prototipacao-Educacross/issues/new

2. Para cada issue em `.github/issues/`:
   - Copie o título (linha começando com `#`)
   - Copie todo o conteúdo do arquivo
   - Cole no formulário de nova issue
   - Adicione labels apropriadas (ver seção Labels abaixo)
   - Clique em "Submit new issue"

### Opção 2: Usar GitHub CLI (Automação)

**Pré-requisito:** Instalar GitHub CLI

```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# macOS
brew install gh

# Linux
sudo apt install gh
```

**Autenticar:**
```bash
gh auth login
```

**Criar todas as issues automaticamente:**

```bash
cd /caminho/para/Ambiente-de-Prototipacao-Educacross

# Criar issue Sprint 6
gh issue create \
  --title "M1: Corrigir Layout Mobile Quebrado (ambiente-prototipacao)" \
  --body-file .github/issues/sprint-6/M1-corrigir-layout-mobile.md \
  --label "priority:p1-high,sprint-6,mobile,layout"

# Criar issues P1 em batch
for file in .github/issues/technical-debt-p1/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create \
    --title "$title" \
    --body-file "$file" \
    --label "priority:p1-high,technical-debt"
done

# Criar issues P2 em batch
for file in .github/issues/technical-debt-p2/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create \
    --title "$title" \
    --body-file "$file" \
    --label "priority:p2-medium,technical-debt"
done
```

**Windows (PowerShell):**
```powershell
# Criar issues P1
Get-ChildItem .github\issues\technical-debt-p1\*.md | ForEach-Object {
  $title = (Get-Content $_.FullName | Select-String "^# " | Select-Object -First 1).ToString().Replace("# ", "")
  gh issue create --title $title --body-file $_.FullName --label "priority:p1-high,technical-debt"
}

# Criar issues P2
Get-ChildItem .github\issues\technical-debt-p2\*.md | ForEach-Object {
  $title = (Get-Content $_.FullName | Select-String "^# " | Select-Object -First 1).ToString().Replace("# ", "")
  gh issue create --title $title --body-file $_.FullName --label "priority:p2-medium,technical-debt"
}
```

---

## 🏷️ Labels Recomendadas

Criar labels no repositório antes de importar issues:

### Prioridade
- `priority:p0-critical` - Vermelho escuro (#B60205)
- `priority:p1-high` - Vermelho (#D93F0B)
- `priority:p2-medium` - Laranja (#FFA500)
- `priority:p3-low` - Amarelo (#FFD700)

### Categoria
- `technical-debt` - Cinza escuro (#666666)
- `enhancement` - Verde (#28C76F)
- `bug` - Vermelho (#EA5455)
- `documentation` - Azul claro (#5DADE2)
- `automation` - Roxo (#7367F0)

### Componente
- `front-office` - Ciano (#00CED1)
- `back-office` - Azul (#2196F3)
- `games` - Verde claro (#8BC34A)
- `storybook` - Rosa (#FF4785)
- `ci-cd` - Cinza (#90A4AE)
- `validation` - Amarelo escuro (#FFC107)

### Status
- `status:backlog` - Cinza claro (#CCCCCC)
- `status:in-progress` - Azul (#2196F3)
- `status:review` - Laranja (#FF9800)
- `status:blocked` - Vermelho (#F44336)

### Esforço
- `effort:low` - Verde claro (#C8E6C9)
- `effort:medium` - Amarelo claro (#FFF9C4)
- `effort:high` - Laranja claro (#FFE0B2)

**Criar labels via CLI:**
```bash
# Prioridades
gh label create "priority:p0-critical" -c B60205 -d "Ação imediata"
gh label create "priority:p1-high" -c D93F0B -d "Alta prioridade"
gh label create "priority:p2-medium" -c FFA500 -d "Média prioridade"
gh label create "priority:p3-low" -c FFD700 -d "Baixa prioridade"

# Categorias
gh label create "technical-debt" -c 666666 -d "Débito técnico"
gh label create "enhancement" -c 28C76F -d "Melhoria"
gh label create "documentation" -c 5DADE2 -d "Documentação"
gh label create "automation" -c 7367F0 -d "Automação"

# Esforços
gh label create "effort:low" -c C8E6C9 -d "<0.5h"
gh label create "effort:medium" -c FFF9C4 -d "0.5-2h"
gh label create "effort:high" -c FFE0B2 -d "2-4h"
```

---

## 📊 Organização no GitHub Projects

### Criar Projeto
1. Acesse: https://github.com/fabioaap/Ambiente-de-Prototipacao-Educacross/projects
2. Clique em "New project"
3. Nome: "Backlog Educacross"
4. Template: "Board"

### Colunas Sugeridas
- 📋 **Backlog** (issues P2-P3)
- 🔥 **Priority** (issues P0-P1)
- 🏗️ **In Progress** (sendo trabalhadas)
- 👀 **Review** (aguardando revisão)
- ✅ **Done** (concluídas)

### Adicionar Issues ao Projeto
```bash
# Via CLI (após criar issues)
gh project item-add [PROJECT_NUMBER] --owner fabioaap --url [ISSUE_URL]
```

---

## 🗓️ Roadmap Sugerido

### Semana 1 (18-22 Nov) - P1 + Sprint 6
```bash
# Criar e trabalhar nestas issues primeiro
M1: Corrigir Layout Mobile (2-3h)
P1-001: Consolidar Diretórios Back-office (0.5h)
P1-002: MCP Figma Auth (1h)
```

### Semana 2 (25-29 Nov) - P1 + P2 High Impact
```bash
P1-003: Validators Figma Source (1h)
P2-002: Storybook Integration Tests (2h)
P2-005: CI/CD GitHub Pages (1h)
```

### Semana 3 (02-06 Dez) - P2 Restantes
```bash
P2-003: Tokens DTCG (1.5h)
P2-006: Mocks Schema Validation (0.75h)
P2-004: TypeScript Validation Vanilla (0.5h)
P2-007: README Desatualizado (0.5h)
P2-001: SVG Aspect Ratio (0.25h)
```

---

## 📝 Workflow Recomendado

### Para cada issue:

1. **Criar issue no GitHub** (manual ou CLI)
2. **Adicionar ao projeto** (arrastar para coluna apropriada)
3. **Atribuir a alguém** (assign)
4. **Criar branch:**
   ```bash
   git checkout -b fix/P1-001-consolidar-diretorios
   ```
5. **Trabalhar na issue** (seguir passos no corpo da issue)
6. **Commitar com conventional commits:**
   ```bash
   git commit -m "fix(backoffice): consolidar diretórios duplicados"
   ```
7. **Push e criar PR:**
   ```bash
   git push origin fix/P1-001-consolidar-diretorios
   gh pr create --title "Fix: Consolidar diretórios Back-office" --body "Resolve #ISSUE_NUMBER"
   ```
8. **Link PR à issue:** Adicionar "Closes #ISSUE_NUMBER" no PR body
9. **Review e merge**
10. **Issue fecha automaticamente** ao fazer merge do PR

---

## 🔗 Links Úteis

- **Issues Directory:** `.github/issues/README.md`
- **Backlog Completo:** `docs/BACKLOG.md`
- **Technical Debt:** `docs/TECHNICAL_DEBT.md`
- **Git Workflow:** `docs/GIT_WORKFLOW.md`
- **GitHub CLI Docs:** https://cli.github.com/manual/

---

## ✅ Checklist de Ações

- [ ] Instalar GitHub CLI (se usar automação)
- [ ] Autenticar no GitHub CLI (`gh auth login`)
- [ ] Criar labels no repositório
- [ ] Criar projeto "Backlog Educacross"
- [ ] Criar issues (manual ou CLI)
- [ ] Adicionar issues ao projeto
- [ ] Priorizar issues (ordenar colunas)
- [ ] Iniciar trabalho nas issues P1

---

**Dúvidas?** Consulte `.github/issues/README.md` para detalhes completos.

**Status:** ✅ Pronto para Execução
