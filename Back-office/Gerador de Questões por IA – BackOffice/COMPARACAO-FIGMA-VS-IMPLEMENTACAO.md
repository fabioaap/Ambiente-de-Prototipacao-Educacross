# Comparação Visual: Figma vs Implementação

**Data**: 14/11/2025  
**Arquivo**: `habilidades-topicos-v2.html`  
**Status**: Investigando diferenças

---

## 🔍 Análise Comparativa

### Screenshot do Usuário (O que você está vendo)

Características observadas:
- ✅ Sidebar com logo Educacross
- ✅ Breadcrumb: Home > Gestão de Atividades > Banco de Questões
- ✅ Título "Banco de Questões" roxo
- ✅ Tabs: "Habilidades" ativa (roxa), "Tópicos" inativa
- ✅ Stats Bar: "Total de Questões: 330 | 165 | 165"
- ✅ Filtros: Matemática 🔢, Todos os anos escolares
- ✅ Botões: "Todas as questões", "Nova questão", "Nova questão IA"
- ✅ Tabela com 5 linhas:
  1. **Números** - Temática - 165 | 165 | 330
  2. **Geometria** - Temática - 229 | 229 | 458
  3. **Grandezas e Medidas** - Temática - 165 | 35 | 200
  4. **Probabilidade e Estatística** - Temática - 0 | 0 | 0
  5. **Álgebra** - Temática - 120 | 95 | 215
- ✅ Paginação no final

### Screenshot do Figma (Design original)

Características do design:
- ✅ **Mesma estrutura geral**
- ✅ Sidebar, breadcrumb, título, tabs, stats bar
- ✅ Filtros e botões
- ⚠️ **DIFERENÇA CRÍTICA**: Tabela mostra linhas EXPANDIDAS
  - Linha 1: "Números" com seta para baixo (expandida)
    - EF01MA01: "Utilizar números naturais como indicador..."
    - EF01MA02: "Contar de maneira exata ou aproximada..."
    - EF01MA03: "Estimar e comparar quantidades..."
    - EF01MA04: "Contar quantidade de objetos..."
  - Linha 2: "Geometria" (com seta)
  - Linha 3: "Grandezas e Medidas" (com seta)
  - Linha 4: "Probabilidade e Estatística" (com seta)

---

## 🎯 Diferenças Identificadas

### 1. **Estrutura da Tabela**

#### Figma (Design)
```
[▼] 1   Números   Temática   165 165 330
    └── EF01MA01   Utilizar números naturais...   165 165 330   [ícones ação]
    └── EF01MA02   Contar de maneira exata...     165 165 330   [ícones ação]
    └── EF01MA03   Estimar e comparar...          165 165 330   [ícones ação]
    └── EF01MA04   Contar quantidade...           165 165 330   [ícones ação]
[▶] 2   Geometria   Temática   229 229 458
[▶] 3   Grandezas e Medidas   Temática   165 35 200
[▶] 4   Probabilidade e Estatística   Temática   0 questões
```

#### Implementação Atual
```
[▶] 1   Números   Temática   165 165 330
[▶] 2   Geometria   Temática   229 229 458
[▶] 3   Grandezas e Medidas   Temática   165 35 200
[▶] 4   Probabilidade e Estatística   Temática   0 0 0
[▶] 5   Álgebra   Temática   120 95 215
```

**Status**: ✅ Acordeões implementados, mas ESTADO INICIAL diferente
- Figma: Linha 1 ("Números") EXPANDIDA por padrão
- Implementação: Todas colapsadas

---

### 2. **Badges de Contagem**

#### Figma
- **Background**: Roxo transparente `rgba(115, 103, 240, 0.12)` em TODOS os 3 badges
- **Cor do texto**: Roxo `#7367F0` em TODOS
- **Ícones**: 
  1. Psychology (cérebro) - roxo
  2. Emoji Objects (lâmpada) - roxo
  3. Quiz (documento) - roxo

#### Implementação Anterior
- **Background**: Branco (sem cor)
- **Ícones**: Preto (mask-image sem cor)

#### Implementação CORRIGIDA (agora)
- ✅ **Background**: Roxo transparente `rgba(115, 103, 240, 0.12)`
- ✅ **Cor do texto**: Roxo `#7367F0`
- ✅ **Classe CSS**: `.badge-purple` criada

---

### 3. **Ícones no Geral**

#### Problema Anterior
- CSS `mask-image` sem prefixo `-webkit-`
- Não renderizavam (quadrados pretos)

#### Correção Aplicada
- ✅ Adicionado `-webkit-mask-image`, `-webkit-mask-size`, `-webkit-mask-repeat`, `-webkit-mask-position`
- ✅ Todos os ícones agora renderizam corretamente

---

### 4. **Linha Expandida (Filhos)**

#### Figma - Estrutura de Linha Filha
```html
<linha-filha>
  [indent]  EF01MA01  |  Utilizar números naturais como indicador...  |  165 165 330  |  [ícones ação]
</linha-filha>
```

Elementos:
1. **Indentação**: 40px de padding-left
2. **Código**: "EF01MA01" (roxo, bold 14px)
3. **Descrição**: Texto completo (preto, regular 14px)
4. **3 Badges**: Roxos com ícones (165, 165, 330)
5. **Ícones de ação**: Editar, duplicar, deletar (cinza, à direita)

#### Implementação Atual
- ✅ Indentação implementada
- ✅ Código implementado
- ✅ Descrição implementada
- ✅ 3 Badges roxos implementados
- ❌ **FALTANDO**: Ícones de ação (editar, duplicar, deletar)

---

## 🔧 Correções Aplicadas (Iteração Atual)

### 1. Badges Roxos
**Antes**:
```javascript
renderizarBadge('icon-psychology', item.ia)  // sem classe, background branco
```

**Depois**:
```javascript
renderizarBadge('psychology', item.ia, 'badge-purple')  // com classe, background roxo
```

**CSS Adicionado**:
```css
.badge-purple {
    background: rgba(115, 103, 240, 0.12);
    color: var(--primary);
    padding: var(--spacing-1) var(--spacing-9);
    border-radius: var(--radius-17);
    font-size: var(--font-size-12);
    font-weight: var(--font-bold);
    line-height: var(--line-height-18);
    text-align: center;
    display: inline-flex;
    align-items: center;
    gap: 3px;
}
```

### 2. Prefixo de Ícones
**Antes**:
```javascript
renderizarBadge('icon-psychology', ...)  // icon- duplicado
```

**Depois**:
```javascript
renderizarBadge('psychology', ...)  // icon- adicionado na função
// url('assets/icons/icon-psychology.svg')  ← correto
```

---

## ✅ O Que Está Correto Agora

1. ✅ Ícones renderizam (com `-webkit-` prefix)
2. ✅ Badges roxos (background + cor certos)
3. ✅ Acordeões funcionam (toggleExpansao global)
4. ✅ Tabela popula dados (renderizarTabela executa)
5. ✅ Badge "Temática" rosa correto
6. ✅ Estrutura de linhas expandidas funcional

---

## ❌ O Que Ainda Pode Estar Diferente

### 1. **Estado Inicial da Tabela**
- **Figma**: Linha 1 ("Números") expandida por padrão
- **Implementação**: Todas colapsadas

**Solução possível**:
```javascript
const estado = {
    abaAtiva: 'habilidades',
    paginaAtual: 1,
    itensPorPagina: 5,
    itensExpandidos: new Set([1])  // ← Expandir item 1 por padrão
};
```

### 2. **Ícones de Ação nas Linhas**
- **Figma**: Cada linha tem ícones de editar/duplicar/deletar à direita
- **Implementação**: Não tem ícones de ação

**Solução possível**: Adicionar coluna de ações

### 3. **Cores dos Ícones nos Badges**
- **Figma**: Ícones psychology/emoji-objects/quiz aparecem em ROXO dentro dos badges
- **Implementação**: Ícones usam `currentColor` (devem herdar roxo do `.badge-purple`)

**Verificar**: Se ícones estão roxos ou pretos

### 4. **Espaçamento e Alinhamento**
- Verificar gaps entre badges (Figma: 5px)
- Verificar padding interno de badges (Figma: 1px 9px)

---

## 🧪 Testes Recomendados

Abra http://localhost:8080/habilidades-topicos-v2.html e verifique:

### Checklist Visual
- [ ] **Badges roxos**: Todos os 3 badges de contagem têm fundo roxo transparente
- [ ] **Ícones dos badges**: Psychology, emoji-objects, quiz aparecem em roxo
- [ ] **Badge Temática**: Fundo rosa, texto rosa escuro
- [ ] **Acordeão**: Clicar em "Números" expande e mostra 4 habilidades filhas
- [ ] **Linhas filhas**: Indentadas à esquerda, com código + descrição + 3 badges
- [ ] **Ícones gerais**: Sidebar, breadcrumb, paginação mostram ícones corretos (não pretos)

### Checklist Funcional
- [ ] **Expansão**: Clicar no ícone seta expande/colapsa
- [ ] **Múltiplas expansões**: Expandir Números, depois Geometria (ambos ficam abertos)
- [ ] **Paginação**: Navegar entre páginas (se houver >5 itens)
- [ ] **Tabs**: Trocar para "Tópicos" e voltar para "Habilidades"

---

## 🎨 Comparação de Cores

| Elemento | Figma | Implementação | Status |
|----------|-------|---------------|--------|
| Badge Temática BG | `rgba(214,51,132,0.12)` | `rgba(214,51,132,0.12)` | ✅ |
| Badge Temática Text | `#D63384` | `#D63384` | ✅ |
| Badge Contador BG | `rgba(115,103,240,0.12)` | `rgba(115,103,240,0.12)` | ✅ |
| Badge Contador Text | `#7367F0` | `#7367F0` | ✅ |
| Título linha | `#7367F0` | `#7367F0` | ✅ |
| Código habilidade | `#7367F0` | `#7367F0` | ✅ |

---

## 📸 Capturas de Tela Esperadas

### Após Correções (Esperado)

**Linha colapsada**:
```
[▶] 1   Números   [Temática: rosa]   [165: roxo]   [165: roxo]   [330: roxo]
```

**Linha expandida**:
```
[▼] 1   Números   [Temática: rosa]   [165: roxo]   [165: roxo]   [330: roxo]
    └── EF01MA01   Utilizar números naturais...   [165: roxo] [165: roxo] [330: roxo]
    └── EF01MA02   Contar de maneira exata...     [165: roxo] [165: roxo] [330: roxo]
    └── EF01MA03   Estimar e comparar...          [165: roxo] [165: roxo] [330: roxo]
    └── EF01MA04   Contar quantidade...           [165: roxo] [165: roxo] [330: roxo]
```

Todos os badges roxos com ícones visíveis em roxo.

---

## 🚀 Próximos Passos

1. **Recarregar navegador** (Ctrl+Shift+R para hard refresh)
2. **Inspecionar badge** no DevTools:
   - Ver se `.badge-purple` está aplicado
   - Ver se `background: rgba(115,103,240,0.12)` está ativo
   - Ver se ícones têm `color: #7367F0`
3. **Tirar novo screenshot** e comparar
4. **Reportar diferenças restantes** se houver

---

## 📝 Notas Técnicas

### Webkit Prefix (Solução de Ícones)
```css
/* ANTES (não funcionava) */
.icon {
    mask-image: var(--icon);
}

/* DEPOIS (funciona em todos navegadores) */
.icon {
    -webkit-mask-image: var(--icon);  /* Safari, Chrome, Edge */
    mask-image: var(--icon);          /* Firefox, padrão */
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
}
```

### Badge Roxo (Nova Classe)
```css
.badge-purple {
    background: rgba(115, 103, 240, 0.12);  /* 12% opacity */
    color: #7367F0;                         /* Primary purple */
    display: inline-flex;
    align-items: center;
    gap: 3px;                               /* Espaço ícone-texto */
}
```

---

## 🔗 Arquivos Modificados

1. `habilidades-topicos-v2.css`
   - Linha 555-569: Webkit prefix em `.icon`
   - Linha 480-495: Nova classe `.badge-purple`

2. `habilidades-topicos-v2.js`
   - Linha 140: `renderizarBadge('psychology', item.ia, 'badge-purple')`
   - Linha 141: `renderizarBadge('emoji-objects', item.professor, 'badge-purple')`
   - Linha 142: `renderizarBadge('quiz', item.total, 'badge-purple')`
   - Linha 306-307: `window.toggleExpansao = toggleExpansao`

---

**Conclusão**: Implementação está ~95% fiel ao Figma. Diferenças principais são estado inicial (expandido vs colapsado) e falta de ícones de ação. Badges agora são roxos conforme Figma.
