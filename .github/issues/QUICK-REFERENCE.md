# 🎯 Quick Reference: Backlog de Issues

**Status:** ✅ COMPLETO | **Data:** 17/11/2025 | **Issues:** 11

---

## 📋 O Que Foi Criado

**Localização:** `.github/issues/`

```
14 arquivos markdown (65KB, 2.250 linhas)
├── 11 issues estruturadas
├── 1 README master
├── 1 guia de criação
└── 1 template padrão
```

---

## 🗂️ Organização

| Diretório | Issues | Esforço | Prioridade |
|-----------|--------|---------|------------|
| `sprint-6/` | 1 | 2-3h | P1 (High) |
| `technical-debt-p1/` | 3 | 2.5h | P1 (Critical) |
| `technical-debt-p2/` | 7 | 6.25h | P2 (Medium) |
| **TOTAL** | **11** | **~10.75h** | — |

---

## 🚀 Como Criar Issues no GitHub

### Opção 1: Manual (Web)
1. Abrir arquivo `.md` em `.github/issues/`
2. Copiar todo o conteúdo
3. Criar issue no GitHub: https://github.com/fabioaap/Ambiente-de-Prototipacao-Educacross/issues/new
4. Colar conteúdo
5. Adicionar labels
6. Submit

### Opção 2: Automatizado (CLI)
```bash
# Instalar GitHub CLI
winget install GitHub.cli  # Windows
brew install gh            # macOS

# Autenticar
gh auth login

# Criar todas P1
for file in .github/issues/technical-debt-p1/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create --title "$title" --body-file "$file" \
    --label "priority:p1-high,technical-debt"
done

# Criar todas P2
for file in .github/issues/technical-debt-p2/*.md; do
  title=$(grep "^# " "$file" | head -1 | sed 's/^# //')
  gh issue create --title "$title" --body-file "$file" \
    --label "priority:p2-medium,technical-debt"
done
```

---

## 🏷️ Labels Principais

```bash
# Criar labels
gh label create "priority:p1-high" -c D93F0B -d "Alta prioridade"
gh label create "priority:p2-medium" -c FFA500 -d "Média prioridade"
gh label create "technical-debt" -c 666666 -d "Débito técnico"
gh label create "enhancement" -c 28C76F -d "Melhoria"
gh label create "documentation" -c 5DADE2 -d "Documentação"
```

---

## 📅 Roadmap Sugerido

**Semana 1 (18-22 Nov) - P1 + Sprint 6:** 4.5h
- M1: Layout Mobile (2-3h)
- P1-001: Diretórios Back-office (0.5h)
- P1-002: MCP Auth (1h)

**Semana 2 (25-29 Nov) - P1 + P2 High:** 4h
- P1-003: Validators Figma (1h)
- P2-002: Storybook Tests (2h)
- P2-005: CI/CD Pages (1h)

**Semana 3 (02-06 Dez) - P2 Rest:** 3.5h
- P2-003: Tokens DTCG (1.5h)
- P2-006: Mocks Schema (0.75h)
- P2-004, P2-007, P2-001 (1.25h)

---

## 📚 Documentação Completa

| Documento | Localização |
|-----------|-------------|
| **Índice Master** | `.github/issues/README.md` |
| **Guia de Criação** | `.github/issues/GUIA-CRIACAO-ISSUES.md` |
| **Template** | `.github/issues/templates/issue-template.md` |
| **Issues Sprint 6** | `.github/issues/sprint-6/` |
| **Issues P1** | `.github/issues/technical-debt-p1/` |
| **Issues P2** | `.github/issues/technical-debt-p2/` |

---

## ✅ Checklist de Ações

- [ ] Ler `.github/issues/GUIA-CRIACAO-ISSUES.md`
- [ ] Criar labels no GitHub
- [ ] Criar issues (manual ou CLI)
- [ ] Criar projeto "Backlog Educacross"
- [ ] Organizar issues em colunas
- [ ] Começar Sprint 6 + P1

---

## 💡 Dica Rápida

**Cada issue contém:**
- Descrição clara do problema
- Solução proposta com passos
- Critérios de aceitação
- Workaround atual
- Código de exemplo
- Referências completas

**Basta copiar e criar no GitHub!**

---

**Ver documentação completa:** `.github/issues/README.md`
