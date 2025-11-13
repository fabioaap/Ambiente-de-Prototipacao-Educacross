# STORY: CI Gate de Validação Pixel-Perfect (Back-office)

- Descrição: Definir gate de validação estática (HTML) e visual (dif de screenshot) para páginas do Back-office.

## Critérios de Aceite
- Passos PowerShell documentados para execução local (serve + validações).
- Validação universal HTML sem erros essenciais antes de merge.
- Artefatos de dif visual armazenados em `validation-artifacts/pixel/`.
- Threshold documentado (ex.: ≤ 0,5% de dif por pixel ou ≤ 1px).

## Referências
- `universal_validator.py`
- `ci_validator.py`
- `validation-artifacts/`

## Conventional Commit sugerido
- `docs(backlog): story do CI gate para validação pixel-perfect Back-office`

## Changelog
- Definido gate de validação estática e visual para Back-office.
