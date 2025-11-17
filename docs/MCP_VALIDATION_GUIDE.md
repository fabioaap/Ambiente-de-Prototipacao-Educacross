# Validação MCP/Figma - Guia de Uso

## 🎯 Visão Geral

Sistema automatizado de validação pixel-perfect que compara elementos HTML renderizados contra especificações do Figma via MCP (Model Context Protocol).

## 🚀 Quick Start

### Desenvolvimento Local

```powershell
# 1. Subir servidor estático (porta automática 8080-8090)
npm run serve:static

# 2. Abrir página no navegador (ajustar porta conforme log)
# http://localhost:8081/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/banco-questoes-pixel-perfect.html

# 3. Rodar validação MCP + gate
npm run mcp:validate
npm run mcp:gate
```

### CI/CD (GitHub Actions)

O workflow `.github/workflows/mcp-validate.yml` roda automaticamente em push/PR:
- Gera spec do Figma (ou usa mock se `FIGMA_TOKEN` ausente)
- Executa assertions em Chromium/Edge com DPR 1 e 2
- Falha o build se houver diffs ou erros

## 📁 Estrutura

```
validation/
  ├── mcp-figma.manifest.json       # Config de páginas/seletores/nodeIds
  └── figma.spec.generated.json     # Spec gerada do Figma (gitignored)

validation-artifacts/mcp/
  ├── structural-chromium-dpr1.json # Relatórios de assertions
  ├── structural-chromium-dpr2.json
  ├── structural-msedge-dpr1.json
  └── structural-msedge-dpr2.json

scripts/
  ├── mcp/
  │   ├── figma-client.cjs          # Extrai specs via Figma REST API
  │   └── assert-computed.cjs       # Compara getComputedStyle vs spec
  ├── mcp-figma-validate.cjs        # Orquestrador (spec + assertions)
  ├── mcp-check-reports.cjs         # Gate de CI (falha se diffs)
  └── serve-static.cjs              # Servidor HTTP para testes
```

## ⚙️ Configuração

### 1. Manifest (`validation/mcp-figma.manifest.json`)

```json
{
  "baseURL": "http://localhost:8080",
  "browsers": ["chromium", "msedge"],
  "deviceScaleFactors": [1, 2],
  "pages": [{
    "id": "backoffice-banco-questoes",
    "path": "/Back-office/.../banco-questoes-pixel-perfect.html",
    "viewport": { "width": 1280, "height": 900 },
    "selectors": {
      "page-title": "[data-role=page-title]",
      "tabs": "[data-role=tabs]",
      "stats-bar": "[data-role=stats-bar]"
    },
    "figma": {
      "fileId": "REPLACE_ME_FILE_ID",
      "nodeIds": {
        "page-title": "10021:53614",
        "tabs": "10021:53621",
        "stats-bar": "10021:53628"
      }
    }
  }]
}
```

### 2. Figma Real (Opcional)

Exporte `FIGMA_TOKEN` (Personal Access Token) e preencha `figma.fileId`:

```powershell
$env:FIGMA_TOKEN = "figd_SEU_TOKEN_AQUI"
# edite validation/mcp-figma.manifest.json: "fileId": "abc123xyz"
npm run mcp:validate
```

**GitHub Actions:** adicione secret `FIGMA_TOKEN` e descomente no workflow.

### 3. Seletores Estáveis

Elementos-chave têm `data-role` para validação robusta:

```html
<h1 class="page-title" data-role="page-title">Banco de Questões</h1>
<div class="tabs" data-role="tabs">...</div>
<div class="stats-bar" data-role="stats-bar">...</div>
```

## 🧪 Scripts NPM

| Script | Descrição |
|--------|-----------|
| `serve:static` | Servidor estático (porta 8080-8090) |
| `mcp:spec` | Gera spec do Figma |
| `mcp:assert` | Roda assertions em Chromium DPR=1 |
| `mcp:validate` | Orquestrador completo (spec + assertions multi-browser) |
| `mcp:gate` | Falha se relatórios tiverem diffs/erros |

## 🔍 Propriedades Validadas

- **Cores:** `background-color`, `color`, `border-bottom-color` (tolerância: match exato em hex/rgba)
- **Dimensões:** `width`, `height`, `padding-*`, `gap`, `border-radius` (tolerância: 1px)
- **Tipografia:** `font-family` (includes), `font-size`, `font-weight`, `line-height` (1px)
- **Efeitos:** `box-shadow` (includes), `border-*-style` (exact match)

## 📊 Relatórios

Cada execução gera JSON em `validation-artifacts/mcp/structural-{browser}-dpr{n}.json`:

```json
{
  "url": "http://localhost:8080/...",
  "dpr": 1,
  "browser": "chromium",
  "itens": [
    {
      "chave": "page-title",
      "seletor": "[data-role=page-title]",
      "esperado": { "color": "#7367f0", "font-weight": 500 },
      "obtido": { "color": "rgb(115, 103, 240)", "font-weight": "500" },
      "diffs": {}
    }
  ]
}
```

`diffs` vazio = sem problemas. `erro: "elemento_nao_encontrado"` = seletor inválido.

## 🛠️ Troubleshooting

### Porta ocupada
Servidor automático tenta 8080-8090. Se falhar, mate processo na 8080:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
```

### Fonte não carrega
Adicione `body { font-family: 'Montserrat', sans-serif; }` no HTML. Se Google Fonts falhar, embuta fontes localmente.

### Falsos positivos
Ajuste tolerâncias em `scripts/mcp/assert-computed.cjs` (linha ~40):
```javascript
const tol = 2; // px (aumentar para 2px se necessário)
```

### Edge não instalado
Workflow CI ignora Edge se indisponível. Local: instale Edge ou remova `msedge` de `manifest.browsers`.

## 🎨 Design System

Baseado em Vuexy:
- Primary: `#7367f0`
- Success: `#28c76f`
- Danger: `#ea5455`
- Text: `#6e6b7b`
- Heading: `#5e5873`

## 📝 Convenções

- **Idioma:** 100% pt-BR (código, docs, commits)
- **Commits:** Conventional Commits (`feat(mcp): adicionar gate de CI`)
- **ADRs:** Decisões arquiteturais em `docs/adr/`

## 🚦 Status

- ✅ Servidor estático com fallback de porta
- ✅ Seletores `data-role` estáveis
- ✅ Comparação de bordas (`border-bottom-*`)
- ✅ Gate de CI (falha se diffs)
- ✅ Workflow GitHub Actions
- ⏳ Figma real (requer `FIGMA_TOKEN` e `fileId`)

## 🔗 Referências

- ADR-0006: Unified Prototyping Platform
- ADR-0007: Vanilla JS para Front/Back-office
- `docs/DAILY_OPERATIONS.md`: Workflows por role
- `docs/journeys/02-admin-backoffice.md`: Jornada do Admin
