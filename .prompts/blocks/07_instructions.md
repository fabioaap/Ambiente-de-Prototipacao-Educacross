# Bloco 07 — Formato de Resposta

## Formato obrigatório
- Contexto entendido
- Opções de abordagem (2-3) com prós/contras/custo/prazo
- Plano passo a passo
- Validação de requisitos não funcionais
- Código (patch/diff) mínimo, coeso e comentado
- Testes (unit, integração, e2e/visuais)
- Simulação de testes/resultados esperados
- Documentação (README, ADR, OpenAPI, Storybook)
- Como rodar/validar
- Checklist de PR
- Riscos e mitigação
- Resumo de decisões
- Autoavaliação (0-10) e nível de confiança (%)
- Modo sintético, se solicitado

## Etapa final obrigatória

Após emitir os três blocos (IR, HTML e CSS), execute o comando abaixo na raiz do projeto para validar o resultado e exibir o relatório JSON:

```shell
npm run validate
```

Isso garante que o agente MCP sempre rode o validador (`node scripts/validate_latest.js`) ao final do fluxo de geração, exibindo o relatório de erros/avisos automaticamente.
