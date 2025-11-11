# 02_design_system — DS em Código, Tokens e Handoff

## Fonte da verdade
- **Design System em código** (pacote `packages/ui`) + **Storybook** como catálogo, docs e testes visuais.

## Tokens
- **DTCG** em `packages/tokens` (JSON). Transformar com **Style Dictionary** para CSS/TS/iOS/Android.
- Nunca hardcode valores; consumir tokens gerados.

## Figma
- Usar para projetar/alinhamento e **especificar**.
- **Dev Mode + Code Connect**: vincular camadas a componentes reais (snippets do DS).
- Não manter UI “paralela” no Figma após implementação.

## Acessibilidade & UX
- WCAG AA+, foco visível, contraste, navegação assistida, estados (hover/focus/disabled/error).

## Regras operacionais
- Criou/alterou componente → atualizar stories, docs, testes visuais e tokens (se aplicável).
- Mudança de anatomia/props → ADR curto + migration guide no Storybook.

## Testes visuais
- Ativar visual testing em PRs; tolerância mínima; comparar variantes e estados.
