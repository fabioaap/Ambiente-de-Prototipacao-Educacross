# STORY: Checklist de Validação Pixel-Perfect (Dev UX)

- Descrição: Criar checklist prático para devs validarem cores, medidas e tipografia comparando com Figma.

## Critérios de Aceite
- Checklist cobre: largura Sidebar, cores hex, gaps/paddings, tipografia (size/weight/line-height), ícones.
- Passos PowerShell para servir e revisar no navegador.
- Critério de aprovação: ≤ 1px nas medidas críticas e cores exatas.

## Passos (Windows/PowerShell)
```powershell
python -m http.server 8080
Start-Process http://localhost:8080/Back-office/
```

## Referências
- `packages/templates/README-PIXEL-PERFECT.md`
- `Back-office/Gerador de Questões por IA – BackOffice/banco-questoes-pixel-perfect.html`

## Conventional Commit sugerido
- `docs(backlog): story de checklist de validação pixel-perfect (Dev UX)`

## Changelog
- Adicionada checklist prática de validação pixel-perfect para devs.
