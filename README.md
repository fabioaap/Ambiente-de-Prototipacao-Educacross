# Diagnóstico e estabilização de ambiente

Antes de rodar o projeto, execute:

```sh
npm run preflight
```

Esse comando utiliza o utilitário `@educacross/preflight-doctor` para:
- Verificar e liberar portas (5173, 4173, 6006, 3000)
- Encerrar processos travados
- Limpar cache de build
- Validar dependências

Para corrigir automaticamente, rode:

```sh
npm run preflight -- --fix
```

Veja mais detalhes e opções em [`packages/preflight-doctor/README.md`](./packages/preflight-doctor/README.md).
# Prototipo Jornada - Educacross

Prototipo React utilizado para simular o fluxo de envio de missoes em lote na plataforma Educacross.

## Como rodar o app

```powershell
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173`.

## Storybook - Documentação de Componentes

Storybook é a fonte de verdade para documentação, testes visuais e validação de componentes.

### Como rodar o Storybook

```powershell
# Servidor de desenvolvimento
npm run storybook

# Build estático (para CI/CD ou deploy)
npm run storybook:build
```

A instância local roda em `http://localhost:6006` e reusa o mesmo design system e mocks do aplicativo.

### Estrutura de Stories

Stories estão localizadas ao lado dos componentes:
```
src/
├── components/
│   ├── Dashboard.tsx
│   ├── Dashboard.stories.tsx    ← Story do Dashboard
│   └── ui/
│       ├── button.tsx
│       ├── Button.stories.tsx   ← Story do Button
│       ├── card.tsx
│       └── Card.stories.tsx     ← Story do Card
```

### Criando uma nova Story

1. **Arquivo:** Crie `NomeComponente.stories.tsx` ao lado do componente
2. **Template:** Use o padrão CSF 3.0 (Component Story Format)

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Click me', variant: 'default' },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
```

### Documentação de Jornadas

Jornadas de usuário são documentadas em Markdown na pasta `docs/journeys/`:

```
docs/journeys/
├── 01-professor-frontend.md      ← Jornada do Professor
├── 02-admin-backoffice.md        ← Jornada do Administrador
└── 03-student-games-platform.md  ← Jornada do Aluno
```

Cada jornada contém:
- 👤 Persona
- 🎯 Objetivo
- 📋 Fluxo passo-a-passo
- 📊 Critérios de aceitação
- 🚀 Componentes necessários
- 🔄 Fluxos alternativos

### Adons e Integrações

O Storybook já vem configurado com:
- `@storybook/addon-essentials` — Docs, Controls, Actions
- `@storybook/addon-interactions` — Testes de interação
- `@storybook/addon-links` — Navegação entre stories
- `@storybook/addon-docs` — Documentação MDX

### Próximos Passos

- [ ] Integrar Chromatic para visual regression testing
- [ ] Sincronizar Figma via storybook-connect
- [ ] Criar testes visuais automáticos

## Testes

```powershell
npm run test
npm run test:coverage
```

Vitest esta configurado com Testing Library e ambiente JSDOM. Ha um teste de fumaca para o componente `Dashboard` validando a renderizacao dos mocks centralizados.

## Verificacao automatica de ambiente

Para usuarios nao-tecnicos ou quando o ambiente parecer "quebrado", execute:

```powershell
npm run check-env
```

Este comando verifica automaticamente:
- ✅ Dependencias instaladas
- ✅ TypeScript compila sem erros
- ✅ Todos os testes Passam
- ✅ Build de producao funciona

Se tudo estiver OK, voce vera uma mensagem de sucesso com instrucoes de uso.

## Protótipos

### Stage01 - Landing Page Vuexy Inspired

Protótipo de landing page inspirado na estética moderna do template Vuexy, implementado com Next.js, React, TypeScript e Tailwind CSS.

**Características:**
- Design system consistente com cores e tipografia inspiradas no Vuexy
- Componentes reutilizáveis (`shadcn/ui`)
- Layout responsivo e moderno
- Seções: Herói, Como Funciona, Benefícios, CTA e Rodapé

**Como acessar:**
```powershell
npm run dev
# Acesse: http://localhost:5174/prototipo/stage01
```

**Arquivos relacionados:**
- `apps/prototipo/stage01/page.tsx` - Página principal
- `apps/prototipo/stage01/components/` - Componentes das seções
- `tailwind.config.js` - Configuração com cores Vuexy
- `apps/prototipo/stage01/page.test.tsx` - Testes da página

## Sistema de Configuracao de IA

Este projeto possui um **sistema robusto de instrucoes** para GitHub Copilot e Cursor AI, garantindo que todo codigo gerado siga padroes de qualidade rigorosos.

### Arquivos de configuracao

| Arquivo | Proposito | Usado por |
| ------- | --------- | --------- |
| `.github/copilot-instructions.md` | Instrucoes completas para Copilot | GitHub Copilot |
| `.cursorrules` | Instrucoes para Cursor AI | Cursor AI |
| `.prompts/instructions.md` | Prompt orquestrador principal | Ambos |
| `.prompts/blocks/` | Blocos modulares de instrucoes | Sistema de prompts |

### Padroes obrigatorios (NAO NEGOCIAVEIS)

1. **Idioma:** 100% portugues do Brasil (pt-BR) — codigo, commits, documentacao, testes
2. **Apresentar 2-3 opcoes** com pros/contras e custo/prazo antes de implementar
3. **Pedir confirmacao** antes de acoes irreversiveis (delecoes, migracoes)
4. **Finalizar com autoavaliacao:**
   - Clareza (0-10)
   - Completude (0-10)
   - Eficiencia (0-10)
   - Nivel de confianca (0-100%)

### Stack padrao

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui
- **Estado:** Zustand + React Query
- **Backend:** Node.js + NestJS + Fastify
- **Banco:** PostgreSQL + Prisma
- **Infra:** Redis, BullMQ, S3, Docker, GitHub Actions
- **Testes:** Vitest + Playwright + Storybook
- **Arquitetura:** Limpa/Hexagonal (Dominio → Aplicacao → Infra → Interface)

### Definicao de Pronto (DoD)

Uma entrega so e "pronta" quando:

- [ ] Codigo compila e todos os testes passam (≥80% cobertura)
- [ ] Flags e coortes documentadas, com TTL e owner (se aplicavel)
- [ ] Logs estruturados e SLIs verificados
- [ ] Documentacao atualizada (README/ADR/Storybook/OpenAPI)
- [ ] Checklist de PR completo
- [ ] Rollback documentado

### Como validar configuracoes

Para verificar se Copilot/Cursor estao seguindo as instrucoes:

1. **Teste simples:** Peca ao Copilot para criar um componente — ele deve apresentar 2-3 opcoes, usar pt-BR e finalizar com autoavaliacao
2. **Verifique logs:** Copilot deve mencionar `.github/copilot-instructions.md` como fonte
3. **Cursor AI:** Deve referenciar `.cursorrules` e `.prompts/instructions.md`

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
