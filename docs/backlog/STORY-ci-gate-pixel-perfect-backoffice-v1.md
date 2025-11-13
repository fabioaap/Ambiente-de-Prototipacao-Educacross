# STORY: CI Gate de Validação Pixel-Perfect (Back-office) v1

- Descrição: Definir pipeline CI que bloqueia merge se páginas do Back-office não passarem validação estrutural (tokens + HTML) e teste visual (Playwright + screenshots).

## Objetivo
Garantir consistência pixel-perfect contínua após cada PR evitando regressões visuais ou quebra de estrutura HTML acordada com Figma.

## Escopo Inicial
Página: `banco-questoes-pixel-perfect.html` (node Figma 10021:53486) — expandir para demais páginas conforme adicionadas ao manifesto.

## Critérios de Aceite
1. Pipeline CI roda em cada PR para `main`.
2. Etapas falham se qualquer comando retornar exit code != 0.
3. Relatório Playwright HTML publicado como artifact.
4. Estrutura validada por `pixel:validate-structure` com `--threshold=1` (dif máx de tokens permitidos).
5. Testes de screenshot passam com `maxDiffPixelRatio <= 0.005` e sem ultrapassar `maxDiffPixels` (quando definido).
6. Todos os testes Vitest e TypeScript check ok antes dos testes visuais.
7. Documentação deste STORY inclui instruções locais e YAML de exemplo.

## Comandos Locais (PowerShell)
```powershell
npm ci
npm run check-types
npm test --silent
npm run pixel:validate-structure
npm run pixel:test
npx playwright show-report validation-artifacts/pixel/report
```

## Fluxo do Pipeline (YAML Exemplo GitHub Actions)
```yaml
name: backoffice-pixel-gate
on:
  pull_request:
    branches: [ main ]
jobs:
  pixel-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run check-types
      - run: npm test -- --run
      - run: npm run pixel:validate-structure
      - run: npm run pixel:install
      - run: npm run pixel:ci
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: pixel-report
          path: validation-artifacts/pixel/report
```

## Artefatos
- Imagens atual vs snapshot: `test-results/pixel-*` e `tests/pixel/pixel.spec.ts-snapshots/`
- Relatório HTML: `validation-artifacts/pixel/report/index.html`
- Manifesto: `pixel-perfect.manifest.json`
- Tokens extraídos: `figma-tokens.json`

## Estratégia de Atualização de Snapshots
1. `npm run pixel:update` após confirmar mudanças.
2. Revisar relatório e anexar prints no PR.
3. Commit: `test(pixel): atualizar snapshots backoffice banco de questões`.

## Riscos & Mitigações
- Fontes não carregadas → espera `(document.fonts.status === 'loaded')`.
- Antialiasing → threshold `0.005` pixel ratio.
- Página não listada no manifesto → PR bloqueado até atualização.

## Adoção Faseada
Fase 1: Página banco de questões.
Fase 2: Sidebar + novas páginas.
Fase 3: Automatizar extração de tokens (`pixel:extract-tokens`).

## Conventional Commit sugerido
`docs(backlog): story ci gate pixel-perfect backoffice`

## Changelog
- v1: Pipeline detalhado e YAML.
