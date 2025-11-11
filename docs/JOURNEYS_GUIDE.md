# 📍 Guia: Como Documentar Jornadas de Usuário

## O que é uma Jornada de Usuário?

Uma **jornada de usuário** descreve os passos que uma pessoa segue para atingir um objetivo usando seu produto. É uma ponte entre a visão do **negócio/design** e a implementação **técnica**.

## 📊 Estrutura Padrão de Jornada

Cada jornada deve conter:

### 1️⃣ **Persona**
Define quem é o usuário:
```markdown
## 👤 Persona
- **Nome:** João Silva
- **Cargo:** Professor de Matemática
- **Experiência:** 10 anos
- **Objetivo:** Enviar missões gamificadas rapidamente
- **Dor:** Perder tempo configurando cada aluno individualmente
```

### 2️⃣ **Objetivo da Jornada**
Uma frase clara do que o usuário quer conseguir:
```markdown
## 🎯 Objetivo da Jornada
Permitir que o professor envie missões em lote para uma turma inteira com filtros opcionais.
```

### 3️⃣ **Fluxo Principal (Passos)**
Detalhado, com checkboxes, dividido em etapas:
```markdown
## 📋 Fluxo Principal

### 1️⃣ **Autenticação**
- [ ] Professor acessa o portal
- [ ] Login com credenciais LDAP
- [ ] Sistema valida credenciais
- [ ] Usuário redirecionado para Dashboard

### 2️⃣ **Seleção de Turma**
- [ ] Professor visualiza lista de turmas que leciona
- [ ] Seleciona a turma alvo (ex: "7º Ano A")
- [ ] Sistema carrega dados da turma

### 3️⃣ **Próxima Etapa**
...
```

### 4️⃣ **Critérios de Aceitação (CA)**
Define quando a jornada está "pronta":
```markdown
## 📊 Critérios de Aceitação

| Critério | Tipo | Descrição |
|----------|------|-----------|
| **CA-1** | Funcional | Deve permitir seleção de múltiplas missões |
| **CA-2** | Performance | Envio em lote ≤ 5 segundos para 200 alunos |
| **CA-3** | Segurança | Professor só vê suas turmas |
| **CA-4** | UX | Deve confirmar ação antes de enviar |
| **CA-5** | Acessibilidade | WCAG AA+ compliance |
```

### 5️⃣ **Componentes Necessários**
Que componentes/telas precisam ser criadas:
```markdown
## 🚀 Componentes Necessários

\`\`\`
📦 Front-office
├── ClassSelector (Seleção de turma)
├── MissionCatalog (Catálogo de missões)
├── MissionFilters (Filtros)
├── StudentSelector (Seleção de alunos)
├── ParametrizationForm (Parâmetros)
├── ReviewModal (Revisão)
└── SuccessNotification (Resultado)
\`\`\`
```

### 6️⃣ **Fluxos Alternativos**
Cenários "edge case":
```markdown
## 🔄 Fluxos Alternativos

### Cenário: Professor volta e tenta novamente
- [ ] Sistema salva rascunho da configuração
- [ ] Ao retornar, oferece "Continuar com anterior"

### Cenário: Aluno já tem a missão
- [ ] Sistema avisa: "X alunos já possuem esta missão"
- [ ] Oferece opções: Cancelar | Sobrescrever | Enviar para novos
```

### 7️⃣ **Status do Desenvolvimento**
Rastreia o progresso:
```markdown
## ✅ Status do Desenvolvimento

- **Planejamento:** ✅
- **Design:** ⏳ Em progresso
- **Prototipagem:** ⏳ Em fila
- **Implementação:** ⏳ Em fila
- **Testes:** ⏳ Em fila
- **Deploy:** ⏳ Em fila
```

---

## 🗂️ Arquivo e Pasta

### Localização
```
docs/journeys/
├── 01-professor-frontend.md       ← Jornada do Professor (Front-office)
├── 02-admin-backoffice.md         ← Jornada do Admin (Backoffice)
└── 03-student-games-platform.md   ← Jornada do Aluno (Plataforma de Jogos)
```

### Nome do Arquivo
- Prefixe com número (01, 02, 03) para ordenação
- Use slug em minúsculas: `jornada-nome.md`
- Seja descritivo

---

## 📝 Template Completo

```markdown
# Jornada do [CARGO] - [PLATAFORMA]

## 👤 Persona
- **Nome:** [Nome realista]
- **Cargo:** [Cargo/Profissão]
- **Experiência:** [Tempo/Nível]
- **Objetivo:** [O que deseja atingir]
- **Dor:** [Problema que enfrenta]

## 🎯 Objetivo da Jornada
[Uma frase clara descrevendo o objetivo]

## 📋 Fluxo Principal

### 1️⃣ **[Etapa]**
- [ ] [Ação 1]
- [ ] [Ação 2]
- [ ] [Ação 3]

### 2️⃣ **[Próxima Etapa]**
- [ ] [Ação 1]
- [ ] [Ação 2]

## 📊 Critérios de Aceitação

| Critério | Tipo | Descrição |
|----------|------|-----------|
| **CA-1** | [Tipo] | [Descrição] |
| **CA-2** | [Tipo] | [Descrição] |

## 🚀 Componentes Necessários

\`\`\`
📦 [Plataforma]
├── Componente1
├── Componente2
└── Componente3
\`\`\`

## 🔄 Fluxos Alternativos

### Cenário: [Descrição]
- [ ] [Ação 1]
- [ ] [Ação 2]

## 📱 Mockups de Telas

- [ ] [Tela 1]
- [ ] [Tela 2]
- [ ] [Tela 3]

## ✅ Status do Desenvolvimento

- **Planejamento:** [Status]
- **Design:** [Status]
- **Prototipagem:** [Status]
- **Implementação:** [Status]
- **Testes:** [Status]
- **Deploy:** [Status]
```

---

## 🎯 Tipos de Critérios de Aceitação

### **Funcional** 
✅ O que o sistema deve fazer
- "Deve permitir filtrar por data"
- "Deve validar campo obrigatório"

### **Performance**
⚡ Velocidade e eficiência
- "Carrega em < 3 segundos"
- "Processa 1000 registros em < 5s"

### **Segurança**
🔒 Proteção de dados
- "Usuário só vê dados dele"
- "Criptografa senha em trânsito"

### **UX**
🎨 Experiência do usuário
- "Confirmação antes de ação destrutiva"
- "Feedback claro de sucesso/erro"

### **Acessibilidade**
♿ Inclusão
- "WCAG AA+ compliance"
- "Funciona com teclado"

### **Responsividade**
📱 Multi-dispositivo
- "Funciona em desktop, tablet, mobile"
- "Fonte legível em telas pequenas"

---

## 💡 Exemplos de Jornadas Bem Construídas

### ✅ Bem Feito
```markdown
## 🎯 Objetivo da Jornada
Permitir que um professor envie missões em lote para uma turma 
com filtros opcionais em menos de 2 minutos.

### 3️⃣ **Filtros de Alunos**
- [ ] Sistema oferece filtro por desempenho
- [ ] Sistema oferece filtro por status de entrega
- [ ] Professor aplica um ou mais filtros
- [ ] Visualiza quantidade de alunos afetados
```

### ❌ Ruim Feito
```markdown
## 🎯 Objetivo da Jornada
Enviar missões

### 3️⃣ **Filtros**
- [ ] Filtra alunos
```

---

## 🔗 Relação com Storybook

Cada jornada indica **quais componentes** criar no Storybook:

```
Jornada: Professor envia missões
├── Componentes necessários
│   ├── ClassSelector.stories.tsx
│   ├── MissionCatalog.stories.tsx
│   ├── StudentFilter.stories.tsx
│   ├── ReviewModal.stories.tsx
│   └── SuccessNotification.stories.tsx
└── Documentação no Storybook
    └── Cada componente com exemplos visuais
```

---

## 📋 Checklist: Jornada Pronta para Desenvolvimento

Antes de marcar como "Design ✅", verifique:

- [ ] Persona definida com detalhes realistas
- [ ] Objetivo claro em uma frase
- [ ] Fluxo principal completo com 5+ etapas
- [ ] Cada etapa tem 2-4 ações específicas
- [ ] Critérios de aceitação cobrem: Funcional, Performance, Segurança, UX, Acessibilidade
- [ ] Componentes necessários listados
- [ ] Mínimo 2 fluxos alternativos
- [ ] Status atualizado
- [ ] Mockups de telas identificados (mesmo que em rascunho)
- [ ] Linguagem 100% em Português do Brasil

---

## 🚀 Próximas Jornadas Planejadas

| ID | Persona | Plataforma | Status |
|----|---------|-----------|--------|
| 01 | Professor | Front-office | ✅ Documentada |
| 02 | Admin | Backoffice | ✅ Documentada |
| 03 | Aluno | Games Platform | ✅ Documentada |
| 04 | Pais/Responsável | App Mobile | ⏳ Planejado |
| 05 | Diretor | Dashboard Executivo | ⏳ Planejado |

---

**Dúvidas?** Consulte `.github/instructions/` ou converse com o time de Design/Produto.
