# P2-006: Mocks Sem Schema Validation

## 📋 Descrição
Mocks em `src/mocks/` não possuem validação de schema automática, permitindo dados inconsistentes que podem causar erros em runtime.

## 🎯 Objetivo
Implementar JSON Schema + Ajv para validação completa de mocks, garantindo que dados mockados sempre estão consistentes com tipos TypeScript e regras de negócio.

## 💡 Contexto
Mocks são fonte de dados para desenvolvimento e testes, mas sem validação de schema:
- Dados podem ter estrutura inconsistente
- Erros só aparecem em runtime
- Dificulta debug de problemas
- Violações de regras de negócio (ex: `progress` deve ser 0)

## 📊 Impacto
- **Severidade:** Medium
- **Bloqueio:** None
- **Esforço Estimado:** 0.75h
- **Prioridade:** P2

## 🔧 Solução Proposta
Implementar validação de schema usando JSON Schema e Ajv.

### Passos para Implementação
1. **Instalar Ajv:**
   ```bash
   npm install --save-dev ajv ajv-formats
   ```

2. **Criar schemas JSON:**
   ```javascript
   // src/mocks/schemas/turma.schema.json
   {
     "$schema": "http://json-schema.org/draft-07/schema#",
     "type": "object",
     "required": ["id", "nome", "totalAlunos"],
     "properties": {
       "id": { "type": "string" },
       "nome": { "type": "string", "minLength": 1 },
       "totalAlunos": { "type": "integer", "minimum": 0 },
       "escola": { "type": "string" }
     }
   }
   ```

3. **Criar validador:**
   ```javascript
   // scripts/validate-mocks-schema.cjs
   const Ajv = require('ajv');
   const addFormats = require('ajv-formats');
   
   const ajv = new Ajv({ allErrors: true });
   addFormats(ajv);
   
   function validateMock(data, schema) {
     const validate = ajv.compile(schema);
     const valid = validate(data);
     
     if (!valid) {
       console.error('Schema validation failed:');
       console.error(validate.errors);
       return false;
     }
     return true;
   }
   ```

4. **Integrar com build:**
   ```json
   // package.json
   {
     "scripts": {
       "validate:mocks-schema": "node scripts/validate-mocks-schema.cjs"
     }
   }
   ```

5. **Adicionar regras de negócio:**
   ```javascript
   // Validar progress: 0
   const progressSchema = {
     type: "object",
     properties: {
       progress: { const: 0 }
     }
   };
   ```

## ✅ Critérios de Aceitação
- [ ] Ajv instalado e configurado
- [ ] Schemas JSON criados para todos os tipos de mock
- [ ] Script `npm run validate:mocks-schema` funciona
- [ ] Validação de regras de negócio (progress: 0, etc)
- [ ] Build falha se schema inválido
- [ ] Mensagens de erro claras e acionáveis
- [ ] Integrado em CI/CD e pre-commit
- [ ] Documentação de schemas

## 📎 Arquivos Afetados
- `package.json` (adicionar deps e script)
- `scripts/validate-mocks-schema.cjs` (criar)
- `src/mocks/schemas/` (criar - JSON schemas)
  - `turma.schema.json`
  - `missao.schema.json`
  - `aluno.schema.json`
  - `envio.schema.json`
- `src/mocks/*.ts` (manter - não alterar estrutura)
- `.husky/pre-commit` (adicionar validação)
- `docs/MOCKS_GUIDE.md` (criar - documentar schemas)

## 🏷️ Tags
`mocks` `validation` `schema` `json-schema` `ajv` `data-quality` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-006, linha 119)
- **Mocks:** `src/mocks/mission-batch.ts`, `src/mocks/missions.ts`
- **JSON Schema:** [Docs](https://json-schema.org/)
- **Ajv:** [Docs](https://ajv.js.org/)
- **Check Mocks Script:** `scripts/check-mocks.cjs` (integrar com schema validation)

## 📝 Notas Adicionais
**Schema Completo (Missão):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Missão",
  "type": "object",
  "required": ["id", "title", "description", "gameType", "progress"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[0-9]+$"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "description": {
      "type": "string",
      "maxLength": 500
    },
    "gameType": {
      "type": "string",
      "enum": ["quiz", "memory", "puzzle"]
    },
    "progress": {
      "const": 0,
      "description": "Deve ser 0 em build (regra de negócio)"
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard"]
    }
  }
}
```

**Validador com Report Detalhado:**
```javascript
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, verbose: true });

function validateMocks() {
  const results = {
    passed: [],
    failed: []
  };

  const turmaSchema = require('./schemas/turma.schema.json');
  const missaoSchema = require('./schemas/missao.schema.json');
  
  const { turmasMock } = require('../src/mocks/mission-batch');
  const { missoesMock } = require('../src/mocks/missions');

  // Validar turmas
  const validateTurma = ajv.compile(turmaSchema);
  turmasMock.forEach((turma, i) => {
    if (!validateTurma(turma)) {
      results.failed.push({
        type: 'Turma',
        index: i,
        errors: validateTurma.errors
      });
    } else {
      results.passed.push({ type: 'Turma', index: i });
    }
  });

  // Validar missões
  const validateMissao = ajv.compile(missaoSchema);
  missoesMock.forEach((missao, i) => {
    if (!validateMissao(missao)) {
      results.failed.push({
        type: 'Missão',
        index: i,
        errors: validateMissao.errors
      });
    } else {
      results.passed.push({ type: 'Missão', index: i });
    }
  });

  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.error('\n❌ SCHEMA VALIDATION FAILED\n');
    results.failed.forEach(f => {
      console.error(`${f.type} [${f.index}]:`);
      f.errors.forEach(err => {
        console.error(`  - ${err.instancePath}: ${err.message}`);
      });
    });
    process.exit(1);
  }
  
  console.log('\n✅ SCHEMA VALIDATION PASSED\n');
}

validateMocks();
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
