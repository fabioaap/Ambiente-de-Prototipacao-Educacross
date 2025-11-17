# P2-003: Tokens DTCG Não Aplicados em Componentes

## 📋 Descrição
Tokens DTCG definidos em `packages/tokens/tokens.json` não estão sendo aplicados nos componentes. O pipeline `tokens → Style Dictionary → CSS vars → componentes` não está completo.

## 🎯 Objetivo
Implementar pipeline completo de design tokens, garantindo que tokens DTCG sejam automaticamente convertidos em CSS variables e aplicados nos componentes.

## 💡 Contexto
Design Tokens Community Group (DTCG) define padrão para tokens. O projeto tem tokens definidos, mas falta:
1. Build step com Style Dictionary
2. Geração de CSS variables
3. Import de CSS vars nos componentes
4. Validação de uso correto

## 📊 Impacto
- **Severidade:** High (design inconsistency)
- **Bloqueio:** None
- **Esforço Estimado:** 1.5h
- **Prioridade:** P2

## 🔧 Solução Proposta
Implementar pipeline completo de tokens.

### Passos para Implementação
1. **Instalar Style Dictionary:**
   ```bash
   cd packages/tokens
   npm install style-dictionary
   ```

2. **Criar config Style Dictionary:**
   ```javascript
   // packages/tokens/config.js
   module.exports = {
     source: ['tokens.json'],
     platforms: {
       css: {
         transformGroup: 'css',
         buildPath: 'dist/',
         files: [{
           destination: 'tokens.css',
           format: 'css/variables'
         }]
       }
     }
   };
   ```

3. **Adicionar build script:**
   ```json
   // packages/tokens/package.json
   {
     "scripts": {
       "build": "style-dictionary build"
     }
   }
   ```

4. **Importar CSS vars nos componentes:**
   ```typescript
   // src/index.css
   @import '../packages/tokens/dist/tokens.css';
   ```

5. **Refatorar componentes para usar CSS vars:**
   ```css
   /* Antes */
   .button { background: #7367ef; }
   
   /* Depois */
   .button { background: var(--color-primary); }
   ```

6. **Validação automatizada:**
   - Criar script que verifica uso de hardcoded colors
   - Integrar em pre-commit hook

## ✅ Critérios de Aceitação
- [ ] Style Dictionary instalado e configurado
- [ ] `npm run tokens:build` gera `tokens.css`
- [ ] CSS vars importadas em `src/index.css`
- [ ] Componentes usam `var(--token-name)` ao invés de valores hardcoded
- [ ] Zero hardcoded colors em componentes (validação automatizada)
- [ ] Build automático de tokens em CI/CD
- [ ] Documentação atualizada

## 📎 Arquivos Afetados
- `packages/tokens/package.json` (adicionar deps)
- `packages/tokens/config.js` (criar - Style Dictionary config)
- `packages/tokens/dist/tokens.css` (gerado automaticamente)
- `src/index.css` (importar tokens)
- `src/components/**/*.tsx` (refatorar para usar CSS vars)
- `scripts/validate-tokens-usage.cjs` (criar - validação)
- `docs/DESIGN_SYSTEM.md` (documentar pipeline)

## 🏷️ Tags
`design-system` `tokens` `dtcg` `style-dictionary` `css-variables` `p2` `technical-debt`

## 📚 Referências
- **Technical Debt:** `docs/TECHNICAL_DEBT.md` (P2-003, linha 110)
- **Tokens File:** `packages/tokens/tokens.json`
- **Style Dictionary Docs:** [https://amzn.github.io/style-dictionary/](https://amzn.github.io/style-dictionary/)
- **DTCG Spec:** [https://design-tokens.github.io/community-group/format/](https://design-tokens.github.io/community-group/format/)

## 📝 Notas Adicionais
**Exemplo tokens.json (DTCG format):**
```json
{
  "color": {
    "primary": {
      "$value": "#7367ef",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "success": {
      "$value": "#28c76f",
      "$type": "color"
    }
  },
  "spacing": {
    "sm": {
      "$value": "8px",
      "$type": "dimension"
    }
  }
}
```

**Output tokens.css:**
```css
:root {
  --color-primary: #7367ef;
  --color-success: #28c76f;
  --spacing-sm: 8px;
}
```

**Validação de uso (script):**
```javascript
// scripts/validate-tokens-usage.cjs
const hardcodedColors = /(?:#[0-9a-f]{3,6}|rgb\(|hsl\()/gi;

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(hardcodedColors);
  
  if (matches) {
    console.error(`❌ Hardcoded colors in ${filePath}:`);
    matches.forEach(m => console.error(`   ${m}`));
    return false;
  }
  return true;
}
```

---

**Criado por:** DevOps Agent  
**Data:** 17/11/2025  
**Categoria:** Technical Debt P2
