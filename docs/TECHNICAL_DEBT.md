# Débito Técnico – Educacross Prototyping Platform

> **Atualização automática:** Este documento é regenerado diariamente às 2am via CI/CD  
> **Última atualização:** 2025-11-14 13:30:00 UTC  
> **Status:** 🟢 Saudável (78% auto-recovery, 3 P1, 7 P2)

---

## 📊 Resumo Executivo

| Métrica | Valor | Threshold | Status |
|---------|-------|-----------|--------|
| **P0 (Crítico)** | 0 | 0 | 🟢 OK |
| **P1 (Alto)** | 3 | 5 | 🟢 OK |
| **P2 (Médio)** | 7 | — | 🟡 Monitorar |
| **Esforço Total** | 2.5h | — | — |
| **Taxa de Auto-Recuperação** | 78% | 80% | 🟡 Próximo do target |

**Alert Policy:**
- ⚠️ **Weekly Alert** se P1 > 5
- 🚨 **Critical Alert** se P1 > 10 ou P0 > 0

---

## 🚨 P0 – Crítico (Ação Imediata)

*Nenhum item P0 no momento.*

---

## ⚠️ P1 – Alto (Workaround + Defer)

### P1-001: Consolidar diretórios duplicados no Back-office

**Impacto:** Confusão de caminhos ao salvar assets (SVG logos)  
**Recorrências:** 2x (primeira: 13/11, última: 14/11)  
**Esforço estimado:** 0.5h  

**Workaround atual:**
```powershell
# Copiar manualmente SVGs para ambos os diretórios
$srcDir = Get-ChildItem "Back-office" | Where-Object { $_.Name -like "*IA  BackOffice*" }
$dstDir = Get-ChildItem "Back-office" | Where-Object { $_.Name -like "*IA*BackOffice*" }
Copy-Item "$($srcDir.FullName)\assets\*.svg" "$($dstDir.FullName)\assets\" -Force
```

**Fix permanente:**
1. Renomear `Gerador de Questões por IA  BackOffice` (2 espaços) para `Gerador de Questões por IA – BackOffice` (travessão)
2. Atualizar refs em `package.json`, `index.html`, `validation/**`
3. Verificar links quebrados com `npm run validate`

**Tags:** `path-conflict` `assets` `backoffice`

---

### P1-002: MCP Figma auth intermitente

**Impacto:** Fallback para REST API (mais lento), requer verificação manual  
**Recorrências:** 5x (primeira: 10/11, última: 14/11)  
**Esforço estimado:** 1.0h  

**Workaround atual:**
```bash
# Executar antes de tarefas Figma
npm run mcp:check
# Se falhar, auto-recover:
npm run mcp:recover
```

**Fix permanente:**
1. Implementar token refresh automático em `check-mcp-figma.cjs`
2. Adicionar circuit breaker pattern (fallback após 3 falhas)
3. Health check a cada 5min em background (error-watcher.cjs)

**Tags:** `mcp` `figma` `auth`

---

### P1-003: Validators não comparam com Figma source

**Impacto:** Falsos positivos (HTML vs HTML snapshot ao invés de Figma source)  
**Recorrências:** 3x (primeira: 13/11, última: 14/11)  
**Esforço estimado:** 1.0h  

**Workaround atual:**
```bash
# Validação manual via MCP
node scripts/dual-validate.cjs
# Sempre verificar com mcp_figma_get_design_context manualmente
```

**Fix permanente:**
1. Refatorar `dual-validate.cjs` para usar `mcp_figma_get_design_context` como source of truth
2. Eliminar HTML snapshots como baseline
3. Adicionar diff visual (Figma screenshot vs browser screenshot)

**Tags:** `validation` `figma` `false-positive`

---

## 🟡 P2 – Médio (Technical Debt)

### P2-001: SVG logos com aspect ratio distorcido
**Esforço:** 0.25h | **Tags:** `svg` `visual` `aspect-ratio`  
**Fix:** Remover CSS fixo, usar `height: auto` para respeitar viewBox

### P2-002: Storybook sem integration tests
**Esforço:** 2.0h | **Tags:** `testing` `storybook` `automation`  
**Fix:** Implementar `@storybook/test-runner` com Playwright

### P2-003: Tokens DTCG não aplicados em componentes
**Esforço:** 1.5h | **Tags:** `design-system` `tokens` `dtcg`  
**Fix:** Pipeline: `tokens.json → Style Dictionary → CSS vars → componentes`

### P2-004: Protótipos sem validação TypeScript
**Esforço:** 0.5h | **Tags:** `typescript` `validation` `vanilla-js`  
**Fix:** Adicionar JSDoc + tsconfig.json para vanilla JS files

### P2-005: Falta CI/CD para GitHub Pages
**Esforço:** 1.0h | **Tags:** `ci-cd` `github-actions` `automation`  
**Fix:** GitHub Actions: `build → validate → deploy`

### P2-006: Mocks sem schema validation
**Esforço:** 0.75h | **Tags:** `mocks` `validation` `schema`  
**Fix:** JSON Schema + Ajv para validação completa

### P2-007: README desatualizado com estrutura antiga
**Esforço:** 0.5h | **Tags:** `documentation` `readme` `onboarding`  
**Fix:** Regenerar README.md baseado em estrutura atual

---

## 📈 Métricas de Performance

**Últimos 7 dias:**
- ✅ **12 issues resolvidos** (9 P2, 3 P3)
- 🆕 **10 issues criados** (3 P1, 7 P2)
- ⏱️ **Tempo médio de resolução:** 1.2 dias
- 🔁 **Taxa de recorrência:** 22% (melhor que baseline de 30%)

**Top Categorias:**
1. `validation` (4 issues)
2. `figma` (3 issues)
3. `mcp` (2 issues)
4. `assets` (2 issues)

---

## 🔄 Sistema de Aprendizagem Contínua

### Como Funciona

1. **error-watcher.cjs** (background) captura erros via stderr hook
2. **triage-issue.cjs** classifica em P0/P1/P2/P3 baseado em severity × effort × blockage
3. **TECHNICAL_DEBT.json** atualizado automaticamente (nightly CI/CD)
4. **Alerts** enviados se P1 > 5 (weekly) ou P0 > 0 (critical)

### Classificação de Prioridades

| Priority | Severity | Blockage | Effort | Action |
|----------|----------|----------|--------|--------|
| **P0** | Critical | Blocking | ≤5min | Fix imediato |
| **P1** | Critical/High | Blocking | >5min | Workaround + defer |
| **P2** | Medium/High | Partial/None | Qualquer | Technical debt |
| **P3** | Low | None | Qualquer | Log only |

### Executar Análise Manual

```bash
# Analisar errors capturados
npm run learning:analyze

# Ver logs brutos
cat logs/error-log.jsonl

# Rodar error-watcher em foreground (debug)
npm run learning:watch
```

---

## 🎯 Próximos Passos

### Semana 18-22 Nov
- [ ] Consolidar diretórios Back-office (P1-001)
- [ ] Implementar MCP token refresh (P1-002)
- [ ] Refatorar validators para usar Figma source (P1-003)

### Semana 25-29 Nov
- [ ] Pipeline DTCG tokens → CSS vars (P2-003)
- [ ] CI/CD para GitHub Pages (P2-005)
- [ ] Storybook test-runner (P2-002)

### Dezembro
- [ ] JSON Schema validation para mocks (P2-006)
- [ ] TypeScript validation para vanilla JS (P2-004)
- [ ] Atualizar README.md (P2-007)
- [ ] Fix SVG aspect ratio (P2-001)

---

## 📚 Referências

- **System Prompt:** `.prompts/blocks/09_figma_first.md`
- **ADRs:** `docs/adr/ADR-0006-unified-prototyping-platform.md`
- **Severity Rules:** `scripts/learning/severity-rules.json`
- **Dashboard Live:** [GitHub Pages Index](https://educacross.github.io/)

---

**Nota:** Este é um documento vivo atualizado automaticamente. Para sugerir mudanças nas regras de classificação, edite `scripts/learning/severity-rules.json`.
