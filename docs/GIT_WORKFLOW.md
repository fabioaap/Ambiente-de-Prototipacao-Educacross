# 📝 Guia: Como Fazer Commit & PR

## ✅ Antes de Fazer Commit

1. **Verificar mudanças:**
```powershell
git status
```

2. **Rodar testes:**
```powershell
npm run test
npm run check-types
```

3. **Validar no Storybook:**
```powershell
npm run storybook
# Abrir em http://localhost:6006 e validar visualmente
```

---

## 📋 Regras Obrigatórias de Commit

### 1. **100% Português do Brasil (pt-BR)**
✅ **Correto:**
```
feat: adicionar ClassSelector para seleção de turmas
docs: atualizar STORYBOOK_GUIDE.md com exemplos
chore: organizar estrutura de pastas
```

❌ **Errado:**
```
feat: add ClassSelector
docs: update guide
chore: reorganize files
```

### 2. **Formato de Mensagem**
Use o padrão Conventional Commits:
```
<tipo>(<escopo>): <mensagem curta>

<descrição detalhada (opcional)>

<footer (optional)>
```

**Tipos válidos:**
- `feat:` — Nova feature
- `fix:` — Correção de bug
- `docs:` — Documentação
- `style:` — Formatação (sem lógica)
- `refactor:` — Refatoração (sem feature)
- `perf:` — Melhoria de performance
- `test:` — Testes
- `chore:` — Manutenção

**Escopos válidos:**
- `components` — Componentes React
- `storybook` — Configuração Storybook
- `docs` — Documentação
- `config` — Configuração geral
- `mocks` — Dados mock
- `types` — Tipos TypeScript

### 3. **Exemplos de Commits Bons**

**Feature:**
```
feat(components): adicionar ClassSelector com filtros

- Implementar componente ClassSelector
- Adicionar 3 stories (Default, Empty, Disabled)
- Validar tipos TypeScript
- Atualizar docs com exemplos

Closes #123
```

**Documentação:**
```
docs(journeys): completar jornada do professor

Adicionar especificação completa de:
- Persona
- Objetivo
- Fluxo em 8 etapas
- Critérios de aceitação
- Componentes necessários
```

**Fix:**
```
fix(storybook): corrigir carregamento de Badge.stories

MDX stories não apareciam. Ajustar configuração
do main.ts para incluir padrão correto.
```

---

## 🔄 Fluxo de Git

### Develop Localmente

1. **Criar branch:**
```powershell
git checkout -b feature/adicionar-class-selector
```

2. **Fazer mudanças:**
- Editar arquivos
- Criar componentes
- Adicionar stories
- Escrever testes

3. **Verificar o que mudou:**
```powershell
git status
git diff src/components/ClassSelector.tsx
```

4. **Stage arquivos:**
```powershell
# Adicionar arquivo específico
git add src/components/ClassSelector.tsx

# Ou adicionar tudo (cuidado!)
git add .
```

5. **Fazer commit:**
```powershell
git commit -m "feat(components): adicionar ClassSelector"

# Ou com editor (mais detalhado)
git commit
```

6. **Push:**
```powershell
git push origin feature/adicionar-class-selector
```

---

## 🤖 Checklist Antes de Push

- [ ] Código compila: `npm run check-types`
- [ ] Testes passam: `npm run test`
- [ ] Sem erros Storybook: Visualmente validar
- [ ] Mensagem em pt-BR
- [ ] Commits atômicos (1 feature por commit)
- [ ] Sem debug logs (`console.log`)
- [ ] Sem `any` types injustificados

---

## 📤 Criar Pull Request (PR)

### Título do PR
```
feat: adicionar componentes ClassSelector e MissionCatalog

Closes #123
```

### Descrição do PR (Usar Template)
```markdown
## 🎯 Descrição
Implementação dos componentes necessários para a jornada do professor 
(Front-office), especificados em docs/journeys/01-*.md

## ✅ Checklist
- [x] Código compila sem erros
- [x] Testes passam (npm run test)
- [x] Stories criadas e validadas
- [x] Documentação atualizada
- [x] Sem breaking changes
- [x] Mensagens em pt-BR

## 📸 Screenshots (se UI)
[Imagem do Storybook ou prototipo]

## 🔗 Related Issues
Closes #123

## 📝 Notas
Componentes seguem padrão de Stories estabelecido.
Validado com designer em [Data/Pessoa].
```

---

## 🎓 Exemplo Completo: Add ClassSelector

### 1. Criar branch
```powershell
git checkout -b feature/class-selector
```

### 2. Implementar componente
**Arquivo:** `src/components/ClassSelector.tsx`
```typescript
import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'

export interface ClassSelectorProps {
  classes: Array<{ id: string; name: string }>
  onSelect: (classId: string) => void
  disabled?: boolean
}

export function ClassSelector({ classes, onSelect, disabled }: ClassSelectorProps) {
  return (
    <Select onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma turma" />
      </SelectTrigger>
      <SelectContent>
        {classes.map((cls) => (
          <SelectItem key={cls.id} value={cls.id}>
            {cls.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### 3. Criar story
**Arquivo:** `src/components/ClassSelector.stories.tsx`
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ClassSelector } from './ClassSelector'

const meta: Meta<typeof ClassSelector> = {
  title: 'Components/ClassSelector',
  component: ClassSelector,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classes: [
      { id: '1', name: '7º Ano A' },
      { id: '2', name: '7º Ano B' },
    ],
    onSelect: (id) => console.log('Selecionou:', id),
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
```

### 4. Testar
```powershell
# Verificar tipos
npm run check-types

# Rodar testes
npm run test

# Validar no Storybook
npm run storybook
# Abrir http://localhost:6006/story/components-classselector--default
```

### 5. Adicionar ao git
```powershell
git add src/components/ClassSelector.tsx
git add src/components/ClassSelector.stories.tsx
```

### 6. Fazer commit
```powershell
git commit -m "feat(components): adicionar ClassSelector

- Implementar seletor de turmas com integração Radix
- Adicionar 2 stories (Default, Disabled)
- Documentação automática via autodocs
- Validado com PM em 2024-11-04"
```

### 7. Push
```powershell
git push origin feature/class-selector
```

### 8. Abrir PR no GitHub
- Título: `feat: adicionar ClassSelector`
- Descrever brevemente
- Citar issue relacionada
- Pedir review de Designer/PM

---

## 🔍 Como Revisar PR

### Para Reviewer

1. **Verificar mudanças:**
   - [ ] Código em pt-BR
   - [ ] Sem breaking changes
   - [ ] Testes relevantes

2. **Clocar branch:**
```powershell
git fetch origin
git checkout origin/feature/class-selector
npm install
npm run storybook
```

3. **Validar:**
   - [ ] Stories renderizam corretamente
   - [ ] Componentes funcionam
   - [ ] Matches Figma design

4. **Aprovar ou sugerir mudanças:**
   - Comentar no PR
   - Pedir alterações se necessário
   - Aprovar com 👍

---

## 📊 Histórico de Commits Esperado

```powershell
git log --oneline -10

# Output esperado:
docs(status): adicionar STATUS_REPORT.md
docs(daily): adicionar guia DAILY_OPERATIONS.md
docs(journeys): documentar 3 jornadas de usuário
feat(storybook): configurar Storybook React-Vite
feat(components): adicionar Badge e Card stories
chore(config): atualizar Tailwind com cores Vuexy
docs(readme): adicionar seção Storybook
feat(components): adicionar Button stories
chore(setup): configurar TypeScript e linting
```

---

## ⚠️ Situações Comuns

### Cenário 1: Esquecer de fazer commit em pt-BR
```powershell
# ❌ Errado
git commit -m "add ClassSelector component"

# ✅ Correto
git commit -m "feat(components): adicionar ClassSelector"

# Corrigir commit anterior
git commit --amend -m "feat(components): adicionar ClassSelector"
git push -f origin feature/...  # ⚠️ Cuidado com --force
```

### Cenário 2: Mudanças muito grandes
```powershell
# ❌ Ruim: Um commit gigante
git commit -m "adicionar tudo que foi feito hoje"

# ✅ Bom: Múltiplos commits pequenos
git commit -m "feat(components): adicionar ClassSelector"
git commit -m "feat(stories): adicionar stories para MissionCatalog"
git commit -m "docs(journeys): completar jornada do professor"
```

### Cenário 3: Branch desatualizado
```powershell
# Atualizar branch com main
git fetch origin
git rebase origin/main

# Se houver conflitos, resolver e continuar
git add .
git rebase --continue

# Push com força
git push -f origin feature/...
```

---

## 📚 Referências

- Conventional Commits: https://www.conventionalcommits.org/
- GitHub Flow: https://guides.github.com/introduction/flow/
- Git Branching: https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows

---

**Dúvidas?** Consulte o team lead ou abra issue no repositório.