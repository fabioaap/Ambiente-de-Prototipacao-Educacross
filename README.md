# Ambiente de Prototipação Educacross 

![Status Pixel Gate](https://img.shields.io/badge/pixel--gate-pending-lightgrey)

Este repositório contém protótipos e páginas HTML para o projeto Educacross.

## Publicação no GitHub Pages

Os arquivos `.nojekyll`, `index.html` e `404.html` foram adicionados na raiz do repositório. O arquivo `.nojekyll` desativa o Jekyll. O `index.html` gera um mapa do site listando todos os arquivos `.html` e `.md` do repositório. O `404.html` é uma página simples de erro com link para a página inicial.

Para publicar no GitHub Pages: vá em **Settings → Pages**, escolha a branch `main` e selecione a pasta **Root (/)** . Se preferir, mova os arquivos para a pasta `docs` e escolha a pasta `docs` nas opções de publicação.

# Histórico de mudanças na estrutura de prompts

## 2025-11-12 — Unificação e limpeza de instruções

- Todas as instruções e regras do agente foram migradas para `.prompts/instructions.xml`.
- Os blocos temáticos estão em `.prompts/blocks/` (01_core.md, 02_discovery.md, etc.).
- Arquivos duplicados e antigos removidos de `.prompts/` e `.github/instructions/`.
- O arquivo `.github/copilot-instructions.md` agora referencia apenas o XML central.
- Task de validação dos includes adicionada em `.vscode/tasks.json`.
- O arquivo `Personalidade.instructions.md` foi descontinuado e pode ser removido.
- Estrutura final: apenas `.prompts/instructions.xml` e os blocos em `.prompts/blocks/` são utilizados.

**Critérios de aceite:**
- Não há instruções duplicadas fora dos blocos.
- Toda automação e agentes usam apenas o XML e os blocos.
- Remoção de arquivos legados não afeta o funcionamento do repositório.

---

## 🤖 Agentes Customizados

O projeto possui agentes especializados para acelerar o desenvolvimento:

### **Dev Frontend Vanilla**
- **Localização:** `.github/agents/dev frontend Vanilla.agent.md`
- **Especialidade:** HTML/CSS/JS puro (sem frameworks)
- **Uso:** Front-office e Back-office (protótipos estáticos)
- **Capacidades:**
  - Implementação pixel-perfect baseada em Figma (via MCP)
  - Extração automática de tokens de design
  - HTML semântico e acessível
  - CSS organizado com variáveis (Vuexy theme)
  - JavaScript modular sem dependências

**Documentação completa:** [docs/CUSTOM_AGENTS.md](./docs/CUSTOM_AGENTS.md)

**Quando usar:**
- ✅ Criar páginas HTML para Front-office (Professor)
- ✅ Criar páginas HTML para Back-office (Admin)
- ✅ Integrar designs do Figma com MCP
- ❌ **Não usar** para Games (React/TypeScript)

**Exemplo de uso:**
```
"Implementar modal de confirmação no banco de questões (Back-office)
usando Dev Frontend Vanilla agent. Seguir padrão Vuexy com tokens
do projeto. Incluir validação de acessibilidade."
```

---

## 📚 Documentação

Para mais informações sobre o projeto, consulte:

- **[docs/INDEX.md](./docs/INDEX.md)** — Índice completo de documentação
- **[docs/DAILY_OPERATIONS.md](./docs/DAILY_OPERATIONS.md)** — Workflow diário por papel
- **[docs/CUSTOM_AGENTS.md](./docs/CUSTOM_AGENTS.md)** — Guia de agentes customizados
- **[docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)** — Padrões de commits e PRs
