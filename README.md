# Prototipo Jornada - Educacross

Prototipo React utilizado para simular o fluxo de envio de missoes em lote na plataforma Educacross.

## Como rodar o app

```powershell
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173`.

## Storybook

```powershell
npm run storybook
npm run storybook:build
```

A instancia local roda em `http://localhost:6006` e reutiliza o mesmo design system e mocks do aplicativo.

## Testes

```powershell
npm run test
npm run test:coverage
```

Vitest esta configurado com Testing Library e ambiente JSDOM. Ha um teste de fumaca para o componente `Dashboard` validando a renderizacao dos mocks centralizados.

## Troubleshooting rapido

- Execute `npm install` sempre que o `package-lock.json` mudar.
- Se o Vite subir em outra porta, use `npm run preview` para conferir se a build continua integra.
- Se os tipos do React sumirem no VS Code, reinicie o servidor TypeScript (`CTRL+SHIFT+P` -> TypeScript: Restart TS server).

## Solucoes implementadas

- Remocao das labels redundantes no quadro de progresso.
- Estrutura consolidada na raiz (o diretorio `prototype-react/` agora reexporta os mesmos assets).
- Mocks de missoes centralizados em `src/mocks` e compartilhados pelo prototipo legado.
- Configuracao de Storybook (Vite) e Vitest + Testing Library.

## Backlog

| Item  | Descricao                                                  | Status    |
| ----- | ---------------------------------------------------------- | --------- |
| BL-01 | Remover labels de status e legenda de progresso            | Concluido |
| BL-02 | Mover prototipo React para a raiz do repositorio           | Concluido |
| BL-03 | Colar telas e assets restantes em `src/components`         | Concluido |
| BL-04 | Adicionar Storybook ao projeto                             | Concluido |
| BL-05 | Adicionar testes (React Testing Library / Playwright)      | Concluido |
