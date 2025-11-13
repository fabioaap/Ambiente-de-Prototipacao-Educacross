# Scripts de Validação Pixel-Perfect

Este diretório contém scripts para **validação estrutural** de protótipos HTML contra design tokens extraídos do Figma.

---

## 📁 Conteúdo

### `figma-tokens-extractor.cjs`
**Responsabilidade:** Extrair design tokens (cores, dimensões, espaçamentos) do Figma via MCP.

**Uso:**
```bash
node scripts/figma-tokens-extractor.cjs --node-id=<FIGMA_NODE_ID>
```

**Output:** `figma-tokens.json` (DTCG-compatible)

**Estado Atual:** **Mock data** (baseado em `packages/templates/README-PIXEL-PERFECT.md`). Em produção, conectar ao Figma MCP real.

**Funcionalidades:**
- ✅ Extrai fills/strokes → cores hex
- ✅ Extrai width/height/border-radius → dimensões
- ✅ Extrai padding/gap/margin → espaçamentos
- ✅ Normaliza rgba → hex (quando alpha=1)
- ✅ Suporta hierarquia de nodes

---

### `validate-pixel-perfect.cjs`
**Responsabilidade:** Parsear CSS inline de HTML, mapear seletores → tokens Figma, comparar valores e reportar desvios.

**Uso:**
```bash
node scripts/validate-pixel-perfect.cjs \
  --html="<CAMINHO_HTML>" \
  --tokens=figma-tokens.json \
  --threshold=1
```

**Output:**
- Console: Relatório de conformidade
- Arquivo: `pixel-perfect-validation-report.json`
- Exit Code: `0` (sucesso) ou `1` (falha)

**Funcionalidades:**
- ✅ Parser CSS inline (`<style>` blocks)
- ✅ Remove comentários CSS
- ✅ Expande shorthand `padding` (1, 2, 4 valores)
- ✅ Extrai cor de `border-bottom: 1px solid #color`
- ✅ Compara valores com threshold (default: ±1px)
- ✅ Classifica desvios: Críticos vs Avisos
- ✅ CI/CD gate (exit code)

**Mapeamento Seletores:**
```javascript
const SELECTOR_TO_TOKEN_MAP = {
  '.sidebar': {
    properties: {
      'width': 'menu-backoffice-width',
      'background': 'menu-backoffice-bg',
      'padding-top': 'menu-backoffice-padding-top',
      // ...
    }
  }
};
```

---

## 🚀 Workflow

```bash
# Pipeline completo
npm run pixel:validate-all

# Passos individuais
npm run pixel:extract-tokens     # 1. Figma → tokens JSON
npm run pixel:validate-structure # 2. HTML + tokens → validação
```

---

## 🧪 Testes

### Arquivo Pixel-Perfect (✅ 100% conformidade)
```bash
npm run pixel:validate-structure
# Output: ✅ Conformidade: 100.0% (11/11), exit code 0
```

### Arquivo com Desvios (❌ 69% conformidade)
```bash
node scripts/validate-pixel-perfect.cjs \
  --html=tests/pixel/test-com-desvios.html \
  --tokens=figma-tokens.json
# Output: 
# 🔴 Críticos: 2 (sidebar width 260px vs 265px, header border #ddd vs #e2e2e3)
# ⚠️  Avisos: 2 (breadcrumb gap 10px vs 8px)
# Exit code: 1
```

---

## 📚 Documentação Completa

- [PoC: Validação Estrutural Figma MCP](../docs/POC-VALIDACAO-ESTRUTURAL-FIGMA-MCP.md)
- [Guia Rápido de Uso](../docs/GUIA-RAPIDO-VALIDACAO-ESTRUTURAL.md)
- [EPIC: Garantia Pixel-Perfect](../docs/backlog/EPIC-pixel-perfect-garantia-backoffice.md)

---

## 🔮 Próximos Passos

1. **Integrar Figma MCP Real:** Substituir mock data por chamadas reais ao Figma API
2. **Expandir Mapeamento:** Adicionar todos os seletores do banco-questoes-pixel-perfect.html (`.tabs`, `.stats-bar`, `.badge`, etc.)
3. **Geração de Templates:** Script `generate-templates-from-figma.cjs` para criar HTML/CSS a partir de tokens
4. **Validação Bidirecional:** Figma → Templates → Validação (loop fechado)

---

**Nota:** Em caso de dúvidas ou problemas, consultar `docs/GUIA-RAPIDO-VALIDACAO-ESTRUTURAL.md` (seção Troubleshooting).
