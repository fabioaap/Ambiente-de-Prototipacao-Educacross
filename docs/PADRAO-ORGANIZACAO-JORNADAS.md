# Padrão de Organização de Jornadas

Este documento define o padrão para estruturação de novas jornadas/protótipos no monorepo Educacross.

---

## Estrutura Base de uma Jornada

```
[Front-office | Back-office | Game]/
  └── [Nome da Jornada]/
      ├── README.md              # Documentação principal
      ├── CHANGELOG.md           # Histórico de mudanças
      ├── assets/                # Imagens, ícones, fontes
      ├── src/
      │   ├── components/        # Componentes React/Vue
      │   │   ├── [Feature]/     # Componentes por feature
      │   │   │   ├── index.ts
      │   │   │   ├── [Component].tsx
      │   │   │   ├── __tests__/ # Testes unitários
      │   │   │   └── __stories__/ # Storybook (opcional)
      │   │   └── ui/            # Componentes genéricos (shadcn, etc.)
      │   ├── hooks/             # React hooks customizados
      │   ├── lib/               # Utilitários (utils, helpers)
      │   ├── mocks/             # Dados mockados
      │   ├── stores/            # Estado global (Zustand, Pinia, Redux)
      │   ├── types/             # TypeScript types/interfaces
      │   ├── test/              # Setup de testes
      │   ├── App.tsx            # Componente raiz
      │   ├── main.tsx           # Entrypoint
      │   └── index.css          # Estilos globais
      ├── public/                # Assets estáticos (opcional)
      ├── package.json           # Dependências da jornada (opcional, se isolada)
      └── vite.config.ts         # Config de build (se isolada)
```

---

## Checklist para Novas Jornadas

### 1. Planejamento e Documentação
- [ ] Criar pasta com nome descritivo em `Front-office/`, `Back-office/` ou `Game/`
- [ ] Criar `README.md` com:
  - Visão geral da jornada
  - Estrutura de pastas
  - Stack técnica
  - Comandos disponíveis
  - Fluxo da jornada
  - Checklist de validação
- [ ] Criar `CHANGELOG.md` para histórico de mudanças

### 2. Estrutura de Código
- [ ] Criar subpastas: `src/`, `assets/`, `public/` (se necessário)
- [ ] Organizar componentes por feature em `src/components/[Feature]/`
- [ ] Criar pasta `src/components/ui/` para componentes reutilizáveis
- [ ] Criar pasta `src/mocks/` com dados mockados (interfaces TypeScript)
- [ ] Criar pasta `src/stores/` para estado global (Zustand/Pinia)
- [ ] Criar pasta `src/types/` para TypeScript types
- [ ] Criar pasta `src/lib/` para utilitários
- [ ] Criar pasta `src/test/` para setup de testes

### 3. Configuração de Build e Testes
- [ ] Configurar `vite.config.ts` (se jornada isolada)
- [ ] Configurar `vitest.config.ts` para testes
- [ ] Configurar `.storybook/` se necessário (componentes visuais)
- [ ] Adicionar scripts no `package.json`:
  - `dev`, `build`, `preview`
  - `test`, `test:coverage`
  - `storybook`, `storybook:build`
  - `preflight`

### 4. Qualidade e Padrões
- [ ] TypeScript em modo `strict`
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Commits seguem padrão Conventional Commits
- [ ] 100% dos componentes tipados
- [ ] Cobertura de testes ≥ 80%

### 5. Documentação Visual
- [ ] Screenshots/imagens do fluxo em `assets/`
- [ ] Storybook com variações de estado (loading, error, success)
- [ ] ADR (Architecture Decision Records) para decisões técnicas

### 6. Integração com Monorepo
- [ ] Importar componentes de `packages/ui` se disponível
- [ ] Usar tokens de design de `packages/tokens` se disponível
- [ ] Reutilizar utilitários de `packages/preflight-doctor`
- [ ] Seguir padrões de nomenclatura e estrutura do monorepo

---

## Nomenclatura e Convenções

### Pastas
- Use **PascalCase** para componentes: `MissionBatch/`
- Use **kebab-case** para utilitários: `date-utils.ts`
- Use **camelCase** para stores: `missionBatchStore.ts`

### Arquivos
- Componentes: `[ComponentName].tsx`
- Testes: `[ComponentName].test.tsx`
- Stories: `[ComponentName].stories.tsx`
- Types: `[feature-name].ts`
- Mocks: `[feature-name].ts`

### Commits
- `feat:` para novas funcionalidades
- `fix:` para correções
- `refactor:` para refatorações
- `docs:` para documentação
- `test:` para testes
- `chore:` para tarefas de manutenção

---

## Exemplo Prático

### Jornada: "Sistema de Gamificação para Alunos"

```
Game/
  └── Sistema de Gamificação/
      ├── README.md
      ├── CHANGELOG.md
      ├── assets/
      │   ├── badge-ouro.svg
      │   ├── badge-prata.svg
      │   └── medalha-conquista.png
      ├── src/
      │   ├── components/
      │   │   ├── BadgeDisplay/
      │   │   │   ├── index.ts
      │   │   │   ├── BadgeDisplay.tsx
      │   │   │   ├── __tests__/
      │   │   │   │   └── BadgeDisplay.test.tsx
      │   │   │   └── __stories__/
      │   │   │       └── BadgeDisplay.stories.tsx
      │   │   ├── LeaderBoard/
      │   │   └── ui/
      │   ├── hooks/
      │   │   └── useGameProgress.ts
      │   ├── lib/
      │   │   └── game-utils.ts
      │   ├── mocks/
      │   │   └── badges.ts
      │   ├── stores/
      │   │   └── gameStore.ts
      │   ├── types/
      │   │   └── game.ts
      │   ├── test/
      │   │   └── setup.ts
      │   ├── App.tsx
      │   ├── main.tsx
      │   └── index.css
      └── vite.config.ts
```

---

## Checklist de Validação Final

Antes de considerar uma jornada "pronta":

- [ ] README completo e atualizado
- [ ] Todos os componentes documentados (Storybook)
- [ ] Testes passando com ≥80% de cobertura
- [ ] Build funcionando sem erros
- [ ] TypeScript sem erros
- [ ] Commits seguem padrão
- [ ] ADR criado (se decisões técnicas importantes)
- [ ] CHANGELOG atualizado

---

## Recursos e Referências

- **Documentação Geral:** `docs/INDEX.md`
- **ADR Template:** `docs/adr/ADR-0000-template.md`
- **Journey Template:** `docs/journeys/`
- **Guia de Contribuição:** `CONTRIBUTING.md` (raiz do projeto)
