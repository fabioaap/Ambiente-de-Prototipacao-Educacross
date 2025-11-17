# 09 — Figma-First Design System (OBRIGATÓRIO)

## 🎯 Princípio Fundamental

**FIGMA É A FONTE DE VERDADE ABSOLUTA**

Todo código UI (HTML, CSS, React, Vue) DEVE ser extraído e validado contra o Figma usando o servidor MCP Figma. Nenhuma tela pode ser implementada sem validação pixel-perfect.

---

## 🔧 AUTO-RECUPERAÇÃO DO MCP FIGMA (EXECUTAR ANTES DE TUDO)

**ANTES de qualquer extração de design, o agente DEVE verificar e garantir que o MCP Figma está ativo.**

### **Protocolo de Auto-Recuperação (4 Etapas)**

#### **Etapa 1: Verificar Status do MCP Figma**
```typescript
// Tentar chamar ferramenta simples para testar conectividade
try {
  const result = await mcp_figma_get_metadata({ nodeId: "" });
  // Se retornar sem erro "Tool is currently disabled", MCP está ativo
  console.log("✅ MCP Figma ativo");
} catch (error) {
  if (error.includes("Tool is currently disabled")) {
    console.log("⚠️ MCP Figma desabilitado - iniciando recuperação");
    // Prosseguir para Etapa 2
  }
}
```

#### **Etapa 2: Tentar Reativar MCP Figma Automaticamente**
```powershell
# Verificar se servidor MCP está rodando (Windows)
$mcpProcess = Get-Process | Where-Object { $_.ProcessName -like "*figma*" -or $_.CommandLine -like "*mcp*figma*" }

if ($mcpProcess) {
  Write-Host "✅ Processo MCP Figma encontrado (PID: $($mcpProcess.Id))"
  # MCP está rodando mas desabilitado no VS Code
  # Tentar recarregar extensão ou reiniciar VS Code
} else {
  Write-Host "⚠️ Processo MCP Figma não encontrado - tentando iniciar"
  # Tentar iniciar servidor MCP Figma
  # (comando depende da configuração local do usuário)
}
```

#### **Etapa 3: Solicitar Intervenção Humana (Se Falhar)**
```markdown
🚨 **MCP Figma não pôde ser reativado automaticamente**

**Ações necessárias:**
1. Abrir VS Code Settings (Ctrl+,)
2. Pesquisar "mcp figma"
3. Verificar se extensão/servidor está habilitado
4. Se necessário, recarregar VS Code (Ctrl+Shift+P → "Reload Window")
5. Verificar se aplicativo Figma Desktop está aberto

**Após reativação, execute novamente o workflow.**
```

#### **Etapa 4: Fallback para Node.js Scripts (Se MCP Indisponível)**
```bash
# Se MCP Figma não puder ser reativado, usar Figma REST API
node scripts/sync-figma-design.cjs \
  --file-id="SEU_FILE_ID" \
  --node-id="10021:53486" \
  --output="extracted-design.json"

# Extrair tokens e assets via REST API
node scripts/download-figma-assets.cjs \
  --file-id="SEU_FILE_ID" \
  --node-ids="10021:53499,10021:53500" \
  --output-dir="assets/"
```

### **⚠️ REGRA CRÍTICA: NUNCA PROSSEGUIR SEM FIGMA**

- ❌ **NÃO codificar** sem extrair specs do Figma
- ❌ **NÃO usar** placeholders ou valores inventados
- ❌ **NÃO assumir** que MCP está ativo sem verificar

- ✅ **SEMPRE verificar** status do MCP antes de extrações
- ✅ **SEMPRE tentar** auto-recuperação antes de pedir ajuda humana
- ✅ **SEMPRE usar** fallback (Node.js scripts) se MCP indisponível

---

## ⚠️ WORKFLOW OBRIGATÓRIO (NÃO NEGOCIÁVEL)

### **ANTES de codificar qualquer interface:**

1. **Selecionar o frame no Figma** (usuário deve abrir o arquivo e selecionar)
2. **Extrair especificações com MCP Figma:**
   ```
   mcp_figma_get_design_context
   ```
3. **Extrair tokens de design:**
   ```
   - Cores (backgrounds, borders, text)
   - Tipografia (fonts, sizes, weights, line-heights)
   - Espaçamentos (padding, margin, gap)
   - Efeitos (shadows, blur)
   ```
4. **Baixar assets (SVGs, PNGs):**
   ```
   mcp_figma_get_screenshot (para referência visual)
   ```

### **DURANTE a codificação:**

5. **Usar APENAS valores extraídos do Figma:**
   ```css
   /* ❌ PROIBIDO - valores hardcoded */
   background: #7367f0;
   padding: 12px 16px;
   gap: 16px;
   
   /* ✅ CORRETO - valores do Figma com comentário da origem */
   background: #7367f0;        /* Figma token: stats-bar-bg */
   padding: 12px 16px;         /* Figma token: stats-bar-padding */
   gap: 16px;                  /* Figma token: stats-bar-gap */
   ```

6. **Adicionar atributos data-role para elementos principais:**
   ```html
   <aside data-role="sidebar">
   <header data-role="header">
   <div data-role="stats-bar">
   ```

### **DEPOIS da codificação:**

7. **Validar com validators automáticos:**
   ```bash
   npm run validate:dual          # MCP + Pixel-Perfect + Gate
   npm run validate:fonts         # Google Fonts loading
   npm run validate:flexbox       # Layout positions
   npm run visual:baseline        # Screenshot baseline
   ```

8. **Comparar visualmente:**
   ```bash
   npm run visual:compare         # Pixel diff < 0.1%
   ```

9. **Corrigir divergências até 100% conformidade**

---

## 🚫 ERROS CRÍTICOS (FAILURE MODES)

### **1. Codificar sem extrair specs do Figma**
**Consequência:** Divergências de cor, espaçamento, tipografia  
**Solução:** SEMPRE usar `mcp_figma_get_design_context` ANTES de escrever código

### **2. Usar valores hardcoded sem validar**
**Consequência:** Drift entre design e código ao longo do tempo  
**Solução:** Comentar origem de cada valor (`/* Figma: stats-bar-bg */`)

### **3. Não validar após implementação**
**Consequência:** Bugs visuais não detectados chegam em produção  
**Solução:** CI/CD DEVE bloquear merge se validação falhar

### **4. SVGs/assets apontando para localhost:3845**
**Consequência:** Logo quebrada, assets não carregam  
**Solução:** Baixar assets localmente com script `sync-figma-design.cjs`

### **5. Ignorar divergências "pequenas" (1-2px)**
**Consequência:** Acumulação de dívida técnica visual  
**Solução:** 100% conformidade ou documentar divergência com justificativa

---

## 📋 CHECKLIST PRÉ-COMMIT (OBRIGATÓRIO)

Toda tela/componente UI DEVE passar por:

- [ ] Frame selecionado no Figma
- [ ] `mcp_figma_get_design_context` executado
- [ ] Tokens de design extraídos e documentados
- [ ] Assets (SVGs/PNGs) baixados localmente
- [ ] Código usa APENAS valores do Figma
- [ ] `npm run validate:dual` → ✅ PASSED
- [ ] `npm run validate:fonts` → ✅ PASSED (se usar Google Fonts)
- [ ] `npm run validate:flexbox` → ✅ PASSED (se usar flexbox)
- [ ] `npm run visual:compare` → ✅ < 0.1% diff
- [ ] Divergências documentadas (se houver)

---

## 🛠️ FERRAMENTAS DISPONÍVEIS

### **Extração de Design (MCP Figma)**
```javascript
// 1. Obter contexto completo do frame selecionado
mcp_figma_get_design_context({
  nodeId: "10021:53486",  // Extrair da URL ou usar frame selecionado
  clientLanguages: "html,css,javascript",
  clientFrameworks: "vanilla"
})

// 2. Obter screenshot para referência
mcp_figma_get_screenshot({
  nodeId: "10021:53486"
})

// 3. Extrair variables/tokens
mcp_figma_get_variable_defs({
  nodeId: "10021:53486"
})
```

### **Validação Automática**
```bash
# Validação estrutural completa
npm run validate:dual

# Validação de fontes
npm run validate:fonts

# Validação de layout flexbox
npm run validate:flexbox

# Visual regression testing
npm run visual:baseline        # Criar baseline
npm run visual:compare         # Comparar com baseline
npm run visual:update          # Atualizar baseline
```

### **Scripts de Sincronização (Futuro)**
```bash
# Sincronizar tokens do Figma
npm run figma:sync-tokens

# Baixar assets do Figma
npm run figma:download-assets

# Extrair auto-layout
npm run figma:extract-autolayout
```

---

## 📊 MÉTRICAS DE CONFORMIDADE

### **Targets de Qualidade:**
- **Estrutural:** 100% elementos presentes (MCP Validator)
- **Visual:** < 0.1% pixel diff (Visual Regression)
- **CSS:** 100% propriedades conformes ±2 RGB (Pixel-Perfect Validator)
- **Fontes:** 100% fontes carregadas, 0% fallback
- **Layout:** 0 diffs de gap/alignment (Flexbox Validator)

### **Reporte de Divergências:**
```markdown
## Divergências Encontradas

### 1. Stats Bar Background
- **Figma:** `#7367f0` (sólido)
- **HTML:** `rgba(115, 103, 240, 0.12)` (transparente)
- **Justificativa:** [OBRIGATÓRIO - explicar por que divergiu]
- **Aprovado por:** [Nome do designer]
- **Data:** 14/nov/2025
```

---

## 🎓 EXEMPLOS

### **✅ CORRETO - Workflow completo:**

```javascript
// 1. Extrair specs do Figma
const specs = await mcp_figma_get_design_context({
  nodeId: "10021:53486",
  clientLanguages: "html,css"
});

// 2. Usar valores extraídos
const css = `
  .stats-bar {
    background: ${specs.tokens['stats-bar-bg']};      /* #7367f0 */
    padding: ${specs.tokens['stats-bar-padding']};    /* 12px 16px */
    gap: ${specs.tokens['stats-bar-gap']};            /* 16px */
    border-radius: ${specs.tokens['stats-bar-radius']}; /* 6px */
  }
`;

// 3. Validar após implementação
await runValidator('validate:dual');
// ✅ PASSED - 100% conformidade
```

### **❌ ERRADO - Valores hardcoded:**

```css
/* PROIBIDO - origem desconhecida */
.stats-bar {
  background: rgba(115, 103, 240, 0.12);  /* ❌ De onde veio 0.12? */
  padding: 0 20px;                        /* ❌ Por que 0 vertical? */
  gap: 65px;                              /* ❌ 65px não existe no Figma! */
}
```

---

## 🔄 PROCESSO DE ATUALIZAÇÃO DE DESIGN

### **Quando o Figma mudar:**

1. Designer atualiza Figma
2. CI/CD detecta mudança (via webhook ou daily sync)
3. Script `sync-figma-design.cjs` re-extrai tokens
4. Git diff mostra alterações em CSS variables
5. Dev revisa e aprova mudanças
6. CI/CD re-valida todas as telas afetadas
7. Se passar, merge automático. Se falhar, issue criada.

---

## 🚨 CI/CD GATE (BLOQUEIO OBRIGATÓRIO)

```yaml
# .github/workflows/validate-design.yml
name: Figma Design Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate against Figma
        run: |
          npm run validate:dual
          npm run validate:fonts
          npm run validate:flexbox
          npm run visual:compare
      
      - name: Block merge if failed
        if: failure()
        run: |
          echo "❌ DESIGN VALIDATION FAILED"
          echo "Divergências detectadas entre Figma e código"
          echo "Consulte validation-artifacts/ para detalhes"
          exit 1
```

---

## 📚 REFERÊNCIAS

- **MCP Figma Tools:** `mcp_figma_get_design_context`, `mcp_figma_get_screenshot`, `mcp_figma_get_variable_defs`
- **Validators:** `scripts/mcp-validator.cjs`, `scripts/pixel-perfect-validator.cjs`, `scripts/dual-validator.cjs`
- **Docs:** `docs/STORYBOOK_GUIDE.md`, `docs/DAILY_OPERATIONS.md`

---

## ⚖️ EXCEÇÕES PERMITIDAS

Divergências são permitidas APENAS se:

1. **Documentadas** em comentário próximo ao código
2. **Justificadas** tecnicamente (ex: limitação do browser)
3. **Aprovadas** pelo designer
4. **Adicionadas** ao arquivo `design-exceptions.md`

```css
/* EXCEÇÃO APROVADA: Stats bar usa transparência para evitar
   conflito com background dinâmico. Aprovado por [Designer] em 14/nov/2025.
   Ticket: #1234 */
.stats-bar {
  background: rgba(115, 103, 240, 0.12);  /* Figma: #7367f0 (sólido) */
}
```

---

## 🎯 RESULTADO ESPERADO

**100% das telas em produção são pixel-perfect com o Figma.**

Qualquer divergência não documentada é considerada BUG crítico e deve ser corrigida imediatamente.
