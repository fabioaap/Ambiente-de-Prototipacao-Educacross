# 📋 Operação Diária - Plataforma de Prototipagem

## ⚡ Quick Start (5 minutos)

```powershell
# 1. Clonar repo (primeira vez)
git clone <repo> && cd <repo>

# 2. Instalar dependências
npm install

# 3. Iniciar Storybook
npm run storybook

# 4. Abrir navegador
http://localhost:6006
```

---

## 🎯 Tarefas Diárias por Papel

### 👨‍🎨 **Designer**

#### Manhã (30 min)
- [ ] Abrir Storybook: `npm run storybook`
- [ ] Verificar **Docs > Components** para mudanças overnight
- [ ] Se houver novos componentes, validar com specs

#### Desenvolvimento (2 horas)
- [ ] Criar mockups no Figma
- [ ] Documentar em Storybook Controls:
  - Cor primária
  - Tamanho da fonte
  - Padding/Margin
  - Estados (hover, active, disabled)

#### Validação (1 hora)
- [ ] Comparar com Figma design
- [ ] Testar variações
- [ ] Aprovar ou solicitar ajustes no Slack

---

### 💻 **Developer Frontend**

#### Setup (1ª vez)
```powershell
# Clonar
git clone <repo> && cd <repo>

# Instalar
npm install

# Executar todos os checks
npm run check-env

# Iniciar dev
npm run dev          # App
npm run storybook    # Em outra aba
```

#### Daily Tasks

**Antes de começar:**
```powershell
git pull origin main
npm install  # Se package.json mudou
```

**Implementar Componente:**
1. Leia a jornada em `docs/journeys/XX-*.md`
2. Identifique componentes necessários
3. Crie componente em `src/components/`

**Exemplo: Criar ClassSelector**
```typescript
// src/components/ClassSelector.tsx
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

4. Crie Story ao lado:
```typescript
// src/components/ClassSelector.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ClassSelector } from './ClassSelector'

const meta: Meta<typeof ClassSelector> = {
  title: 'Components/ClassSelector',
  component: ClassSelector,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classes: [
      { id: '1', name: '7º Ano A' },
      { id: '2', name: '7º Ano B' },
      { id: '3', name: '7º Ano C' },
    ],
    onSelect: (id) => console.log('Selecionou:', id),
  },
}

export const Empty: Story = {
  args: {
    classes: [],
    onSelect: () => {},
  },
}
```

5. Teste no Storybook
6. Commit e push

**Verificações Antes de Push:**
```powershell
# Testes
npm run test

# Type check
npm run check-types

# Build
npm run build

# Git add e commit
git add .
git commit -m "feat: adicionar ClassSelector"
git push origin <branch>
```

---

### 📊 **Product Manager**

#### Manhã (1 hora)
- [ ] Verificar status das jornadas: `docs/journeys/`
- [ ] Validar protótipos em `npm run storybook`
- [ ] Confirmar requisitos com PM de produto

#### Meio do dia (2 horas)
- [ ] Atualizar documentação de jornada se houver mudanças
- [ ] Comunicar feedback ao time dev

#### Final do dia (1 hora)
- [ ] Resumo do progresso
- [ ] Próximas prioridades para dev

---

## 📍 Cenários Comuns

### Cenário 1: Validar Nova Story

```powershell
# Dev criou novo componente
git pull origin main

# Abrir Storybook
npm run storybook

# Ir para: Components > NomeComponente
# Testar com Controls
# Comparar com Figma design

# Se OK: 👍 aprova no Slack
# Se não: ⚠️ sugere mudanças
```

### Cenário 2: Adicionar Requisito à Jornada

1. **Editar:** `docs/journeys/01-professor-frontend.md`
2. **Atualizar fluxo** ou **adicionar novo CA**
3. **Comunicar** ao dev: "Atualizei jornada com novo requisito"
4. **Dev implementa**

### Cenário 3: Atualizar Componente Existing

```powershell
# Edit: src/components/ui/Button.tsx
# Edit: src/components/ui/Button.stories.tsx
# Test: npm run test
# Push: git push

# Storybook hot-reloads automaticamente
# Designer valida na hora
```

### Cenário 4: Resolverem Conflito

```powershell
# Se houver merge conflict
git pull origin main
# Resolver manualmente em VS Code
git add .
git commit -m "fix: resolver merge conflict"
git push origin <branch>
```

---

## ✅ Checklist Diário

### Dev

- [ ] `git pull` antes de começar
- [ ] `npm install` se `package.json` mudou
- [ ] Rode `npm run test` antes de push
- [ ] Rode `npm run storybook` para validar visualmente
- [ ] Commits em pt-BR
- [ ] Stories criadas para componentes novos

### Designer

- [ ] Storybook aberto para validação
- [ ] Figma sincronizado com latest da main
- [ ] Feedback comunicado no Slack/GitHub
- [ ] Aprovações documentadas

### PM

- [ ] Jornadas atualizadas
- [ ] Requisitos claros para dev
- [ ] Feedback dos usuários coletado
- [ ] Prioridades definidas

---

## 🚨 Troubleshooting Rápido

### "Storybook não abre"
```powershell
# 1. Kill processo anterior
Ctrl+C

# 2. Limpar cache
rm -r node_modules/.cache
rm -r .storybook/.cache

# 3. Reinstalar
npm install

# 4. Tentar novamente
npm run storybook
```

### "Component não aparece no Storybook"
- [ ] Arquivo `.stories.tsx` está ao lado do componente?
- [ ] Tem `export default meta` no arquivo?
- [ ] Storybook foi reiniciado após criar arquivo?

### "Tipos do TypeScript erram"
```powershell
# Reiniciar servidor TS no VS Code
CTRL+SHIFT+P → TypeScript: Restart TS Server
```

### "npm install falha"
```powershell
# Limpar cache
npm cache clean --force

# Reinstalar
rm package-lock.json
npm install --legacy-peer-deps
```

---

## 📚 Referências Rápidas

| Tarefa | Comando |
|--------|---------|
| Iniciar Storybook | `npm run storybook` |
| Rodar testes | `npm run test` |
| Build para produção | `npm run build` |
| Check de tipos | `npm run check-types` |
| Atualizar dependências | `npm update` |
| Git status | `git status` |

---

## 🎯 Objetivos Semanais

### Semana 1
- [ ] Setup Storybook ✅
- [ ] 3 Jornadas documentadas ✅
- [ ] 10+ Stories criadas ✅
- [ ] Design System no Figma pronto

### Semana 2
- [ ] Front-office componentes inicializados
- [ ] Validação com designer
- [ ] Feedback coletado

### Semana 3
- [ ] Front-office 80% completo
- [ ] Início Backoffice
- [ ] Chromatic integrado

---

## 📞 Contatos

| Role | Slack | Disponível |
|------|-------|------------|
| PM | @[Nome] | 9h-12h, 14h-17h |
| Designer | @[Nome] | 10h-12h, 15h-18h |
| Tech Lead | @[Nome] | 9h-18h (responde em 1h) |

---

## 📝 Logs de Atividade

Use este template para comunicar progresso:

```markdown
## [Data] - Progresso Diário

### ✅ Concluído
- [ ] Tarefa 1
- [ ] Tarefa 2

### ⏳ Em Progresso
- [ ] Tarefa 3

### 🚧 Bloqueado
- Esperando feedback de [Pessoa]

### 📅 Próximo
- [ ] Tarefa 4
```

---

**Última atualização:** 2024-11-04  
**Próxima review:** 2024-11-11