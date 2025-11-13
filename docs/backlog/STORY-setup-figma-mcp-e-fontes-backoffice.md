# STORY: Setup Figma MCP e Tipografia (Back-office)

- Descrição: Preparar ambiente com Figma Dev Mode (MCP) e tipografia Montserrat, garantindo base consistente para pixel-perfect.

## Critérios de Aceite
- IDs de nós Figma usados nos templates listados no README pixel-perfect.
- Montserrat 400/500/600 referenciada e carregando corretamente nas páginas.
- Passo a passo local (Windows/PowerShell) para servir os HTMLs documentado.

## Passos (Windows/PowerShell)
```powershell
python -m http.server 8080
# Abrir: http://localhost:8080/Back-office/
```

## Referências
- `packages/templates/README-PIXEL-PERFECT.md`
- `packages/templates/backoffice-*.html`
- `Back-office/Gerador de Questões por IA – BackOffice/banco-questoes-pixel-perfect.html`

## Conventional Commit sugerido
- `docs(backlog): story de setup Figma MCP + tipografia Back-office`

## Changelog
- Documentado setup de Figma MCP e tipografia Montserrat para Back-office.
