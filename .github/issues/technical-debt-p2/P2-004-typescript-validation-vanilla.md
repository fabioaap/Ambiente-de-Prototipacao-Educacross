# P2-004: Protótipos Sem Validação TypeScript

## 📋 Descrição
Arquivos vanilla JavaScript em `Front-office/` e `Back-office/` não têm validação TypeScript, aumentando risco de erros de tipos e dificultando manutenção.

## 🎯 Objetivo
Adicionar validação TypeScript para arquivos vanilla JS usando JSDoc comments e `tsconfig.json` para check sem necessidade de transpilação.

## 💡 Contexto
Vanilla JS é usado em Front/Back-office por simplicidade de deploy, mas pode ter validação de tipos via JSDoc. TypeScript pode validar JS files com `checkJs: true` e JSDoc annotations, sem necessidade de build step.

## 📊 Impacto
- **Severidade:** Medium
- **Bloqueio:** None
- **Esforço Estimado:** 0.5h
- **Prioridade:** P2

## 🔧 Solução Proposta
Configurar TypeScript para validar vanilla JS via JSDoc.

### Passos para Implementação
1. **Criar `tsconfig.vanilla.json`:**
   ```json
   {
     "compilerOptions": {
       "allowJs": true,
       "checkJs": true,
       "noEmit": true,
       "strict": true,
       "target": "ES2020",
       "module": "ESNext"
     },
     "include": [
       "Front-office/**/*.js",
       "Back-office/**/*.js"
     ]
   }
   ```

2. **Adicionar JSDoc em arquivos críticos:**
   ```javascript
   /**
    * @typedef {Object} Turma
    * @property {string} id
    * @property {string} nome
    * @property {number} totalAlunos
    */
   
   /**
    * @param {Turma[]} turmas
    * @returns {string}
    */
   function formatarTurmas(turmas) {
     return turmas.map(t => t.nome).join(', ');
   }
   ```

3. **Adicionar script de validação:**
   ```json
   // package.json
   {
     "scripts": {
       "check-types:vanilla": "tsc --project tsconfig.vanilla.json"
     }
   }
   ```

4. **Integrar em CI/CD e pre-commit**

## ✅ Critérios de Aceitação
- [ ] `tsconfig.vanilla.json` criado e configurado
- [ ] JSDoc adicionado em arquivos críticos (pelo menos 10 funções)
- [ ] `npm run check-types:vanilla` valida sem erros
- [ ] CI/CD executa validação automaticamente
- [ ] Pre-commit hook valida tipos
- [ ] Padrão JSDoc documentado

## 📎 Arquivos Afetados
- `tsconfig.vanilla.json` (criar)
- `Front-office/**/*.js` (adicionar JSDoc)
- `Back-office/**/*.js` (adicionar JSDoc)
- `package.json` (adicionar script)
- `.husky/pre-commit` (adicionar validação)
- `docs/VANILLA_JS_GUIDE.md` (criar - documentar padrões JSDoc)

## 🏷️ Tags
`typescript` `validation` `vanilla-js` `jsdoc` `type-safety` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-004, linha 113)
- **TypeScript JSDoc:** [Docs](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- **ADR-0007:** `docs/adr/ADR-0007-vanilla-js-for-frontoffice-backoffice.md`

## 📝 Notas Adicionais
**Exemplo de JSDoc Completo:**
```javascript
/**
 * Envia missão para turmas selecionadas
 * @param {Object} options - Opções de envio
 * @param {string} options.missaoId - ID da missão
 * @param {string[]} options.turmaIds - IDs das turmas
 * @param {Date} options.prazo - Prazo de entrega
 * @returns {Promise<{success: boolean, enviadoPara: number}>}
 * @throws {Error} Se missaoId inválido
 */
async function enviarMissaoEmLote({ missaoId, turmaIds, prazo }) {
  if (!missaoId) {
    throw new Error('missaoId obrigatório');
  }
  
  // Implementação...
  
  return {
    success: true,
    enviadoPara: turmaIds.length
  };
}
```

**Tipos Complexos:**
```javascript
/**
 * @typedef {Object} Aluno
 * @property {string} id
 * @property {string} nome
 * @property {string} email
 */

/**
 * @typedef {Object} Missao
 * @property {string} id
 * @property {string} titulo
 * @property {'pendente'|'em-andamento'|'concluida'} status
 * @property {Aluno[]} participantes
 */
```

**Validação de Eventos DOM:**
```javascript
/**
 * @param {MouseEvent} event
 */
function handleClick(event) {
  event.preventDefault();
  // TypeScript valida que event tem preventDefault()
}

document.getElementById('btn')?.addEventListener('click', handleClick);
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
