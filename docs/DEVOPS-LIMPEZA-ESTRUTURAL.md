# 🧹 DevOps - Plano de Limpeza Estrutural

**Data:** 18 de novembro de 2025  
**Status:** 🟡 PROPOSTA (aguardando aprovação antes de execução)  
**Impacto:** Redução de ~40-50% de arquivos desnecessários  
**Risco:** BAIXO (arquivos não referenciados em código ativo)  
**Tempo de execução:** ~15 minutos

---

## 🎯 Diagnóstico Executivo

### Situação Atual
```
Total de arquivos no raiz: ~90 arquivos
Arquivos potencialmente não utilizados: ~35-40 arquivos
Espaço estimado para recuperar: ~5-8 MB
```

### Benefícios de Limpeza
✅ Repositório mais limpo e fácil de navegar  
✅ Menos confusão para novos desenvolvedores  
✅ Build mais rápido (menos arquivos para checkout)  
✅ Melhor organização visual em VS Code  
✅ CI/CD mais eficiente (menos arquivos para validar)  

---

## 📋 Categorias de Limpeza

### **CATEGORIA 1: Arquivos de Setup & Instalação** (Remover)

Estes arquivos foram usados uma vez para setup inicial e não são mais necessários:

| Arquivo | Razão | Risco |
|---------|-------|-------|
| `instalar-powershell7.bat` | Setup one-time PowerShell | NENHUM |
| `instalar-powershell7.ps1` | Setup one-time PowerShell | NENHUM |
| `INSTRUCOES-INSTALACAO-POWERSHELL.md` | Documentação de setup obsoleta | NENHUM |
| `abrir-prototipo.ps1` | Script desenvolvimento obsoleto | NENHUM |
| `criar-estrutura-ambiente.ps1` | Setup folder structure (já feito) | NENHUM |
| `organizar-ambiente.bat` | Batch setup (já feito) | NENHUM |
| `start-prototipo.cjs` | Starter script obsoleto | NENHUM |
| `start-prototipo.js` | Starter script obsoleto | NENHUM |

**Total para remover:** 8 arquivos

---

### **CATEGORIA 2: Documentação Redundante/Obsoleta** (Consolidar ou Remover)

Documentação duplicada ou de projetos antigos:

| Arquivo | Status | Ação Recomendada |
|---------|--------|------------------|
| `AMBIENTE-README.md` | Duplica README.md | Remover |
| `GETTING_STARTED.md` | Duplica docs/INDEX.md | Remover |
| `JORNADA-ENTREGAVEIS.md` | Antiga, substitui por journeys/ | Remover |
| `JORNADA-RESUMO-VISUAL.md` | Antiga, substitui por journeys/ | Remover |
| `README_VALIDACAO_UNIVERSAL.md` | Duplica docs/GUIA-RAPIDO-VALIDACAO-ESTRUTURAL.md | Remover |
| `README_VALIDATOR_OPTIMIZED.md` | Duplica universal_validator_optimized.py | Remover |
| `SUMARIO-AMBIENTE.md` | Resumo antigo, usar STATUS_REPORT.md | Remover |
| `Sobre_o_Ambiente_de_prototipação_Educacross.html` | HTML antigo, info em INDEX.md | Remover |

**Total para remover:** 8 arquivos

---

### **CATEGORIA 3: Arquivos HTML de Protótipo Antigos** (Remover)

Protótipos de versões antigas, substituídos pela estrutura /pages/:

| Arquivo | Localização Atual | Ação |
|---------|-------------------|------|
| `enviar_missoes_em_lote_html_com_drawer_assistente_v5.1.html` | Raiz (não referenciado) | Remover - arquivado em Back-office/ |

**Total para remover:** 1 arquivo

---

### **CATEGORIA 4: Scripts de Validação & CI/CD Duplicados** (Consolidar)

Múltiplas versões de validadores criadas em iterações anteriores:

| Arquivo | Versão | Uso Ativo | Ação Recomendada |
|---------|--------|----------|------------------|
| `universal_validator.py` | v1 (original) | ✅ SIM | Manter |
| `universal_validator_optimized.py` | v2 (otimizado) | ❌ NÃO | Remover (merged em v1) |
| `demo_universal_validator.py` | Demo/testes | ❌ TALVEZ | Mover para `scripts/` |
| `ci_validator.py` | CI/CD | ✅ SIM | Manter |
| `interactive_validator.py` | CLI interativa | ✅ SIM | Manter |
| `universal_validator_config.json` | Configuração | ⚠️ CHECAR | Verificar se em uso |

**Ações:**
- ❌ Remover: `universal_validator_optimized.py`
- 📦 Mover: `demo_universal_validator.py` → `scripts/demo-validator.py`

---

### **CATEGORIA 5: Relatórios & Artifacts Gerados** (Limpeza Periódica)

Estes arquivos são GERADOS pelo CI/CD e NÃO devem estar em git:

| Arquivo | Tipo | Ação |
|---------|------|------|
| `universal_validation_report.json` | Relatório gerado | Remover + adicionar .gitignore |
| `dual-validation-report.json` | Relatório gerado | Remover + adicionar .gitignore |
| `pixel-perfect-validation-report.json` | Relatório gerado | Remover + adicionar .gitignore |
| `pixel-perfect.manifest.json` | Manifesto gerado | Remover + adicionar .gitignore |

**Total para remover:** 4 arquivos

**Ação adicional:** Atualizar `.gitignore` para evitar commits futuros:
```gitignore
# Validation artifacts (gerados automaticamente)
*-validation-report.json
*-manifest.json
universal_validation_report.json
dual-validation-report.json
pixel-perfect-validation-report.json
```

---

### **CATEGORIA 6: Pastas/Arquivos Duplicados ou Obsoletos** (Revisar)

| Caminho | Motivo | Ação |
|---------|--------|------|
| `prototype-react/` | Prototipagem antigo, agora em `apps/` | ⚠️ BACKUP antes de remover |
| `Telas do fluxo/` | Documentação visual antiga | ⚠️ BACKUP antes de remover |
| `Back-office/*arquivos .html na raiz*` | Substituídos por pages/ | Remover (já em pages/) |

---

### **CATEGORIA 7: Scripts Raiz não integrados** (Revisar + Mover)

Scripts criados para testes mas não integrados ao npm scripts:

| Arquivo | Função | Ação |
|---------|--------|------|
| `script.js` | Teste? | Verificar propósito ou remover |
| `styles.css` | CSS raiz? | Usar `base.css` ou remover |

---

### **CATEGORIA 8: Arquivos OK - Manter** ✅

```
✅ MANTER - Essenciais para CI/CD:
   - .github/workflows/
   - .storybook/
   - package.json / package-lock.json
   - tsconfig.json, vite.config.ts, etc
   - playwright.config.ts
   - postcss.config.js
   - tailwind.config.js

✅ MANTER - Documentação ativa:
   - README.md
   - docs/
   - .prompts/
   - .github/copilot-instructions.md

✅ MANTER - Código ativo:
   - src/
   - apps/
   - Front-office/
   - Back-office/
   - assets/
   - packages/
   - scripts/
   - tests/

✅ MANTER - Configuração:
   - .gitignore
   - .nojekyll
   - .validation-cache/
   - .vscode/
   - .cursorrules

✅ MANTER - Landing pages:
   - index.html (dashboard raiz)
   - 404.html (GitHub Pages)
```

---

## 🔧 Plano de Execução

### **Fase 1: Backup (Segurança)**
```bash
# Criar branch de backup
git checkout -b backup/pre-cleanup-2025-11-18
git push origin backup/pre-cleanup-2025-11-18

# Volta para branch principal para limpeza
git checkout copilot/reorganize-project-structure
```

### **Fase 2: Remover Arquivos não utilizados**
```bash
# CATEGORIA 1: Setup files (remover)
git rm instalar-powershell7.bat
git rm instalar-powershell7.ps1
git rm INSTRUCOES-INSTALACAO-POWERSHELL.md
git rm abrir-prototipo.ps1
git rm criar-estrutura-ambiente.ps1
git rm organizar-ambiente.bat
git rm start-prototipo.cjs
git rm start-prototipo.js

# CATEGORIA 2: Documentação obsoleta (remover)
git rm AMBIENTE-README.md
git rm GETTING_STARTED.md
git rm JORNADA-ENTREGAVEIS.md
git rm JORNADA-RESUMO-VISUAL.md
git rm README_VALIDACAO_UNIVERSAL.md
git rm README_VALIDATOR_OPTIMIZED.md
git rm SUMARIO-AMBIENTE.md
git rm 'Sobre_o_Ambiente_de_prototipação_Educacross.html'

# CATEGORIA 3: Protótipos antigos (remover)
git rm 'enviar_missoes_em_lote_html_com_drawer_assistente_v5.1.html'

# CATEGORIA 4: Validadores duplicados (remover)
git rm universal_validator_optimized.py

# CATEGORIA 5: Relatórios gerados (remover)
git rm universal_validation_report.json
git rm dual-validation-report.json
git rm pixel-perfect-validation-report.json
git rm pixel-perfect.manifest.json
```

### **Fase 3: Mover e Reorganizar**
```bash
# Mover demo validator para scripts/
mv demo_universal_validator.py scripts/demo-validator.py
git add scripts/demo-validator.py
git rm demo_universal_validator.py

# Revisar Back-office/Gerador... para remover duplicatas
# (Se houver .html files na raiz da pasta, já devem estar em pages/)
```

### **Fase 4: Atualizar .gitignore**
```bash
# Adicionar ao .gitignore:
cat >> .gitignore << 'EOF'

# Validation artifacts (gerados automaticamente)
*-validation-report.json
*-manifest.json
validation-artifacts/
test-results/
EOF

git add .gitignore
```

### **Fase 5: Commit & Push**
```bash
git commit -m "chore(cleanup): remover arquivos obsoletos e consolidar estrutura

- Remover 8 scripts de setup one-time (instalar-powershell, criar-estrutura)
- Remover 8 documentações obsoletas/duplicadas
- Remover 1 protótipo antigo (enviar_missoes_em_lote_v5.1.html)
- Remover validador duplicado (universal_validator_optimized.py)
- Remover 4 relatórios gerados (artifacts)
- Mover demo-validator para scripts/
- Atualizar .gitignore para artifacts

Total: ~22 arquivos removidos, estrutura mais limpa"

git push origin copilot/reorganize-project-structure
```

---

## 📊 Resultado Esperado

### Antes de Limpeza
```
Raiz: ~90 arquivos (confuso, muita duplicação)
Scripts em raiz: 8 arquivos (instalação)
Documentação duplicada: 8 arquivos
Artifacts gerados: 4 arquivos
```

### Depois de Limpeza
```
Raiz: ~68-70 arquivos (organizado, apenas essenciais)
Scripts em raiz: 0 arquivos (todos em scripts/)
Documentação: 1 principal (README.md) + docs/
Artifacts: 0 no git (ignored)

Redução: ~20 arquivos (~22% do raiz)
Clareza: +++
Navegação: Mais fácil em VS Code
Git history: Mais limpo
```

---

## ⚠️ Verificações de Segurança

**Antes de commitar a limpeza:**

### 1. Verificar que nenhum arquivo deletado é referenciado:
```bash
# Procurar por referências aos arquivos a remover
grep -r "instalar-powershell" src/ docs/ scripts/ apps/ Front-office/ Back-office/
grep -r "universal_validator_optimized" .github/ docs/ scripts/

# Se houver matches: PARAR e revisar antes de remover
```

### 2. Verificar que git tracking está correto:
```bash
git status  # Deve mostrar exatamente os arquivos a remover/mover
```

### 3. Teste de build pós-limpeza:
```bash
npm run build      # Deve passar
npm run check-mocks # Deve passar
```

---

## 🚨 Rollback Plan

Se algo der errado após commit:

```bash
# Reverter última limpeza
git revert HEAD

# Ou resetar para backup
git reset --hard backup/pre-cleanup-2025-11-18
```

---

## 📋 Checklist Final

- [ ] **Fase 1:** Backup branch criada
- [ ] **Fase 2:** Arquivos não utilizados identificados e marcados
- [ ] **Fase 3:** Verificação de referências cruzadas (grep)
- [ ] **Fase 4:** Testes de build após remoção (npm run build)
- [ ] **Fase 5:** Commit com mensagem convenção pt-BR
- [ ] **Fase 6:** Push para origin
- [ ] **Verificação:** README ainda é claro? Docs estrutura OK?

---

## 🎯 Próximos Passos

1. **Aprovação:** Você valida este plano
2. **Execução:** Agente executa Fases 1-5
3. **Validação:** Testar build + navegação
4. **Merge:** Integrar limpeza com resto das mudanças

---

**Arquivo:** DEVOPS-LIMPEZA-ESTRUTURAL.md  
**Versão:** 1.0  
**Status:** 🟡 Aguardando aprovação para execução
