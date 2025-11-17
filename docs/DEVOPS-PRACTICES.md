# Práticas DevOps - Educacross

## 📋 Índice

1. [Estrutura do Repositório](#estrutura-do-repositório)
2. [Workflows CI/CD](#workflows-cicd)
3. [Scripts de Validação](#scripts-de-validação)
4. [Limpeza e Manutenção](#limpeza-e-manutenção)
5. [Comandos Úteis](#comandos-úteis)
6. [Troubleshooting](#troubleshooting)

---

## Estrutura do Repositório

### Arquivos Rastreados vs Ignorados

**Rastreados pelo Git (381 arquivos):**
- Código-fonte (src/, Front-office/, Back-office/)
- Configurações (package.json, tsconfig.json, etc.)
- Documentação (docs/, README*.md)
- Scripts de automação (scripts/)
- Workflows CI/CD (.github/workflows/)

**Ignorados (.gitignore):**
- `node_modules/` - Dependências npm
- `dist/` - Build artifacts
- `validation-artifacts/` - Relatórios de validação (2.4MB)
- `test-results/` - Resultados de testes Playwright
- `.validation-cache/` - Cache de validações
- `*-report.json`, `*_report.json` - Relatórios JSON temporários
- `coverage/` - Cobertura de testes
- `*.log`, `*.tmp` - Arquivos temporários

### Diretórios Principais

```
.
├── Front-office/           # Protótipos Vanilla JS - Interface do Professor
├── Back-office/            # Protótipos Vanilla JS - Interface Admin
├── src/                    # Games React + TypeScript
├── packages/               # Design system (tokens, ui)
├── scripts/                # Automação e validação
├── docs/                   # Documentação técnica
├── .github/workflows/      # CI/CD GitHub Actions
└── validation-artifacts/   # Artifacts (ignorado no Git)
```

---

## Workflows CI/CD

### 1. **ci.yml** - Build e Testes Gerais

**Triggers:** Pull requests para `main`

**Jobs:**
- `build-test-lint`: Lint, typecheck, testes unitários, build
- `storybook-visual-tests`: Build do Storybook

**Comandos executados:**
```bash
npm run lint           # Placeholder (a ser implementado)
npm run typecheck      # TypeScript check
npm run test -- --run  # Vitest
npm run build          # Vite build
npm run build-storybook # Storybook build
```

### 2. **mcp-validate.yml** - Validação Figma MCP

**Triggers:** Push e pull requests

**Jobs:**
- Instala browsers Playwright
- Roda validação MCP Figma
- Verifica relatórios gerados

**Comandos:**
```bash
npm run mcp:validate
npm run mcp:gate
```

### 3. **backoffice-pixel-gate.yml** - Pixel-Perfect Gate

**Triggers:** Pull requests e workflow_dispatch

**Jobs:**
- Validação pixel-perfect do Back-office
- Testes visuais com Playwright
- Publicação de relatórios

**Comandos:**
```bash
npm run figma:first:strict
npm run pixel:validate-structure
npm run pixel:ci
```

**Artifacts gerados:**
- `pixel-report` (validation-artifacts/pixel/report)

---

## Scripts de Validação

### Validação Universal (Python)

```bash
# Validação completa do projeto
python3 ci_validator.py

# Validação universal com relatório
python3 universal_validator.py

# Validação interativa
python3 interactive_validator.py
```

**Saída:**
- Valida Front-office, Back-office, componentes React
- Gera relatórios JSON em `validation-artifacts/`
- Score geral: 68.7% (46✓ / 21✗)

### Validação TypeScript

```bash
npm run check-types      # TypeScript --noEmit
npm run typecheck        # Alias para check-types
```

### Validação de Mocks

```bash
npm run check-mocks      # Verifica progress: 0 em missions.ts
```

**Importante:** Build FALHA se mocks estiverem incorretos.

### Validação Pixel-Perfect

```bash
# Extrair tokens do Figma
npm run pixel:extract-tokens

# Validar estrutura HTML
npm run pixel:validate-structure

# Validar pixels (DPR 1)
npm run pixel:validate

# Validar pixels HiDPI (DPR 2)
npm run pixel:validate-hidpi

# Validação completa
npm run pixel:validate-all
```

### Validação Figma MCP

```bash
# Verificar status MCP
npm run mcp:check

# Recuperar conexão
npm run mcp:recover

# Validação completa
npm run mcp:validate

# Gate (verificar relatórios)
npm run mcp:gate
```

### Validação Dual

```bash
npm run validate:dual    # Validação dupla (HTML + Figma)
```

---

## Limpeza e Manutenção

### Scripts de Limpeza

```bash
# Limpar todos os artifacts
npm run clean

# Limpar apenas relatórios JSON
npm run clean:reports
```

**O que é removido:**
- `dist/` - Build artifacts
- `validation-artifacts/` - Relatórios de validação
- `test-results/` - Resultados Playwright
- `.validation-cache/` - Cache de validações
- `coverage/` - Cobertura de testes
- `playwright-report/` - Relatórios Playwright
- `*-report.json`, `*_report.json` - Relatórios na raiz

### Limpeza Manual

```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache npm
npm cache clean --force

# Limpar cache Playwright
npx playwright uninstall --all
npm run pixel:install
```

### Verificação de Espaço

```bash
# Tamanho total do repositório
du -sh .

# Tamanho por diretório
du -sh */ | sort -h

# Encontrar arquivos grandes
find . -type f -size +1M -exec ls -lh {} \; | sort -k 5 -h
```

---

## Comandos Úteis

### Setup Inicial

```bash
# Verificar ambiente
npm run check-env

# Instalar dependências
npm install

# Instalar browsers Playwright
npm run pixel:install
```

### Desenvolvimento

```bash
# Dev server (Vite)
npm run dev              # http://localhost:5173

# Storybook
npm run storybook        # http://localhost:6006

# Server Python para HTMLs estáticos
npm run pixel:serve      # http://localhost:8080
```

### Testes

```bash
# Testes unitários (Vitest)
npm test                 # Watch mode
npm run test:coverage    # Com cobertura

# Testes visuais (Playwright)
npm run pixel:test       # Rodar testes
npm run pixel:update     # Atualizar snapshots
npm run pixel:report     # Ver relatório
```

### Build

```bash
# Build de produção
npm run build            # Com check-mocks

# Build em watch mode
npm run build:watch

# Preview do build
npm run preview
```

### Validação

```bash
# Validação rápida
npm run typecheck && npm test -- --run

# Validação completa
npm run check-types && npm test -- --run && npm run build

# Validação Python
python3 ci_validator.py
```

---

## Troubleshooting

### Problema: CI falhando com "npm run lint not found"

**Solução:**
```bash
# O script lint é um placeholder
# Remover do workflow ou implementar ESLint
```

### Problema: "Cannot find module check-mocks.cjs"

**Verificar:**
```bash
ls -la prototype-react/scripts/check-mocks.cjs
```

**Se não existir:**
```bash
# Criar placeholder
echo "console.log('✅ Mocks OK')" > prototype-react/scripts/check-mocks.cjs
```

### Problema: Playwright tests failing

**Reinstalar browsers:**
```bash
npx playwright uninstall --all
npm run pixel:install
```

### Problema: Artifacts muito grandes

**Limpar artifacts:**
```bash
npm run clean
git status  # Verificar se artifacts estão ignorados
```

### Problema: TypeScript errors

**Verificar configuração:**
```bash
cat tsconfig.json
npm run check-types 2>&1 | head -20
```

### Problema: Build falhando

**Debug:**
```bash
# Verificar mocks
npm run check-mocks

# Build verboso
npm run build -- --mode development

# Verificar dependências
npm run check-deps
```

---

## Métricas Atuais

**Repositório:**
- Tamanho: 13MB
- Arquivos rastreados: 381
- HTML: 28 arquivos
- CSS: 16 arquivos
- JS/TS/TSX: 76 arquivos

**Validação:**
- Front-office: 85.7% (6✓ / 1✗)
- Back-office: 66.7% (40✓ / 20✗)
- Score geral: 68.7% (46✓ / 21✗)

**CI/CD:**
- Workflows ativos: 3
- Timeout: 15 minutos
- Node version: 20
- Python version: 3.12

---

## Próximas Melhorias

1. **Implementar ESLint e Prettier**
   ```bash
   npm install -D eslint prettier
   npm run lint -- --fix
   ```

2. **Adicionar pre-commit hooks**
   ```bash
   npm install -D husky lint-staged
   ```

3. **Configurar cache de Playwright no CI**
   ```yaml
   - uses: actions/cache@v4
     with:
       path: ~/.cache/ms-playwright
       key: playwright-${{ hashFiles('package-lock.json') }}
   ```

4. **Badges de Status no README**
   ```markdown
   ![CI](https://github.com/fabioaap/Ambiente-de-Prototipacao-Educacross/workflows/ci/badge.svg)
   ![MCP Validate](https://github.com/fabioaap/Ambiente-de-Prototipacao-Educacross/workflows/mcp-validate/badge.svg)
   ```

5. **Script de health check**
   ```bash
   npm run health:check  # Verifica todos os sistemas
   ```

---

## Contato e Suporte

Para problemas relacionados a DevOps, CI/CD ou automação:
1. Verificar este documento primeiro
2. Consultar logs em `.github/workflows/`
3. Rodar validadores localmente antes de push
4. Usar `npm run clean` para resolver problemas de cache

**Documentos Relacionados:**
- [README.md](../README.md) - Visão geral do projeto
- [DAILY_OPERATIONS.md](./DAILY_OPERATIONS.md) - Workflows diários
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Conventional commits
