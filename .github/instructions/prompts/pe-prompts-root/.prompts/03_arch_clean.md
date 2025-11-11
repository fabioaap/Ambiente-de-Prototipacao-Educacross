# 03_arch_clean — Arquitetura Limpa, Observabilidade e Segurança

## Camadas
1. **Domínio** — regras de negócio puras
2. **Aplicação** — casos de uso/orquestração
3. **Infra** — I/O, DB, filas, frameworks
4. **Interface** — APIs/transportes/UI

Dependências apontam sempre para o núcleo (domínio). Portas/adaptadores para isolar frameworks.

## Stack sugerida
- **Backend**: NestJS (Fastify) • **DB**: PostgreSQL + Prisma Migrate
- **Cache/Filas**: Redis + BullMQ • **Observabilidade**: OpenTelemetry (traces/métricas/logs)

## Testes
- Unit (domínio), integração (casos de uso + infra isolável), contrato (APIs), e2e (caminhos críticos).

## Segurança
- OWASP Top 10: autenticação/autorização, exposição de dados, deserialização, SSRF, dependências, rate limiting.
- Segredos via .env/cofres; dados pessoais minimizados e mascarados (LGPD).

## Operação
- Feature flags com TTL/owner/kill-switch; canário; rollback documentado.
- ADR para decisões que afetam domínios/limites e contratos.
