# Jornada do Administrador - Backoffice

## 👤 Persona
- **Nome:** Maria Santos
- **Cargo:** Coordenadora Pedagógica
- **Experiência:** 15 anos
- **Objetivo:** Gerenciar professores, turmas e missões em toda a rede de escolas
- **Dor:** Falta de visibilidade sobre o progresso das missões

## 🎯 Objetivo da Jornada
Fornecer painéis administrativos para monitorar, gerenciar e reportar sobre o envio de missões.

## 📋 Fluxo Principal

### 1️⃣ **Login Administrativo**
- [ ] Admin acessa portal backoffice
- [ ] Autenticação com 2FA (segurança)
- [ ] Dashboard carrega com visão consolidada

### 2️⃣ **Dashboard Principal**
Exibe cards com:
- Total de missões enviadas (período)
- Taxa de conclusão média
- Escolas ativas
- Professores ativos
- Alunos participando
- Alertas críticos

### 3️⃣ **Gerenciamento de Missões**
- [ ] Visualizar todas as missões do sistema
- [ ] Aprovar/rejeitar missões de professores
- [ ] Editar metadados (categoria, competências, nível)
- [ ] Ativar/desativar
- [ ] Duplicar para outras escolas
- [ ] Versionar (manter histórico)

### 4️⃣ **Monitoramento de Envios em Lote**
- [ ] Visualizar histórico de envios
- [ ] Filtrar por:
  - Escola
  - Professor
  - Período
  - Status (Sucesso, Erro, Parcial)
- [ ] Detalhes de cada envio:
  - Quantidade de alunos
  - Quantidade de sucessos/falhas
  - Relatório de erros
  - Timestamp

### 5️⃣ **Análise de Engajamento**
- [ ] Gráficos de:
  - Missões completadas vs enviadas
  - Taxa de conclusão por escola
  - Taxa de conclusão por turma
  - Distribuição de pontos
- [ ] Comparação período anterior vs período atual
- [ ] Identificar outliers (escolas abaixo da média)

### 6️⃣ **Gerenciamento de Professores**
- [ ] Lista de professores com:
  - Escolas atribuídas
  - Quantidade de turmas
  - Quantidade de missões enviadas
  - Status de atividade
- [ ] Ações:
  - Ativar/desativar
  - Resetar senha
  - Auditar histórico de envios

### 7️⃣ **Relatórios Customizados**
- [ ] Gerar relatórios em PDF/Excel:
  - Performance por escola
  - Performance por professor
  - Taxa de conclusão por missão
  - ROI (horas investidas vs resultado)
- [ ] Agendar relatórios automáticos
- [ ] Exportar para análise

### 8️⃣ **Alertas e Notificações**
- [ ] Sistema monitora:
  - Envios falhados
  - Taxa de conclusão baixa
  - Professores inativos
  - Alunos sem engajamento
- [ ] Envia notificações automáticas

## 📊 Critérios de Aceitação

| Critério | Tipo | Descrição |
|----------|------|-----------|
| **CA-1** | Funcional | Dashboard carrega em < 3s |
| **CA-2** | Funcional | Filtros retornam resultados corretos |
| **CA-3** | Performance | Gráficos renderizam para 10k+ registros |
| **CA-4** | Segurança | 2FA obrigatório |
| **CA-5** | Segurança | Admin só vê escolas autorizadas |
| **CA-6** | UX | Interface intuitiva sem treinamento |
| **CA-7** | Acessibilidade | WCAG AA+ compliance |
| **CA-8** | Compliance | Logs de auditoria para todas as ações |

## 🚀 Componentes Necessários

```
📦 Backoffice
├── AdminDashboard (Dashboard principal)
├── MissionManager (CRUD de missões)
├── BatchMonitor (Monitoramento de envios)
├── EngagementAnalytics (Análise de engajamento)
├── TeacherManagement (CRUD de professores)
├── ReportGenerator (Gerador de relatórios)
├── AlertManager (Gerenciador de alertas)
├── AuditLog (Log de auditoria)
└── Charts (Gráficos: Bar, Line, Pie, Heatmap)
```

## 📊 Dados Esperados

- **KPIs em Tempo Real:**
  - Taxa de envio: Missões enviadas / dia
  - Taxa de conclusão: Missões completadas / enviadas
  - Tempo médio de conclusão: X dias
  - Taxa de retenção: Alunos ativos / semana

- **Relatórios Periódicos:**
  - Semanal: Performance por escola
  - Mensal: ROI, insights de engajamento
  - Trimestral: Tendências, recomendações

## 🔄 Fluxos Alternativos

### Cenário: Erro massivo em envios
- [ ] Sistema detecta (> 20% de falha)
- [ ] Alerta crítico ao admin
- [ ] Opção de "Retry Automático"
- [ ] Opção de "Suporte Técnico"

### Cenário: Missão com baixa conclusão
- [ ] Sistema sugere:
  - Verificar dificuldade
  - Estender prazo
  - Enviar lembretes
  - Descontinuar

## 📱 Mockups de Telas

- [ ] Dashboard com cards KPI
- [ ] Tabela de histórico de envios
- [ ] Gráficos de análise
- [ ] Formulário de filtros avançados
- [ ] Modal de detalhes do envio

## ✅ Status do Desenvolvimento

- **Planejamento:** ✅
- **Design:** ⏳ Em progresso
- **Prototipagem:** ⏳ Em fila
- **Implementação:** ⏳ Em fila
- **Testes:** ⏳ Em fila
- **Deploy:** ⏳ Em fila