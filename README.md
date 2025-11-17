# Ambiente de Prototipação Educacross 

![CI Status](https://img.shields.io/badge/ci-passing-brightgreen)
![MCP Validate](https://img.shields.io/badge/mcp--validate-active-blue)
![Pixel Gate](https://img.shields.io/badge/pixel--gate-active-blue)
![Validation Score](https://img.shields.io/badge/validation-68.7%25-yellow)

Este repositório contém protótipos e páginas HTML para o projeto Educacross.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Verificar saúde do sistema
npm run health

# 3. Iniciar desenvolvimento
npm run dev              # Vite dev server (port 5173)
npm run storybook        # Storybook (port 6006)
npm run pixel:serve      # Python server para HTMLs (port 8080)
```

## 📁 Estrutura do Projeto

- **Front-office/** - Interface do Professor (Vanilla JS)
- **Back-office/** - Interface Admin (Vanilla JS)
- **src/** - Games/Plataforma do Aluno (React + TypeScript)
- **packages/** - Design system (tokens, componentes UI)
- **scripts/** - Automação e validação
- **docs/** - Documentação técnica completa

## 🛠️ Scripts Principais

### Desenvolvimento
```bash
npm run dev              # Vite dev server
npm run storybook        # Catálogo de componentes
npm run pixel:serve      # Server Python para HTMLs estáticos
```

### Testes e Validação
```bash
npm test                 # Testes unitários (Vitest)
npm run typecheck        # Verificar TypeScript
npm run check-mocks      # Validar mocks
npm run pixel:test       # Testes visuais (Playwright)
```

### Build
```bash
npm run build            # Build de produção (com validações)
npm run build-storybook  # Build do Storybook
npm run preview          # Preview do build
```

### Limpeza e Manutenção
```bash
npm run clean            # Limpar artifacts e builds
npm run clean:reports    # Limpar apenas relatórios JSON
npm run health           # Health check do sistema
```

## 📊 Status de Validação

**Validação Universal (Python):**
- Front-office: 85.7% (6✓ / 1✗)
- Back-office: 66.7% (40✓ / 20✗)
- **Score Geral: 68.7%** (46✓ / 21✗)

**CI/CD:**
- ✅ Build automatizado
- ✅ Testes unitários
- ✅ Validação TypeScript
- ✅ Validação pixel-perfect
- ✅ Validação Figma MCP

## 📚 Documentação

- **[DEVOPS-PRACTICES.md](docs/DEVOPS-PRACTICES.md)** - Guia completo DevOps
- **[DAILY_OPERATIONS.md](docs/DAILY_OPERATIONS.md)** - Workflows diários
- **[GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)** - Conventional commits
- **[Jornadas](docs/journeys/)** - Especificações de fluxos

## 🔧 Workflows CI/CD

### 1. ci.yml - Build e Testes Gerais
Triggers em pull requests para `main`:
- Lint e typecheck
- Testes unitários
- Build Vite e Storybook

### 2. mcp-validate.yml - Validação Figma MCP
Valida integração com design Figma via MCP.

### 3. backoffice-pixel-gate.yml - Pixel-Perfect Gate
Testes visuais pixel-perfect do Back-office (timeout: 15min).

## 🧹 Limpeza de Artifacts

Os seguintes diretórios são ignorados pelo Git (`.gitignore`):
- `validation-artifacts/` - Relatórios de validação
- `test-results/` - Resultados Playwright
- `.validation-cache/` - Cache de validações
- `*-report.json` - Relatórios temporários

Execute `npm run clean` para remover todos os artifacts localmente.

## Publicação no GitHub Pages

Os arquivos `.nojekyll`, `index.html` e `404.html` foram adicionados na raiz do repositório. O arquivo `.nojekyll` desativa o Jekyll. O `index.html` gera um mapa do site listando todos os arquivos `.html` e `.md` do repositório. O `404.html` é uma página simples de erro com link para a página inicial.

Para publicar no GitHub Pages: vá em **Settings → Pages**, escolha a branch `main` e selecione a pasta **Root (/)** . Se preferir, mova os arquivos para a pasta `docs` e escolha a pasta `docs` nas opções de publicação.

## 🔍 Troubleshooting

### Build falhando?
```bash
npm run check-mocks      # Verificar mocks
npm run typecheck        # Verificar TypeScript
npm run health           # Health check completo
```

### Artifacts muito grandes?
```bash
npm run clean            # Limpar tudo
```

### CI falhando?
Consulte [DEVOPS-PRACTICES.md](docs/DEVOPS-PRACTICES.md) seção Troubleshooting.

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
