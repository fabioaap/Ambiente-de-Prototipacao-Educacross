# Jornada do Professor - Front-office

## 👤 Persona
- **Nome:** João Silva
- **Cargo:** Professor de Matemática
- **Experiência:** 10 anos
- **Objetivo:** Enviar missões gamificadas para turmas rapidamente
- **Dor:** Perder tempo configurando cada aluno individualmente

## 🎯 Objetivo da Jornada
Permitir que o professor envie missões em lote para uma turma inteira com filtros opcionais.

## 📋 Fluxo Principal

### 1️⃣ **Autenticação**
- [ ] Professor acessa o portal
- [ ] Login com credenciais LDAP/Autenticação Escolar
- [ ] Sistema valida credenciais
- [ ] Usuário redirecionado para Dashboard

### 2️⃣ **Seleção de Turma**
- [ ] Professor visualiza lista de turmas que leciona
- [ ] Seleciona a turma alvo (ex: "7º Ano A")
- [ ] Sistema carrega dados da turma (quantidade de alunos, missões disponíveis)

### 3️⃣ **Seleção de Missão**
- [ ] Professor visualiza catálogo de missões disponíveis
- [ ] Filtra por:
  - Disciplina
  - Nível de dificuldade
  - Competências
  - Data de criação
- [ ] Seleciona uma ou mais missões

### 4️⃣ **Definição de Parametrização**
- [ ] Define data de início
- [ ] Define data de término
- [ ] Define valor de pontos (opcional)
- [ ] Adiciona tags/categorias customizadas
- [ ] Define se é obrigatória ou opcional

### 5️⃣ **Seleção de Alunos (Filtros)**
- [ ] **Opção A:** Todos os alunos da turma
- [ ] **Opção B:** Alunos específicos (busca/filtro)
- [ ] **Opção C:** Filtro por critérios:
  - Desempenho anterior (abaixo da média, acima da média)
  - Status de entrega (alunos que não entregaram tarefas)
  - Grupo dentro da turma

### 6️⃣ **Revisão e Confirmação**
- [ ] Resumo:
  - Missões selecionadas
  - Turma e quantidade de alunos
  - Data de início/fim
  - Filtros aplicados
- [ ] Botão "Enviar em Lote"
- [ ] Sistema exibe confirmação com número de alunos afetados

### 7️⃣ **Envio e Feedback**
- [ ] Sistema processa o envio (background job)
- [ ] Exibe indicador de progresso
- [ ] Mostra:
  - ✅ Sucesso: "150 alunos receberam as missões"
  - ⚠️ Parcial: "140/150 alunos receberam. 10 tiveram erro"
  - ❌ Erro: Mensagem de erro com sugestão

## 📊 Critérios de Aceitação

| Critério | Tipo | Descrição |
|----------|------|-----------|
| **CA-1** | Funcional | Deve permitir seleção de múltiplas missões |
| **CA-2** | Funcional | Deve aplicar filtros de alunos corretamente |
| **CA-3** | Performance | Envio em lote ≤ 5 segundos para 200 alunos |
| **CA-4** | UX | Deve confirmar ação antes de enviar |
| **CA-5** | UX | Deve mostrar progresso do envio |
| **CA-6** | Segurança | Professor só vê suas turmas |
| **CA-7** | Acessibilidade | WCAG AA+ compliance |
| **CA-8** | Responsividade | Funciona em desktop, tablet, mobile |

## 🚀 Componentes Necessários

```
📦 Front-office
├── ClassSelector (Seleção de turma)
├── MissionCatalog (Catálogo de missões)
├── MissionFilters (Filtros)
├── StudentSelector (Seleção de alunos)
├── ParametrizationForm (Parâmetros)
├── ReviewModal (Revisão)
├── ProgressBar (Feedback de envio)
└── SuccessNotification (Resultado)
```

## 🔄 Fluxos Alternativos

### Cenário: Professor volta e tenta novamente
- [ ] Sistema salva rascunho da configuração
- [ ] Ao retornar, oferece "Continuar com anterior"
- [ ] Permite editar e reenviar

### Cenário: Aluno já tem a missão
- [ ] Sistema avisa: "X alunos já possuem esta missão"
- [ ] Oferece opções:
  - Cancelar
  - Sobrescrever (resetar progresso)
  - Enviar apenas para quem não tem

## 📱 Mockups de Telas

- [ ] Dashboard com turmas
- [ ] Seleção de missões
- [ ] Formulário de filtros
- [ ] Modal de revisão
- [ ] Tela de sucesso

## ✅ Statusdo Desenvolvimento

- **Planejamento:** ✅
- **Design:** ⏳ Em progresso
- **Prototipagem:** ⏳ Em fila
- **Implementação:** ⏳ Em fila
- **Testes:** ⏳ Em fila
- **Deploy:** ⏳ Em fila