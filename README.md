# Troubleshooting: Erros comuns e como resolver

### 1. Erros de dependências React/TypeScript

**Sintomas:**
- "Não é possível localizar o módulo 'react' ou suas declarações de tipo correspondentes."
- "O elemento JSX implicitamente tem o tipo 'any' porque não há uma interface de 'JSX.IntrinsicElements'."
- "Essa marca JSX requer a existência do caminho do módulo 'react/jsx-runtime', mas não foi possível encontrar nenhum."

**Como resolver:**
1. Execute:
	 ```powershell
	 npm install react react-dom @types/react @types/react-dom
	 npm install
	 ```
2. Se persistir, apague a pasta `node_modules` e rode `npm install` novamente.

### 2. Erros de código corrompido (duplicidade, resíduos)

**Sintomas:**
- "Não é possível redeclarar a variável exportada 'default'."
- "Implementação de função duplicada."
- "Não é possível encontrar o nome 'missions', 'metrics', 'Button', etc."

**Como resolver:**
1. Abra o arquivo indicado (ex: `src/App.tsx`).
2. Apague todo o conteúdo e cole apenas:
	 ```tsx
	 import React from 'react'
	 import Dashboard from './components/Dashboard'

	 export default function App() {
		 return (
			 <div className="min-h-screen bg-background p-6">
				 <Dashboard />
			 </div>
		 )
	 }
	 ```
3. Salve e rode `npm run dev`.

### 3. Outras dicas

- Sempre faça hard refresh (Ctrl+Shift+R) após alterações.
- Se o erro persistir, envie prints do console e o conteúdo dos arquivos para análise.

---

## Suporte

Se precisar de ajuda, envie prints e o conteúdo dos arquivos para o time técnico.
# Prototipo Jornada - Educacross

Este repositorio concentra o prototipo React utilizado para explorar o fluxo de envio de missoes em lote na plataforma da Educacross.

## Como rodar

```powershell
npm install
npm run dev
```

O Vite inicia por padrao em `http://localhost:5173`.

## Solucoes implementadas

- Remocao das etiquetas de status do quadro de progresso para deixar o layout mais limpo.
- Padronizacao da estrutura: conteudo que estava em `prototype-react/` foi movido para a raiz do projeto.
- Atualizacao do guia de execucao apontando para a nova estrutura.

## Backlog

| Item | Descricao | Status |
| ---- | --------- | ------ |
| BL-01 | Remover labels de status e legenda de progresso | Concluido |
| BL-02 | Mover prototipo React para a raiz do repositorio | Concluido |
| BL-03 | Colar telas e assets restantes em `src/components` | Pendente |
| BL-04 | Adicionar Storybook ao projeto | Pendente |
| BL-05 | Adicionar testes (React Testing Library / Playwright) | Pendente |
