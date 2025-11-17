# P1-002: MCP Figma Auth Intermitente

## 📋 Descrição
Autenticação com Figma via MCP está falhando intermitentemente, forçando fallback para REST API (mais lenta) e requerendo verificação manual frequente.

## 🎯 Objetivo
Implementar sistema robusto de autenticação com token refresh automático e circuit breaker pattern para eliminar falhas intermitentes.

## 💡 Contexto
O MCP (Model Context Protocol) para integração com Figma apresenta falhas de autenticação que interrompem workflows de validação e extração de dados. Isso impacta a confiabilidade do pipeline Figma → Validação.

## 📊 Impacto
- **Severidade:** Critical
- **Bloqueio:** Partial (fallback disponível, mas mais lento)
- **Esforço Estimado:** 1.0h
- **Prioridade:** P1
- **Recorrências:** 5x (primeira: 10/11, última: 14/11)

## 🔧 Solução Proposta
Implementar mecanismos de resiliência e auto-recuperação.

### Passos para Implementação
1. **Token Refresh Automático:**
   - Detectar 401/403 responses
   - Refresh token automaticamente
   - Retry request com novo token
   - Log de tentativas para debugging

2. **Circuit Breaker Pattern:**
   - Após 3 falhas consecutivas → abrir circuito
   - Fallback para REST API automaticamente
   - Tentar fechar circuito após 5 minutos
   - Alert para time DevOps após 5 falhas

3. **Health Check Background:**
   - Verificar auth a cada 5 minutos
   - Atualizar status em `mcp-health.json`
   - Integrar com `error-watcher.cjs`
   - Dashboard de status em real-time

4. **Implementar em:**
   - `scripts/check-mcp-figma.cjs` (refatorar)
   - `scripts/learning/error-watcher.cjs` (adicionar health check)
   - Criar `scripts/mcp/circuit-breaker.cjs` (novo)

## ✅ Critérios de Aceitação
- [ ] Token refresh automático funciona em falhas 401/403
- [ ] Circuit breaker abre após 3 falhas consecutivas
- [ ] Fallback automático para REST API quando MCP falha
- [ ] Health check rodando em background a cada 5 min
- [ ] Status MCP visível em `mcp-health.json`
- [ ] Logs detalhados de tentativas de auth
- [ ] Alert automático após 5 falhas consecutivas
- [ ] Zero intervenções manuais em 7 dias de operação

## 🚨 Workaround Atual
Executar verificação e recuperação manual antes de cada operação Figma:

```bash
# Executar antes de tarefas Figma
npm run mcp:check
# Se falhar, auto-recover:
npm run mcp:recover
```

## 📎 Arquivos Afetados
- `scripts/check-mcp-figma.cjs` (refatorar)
- `scripts/learning/error-watcher.cjs` (adicionar health check)
- `scripts/mcp/circuit-breaker.cjs` (criar)
- `scripts/mcp/token-manager.cjs` (criar)
- `mcp-health.json` (criar - status file)
- `package.json` (adicionar scripts: `mcp:health`, `mcp:status`)

## 🏷️ Tags
`mcp` `figma` `auth` `resilience` `circuit-breaker` `p1` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P1-002, linha 56-76)
- **MCP Guide:** `docs/MCP_VALIDATION_GUIDE.md`
- **Circuit Breaker Pattern:** [Martin Fowler - Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)

## 📝 Notas Adicionais
**Implementação Circuit Breaker:**
```javascript
class CircuitBreaker {
  constructor(threshold = 3, timeout = 300000) {
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

**Dashboard de Status (mcp-health.json):**
```json
{
  "status": "healthy",
  "lastCheck": "2025-11-17T17:30:00Z",
  "failures": 0,
  "circuitState": "CLOSED",
  "uptime": "99.5%"
}
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Última Atualização:** 17/11/2025  
**Categoria:** Technical Debt P1  
**Status:** 📋 BACKLOG
