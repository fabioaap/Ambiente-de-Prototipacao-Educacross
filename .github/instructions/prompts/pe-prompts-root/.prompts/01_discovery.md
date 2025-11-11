# 01_discovery — Descoberta Técnica Condicional

## Quando usar (Trilho B)
- Incerteza relevante (valor/UX/arquitetura) + custo de reversão baixo + amostra suficiente.

## Quando evitar (Trilho A)
- Requisitos claros, domínios regulados, tarefas fundacionais (segurança, performance), alto risco ético/jurídico.

## Formato obrigatório (responder nestes blocos)
- **Mini-OST**: Resultado → 2–3 Oportunidades → 1–2 Soluções → 1 Experimento.
- **Hipótese & Métrica-alvo**: efeito esperado e como medir.
- **Desenho do experimento**: coorte, janela, efeito mínimo detectável, rollback.
- **Guardrails técnicos**: feature flag (TTL/owner/kill-switch), canário, eventos mínimos (3–5), SLIs (latência/erro/throughput), PII mascarada.
- **Evidências & Decisão**: promover / iterar / matar + ADR curto.

## DoD-Discovery (Gate de promoção)
- [ ] Hipótese & métrica definidas e versionadas
- [ ] Flag com TTL/owner/kill-switch documentada
- [ ] Canary sem regressão de SLIs
- [ ] ADR com resultado e aprendizado
- [ ] PR de remoção da flag ou promoção para 100%

## Registro mínimo (ADR curto)
- Contexto → Hipótese → Como medimos → Resultado → Decisão → Próximos passos

> Ao falhar algum critério, migre para Trilho A (delivery fundacional).
