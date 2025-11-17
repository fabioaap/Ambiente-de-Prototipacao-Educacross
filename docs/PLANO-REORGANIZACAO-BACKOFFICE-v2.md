# 📋 PLANO REORGANIZAÇÃO COMPLETA v3 — 4 PILARES + SNAPSHOT

**Status:** 🟢 Refinado e Expandido  
**Data:** 17 de novembro de 2025  
**Branch Base:** main (d086080 - estável)  
**Objetivo:** Reorganizar projeto mantendo 4 pilares intactos + validação com snapshot

---

## 🎯 ESCOPO EXPANDIDO: 4 PILARES + 3 PRODUTOS

### Pilares Intactos (🔒 NÃO TOCAR)
1. **Root Dashboard** → `index.html`, `404.html`, `.nojekyll` (GitHub Pages publicado)
2. **Environment Docs** → `ambiente-*.{html,css,js}` (documentação KCross)
3. **Games** → `src/`, `apps/`, `prototype-react/` (React independente)
4. **Assets Raiz** → `assets/logo-educacross.svg`, validadores Python

### Produtos a Reorganizar
1. **Back-office** → `Back-office/Gerador.../` (FOCO PRINCIPAL)
2. **Front-office** → `Front-office/...` (segunda prioridade)
3. **Environment Docs** → consolidação de duplicação (OPÇÃO A: consolidar)

---

## 📑 ÍNDICE ESTRUTURADO

- [1. Estado Pré-Reorganização (4 Pilares)](#1-estado-pré-reorganização-4-pilares)
- [2. Estruturas Alvo (Organização)](#2-estruturas-alvo-organização)
- [3. Snapshot & Baseline (Segurança)](#3-snapshot--baseline-segurança)
- [4. Plano Sequencial (8 Fases)](#4-plano-sequencial-8-fases)
- [5. Checklists por Fase](#5-checklists-por-fase)
- [6. Rollback Strategy](#6-rollback-strategy)
- [7. Timeline & Risk Matrix](#7-timeline--risk-matrix)

---

## 1. ESTADO PRÉ-REORGANIZAÇÃO (4 PILARES)

### 1.1 PILAR 1: Root Dashboard (🔒 SAGRADO)

### 1.1 PILAR 1: Root Dashboard (🔒 SAGRADO)
```
Raiz/
├── index.html                    ✅ GitHub Pages dashboard
├── 404.html                      ✅ Error page
├── .nojekyll                     ✅ GitHub Pages config
├── assets/
│   ├── styles/
│   │   ├── basis.css
│   │   └── common.css
│   └── logo-educacross.svg       ← Referenciado por index.html
└── .github/
    ├── copilot-instructions.md
    └── PULL_REQUEST_TEMPLATE.md
```
**Status:** NÃO ALTERAR. Se tocar, GitHub Pages quebra.
**Dependências:** index.html referencia `assets/logo-educacross.svg` (path relativo)

---

### 1.2 PILAR 2: Environment Docs (🔒 DOCUMENTAÇÃO KCROSS)
```
Raiz/
├── ambiente-index.html           ← DUPLICADO em docs/ambiente-prototipacao/index.html
├── ambiente-base.css             ← DUPLICADO
├── ambiente-styles.css           ← DUPLICADO
├── ambiente-script.js            ← DUPLICADO
├── AMBIENTE-README.md            ← DUPLICADO em README_AMBIENTE.md
├── README_AMBIENTE.md
└── docs/ambiente-prototipacao/
    └── index.html                ← Versão docs

Status: ⚠️ CONSOLIDAR - Opção A (mover tudo para docs/) ou Opção B (deletar raiz)
Recomendação: Opção A (manter raiz para acesso rápido, atualizar index.html link)
```

**⚠️ DECISÃO NECESSÁRIA:** 
- **Opção A (RECOMENDADO):** Mover `ambiente-*.{html,css,js}` para `docs/ambiente-prototipacao/`, deixar link em index.html
- **Opção B:** Deletar cópias raiz, manter só em `docs/`

**Recomendação:** **Opção A** - Mantém acesso rápido + organização clara

---

### 1.3 PILAR 3: Games (✅ INDEPENDENTE)
```
Raiz/
├── src/
│   ├── main.tsx (entry point Vite)
│   ├── components/ (React)
│   ├── mocks/ (missions.ts com progress: 0)
│   └── index.css (design tokens)
├── apps/
│   ├── proto/
│   └── prototipo/
├── packages/
│   ├── tokens/
│   └── ui/
├── package.json (npm scripts: dev, storybook, build)
├── vite.config.ts
└── .storybook/
```
**Status:** ✅ DEIXAR NA RAIZ. Independente, não quebra nada.

---

### 1.4 PILAR 4: Back-office (🔄 FOCO REORGANIZAÇÃO)
```
Back-office/
├── Gerador de Questões por IA – BackOffice/   ← PASTA RAIZ CONFUSA
│   ├── habilidades-topicos.html               ✅ v1
│   ├── habilidades-topicos-v2.html            ✅ v2 (PRODUÇÃO)
│   ├── criar-questao-quiz.html                ✅ com toast
│   ├── banco-questoes-revisao.html            ✅ com stats-bar
│   ├── (6 arquivos HTML soltos)
│   ├── assets/                                ← CENTRALIZADO
│   │   ├── styles/ (basis.css, common.css)
│   │   ├── icons/ (18 SVGs)
│   │   └── logo-*.svg
│   └── universal_validation_report.json
```
**Problemas:**
- ❌ Nome confuso com espaços/hífens especiais
- ❌ 6 HTML soltos na raiz (v1 vs v2, produção incerta)
- ❌ CSS duplicado (1,300+ linhas)
- ❌ Sidebar/header duplicado 150 linhas × 3

---

### 1.5 PILAR 5: Front-office (📁 ESTRUTURA SIMPLES)
```
Front-office/
└── Adicionar modal de visualizaçãoaprovação no Banco de Questões/
    └── prototipo-modal-aprovacao/
        └── demo-interativo.html              (1 arquivo HTML)
```
**Status:** 📍 ESPARSAMENTE PREENCHIDO
- Só 1 protótipo de modal
- Sem organização modular
- Sem assets centralizados

**Ação:** Aplicar mesmo padrão de Back-office (pastas por feature + assets/)

---

## 2. ESTRUTURAS ALVO (ORGANIZAÇÃO)

### 2.1 Back-office Alvo

### 2.1 Back-office Alvo
```
Back-office/
├── Gerador de Questões por IA – BackOffice/  ← RENOMEAR para "banco-de-questoes"
│   ├── pages/                                 ← NOVO
│   │   ├── 01-habilidades-topicos/
│   │   │   ├── index.html
│   │   │   ├── styles.css
│   │   │   └── script.js
│   │   ├── 02-criar-questao-quiz/
│   │   │   ├── index.html
│   │   │   ├── styles.css
│   │   │   └── script.js
│   │   └── 03-banco-questoes-revisao/
│   │       ├── index.html
│   │       ├── styles.css
│   │       └── script.js
│   ├── assets/                                ← CENTRALIZADO
│   │   ├── styles/
│   │   │   ├── basis.css
│   │   │   ├── common.css
│   │   │   └── variables.css
│   │   ├── icons/ (18 SVGs)
│   │   ├── logo-icon-real.svg
│   │   └── logo-text-real.svg
│   ├── docs/                                  ← NOVO
│   │   ├── ARQUITETURA.md
│   │   ├── GUIA-USO.md
│   │   └── VALIDACAO.md
│   ├── index.html                             ← NOVO: Hub navegação
│   └── README.md
└── README.md                                  ← NOVO: Link para sub-estrutura
```

**Benefícios:**
- ✅ Cada página isolada em sua pasta
- ✅ Fácil adicionar nova feature (04-outra-pagina/)
- ✅ Assets centralizados, path claro
- ✅ Versionamento independente por página
- ✅ Documentação centralizada

---

### 2.2 Front-office Alvo
```
Front-office/
├── modal-aprovacao-banco/                     ← RENOMEAR
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md
├── assets/                                    ← NOVO: Centralizado
│   ├── styles/
│   │   ├── basis.css
│   │   └── common.css
│   ├── icons/
│   └── logo-*.svg
└── README.md                                  ← NOVO: Índice
```

---

### 2.3 Environment Docs - Opção A (RECOMENDADO)
```
docs/ambiente-prototipacao/
├── index.html                                 ← MANTIDO
├── base.css
├── styles.css
├── script.js
└── README.md

Raiz/ (SIMPLIFICADO)
├── ambiente-index.html → DELETADO
├── ambiente-*.css → DELETADO
├── ambiente-*.js → DELETADO
└── index.html → ATUALIZADO com link "docs/ambiente-prototipacao/"
```

---

## 3. SNAPSHOT & BASELINE (SEGURANÇA)

### 3.1 Snapshot Obrigatório (Pré-Reorganização)

**Arquivo 1: `SNAPSHOT-BASELINE-d086080.md`**
```markdown
# Snapshot Baseline - Commit d086080

## Estado PRÉ-reorganização

### Back-office
- habilidades-topicos-v2.html (266 linhas)
- criar-questao-quiz.html (489 linhas)
- banco-questoes-revisao.html (951 linhas)
- **Total:** 1,706 linhas (HTML+CSS+JS misturado)

### Stats
- Root Dashboard: ✅ Working
- Environment Docs: ✅ Working
- Games: ✅ Working
- Front-office: ✅ Working

### Critical Features
- Toast localStorage: 'toastPendente' ✅
- Stats-bar badges: Quiz: 15, IA: 5, Humano: 10 ✅
- Paths: ../../assets/styles/ (2 níveis acima) ✅
```

**Arquivo 2: `CHECKLIST-VALIDACAO-POS-MIGRACAO.md`**
```markdown
# Checklist Validação Pós-Migração

## ✅ Root Dashboard (NÃO ALTERAR)
- [ ] index.html carrega no GitHub Pages
- [ ] 404.html renderiza corretamente
- [ ] assets/logo-educacross.svg referenciado
- [ ] Health score: 73.1% mantido

## ✅ Environment Docs Consolidados
- [ ] docs/ambiente-prototipacao/index.html acessível
- [ ] Links em index.html apontam para novo local
- [ ] Deletadas cópias raiz
- [ ] Sem 404s

## ✅ Back-office Reorganizado
- [ ] pages/01-habilidades-topicos/ carrega ✅
- [ ] pages/02-criar-questao-quiz/ carrega ✅
- [ ] pages/03-banco-questoes-revisao/ carrega ✅
- [ ] Hub index.html tem links funcionando ✅

## ✅ Toast & Stats-bar
- [ ] Toast localStorage funciona ✅
- [ ] Toast persiste entre páginas ✅
- [ ] Stats-bar renderiza corretamente ✅

## ✅ Paths & Assets
- [ ] Sem 404s no console ✅
- [ ] CSS carrega corretamente ✅
- [ ] Ícones renderizam ✅

## 📊 Métricas de Redução
- Back-office linhas: 1706 → ~500 (-71%)
- SVG inline: 2 → 0
- CSS duplicado removido: ~1300 linhas
```

**Arquivo 3: `scripts/validate-migration.py`**
```python
#!/usr/bin/env python3
import os
from pathlib import Path

class MigrationValidator:
    def __init__(self, repo_root):
        self.repo_root = Path(repo_root)
        
    def count_lines(self, file_path):
        if not file_path.exists():
            return 0
        return len(file_path.read_text().split('\n'))
    
    def analyze_before(self):
        """Analisa estado ANTES (d086080)"""
        return {
            "habilidades_topicos_v2": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/habilidades-topicos-v2.html"
            ),
            "criar_questao_quiz": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/criar-questao-quiz.html"
            ),
            "banco_questoes_revisao": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/banco-questoes-revisao.html"
            ),
        }
    
    def analyze_after(self):
        """Analisa estado DEPOIS (organizado)"""
        return {
            "habilidades_topicos": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/pages/01-habilidades-topicos/index.html"
            ),
            "criar_questao_quiz": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/pages/02-criar-questao-quiz/index.html"
            ),
            "banco_questoes_revisao": self.count_lines(
                self.repo_root / "Back-office/Gerador de Questões por IA – BackOffice/pages/03-banco-questoes-revisao/index.html"
            ),
        }
    
    def compare(self):
        before = self.analyze_before()
        after = self.analyze_after()
        
        reduction = {}
        for key in before:
            before_lines = before[key]
            after_lines = after[key]
            if before_lines > 0:
                pct = round(((before_lines - after_lines) / before_lines) * 100, 1)
                reduction[key] = {
                    "before": before_lines,
                    "after": after_lines,
                    "reduction": before_lines - after_lines,
                    "percent": pct
                }
        
        return {
            "before": before,
            "after": after,
            "reduction": reduction,
            "total_before": sum(before.values()),
            "total_after": sum(after.values()),
        }
    
    def report(self):
        data = self.compare()
        print("\n=== MIGRATION VALIDATION ===\n")
        for page, m in data['reduction'].items():
            print(f"{page}: {m['before']} → {m['after']} ({m['percent']}%)")
        
        total_before = data['total_before']
        total_after = data['total_after']
        total_reduction = total_before - total_after
        pct = round((total_reduction / total_before) * 100, 1) if total_before > 0 else 0
        print(f"\nTOTAL: {total_before} → {total_after} ({pct}% redução)")

if __name__ == '__main__':
    import sys
    repo_root = sys.argv[1] if len(sys.argv) > 1 else '.'
    MigrationValidator(repo_root).report()
```

---

## 4. PLANO SEQUENCIAL (8 FASES)

### FASE 0: Consolidação Ambiente Docs (Pré-reorganização)
**Branch:** `organize/ambiente-consolidacao`
**Duração:** 10 min | **Risco:** Baixo

```bash
# Opção A - RECOMENDADA
1. [ ] Deletar: ambiente-index.html, ambiente-base.css, ambiente-styles.css, ambiente-script.js
2. [ ] Deletar: README_AMBIENTE.md (manter AMBIENTE-README.md como referência)
3. [ ] Atualizar: index.html com link para "docs/ambiente-prototipacao/"
4. [ ] Commit: "chore: consolidar ambiente docs em docs/ambiente-prototipacao/"
5. [ ] Test: http://localhost:8080 → links funcionam
```

---

### FASE 1: Snapshot & Baseline (Documentação)
**Branch:** `organize/snapshot-baseline`
**Duração:** 5 min | **Risco:** Zero (leitura apenas)

```bash
1. [ ] Criar: docs/SNAPSHOT-BASELINE-d086080.md
2. [ ] Criar: docs/CHECKLIST-VALIDACAO-POS-MIGRACAO.md
3. [ ] Criar: scripts/validate-migration.py
4. [ ] Commit: "docs: criar snapshot baseline pré-reorganização"
5. [ ] Test: python scripts/validate-migration.py . (retorna before values)
```

---

### FASE 2: Preparação Back-office (Estrutura)
**Branch:** `organize/backoffice-fase2-prep`
**Duração:** 5 min | **Risco:** Baixo

```bash
1. [ ] Criar: Back-office/Gerador.../pages/ (vazia)
2. [ ] Criar: Back-office/Gerador.../pages/01-habilidades-topicos/ (vazia)
3. [ ] Criar: Back-office/Gerador.../pages/02-criar-questao-quiz/ (vazia)
4. [ ] Criar: Back-office/Gerador.../pages/03-banco-questoes-revisao/ (vazia)
5. [ ] Criar: Back-office/Gerador.../docs/ (vazia)
6. [ ] Commit: "chore: criar estrutura diretórios back-office"
7. [ ] Verify: `git status` mostra apenas novas pastas
```

---

### FASE 3: Migração Arquivos (Cópia + Rename)
**Branch:** `organize/backoffice-fase3-migration`
**Duração:** 10 min | **Risco:** Baixo

```bash
1. [ ] BACKUP: git stash (backup segurança)
2. [ ] COPIAR habilidades-topicos-v2.* → pages/01-habilidades-topicos/
       - habilidades-topicos-v2.html → index.html
       - habilidades-topicos-v2.js → script.js
       - habilidades-topicos-v2.css → styles.css
3. [ ] COPIAR criar-questao-quiz.* → pages/02-criar-questao-quiz/
       - criar-questao-quiz.html → index.html
       - criar-questao-quiz.js → script.js
       - criar-questao-quiz-new.css → styles.css
4. [ ] COPIAR banco-questoes-revisao.* → pages/03-banco-questoes-revisao/
       - banco-questoes-revisao.html → index.html
       - banco-questoes-revisao-FUNCIONANDO.js → script.js
       - banco-questoes-revisao.css → styles.css
5. [ ] Commit: "chore: migrar páginas para estrutura modular"
6. [ ] Verify: 3 pastas com 3 arquivos cada = 9 arquivos novos
```

---

### FASE 4: Ajuste Paths (CRÍTICA ⚠️)
**Branch:** `organize/backoffice-fase4-paths`
**Duração:** 20 min | **Risco:** ALTO

```bash
1. [ ] ABRIR CADA PÁGINA no editor:
       - pages/01-habilidades-topicos/index.html
       - pages/02-criar-questao-quiz/index.html
       - pages/03-banco-questoes-revisao/index.html

2. [ ] PROCURAR por <link rel="stylesheet" href=
       ANTES: ../../../../assets/styles/basis.css
       DEPOIS: ../../assets/styles/basis.css
       
3. [ ] PROCURAR por <script src=
       Atualizar paths para: ../../assets/ (2 níveis acima)

4. [ ] PROCURAR por <img src="assets/
       Deixar como está (relativo funciona: pages/01/../../../assets = raiz/assets)

5. [ ] SALVAR cada página

6. [ ] TESTAR em navegador:
       python -m http.server 8080
       - http://localhost:8080/Back-office/.../pages/01-habilidades-topicos/
       - Abrir DevTools → Console: ZERO 404s
       - CSS carrega (página estilizada)
       - Ícones renderizam
       - JS não da erro

7. [ ] Commit: "fix: ajustar caminhos relativos após reorganização"
```

**⚠️ CRITICAL:** Testar CADA página isoladamente. Se vir 404 de asset, rollback FASE 4.

---

### FASE 5: Validação Funcional
**Branch:** `organize/backoffice-fase5-validation`
**Duração:** 15 min | **Risco:** Médio

```bash
1. [ ] SERVIDOR: python -m http.server 8080

2. [ ] PÁGINA 01 (Habilidades):
       - [ ] Carrega sem 404s
       - [ ] Sidebar visível
       - [ ] Menu items renderizam
       - [ ] Tópicos carregam

3. [ ] PÁGINA 02 (Criar Questão):
       - [ ] Carrega sem 404s
       - [ ] Formulário visível
       - [ ] Botão "Gerar" funciona
       - [ ] Toast aparece (localStorage salvado)

4. [ ] PÁGINA 03 (Banco Questões):
       - [ ] Carrega sem 404s
       - [ ] Stats-bar renderiza (Quiz: 15, IA: 5, Humano: 10)
       - [ ] Toast **PERSISTE** da navegação anterior
       - [ ] Tabela com filtros renderiza

5. [ ] NAVEGAÇÃO ENTRE PÁGINAS:
       - [ ] Adicionar links em index.html (próxima fase)
       - Testar cliques: 01 → 02 → 03

6. [ ] CONSOLE:
       - [ ] Zero 404s
       - [ ] Zero erros de JS

7. [ ] Commit: "test: validar funcionalidade após reorganização"
```

---

### FASE 6: Hub Navegação (Documentation)
**Branch:** `organize/backoffice-fase6-hub`
**Duração:** 10 min | **Risco:** Baixo

```bash
1. [ ] CRIAR: Back-office/Gerador.../index.html com links para 3 páginas
2. [ ] CRIAR: Back-office/Gerador.../README.md com instruções
3. [ ] CRIAR: Back-office/Gerador.../docs/ARQUITETURA.md (estrutura explicada)
4. [ ] Commit: "feat: adicionar hub navegação e documentação"
5. [ ] Test: http://localhost:8080/Back-office/.../index.html → links OK
```

---

### FASE 7: Front-office Reorganização
**Branch:** `organize/frontoffice-fase7`
**Duração:** 5 min | **Risco:** Baixo

```bash
1. [ ] RENOMEAR: Front-office/Adicionar... → Front-office/modal-aprovacao-banco/
2. [ ] MOVER: demo-interativo.html → index.html
3. [ ] CRIAR: Front-office/assets/styles/ com shared CSS
4. [ ] CRIAR: Front-office/README.md
5. [ ] Commit: "chore: reorganizar front-office padrão"
```

---

### FASE 8: Merge Final & Publicação
**Branch:** `organize/final-merge`
**Duração:** 10 min | **Risco:** Médio

```bash
1. [ ] RODAR VALIDAÇÃO FINAL:
       python scripts/validate-migration.py .
       → Esperado: 70%+ redução em linhas

2. [ ] RODAR HEALTH CHECK:
       npm run health
       → Esperado: 73.1% mantido ou melhorado

3. [ ] RODAR TESTES:
       npm run test (se aplicável)

4. [ ] MERGE com main:
       git merge --no-ff organize/final-merge
       git push origin main

5. [ ] TAG:
       git tag -a v2.0-reorganizacao -m "Reorganização completa 4 pilares"
       git push origin v2.0-reorganizacao

6. [ ] Documentar em CHANGELOG.md
```

---

## 5. CHECKLISTS POR FASE

### Pre-Flight (Antes de começar)
```
✅ Branch atual: main
✅ Commit d086080 estável
✅ npm run health = 73.1%
✅ Servidor Python não rodando (para evitar cache)
✅ Snapshot baseline criado
✅ Rollback strategy documentada
```

### Pós-FASE 4 (Paths - CRÍTICA)
```
🔍 FASE 4 Testing Checklist:

[ ] pages/01-habilidades-topicos/index.html
    [ ] Carrega sem erro
    [ ] DevTools Console: zero 404s
    [ ] CSS carrega (cor roxo visible)
    [ ] Ícones renderizam
    [ ] Texto legível

[ ] pages/02-criar-questao-quiz/index.html
    [ ] Carrega sem erro
    [ ] Console: zero 404s
    [ ] Formulário renderizado
    [ ] Buttons visuais

[ ] pages/03-banco-questoes-revisao/index.html
    [ ] Carrega sem erro
    [ ] Console: zero 404s
    [ ] Stats-bar visible com badges
    [ ] Tabela renderizada
```

### Pós-FASE 5 (Validação)
```
✅ Funcionalidade:
[ ] Toast dispara em 02
[ ] Toast persiste em 03
[ ] Stats-bar renderiza correto
[ ] Sidebar em todas as 3 páginas
[ ] Sem 404s em console
[ ] Sem erros JS
```

### Pós-FASE 6 (Hub)
```
✅ Navegação:
[ ] index.html tem 3 links
[ ] Cada link vai para página correta
[ ] Back button volta
[ ] Breadcrumb (se houver) funciona
```

---

## 6. ROLLBACK STRATEGY

### Quick Rollback (Qualquer Fase)
```bash
# Opção 1: Reset para último commit bom
git reset --hard d086080
git branch -D organize/*

# Opção 2: Revert apenas fase problemática
git revert <commit-da-fase>

# Opção 3: Deletar branch e voltar main
git checkout main
git reset --hard origin/main
git branch -D organize/<fase-problemática>
```

### Checklist Rollback
```
[ ] Confirmar volta para d086080
[ ] npm run health = 73.1%
[ ] index.html funciona GitHub Pages
[ ] Back-office funciona (3 páginas)
[ ] Toast funciona
[ ] Stats-bar funciona
```

---

## 7. TIMELINE & RISK MATRIX

| Fase | Descrição | Tempo | Risco | Rollback |
|------|-----------|-------|-------|----------|
| **0** | Consolidação Ambiente | 10 min | 🟡 Médio | 5 min |
| **1** | Snapshot Baseline | 5 min | 🟢 Zero | 1 min |
| **2** | Prep Estrutura | 5 min | 🟢 Baixo | 2 min |
| **3** | Migração Arquivos | 10 min | 🟢 Baixo | 3 min |
| **4** | **Ajuste Paths** | 20 min | 🔴 ALTO | 10 min |
| **5** | Validação Funcional | 15 min | 🟡 Médio | 2 min |
| **6** | Hub Navegação | 10 min | 🟢 Baixo | 2 min |
| **7** | Front-office | 5 min | 🟢 Baixo | 2 min |
| **8** | Merge Final | 10 min | 🟡 Médio | 5 min |
| **TOTAL** | **~90 min** | - | - | - |

### Risk Hotspots
1. **FASE 4 (Paths)** - Maior risco, precisa testar cada página
2. **FASE 5 (Validação)** - Testes manuais, precisão importante
3. **FASE 8 (Merge)** - Último ponto de reversão antes main

---

## 8. PRÓXIMAS DECISÕES

### 1. Ambiente Docs
- **Opção A (RECOMENDADO):** Consolidar em `docs/`, deletar raiz
- **Opção B:** Manter ambas (redundância controlada)

**Recomendação:** **Opção A** (limpeza sem perda).

### 2. Renomear Pasta Back-office
- Atualmente: `Back-office/Gerador de Questões por IA – BackOffice/`
- Proposto: `Back-office/banco-de-questoes/` ou manter?

### 3. v1 vs v2 (habilidades-topicos)
- Deletar `habilidades-topicos.html` após validação que v2 funciona?
- Manter como histórico?

### 4. CI/CD Integration
- Adicionar `validate-migration.py` ao npm run health?
- Automatizar validação de paths?

---

## 9. NOTAS CRÍTICAS

- ⚠️ **FASE 4 é crítica:** Paths relativos são #1 causa de 404s. Testar CADA página.
- 🔍 **Teste em navegador:** Não confie só em estrutura pastas, abra no http://
- 📝 **Commits pequenos:** Cada fase = 1 commit, fácil rollback
- 🔄 **Incremental:** Não faça tudo de uma vez
- 💾 **Backup:** Snapshot baseline ANTES de começar

---

## 10. PRÓXIMO PASSO

✅ **Sua aprovação esperada em:**
1. **Opção Consolidação Ambiente** (A ou B)?
2. **Cronograma** (começar quando)?
3. **Prioridades** (Back-office → Front-office ou simultâneo)?
