# EPIC: Garantia Pixel-Perfect no Back-office (Vanilla JS)

- Objetivo: estabelecer um processo repetível para que todas as telas do Back-office atinjam fidelidade visual pixel-perfect em relação ao Figma.
- Escopo: páginas em `Back-office/**` implementadas em HTML/CSS/JS (sem framework).
- Stakeholders: Design, Frontend, QA.
- Métrica de sucesso: regressão visual ≤ 0,5% de dif pixels (ou ≤ 1px) por página, sem desvios de cores/medidas tipográficas definidas.

## Fases
- Setup: alinhamento Figma MCP, fontes, templates base.
- Baselines: consolidar templates (Sidebar, Header, Breadcrumb) e aplicar na(s) página(s) iniciais.
- CI Gate: validação automatizada (HTML estático + dif visual) e artefatos.
- Dev UX: checklist e fluxo local (Windows/PowerShell) para revisão rápida.
- Governance: Definition of Done (DoD), re-baseline policy e rastreabilidade.

## Critérios de Aceite (Epic)
- Templates de Sidebar, Header e Breadcrumb documentados com medidas exatas do Figma.
- Página `banco-questoes-pixel-perfect.html` como referência de aplicação.
- Processo de validação local documentado (PowerShell) e pronto para CI.
- Checklist de validação pixel-perfect publicado.
- DoD formal com limites de tolerância e exceções.

## Referências
- `packages/templates/README-PIXEL-PERFECT.md`
- `packages/templates/backoffice-sidebar.html`
- `packages/templates/backoffice-header.html`
- `packages/templates/backoffice-breadcrumb.html`
- `Back-office/Gerador de Questões por IA – BackOffice/banco-questoes-pixel-perfect.html`
- `docs/DAILY_OPERATIONS.md`
- `docs/STATUS_REPORT.md`

## Entregáveis
- Stories e Tasks deste EPIC criadas em `docs/backlog/` com critérios de aceite claros.
- Artefatos de validação em `validation-artifacts/` (quando CI estiver integrado).

## Conventional Commit sugerido
- `docs(backlog): criar EPIC de garantia pixel-perfect Back-office`

## Changelog
- Adicionada Epic que unifica o processo de garantia pixel-perfect do Back-office.
