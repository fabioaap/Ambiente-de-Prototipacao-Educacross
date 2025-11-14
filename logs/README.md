# Logs Directory

Este diretório contém logs do sistema de aprendizagem contínua.

## Arquivos

- **error-log.jsonl** — Log de erros capturados pelo error-watcher.cjs (formato JSON Lines)
- **heartbeat.log** — Status do error-watcher (a cada 30min)

## Formato error-log.jsonl

Cada linha é um JSON válido:

```json
{
  "timestamp": "2025-11-14T13:30:00.000Z",
  "pattern": "MCP_OFFLINE",
  "message": "MCP Figma server not running...",
  "stack": "at Function.checkMcp (scripts/check-mcp-figma.cjs:45:10)",
  "pid": 12345,
  "env": "development"
}
```

## Análise

```bash
# Contar erros por pattern
cat logs/error-log.jsonl | jq -r '.pattern' | sort | uniq -c

# Ver erros das últimas 24h
cat logs/error-log.jsonl | jq -r 'select(.timestamp > "2025-11-13T13:30:00Z")'

# Executar triagem automática
npm run learning:analyze
```

## Limpeza

Logs são rotacionados automaticamente a cada 7 dias (via CI/CD).

Para limpar manualmente:
```bash
Remove-Item logs/error-log.jsonl -Force
```
