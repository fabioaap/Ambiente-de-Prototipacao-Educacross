# P2-007: README Desatualizado com Estrutura Antiga

## 📋 Descrição
O README.md principal está desatualizado, referenciando estrutura antiga de diretórios e não refletindo a arquitetura atual (ADR-0006, ADR-0007).

## 🎯 Objetivo
Regenerar README.md completo baseado na estrutura atual do projeto, incluindo:
- Arquitetura multi-produto (Front-office, Back-office, Games)
- Stacks diferentes por produto (Vanilla JS vs React)
- Links para documentação atualizada
- Comandos corretos de setup e desenvolvimento

## 💡 Contexto
O projeto evoluiu significativamente desde o README original:
- ADR-0006: Plataforma unificada de prototipagem
- ADR-0007: Vanilla JS para Front/Back-office
- Sprint 1-5: Validadores e integrações Figma
- Estrutura de documentação expandida

## 📊 Impacto
- **Severidade:** Medium (onboarding)
- **Bloqueio:** None
- **Esforço Estimado:** 0.5h
- **Prioridade:** P2

## 🔧 Solução Proposta
Reescrever README.md seguindo template moderno e estrutura atual.

### Passos para Implementação
1. **Analisar estrutura atual:**
   - Listar produtos (Front-office, Back-office, Games)
   - Documentar stacks (Vanilla JS, React, TypeScript)
   - Mapear comandos importantes

2. **Criar novo README.md:**
   - Header com badges (build status, coverage, etc)
   - Introdução clara
   - Arquitetura multi-produto
   - Quick start por produto
   - Estrutura de diretórios
   - Links para documentação
   - Contribuindo (workflow Git)

3. **Validar links:**
   - Todos os links internos funcionam
   - Documentação referenciada existe
   - Comandos testados

4. **Adicionar badges:**
   - Build status (CI/CD)
   - Test coverage (Vitest)
   - License
   - Version

## ✅ Critérios de Aceitação
- [ ] README reflete estrutura atual (Front/Back/Games)
- [ ] Stacks corretas documentadas (Vanilla JS vs React)
- [ ] Comandos de setup testados e funcionando
- [ ] Links internos todos válidos
- [ ] Badges de status adicionados
- [ ] Arquitetura explicada claramente
- [ ] Quick start para cada produto
- [ ] Estrutura de diretórios atualizada

## 📎 Arquivos Afetados
- `README.md` (reescrever)
- `docs/INDEX.md` (verificar consistência)

## 🏷️ Tags
`documentation` `readme` `onboarding` `architecture` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-007, linha 122)
- **ADR-0006:** `docs/adr/ADR-0006-unified-prototyping-platform.md`
- **ADR-0007:** `docs/adr/ADR-0007-vanilla-js-for-frontoffice-backoffice.md`
- **Status Report:** `docs/STATUS_REPORT.md`
- **Custom Instructions:** `.prompts/instructions.xml`

## 📝 Notas Adicionais
**Template Sugerido:**

```markdown
# 🎓 Educacross - Plataforma de Prototipagem

[![Build Status](badge-url)](link)
[![Test Coverage](badge-url)](link)
[![License: MIT](badge-url)](LICENSE)

> Plataforma unificada de prototipagem para produtos educacionais Educacross

## 📖 Sobre

Este repositório centraliza a prototipagem de 3 produtos:

1. **Front-office** (Professor) - Vanilla JS + HTML + CSS
2. **Back-office** (Admin) - Vanilla JS + HTML + CSS  
3. **Games** (Aluno) - React + TypeScript + Vite

**Por que stacks diferentes?** Ver [ADR-0007](docs/adr/ADR-0007-*)

## 🚀 Quick Start

### Front-office & Back-office (Vanilla JS)

```powershell
# Servir HTMLs localmente
python -m http.server 8080
# → http://localhost:8080/Front-office/
# → http://localhost:8080/Back-office/
```

### Games (React)

```powershell
# Instalar dependências
npm install

# Dev (2 servidores em paralelo)
npm run dev        # Vite → http://localhost:5173
npm run storybook  # Storybook → http://localhost:6006

# Validação
npm run check-types
npm run test
```

## 📁 Estrutura

```
├── Front-office/          # Protótipos professor (Vanilla JS)
├── Back-office/           # Protótipos admin (Vanilla JS)
├── src/                   # Games (React)
│   ├── components/ui/     # Componentes base (shadcn/ui)
│   ├── mocks/             # Dados mockados
│   └── types/             # TypeScript types
├── packages/
│   ├── tokens/            # Design tokens (DTCG)
│   └── ui/                # Componentes React compartilhados
├── scripts/               # Scripts de validação e automação
├── docs/                  # Documentação completa
│   ├── journeys/          # Jornadas de usuário
│   ├── adr/               # Architecture Decision Records
│   └── *.md               # Guias e referências
└── .storybook/            # Config Storybook (Games apenas)
```

## 📚 Documentação

- **[Status Report](docs/STATUS_REPORT.md)** - Estado atual do projeto
- **[Backlog](docs/BACKLOG.md)** - Sprints e tarefas
- **[Daily Operations](docs/DAILY_OPERATIONS.md)** - Workflows por papel
- **[Storybook Guide](docs/STORYBOOK_GUIDE.md)** - Como criar stories
- **[Journeys Guide](docs/JOURNEYS_GUIDE.md)** - Como especificar jornadas
- **[Git Workflow](docs/GIT_WORKFLOW.md)** - Conventional commits pt-BR

## 🛠️ Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server (Vite) |
| `npm run storybook` | Storybook UI |
| `npm run check-types` | Validação TypeScript |
| `npm run test` | Testes (Vitest) |
| `npm run build` | Build produção |
| `npm run validate` | Validação completa |

## 🤝 Contribuindo

1. Clone o repositório
2. Crie branch: `git checkout -b feat/minha-feature`
3. Commits: [Conventional Commits pt-BR](docs/GIT_WORKFLOW.md)
4. Push: `git push origin feat/minha-feature`
5. Abra Pull Request

## 📋 Arquitetura

Ver documentação detalhada:
- [ADR-0006: Unified Prototyping Platform](docs/adr/ADR-0006-*)
- [ADR-0007: Vanilla JS para Front/Back-office](docs/adr/ADR-0007-*)

## 📞 Suporte

- **Issues:** [GitHub Issues](link)
- **Slack:** #educacross-dev
- **Docs:** [docs/](docs/)

## 📄 Licença

MIT License - ver [LICENSE](LICENSE)

---

**Última Atualização:** 17/11/2025  
**Versão:** 2.0.0
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
