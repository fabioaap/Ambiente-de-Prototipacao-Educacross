# 🚀 Quick Reference - Educacross

Comandos rápidos para tarefas comuns no desenvolvimento Educacross.

---

## 🏃 Setup Rápido

```bash
# Primeira vez
git clone <repo-url>
cd Ambiente-de-Prototipacao-Educacross
npm install
npm run health

# Iniciar desenvolvimento
npm run dev              # → http://localhost:5173 (Games)
npm run storybook        # → http://localhost:6006 (Components)
npm run pixel:serve      # → http://localhost:8080 (HTMLs)
```

---

## 📝 Desenvolvimento

### Games (React + TypeScript)
```bash
npm run dev              # Dev server com HMR
npm run build            # Build de produção
npm run preview          # Preview do build
```

### Front-office / Back-office (Vanilla JS)
```bash
npm run pixel:serve      # Python HTTP server
# Ou use LiveServer no VS Code
```

### Storybook (Design System)
```bash
npm run storybook        # Dev server
npm run build-storybook  # Build estático
```

---

## 🧪 Testes

```bash
# Testes unitários (Vitest)
npm test                 # Watch mode
npm test -- --run        # Run once
npm run test:coverage    # Com cobertura

# Testes visuais (Playwright)
npm run pixel:test       # Rodar testes
npm run pixel:update     # Atualizar snapshots
npm run pixel:report     # Ver relatório HTML
```

---

## ✅ Validação

```bash
# Validação rápida (antes de commit)
npm run typecheck        # TypeScript
npm test -- --run        # Testes unitários
npm run check-mocks      # Validar mocks

# Validação completa
npm run health           # Health check do sistema
npm run build            # Build completo (inclui validações)

# Validação Python
python3 ci_validator.py              # CI validator
python3 universal_validator.py       # Validação universal
python3 interactive_validator.py     # Modo interativo
```

---

## 🔍 Verificação TypeScript

```bash
npm run typecheck        # Verificar tipos
npm run check-types      # Alias para typecheck
tsc --noEmit             # Direto via tsc
```

---

## 🧹 Limpeza

```bash
# Limpar tudo
npm run clean

# Limpar apenas relatórios
npm run clean:reports

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache npm
npm cache clean --force

# Limpar browsers Playwright
npx playwright uninstall --all
npm run pixel:install
```

---

## 🏥 Diagnóstico

```bash
# Health check completo
npm run health

# Verificar tamanho do repo
du -sh .
du -sh */ | sort -h

# Verificar arquivos grandes
find . -type f -size +1M -exec ls -lh {} \; | sort -k 5 -h

# Status Git
git status
git --no-pager log --oneline -10
git --no-pager diff --stat
```

---

## 🔄 Git Workflow

```bash
# Criar branch (Conventional)
git checkout -b feat/nome-feature
git checkout -b fix/nome-bug
git checkout -b docs/nome-doc

# Commit (pt-BR)
git add .
git commit -m "feat(componente): adicionar funcionalidade X"
git commit -m "fix(validacao): corrigir bug Y"
git commit -m "docs(readme): atualizar documentação Z"

# Push
git push origin nome-branch
```

**Tipos de commit:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Manutenção

---

## 🎨 Design e Validação Visual

```bash
# Extrair tokens do Figma
npm run pixel:extract-tokens

# Validar pixel-perfect
npm run pixel:validate-structure    # Estrutura HTML
npm run pixel:validate              # Pixels DPR 1
npm run pixel:validate-hidpi        # Pixels DPR 2
npm run pixel:validate-all          # Validação completa

# Validação Figma MCP
npm run mcp:check                   # Verificar status
npm run mcp:recover                 # Recuperar conexão
npm run mcp:validate                # Validação completa
npm run mcp:gate                    # Gate (verificar relatórios)
```

---

## 📦 Dependências

```bash
# Instalar
npm install

# Adicionar nova dependência
npm install <package>               # Produção
npm install -D <package>            # Desenvolvimento

# Atualizar dependências
npm update
npm outdated                        # Ver desatualizadas

# Verificar vulnerabilidades
npm audit
npm audit fix                       # Corrigir automaticamente
```

---

## 🚀 Build e Deploy

```bash
# Build
npm run build            # Build de produção (com validações)
npm run build:watch      # Build em watch mode

# Preview
npm run preview          # Preview do build local

# GitHub Pages
git push origin main     # Auto-deploy configurado
```

---

## 🐛 Troubleshooting

### CI falhando?
```bash
npm run lint             # Verificar lint
npm run typecheck        # Verificar TypeScript
npm run test -- --run    # Verificar testes
npm run build            # Verificar build
```

### Build falhando?
```bash
npm run check-mocks      # Verificar mocks (progress: 0)
npm run typecheck        # Verificar TypeScript
npm run clean            # Limpar artifacts
npm run build            # Tentar novamente
```

### Testes falhando?
```bash
npm test                 # Ver erro detalhado
npm run test:coverage    # Ver cobertura
npm run clean            # Limpar cache
npm test                 # Tentar novamente
```

### Playwright não funciona?
```bash
npx playwright uninstall --all
npm run pixel:install
npm run pixel:test
```

### Sistema lento?
```bash
npm run clean            # Limpar artifacts
du -sh validation-artifacts/    # Verificar tamanho
npm cache clean --force  # Limpar cache npm
```

### Health check com score baixo?
```bash
npm run health           # Ver detalhes
npm install              # Se node_modules ausente
npm run typecheck        # Se TypeScript com erro
npm run clean            # Se artifacts grandes
```

---

## 📚 Documentação

- **[README.md](../README.md)** - Visão geral
- **[DEVOPS-PRACTICES.md](DEVOPS-PRACTICES.md)** - Guia DevOps completo
- **[DEVOPS-REPORT.md](DEVOPS-REPORT.md)** - Relatório de análise
- **[DAILY_OPERATIONS.md](DAILY_OPERATIONS.md)** - Workflows diários
- **[GIT_WORKFLOW.md](GIT_WORKFLOW.md)** - Conventional commits
- **[journeys/](journeys/)** - Especificações de fluxos

---

## 🔗 URLs Úteis

- **Dev Server (Games):** http://localhost:5173
- **Storybook:** http://localhost:6006
- **Python Server (HTMLs):** http://localhost:8080
- **GitHub Pages:** https://fabioaap.github.io/Ambiente-de-Prototipacao-Educacross/

---

## 💡 Dicas Rápidas

**Atalhos VS Code:**
- `Ctrl+Shift+P` → "Live Server: Open with Live Server" (HTMLs)
- `Ctrl+`` → Abrir terminal integrado
- `Ctrl+Shift+B` → Rodar task (configurado em `.vscode/tasks.json`)

**Antes de cada commit:**
```bash
npm run typecheck && npm test -- --run && npm run build
```

**Antes de cada PR:**
```bash
npm run health && npm run build && npm run build-storybook
```

**Manutenção semanal:**
```bash
npm run clean && npm run health && git status
```

---

## 🎯 Workflows Recomendados

### Morning Routine
```bash
git pull
npm run health
npm run dev
```

### Before Commit
```bash
npm run typecheck
npm test -- --run
git add .
git commit -m "feat: ..."
git push
```

### Weekly Cleanup
```bash
npm run clean
npm run health
du -sh .
```

---

**Versão:** 1.0  
**Última atualização:** 2025-11-17  
**Mantenedor:** DevOps Team

Para mais detalhes, consulte [DEVOPS-PRACTICES.md](DEVOPS-PRACTICES.md)
