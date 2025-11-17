# P2-005: Falta CI/CD para GitHub Pages

## 📋 Descrição
Não existe pipeline automatizado de CI/CD para build, validação e deploy do Storybook e protótipos estáticos no GitHub Pages.

## 🎯 Objetivo
Implementar GitHub Actions workflow completo: `build → validate → deploy` automaticamente em push para `main` e PRs.

## 💡 Contexto
GitHub Pages é ideal para hospedar Storybook e protótipos estáticos, mas deploy manual é propenso a erros. Workflow automatizado garante:
- Build sempre consistente
- Validações automáticas (tipos, testes, lint)
- Deploy atômico e revertível
- Preview de PRs

## 📊 Impacto
- **Severidade:** High (produtividade)
- **Bloqueio:** None
- **Esforço Estimado:** 1.0h
- **Prioridade:** P2

## 🔧 Solução Proposta
Criar GitHub Actions workflow com 3 stages: Build, Validate, Deploy.

### Passos para Implementação
1. **Criar `.github/workflows/github-pages.yml`:**
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
     pull_request:
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Validate
           run: |
             npm run check-types
             npm run check-mocks
             npm run test
         
         - name: Build Storybook
           run: npm run build-storybook
         
         - name: Deploy to GitHub Pages
           if: github.ref == 'refs/heads/main'
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./storybook-static
   ```

2. **Configurar GitHub Pages:**
   - Settings → Pages → Source: gh-pages branch
   - Custom domain (opcional)
   - Enforce HTTPS

3. **Adicionar PR preview (opcional):**
   - Deploy em `gh-pages-preview/{pr-number}`
   - Comentário automático no PR com link

4. **Adicionar status badge no README:**
   ```markdown
   ![Deploy Status](https://github.com/USER/REPO/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
   ```

## ✅ Critérios de Aceitação
- [ ] Workflow `.github/workflows/github-pages.yml` criado
- [ ] Deploy automático em push para `main`
- [ ] Validações (types, mocks, tests) executadas antes de deploy
- [ ] Build falha se validações falharem
- [ ] GitHub Pages configurado (Settings)
- [ ] URL publicada funcionando (https://USER.github.io/REPO/)
- [ ] Status badge no README
- [ ] Documentação do processo

## 📎 Arquivos Afetados
- `.github/workflows/github-pages.yml` (criar)
- `README.md` (adicionar status badge)
- `docs/CI_CD_GUIDE.md` (criar - documentar workflow)
- `.nojekyll` (já existe - garante deploy correto)
- `404.html` (já existe - fallback para SPA)

## 🏷️ Tags
`ci-cd` `github-actions` `automation` `github-pages` `deployment` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-005, linha 116)
- **GitHub Pages:** [Docs](https://docs.github.com/en/pages)
- **GitHub Actions:** [Docs](https://docs.github.com/en/actions)
- **peaceiris/actions-gh-pages:** [Action](https://github.com/peaceiris/actions-gh-pages)

## 📝 Notas Adicionais
**Workflow Completo com PR Preview:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: write
  pull-requests: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate
        run: |
          npm run check-types
          npm run check-mocks
          npm run test
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
      
      - name: Deploy PR Preview
        if: github.event_name == 'pull_request'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
          destination_dir: preview/pr-${{ github.event.number }}
      
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const prNumber = context.issue.number;
            const previewUrl = `https://USER.github.io/REPO/preview/pr-${prNumber}`;
            github.rest.issues.createComment({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed: ${previewUrl}`
            });
```

**Cache Otimization:**
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
