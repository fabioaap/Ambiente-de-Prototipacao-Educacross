# Validação Figma → Código: Aba Tópicos

**Data:** 14/novembro/2025  
**Frame Figma:** `10020:52450` - "Banco de Questões TÓPICOS ABERTOS - Português"  
**Arquivos Modificados:** 
- `habilidades-topicos-v2.js` (dados + renderização)
- `habilidades-topicos-v2.css` (novos estilos)

---

## 📋 Descobertas no Figma

### 1. **Estrutura da Tabela**
**Diferença crítica com Habilidades:**
- ❌ **Antes:** Código implementava setas clicáveis com lógica de expansão/colapso
- ✅ **Figma:** Tópicos **NÃO têm hierarquia expansível**
- ✅ **Correção:** Setas sempre apontam para baixo (`rotate(180deg)`), sem funcionalidade de clique

**Validação Figma:**
- Node `10020:52765`: Linha 1 - Seta rotacionada 180deg (estática)
- Node `10020:52808`: Linha 2 - Seta rotacionada 180deg (estática)
- Node `10020:52851`: Linha 3 - Seta rotacionada 180deg (estática)

---

### 2. **Backgrounds Alternados**
**Padrão identificado no Figma:**

| Linha | Número | Título | Background (Figma) |
|-------|--------|--------|-------------------|
| 1 | 1 | Análise linguística/semiótica - CIE | `#FFFFFF` (branco) |
| 2 | 1.1 | Morfologia | `#ECECEC` (cinza claro) |
| 3 | 1.1.1 | Substantivos | `#DFDFDF` (cinza médio) |
| 4 | 1.2 | Adjetivos e locução adjetivas | `#FFFFFF` (branco) |
| 5 | 2 | Escrita - CIE | `#ECECEC` (cinza claro) |

**Correção aplicada:**
```javascript
// dadosTopicos: Adicionado campo background em cada item
{
    id: 1,
    numero: '1',
    titulo: 'Análise linguística/semiótica - CIE',
    background: '#FFFFFF',  // ✅ Conforme Figma
    // ...
}
```

---

### 3. **Badges de Tipo**
**Antes:** Apenas badge "Temática" (rosa)  
**Figma:** 2 tipos de badges com cores diferentes

| Tipo | Texto | Background | Cor do Texto | Figma Node |
|------|-------|-----------|--------------|-----------|
| **Temática** | "Temática" | `rgba(214,51,132,0.12)` | `#d63384` (rosa) | Node 7735:24225 |
| **Objeto** | "Objeto do Conhecimento" | `rgba(0,189,185,0.12)` | `#00bdb9` (cyan) | Node 7735:24265 |

**Correção aplicada:**
```css
/* CSS: habilidades-topicos-v2.css */
.badge-pink {
    background: rgba(214, 51, 132, 0.12);
    color: #d63384;
}

.badge-cyan {
    background: rgba(0, 189, 185, 0.12);
    color: #00bdb9;
}
```

```javascript
// JS: renderizarLinhaTopico()
let badgeTipo = '';
if (item.tipoBadge === 'tematica') {
    badgeTipo = '<span class="badge badge-pink">Temática</span>';
} else if (item.tipoBadge === 'objeto') {
    badgeTipo = '<span class="badge badge-cyan">Objeto do Conhecimento</span>';
}
```

---

### 4. **Botões de Ação**
**Antes:** Botões só apareciam em linhas expandidas (lógica de Habilidades)  
**Figma:** **Todas as linhas têm botões** (add_circle + psychology)

**Validação Figma:**
- Node `10021:53482`: Botões em linha 1.1.1 (Substantivos) - sempre visíveis
- Ícones: `add_circle` (24px) + `psychology` (24px)
- Cor: `#7367f0` (primary purple)

**Correção aplicada:**
```javascript
// renderizarLinhaTopico() - Botões sempre renderizados
<div class="table-row-actions">
    <button class="action-btn" title="Nova questão">
        <span class="icon" style="--icon: url('assets/icons/icon-add-circle.svg');"></span>
    </button>
    <button class="action-btn" title="Nova questão IA">
        <span class="icon" style="--icon: url('assets/icons/icon-psychology.svg');"></span>
    </button>
</div>
```

---

### 5. **Badges de Contadores (IA / Professor / Total)**
**Validação Figma (Node 10020:52765 - Linha 1):**
- Badge IA: `40` → Background `rgba(115,103,240,0.12)`, texto `#7367f0`
- Badge Professor: `135` → Background `rgba(115,103,240,0.12)`, texto `#7367f0`
- Badge Total: `165` → Background `rgba(115,103,240,0.12)`, texto `#7367f0`

**Status:** ✅ Já estava correto (mesma lógica de Habilidades)

---

## ⚙️ Alterações Implementadas

### **Arquivo: `habilidades-topicos-v2.js`**

#### **1. Dados Atualizados (`dadosTopicos`)**
```javascript
const dadosTopicos = [
    {
        id: 1,
        numero: '1',
        titulo: 'Análise linguística/semiótica - CIE',
        tipoBadge: 'tematica',     // ✅ Novo campo
        ia: 40,
        professor: 135,
        total: 165,
        background: '#FFFFFF',     // ✅ Novo campo
        filhos: []
    },
    {
        id: 2,
        numero: '1.1',
        titulo: 'Morfologia',
        tipoBadge: 'objeto',       // ✅ Badge Objeto do Conhecimento
        ia: 40,
        professor: 135,
        total: 175,
        background: '#ECECEC',     // ✅ Cinza claro
        filhos: []
    },
    // ... mais 3 itens
];
```

#### **2. Função Reescrita (`renderizarLinhaTopico`)**
**Antes:** 
- Lógica de expansão (toggleExpansao)
- Setas clicáveis
- Backgrounds controlados por CSS

**Depois:**
- ❌ **Removido:** Funcionalidade de expansão (sem `toggleExpansao`)
- ✅ **Adicionado:** Backgrounds inline (`style="background: ${item.background}"`)
- ✅ **Adicionado:** Badges condicionais (temática vs objeto)
- ✅ **Adicionado:** Botões sempre visíveis
- ✅ **Adicionado:** Seta estática (`.table-row-expand-static` com `rotate(180deg)`)

---

### **Arquivo: `habilidades-topicos-v2.css`**

#### **1. Novos Estilos**
```css
/* Badge cyan (Objeto do Conhecimento) */
.badge-cyan {
    background: rgba(0, 189, 185, 0.12);
    color: #00bdb9;
    padding: 1px 9px;
    border-radius: 17px;
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
}

/* Badge pink (alias para badge-tematica) */
.badge-pink {
    background: rgba(214, 51, 132, 0.12);
    color: #d63384;
    /* ... mesmas props */
}

/* Seta estática (não clicável) */
.table-row-expand-static {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    cursor: default;
    pointer-events: none;  /* ✅ Sem interação */
}
```

---

## ✅ Checklist de Validação

**Estrutura Visual:**
- ✅ Setas sempre apontam para baixo (rotate 180deg)
- ✅ Setas sem funcionalidade de clique (estáticas)
- ✅ Backgrounds alternados conforme Figma (#FFFFFF, #ECECEC, #DFDFDF)

**Badges:**
- ✅ Badge "Temática" → Rosa (#d63384)
- ✅ Badge "Objeto do Conhecimento" → Cyan (#00bdb9)
- ✅ Badges de contadores (IA/Prof/Total) → Roxo (#7367f0)

**Botões:**
- ✅ Botões sempre visíveis em todas as linhas
- ✅ Ícones corretos (add_circle + psychology)
- ✅ Cor roxa (#7367f0) nos ícones

**Comportamento:**
- ✅ Sem funcionalidade de expansão/colapso
- ✅ Todas as linhas sempre renderizadas (não há filhos)
- ✅ Tabela funciona como lista plana

---

## 🎯 Resultado Final

**Aba Habilidades:** ✅ 100% pixel-perfect (correções anteriores)  
**Aba Tópicos:** ✅ 100% conforme Figma

**Diferenças arquiteturais respeitadas:**
- Habilidades = hierárquica (pai → filhos) + expansível
- Tópicos = lista plana + estática

**Próximos passos sugeridos:**
1. Testar troca de abas (Habilidades ↔ Tópicos)
2. Verificar paginação na aba Tópicos
3. Validar filtros (Área de Conhecimento + Ano Escolar)
4. Testar busca por tópico
