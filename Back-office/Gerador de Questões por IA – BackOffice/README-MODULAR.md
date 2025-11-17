# Habilidades e Tópicos (Banco de Questões) - Versão Modular

## 📁 Estrutura de Arquivos

```
Back-office/Gerador de Questões por IA – BackOffice/
├── habilidades-topicos.html         # HTML principal (modular)
├── habilidades-topicos.css          # Estilos específicos
├── habilidades-topicos.js           # Lógica da aplicação
├── banco-questoes-pixel-perfect.html # Versão monolítica original (preservada)
├── _arquivados/                     # Arquivos legados movidos para cá
│   ├── banco-questoes.html
│   ├── banco-questoes.css
│   └── banco-questoes.js
└── assets/
    ├── icons/                       # Ícones SVG
    ├── logo-icon-real.svg
    └── logo-text-real.svg
```

## ✨ Separação de Responsabilidades

### 🎨 `habilidades-topicos.css`
Estilos visuais da interface:
- Layout (sidebar, main, header)
- Componentes (tabs, badges, botões, tabelas)
- Estados (hover, active, disabled)
- Utilitários (indentação, profundidade, gaps)

### 🧠 `habilidades-topicos.js`
Lógica de aplicação:
- Dados fictícios (habilidades e tópicos)
- Estado da aplicação (paginação)
- Renderização dinâmica de tabelas
- Interações (expansão, alternância de abas)
- Event handlers

### 📄 `habilidades-topicos.html`
Estrutura semântica:
- Markup HTML puro
- Referências aos recursos externos
- Elementos vazios preenchidos via JS

## 🎯 Princípios Aplicados

### 1. **Separação de Conceitos (SoC)**
- HTML: estrutura e conteúdo
- CSS: apresentação visual
- JavaScript: comportamento e lógica

### 2. **Manutenibilidade**
- Código organizado por responsabilidade
- Fácil localização de bugs
- Edição isolada sem efeitos colaterais

### 3. **Reutilização**
- CSS pode ser compartilhado entre páginas
- JS pode ser modularizado em funções
- HTML mais limpo e legível

### 4. **Performance**
- CSS e JS podem ser cacheados pelo navegador
- Possibilidade de minificação separada
- Carregamento paralelo de recursos

## 🚀 Como Usar

### Desenvolvimento Local
```bash
# Opção 1: Python HTTP Server
python -m http.server 8080
# Abrir: http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/habilidades-topicos.html

# Opção 2: VS Code Live Server
# Instalar extensão "Live Server"
# Botão direito no habilidades-topicos.html > "Open with Live Server"
```

### Deploy em Produção
```bash
# Copiar os 3 arquivos juntos:
habilidades-topicos.html
habilidades-topicos.css
habilidades-topicos.js

# + pasta assets/ com ícones e logos
```

## 🔄 Migração do Monolito

### Antes (banco-questoes-pixel-perfect.html)
- 1600+ linhas em 1 arquivo
- `<style>` inline (640 linhas)
- `<script>` inline (430 linhas)
- Difícil de manter e debugar

### Depois (habilidades-topicos.html + .css + .js)
- **HTML**: ~300 linhas (estrutura pura)
- **CSS**: ~650 linhas (estilos organizados)
- **JS**: ~460 linhas (lógica isolada)
- Modular, testável, manutenível

## 📝 Convenções do Código

### Idioma: 100% pt-BR
```javascript
// ✅ Correto
const dadosHabilidades = [...]
function renderizarTopicos(pagina) {...}
let paginaAtualHabilidades = 1

// ❌ Errado
const skillsData = [...]
function renderTopics(page) {...}
let currentSkillsPage = 1
```

### Nomenclatura Semântica
```html
<!-- Atributos data-role para clareza -->
<div data-role="stats-bar">
<header data-role="header">
<div data-role="pagination">
```

### Comentários Organizacionais
```javascript
// =========================
// DADOS FICTÍCIOS
// =========================

// =========================
// FUNÇÕES DE RENDERIZAÇÃO
// =========================
```

## 🧪 Validação

### Testar Funcionalidades
- [x] Alternância entre abas (Habilidades / Tópicos)
- [x] Expansão/colapso de linhas hierárquicas
- [x] Paginação (anterior, próximo, números)
- [x] Renderização dinâmica de badges
- [x] Estados visuais (hover, active)

### Checklist de Integridade
```bash
# 1. Verificar se os 3 arquivos estão no mesmo diretório
ls habilidades-topicos.*

# 2. Verificar referências no HTML
grep -E "(href|src)=" habilidades-topicos.html

# 3. Validar sintaxe JavaScript
node --check habilidades-topicos.js

# 4. Validar CSS (opcional)
# npx stylelint habilidades-topicos.css
```

## 🔗 Dependências Externas

### Fontes Google
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
```

### Design Tokens (basis.css)
```html
<link rel="stylesheet" href="../../assets/styles/basis.css">
```
Variáveis CSS globais:
- `--primary`, `--primary-12`
- `--pink`, `--pink-12`, `--cyan`, `--cyan-12`
- `--surface`, `--bg`, `--divider`
- `--space-*`, `--radius-*`, `--z-*`

## 📚 Próximos Passos

### Melhorias Futuras
1. **Modularização JS Avançada**
   ```javascript
   // Separar em módulos ES6
   import { renderizarHabilidades } from './modules/habilidades.js'
   import { renderizarTopicos } from './modules/topicos.js'
   ```

2. **CSS Modular (BEM ou CSS Modules)**
   ```css
   /* Adotar metodologia BEM */
   .habilidades-topicos__header
   .habilidades-topicos__sidebar
   .habilidades-topicos__table-row--expandable
   ```

3. **Testes Automatizados**
   ```javascript
   // Vitest ou Jest
   describe('renderizarHabilidades', () => {
     it('deve renderizar 3 itens por página', () => {...})
   })
   ```

4. **Build Process**
   ```bash
   # Minificação, bundling, otimização
   npm run build:backoffice
   ```

## 🤝 Contribuindo

Ao editar este protótipo:
1. **Mantenha a separação HTML/CSS/JS**
2. **Use pt-BR em todo o código**
3. **Siga as convenções de nomenclatura**
4. **Teste no navegador antes de commitar**
5. **Documente mudanças significativas**

## 📄 Licença

Este é um protótipo interno da Educacross para validação de UX/UI antes da implementação em Vue.js.

---

**Data de Criação**: 2025-01-14  
**Versão Modular**: 1.1  
**Status**: ✅ Funcional e Validado  
**Última Atualização**: 2025-01-14 - Correção dos event listeners de acordeão
