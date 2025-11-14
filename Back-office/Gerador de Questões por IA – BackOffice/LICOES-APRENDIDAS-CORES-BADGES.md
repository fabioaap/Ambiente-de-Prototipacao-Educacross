# Lições Aprendidas: Cores de Badges - Pixel-Perfect Figma

**Data:** 14 de novembro de 2025  
**Arquivo:** banco-questoes-pixel-perfect.html  
**Contexto:** Implementação pixel-perfect do design Figma para Banco de Questões

## ❌ Erro Cometido

### Premissa Incorreta
Ao verificar inicialmente os badges no topo da página (stats bar - linhas 633-646), **assumi erroneamente** que todos os badges do design usavam a mesma cor primária roxa (`#7367f0`).

### Ação Equivocada
Com base nessa premissa incorreta, **removi as classes CSS** `.badge.pink` e `.badge.warning`, acreditando que eram cores que não existiam no design do Figma.

### Consequência
Após remover as classes, **o HTML ficou com badges usando classes inexistentes** (`<span class="badge pink">` e `<span class="badge warning">`), fazendo com que esses elementos perdessem sua estilização específica.

## ✅ Correção Aplicada

### Validação Completa do Design
Ao receber feedback do usuário sobre cores incorretas, **extraí TODOS os contextos de badges** do Figma, não apenas a área inicial:

1. **Badge Primário (Stats Bar)** - Node 10021:53805, 10106:62470, 10064:60217
   - Background: `rgba(115,103,240,0.12)` (Transparent Color / Primary)
   - Cor texto: `#7367f0` (Theme Color / Primary)
   - Uso: Contadores de questões (quiz, psychology, emoji_objects)

2. **Badge Rosa (Temática)** - Node 10021:53804
   - Background: `rgba(214,51,132,0.12)` (Transparent Color / Pink)
   - Cor texto: `#d63384`
   - Uso: Label "Temática" nas linhas da tabela

3. **Badge Warning (Alerta)** - Node 10021:54066
   - Background: `rgba(255,159,67,0.12)` (Transparent Color / Warning)
   - Cor texto: `#ff9f43` (Theme Color / Warning)
   - Uso: Badge "0 questões" (indicador de dados faltantes)

### Estrutura CSS Correta
```css
.badge {
    background: rgba(115, 103, 240, 0.12);
    color: #7367f0;
    /* Estilo base: Primary */
}

.badge.pink {
    background: rgba(214, 51, 132, 0.12);
    color: #d63384;
    /* Modificador: Pink - Badges "Temática" */
}

.badge.warning {
    background: rgba(255, 159, 67, 0.12);
    color: #ff9f43;
    /* Modificador: Warning - Badges "0 questões" */
}
```

## 📚 Lições para Não Repetir

### 1. **Validar TODO o Design, Não Apenas Partes**
❌ **Errado:** Extrair apenas a área visível inicialmente (stats bar)  
✅ **Correto:** Extrair TODOS os contextos de badges no design completo

**Comando para validação completa:**
```javascript
// Extrair TODOS os badges do frame principal
mcp_figma_get_design_context(nodeId: "10021:53486") // Frame completo
// Identificar todos os sublayers com badges antes de concluir
```

### 2. **Não Assumir Padrões Sem Validação**
❌ **Errado:** "Vi 3 badges roxos, logo todos são roxos"  
✅ **Correto:** "Vi 3 badges roxos no topo, preciso verificar toda a tabela"

### 3. **Grep Search para Identificar Todas as Ocorrências**
Antes de remover classes CSS, **sempre validar** quantas vezes a classe é usada no HTML:

```bash
grep_search: "class=\"badge pink" → 4 ocorrências (linhas 696, 838, 861, 884)
grep_search: "class=\"badge warning" → 1 ocorrência (linha 885)
```

**Se a classe existe no HTML, ela DEVE existir no CSS.**

### 4. **Extrair Node IDs Específicos para Cada Variante**
Quando houver múltiplas cores de um mesmo componente:
- Badge roxo → Node 10021:53805
- Badge rosa → Node 10021:53804  
- Badge warning → Node 10021:54066

**Extrair contexto de CADA node** para confirmar tokens de cor.

### 5. **Documentar Tokens do Figma nos Comentários CSS**
Sempre adicionar comentários referenciando os tokens do Figma:

```css
.badge.pink {
    background: rgba(214, 51, 132, 0.12);
    /* Figma token: Transparent Color / Pink */
    color: #d63384;
    /* Usado em badges "Temática" - Node 10021:53804 */
}
```

Isso facilita validação futura e rastreamento de mudanças no design.

## 🔍 Checklist de Validação Pixel-Perfect

Antes de concluir implementação de cores:

- [ ] ✅ Extrair design context do frame COMPLETO (não apenas viewport inicial)
- [ ] ✅ Identificar TODAS as variantes de cores do componente
- [ ] ✅ Fazer grep_search de todas as classes no HTML
- [ ] ✅ Validar que cada classe no HTML tem CSS correspondente
- [ ] ✅ Extrair node ID de CADA variante de cor
- [ ] ✅ Documentar tokens do Figma nos comentários CSS
- [ ] ✅ Testar visualmente TODAS as seções da página (não apenas o topo)
- [ ] ✅ Rodar universal_validator.py após correções

## 📊 Impacto do Erro

**Badges afetados:**
- 4 badges "Temática" (rosa) → perderam cor rosa, ficaram roxos
- 1 badge "0 questões" (warning) → perdeu cor laranja, ficou roxo

**Tempo de correção:** ~15 minutos  
**Lição aprendida:** Validação completa é mais rápida que correção de premissas erradas

## 🎯 Ação Preventiva

**Para futuros trabalhos pixel-perfect:**
1. Sempre extrair frame completo primeiro: `mcp_figma_get_design_context(mainFrameId)`
2. Identificar estrutura hierárquica (Container > Sublayers > Variants)
3. Listar TODOS os node IDs de variantes antes de implementar CSS
4. Criar tabela de mapeamento: Variante → Node ID → Tokens → CSS Class
5. Implementar CSS com comentários de rastreabilidade
6. Validar com grep_search que HTML e CSS estão sincronizados

---

**Conclusão:** A pressa em "corrigir" cores baseado em validação parcial causou regressão. **Validação completa sempre**, mesmo que demore mais 5 minutos. É mais rápido que corrigir bugs introduzidos por premissas erradas.
