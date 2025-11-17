# P1-003: Validators Não Comparam com Figma Source

## 📋 Descrição
Os validadores pixel-perfect estão comparando HTML implementado com snapshots HTML antigos ao invés de usar o Figma como source of truth, gerando falsos positivos e perdendo a referência de design original.

## 🎯 Objetivo
Refatorar validadores para usar dados extraídos diretamente do Figma via MCP (`mcp_figma_get_design_context`) como baseline, eliminando snapshots HTML como intermediários.

## 💡 Contexto
O pipeline atual de validação compara HTML vs HTML (snapshot), mas deveria comparar HTML vs Figma (design source). Isso causa:
- Falsos positivos quando HTML snapshot está desatualizado
- Perda de sincronização com design real
- Dificuldade em detectar divergências reais do design

## 📊 Impacto
- **Severidade:** High
- **Bloqueio:** Partial (validação manual ainda funciona)
- **Esforço Estimado:** 1.0h
- **Prioridade:** P1
- **Recorrências:** 3x (primeira: 13/11, última: 14/11)

## 🔧 Solução Proposta
Integrar extração Figma diretamente no pipeline de validação.

### Passos para Implementação
1. **Refatorar `dual-validate.cjs`:**
   - Adicionar chamada a `mcp_figma_get_design_context` no início
   - Extrair computed styles do Figma (não do HTML)
   - Usar Figma data como baseline obrigatório
   - HTML snapshot como fallback apenas

2. **Adicionar Diff Visual:**
   - Screenshot do Figma via `GET /v1/images`
   - Screenshot do browser via Playwright
   - Comparação pixel-by-pixel com pixelmatch
   - Threshold: 0.1% de diferença aceitável

3. **Eliminar HTML Snapshots:**
   - Remover dependência de snapshots em `validation/`
   - Usar cache de Figma data (validade: 24h)
   - Atualizar documentação do processo

4. **Pipeline Novo:**
   ```
   Figma API → Design Context → Validador → HTML Browser
        ↓            ↓              ↓            ↓
   Screenshot    Computed      Compare      Screenshot
                 Styles
   ```

## ✅ Critérios de Aceitação
- [ ] `dual-validate.cjs` usa `mcp_figma_get_design_context` como source
- [ ] Figma data como baseline primário (não HTML snapshot)
- [ ] Diff visual implementado (Figma screenshot vs browser)
- [ ] Threshold configurável (default: 0.1%)
- [ ] Cache de Figma data (validade: 24h, auto-refresh)
- [ ] Zero falsos positivos em 3 testes consecutivos
- [ ] Documentação atualizada (MCP_VALIDATION_GUIDE.md)
- [ ] HTML snapshots removidos de `validation/`

## 🚨 Workaround Atual
Validação manual via MCP sempre que houver dúvida:

```bash
# Validação manual via MCP
node scripts/dual-validate.cjs
# Sempre verificar com mcp_figma_get_design_context manualmente
```

**Processo Manual:**
1. Executar `dual-validate.cjs`
2. Se houver divergência suspeita, executar:
   ```bash
   node scripts/mcp/get-design-context.cjs --node-id="123:456"
   ```
3. Comparar manualmente com resultado do validador
4. Decidir se é false positive ou divergência real

## 📎 Arquivos Afetados
- `scripts/dual-validate.cjs` (refatorar - adicionar MCP integration)
- `scripts/mcp/get-design-context.cjs` (já existe - melhorar)
- `scripts/visual-regression.cjs` (integrar Figma screenshots)
- `scripts/mcp/figma-screenshot.cjs` (criar novo)
- `validation/` (remover HTML snapshots antigos)
- `docs/MCP_VALIDATION_GUIDE.md` (atualizar processo)

## 🏷️ Tags
`validation` `figma` `false-positive` `mcp` `pixel-perfect` `p1` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P1-003, linha 78-98)
- **MCP Guide:** `docs/MCP_VALIDATION_GUIDE.md`
- **Dual Validator:** `scripts/dual-validate.cjs`
- **Sprint 3 Doc:** `docs/SPRINT3-I1-DUAL-VALIDATOR.md`

## 📝 Notas Adicionais
**Integração MCP no Dual Validator:**
```javascript
// scripts/dual-validate.cjs (refatorado)
async function validarComFigmaSource(nodeId) {
  // 1. Extrair design do Figma (source of truth)
  const figmaContext = await mcp_figma_get_design_context(nodeId);
  
  // 2. Capturar screenshot Figma
  const figmaScreenshot = await getFigmaScreenshot(nodeId);
  
  // 3. Navegar e capturar browser
  await page.goto(localUrl);
  const browserScreenshot = await page.screenshot();
  
  // 4. Comparar estilos computados
  const stylesDiff = compareStyles(figmaContext.styles, browserStyles);
  
  // 5. Comparar visual (pixel-by-pixel)
  const visualDiff = pixelmatch(figmaScreenshot, browserScreenshot, threshold);
  
  return {
    stylesDiff,
    visualDiff,
    passed: stylesDiff.length === 0 && visualDiff < threshold
  };
}
```

**Cache de Figma Data:**
```javascript
// Cache com expiração 24h
const cache = {
  get(nodeId) {
    const cached = this.data[nodeId];
    if (cached && Date.now() - cached.timestamp < 86400000) {
      return cached.data;
    }
    return null;
  },
  set(nodeId, data) {
    this.data[nodeId] = { data, timestamp: Date.now() };
  }
};
```

**Figma Screenshot API:**
```javascript
// GET /v1/images/:file_id?ids=:node_ids&format=png&scale=2
async function getFigmaScreenshot(nodeId) {
  const response = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png&scale=2`,
    { headers: { 'X-Figma-Token': token } }
  );
  const { images } = await response.json();
  return downloadImage(images[nodeId]);
}
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Última Atualização:** 17/11/2025  
**Categoria:** Technical Debt P1  
**Status:** 📋 BACKLOG
