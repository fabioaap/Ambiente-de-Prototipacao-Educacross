# P1-001: Consolidar Diretórios Duplicados no Back-office

## 📋 Descrição
Existem dois diretórios com nomes muito similares no Back-office que causam confusão ao salvar assets (especialmente SVG logos):
- `Gerador de Questões por IA  BackOffice` (com 2 espaços)
- `Gerador de Questões por IA – BackOffice` (com travessão)

## 🎯 Objetivo
Consolidar em um único diretório padronizado, eliminando duplicação e confusão de caminhos.

## 💡 Contexto
Esta duplicação surgiu de inconsistências no naming ao longo do desenvolvimento. O problema se manifesta principalmente ao salvar assets, onde o desenvolvedor precisa copiar manualmente arquivos para ambos os diretórios.

## 📊 Impacto
- **Severidade:** High
- **Bloqueio:** Partial
- **Esforço Estimado:** 0.5h
- **Prioridade:** P1
- **Recorrências:** 2x (primeira: 13/11, última: 14/11)

## 🔧 Solução Proposta
Renomear para um padrão único e atualizar todas as referências.

### Passos para Implementação
1. Decidir nome final (sugestão: `Gerador-de-Questoes-por-IA-BackOffice`)
2. Verificar qual diretório está mais atualizado
3. Mesclar conteúdos se necessário
4. Renomear para padrão final
5. Remover diretório duplicado
6. Atualizar referências em:
   - `package.json`
   - `index.html` (links internos)
   - `validation/**` (manifests e configs)
   - Scripts em `scripts/`
7. Verificar links quebrados com `npm run validate`
8. Testar fluxo de salvamento de assets
9. Atualizar documentação

## ✅ Critérios de Aceitação
- [ ] Apenas um diretório Back-office existe
- [ ] Nome padronizado (sem espaços duplos)
- [ ] Todas as referências atualizadas
- [ ] `npm run validate` passa sem erros
- [ ] Assets salvos em um único local
- [ ] Documentação atualizada (README, journeys)
- [ ] Git history preservado (usar `git mv`)

## 🚨 Workaround Atual
Copiar manualmente SVGs para ambos os diretórios:

```powershell
# Copiar manualmente SVGs para ambos os diretórios
$srcDir = Get-ChildItem "Back-office" | Where-Object { $_.Name -like "*IA  BackOffice*" }
$dstDir = Get-ChildItem "Back-office" | Where-Object { $_.Name -like "*IA*BackOffice*" }
Copy-Item "$($srcDir.FullName)\assets\*.svg" "$($dstDir.FullName)\assets\" -Force
```

## 📎 Arquivos Afetados
- `Back-office/Gerador de Questões por IA  BackOffice/` (a remover)
- `Back-office/Gerador de Questões por IA – BackOffice/` (a renomear)
- `package.json` (scripts que referenciam paths)
- `validation/**/*.json` (manifests)
- `docs/journeys/02-admin-backoffice.md` (referências)

## 🏷️ Tags
`path-conflict` `assets` `backoffice` `p1` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P1-001, linha 34-52)
- **Diretório:** `Back-office/`

## 📝 Notas Adicionais
**Sugestão de Nome Final:**
- `Gerador-de-Questoes-por-IA-BackOffice` (kebab-case, sem caracteres especiais)
- ou `gerador-questoes-ia-backoffice` (mais curto)

**Comandos Git Recomendados:**
```bash
# Preservar histórico
git mv "Back-office/Gerador de Questões por IA – BackOffice" "Back-office/gerador-questoes-ia-backoffice"

# Verificar mudanças
git status
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Última Atualização:** 17/11/2025  
**Categoria:** Technical Debt P1  
**Status:** 📋 BACKLOG
