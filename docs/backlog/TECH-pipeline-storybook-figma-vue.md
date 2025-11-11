# 📋 [BACKLOG] Pipeline Storybook→Figma→Vue.js

**Tipo:** Epic  
**Prioridade:** P2 — Alta  
**Status:** Proposta (não iniciado)  
**Estimativa:** 46h (~3 sprints)  
**Labels:** `#handoff` `#design-dev` `#automation` `#storybook` `#figma` `#vue`

---

## 🎯 Resumo Executivo

Automatizar fluxo de handoff entre prototipagem HTML e implementação Vue.js via captura DOM→SVG, Storybook toolbar e Builder.io plugin.

**Ganho esperado:** Reduzir tempo de 2-3h → 15-30min por componente (6x mais rápido)

---

## 📝 Problema a Resolver

Workflow manual atual:
1. Designer tira screenshots do protótipo HTML
2. Reconstrói manualmente no Figma
3. Dev recebe specs e implementa Vue.js do zero
4. Perda de fidelidade visual entre protótipo → Figma → código

**Custo:** ~2-3h por componente  
**Dor:** Retrabalho, inconsistências, fricção design-dev

---

## 💡 Solução Proposta

### Pipeline automatizado em 4 etapas

```
[1] Protótipo HTML/CSS/JS vanilla
      ↓
[2] Script DOM→SVG (captura automática)
      ↓
[3] Storybook (documentação + botões)
      ├─→ 📋 Copiar SVG → Figma (manual)
      └─→ 💻 Copiar Código Vue.js (template)
      ↓
[4] Builder.io Plugin (Figma→Vue.js avançado)
```

### Componentes principais

1. **Script de Captura (`capture-journey.js`)**
   - Usa Playwright + `dom-to-svg`
   - Captura múltiplos estados da jornada
   - Gera MDX automaticamente

2. **Addon Storybook (Toolbar)**
   - Botão "📋 Copiar SVG"
   - Botão "💻 Copiar Código Vue.js"
   - Comunicação manager↔preview via channel

3. **Documentação Workflow**
   - Guia: HTML → SVG → Figma → Builder.io → Vue.js
   - Troubleshooting (fontes, sombras, etc.)
   - Configurações Builder.io recomendadas

---

## 🎯 Histórias de Usuário

### HU1: Designer copia protótipo para Figma
```gherkin
Como designer
Quero copiar SVG do protótipo direto do Storybook
Para reconstruir no Figma sem screenshots manuais

Critérios de aceite:
- Botão "📋 Copiar SVG" visível na toolbar do Storybook
- SVG contém fontes/imagens embutidas
- Ctrl+V no Figma funciona sem erros graves
```

### HU2: Dev gera código Vue.js básico
```gherkin
Como desenvolvedor
Quero copiar código Vue.js de um componente visual
Para acelerar implementação inicial

Critérios de aceite:
- Botão "💻 Copiar Código Vue" visível na toolbar
- Código gerado compila no Vite/Nuxt
- Comentários indicam que é código base
```

### HU3: Produto documenta jornada automaticamente
```gherkin
Como gestor de produto
Quero capturar estados de uma jornada automaticamente
Para documentar fluxos sem trabalho manual

Critérios de aceite:
- Script CLI aceita caminho do HTML e nome da jornada
- Gera SVGs de múltiplos estados
- Cria MDX com documentação estruturada
```

---

## 📋 Requisitos Técnicos

### Stack
- **Captura DOM:** `dom-to-svg` ^0.12.7
- **Automação:** Playwright ^1.40.0
- **Parsing HTML:** `jsdom` ^23.0.0
- **Addon:** `@storybook/manager-api` 8.5.x
- **Export Figma→Código:** Builder.io Plugin (cloud)

### Arquivos a criar
```
scripts/
  └── capture-journey.js              # Script CLI captura

.storybook/
  ├── preview-capture.ts              # Helpers DOM→SVG
  └── manager-handoff.tsx             # Addon toolbar

src/docs/
  ├── screenshots/[jornada]/          # SVGs gerados
  └── [jornada].mdx                   # Docs auto-geradas

docs/workflows/
  └── FIGMA-BUILDER-IO.md             # Guia completo
```

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP (Sprint 1 — ~6h)
**Objetivo:** Provar conceito com 1 protótipo

- [ ] Setup dependências (`dom-to-svg`, `playwright`)
- [ ] Script `capture-journey.js` (captura 1 estado)
- [ ] Addon Storybook (botão "Copiar SVG")
- [ ] Testar com modal de aprovação
- [ ] Documentação mínima (README)

**Milestone 1:** 🎯 MVP funcionando com 1 protótipo

---

### Fase 2: Produção (Sprint 2 — ~8h)
**Objetivo:** Generalizar para N protótipos + docs completa

- [ ] Captura de múltiplos estados (array de `states`)
- [ ] Geração automática de MDX
- [ ] Botão "Copiar Código Vue.js"
- [ ] Documentação `FIGMA-BUILDER-IO.md`
- [ ] Testar com 3 protótipos diferentes
- [ ] ADR `ADR-000X-pipeline-storybook-figma-vue.md`

**Milestone 2:** 🚀 Pipeline pronto para produção

---

### Fase 3: Otimizações (Sprint 3 — ~12h)
**Objetivo:** Experiência fluida + automação avançada

- [ ] Captura de variantes (hover, focus, error)
- [ ] Otimização SVG (SVGO — reduzir 30-50%)
- [ ] Integração CI/CD (GitHub Actions)
- [ ] Melhorar template Vue.js (props, emits)
- [ ] Dashboard de capturas (opcional)

**Milestone 3:** ⚡ Automação completa

---

### Fase 4: Evolução (Futuro — ~20h)
**Objetivo:** Sincronização bidirecional Figma↔Storybook

- [ ] API Builder.io (export direto)
- [ ] Plugin Figma customizado (componentes nativos)
- [ ] Versionamento de designs (Git LFS)
- [ ] Biblioteca Vue.js documentada

**Milestone 4:** 🌟 Sincronização total Design↔Dev

---

## ✅ Critérios de Aceite (DoD)

### Definition of Done
- [ ] Script `capture-journey.js` funciona com 3+ protótipos
- [ ] Addon Storybook exibe botões na toolbar
- [ ] SVG copiado cola no Figma sem erros graves
- [ ] Código Vue.js gerado compila sem erros
- [ ] Documentação `FIGMA-BUILDER-IO.md` completa
- [ ] Testado end-to-end (HTML → SVG → Figma → Builder.io → Vue.js)
- [ ] README atualizado com novo workflow
- [ ] ADR criado
- [ ] Checklist de PR completo

### Testes obrigatórios
- [ ] **Teste 1:** Capturar modal de aprovação (3 estados)
- [ ] **Teste 2:** Copiar SVG para Figma
- [ ] **Teste 3:** Copiar código Vue.js
- [ ] **Teste 4:** Builder.io export
- [ ] **Teste 5:** Fontes custom (embute ou documenta)

---

## 💰 Estimativa

### Tempo
- **Fase 1 (MVP):** 6h
- **Fase 2 (Produção):** 8h
- **Fase 3 (Otimizações):** 12h
- **Fase 4 (Evolução):** 20h
- **Total:** ~46h

### Custo
- **Desenvolvimento:** R$ 0 (interno)
- **Builder.io:** Grátis (plano Free até 3 projetos)
- **Ferramentas:** Open-source (grátis)

### ROI
**Antes:** ~2-3h por componente  
**Depois:** ~15-30min por componente  
**Economia:** ~6x mais rápido

**Break-even:** ~2 meses (10 componentes/mês)

---

## ⚠️ Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Fontes custom não embutem | Média | Médio | `inlineResources` + docs troubleshooting |
| Sombras CSS simplificam no Figma | Alta | Baixo | Documentar + ajuste manual |
| Builder.io muda pricing | Baixa | Alto | Plano B: plugin Figma custom |
| SVG muito grande (>5MB) | Baixa | Médio | SVGO otimização |
| Clipboard API bloqueada (HTTP) | Baixa | Alto | Documentar HTTPS obrigatório |

---

## 🎯 Métricas de Sucesso

### Quantitativas
- [ ] Redução de tempo: 2-3h → 15-30min (6x)
- [ ] Adoção: ≥70% dos novos componentes usam pipeline
- [ ] Fidelidade: ≥90% dos SVGs colam sem ajustes graves
- [ ] Satisfação: NPS ≥8/10 (designers)

### Qualitativas
- [ ] Menos fricção no handoff (relato designers)
- [ ] Código inicial mais próximo do design (relato devs)
- [ ] Consistência protótipo→produto (relato stakeholders)

---

## 📚 Referências

### Documentação oficial
- [Storybook Addon API](https://storybook.js.org/docs/8.5/addons/addon-types)
- [dom-to-svg GitHub](https://github.com/felixfbecker/dom-to-svg)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Builder.io Figma Plugin](https://www.builder.io/c/docs/import-from-figma)
- [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)

### Protótipos de referência (para testar)
- ✅ Modal de aprovação: `Front-office/.../demo-interativo.html`
- ⏳ Wizard de missões: (a definir)
- ⏳ Formulário de questão: `Back-office/.../criar-nova-questao.html`

---

## 📌 Decisões Técnicas

| O quê | Por quê | Alternativa descartada | Impacto |
|-------|---------|------------------------|---------|
| Builder.io vs plugin custom | Economia ~3 dias dev | Plugin Figma custom | +Velocidade |
| SVG vs PNG | Vetorial, editável | Screenshot PNG | +Qualidade |
| Storybook vs ferramenta custom | Infra existente | Dashboard custom | -Complexidade |
| dom-to-svg vs html2canvas | Melhor CSS handling | html2canvas | +Fidelidade |
| Captura manual vs automática | Designer controla states | Auto em cada render | +Controle |

---

## 🔄 Processo de Atualização

### Quando revisar
- Sprint planning de cada fase
- Após feedback de usuários
- Quando Builder.io atualizar
- A cada 3 meses (revisão roadmap)

### Owner
**Equipe de Produto/Engenharia**

### Última atualização
11/11/2024 — Documentação inicial da demanda

---

## 📎 Arquivos Relacionados

### A criar durante implementação
- `scripts/capture-journey.js`
- `.storybook/manager-handoff.tsx`
- `.storybook/preview-capture.ts`
- `docs/workflows/FIGMA-BUILDER-IO.md`
- `docs/adr/ADR-000X-pipeline-storybook-figma-vue.md`

### Dependências
- ✅ Storybook configurado
- ✅ Protótipos HTML existentes
- ⏳ Builder.io account (criar se necessário)

---

## 📝 Notas Adicionais

### Workflow detalhado

#### 1. Capturar jornada
```powershell
node scripts/capture-journey.js \
  --path="Front-office/Modal.html" \
  --name="modal-aprovacao"
```

#### 2. Copiar SVG (Storybook)
- Abrir story → Clicar "📋 Copiar SVG"
- Abrir Figma → `Ctrl+V`

#### 3. Gerar código Vue.js
**Opção A:** Botão Storybook (template básico)
**Opção B:** Builder.io plugin (código completo)

#### 4. Colar código no projeto
```vue
<!-- src/components/ModalAprovacao.vue -->
<template>
  <span v-html="svg" v-bind="$attrs" />
</template>

<script setup lang="ts">
const svg = `<svg>...</svg>`;
</script>
```

### Troubleshooting comum

**Fontes não aparecem no Figma:**
- Instalar fonte localmente antes de colar SVG
- Ou converter texto em paths (perde editabilidade)

**Sombras estranhas:**
- Figma simplifica `box-shadow` complexas
- Ajustar manualmente após importar

**SVG muito grande:**
- Otimizar com SVGO antes de colar
- Ou simplificar HTML (menos nesting)

---

## 🎯 Próximos Passos

1. **Priorizar em planning** quando houver capacidade de sprint
2. **Criar sub-tasks** no Jira/Linear para cada fase
3. **Estimar em planning poker** com o time
4. **Definir owner** técnico do Epic

---

_Demanda documentada automaticamente via Copilot em 11/11/2024_
