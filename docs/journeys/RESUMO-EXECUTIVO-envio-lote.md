# 📊 Resumo Executivo — Jornada Envio de Missões em Lote

**Data:** 04 de novembro de 2025  
**Status:** 🔵 **PRONTO PARA VALIDAÇÃO**  
**Documentos Relacionados:**
- 📄 `JOURNEY-envio-missoes-em-lote.md` — Jornada completa (3000+ linhas)
- 🎨 `DESIGN-opcoes-envio-lote.md` — 3 opções de interface com wireframes

---

## 🎯 O Que É?

**Jornada Principal:** Permitir que professores enviem **missões gamificadas para turmas inteiras** em lote, com confirmação clara e feedback de sucesso.

**Resultado:** Reduzir tempo de envio de **30-45 min** (manual) para **2-5 min** (automático).

---

## 👥 Para Quem?

### 1. **Professor (Simples)** ⚡
- João Silva — 10 anos de experiência
- **Uso:** "Enviar 1 missão para minha turma inteira"
- **Tempo:** 2-3 min
- **Fluxo:** 4 telas básicas

### 2. **Coordenador (Avançado)** 🎯
- Maria Santos — Coordenadora de Missões
- **Uso:** "Enviar 2-3 missões para alunos com baixo desempenho"
- **Tempo:** 5-10 min
- **Fluxo:** 6 telas + filtros inteligentes

### 3. **Admin (Bulk)** 🚀
- Gestor de rede escolar
- **Uso:** "Enviar em massa para 100+ turmas via API"
- **Tempo:** 1-2 min (depois automático)
- **Fluxo:** Upload CSV + API

---

## 📈 Impacto Esperado

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Tempo por envio** | 30-45 min | 2-5 min | **📉 -85%** |
| **Taxa de erro** | 5-10% | <1% | **📉 -90%** |
| **Taxa de adoção** | 40% | 85%+ | **📈 +112%** |
| **Alunos por dia** | ~300 | ~1000 | **📈 +233%** |
| **Satisfação** | 60% | 90% | **📈 +50%** |

---

## 🎨 3 Opções de Interface

### Opção 1: Modal Simples (Quick & Compact) ⚡
- Tudo em 1 modal com steps internos
- Ideal: Mobile + ação rápida
- Vantagem: Focal, compacto
- Desvantagem: Menos espaço para detalhes

### **Opção 2: Wizard Multi-Step (RECOMENDADO)** ⭐🎯
- Sidebar com steps + área central
- Ideal: Desktop + tablet
- Vantagem: Claro, visual, extensível
- Desvantagem: Requer desktop

### Opção 3: Inline Expandido (All-in-One) 📄
- Accordion com todas as seções visíveis
- Ideal: Power users + tudo de uma vez
- Vantagem: Sem navegação
- Desvantagem: Overwhelming

**👉 Recomendação: Opção 2 (Wizard) — melhor balanço para MVP**

---

## 📋 Fluxo Principal (Quick Send)

```
┌─────────────────┐
│  1. Selecionar  │
│     Turma       │ ← Professor escolhe 7º Ano A (35 alunos)
│                 │
│  ┌───────────┐  │
│  │ 7º Ano A  │  │
│  │ 7º Ano B  │  │
│  │ 8º Ano A  │  │
│  └───────────┘  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  2. Selecionar  │
│     Missão      │ ← Professor escolhe "Equações Lineares"
│                 │
│  ┌───────────┐  │
│  │[X] Equa... │  │
│  │[ ] Geom... │  │
│  │[ ] Fração │  │
│  └───────────┘  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  3. Definir     │
│     Datas       │ ← Professor define início/fim
│                 │
│  De: 04/11      │
│  Até: 11/11     │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  4. Confirmar   │
│  & Enviar       │ ← Professor revisa e confirma
│                 │
│  "Enviar para   │
│   35 alunos?"   │
│  [✅ Enviar]    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  ✅ Sucesso!    │
│  35 alunos      │ ← Feedback de sucesso
│  receberam      │
└─────────────────┘
```

---

## 🚀 Componentes Necessários

**P0 (MVP — Quick Send):**
- ✅ `ClassSelector` — Dropdown de turmas
- ✅ `MissionCatalog` — Busca/listagem de missões
- ✅ `DateRangePicker` — Seleção de datas
- ✅ `ReviewModal` — Resumo antes de enviar
- ✅ `ProgressBar` — Feedback durante envio
- ✅ `SuccessNotification` — Resultado

**P1 (V1.1 — Smart Send):**
- `MultiClassSelector` — Múltiplas turmas
- `StudentFilter` — Filtros avançados
- `ConflictResolutionModal` — Tratamento de conflitos

**P2 (V2.0 — Bulk Send):**
- `BulkUploadForm` — Upload CSV/JSON
- API REST com webhooks

---

## ✅ Critérios de Sucesso

### Funcionais
- [ ] Permitir seleção de 1+ turma
- [ ] Permitir seleção de 1+ missão
- [ ] Detectar conflitos (aluno já tem missão)
- [ ] Gerar ID de rastreamento
- [ ] Suportar revisão antes de enviar

### Performance
- [ ] Envio em lote ≤ 5s para 200 alunos
- [ ] Rendering ≤ 500ms
- [ ] Busca ≤ 1s

### UX
- [ ] Confirmação dupla antes de enviar
- [ ] Feedback claro durante envio
- [ ] Mensagens de sucesso/erro claras
- [ ] Permite voltar/editar

### Segurança
- [ ] Professor só vê suas turmas
- [ ] Auditoria completa registrada
- [ ] Sem PII em logs
- [ ] WCAG AA+ compliance

---

## 📊 Dados & Mockups

### Mock de Turmas
```typescript
[
  { id: 1, nome: "7º Ano A", alunos: 35 },
  { id: 2, nome: "7º Ano B", alunos: 32 },
  { id: 3, nome: "8º Ano A", alunos: 38 },
]
```

### Mock de Missões
```typescript
[
  { 
    id: 1, 
    titulo: "Desafio: Equações Lineares",
    nivel: "medio",
    pontos: 50,
    criada: "2025-10-15"
  },
  // ...
]
```

---

## 📋 Checklist de Decisão

Antes de começar, responda:

### Design
- [ ] Qual interface preferem? (Modal / Wizard / Inline)
- [ ] Filtros de alunos são necessários no MVP?
- [ ] Suportar múltiplas missões? (ou apenas 1?)
- [ ] Salvar templates?

### Funcionalidade
- [ ] É obrigatório confirmar antes de enviar?
- [ ] Como tratar conflitos (aluno já tem missão)?
- [ ] Permitir editar após enviar (para falhas)?
- [ ] Notify teacher após envio?

### Performance
- [ ] Target de envio é realista (≤5s para 200)?
- [ ] Qual banco de dados? (PostgreSQL?)
- [ ] Usar background job (BullMQ)?

### Segurança
- [ ] Apenas professor vê suas turmas? ✓
- [ ] Auditoria necessária? ✓
- [ ] LGPD compliance?

---

## 🔗 Próximos Passos

### 1. Validação (Hoje/Amanhã)
- [ ] Compartilhar com PM/Designer
- [ ] Coletar feedback nas opções
- [ ] Decidir: Qual interface?
- [ ] Validar com 1-2 professores

### 2. Design (Próxima semana)
- [ ] Criar mockups em Figma
- [ ] Definir componentes finais
- [ ] Preparar design tokens

### 3. Desenvolvimento (Próximas 2 semanas)
- [ ] Criar stories no Storybook
- [ ] Implementar componentes
- [ ] Testes unitários
- [ ] Testes E2E

### 4. Validação Interna (Semana 3)
- [ ] Teste com equipe
- [ ] Feedback & ajustes
- [ ] Preparar deploy

---

## 📊 Estimativas

| Fase | Task | Tempo | Esforço |
|------|------|-------|---------|
| **Design** | Mockups + validação | 1-2 dias | 8h |
| **Dev** | Criar componentes | 5-7 dias | 40h |
| **QA** | Testes + ajustes | 2-3 dias | 16h |
| **Deploy** | Merge + release | 1 dia | 4h |
| **Total** | MVP Completo | 2-2.5 semanas | ~70h |

---

## 📞 Próxima Ação

**👉 Qual das 3 opções de interface preferem?**

1. ⚡ Modal Simples (quick)
2. 🎯 **Wizard Multi-Step (recomendado)**
3. 📄 Inline Expandido (power users)

Responda para que possamos:
1. Ajustar design baseado no feedback
2. Criar stories no Storybook
3. Começar implementação

---

**Documentação:** ✅ Completa  
**Status:** 🔵 Aguardando feedback  
**Pronto para:** Design → Dev → Deploy  

**Versão:** 1.0  
**Data:** 04/11/2025
