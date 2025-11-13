# 🚀 Guia Rápido: Validação Estrutural Pixel-Perfect

## TL;DR

```bash
# 1. Extrair tokens do Figma + validar HTML
npm run pixel:validate-all

# 2. Ver relatório
cat pixel-perfect-validation-report.json
```

**Exit Code:**
- `0` = ✅ Pixel-perfect (100% conformidade)
- `1` = ❌ Desvios críticos (bloqueia CI)

---

## 📖 Uso Detalhado

### 1. Extrair Tokens do Figma

```bash
npm run pixel:extract-tokens
# ou
node scripts/figma-tokens-extractor.cjs --node-id=<FIGMA_NODE_ID>
```

**Output:** `figma-tokens.json` com cores, dimensões, espaçamentos

**Nota:** Atualmente usa **mock data**. Em produção, conectar ao Figma MCP real.

---

### 2. Validar HTML

```bash
npm run pixel:validate-structure
# ou
node scripts/validate-pixel-perfect.cjs \
  --html="<CAMINHO_HTML>" \
  --tokens=figma-tokens.json \
  --threshold=1
```

**Parâmetros:**
- `--html`: Caminho do arquivo HTML com CSS inline
- `--tokens`: Caminho do JSON com tokens Figma
- `--threshold`: Tolerância em pixels (default: 1px)

**Output Console:**
```
📊 RESULTADO DA VALIDAÇÃO
========================
✅ Conformidade: 100.0% (11/11)
🔴 Críticos: 0
⚠️  Avisos: 0

✅ VALIDAÇÃO PASSOU!
```

**Output Arquivo:** `pixel-perfect-validation-report.json`
```json
{
  "total": 11,
  "matched": 11,
  "deviations": [],
  "critical": [],
  "warnings": []
}
```

---

### 3. Integrar no CI/CD

#### GitHub Actions

```yaml
name: Validação Pixel-Perfect

on: [pull_request]

jobs:
  pixel-perfect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install deps
        run: npm ci
      
      - name: Validação Estrutural
        run: npm run pixel:validate-all
        continue-on-error: false  # Bloqueia merge se falhar
      
      - name: Upload relatório
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: pixel-perfect-report
          path: pixel-perfect-validation-report.json
```

#### Pre-commit Hook (opcional)

```bash
# .husky/pre-commit
npm run pixel:validate-structure || {
  echo "❌ Pixel-perfect validation failed!"
  echo "   Run 'npm run pixel:validate-all' to see details"
  exit 1
}
```

---

## 🎯 Adicionar Nova Tela

### Passo 1: Adicionar Mapeamento

Editar `scripts/validate-pixel-perfect.cjs`:

```javascript
const SELECTOR_TO_TOKEN_MAP = {
  // Tela existente
  '.sidebar': { ... },
  
  // Nova tela: Painel de Administração
  '.admin-panel': {
    tokenPrefix: 'admin-panel',
    properties: {
      'width': 'admin-panel-width',
      'background': 'admin-panel-bg',
      'padding-top': 'admin-panel-padding-top',
      // ...
    }
  }
};
```

### Passo 2: Adicionar Tokens no Extractor (mock)

Editar `scripts/figma-tokens-extractor.cjs`:

```javascript
const mockFigmaData = {
  // ... existing
  
  // Novo node
  'admin-panel': {
    type: 'FRAME',
    name: 'Admin Panel',
    fills: [{ color: { r: 0.16, g: 0.19, b: 0.27, a: 1 } }],  // #283046
    width: 800,
    padding: { top: 24, right: 24, bottom: 24, left: 24 }
  }
};
```

### Passo 3: Validar

```bash
npm run pixel:validate-all
```

---

## 🐛 Troubleshooting

### Erro: "Arquivo HTML não encontrado"

**Causa:** Caminho com caracteres especiais (acentos, – vs –)

**Solução:** Usar caminho absoluto ou relative path sem espaços:
```bash
# Windows PowerShell
$htmlPath = (Get-ChildItem -Path "Back-office" -Recurse -Filter "*.html")[0].FullName
node scripts/validate-pixel-perfect.cjs --html="$htmlPath" --tokens=figma-tokens.json
```

### Erro: "0/0 propriedades validadas"

**Causa:** Seletores CSS não mapeados ou tokens não encontrados

**Debug:**
1. Verificar seletores no HTML: `grep 'class=' <HTML>`
2. Verificar tokens: `cat figma-tokens.json`
3. Verificar mapeamento: abrir `scripts/validate-pixel-perfect.cjs` e conferir `SELECTOR_TO_TOKEN_MAP`

### Falsos Negativos: "Desvios críticos" quando CSS está correto

**Causa:** Comentários CSS ou shorthands não expandidos

**Solução:** O parser já remove comentários e expande `padding`. Se problema persistir, verificar:
- Border shorthand: `border: 1px solid #color` (extrair apenas cor)
- Margin shorthand: adicionar lógica similar ao padding

---

## 📊 Interpretando Resultados

### ✅ 100% Conformidade
```
✅ Conformidade: 100.0% (11/11)
🔴 Críticos: 0
⚠️  Avisos: 0
```
→ Todas as propriedades CSS correspondem aos tokens Figma. **Pronto para produção.**

### ⚠️ Avisos (Não-Críticos)
```
⚠️  AVISOS: 2
1. .breadcrumb → gap
   CSS:   10px
   Figma: 8px
```
→ Diferenças em espaçamentos menores. **Revisar se intencional** (ex: ajuste para legibilidade).

### ❌ Desvios Críticos
```
🔴 CRÍTICOS: 2
1. .sidebar → width
   CSS:   260px
   Figma: 265px
   Diff:  5px
```
→ Diferenças em dimensões, cores ou borders estruturais. **Corrigir antes de merge.**

---

## 🔧 Configuração Avançada

### Ajustar Threshold

```bash
# Tolerância de ±2px (para telas responsivas)
node scripts/validate-pixel-perfect.cjs --threshold=2 ...
```

### Validar Múltiplos HTMLs

```bash
# Loop em PowerShell
Get-ChildItem -Path "Back-office" -Recurse -Filter "*.html" | ForEach-Object {
  Write-Host "Validando: $($_.Name)"
  node scripts/validate-pixel-perfect.cjs --html=$_.FullName --tokens=figma-tokens.json
}
```

### Skip Extração (usar tokens existentes)

```bash
# Apenas validar (sem re-extrair)
npm run pixel:validate-structure
```

---

## 📚 Referências

- [PoC Completo](docs/POC-VALIDACAO-ESTRUTURAL-FIGMA-MCP.md)
- [EPIC Pixel-Perfect](docs/backlog/EPIC-pixel-perfect-garantia-backoffice.md)
- [README Pixel-Perfect](packages/templates/README-PIXEL-PERFECT.md)

---

**Dúvidas?** Consultar `docs/POC-VALIDACAO-ESTRUTURAL-FIGMA-MCP.md` para detalhes arquiteturais.
