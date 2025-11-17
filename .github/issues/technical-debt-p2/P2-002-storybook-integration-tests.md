# P2-002: Storybook Sem Integration Tests

## 📋 Descrição
O Storybook não possui integration tests automatizados. Stories existem apenas para documentação visual, sem validação automatizada de comportamento e interações.

## 🎯 Objetivo
Implementar `@storybook/test-runner` com Playwright para executar integration tests em todas as stories, validando comportamento e interações automaticamente.

## 💡 Contexto
Storybook stories são excelente fonte de verdade para componentes, mas sem testes automatizados, não garantem que comportamentos funcionem corretamente. `@storybook/test-runner` permite rodar testes em todas as stories via Playwright.

## 📊 Impacto
- **Severidade:** High
- **Bloqueio:** None (não impede desenvolvimento)
- **Esforço Estimado:** 2.0h
- **Prioridade:** P2

## 🔧 Solução Proposta
Instalar e configurar test-runner para Storybook.

### Passos para Implementação
1. Instalar dependências:
   ```bash
   npm install --save-dev @storybook/test-runner
   ```
2. Criar config `test-runner-jest.config.js`
3. Adicionar scripts em `package.json`:
   ```json
   {
     "test:storybook": "test-storybook",
     "test:storybook:ci": "test-storybook --ci"
   }
   ```
4. Adicionar play functions em stories críticas:
   ```typescript
   export const InteractionTest: Story = {
     play: async ({ canvasElement }) => {
       const canvas = within(canvasElement);
       await userEvent.click(canvas.getByRole('button'));
       await expect(canvas.getByText('Success')).toBeInTheDocument();
     }
   };
   ```
5. Configurar CI/CD para rodar testes
6. Documentar padrão de teste em `STORYBOOK_GUIDE.md`

## ✅ Critérios de Aceitação
- [ ] `@storybook/test-runner` instalado e configurado
- [ ] Script `npm run test:storybook` funciona
- [ ] Pelo menos 5 stories com play functions
- [ ] CI/CD executa testes automaticamente
- [ ] Cobertura documentada
- [ ] Padrão de teste documentado em guide

## 📎 Arquivos Afetados
- `package.json` (adicionar deps e scripts)
- `test-runner-jest.config.js` (criar)
- `.storybook/test-runner.ts` (criar - configuração custom)
- `src/**/*.stories.tsx` (adicionar play functions)
- `.github/workflows/storybook-tests.yml` (criar - CI/CD)
- `docs/STORYBOOK_GUIDE.md` (atualizar com padrão de testes)

## 🏷️ Tags
`testing` `storybook` `automation` `playwright` `integration-tests` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-002, linha 107)
- **Storybook Test Runner:** [Docs](https://storybook.js.org/docs/react/writing-tests/test-runner)
- **Play Functions:** [Docs](https://storybook.js.org/docs/react/writing-stories/play-function)

## 📝 Notas Adicionais
**Exemplo de Story com Play Function:**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractionTest: Story = {
  args: {
    children: 'Click Me',
    onClick: fn(), // mock function
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Encontrar botão
    const button = canvas.getByRole('button');
    
    // Clicar
    await userEvent.click(button);
    
    // Validar que onClick foi chamado
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

**CI/CD Integration (.github/workflows/storybook-tests.yml):**
```yaml
name: Storybook Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build-storybook
      - run: npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
          "npx http-server storybook-static --port 6006" \
          "npx wait-on tcp:6006 && npm run test:storybook:ci"
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
