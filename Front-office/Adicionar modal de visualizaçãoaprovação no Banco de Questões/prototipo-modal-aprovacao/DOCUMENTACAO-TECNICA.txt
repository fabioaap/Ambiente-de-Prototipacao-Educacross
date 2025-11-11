# 📖 Documentação Técnica - Modal de Aprovação de Questões

## 🎯 Objetivo

Documentar a implementação técnica do protótipo de **modal de aprovação de questões** para facilitar a transição do protótipo HTML/CSS/JS para a implementação final em Vue.js/React.

---

## 🏗️ Arquitetura

### Stack Tecnológica (Protótipo)
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização (inline e embedded)
- **JavaScript ES6+**: Lógica de negócio
- **Sem frameworks**: Vanilla JS puro

### Stack Tecnológica (Produção Recomendada)
- **Vue.js 3** ou **React 18**
- **Vuetify 3** ou **Material-UI**
- **TypeScript** para type-safety
- **Pinia** (Vue) ou **Redux** (React) para state management
- **Vitest** ou **Jest** para testes

---

## 📊 Estrutura de Dados

### Modelo de Questão

```javascript
{
  numero: "#687",                  // ID único da questão
  areaConhecimento: "Matemática",  // Área do conhecimento
  nivelBloom: "4: Analisar",       // Nível cognitivo
  subnivelBloom: "4.2 Organizar",  // Subnível cognitivo
  enunciado: "Texto da questão...", // Enunciado principal
  processada: false,               // Flag para sistema de fila
  alternativas: [                  // Array de alternativas
    {
      texto: "1/3",
      correta: true,
      ajuda: "Texto de ajuda...",
      resolucao: "Passo a passo...",
      distrator: "Explicação do erro..." // Apenas para incorretas
    },
    // ... mais alternativas
  ],
  topico: {
    titulo: "Período de uma dízima periódica",
    objeto: "Dízimas Periódicas",
    tematica: "Números",
    bncc: "BNCC 6º Ano - Números - EF06MA02...",
    dificuldade: "Muito Difícil" // "Fácil" | "Médio" | "Muito Difícil"
  }
}
```

### Estado Global

```javascript
let questaoAtual = 0;           // Índice da questão sendo visualizada
let totalQuestoes = 5;          // Total de questões no array
let aprovadas = 0;              // Contador de questões aprovadas
let reprovadas = 0;             // Contador de questões reprovadas
let emTransicao = false;        // Flag para evitar múltiplos cliques
const totalSelecionadas = 5;    // Total de questões selecionadas
```

---

## 🔄 Fluxo de Dados

### Diagrama de Estados

```
[Início] → [Modal Aberto]
           ↓
[Renderizar Questão Atual]
           ↓
[Usuário Interage] → [Aprovar] ou [Reprovar] ou [Navegar]
           ↓
[Atualizar Estado Global]
           ↓
[Marcar Questão como Processada] (se aprovar/reprovar)
           ↓
[Filtrar Questões Não Processadas]
           ↓
[Renderizar Próxima Questão] ou [Exibir Toast Final]
```

### Ciclo de Vida de uma Questão

```
1. [não processada] → Visível na fila
2. [Usuário aprova/reprova] → Flag processada = true
3. [processada] → Removida do array filtrado
4. [nunca mais visível] → Não pode voltar
```

---

## 🧩 Componentes e Funções

### 1. Sistema de Fila (Core Logic)

#### `getQuestoesNaoProcessadas()`
**Propósito**: Retorna apenas questões que não foram aprovadas ou reprovadas.

```javascript
function getQuestoesNaoProcessadas() {
    return questoes.filter(q => !q.processada);
}
```

**Complexidade**: O(n) onde n = número de questões  
**Uso**: Chamada toda vez que precisa saber quais questões estão disponíveis

---

#### `updateProgress()`
**Propósito**: Atualiza contador de progresso (processadas/restantes).

```javascript
function updateProgress() {
    const processadas = aprovadas + reprovadas;
    const restantes = totalSelecionadas - processadas;
    const el = document.getElementById('paginationProgress');
    if (el) el.textContent = `${processadas}/${restantes}`;
}
```

**Fórmula**:
- `processadas = aprovadas + reprovadas`
- `restantes = totalSelecionadas - processadas`
- Exibição: `"3/2"` = 3 processadas, 2 restantes

**Exemplo de Evolução**:
```
0/5 → 1/4 → 2/3 → 3/2 → 4/1 → 5/0
```

---

#### `updatePageCounter()`
**Propósito**: Atualiza contador de páginas (posição atual/total disponível).

```javascript
function updatePageCounter() {
    const naoProcessadas = getQuestoesNaoProcessadas();
    const el = document.getElementById('pageCounter');
    if (!el) return;
    el.textContent = `${questaoAtual + 1}/${naoProcessadas.length}`;
}
```

**Fórmula**:
- `posição atual = questaoAtual + 1` (1-indexed para UI)
- `total disponível = getQuestoesNaoProcessadas().length`
- Exibição: `"2/4"` = visualizando 2ª de 4 disponíveis

**Exemplo de Evolução**:
```
1/5 → 1/4 → 2/3 → 1/2 → 1/1 → Toast Final
```

---

### 2. Renderização

#### `renderQuestao()`
**Propósito**: Renderiza a questão atual na tela.

**Fluxo**:
```javascript
1. Obter array filtrado (apenas não processadas)
2. Validar se ainda existem questões
   ├─ Se não: Exibir toast final → Fechar modal
   └─ Se sim: Continuar
3. Ajustar índice se passou dos limites
4. Obter questão atual do array filtrado
5. Atualizar todos os elementos do DOM:
   ├─ Informações da questão (#questaoNumero, #areaConhecimento, etc)
   ├─ Tópico de conhecimento
   ├─ BNCC e dificuldade
   └─ Alternativas (criar elementos dinamicamente)
6. Atualizar contadores (progress + page)
7. Gerenciar estado dos botões (habilitar/desabilitar)
8. Reset scroll para o topo
```

**Tratamento de Edge Cases**:
- ✅ Array vazio (todas processadas)
- ✅ Índice fora dos limites (ajusta automaticamente)
- ✅ Questão sem alternativas (não quebra)
- ✅ Topicos inexistentes (fallback para string vazia)

---

### 3. Ações do Usuário

#### `aprovarQuestao()`
**Propósito**: Marca questão como aprovada e avança.

**Fluxo**:
```javascript
1. Verificar se já está em transição (evitar duplo clique)
2. Obter questão atual do array filtrado
3. Encontrar questão no array original (por número)
4. Marcar como processada: questoes[indice].processada = true
5. Incrementar contador global: aprovadas++
6. Atualizar contador de progresso
7. Exibir feedback visual ("Questão aprovada!")
8. Desabilitar botões temporariamente
9. Aguardar 900ms (animação)
10. Chamar proximaQuestao(true)
```

**Importante**: `questaoAtual` **NÃO é incrementado** porque o array filtrado já remove a questão processada.

---

#### `reprovarQuestao()`
**Propósito**: Marca questão como reprovada e avança.

**Fluxo**: Idêntico a `aprovarQuestao()`, mas incrementa `reprovadas++`

---

#### `proximaQuestao(avancoPorFeedback)`
**Propósito**: Navega para a próxima questão disponível.

**Parâmetros**:
- `avancoPorFeedback`: boolean
  - `true` = Chamada após aprovar/reprovar (não incrementa índice)
  - `false` = Clique manual no botão "Próxima" (incrementa índice)

**Fluxo**:
```javascript
1. Verificar se está em transição
2. Obter array filtrado
3. Se array vazio: Exibir toast final → Fechar modal
4. Se avancoPorFeedback === false: questaoAtual++
5. Validar limites do índice
6. Chamar renderQuestao()
7. Resetar flag emTransicao
```

**Lógica do Índice**:
```javascript
// Após aprovar Q1 (índice 0):
// - Q1 é marcada como processada
// - Array filtrado: [Q2, Q3, Q4, Q5]
// - questaoAtual permanece 0 (aponta para Q2 agora)
// - NÃO incrementamos porque Q1 já saiu do array!

// Ao clicar "Próxima" manualmente:
// - questaoAtual++ (0 → 1)
// - Array filtrado: [Q2, Q3, Q4, Q5]
// - questaoAtual = 1 aponta para Q3
```

---

#### `anteriorQuestao()`
**Propósito**: Volta para a questão anterior (apenas não processadas).

**Fluxo**:
```javascript
1. Verificar se questaoAtual > 0
2. Se sim: questaoAtual--
3. Chamar renderQuestao()
```

**Importante**: Como trabalhamos com array filtrado, voltar sempre mostra a próxima questão **não processada** anterior.

---

### 4. Controle de Modal

#### `abrirModal()`
**Propósito**: Abre o modal e reseta todo o estado.

```javascript
function abrirModal() {
    // Resetar flags de processamento
    questoes.forEach(q => q.processada = false);
    aprovadas = 0;
    reprovadas = 0;
    questaoAtual = 0;
    
    document.getElementById('modalAprovacao').style.display = 'flex';
    renderQuestao();
}
```

**Garantias**:
- ✅ Todas as questões voltam a estar disponíveis
- ✅ Contadores zerados
- ✅ Estado limpo (idempotência)

---

#### `fecharModal()`
**Propósito**: Fecha o modal.

```javascript
function fecharModal() {
    document.getElementById('modalAprovacao').style.display = 'none';
}
```

**Nota**: Estado NÃO é limpo aqui (apenas ao reabrir)

---

### 5. Feedback Visual

#### `showFeedback(msg, tipo)`
**Propósito**: Exibe cards de feedback com animação.

**Tipos de Feedback**:
- `"aprovado"` → Card verde com ícone ✓
- `"reprovado"` → Card vermelho com ícone ✗
- `"final"` → Card azul com mensagem de conclusão
- `""` (vazio) → Remove feedback da tela

**Implementação**:
```javascript
// Cria dimmer (overlay semitransparente)
// Cria card centralizado com:
// - Ribbon colorido (topo)
// - Ícone (✓, ✗, ou 🎉)
// - Mensagem de texto
// Animação de entrada: slide-up + fade-in
```

---

## 🎨 Sistema de Estilos

### Design Tokens (Cores)

```css
/* Primárias */
--primary: #7367F0;          /* Roxo principal (botões, títulos) */
--primary-hover: #6259e8;    /* Roxo hover */

/* Ações */
--success: #28c76f;          /* Verde (aprovação) */
--danger: #ef4444;           /* Vermelho (reprovação) */

/* Neutros */
--gray-900: #2f2b3d;         /* Texto principal */
--gray-700: #5e5873;         /* Texto secundário */
--gray-500: #b9b9c3;         /* Texto disabled */
--gray-300: #d8d6de;         /* Bordas */
--gray-100: #f3f2f7;         /* Backgrounds */

/* Semântica */
--text-primary: #2d3a61;     /* Texto escuro */
--text-secondary: #676d7d;   /* Texto médio */
--text-muted: #bfbfbf;       /* Texto claro */
```

### Componentes Principais

#### Modal Overlay
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
```

#### Modal Dialog
```css
.modal-dialog {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
```

#### Badges (Contadores nos Botões)
```css
.badge {
  display: inline-flex;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  font: 700 12px/1 system-ui;
  background: rgba(255,255,255,.22);
  color: #fff;
}
```

---

## ♿ Acessibilidade (WCAG 2.1)

### Recursos Implementados

#### 1. Live Region para Anúncios
```html
<div id="sr-status" role="status" class="sr-only" 
     aria-live="polite" aria-atomic="true">
  Aprovadas: 0. Reprovadas: 0.
</div>
```

**Comportamento**:
- `role="status"` implica `aria-live="polite"` automaticamente
- `aria-atomic="true"` anuncia o texto completo quando muda
- `.sr-only` esconde visualmente mas mantém para leitores de tela
- Atualizado toda vez que contadores mudam

#### 2. Botões Nativos
```html
<button class="btn btn-aprovar" id="btnAprovar">
  <span class="badge">0</span>
  <span>Aprovar</span>
</button>
```

**Benefícios**:
- ✅ Foco nativo por teclado (Tab)
- ✅ Ativação por Enter/Space
- ✅ Semântica correta para screen readers
- ✅ Estados :hover, :focus, :active automáticos

#### 3. Classe Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

**Uso**: Esconder elementos visualmente mas manter para tecnologias assistivas.

---

## 🧪 Testes

### Casos de Teste Principais

#### Teste 1: Fluxo Linear de Aprovação
```javascript
// Cenário: Aprovar todas as 5 questões sequencialmente
1. abrirModal()
2. Verificar: questaoAtual === 0, questoes[0].processada === false
3. aprovarQuestao()
4. Aguardar 900ms
5. Verificar: aprovadas === 1, questoes[0].processada === true
6. Verificar: getQuestoesNaoProcessadas().length === 4
7. Repetir passos 3-6 para Q2, Q3, Q4, Q5
8. Verificar toast final exibido
9. Aguardar 2s
10. Verificar modal fechado
```

#### Teste 2: Navegação com Voltar
```javascript
// Cenário: Navegar → Voltar → Aprovar → Tentar Voltar
1. abrirModal()
2. proximaQuestao(false) // Q1 → Q2
3. Verificar: questaoAtual === 1
4. anteriorQuestao() // Q2 → Q1
5. Verificar: questaoAtual === 0
6. aprovarQuestao() // Aprovar Q1
7. Verificar: btnPrev.disabled === true (Q1 processada, não pode voltar)
```

#### Teste 3: Contadores Dinâmicos
```javascript
// Cenário: Validar evolução dos contadores
1. abrirModal()
2. Verificar: pageCounter === "1/5", progressCounter === "0/5"
3. aprovarQuestao()
4. Verificar: pageCounter === "1/4", progressCounter === "1/4"
5. reprovarQuestao()
6. Verificar: pageCounter === "1/3", progressCounter === "2/3"
7. Verificar: badgeAprovar === "1", badgeReprovar === "1"
```

#### Teste 4: Edge Cases
```javascript
// Cenário: Processar todas e reabrir
1. Processar todas as 5 questões
2. Modal fecha automaticamente
3. abrirModal() novamente
4. Verificar: Todas flags processada === false
5. Verificar: aprovadas === 0, reprovadas === 0
6. Verificar: questaoAtual === 0
7. Verificar: Questão #687 é exibida novamente
```

---

## 🔄 Migração para Produção

### Recomendações Vue.js 3

#### Estrutura de Componentes
```
components/
├── ModalAprovacao/
│   ├── ModalAprovacao.vue       (Container principal)
│   ├── QuestaoCard.vue          (Exibe questão atual)
│   ├── AlternativaItem.vue      (Item de alternativa)
│   ├── ContadorProgresso.vue    (Badge de contadores)
│   ├── BotaoAcao.vue            (Aprovar/Reprovar com badge)
│   └── FeedbackToast.vue        (Feedback visual)
```

#### State Management (Pinia)
```javascript
// stores/questoesAprovacao.js
export const useQuestoesAprovacaoStore = defineStore('questoesAprovacao', {
  state: () => ({
    questoes: [],
    questaoAtual: 0,
    aprovadas: 0,
    reprovadas: 0,
    emTransicao: false
  }),
  
  getters: {
    questoesNaoProcessadas: (state) => 
      state.questoes.filter(q => !q.processada),
    
    podeVoltar: (state) => state.questaoAtual > 0,
    
    podeAvancar: (state, getters) => 
      state.questaoAtual < getters.questoesNaoProcessadas.length - 1
  },
  
  actions: {
    async aprovarQuestao(questao) {
      // Lógica de aprovação + chamada API
    },
    
    async reprovarQuestao(questao) {
      // Lógica de reprovação + chamada API
    }
  }
})
```

#### Composable para Lógica de Fila
```javascript
// composables/useFilaQuestoes.js
export function useFilaQuestoes() {
  const store = useQuestoesAprovacaoStore()
  
  const proximaQuestao = (avancoPorFeedback = false) => {
    // Implementação...
  }
  
  const anteriorQuestao = () => {
    // Implementação...
  }
  
  return { proximaQuestao, anteriorQuestao }
}
```

### API Endpoints Necessários

#### 1. Listar Questões para Aprovação
```http
GET /api/v1/questoes/pendentes
Authorization: Bearer {token}
Query Params:
  - status: "aguardando_aprovacao"
  - limit: 50
  - offset: 0

Response 200:
{
  "data": [
    {
      "id": "687",
      "numero": "#687",
      "areaConhecimento": "Matemática",
      "nivelBloom": "4: Analisar",
      // ... resto dos campos
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 50
}
```

#### 2. Aprovar Questão
```http
POST /api/v1/questoes/{id}/aprovar
Authorization: Bearer {token}
Body:
{
  "observacoes": "Questão validada e aprovada.",
  "aprovadoPor": "user_id_123"
}

Response 200:
{
  "success": true,
  "questao": {
    "id": "687",
    "status": "aprovada",
    "aprovadaEm": "2025-11-07T10:30:00Z",
    "aprovadoPor": "user_id_123"
  }
}
```

#### 3. Reprovar Questão
```http
POST /api/v1/questoes/{id}/reprovar
Authorization: Bearer {token}
Body:
{
  "motivo": "Enunciado confuso.",
  "reprovadoPor": "user_id_123"
}

Response 200:
{
  "success": true,
  "questao": {
    "id": "687",
    "status": "reprovada",
    "reprovadaEm": "2025-11-07T10:30:00Z",
    "reprovadoPor": "user_id_123",
    "motivo": "Enunciado confuso."
  }
}
```

---

## 🚨 Considerações de Produção

### Performance

#### Otimizações Necessárias:
- ✅ **Virtualização**: Para listas >100 questões (vue-virtual-scroller)
- ✅ **Lazy Loading**: Carregar questões sob demanda
- ✅ **Debounce**: Em buscas e filtros
- ✅ **Memoization**: Computeds pesados (getters Pinia)

### Segurança

#### Validações Backend:
- ✅ **Autenticação**: JWT ou sessão
- ✅ **Autorização**: Apenas usuários com permissão podem aprovar
- ✅ **Rate Limiting**: Evitar spam de aprovações
- ✅ **Auditoria**: Log de todas as ações (quem, quando, o quê)

### Tratamento de Erros

#### Cenários a Cobrir:
- ❌ Erro de rede (timeout, offline)
- ❌ Token expirado (refresh automático)
- ❌ Questão já aprovada por outro usuário (conflito)
- ❌ Permissão insuficiente (403 Forbidden)
- ❌ Questão não encontrada (404 Not Found)

#### Pattern de Retry:
```javascript
async function aprovarQuestaoComRetry(questaoId, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await api.post(`/questoes/${questaoId}/aprovar`)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(1000 * Math.pow(2, i)) // Exponential backoff
    }
  }
}
```

---

## 📊 Métricas e Observabilidade

### Eventos a Rastrear (Analytics)

```javascript
// Exemplo com Google Analytics / Mixpanel
trackEvent('modal_aprovacao_aberto', {
  totalQuestoes: 5,
  usuario_id: userId
})

trackEvent('questao_aprovada', {
  questao_id: '687',
  tempo_decisao_ms: 4500,
  usuario_id: userId
})

trackEvent('questao_reprovada', {
  questao_id: '688',
  tempo_decisao_ms: 8200,
  motivo: 'Enunciado confuso',
  usuario_id: userId
})

trackEvent('lote_concluido', {
  totalQuestoes: 5,
  aprovadas: 3,
  reprovadas: 2,
  tempo_total_ms: 45000,
  usuario_id: userId
})
```

### KPIs Importantes

- ⏱️ **Tempo médio por questão**: Medir eficiência
- 📊 **Taxa de aprovação**: % aprovadas vs reprovadas
- 🔄 **Taxa de navegação**: Quantas vezes voltam antes de decidir
- 🚪 **Taxa de abandono**: % que fecham sem terminar

---

## 🔗 Referências

### Documentos Relacionados
- 📋 [CHANGELOG.md](./CHANGELOG.md) - Histórico de mudanças
- 📖 [README.md](./README.md) - Guia de uso
- 🎨 Figma: [Link para design] (se disponível)
- 📊 Jornada: [Link para mapeamento] (se disponível)

### Padrões e Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)
- [Material Design](https://material.io/design)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 Changelog da Documentação

| Data | Versão | Mudanças |
|------|--------|----------|
| 2025-11-07 | 1.0.0 | Documentação inicial completa |

---

**Dúvidas técnicas? Abra um issue ou entre em contato com a equipe!** 🚀
