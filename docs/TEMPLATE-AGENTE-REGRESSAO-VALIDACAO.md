# 🔍 Template: Validação + Limpeza - Branch `copilot/reorganize-project-structure`

**Status:** 🟡 EM PROGRESSO - Validação + Limpeza estrutural  
**Branch:** `copilot/reorganize-project-structure`  
**Tarefas:** 2 principais (Validação de regressões + Limpeza de arquivos não utilizados)  
**Prioridade:** ALTA  
**Token Budget:** ~20K para execução completa  
**Tempo Estimado:** 45 minutos total

---

## 1️⃣ Diagnóstico Rápido (DevOps SOS)

### 🎯 Problema Principal
> As páginas no branch reorganizado "não estão com o mesmo comportamento da main"

### 📊 Regressões Identificadas (10 total)

#### 🔴 CRÍTICAS (Bloqueadores):
1. **localStorage & Toast** - Redirect duplo impede saving de 'toastPendente'
2. **Navegação Inter-Página** - Path "banco-questoes-revisao.html" → 404 (deveria ser "../03-banco-questoes-revisao/")
3. **Função Gerar Race Condition** - Timing conflict entre redirect imediato + setTimeout

#### 🟠 ALTAS (Graves):
4. **CSS Paths** - Verificar se "../../../../assets/styles/" é exatamente 4 níveis
5. **Script Imports** - common.js import/export pode falhar com module loading
6. **Menu Functionality** - Click handlers de menu items podem estar quebrados
7. **Filter Functionality** - Table filters podem não responder
8. **Visual Styling** - Colors, fonts, layout podem divergir
9. **Stats-bar Rendering** - Badges podem não mostrar (Quiz: 15, IA: 5, Humano: 10)
10. **Icon Loading** - SVG/imagens podem retornar 404

### 🧹 Limpeza Estrutural (22 arquivos não utilizados)

#### Arquivos para Remover - CATEGORIA 1: Setup (8 arquivos)
- instalar-powershell7.bat
- instalar-powershell7.ps1
- INSTRUCOES-INSTALACAO-POWERSHELL.md
- abrir-prototipo.ps1
- criar-estrutura-ambiente.ps1
- organizar-ambiente.bat
- start-prototipo.cjs
- start-prototipo.js

#### Arquivos para Remover - CATEGORIA 2: Documentação Obsoleta (8 arquivos)
- AMBIENTE-README.md
- GETTING_STARTED.md
- JORNADA-ENTREGAVEIS.md
- JORNADA-RESUMO-VISUAL.md
- README_VALIDACAO_UNIVERSAL.md
- README_VALIDATOR_OPTIMIZED.md
- SUMARIO-AMBIENTE.md
- Sobre_o_Ambiente_de_prototipação_Educacross.html

#### Arquivos para Remover - CATEGORIA 3: Protótipos e Artifacts (6 arquivos)
- enviar_missoes_em_lote_html_com_drawer_assistente_v5.1.html
- universal_validator_optimized.py
- universal_validation_report.json
- dual-validation-report.json
- pixel-perfect-validation-report.json
- pixel-perfect.manifest.json

---

## 2️⃣ Plano de Ação Executável

### ✅ Fase 0: Backup (Segurança)
```bash
# Criar branch de backup ANTES de qualquer mudança
git checkout -b backup/pre-cleanup-2025-11-18
git push origin backup/pre-cleanup-2025-11-18

# Voltar para branch de trabalho
git checkout copilot/reorganize-project-structure
git status  # Confirmar "nothing to commit, working tree clean"
```

### ✅ Fase 2: Setup Validação
```bash
# 1. Verificar branches
git branch -a
git status  # Confirmar "nothing to commit, working tree clean"

# 2. Garantir que está na branch reorganizada
git checkout copilot/reorganize-project-structure
git log --oneline -3

# 3. Iniciar servidor HTTP local
python -m http.server 8080
# Nota: Abrir em novo terminal; URL será http://localhost:8080
```

### 🔍 Fase 3: Path Validation (CRÍTICA)

**Objetivo:** Verificar se todos os caminhos apontam para arquivos corretos

#### Teste 2.1: Página 01 (Habilidades/Tópicos)
```bash
# URL: http://localhost:8080/Back-office/Gerador%20de%20Ques%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/01-habilidades-topicos/

# DevTools Actions:
# 1. Abrir F12 → Network tab
# 2. Recarregar página (F5)
# 3. Procurar por 404 errors em:
#    - basis.css (deve ser ✅)
#    - common.css (deve ser ✅)
#    - styles.css (deve ser ✅)
#    - SVG icons (deve ser ✅)
# 4. Se houver 404: Verificar caminho relativo em HTML
```

**Checklist:**
- [ ] Nenhum 404 em CSS files
- [ ] Nenhum 404 em SVG/images
- [ ] Página carrega visualmente completa
- [ ] Status do console: 0 errors

#### Teste 2.2: Página 02 (Criar Questão)
```bash
# URL: http://localhost:8080/Back-office/Gerador%20de%20Ques%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/02-criar-questao-quiz/

# DevTools Actions:
# 1. F12 → Network tab
# 2. Recarregar página
# 3. Procurar por 404 errors (mesmo protocolo que 2.1)
# 4. ESPECIAL: Verificar caminho de imagens
#    - Procurar por "Group 10000.png" ou similar
#    - Se 404: Editar HTML e adicionar ../../ se necessário
```

**Checklist:**
- [ ] Nenhum 404 em CSS files
- [ ] Nenhum 404 em imagens/icons
- [ ] Formulário renderiza completo
- [ ] Botão "Gerar" está visível
- [ ] Status do console: 0 errors

#### Teste 2.3: Página 03 (Revisão/Aprovação)
```bash
# URL: http://localhost:8080/Back-office/Gerador%20de%20Ques%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/03-banco-questoes-revisao/

# DevTools Actions: (mesmo protocolo que 2.1 e 2.2)
```

**Checklist:**
- [ ] Nenhum 404 em CSS files
- [ ] Nenhum 404 em images
- [ ] Stats-bar renderiza com badges
- [ ] Table com dados/filtros renderiza
- [ ] Status do console: 0 errors

---

### 🎨 Fase 4: Visual Validation

**Objetivo:** Verificar se styling e layout correspondem ao main

#### Teste 3.1: Colors & Styling
```bash
# Na página 01, abrir F12 → Console e executar:
const computedStyle = window.getComputedStyle(document.querySelector('[data-role="sidebar"]'));
console.log('Sidebar color:', computedStyle.backgroundColor);
// Esperado: rgb(115, 103, 239) ou similiar (#7367ef)

# Verificar em página 03:
const statsBar = document.querySelector('[data-role="stats-bar"]');
console.log('Stats bar found:', !!statsBar);
console.log('Stats bar content:', statsBar?.textContent);
// Esperado: Conter "Quiz", "IA", "Humano" com números
```

**Checklist:**
- [ ] Sidebar roxo (#7367ef) está correto
- [ ] Botões com cores corretas (primary, success, danger)
- [ ] Badges com background colors corretas
- [ ] Fonts Montserrat carregando (não Arial/Verdana)
- [ ] Spacing/padding condiz com main

#### Teste 3.2: Layout Responsiveness
```bash
# 1. F12 → Device toolbar (Ctrl+Shift+M)
# 2. Testar em:
#    - Desktop (1920x1080)
#    - Tablet (768x1024)
#    - Mobile (375x667)
# 3. Verificar:
#    - Sidebar colapsável? (mesmo que main)
#    - Menu items visíveis?
#    - Forms readáveis?
#    - Table scrollável?
```

**Checklist:**
- [ ] Desktop layout: idêntico ao main
- [ ] Tablet layout: idêntico ao main
- [ ] Mobile layout: idêntico ao main
- [ ] Sem overflow ou cut-off de elementos

---

### ⚙️ Fase 5: Functional Validation (CRÍTICA)

**Objetivo:** Testar fluxo localStorage + redirect + toast (o coração do sistema)

#### Teste 4.1: localStorage Persistence (Page 02 → Page 03)
```bash
# Na página 02, abrir F12 → Console e executar:

# PASSO 1: Limpar localStorage (reset)
localStorage.clear();
console.log('localStorage cleared');

# PASSO 2: Preencher formulário com dados fictícios
# (Via UI: preencher campos do formulário manualmente)

# PASSO 3: Clicar em "Gerar" button
# (Observar Network tab para ver redirect)

# PASSO 4: Se redirecionou para Page 03, verificar localStorage
console.log('toastPendente:', localStorage.getItem('toastPendente'));
// Esperado: Não deve ser null/undefined
// Deve conter JSON com tipo "success" e mensagem

# PASSO 5: Observar se toast aparece no canto inferior direito
# (Deve aparecer após page load em Page 03)
```

**Checklist:**
- [ ] localStorage.getItem('toastPendente') não é null após "Gerar"
- [ ] Page 03 carrega sem 404 (redirect funcionou)
- [ ] Toast aparece com mensagem correta (bottom-right)
- [ ] Toast desaparece após 3 segundos (auto-dismiss)
- [ ] localStorage['toastPendente'] removido após consumo

#### Teste 4.2: Stats-bar Display (Page 03)
```bash
# Na página 03, abrir F12 → Console:

# PASSO 1: Verificar se stats-bar existe
const statsBar = document.querySelector('[data-role="stats-bar"]');
console.log('Stats bar exists:', !!statsBar);
console.log('Stats bar HTML:', statsBar?.outerHTML.substring(0, 200));

# PASSO 2: Verificar badges (esperado: Quiz: 15, IA: 5, Humano: 10)
const badges = document.querySelectorAll('[data-role="stats-bar"] .badge');
console.log('Number of badges:', badges.length);
badges.forEach((badge, i) => {
  console.log(`Badge ${i}:`, badge.textContent);
});
// Esperado: 3 badges com números
```

**Checklist:**
- [ ] stats-bar element existe no DOM
- [ ] 3 badges renderizando
- [ ] Valores exatos: "15", "5", "10" (ou similares conforme dados)
- [ ] Badges com background colors corretas
- [ ] Montserrat Bold font applied

#### Teste 4.3: Menu & Filter Functionality
```bash
# Na página 01, abrir F12 → Console:

# PASSO 1: Testar menu click
const menuItems = document.querySelectorAll('[data-role="menu"] a, nav a');
console.log('Menu items found:', menuItems.length);
// Esperado: > 0

# PASSO 2: Simular click em um menu item
if (menuItems.length > 0) {
  menuItems[0].click();
  console.log('Menu item clicked');
}
// Observar se página muda ou accordions expandem

# Na página 03, testar filtros:
# PASSO 3: Clicar em filter dropdown/button
const filterButtons = document.querySelectorAll('[data-role="filter"], .filter-btn');
console.log('Filter buttons found:', filterButtons.length);
if (filterButtons.length > 0) {
  filterButtons[0].click();
  console.log('Filter clicked');
}
// Observar se table filtra ou dropdown abre
```

**Checklist:**
- [ ] Menu items são clicáveis (click event funciona)
- [ ] Navegação entre items funciona
- [ ] Filter buttons respondem a clicks
- [ ] Table dados mudam ao filtrar
- [ ] Nenhum TypeError ou ReferenceError no console

---

### 🔧 Fase 6: Console Error Validation

**Objetivo:** Identificar qualquer erro JavaScript que possa quebrar funcionalidade

#### Teste 5.1: Error Scanning
```bash
# Para cada página (01, 02, 03):

# 1. Abrir F12 → Console
# 2. Recarregar página (F5)
# 3. Procurar por:

# ❌ Erros de tipo:
# - SyntaxError
# - ReferenceError (variável não definida)
# - TypeError (property/function não existe)
# - 404 Not Found (recursos não carregados)

# ✅ Se encontrar erro, executar:
console.log('Error location:', error.stack);
# Copiar stack trace para debugging

# 4. Verificar se há setTimeout/setInterval errors:
console.log('Pending timeouts:', window.setTimeout.toString());
```

**Checklist:**
- [ ] Page 01: Console limpo (0 erros JavaScript)
- [ ] Page 02: Console limpo (0 erros JavaScript)
- [ ] Page 03: Console limpo (0 erros JavaScript)
- [ ] Nenhum 404 em Network tab
- [ ] Nenhum CORS errors

---

### 🔀 Fase 7: Comparative Validation (side-by-side com main)

**Objetivo:** Comparar comportamento direto entre reorganized branch e main

#### Teste 6.1: Setup Comparação
```bash
# Terminal 1: Branch atual (copilot/reorganize-project-structure)
python -m http.server 8080
# Acessar http://localhost:8080/Back-office/...

# Terminal 2: Clone temporário de main
git clone --branch main --depth 1 /url/to/repo temp-main
cd temp-main
python -m http.server 8081
# Acessar http://localhost:8081/Back-office/...

# Agora você tem:
# - reorganized branch em PORT 8080
# - main branch em PORT 8081
```

#### Teste 6.2: Side-by-side Comparison
```bash
# Abrir 2 browsers ou 2 tabs:
# Tab 1: http://localhost:8080/...pages/02-criar-questao-quiz/
# Tab 2: http://localhost:8081/...criar-questao-quiz.html

# Comparar:
# 1. Visual (cores, fonts, layout)
# 2. Funcionalidade (form submission, redirect)
# 3. Console errors (deve ser idêntico: 0 erros em ambos)
# 4. localStorage flow (deve trabalhar idêntico)
```

**Checklist:**
- [ ] Visual layout idêntico (main ≈ reorganized)
- [ ] Colors/fonts match (main ≈ reorganized)
- [ ] Funcionalidade idêntica (main ≈ reorganized)
- [ ] Console errors idênticos (main: 0, reorganized: 0)
- [ ] localStorage flow idêntico em ambas

---

## 8️⃣ Limpeza Estrutural (Fase 8)

### ✅ Pré-requisitos
```bash
# Certificar que validação passou
echo "✅ Todas as 7 fases de validação devem ter passado antes de fazer limpeza"

# Verificar status
git status  # Deve ser "nothing to commit" antes de continuar
```

### 🗑️ Fase 8a: Remover Arquivos Setup (Categoria 1)

**Localização:** Raiz do projeto

```bash
git rm instalar-powershell7.bat
git rm instalar-powershell7.ps1
git rm INSTRUCOES-INSTALACAO-POWERSHELL.md
git rm abrir-prototipo.ps1
git rm criar-estrutura-ambiente.ps1
git rm organizar-ambiente.bat
git rm start-prototipo.cjs
git rm start-prototipo.js

echo "✅ 8 arquivos de setup removidos"
```

### 🗑️ Fase 8b: Remover Documentação Obsoleta (Categoria 2)

**Razão:** Duplicam informações em `docs/` ou são de iterações antigas

```bash
git rm AMBIENTE-README.md
git rm GETTING_STARTED.md
git rm JORNADA-ENTREGAVEIS.md
git rm JORNADA-RESUMO-VISUAL.md
git rm README_VALIDACAO_UNIVERSAL.md
git rm README_VALIDATOR_OPTIMIZED.md
git rm SUMARIO-AMBIENTE.md
git rm 'Sobre_o_Ambiente_de_prototipação_Educacross.html'

echo "✅ 8 documentações obsoletas removidas"
```

### 🗑️ Fase 8c: Remover Protótipos e Artifacts (Categoria 3)

```bash
git rm 'enviar_missoes_em_lote_html_com_drawer_assistente_v5.1.html'
git rm universal_validator_optimized.py
git rm universal_validation_report.json
git rm dual-validation-report.json
git rm pixel-perfect-validation-report.json
git rm pixel-perfect.manifest.json

echo "✅ 6 protótipos antigos e artifacts removidos"
```

### 📦 Fase 8d: Mover Demo Validator para Scripts

**Razão:** Organizar scripts em `scripts/` em vez de raiz

```bash
# Mover arquivo
mkdir -p scripts  # Garantir pasta existe
mv demo_universal_validator.py scripts/demo-validator.py
git add scripts/demo-validator.py
git rm demo_universal_validator.py

echo "✅ Demo validator movido para scripts/"
```

### 🔒 Fase 8e: Atualizar .gitignore

**Adicionar ao final do arquivo ``.gitignore`:**

```bash
cat >> .gitignore << 'EOF'

# ============================================
# Validation artifacts (gerados automaticamente)
# ============================================
*-validation-report.json
*-manifest.json
validation-artifacts/
test-results/
*.log
EOF

git add .gitignore

echo "✅ .gitignore atualizado para ignorar artifacts"
```

### ✅ Fase 8f: Verificar Estrutura

**Antes de commitar, verificar que nenhuma referência foi quebrada:**

```bash
# Procurar por referências aos arquivos removidos
echo "🔍 Verificando referências aos arquivos removidos..."

grep -r "instalar-powershell" docs/ scripts/ apps/ src/ 2>/dev/null || echo "✅ Sem referências"
grep -r "universal_validator_optimized" .github/ docs/ 2>/dev/null || echo "✅ Sem referências"
grep -r "JORNADA-ENTREGAVEIS" . 2>/dev/null || echo "✅ Sem referências"

# Testar build
npm run build 2>&1 | tail -20 || echo "⚠️ Verificar build manualmente"

echo "✅ Verificações de integridade concluídas"
```

### 📊 Fase 8g: Commit de Limpeza

```bash
git commit -m "chore(cleanup): remover arquivos obsoletos e consolidar estrutura

🗑️ Removidas 22 arquivos não utilizados:
  • 8 scripts de setup one-time (instalar-powershell, criar-estrutura)
  • 8 documentações duplicadas/obsoletas
  • 1 protótipo antigo (enviar_missoes_em_lote_v5.1.html)
  • 1 validador duplicado (universal_validator_optimized.py)
  • 4 relatórios gerados (artifacts json)

📦 Reorganizado:
  • demo_universal_validator.py → scripts/demo-validator.py
  • .gitignore atualizado para ignorar artifacts

📈 Resultado:
  • ~22 arquivos removidos do raiz
  • Estrutura mais clara e navegável
  • Redução de ~20% de arquivos no raiz"

echo "✅ Commit de limpeza concluído"
```

### 🚀 Fase 8h: Push e Status Final

```bash
git push origin copilot/reorganize-project-structure

echo "✅ Limpeza estrutural completa e enviada!"
```

**Resumo de Resultado:**
```
Antes: ~90 arquivos no raiz (confuso)
Depois: ~68 arquivos no raiz (organizado)
Redução: ~22 arquivos (~22% mais limpo)

✅ Branch pronta para referência de organização
```

---

## 9️⃣ Problemas Esperados & Soluções

### ❌ Problema: "banco-questoes-revisao.html" 404
**Localização:** `pages/02-criar-questao-quiz/script.js` (linha ~150)

**Current:**
```javascript
window.location.href = "banco-questoes-revisao.html";
```

**Fix:**
```javascript
window.location.href = "../03-banco-questoes-revisao/";
// ou
window.location.href = "../03-banco-questoes-revisao/index.html";
```

**Validar:** 
```bash
# Após fix, testar navegação em browser
# Deve ir de Page 02 → Page 03 sem 404
```

---

### ❌ Problema: "../../../../assets/styles/basis.css" 404
**Localização:** `pages/02-criar-questao-quiz/index.html` (linha ~14)

**Current:**
```html
<link rel="stylesheet" href="../../../../assets/styles/basis.css">
```

**Diagnóstico (console):**
```bash
# Contar níveis:
# pages/ (level 1)
# 02-criar-questao-quiz/ (level 2)
# up (level 3)
# Gerador de Questões.../ (level 4)
# up (level 5)
# Back-office/ (level 6)
# up (level 7)
# ROOT (level 8)

# ❌ ERRADO: 4 níveis (../../../../) para 8 níveis reais
# ✅ CORRETO: 6-7 níveis necessários
```

**Possível Fix:**
```html
<!-- Se está 4 níveis, provavelmente está errado. Tentar: -->
<link rel="stylesheet" href="../../assets/styles/basis.css">
<!-- Ou debugar com: -->
<link rel="stylesheet" href="" onerror="console.error('CSS path wrong')">
```

**Validar:**
```bash
# F12 → Network → procurar basis.css
# Status deve ser 200 (não 404)
```

---

### ❌ Problema: localStorage não persiste / Toast não aparece
**Localização:** `pages/02-criar-questao-quiz/script.js` + `pages/03-banco-questoes-revisao/script.js`

**Current (suspeito):**
```javascript
// Page 02
localStorage.setItem('toastPendente', JSON.stringify({...}));
setTimeout(() => { /* alguma coisa */ }, 1000);
window.location.href = "..."; // REDIRECT IMEDIATO
```

**Problema:** Redirect imediato pode impedir:
1. localStorage.setItem ser persistido (race condition)
2. setTimeout ser executado

**Fix Option 1 - Usar await:**
```javascript
// Page 02
localStorage.setItem('toastPendente', JSON.stringify({...}));
// Garantir que localStorage foi salvo antes de redirect
setTimeout(() => {
  window.location.href = "../03-banco-questoes-revisao/";
}, 500); // Dar tempo para localStorage ser persistido
```

**Fix Option 2 - Remover redirect duplo:**
```javascript
// Page 02
localStorage.setItem('toastPendente', JSON.stringify({...}));
// Se há dois places fazendo redirect, remover um deles
window.location.href = "../03-banco-questoes-revisao/";
```

**Page 03 - Consumir localStorage:**
```javascript
// Page 03 - No page load
(function() {
  const toastData = localStorage.getItem('toastPendente');
  if (toastData) {
    const data = JSON.parse(toastData);
    showToast(data); // Sua função
    localStorage.removeItem('toastPendente'); // Consumir
  }
})();
```

**Validar:**
```bash
# F12 → Application tab → Local Storage
# Após clicar "Gerar" em Page 02:
# 1. Verificar se 'toastPendente' aparece
# 2. Verificar se contém JSON válido
# 3. Ir para Page 03
# 4. Verificar se toast apareceu (bottom-right, 3s)
# 5. Verificar se 'toastPendente' foi removido após toast
```

---

### ❌ Problema: common.js imports/exports falham
**Localização:** `pages/*/script.js` quando importa de `../../common.js`

**Diagnóstico:**
```bash
# F12 → Console, procurar:
# ReferenceError: showToast is not defined
# TypeError: Object is not a function
```

**Current:**
```javascript
// pages/02/script.js
import { showToast, inicializarSwitch } from '../../common.js';
// ❌ Pode falhar se path wrong ou common.js não existe naquele local
```

**Fix:**
```javascript
// pages/02/script.js
import { showToast, inicializarSwitch } from '../../common.js';
// ✅ Verificar se ../../ aponta para raiz Back-office/Gerador.../common.js

// Ou usar script tag se não quer module:
// <script src="../../common.js"></script>
// <script src="script.js"></script> (sem type="module")
```

**Validar:**
```bash
# F12 → Network → procurar common.js
# Status deve ser 200
# F12 → Console → não deve ter ReferenceError
```

---

## 4️⃣ Relatório Final

### ✅ Se Todos os Testes de Validação + Limpeza Passarem:
```bash
# Após passar todas as 8 fases
git log --oneline -5  # Verificar commits

# Status final
git status  # Deve ser "nothing to commit, working tree clean"

# Push final
git push origin copilot/reorganize-project-structure

echo "✅ BRANCH PRONTA!"
echo "   • 7 fases de validação: PASSADAS ✅"
echo "   • 1 fase de limpeza: COMPLETA ✅"
echo "   • 22 arquivos obsoletos removidos"
echo "   • Estrutura reorganizada e limpa"
```

### ❌ Se Qualquer Teste Falhar:
```bash
# 1. Documentar qual teste falhou
# 2. Copiar erro/screenshot
# 3. Usar seção "Problemas Esperados" para identificar causa raiz
# 4. Fazer fix:
git add <arquivo-fixado>
git commit -m "fix(regressao): corrigir [descrição do problema]"
git push origin copilot/reorganize-project-structure

# 5. Re-executar teste específico
# 6. Se passar: continuar com próximas fases
```

---

## 10️⃣ Checklist Executivo

### Validação (Fases 1-7)
- [ ] **Fase 2:** Setup validação - servidor HTTP + git status ✅
- [ ] **Fase 3:** Path validation - nenhum 404 em todas 3 páginas ✅
- [ ] **Fase 4:** Visual validation - colors, fonts, layout OK ✅
- [ ] **Fase 5:** Functional validation - localStorage→redirect→toast flow ✅
- [ ] **Fase 6:** Console error validation - 0 erros JavaScript ✅
- [ ] **Fase 7:** Comparative validation - side-by-side vs main OK ✅

### Limpeza (Fase 8)
- [ ] **Fase 8a:** Backup criada (branch backup/pre-cleanup-2025-11-18) ✅
- [ ] **Fase 8b:** 8 arquivos setup removidos (instalar-powershell, etc) ✅
- [ ] **Fase 8c:** 8 documentações obsoletas removidas ✅
- [ ] **Fase 8d:** 6 protótipos e artifacts removidos ✅
- [ ] **Fase 8e:** Demo validator movido para scripts/ ✅
- [ ] **Fase 8f:** .gitignore atualizado ✅
- [ ] **Fase 8g:** Verificação de integridade (grep + build test) ✅
- [ ] **Fase 8h:** Commit + push finalizado ✅

### Status Final
- [ ] **Branch Pronta:** Estrutura reorganizada + limpa
- [ ] **Sem Regressões:** Todas páginas comportam identicamente ao main
- [ ] **Console Limpo:** 0 erros JavaScript em todas fases
- [ ] **22 arquivos removidos:** Raiz mais limpo (~22% redução)
- [ ] **Ready for Reference:** Branch como repositório de organização

---

## 📝 Template para Enviar ao Agente

```markdown
# DevOps Task: Validação + Limpeza Estrutural

**Branch:** copilot/reorganize-project-structure  
**Objetivo:** 2 tarefas integradas:
  1. Validar reorganização (sem regressões vs main)
  2. Limpar 22 arquivos não utilizados

**Tipo:** Regression Testing + Structural Cleanup  
**Tempo Estimado:** 45 minutos
**Risco:** BAIXO

## Instruções - Execução em Sequência

### PARTE 1: Validação (Fases 0-7 do template)
1. Fase 0: Criar backup branch
2. Fase 2: Setup validação
3. Fase 3: Path validation (3 páginas)
4. Fase 4: Visual validation (colors/fonts/layout)
5. Fase 5: Functional validation (localStorage→toast flow)
6. Fase 6: Console error validation (0 erros)
7. Fase 7: Comparative validation (side-by-side vs main)

**Saída esperada:** Todas 7 fases PASSANDO ✅

### PARTE 2: Limpeza (Fase 8 do template)
1. Fase 8a: Verificar backup criada
2. Fase 8b: Remover 8 arquivos setup
3. Fase 8c: Remover 8 documentações obsoletas
4. Fase 8d: Remover 6 protótipos/artifacts
5. Fase 8e: Mover demo validator para scripts/
6. Fase 8f: Atualizar .gitignore
7. Fase 8g: Verificar integridade (grep + build)
8. Fase 8h: Commit + push

**Saída esperada:** 22 arquivos removidos, branch limpa ✅

## Resultado Final

✅ Todas 3 páginas funcionam sem regressões  
✅ localStorage→redirect→toast flow completo  
✅ Console sem erros em todas fases  
✅ Visual consistente  
✅ 22 arquivos obsoletos removidos  
✅ Branch pronta como referência de organização

## Rollback Plan

Se algo der errado:
```bash
git reset --hard backup/pre-cleanup-2025-11-18
```
```

---

**Criado em:** 18 de novembro de 2025  
**Versão:** 1.0  
**Status:** 🟢 Pronto para envio ao agente GitHub
