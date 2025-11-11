# 📋 Plano de Aprimoramento — Wizard Envio em Lote

**Data:** 04/11/2025  
**Status:** 🟡 **EM PLANEJAMENTO**  
**Base:** `enviar_missoes_em_lote_html_com_drawer_assistente_v5.1.html`  
**Target:** React 18 + TypeScript + Storybook  

---

## 🔍 Análise do HTML Existente

### ✅ O que já existe (v5.1):
- ✓ Drawer responsivo com backdrop
- ✓ Múltiplas seções (Missão, Escolas, Período, Conflitos)
- ✓ Tabelas com dados renderizados
- ✓ Filtros de busca
- ✓ Seletores (checkbox para múltipla seleção)
- ✓ Resumo com contadores
- ✓ Toast de notificação
- ✓ Dialog para detalhes

### ❌ O que falta/precisa melhorar:
- ❌ Dados mock não estão integrados (hardcoded ou vazios)
- ❌ Sem validações de fluxo (ex: impede enviar sem selecionar)
- ❌ Sem steps visuais no sidebar (qual etapa o usuário está?)
- ❌ UX confusa (não é claro se é modal simples ou multi-step wizard)
- ❌ Sem componentização React (tudo em vanila JS)
- ❌ Sem TypeScript (sem type safety)
- ❌ Sem testes unitários
- ❌ Não está no Storybook

---

## 🎯 Transformação: HTML → React Component

### Estratégia em 3 fases:

#### **Fase 1: Dados & Validação (Hoje)**
```
├─ Criar mocks realistas para:
│  ├─ Turmas (5-8 turmas)
│  ├─ Missões (10-15 missões com níveis/pontos)
│  ├─ Alunos (mock de 30-100 alunos por turma)
│  └─ Status de envio anterior (conflitos)
│
├─ Implementar validações:
│  ├─ Turma deve ser selecionada
│  ├─ Missão deve ser selecionada
│  ├─ Período deve ser válido (início < fim)
│  ├─ Mínimo 1 aluno selecionado
│  └─ Detecção de conflitos (aluno já tem missão)
│
└─ Criar Zustand store para estado global
```

#### **Fase 2: Componentização React (Próximas 2-3h)**
```
├─ Quebrar HTML em 6 componentes P0:
│  ├─ 1. ClassSelector (dropdown com turmas)
│  ├─ 2. MissionCatalog (tabela de missões + filtro)
│  ├─ 3. DateRangePicker (início/fim com validação)
│  ├─ 4. ReviewModal (resumo antes de confirmar)
│  ├─ 5. ProgressBar (durante envio)
│  └─ 6. SuccessNotification (resultado)
│
├─ Implementar no React:
│  ├─ Hooks (useState, useCallback, useEffect)
│  ├─ Props bem definidas
│  ├─ TypeScript interfaces
│  └─ Acessibilidade (ARIA labels)
│
└─ Integrar com Zustand store
```

#### **Fase 3: Storybook (3-4h)**
```
├─ Criar 15+ stories:
│  ├─ ClassSelector: Default, Empty, Disabled, Error
│  ├─ MissionCatalog: Default, Filtered, Loading, Empty
│  ├─ DateRangePicker: Default, CustomRange, InvalidRange
│  ├─ ReviewModal: Review, Confirmation
│  ├─ ProgressBar: 0%, 50%, 100%
│  └─ SuccessNotification: Success, Partial, Error
│
├─ Documentar cada story
├─ Adicionar controls para testar
└─ Adicionar screenshots
```

---

## 📊 Estrutura de Dados (Mock)

### Turmas
```typescript
interface Turma {
  id: string;
  nome: string;
  serie: string;
  professor: string;
  alunos: number;
  disciplina: string;
}

const turmas: Turma[] = [
  { id: "TM001", nome: "7º Ano A", serie: "7º", professor: "João Silva", alunos: 35, disciplina: "Matemática" },
  { id: "TM002", nome: "7º Ano B", serie: "7º", professor: "Maria Santos", alunos: 32, disciplina: "Matemática" },
  { id: "TM003", nome: "8º Ano A", serie: "8º", professor: "Pedro Costa", alunos: 38, disciplina: "Matemática" },
  { id: "TM004", nome: "9º Ano A", serie: "9º", professor: "Ana Lima", alunos: 30, disciplina: "Matemática" },
]
```

### Missões
```typescript
interface Missao {
  id: string;
  titulo: string;
  descricao?: string;
  nivel: "facil" | "medio" | "dificil";
  pontos: number;
  competencias: string[];
  dataCriacao: Date;
  uso: number; // quantas vezes foi enviada
}

const missoes: Missao[] = [
  { 
    id: "MS001", 
    titulo: "Desafio: Equações Lineares",
    nivel: "medio",
    pontos: 50,
    competencias: ["Álgebra", "Pensamento Crítico"],
    dataCriacao: new Date("2025-10-15"),
    uso: 45
  },
  // ... mais 10-15
]
```

### Alunos (Mock)
```typescript
interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  desempenho: "acima" | "medio" | "abaixo";
  entregasAtrasadas: number;
  grupo: "lider" | "engajado" | "necessita-ajuda";
}

const alunos: Aluno[] = [
  { id: "AL001", nome: "João Silva", turmaId: "TM001", desempenho: "acima", entregasAtrasadas: 0, grupo: "lider" },
  // ... 100+ alunos
]
```

### Status de Envio Anterior
```typescript
interface EnvioAnterior {
  alunoId: string;
  missaoId: string;
  dataSolicitacao: Date;
  dataFim: Date;
  status: "pendente" | "em-progresso" | "completo" | "falhou";
}

const enviosaAnteriores: EnvioAnterior[] = [
  // ... detectar conflitos
]
```

---

## 🎯 Componentes React (P0)

### 1. ClassSelector
```typescript
interface ClassSelectorProps {
  turmas: Turma[];
  turmaId?: string;
  onChange: (turmaId: string) => void;
  disabled?: boolean;
  error?: string;
}

export function ClassSelector(props: ClassSelectorProps) {
  return (
    <select value={props.turmaId || ""} onChange={(e) => props.onChange(e.target.value)}>
      <option value="">Selecione uma turma...</option>
      {props.turmas.map(t => (
        <option key={t.id} value={t.id}>
          {t.nome} • {t.alunos} alunos
        </option>
      ))}
    </select>
  )
}
```

### 2. MissionCatalog
```typescript
interface MissionCatalogProps {
  missoes: Missao[];
  missionIds: string[];
  onSelect: (missionId: string, selected: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

### 3. DateRangePicker
```typescript
interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
  error?: string;
}
```

### 4. ReviewModal
```typescript
interface ReviewModalProps {
  turma: Turma;
  missoes: Missao[];
  alunos: number;
  dataInicio: Date;
  dataFim: Date;
  conflitos?: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}
```

### 5. ProgressBar
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  message?: string;
  current?: number;
  total?: number;
}
```

### 6. SuccessNotification
```typescript
interface SuccessNotificationProps {
  type: "success" | "partial" | "error";
  titulo: string;
  descricao: string;
  detalhes?: {
    total: number;
    sucesso: number;
    falha: number;
  };
  batchId: string;
  onDone: () => void;
}
```

---

## 🗂️ Estrutura de Pastas (React)

```
src/
├─ components/
│  ├─ MissionBatch/
│  │  ├─ MissionBatchWizard.tsx (container principal)
│  │  ├─ ClassSelector.tsx
│  │  ├─ MissionCatalog.tsx
│  │  ├─ DateRangePicker.tsx
│  │  ├─ ReviewModal.tsx
│  │  ├─ ProgressBar.tsx
│  │  └─ SuccessNotification.tsx
│  │
│  └─ MissionBatch.stories.tsx (15+ stories)
│
├─ stores/
│  └─ missionBatchStore.ts (Zustand)
│
├─ mocks/
│  ├─ turmas.ts
│  ├─ missoes.ts
│  ├─ alunos.ts
│  └─ enviosaAnteriores.ts
│
└─ types/
   └─ mission-batch.ts (TypeScript interfaces)
```

---

## 📝 Checklist de Implementação

### Fase 1: Dados (TODAY)
- [ ] Criar arquivo `turmas.ts` com 5-8 turmas mock
- [ ] Criar arquivo `missoes.ts` com 10-15 missões mock
- [ ] Criar arquivo `alunos.ts` com 100+ alunos mock
- [ ] Criar arquivo `enviosaAnteriores.ts` com conflitos
- [ ] Criar arquivo `types/mission-batch.ts` com todas as interfaces
- [ ] Criar `missionBatchStore.ts` (Zustand) com estado global
- [ ] Implementar validações de fluxo

### Fase 2: Componentização React
- [ ] Criar ClassSelector.tsx + story
- [ ] Criar MissionCatalog.tsx + story
- [ ] Criar DateRangePicker.tsx + story
- [ ] Criar ReviewModal.tsx + story
- [ ] Criar ProgressBar.tsx + story
- [ ] Criar SuccessNotification.tsx + story
- [ ] Criar MissionBatchWizard.tsx (container)
- [ ] Integrar todos com Zustand store
- [ ] Adicionar TypeScript interfaces
- [ ] Adicionar ARIA labels para acessibilidade

### Fase 3: Storybook
- [ ] Criar 15+ stories
- [ ] Documentar cada story
- [ ] Adicionar controls (knobs)
- [ ] Testar responsividade
- [ ] Adicionar screenshots
- [ ] Validar acessibilidade

### Testes
- [ ] Unit tests para cada componente
- [ ] Testes de validação
- [ ] Testes de acessibilidade (a11y)
- [ ] Testes de responsividade

---

## ⏱️ Estimativas

| Fase | Task | Tempo | Status |
|------|------|-------|--------|
| **1** | Dados + Validação + Zustand | 2h | 🔵 Pronto |
| **2** | 6 componentes React | 4h | ⏳ Próximo |
| **3** | 15+ Stories no Storybook | 3h | ⏳ Depois |
| **Testes** | Unit + a11y | 2h | ⏳ Final |
| **TOTAL** | MVP Completo | **11h** | — |

---

## 🚀 Próximo Passo

**AGORA:** Criar os mocks e o Zustand store (2h)

Depois: Componentização React (4h)

---

**Versão:** 1.0  
**Status:** ✅ Pronto para começar
