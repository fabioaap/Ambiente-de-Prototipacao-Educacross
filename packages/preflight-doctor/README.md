# @educacross/preflight-doctor

Utilitário CLI para estabilização e diagnóstico de ambiente local de desenvolvimento.

## Funcionalidades
- Verificação e liberação de portas (5173, 4173, 6006, 3000)
- Encerramento de processos travados (Node, Vite, Storybook)
- Limpeza de cache (node_modules/.vite, .next, .turbo)
- Validação de dependências (npm install)
- Diagnóstico rápido de ambiente

## Uso

```sh
npx @educacross/preflight-doctor
# ou
npm run preflight
```

## Parâmetros
- `--fix` : Tenta corrigir automaticamente os problemas encontrados
- `--ports=5173,4173` : Define portas customizadas

## Exemplo de integração
No `package.json` do projeto:
```json
{
  "scripts": {
    "preflight": "npx @educacross/preflight-doctor"
  }
}
```

## Roadmap
- Suporte multiplataforma (Linux/Mac)
- Flags customizadas
- Relatório detalhado
