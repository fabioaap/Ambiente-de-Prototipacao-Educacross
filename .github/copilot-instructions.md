# GitHub Copilot - Instruções de Projeto

## 🎯 Contexto

**Ambiente de Prototipagem e Validação - Educacross v1**

Ambiente dedicado para **equipe de produto e designers** criar protótipos funcionais, documentar fluxos e jornadas de usuário para:
- 📊 **Apresentações para stakeholders**
- 🧪 **Testes de usabilidade com usuários reais** 
- 🚀 **Construção de MVPs para validação**
- 📋 **Documentação de fluxos antes da implementação Vue.js**

Foco principal: wizard de envio de missões gamificadas em lote para professores e coordenadores pedagógicos.

## 🏗️ Arquitetura Específica do Projeto (v1)

### Estrutura Multi-Stack (orientada para validação)
- **Front-office**: HTML/CSS/JS puro (prototipagem rápida para testes)
- **Back-office**: HTML/CSS/JS puro (demonstrações para stakeholders) 
- **Game**: Stack separada (a ser definida)
- **Documentação**: Storybook para documentar componentes e gerar código Vue.js
- **Design Import**: MCP Figma para clonar designs com alta fidelidade
- **Jornadas**: Markdown em `docs/journeys/` com personas, fluxos e cenários de teste
- **Mocks**: Dados simulados realistas para demonstrações convincentes

### Padrão de Wizard Multi-Etapas (HTML/JS)
```javascript
// Pattern de state management vanilla JS
const wizardState = {
  currentStep: 'turma', // 'turma' | 'missoes' | 'configuracao' | 'revisao' | 'sucesso'
  selectedData: {},
  // Dados derivados calculados com funções puras
}
```

## 📚 Leitura obrigatória

Antes de gerar código, consulte:
- `docs/journeys/JOURNEY-envio-missoes-em-lote.md` — Fluxo principal e personas
- `docs/adr/ADR-0006-unified-prototyping-platform.md` — Arquitetura e decisões técnicas

## 🚨 Regras não negociáveis

### 1. Idioma: 100% português do Brasil (pt-BR)
- Commits, variáveis, comentários, documentação
- Mensagens de erro, logs, testes
- NUNCA misturar inglês e português no mesmo contexto

### 2. Sempre apresente 2-3 opções
- Com prós/contras
- Com estimativa de custo/prazo
- Deixe o usuário escolher a abordagem final

### 3. Peça confirmação antes de ações irreversíveis
- Deleções de arquivos/código
- Migrações de banco destrutivas
- Mudanças em configurações críticas

### 4. Finalize com autoavaliação
- Clareza (0-10)
- Completude (0-10)
- Eficiência (0-10)
- Nível de confiança (0-100%)

## 🔧 Comandos Essenciais

```powershell
# Desenvolvimento principal (v1 - HTML/CSS/JS)
# Abrir protótipos diretamente no navegador ou usar Live Server

# Design Import do Figma (MCP)
# Usar ferramentas MCP do Figma para importar designs com alta fidelidade
# Converte automaticamente componentes Figma → HTML/CSS

# Documentação e geração de código Vue.js
npm run storybook        # Storybook para documentar e gerar código Vue.js
npm run storybook:build  # Build estático do Storybook

# Validação de qualidade
npm run check-env        # Verificação completa do ambiente (quando aplicável)
npm run dev              # Vite dev server para componentes React (http://localhost:5173)
npm run test             # Testes unitários com Vitest
npm run check-types      # Verificação de tipos TypeScript
```

## 📊 Estrutura de Dados Específica

### Entidades Principais (JavaScript vanilla)
```javascript
// Estruturas de dados para protótipos HTML/JS
const turmaExample = {
  id: 'turma-001',
  nome: '3º Ano A', 
  serie: '3º Ano',
  professor: 'João Silva',
  alunos: 25,
  disciplina: 'Matemática',
  ativo: true
}

const missaoExample = {
  id: 'missao-001',
  titulo: 'Frações Divertidas',
  nivel: 'facil', // 'facil' | 'medio' | 'dificil'
  pontos: 100,
  competencias: ['Matemática', 'Raciocínio Lógico'],
  uso: 15
}
```

### Sistema de Mocks (crucial para prototipagem)
- **Dados realistas**: Arrays em JavaScript com dados simulados da plataforma real
- **Funções de simulação**: `simularEnvioBatch()` com setTimeout para latência
- **Armazenamento local**: localStorage para persistir estado entre páginas

## ✅ Definição de Pronto (DoD)

Uma entrega só é "pronta" quando:

- [ ] Código compila e todos os testes passam (≥80% cobertura)
- [ ] Flags e coortes documentadas, com TTL e owner (se aplicável)
- [ ] Logs estruturados e SLIs verificados
- [ ] Documentação atualizada (README/ADR/Storybook/OpenAPI)
- [ ] Checklist de PR completo
- [ ] Rollback documentado

## 🧭 Descoberta técnica condicional

### Trilho A — Delivery (quando NÃO usar discovery)
- Requisitos claros e domínio estável
- Tarefas fundacionais (segurança, performance, refatoração crítica)
- Ambientes regulados (LGPD, financeiro, saúde)

### Trilho B — Discovery (quando USAR)
- Incerteza validável com dados e baixo custo de reversão
- MVPs, hipóteses de UX, experimentos de arquitetura, otimizações

### Formato obrigatório (modo Discovery)
- **Mini-OST:** Resultado → Oportunidades → Soluções → Experimento
- **Hipótese & Métrica-Alvo:** O que se espera mudar e como será medido
- **Desenho do Experimento:** Coorte, janela, efeito mínimo detectável e rollback
- **Guardrails técnicos:**
  - Feature flags com TTL, owner e kill-switch
  - Observabilidade enxuta (3-5 eventos, logs estruturados, PII mascarada)
  - SLIs ativos (latência, throughput, erro)
- **DoD-Discovery (Gate de promoção):**
  - Hipótese e métrica definidas
  - Canary test sem regressões
  - ADR atualizado com evidências
  - Flags removidas ou promovidas
  - LGPD e ética garantidas

## 🎨 Padrões de UI e Componentes (v1)

### Design System: CSS/HTML Nativo + Figma Import
- **Estilização**: CSS puro com classes utilitárias ou Tailwind via CDN
- **Paleta educacional**: Azuis (#0066CC), verdes (#00AA44) para gamificação
- **Import Figma**: MCP Figma para clonar componentes com fidelidade pixel-perfect
- **Componentes**: Reutilização via templates HTML e classes CSS consistentes
- **Responsividade**: CSS Grid e Flexbox nativos

### Padrão de Componentes HTML
```html
<!-- Template reutilizável para cards -->
<div class="card-missao" data-missao-id="123">
  <div class="card-header">
    <span class="nivel-badge nivel-facil">Fácil</span>
    <span class="pontos">100 pts</span>
  </div>
  <h3 class="titulo">Nome da Missão</h3>
  <div class="competencias">...</div>
</div>
```

### JavaScript Pattern para Estado
```javascript
// Gerenciamento de estado global simples
const AppState = {
  currentStep: 'turma',
  selectedTurmas: [],
  updateStep: function(step) { this.currentStep = step; },
  // Eventos customizados para comunicação entre componentes
}
```

### Storybook para Documentação Vue.js
```typescript
// Stories documentam componentes para conversão em Vue.js
export const CardMissao: Story = {
  args: { nivel: 'facil', pontos: 100, titulo: 'Exemplo' },
  // Documentação automática gera código Vue.js equivalente
}
```

## 🧩 Arquitetura de Prototipagem (v1)

### Estrutura de Pasta HTML/JS
```
Front-office/
├── [protótipos].html  # Páginas HTML individuais para cada fluxo
├── assets/           # CSS, JS, imagens
├── components/       # Templates HTML reutilizáveis 
└── mocks/           # Arrays JS com dados simulados

Back-office/
├── [páginas específicas].html
├── assets/
└── mocks/

Game/                 # Stack separada (TBD)

src/                  # Componentes React para Storybook → Vue.js
├── components/       # Componentes documentados no Storybook
└── stories/          # Stories que geram documentação Vue.js
```

### Princípios Específicos do Protótipo (orientado para validação)
- **Dados realistas**: Arrays JavaScript simulam cenários reais para demonstrações
- **Fidelidade visual**: MCP Figma garante proximidade pixel-perfect com designs
- **Experiência convincente**: UX/UI idêntica ao produto final para testes válidos
- **Estado persistente**: localStorage para simular jornadas completas
- **Facilidade de modificação**: Código simples para iteração rápida com feedback

### Fluxo de Dados (HTML/JS Pattern)
```
HTML → Event Listeners → JavaScript Functions → DOM Updates → localStorage
```

## 📋 Checklist de PR

- [ ] Segurança (autenticação, autorização, segredos)
- [ ] Performance (índices, N+1, cache)
- [ ] Acessibilidade e i18n
- [ ] Observabilidade (logs, tracing, métricas)
- [ ] Documentação atualizada e CHANGELOG revisado

## 📖 Estrutura de resposta obrigatória

Ao gerar código ou responder perguntas, SEMPRE siga esta estrutura:

1. **Contexto entendido**
2. **Opções de abordagem** (2-3) — com prós/contras e custo/prazo
3. **Plano passo a passo**
4. **Validação de requisitos não funcionais**
5. **Código** (Patch/Diff)
6. **Testes** (unitário, integração, e2e)
7. **Simulação de testes e resultados esperados**
8. **Documentação** (README/ADR/OpenAPI/Storybook)
9. **Como rodar/validar** (comandos, URLs, dados)
10. **Checklist de PR**
11. **Riscos e mitigação**
12. **Resumo de decisões** (O que / Por quê / Impacto)
13. **Autoavaliação** (0-10) e justificativa
14. **Nível de confiança** (%)
15. **Modo Sintético** (se ativado)

## 🎯 Exemplos de uso correto

### ❌ Errado (sem contexto, sem opções)
```typescript
// Criar componente de botão
export function Button() {
  return <button>Click me</button>
}
```

### ✅ Correto (com contexto, opções e autoavaliação)
```markdown
## Contexto entendido
Criar componente de botão reutilizável com variantes.

## Opções de abordagem
1. **shadcn/ui Button** (recomendado)
   - Prós: Padronizado, acessível
   - Contras: Menos customizável
   - Prazo: 10 min

2. **Custom Button**
   - Prós: Total controle
   - Contras: Mais trabalho
   - Prazo: 30 min

## Implementação (Opção 1)

...código aqui...

## Autoavaliação
- Clareza: 10/10
- Completude: 10/10
- Eficiência: 10/10
- Confiança: 100%
```

## 🎯 Para mais detalhes

Consulte:
- Sistema de prompts modulares em `.prompts/`
- Instruções completas em `.github/instructions/Personalidade.instructions.md`

## 📖 Para mais detalhes

Consulte:
- Sistema de prompts modulares em `.prompts/`
- Instruções completas em `.github/instructions/Personalidade.instructions.md`
