# Jornada: Enviar Missão em Lote por Escola

## Visão Geral

Protótipo da funcionalidade de envio de missões em lote para múltiplas turmas/escolas, com seleção de catálogo, agendamento e revisão prévia.

---

## Estrutura do Projeto

```
Enviar missão em lote por escola/
├── assets/                      # Imagens, ícones e assets visuais
│   ├── Drawer 1@2x.png
│   ├── Drawer 2@2x.png
│   ├── Drawer 3@2x.png
│   ├── Drawer 4@2x.png
│   ├── Drawer 5@2x.png
│   └── Sistema de ensino.png
├── src/
│   ├── components/
│   │   ├── MissionBatch/       # Componentes da jornada
│   │   │   ├── ClassSelector.tsx
│   │   │   ├── MissionCatalog.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── ReviewModal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── SuccessNotification.tsx
│   │   │   ├── MissionBatchWizard.tsx
│   │   │   └── index.ts
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ui/                 # Componentes de UI reutilizáveis
│   │   └── __tests__/          # Testes unitários
│   ├── mocks/
│   │   ├── mission-batch.ts    # Dados mockados de turmas/missões
│   │   └── missions.ts         # Dados de missões (catálogo)
│   ├── stores/
│   │   └── missionBatchStore.ts # Zustand store (estado global)
│   ├── types/
│   │   └── mission-batch.ts    # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts            # Utilitários (cn, etc.)
│   ├── test/
│   │   └── setup.ts            # Configuração de testes
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Entrypoint
│   └── index.css               # Estilos globais
└── README.md                   # Este arquivo
```

---

## Stack Técnica

- **Framework:** React 18 + TypeScript (strict)
- **Estado:** Zustand
- **UI:** Tailwind CSS + shadcn/ui
- **Build:** Vite
- **Testes:** Vitest + Testing Library
- **Documentação:** Storybook

---

## Comandos Disponíveis

### Desenvolvimento
```sh
npm run dev
```
Inicia o servidor de desenvolvimento em `http://localhost:5173/`.

### Build
```sh
npm run build
```
Gera a build de produção na pasta `dist/`.

### Preview
```sh
npm run preview
```
Serve a build de produção para validação local.

### Testes
```sh
npm run test
npm run test:coverage
```
Executa testes unitários com Vitest e gera relatório de cobertura.

### Storybook
```sh
npm run storybook
```
Inicia o Storybook em `http://localhost:6006/` para visualizar componentes isolados.

### Diagnóstico de Ambiente
```sh
npm run preflight
npm run preflight -- --fix
```
Valida e corrige problemas comuns (portas ocupadas, cache, dependências).

---

## Checklist de Validação

### ✅ Build e Ambiente
- [ ] `npm run preflight` sem erros
- [ ] `npm run build` finaliza sem erros
- [ ] `npm run preview` carrega a aplicação corretamente
- [ ] Todas as dependências instaladas (`npm install --legacy-peer-deps`)

### ✅ Testes
- [ ] `npm run test` passa sem falhas
- [ ] Cobertura de código ≥ 80% nos componentes críticos
- [ ] Testes de integração validam fluxo completo do wizard

### ✅ Storybook
- [ ] `npm run storybook` carrega sem erros
- [ ] Todos os componentes principais têm stories documentadas
- [ ] Variações de estado (loading, error, success) documentadas
- [ ] Acessibilidade validada em todos os componentes

### ✅ Qualidade de Código
- [ ] Sem erros de TypeScript (`npm run check-types`)
- [ ] Imports organizados e sem referências quebradas
- [ ] Componentes seguem padrão de nomenclatura e estrutura

### ✅ Documentação
- [ ] README atualizado com comandos e estrutura
- [ ] ADR (Architecture Decision Records) criado para decisões técnicas
- [ ] CHANGELOG atualizado com novas features

---

## Fluxo da Jornada

1. **Seleção de Turmas** → ClassSelector
2. **Escolha de Missões** → MissionCatalog
3. **Agendamento** → DateRangePicker
4. **Revisão e Confirmação** → ReviewModal
5. **Envio e Progresso** → ProgressBar
6. **Notificação de Sucesso** → SuccessNotification

---

## Próximos Passos

- [ ] Implementar stories completas para todos os componentes
- [ ] Adicionar testes E2E com Playwright
- [ ] Integrar com backend real (API REST)
- [ ] Adicionar suporte a i18n (português/inglês)
- [ ] Otimizar performance (lazy loading, memoization)

---

## Contato e Suporte

- **Documentação Geral:** Ver `docs/` na raiz do projeto
- **ADRs:** Ver `docs/adr/`
- **Jornadas:** Ver `docs/journeys/JOURNEY-envio-missoes-em-lote.md`
