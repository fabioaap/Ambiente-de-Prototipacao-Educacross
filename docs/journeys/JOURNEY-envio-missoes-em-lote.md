# 🎯 Jornada Principal: Envio de Missões em Lote

**Data de Criação:** 04 de novembro de 2025  
**Versão:** 1.0  
**Status:** 🔵 **EM VALIDAÇÃO**  
**Prioridade:** 🔴 **CRÍTICA** (MVP Core Path)  

---

## 📋 Índice
1. [Personas](#personas)
2. [Problema & Oportunidade](#problema--oportunidade)
3. [Visão Geral das 3 Variações](#visão-geral-das-3-variações)
4. [Fluxo Simples (Quick Send)](#fluxo-simples-quick-send)
5. [Fluxo Avançado (Smart Send)](#fluxo-avançado-smart-send)
6. [Fluxo Bulk (Enterprise)](#fluxo-bulk-enterprise)
7. [Critérios de Aceitação Globais](#critérios-de-aceitação-globais)
8. [Componentes Necessários](#componentes-necessários)
9. [Modelagem de Dados](#modelagem-de-dados)
10. [Padrões de UX](#padrões-de-ux)

---

## 👥 Personas

### 👨‍🏫 João Silva — Professor (Experiente)
- **Cargo:** Professor de Matemática
- **Experiência:** 10 anos
- **Turmas:** 4-5 turmas por semestre
- **Alunos:** ~150-200 alunos totais
- **Dor:** "Perco 30 min configurando cada turma"
- **Desejo:** Enviar em 2 cliques, com confirmação clara
- **Fluxo:** **Simples (Quick Send)** ⚡

### 🧑‍💼 Maria Santos — Coordenadora Pedagógica (Power User)
- **Cargo:** Coordenadora de Missões
- **Experiência:** 5 anos com gamificação
- **Turmas:** Coordena 3-4 disciplinas
- **Alunos:** ~600-800 alunos
- **Dor:** "Preciso segmentar por desempenho/grupo"
- **Desejo:** Filtros avançados, salvamento de templates
- **Fluxo:** **Avançado (Smart Send)** 🎯

### 🏢 Admin de Rede Escolar (Enterprise)
- **Cargo:** Gerente de Plataforma
- **Experiência:** Gestão de 100+ professores
- **Turmas:** Coordena toda a rede
- **Alunos:** +5000 alunos
- **Dor:** "Preciso enviar para múltiplos professores/turmas"
- **Desejo:** API, webhooks, importação em massa
- **Fluxo:** **Bulk (Enterprise)** 🚀

---

## 🔍 Problema & Oportunidade

### Problema
**Antes (Sem Plataforma):**
- ❌ Professor cadastrava cada aluno/missão manualmente
- ❌ Erro humano (esquecia alunos, enviava 2x)
- ❌ Perdia 30-45 min por turma
- ❌ Sem histórico/auditoria
- ❌ Impossível segmentar por critérios

**Impacto:** 
- 📉 Baixa adoção (professors relutantes)
- ⏰ Overhead administrativo alto
- 🔴 Taxas de erro elevadas

### Oportunidade
**Com Plataforma (Visão):**
- ✅ Envio em lote com 1-2 cliques
- ✅ Filtros inteligentes (desempenho, grupo, status)
- ✅ Revisão + confirmação antes do envio
- ✅ Histórico completo com auditoria
- ✅ Suporte a múltiplos fluxos (quick, smart, bulk)

**Impacto Esperado:**
- 📈 Adoção +85% (simplificação do fluxo)
- ⏱️ Tempo reduzido para 3-5 min
- 🟢 Taxa de sucesso >98%
- 📊 Visibilidade total de quem recebeu o quê

---

## 🎨 Visão Geral das 3 Variações

| Aspecto | **Simples (Quick)** ⚡ | **Avançado (Smart)** 🎯 | **Bulk (Enterprise)** 🚀 |
|---------|-----------------|-----------------|-------------------|
| **Usuário** | Professor comum | Coordenador | Admin/API |
| **Turmas** | 1 | 1-4 | Múltiplas (1-100+) |
| **Alunos** | Todos (~30-40) | Filtrados (~15-200) | Em massa (5000+) |
| **Filtros** | Nenhum | 5+ opções | Template/API |
| **Tempo Estimado** | ⏱️ 2-3 min | ⏱️ 5-10 min | ⏱️ 1-2 min (depois é automático) |
| **Interface** | 4 telas | 6 telas + modal | API/CLI + Dashboard |
| **Componentes** | Básicos | Avançados | Infrastructure |
| **Prioridade MVP** | 🔴 P0 | 🟡 P1 | 🟠 P2 |

---

## ⚡ Fluxo Simples (Quick Send)

**Cenário:** Professor João quer enviar 1 missão para sua turma inteira, rapidamente.

### 📊 Fluxo Visual
```
┌─────────────────────┐
│  Dashboard          │
│  [Turmas]           │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  01. Select Class   │ ← "7º Ano A" (dropdown)
│  [Turma A v]        │
│  [Turma B]          │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  02. Select Mission │ ← "Desafio: Equações" (search)
│  [Search...]        │
│  [Resultados]       │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  03. Set Dates      │ ← Start & End dates
│  De: [__/__/____]   │
│  Até: [__/__/____]  │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  04. Confirm        │ ← Review & Send
│  "Enviar para 35?"  │
│  [❌ Cancel][✅OK]  │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  ✅ Success         │ ← "35 alunos"
│  "Enviado com êxito"│
└─────────────────────┘
```

### 1️⃣ **Tela 1: Dashboard & Seleção de Turma**

**Título:** "Enviar Missões em Lote"

**Elementos:**
```
┌─────────────────────────────────────────┐
│ 📚 Enviar Missões em Lote               │
├─────────────────────────────────────────┤
│                                         │
│ Selecione a turma:                      │
│ ┌───────────────────────────────────┐  │
│ │ 7º Ano A  (35 alunos)     ▼       │  │
│ └───────────────────────────────────┘  │
│                                         │
│ Turmas disponíveis:                     │
│ • 7º Ano A — 35 alunos                  │
│ • 7º Ano B — 32 alunos                  │
│ • 8º Ano A — 38 alunos                  │
│                                         │
│              [Próximo >]                │
└─────────────────────────────────────────┘
```

**Componentes:**
- `ClassSelector` (dropdown com lista)
- `Badge` com contagem de alunos
- `Button` primário "Próximo"

**Dados Mock:**
```typescript
const turmas = [
  { id: 1, nome: "7º Ano A", alunos: 35 },
  { id: 2, nome: "7º Ano B", alunos: 32 },
  { id: 3, nome: "8º Ano A", alunos: 38 },
]
```

---

### 2️⃣ **Tela 2: Seleção de Missão**

**Título:** "Selecione a Missão — 7º Ano A"

**Elementos:**
```
┌─────────────────────────────────────────┐
│ 📖 Selecione a Missão — 7º Ano A        │
├─────────────────────────────────────────┤
│                                         │
│ Buscar: [_________________]      🔍     │
│                                         │
│ ✅ Desafio: Equações Lineares          │
│    • Nível: Médio                       │
│    • Pontos: 50                         │
│    • Data: criada em 15/10/2025         │
│                                         │
│ ☐ Desafio: Geometria Plana              │
│    • Nível: Difícil                     │
│    • Pontos: 75                         │
│                                         │
│ ☐ Desafio: Frações                      │
│    • Nível: Fácil                       │
│    • Pontos: 25                         │
│                                         │
│ [< Voltar]           [Próximo >]        │
└─────────────────────────────────────────┘
```

**Componentes:**
- `Input` com busca
- `Card` ou `RadioGroup` para cada missão
- `Badge` com nível (core colors: easy=green, medium=yellow, hard=red)
- `Button` navegação

**Dados Mock:**
```typescript
const missoes = [
  { 
    id: 1, 
    titulo: "Desafio: Equações Lineares",
    nivel: "medio",
    pontos: 50,
    dataCriacao: "2025-10-15"
  },
  // ... mais
]
```

---

### 3️⃣ **Tela 3: Parametrização (Datas)**

**Título:** "Definir Período — Desafio: Equações Lineares"

**Elementos:**
```
┌─────────────────────────────────────────┐
│ 📅 Definir Período                      │
├─────────────────────────────────────────┤
│                                         │
│ Missão: Desafio: Equações Lineares      │
│ Turma: 7º Ano A (35 alunos)             │
│                                         │
│ Data de início:                         │
│ [04/11/2025] [00:00]                    │
│                                         │
│ Data de término:                        │
│ [11/11/2025] [23:59]                    │
│                                         │
│ ⚙️ Opções avançadas:                    │
│ ☐ Personalizar pontos (padrão: 50)      │
│ ☐ Missão obrigatória                    │
│                                         │
│ [< Voltar]           [Próximo >]        │
└─────────────────────────────────────────┘
```

**Componentes:**
- `Input` com date/time picker
- `Checkbox` para opções avançadas
- `Button` navegação

**Lógica:**
```typescript
const parametros = {
  dataInicio: new Date(),
  dataTermino: new Date(Date.now() + 7*24*60*60*1000), // +7 dias
  obrigatoria: false,
  pontosCustomizados: null,
}
```

---

### 4️⃣ **Tela 4: Revisão & Confirmação**

**Título:** "Confirmar Envio"

**Elementos:**
```
┌─────────────────────────────────────────┐
│ ✅ Resumo do Envio                      │
├─────────────────────────────────────────┤
│                                         │
│ 📋 Detalhes:                            │
│ • Turma: 7º Ano A                       │
│ • Alunos: 35                            │
│ • Missão: Desafio: Equações Lineares    │
│ • Nível: Médio | Pontos: 50             │
│ • Período: 04/11 - 11/11/2025           │
│                                         │
│ ⚠️ Ação irreversível!                   │
│ Confirmar que deseja enviar?             │
│                                         │
│ [❌ Cancelar]    [✅ Enviar]            │
└─────────────────────────────────────────┘
```

**Após Clique em "Enviar":**
```
┌─────────────────────────────────────────┐
│ 🔄 Enviando...                          │
├─────────────────────────────────────────┤
│                                         │
│ [████████░░░░░░] 66% (23/35)            │
│                                         │
│ Processando...                          │
│                                         │
└─────────────────────────────────────────┘
   (ProgressBar com animação)
```

**Sucesso:**
```
┌─────────────────────────────────────────┐
│ ✅ Sucesso!                             │
├─────────────────────────────────────────┤
│                                         │
│ 35 alunos receberam a missão            │
│ "Desafio: Equações Lineares"            │
│                                         │
│ 📊 Detalhes:                            │
│ • Enviadas em: 2.5s                     │
│ • Timestamp: 04/11/2025 14:35           │
│ • ID Lote: #MSN-001847-Q                │
│                                         │
│ [✓ Voltar ao Dashboard]                 │
│ [→ Enviar outra]                        │
└─────────────────────────────────────────┘
```

**Componentes:**
- `Card` ou `Dialog` para resumo
- `ProgressBar` durante envio
- `SuccessNotification` com detalhes
- `Button` primário/secundário

---

## 🎯 Fluxo Avançado (Smart Send)

**Cenário:** Coordenadora Maria quer enviar missões com filtros inteligentes.

### 📊 Fluxo Visual
```
Simples (4 telas)  →  Avançado (6 telas + modais)

Adições:
1. Seleção de múltiplas TURMAS
2. Seleção de múltiplas MISSÕES
3. Filtros de ALUNOS (desempenho, grupo, status)
4. Template SALVO para reutilização
5. PREVIEW de alunos que receberão
6. Modal de CONFLITOS (aluno já tem missão)
```

### Telas Adicionais

#### **Tela A1: Múltiplas Turmas**
```
Selecione turmas:
☐ 7º Ano A (35) 
☑ 7º Ano B (32)
☑ 8º Ano A (38)

Total de alunos: 70 (com múltiplas turmas)
```

#### **Tela A2: Múltiplas Missões**
```
Selecione missões (máx 3):
☑ Equações Lineares
☑ Geometria Plana
☐ Frações
```

#### **Tela A3: Filtros de Alunos (NOVO)**
```
┌─────────────────────────────────────────┐
│ 🎛️ Filtros de Alunos                    │
├─────────────────────────────────────────┤
│                                         │
│ Desempenho:                             │
│ ☐ Acima da média (A+, A)                │
│ ☑ Média (B+, B)                         │
│ ☑ Abaixo da média (C, D)                │
│                                         │
│ Status de Entrega:                      │
│ ☑ Ainda não entregaram                  │
│ ☐ Entregaram a tempo                    │
│ ☐ Entregaram atrasado                   │
│                                         │
│ Grupo dentro da turma:                  │
│ ☐ Grupo A (Líderes)                     │
│ ☑ Grupo B (Engajados)                   │
│ ☑ Grupo C (Necessita ajuda)             │
│                                         │
│ [Aplicar Filtros]                       │
│                                         │
│ Resultado: 42 alunos (de 70)            │
│                                         │
└─────────────────────────────────────────┘
```

#### **Tela A4: Preview de Alunos**
```
Alunos que receberão (42):
├─ 7º Ano B (18):
│  • João Silva
│  • Maria Santos
│  • [+16 mais]
└─ 8º Ano A (24):
   • Pedro Costa
   • Ana Lima
   • [+22 mais]

[Expandir] ou [Ver Lista Completa]
```

#### **Tela A5: Detecção de Conflitos (NOVO)**
```
⚠️ ATENÇÃO: 3 alunos já possuem esta missão

Opções:
☐ Cancelar (não enviar para ninguém)
☐ Enviar apenas para quem NÃO tem (39/42)
☑ Sobrescrever (resetar progresso dos 3)

Detalhes:
• João Silva já tem desde 20/10
• Maria Santos já tem desde 15/10
• Pedro Costa já tem desde 18/10
```

#### **Tela A6: Salvar Template (NOVO)**
```
Deseja salvar este envio como template?

Nome do template:
[Matemática - Alunos em Dificuldade]

Descrição (opcional):
[Missões para alunos abaixo da média...]

[Cancelar] [Salvar template]

Próximos templates salvos aparecerão em
"Envios Rápidos" no início do fluxo.
```

---

## 🚀 Fluxo Bulk (Enterprise)

**Cenário:** Admin de rede quer enviar para múltiplas escolas/turmas via API.

### Opções de Uso

#### **Opção 1: UI Dashboard (Bulk Send)**
```
┌──────────────────────────────────────────┐
│ 🏢 Envio em Massa (Bulk)                 │
├──────────────────────────────────────────┤
│                                          │
│ 1️⃣ Importar dados:                      │
│ [Upload CSV/Excel] ou [Colar JSON]      │
│                                          │
│ Formato esperado:                        │
│ escola_id, turma_id, missao_id, ...      │
│                                          │
│ 2️⃣ Validar:                             │
│ [Validar Arquivo]                        │
│ ✅ 450 linhas válidas                    │
│ ⚠️ 5 linhas com erro (revisar)            │
│                                          │
│ 3️⃣ Programar envio:                     │
│ Agora: ☑️ | Agendar: ☐ [__/__/__]       │
│                                          │
│ 4️⃣ Enviar:                               │
│ [🚀 Iniciar Envio]                       │
│                                          │
│ Dashboard:                               │
│ Envios em andamento: 2                   │
│ Histórico: [Ver]                         │
│                                          │
└──────────────────────────────────────────┘
```

#### **Opção 2: API REST**
```bash
POST /api/v1/bulk-missions
Content-Type: application/json

{
  "mode": "sync",
  "missions": [
    {
      "schoolId": "SCH001",
      "classId": "7A",
      "missionId": "MSN123",
      "students": ["STU001", "STU002"],
      "startDate": "2025-11-04",
      "endDate": "2025-11-11"
    }
  ],
  "onConflict": "skip" | "override" | "alert",
  "notifyTeachers": true,
  "webhookUrl": "https://escola.edu.br/webhooks/missions"
}

Response:
{
  "batchId": "BTH-20251104-001",
  "status": "processing",
  "totalRecords": 450,
  "successCount": 0,
  "errorCount": 0,
  "estimatedTime": "45s"
}
```

#### **Opção 3: CLI (Command Line)**
```bash
$ edubot bulk-send \
  --file envios-novembro.csv \
  --validate \
  --dry-run \
  --notify-webhook https://escola.edu.br/webhooks

✅ Validação passou (450 registros)
📊 Previsão: 450 envios, ~45s
🔗 Webhook configurado: https://escola.edu.br/webhooks
🚀 [PRONTO] Execute sem --dry-run para enviar
```

---

## ✅ Critérios de Aceitação Globais

### 🟢 Critérios Funcionais (CA-F)

| ID | Descrição | Fluxo | Tipo |
|---|-----------|-------|------|
| **CA-F01** | Deve permitir seleção de 1+ turma | Quick, Smart, Bulk | MUST |
| **CA-F02** | Deve permitir seleção de 1+ missão | Quick, Smart, Bulk | MUST |
| **CA-F03** | Deve aplicar filtros de alunos corretamente | Smart, Bulk | SHOULD |
| **CA-F04** | Deve detectar conflitos (aluno já tem missão) | Smart, Bulk | SHOULD |
| **CA-F05** | Deve permitir revisão antes de enviar | Quick, Smart, Bulk | MUST |
| **CA-F06** | Deve confirmar com contagem de alunos | Quick, Smart, Bulk | MUST |
| **CA-F07** | Deve exibir progresso durante envio | Quick, Smart, Bulk | MUST |
| **CA-F08** | Deve salvar rascunho/template | Smart | SHOULD |
| **CA-F09** | Deve gerar ID de rastreamento (batch ID) | Quick, Smart, Bulk | MUST |
| **CA-F10** | Deve suportar API REST | Bulk | SHOULD |

### 🟡 Critérios de Performance (CA-P)

| ID | Descrição | Target | Fluxo |
|---|-----------|--------|-------|
| **CA-P01** | Envio em lote ≤ 5s para 200 alunos | <5s | Quick, Smart |
| **CA-P02** | Rendering de lista de turmas ≤ 500ms | <500ms | Quick, Smart |
| **CA-P03** | Busca de missões ≤ 1s com 1000 registros | <1s | Quick, Smart |
| **CA-P04** | API Bulk ≤ 10s para 5000 registros | <10s | Bulk |
| **CA-P05** | Aplicação de filtros ≤ 2s | <2s | Smart |

### 🟠 Critérios de UX (CA-U)

| ID | Descrição | Fluxo |
|---|-----------|-------|
| **CA-U01** | Deve exigir confirmação antes de ação irreversível | Quick, Smart, Bulk |
| **CA-U02** | Deve mostrar resumo claro do que será enviado | Quick, Smart, Bulk |
| **CA-U03** | Deve indicar progresso visual durante envio | Quick, Smart, Bulk |
| **CA-U04** | Deve exibir mensagens de sucesso/erro claras | Quick, Smart, Bulk |
| **CA-U05** | Deve permitir voltar para editar antes de enviar | Quick, Smart, Bulk |
| **CA-U06** | Deve salvar estado de rascunho | Smart |
| **CA-U07** | Deve exibir tempo estimado | Bulk |

### 🔒 Critérios de Segurança (CA-S)

| ID | Descrição | Fluxo |
|---|-----------|-------|
| **CA-S01** | Professor só vê suas turmas | Quick, Smart |
| **CA-S02** | Admin só vê suas escolas | Smart, Bulk |
| **CA-S03** | Nenhuma PII exposta em logs | Quick, Smart, Bulk |
| **CA-S04** | Auditoria completa registrada | Quick, Smart, Bulk |
| **CA-S05** | Rate limiting em API | Bulk |
| **CA-S06** | Validação de token JWT | Bulk |

### ♿ Critérios de Acessibilidade (CA-A)

| ID | Descrição | Fluxo |
|---|-----------|-------|
| **CA-A01** | WCAG AA+ compliance | Quick, Smart, Bulk |
| **CA-A02** | Navegação por teclado | Quick, Smart |
| **CA-A03** | Labels descritivos em inputs | Quick, Smart, Bulk |
| **CA-A04** | Contraste de cores >= 4.5:1 | Quick, Smart, Bulk |
| **CA-A05** | Focus indicadores visíveis | Quick, Smart, Bulk |

### 📱 Critérios de Responsividade (CA-R)

| ID | Descrição | Breakpoints | Fluxo |
|---|-----------|-------------|-------|
| **CA-R01** | Funciona em desktop (1920px+) | Desktop | Quick, Smart, Bulk |
| **CA-R02** | Funciona em tablet (768px-1024px) | Tablet | Quick, Smart |
| **CA-R03** | Funciona em mobile (375px-480px) | Mobile | Quick |
| **CA-R04** | Dialogs responsivos em mobile | Mobile | Quick, Smart |

---

## 🚀 Componentes Necessários

```
┌─ Quick Send (⚡)
│  ├─ ClassSelector
│  ├─ MissionCatalog
│  ├─ DateRangePicker
│  ├─ ReviewModal
│  ├─ ProgressBar
│  └─ SuccessNotification
│
├─ Smart Send (🎯) [herda Quick + adiciona]
│  ├─ MultiClassSelector
│  ├─ MultiMissionSelector
│  ├─ StudentFilter (com checkboxes avançados)
│  ├─ StudentPreview
│  ├─ ConflictResolutionModal
│  ├─ TemplateSaver
│  └─ TemplateLoader
│
└─ Bulk Send (🚀) [API + Dashboard]
   ├─ BulkUploadForm (CSV/JSON)
   ├─ ValidationResults
   ├─ ScheduleSelector
   ├─ BulkProgressDashboard
   ├─ WebhookConfigurator
   └─ BulkHistoryTable
```

### Prioridade de Implementação

**P0 — MVP (Quick Send):**
- ✅ ClassSelector
- ✅ MissionCatalog
- ✅ DateRangePicker
- ✅ ReviewModal
- ✅ ProgressBar
- ✅ SuccessNotification

**P1 — V1.1 (Smart Send):**
- MultiClassSelector
- MultiMissionSelector
- StudentFilter
- StudentPreview
- ConflictResolutionModal

**P2 — V2.0 (Bulk Send):**
- BulkUploadForm
- API endpoints
- Webhook support
- Dashboard

---

## 📊 Modelagem de Dados

### Estrutura de Envio (Batch)

```typescript
interface MissionBatch {
  id: string;                      // BTH-20251104-001
  schoolId: string;                // SCH001
  createdBy: string;               // user_id
  createdAt: Date;
  
  // Seleção
  classIds: string[];              // [CLS001, CLS002]
  missionIds: string[];            // [MSN123]
  studentFilters: StudentFilter;
  
  // Parametrização
  startDate: Date;
  endDate: Date;
  isPinned: boolean;               // obrigatória?
  customPoints?: number;
  
  // Status
  status: "draft" | "pending" | "processing" | "completed" | "failed";
  progress: {
    total: number;
    succeeded: number;
    failed: number;
  };
  
  // Resultado
  result: {
    successCount: number;
    failureCount: number;
    completedAt?: Date;
    errors?: Array<{ studentId: string; reason: string }>;
  };
  
  // Auditoria
  auditLog: Array<{
    timestamp: Date;
    action: string;
    actor: string;
  }>;
}

interface StudentFilter {
  performanceLevel?: "above" | "average" | "below";
  deliveryStatus?: "pending" | "completed" | "late";
  groupId?: string;
  includeAll?: boolean;
}
```

### Estado Global (Zustand)

```typescript
interface MissionBatchStore {
  // Formulário
  selectedClass: string | null;
  selectedMissions: string[];
  studentFilter: StudentFilter;
  startDate: Date;
  endDate: Date;
  customPoints: number | null;
  
  // UI
  currentStep: "class" | "missions" | "filters" | "dates" | "review" | "sending" | "success";
  loading: boolean;
  error: string | null;
  
  // Métodos
  setSelectedClass: (classId: string) => void;
  addMission: (missionId: string) => void;
  removeMission: (missionId: string) => void;
  setStudentFilter: (filter: StudentFilter) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  submit: () => Promise<void>;
}
```

---

## 🎨 Padrões de UX

### Padrão 1: Confirmação Dupla
```
⚠️ Ação irreversível!

Você está prestes a enviar:
• Missão: [Nome]
• Turma: [Nome] 
• Alunos: [X]

Tem certeza?

[Cancelar] [Confirmar]
```

### Padrão 2: Feedback de Progresso
```
Durante envio:
[████████░░░░░░] 66% (23/35)
Enviando para João Silva...

Após conclusão:
✅ 35/35 enviados com sucesso
⚠️ 2/35 tiveram erro (ver detalhes)
```

### Padrão 3: Mensagem de Sucesso com CTA
```
✅ Missão enviada!

35 alunos da Turma 7º Ano A 
receberam "Desafio: Equações"

Próximas ações:
[→ Enviar outra] [→ Voltar ao Dashboard]
```

### Padrão 4: Tratamento de Erro
```
❌ Erro ao enviar

Motivo: Conexão perdida durante o envio

Ações:
1. Verificar sua conexão
2. [Tentar novamente] 
3. [Contatar suporte]

ID para referência: ERR-20251104-001
```

---

## 📋 Checklist de Validação (Para Coletar Feedback)

Apresente esta jornada ao PM/Designer e colete feedback:

- [ ] **Fluxo Simples:** Necessário? Muito simples?
- [ ] **Fluxo Avançado:** Ordem das telas faz sentido?
- [ ] **Filtros de Alunos:** São os filtros corretos?
- [ ] **Conflitos:** Como deveria ser tratado aluno que já tem a missão?
- [ ] **Template:** Necessário salvar templates?
- [ ] **Bulk Send:** Prioridade para MVP?
- [ ] **Componentes:** Faltou algo?
- [ ] **Critérios de Aceitação:** Realistas?
- [ ] **Segurança:** Falha alguma permissão?
- [ ] **Performance:** Targets alcançáveis?

---

## 🔗 Referências

- **Journey Base:** `01-professor-frontend.md`
- **Design System:** `DesignSystem.mdx` no Storybook
- **Componentes Existentes:** Button, Card, Badge, Dialog
- **Stack:** React 18 + Tailwind + shadcn/ui + Zustand

---

## 📝 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 04/11/2025 | Criação inicial com 3 variações |

---

**Status:** 🔵 **EM VALIDAÇÃO** — Aguardando feedback do PM/Designer

Próximo passo: Validar com stakeholders e iniciar implementação dos componentes.
