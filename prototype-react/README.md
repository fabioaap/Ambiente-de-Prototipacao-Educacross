# Protótipo Jornada — Educacross# Protótipo Jornada — Educacross



> Ambiente de prototipação seguro, rápido e sem erros para designers e PMs da Educacross.Projeto mínimo para colar telas do fluxo e iterar em um protótipo React.



## Como rodar (Windows PowerShell)Como rodar (Windows PowerShell):



```powershell```powershell

cd "./prototype-react"cd "./prototype-react"

npm installnpm install

npm run devnpm run dev

``````



Acesse: [http://localhost:5173](http://localhost:5173)Isso iniciará o Vite em `http://localhost:5173`.



---Próximos passos:

- Colar telas / assets em `src/components` e adicionar rotas

## Cultura e Garantias do Ambiente- Adicionar Storybook

- Adicionar testes com React Testing Library / Playwright

- **Zero tolerância a erro:** O build e o lint bloqueiam qualquer código ou mock inválido antes de chegar ao usuário.
- **Mocks centralizados:** Todos os dados de missões estão em `src/mocks/missions.ts`. Nunca edite mocks em outros arquivos.
- **Automação:** Um script (`scripts/check-mocks.js`) garante que todas as missões começam zeradas. O build falha se houver divergência.
- **CI pronto para evoluir:** O ambiente já está preparado para rodar lint/build/test em PRs.
- **Documentação viva:** Este README e o Storybook são a fonte de verdade para o time de produto.
- **Backlog:** Futuramente, será possível editar os mocks por painel visual, sem tocar em código.

---

## Como editar os dados das missões

1. Edite apenas o arquivo [`src/mocks/missions.ts`](src/mocks/missions.ts).
2. Salve e rode `npm run dev` para ver o resultado.
3. Se tentar criar mocks em outro lugar, o build irá falhar com mensagem clara.

---

## Scripts automáticos

- `npm run check-mocks` — Garante que todas as missões estão zeradas.
- `npm run build` — Roda o check-mocks, lint e build.
- `npm run dev` — Ambiente de prototipação rápido.

---

## Próximos passos
- Colar telas / assets em `src/components` e adicionar rotas
- Adicionar Storybook
- Adicionar testes com React Testing Library / Playwright
- Evoluir para painel visual de edição de mocks (ver backlog)
