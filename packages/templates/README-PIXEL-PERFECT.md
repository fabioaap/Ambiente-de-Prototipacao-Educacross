# Templates Pixel-Perfect do Back-office Educacross

## 🎯 Fonte de Verdade: Figma

Todos os templates foram atualizados com as **medidas exatas extraídas do Figma** usando MCP Figma Dev Mode.

## 📏 Correções Aplicadas (Antes → Depois)

### 1. Sidebar (`backoffice-sidebar.html`)

**Node Figma:** `10021:53499` (menu-backoffice)

| Propriedade | ❌ Antes (Estimado) | ✅ Agora (Pixel-Perfect) |
|-------------|---------------------|--------------------------|
| **Largura** | 180px | **265px** |
| **Background** | linear-gradient(180deg, #2f3349 0%, #343752 100%) | **#283046** (sólido) |
| **Padding** | 24px 0 | **40px 16px** |
| **Gap entre itens** | Não especificado | **10px** |
| **Font size** | 13px | **15px** |
| **Line height** | Não especificado | **24px** |
| **Padding item** | 12px 16px | **12px 16px** ✅ (correto) |
| **Item ativo** | #7367f0 | #7367f0 ✅ (correto) |
| **Border radius item** | Não especificado | **4px** |
| **Submenu padding-left** | 40px | **48px** |

**Fonte Typography:**
- **Font-family:** Montserrat
- **Font-weight:** 600 (SemiBold)
- **Font-size:** 15px
- **Line-height:** 24px

---

### 2. Header (`backoffice-header.html`)

**Node Figma:** `10021:53487` (global-header)

| Propriedade | ❌ Antes (Estimado) | ✅ Agora (Pixel-Perfect) |
|-------------|---------------------|--------------------------|
| **Border** | 1px solid #ebe9f1 | **1px solid #e2e2e3** |
| **Border-radius** | 10px | 10px ✅ (correto) |
| **Padding** | 16px 20px | **16px** (uniforme) |
| **Avatar size** | 42px | 42px ✅ (correto) |
| **Avatar bg** | #7367f0 | #7367f0 ✅ (correto) |
| **Avatar radius** | 50% | **100px** (Figma usa px) |
| **User name color** | #6e6b7b | #6e6b7b ✅ (correto) |
| **User name font** | 14px, weight 500 | **14px, weight 500, letter-spacing 0.4px** |
| **Gap** | 12px | 12px ✅ (correto) |

**Fonte Typography:**
- **Font-family:** Montserrat
- **Font-weight:** 500 (Medium)
- **Font-size:** 14px
- **Letter-spacing:** 0.4px

---

### 3. Breadcrumb (`backoffice-breadcrumb.html`)

**Node Figma:** `10021:53498` (Frame 27)

| Propriedade | ❌ Antes (Estimado) | ✅ Agora (Pixel-Perfect) |
|-------------|---------------------|--------------------------|
| **Gap** | 8px | 8px ✅ (correto) |
| **Icon size** | 14px | 14px ✅ (correto) |
| **Icon home color** | #7367f0 | #7367f0 ✅ (correto) |
| **Icon chevron color** | #7367f0 | **#6e6b7b** (diferente!) |
| **Link color** | #6e6b7b | #6e6b7b ✅ (correto) |
| **Current page color** | #5e5873 | #5e5873 ✅ (correto) |
| **Current page weight** | 500 | **400** (Regular no Figma) |
| **Line height** | Não especificado | **24px** |

**Fonte Typography:**
- **Font-family:** Montserrat
- **Font-weight:** 400 (Regular)
- **Font-size:** 14px
- **Line-height:** 24px

---

## 🎨 Design System Extraído do Figma

### Cores (1) Theme Color

```css
/* Cores principais */
--primary: #7367f0;
--heading-text: #5e5873;
--body-text: #6e6b7b;
--border-light: #e2e2e3;
--sidebar-bg: #283046;
--white: #ffffff;

/* Transparências */
--transparent-light: rgba(186, 191, 199, 0.12);
```

### Typography

```css
/* Montserrat Regular */
font-family: 'Montserrat', sans-serif;
font-weight: 400;
font-size: 14px;
line-height: 24px;

/* Montserrat Medium */
font-family: 'Montserrat', sans-serif;
font-weight: 500;
font-size: 14px;
letter-spacing: 0.4px;

/* Montserrat SemiBold (Heading H5) */
font-family: 'Montserrat', sans-serif;
font-weight: 600;
font-size: 15px;
line-height: 24px;
```

---

## 🚨 Principais Aprendizados

### ❌ Erros Comuns Sem Figma MCP

1. **Sidebar muito estreita** (180px vs 265px real) → Layout quebrado
2. **Gradiente desnecessário** (Figma usa cor sólida #283046)
3. **Border-color incorreto** (#ebe9f1 vs #e2e2e3 real)
4. **Icon chevron color errado** (#7367f0 vs #6e6b7b real)
5. **Padding inconsistente** (não uniforme vs 16px real)
6. **Submenu padding-left** (40px vs 48px real) → Desalinhamento visual

### ✅ Benefícios do Figma MCP

- ✅ **Medidas exatas** extraídas do Figma Dev Mode
- ✅ **Cores precisas** (hex codes exatos)
- ✅ **Typography consistente** (font-family, weight, size, line-height)
- ✅ **Spacing system** (gaps, padding, borders)
- ✅ **Elimina adivinhação** → Implementação 100% fiel ao design

---

## 📂 Como Usar os Templates

### 1. Copiar Template Completo

```html
<!-- Incluir Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Copiar CSS + HTML do template -->
<style>
    /* Copiar todo o bloco <style> do template */
</style>

<!-- Copiar HTML -->
<nav class="sidebar">
    <!-- ... -->
</nav>
```

### 2. Ajustar Content Offset

Com sidebar de **265px**, ajustar o `margin-left` do conteúdo principal:

```css
.main-content {
    margin-left: 265px; /* Largura exata da sidebar */
    padding: 24px;
}
```

### 3. Validar Pixel-Perfect

1. Abrir página no navegador
2. Abrir DevTools (F12)
3. Verificar larguras/cores com Inspector
4. Comparar com Figma side-by-side

---

## 🔗 Nodes Figma de Referência

| Componente | Node ID | Nome no Figma |
|------------|---------|---------------|
| Sidebar | `10021:53499` | menu-backoffice |
| Header | `10021:53487` | global-header |
| Breadcrumb | `10021:53498` | Frame 27 |
| Página Completa | `10021:53486` | Banco de Questões - Habilidades |

---

## 📝 Changelog

### 13/11/2025 - Atualização Pixel-Perfect

- ✅ Extraídos dados reais do Figma via MCP
- ✅ Sidebar: 180px → **265px**
- ✅ Sidebar bg: gradiente → **#283046 sólido**
- ✅ Header border: #ebe9f1 → **#e2e2e3**
- ✅ Breadcrumb chevron: #7367f0 → **#6e6b7b**
- ✅ Typography: adicionado line-height **24px** em todos
- ✅ Submenu padding-left: 40px → **48px**

---

## 🎯 Próximos Passos

1. ✅ Atualizar `banco-questoes-pixel-perfect.html` com novos templates
2. ⬜ Extrair medidas de botões, badges, forms do Figma
3. ⬜ Criar template de tabela com medidas exatas
4. ⬜ Documentar todos os nodes Figma relevantes
5. ⬜ Criar checklist de validação pixel-perfect

---

**Mantido por:** AI Agent usando MCP Figma  
**Última atualização:** 13/11/2025  
**Status:** ✅ Pixel-Perfect Validated
