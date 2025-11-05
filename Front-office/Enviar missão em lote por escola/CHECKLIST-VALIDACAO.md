# Checklist de Validação Final - Jornada: Enviar Missão em Lote por Escola

Data: 04/11/2025  
Status: 🔄 Em Validação

---

## ✅ Build e Ambiente

- [ ] `npm run preflight` executa sem erros
- [ ] `npm run preflight -- --fix` corrige problemas automaticamente
- [ ] `npm install --legacy-peer-deps` instala todas as dependências
- [ ] `npm run build` finaliza sem erros
- [ ] `npm run preview` carrega a aplicação em `http://localhost:5173/`
- [ ] Não há processos Node travados (verificar com `netstat -ano | Select-String ":5173"`)
- [ ] Cache limpo (`node_modules/.vite`, `.next`, `.turbo` removidos se necessário)

---

## ✅ Testes

- [ ] `npm run test` executa todos os testes sem falhas
- [ ] `npm run test:coverage` gera relatório com ≥80% de cobertura
- [ ] Testes unitários validam:
  - [ ] `ClassSelector` - seleção de turmas
  - [ ] `MissionCatalog` - busca e seleção de missões
  - [ ] `DateRangePicker` - validação de datas
  - [ ] `ReviewModal` - exibição de resumo
  - [ ] `ProgressBar` - estados de progresso
  - [ ] `SuccessNotification` - notificações de sucesso/erro
  - [ ] `missionBatchStore` - lógica de estado (Zustand)
- [ ] Testes de integração validam fluxo completo do wizard (E2E opcional)

---

## ✅ Storybook

- [ ] `npm run storybook` inicia sem erros em `http://localhost:6006/`
- [ ] Stories criadas para todos os componentes principais:
  - [ ] `ClassSelector.stories.tsx` - Default, Error, Disabled
  - [ ] `MissionCatalog.stories.tsx` - Default, Search, Empty
  - [ ] `DateRangePicker.stories.tsx` - Empty, Valid, Invalid
  - [ ] `ReviewModal.stories.tsx` - Confirm, Loading, Conflict
  - [ ] `ProgressBar.stories.tsx` - 0%, 50%, 100%
  - [ ] `SuccessNotification.stories.tsx` - Success, Partial, Error
  - [ ] `MissionBatchWizard.stories.tsx` - Full flow
- [ ] Variações de estado documentadas (loading, error, success, disabled)
- [ ] Acessibilidade validada (WCAG AA+)
- [ ] Responsividade testada (mobile, tablet, desktop)

---

## ✅ Qualidade de Código

- [ ] `npm run check-types` (ou `tsc --noEmit`) sem erros
- [ ] Todos os componentes 100% tipados (TypeScript strict)
- [ ] Imports organizados e sem referências quebradas
- [ ] Componentes seguem padrão de nomenclatura:
  - PascalCase para componentes
  - camelCase para stores/hooks
  - kebab-case para types/mocks
- [ ] Nenhum `console.log` ou código de debug em produção
- [ ] Nenhum comentário `TODO` ou `FIXME` sem issue vinculada

---

## ✅ Documentação

- [ ] `README.md` da jornada completo com:
  - Visão geral
  - Estrutura de pastas
  - Stack técnica
  - Comandos disponíveis
  - Fluxo da jornada
  - Checklist de validação
  - Próximos passos
- [ ] `CHANGELOG.md` atualizado com:
  - Data da release
  - Features adicionadas
  - Bugs corrigidos
  - Breaking changes (se houver)
- [ ] ADR (Architecture Decision Records) criado para decisões técnicas importantes
- [ ] Screenshots/imagens do fluxo em `assets/` documentados

---

## ✅ Organização e Estrutura

- [ ] Toda a jornada está em `Front-office/Enviar missão em lote por escola/`
- [ ] Assets (imagens, ícones) estão em `assets/`
- [ ] Código está em `src/` com subpastas organizadas:
  - `components/`
  - `mocks/`
  - `stores/`
  - `types/`
  - `lib/`
  - `test/`
- [ ] Não há arquivos residuais fora da estrutura da jornada
- [ ] Pasta antiga `Front-office/src/` foi removida
- [ ] Pasta antiga `Telas do fluxo/` foi removida

---

## ✅ Integração com Monorepo

- [ ] Componentes de UI reutilizáveis estão em `src/components/ui/`
- [ ] Utiliza utilitário `preflight-doctor` do monorepo (`npm run preflight`)
- [ ] Segue padrões de nomenclatura e estrutura do monorepo
- [ ] Documentação referencia corretamente outros pacotes/jornadas

---

## ✅ Git e Versionamento

- [ ] Commits seguem padrão Conventional Commits:
  - `feat:` para novas funcionalidades
  - `fix:` para correções
  - `refactor:` para refatorações
  - `docs:` para documentação
  - `test:` para testes
  - `chore:` para tarefas de manutenção
- [ ] Branch `React` está atualizada
- [ ] Não há conflitos de merge pendentes
- [ ] `.gitignore` configurado corretamente

---

## 📋 Resumo de Status

| Categoria | Status | Observações |
|-----------|--------|-------------|
| Build e Ambiente | 🔄 | Validar `npm run build` e `npm run preview` |
| Testes | ⏳ | Criar testes unitários para componentes |
| Storybook | ⏳ | Criar stories para todos os componentes |
| Qualidade de Código | ✅ | TypeScript strict configurado |
| Documentação | ✅ | README e padrão de jornadas criados |
| Organização | ✅ | Estrutura modularizada e limpa |
| Integração Monorepo | ✅ | Preflight-doctor integrado |
| Git e Versionamento | ✅ | Commits padronizados |

**Legenda:**  
✅ Completo | 🔄 Em progresso | ⏳ Pendente | ❌ Bloqueado

---

## 🚀 Próximos Passos

1. Executar `npm run build` e validar build de produção
2. Executar `npm run preview` e testar aplicação localmente
3. Criar stories completas para Storybook (Fase 3 do roadmap)
4. Criar testes unitários com ≥80% de cobertura (Fase 4 do roadmap)
5. Validar responsividade e acessibilidade
6. Atualizar CHANGELOG com features implementadas
7. Commitar e fazer push das alterações

---

## 📝 Notas Adicionais

- Preflight-doctor funcionando corretamente (`npm run preflight`)
- Estrutura de jornada 100% modularizada
- Padrão de organização documentado para futuras jornadas
- Assets e imagens organizados em `assets/`
