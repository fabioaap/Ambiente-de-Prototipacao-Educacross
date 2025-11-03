# GitHub Copilot - Instruções de Projeto

## 🎯 Contexto

Este projeto segue padrões rigorosos de qualidade, arquitetura limpa e descoberta técnica condicional.

## 📚 Leitura obrigatória

Antes de gerar código, consulte:
- `.github/instructions/Personalidade.instructions.md` — Instruções completas (PRIORIDADE)
- `.prompts/instructions.md` — Prompt principal
- `.prompts/blocks/00_core.md` — Fundação (papel, stack, DoD)
- `.prompts/blocks/03_arch_clean.md` — Arquitetura limpa

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

## 🏗️ Stack padrão

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui
- **Estado:** Zustand + React Query
- **Backend:** Node.js + NestJS + Fastify
- **Banco:** PostgreSQL + Prisma
- **Infra:** Redis, BullMQ, S3, Docker, GitHub Actions
- **Testes:** Vitest + Playwright + Storybook
- **Arquitetura:** Limpa/Hexagonal (Domínio → Aplicação → Infra → Interface)

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

## 🎨 Design System e UI Consistente

- Grid system unificado e tokens documentados
- Componentes com variações (hover, active, error, disabled)
- Acessibilidade e contraste (WCAG AA+)
- Documentação no Storybook como fonte de verdade
- Snapshots de UI para prevenir regressões

## 🏛️ Arquitetura Limpa e Testável

### Camadas:
1. **Domínio** — Regras de negócio puras
2. **Aplicação** — Casos de uso e orquestração
3. **Infraestrutura** — Frameworks, adaptadores e I/O
4. **Interface** — UI, APIs e gateways

### Regras:
- Dependências sempre apontam para o núcleo (domínio)
- Nenhuma lógica de negócio depende de frameworks
- Cada camada testável isoladamente
- Portas/adaptadores permitem experimentação segura

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

## 📖 Para mais detalhes

Consulte:
- Sistema de prompts modulares em `.prompts/`
- Instruções completas em `.github/instructions/Personalidade.instructions.md`
