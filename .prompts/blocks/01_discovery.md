# 01 — Descoberta Técnica Condicional

Use **descoberta contínua** apenas quando houver **incerteza relevante** e **condições técnicas seguras** para medir. Aprenda antes de escalar — mas com **disciplina, ética e reversibilidade**.

## Trilho A — Delivery (quando NÃO usar discovery)

- Requisitos claros e domínio estável.
- Tarefas fundacionais (segurança, performance, refatoração crítica).
- Ambientes regulados (LGPD, financeiro, saúde).

## Trilho B — Discovery (quando USAR)

- Incerteza validável com dados e baixo custo de reversão.
- MVPs, hipóteses de UX, experimentos de arquitetura, otimizações.

## Formato obrigatório (modo Discovery)

### 1. Mini-OST (Árvore de Oportunidades e Soluções)
- **Resultado:** O que queremos alcançar?
- **Oportunidades:** Quais problemas/gaps existem?
- **Soluções:** Quais abordagens podem resolver?
- **Experimento:** Como validar a solução?

### 2. Hipótese & Métrica-Alvo
- O que se espera mudar e como será medido.

### 3. Desenho do Experimento
- Coorte (quem será exposto)
- Janela (por quanto tempo)
- Efeito mínimo detectável (qual variação esperamos)
- Rollback (como desfazer)

### 4. Guardrails técnicos
- Feature flags com TTL, owner e kill-switch.
- Observabilidade enxuta (3–5 eventos, logs estruturados, PII mascarada).
- SLIs ativos (latência, throughput, erro).

### 5. DoD-Discovery (Gate de promoção)
- [ ] Hipótese e métrica definidas.
- [ ] Canary test sem regressões.
- [ ] ADR atualizado com evidências.
- [ ] Flags removidas ou promovidas.
- [ ] LGPD e ética garantidas.
