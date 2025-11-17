# 📐 Tokens do Componente de Acordeão - Aba Tópicos

**Data:** 15/11/2025  
**Arquivo:** `habilidades-topicos-v2.js` → função `renderizarLinhaTopico()`

---

## ⚠️ **REGRAS CRÍTICAS**

**1. A aba Tópicos usa O MESMO COMPONENTE da aba Habilidades!**

- ✅ Estrutura hierárquica com `filhos: []`
- ✅ Estado `itensExpandidos` compartilhado
- ✅ Função `toggleExpansao()` compartilhada
- ✅ CSS `.table-row-expand` com `.expanded` (rotação automática)
- ✅ Comportamento de acordeão idêntico

**2. TODAS as linhas devem ter setinha (validado no Figma):**

- ✅ Linhas COM filhos: setinha clicável (com `onclick`)
- ✅ Linhas SEM filhos: setinha decorativa (sem `onclick`, sem cursor pointer)
- ✅ Rotação via CSS: `.expanded` → `rotate(180deg)` (▼ → ▲)

---

## 🎯 **Princípios Fundamentais**

### **1. Setas: Estado de Expansão (Classe CSS)**
- ✅ **FECHADA (padrão):** `.table-row-expand` → seta para BAIXO ▼
- ✅ **ABERTA:** `.table-row-expand.expanded` → seta para CIMA ▲ (rotate 180deg via CSS)
- 🎨 **Ícone base:** `keyboard_arrow_down` (▼ apontando para baixo)
- 🎨 **Rotação:** Controlada por CSS, NÃO por JavaScript inline

### **2. Botões de Ação**
- ✅ Aparecem apenas em linhas **SEM filhos** (níveis finais/folhas)
- ✅ **Condição:** `!temFilhos` (NÃO tem filhos)
- ✅ **Gap entre botões:** `8px`
- ✅ **Alinhamento:** Dentro de `.table-row-actions` (flex end)
- ✅ **Exemplos:** Linha 1.1.1 (Substantivos) tem botões, Linha 1 e 1.1 NÃO têm

### **3. Container de Número**
- ✅ **Width fixa:** `83px` (todos os níveis)
- ✅ **Padding-left:** Varia por hierarquia (0px, 40px, 80px)

---

## 📊 **Estrutura de Dados**

### **Formato Hierárquico:**
```javascript
{
    id: 1,
    numero: '1',
    titulo: 'Análise linguística/semiótica - CIE',
    tipoBadge: 'tematica', // 'tematica' | 'objeto' | null
    ia: 40,
    professor: 135,
    total: 165,
    filhos: [
        {
            id: 2,
            numero: '1.1',
            titulo: 'Morfologia',
            tipoBadge: 'objeto',
            filhos: [...]
        }
    ]
}
```

### **Badges de Tipo:**
- `'tematica'` → Badge rosa (`badge-pink`)
- `'objeto'` → Badge cyan (`badge-cyan`)
- `null` → Sem badge de tipo

### **Padding por Nível:**
- Nível 0: `padding-left: 20px`
- Nível 1: `padding-left: 60px` (20 + 40)
- Nível 2: `padding-left: 100px` (20 + 40 + 40)

---

## 🔒 **Regras Não-Negociáveis**

1. **USAR O MESMO COMPONENTE da aba Habilidades** — não reimplementar!
2. **TODAS as linhas devem ter setinha** — validado no Figma (clicável se tem filhos, decorativa se não tem)
3. **Estrutura hierárquica** com `filhos: []`
4. **Seta controlada por CSS** — classe `.expanded` aplica `rotate(180deg)`
5. **Botões aparecem APENAS em linhas SEM filhos** — `!temFilhos` (folhas/níveis finais)
6. **Padding dinâmico:** `nivel * 40 + 20`
7. **Função compartilhada:** `toggleExpansao()` e `estado.itensExpandidos`
8. **Badges específicos:** `badge-pink` (Temática), `badge-cyan` (Objeto do Conhecimento)

---

## 🎨 **Espaçamentos e Alinhamentos**

### **Row (linha completa):**
```css
display: flex;
gap: 20px;
align-items: center;
padding: 10px 20px;
```

### **Container número:**
```css
width: 83px;
display: flex;
gap: 10px;
align-items: center;
padding-left: [0px | 40px | 80px]; /* Depende do nível */
flex-shrink: 0;
```

### **Container badges:**
```css
flex: 1;
display: flex;
gap: 10px; /* Exceto linha 1 que usa 5px */
align-items: center;
```

### **Container botões:**
```css
display: flex;
gap: 8px; /* ⚠️ NÃO ALTERAR */
align-items: center;
margin-left: auto; /* Empurra para direita */
flex-shrink: 0;
```

---

## ✅ **Checklist de Validação**

Antes de finalizar qualquer alteração na aba Tópicos:

- [ ] Setas FECHADAS (rotate -90deg) apontando para DIREITA ▶ em linhas 1 e 1.1?
- [ ] Setas ABERTAS (rotate 0deg) apontando para BAIXO ▼ em linhas 1.1.1, 1.2, 2?
- [ ] Ícone base é `keyboard_arrow_down` (aponta para baixo naturalmente)?
- [ ] Botões APENAS em linha 1.1.1?
- [ ] Gap de 8px entre botões?
- [ ] Botões alinhados à DIREITA (`margin-left: auto`)?
- [ ] Container número com width de 83px?
- [ ] Padding-left correto (0/40/80px)?
- [ ] Gap de 20px entre elementos principais?
- [ ] Backgrounds alternando (#FFFFFF, #ECECEC, #DFDFDF)?

---

## 🚨 **Erros Comuns (NÃO REPETIR)**

1. ❌ **Colocar botões em todas as linhas** → Apenas 1.1.1!
2. ❌ **Gap de 10px entre botões** → Correto é 8px!
3. ❌ **Usar rotate(180deg) para setas fechadas** → Correto é `-90deg` (aponta para DIREITA ▶)!
4. ❌ **Setas todas apontando para baixo** → Linhas principais (1, 1.1) devem apontar para DIREITA ▶!
5. ❌ **Botões à esquerda** → Devem estar à direita (`margin-left: auto`)!
6. ❌ **Padding-left variável no container número** → Width fixa de 83px + padding-left dinâmico!

---

## 📚 **Referências**

- **Figma Node 10020:52765:** Linha 1 (Análise linguística)
- **Figma Node 10020:52808:** Linha 1.1 (Morfologia)
- **Figma Node 10020:52851:** Linha 1.1.1 (Substantivos) - COM BOTÕES
- **Figma Node 10021:53482:** Container de botões com gap 8px

---

**Última atualização:** 15/11/2025  
**Validado por:** MCP Figma + Screenshot visual  
**Status:** ✅ PIXEL-PERFECT
