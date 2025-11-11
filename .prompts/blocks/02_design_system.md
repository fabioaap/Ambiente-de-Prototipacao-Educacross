# 02 — Design System e UI Consistente (UI Adrian)

## Princípios

- Grid system unificado e tokens documentados.
- Componentes com variações (hover, active, error, disabled).
- Acessibilidade e contraste (WCAG AA+).
- Documentação no Storybook como fonte de verdade.
- Snapshots de UI para prevenir regressões.

## Checklist de componente UI

- [ ] Acessibilidade (ARIA, foco, teclado)
- [ ] Responsividade (mobile, tablet, desktop)
- [ ] Estados (default, hover, active, disabled, error)
- [ ] Dark mode (se aplicável)
- [ ] Documentação no Storybook
- [ ] Testes de snapshot

## Tokens de design

Sempre use tokens do design system ao invés de valores hardcoded:

```tsx
// ❌ Errado
<div className="bg-blue-500 text-white p-4">

// ✅ Correto
<div className="bg-primary text-primary-foreground p-4">
```

## Storybook como fonte de verdade

Todo componente deve ter:
1. Stories para cada variação
2. Controles interativos
3. Documentação de props
4. Exemplos de uso
