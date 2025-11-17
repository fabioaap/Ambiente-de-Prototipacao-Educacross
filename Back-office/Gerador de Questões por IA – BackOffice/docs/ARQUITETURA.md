# 🏗️ Arquitetura - Back-office Banco de Questões

## Visão Geral

Sistema modular para gerenciamento de questões educacionais, organizado em páginas independentes com assets compartilhados.

## Estrutura de Arquivos

```
Back-office/Gerador de Questões por IA – BackOffice/
│
├── index.html                    # Hub de navegação (landing page)
├── README.md                     # Documentação principal
│
├── pages/                        # Páginas modulares (estrutura independente)
│   ├── 01-habilidades-topicos/
│   │   ├── index.html            # Entrada da página
│   │   ├── script.js             # Lógica JavaScript
│   │   └── styles.css            # Estilos específicos
│   ├── 02-criar-questao-quiz/
│   │   ├── index.html
│   │   ├── script.js             # ⚠️ Salva toast em localStorage
│   │   └── styles.css
│   └── 03-banco-questoes-revisao/
│       ├── index.html
│       ├── script.js             # ⚠️ Lê toast do localStorage
│       └── styles.css
│
├── assets/                       # Recursos compartilhados (Back-office)
│   ├── icons/                    # 18 ícones SVG
│   │   ├── icon-ai-sparkles.svg
│   │   ├── icon-human.svg
│   │   ├── icon-math.svg
│   │   └── ...
│   ├── logo-icon-real.svg
│   └── logo-text-real.svg
│
└── docs/                         # Documentação técnica
    ├── README.md
    └── ARQUITETURA.md            # Este arquivo
```

## Paths Relativos

### De pages/0X-*/ para:

| Destino | Path Relativo | Exemplo |
|---------|--------------|---------|
| **Root assets** | `../../../../assets/` | basis.css, common.css |
| **Back-office assets** | `../../assets/` | logo-icon-real.svg, icons/*.svg |
| **Local (mesmo dir)** | `./` ou direto | styles.css, script.js |

### Exemplo (Página 01):

```html
<!-- Root assets (4 níveis acima) -->
<link rel="stylesheet" href="../../../../assets/styles/basis.css">
<link rel="stylesheet" href="../../../../assets/styles/common.css">

<!-- Local (mesmo diretório) -->
<link rel="stylesheet" href="styles.css">

<!-- Back-office assets (2 níveis acima) -->
<img src="../../assets/logo-icon-real.svg" alt="Logo">
```

## Hierarquia de Navegação

```
Root (/)
  └── Back-office/
      └── Gerador de Questões por IA – BackOffice/
          ├── index.html (Hub)
          └── pages/
              ├── 01-habilidades-topicos/
              ├── 02-criar-questao-quiz/
              └── 03-banco-questoes-revisao/
```

## Fluxo de Dados

### Toast Notification (localStorage)

```
Página 02 (Criar Questão)
    ↓
  [JS] Salva toast
    ↓
  localStorage.setItem('toastPendente', JSON.stringify({
    mensagem: "Questão criada com sucesso!",
    tipo: "sucesso"
  }))
    ↓
Página 03 (Banco Questões)
    ↓
  [JS] Lê toast
    ↓
  const toast = JSON.parse(localStorage.getItem('toastPendente'))
    ↓
  Exibe notificação
    ↓
  localStorage.removeItem('toastPendente')
```

### Stats-bar (Página 03)

```javascript
// Dados hardcoded para protótipo
const stats = {
  quiz: 15,      // Questões tipo quiz
  ia: 5,         // Geradas por IA
  humano: 10     // Criadas por humanos
};
```

## Design System

### Cores (CSS Custom Properties)

Definidas em `../../../../assets/styles/basis.css`:

```css
:root {
  --primary: #7367ef;        /* Roxo principal (Vuexy) */
  --success: #28c76f;        /* Verde sucesso */
  --danger: #ea5455;         /* Vermelho erro */
  --warning: #ff9f43;        /* Laranja aviso */
  --info: #00cfe8;           /* Azul informação */
  
  --bg: #f8f8f8;            /* Background */
  --fg: #5e5873;            /* Foreground (texto) */
  --card: #ffffff;          /* Cards */
  --border: #ebe9f1;        /* Bordas */
}
```

### Tipografia

- **Fonte:** Montserrat (Google Fonts)
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Componentes Compartilhados

### Sidebar (Página 01)

```html
<aside data-role="sidebar">
  <div class="sidebar-logo">
    <img src="../../assets/logo-icon-real.svg" />
    <img src="../../assets/logo-text-real.svg" />
  </div>
  <nav class="sidebar-menu">
    <!-- Menu items -->
  </nav>
</aside>
```

### Toast Container (Páginas 02 e 03)

```html
<div id="toastContainer" class="toast-container"></div>
```

```javascript
// Criar toast
function mostrarToast(mensagem, tipo) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensagem;
  document.getElementById('toastContainer').appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}
```

## Decisões Arquiteturais

### ADR-001: Estrutura Modular

**Decisão:** Separar cada página em seu próprio diretório com HTML, CSS e JS independentes.

**Razão:**
- Facilita manutenção (cada página isolada)
- Permite adicionar novas páginas sem impactar existentes
- Código mais organizado e navegável
- Evita conflitos de nomes (styles.css é único por página)

### ADR-002: Paths Relativos (4 níveis para root)

**Decisão:** Usar `../../../../assets/` para acessar root assets.

**Razão:**
- Estrutura: `pages/0X-*/` = 4 níveis de profundidade
- Mantém assets centralizados na raiz (compartilhados com outros produtos)
- Evita duplicação de basis.css e common.css

### ADR-003: Toast via localStorage

**Decisão:** Usar localStorage para persistir toast entre páginas.

**Razão:**
- Simples e eficaz para protótipo
- Não requer backend ou estado global
- Fácil de implementar e testar
- Funciona mesmo em reloads

## Integração com Outros Produtos

### Root Assets Compartilhados

```
Root/
├── assets/
│   └── styles/
│       ├── basis.css         # Design tokens
│       └── common.css        # Componentes reutilizáveis
│
├── Front-office/             # Produto 1
├── Back-office/              # Produto 2 (este)
└── src/ (Games)              # Produto 3
```

Todos os 3 produtos referenciam `assets/styles/` da raiz.

## Performance

### Otimizações

- ✅ CSS/JS separados (cacheable)
- ✅ SVG inline (página 02) vs. SVG externo (páginas 01, 03)
- ✅ Font preconnect (Google Fonts)
- ✅ Sem dependencies externas (jQuery, Bootstrap, etc.)

### Métricas Esperadas

- **First Paint:** < 1s
- **Interactive:** < 2s
- **Bundle Size:** ~50KB (HTML+CSS+JS por página)

## Validação e Testes

### Comandos

```bash
# Validar estrutura
python scripts/validate-migration.py .

# Servidor local
python -m http.server 8080
```

### Checklist Funcional

- [ ] Todas as páginas carregam (HTTP 200)
- [ ] CSS aplicado corretamente
- [ ] Ícones renderizam
- [ ] Toast persiste entre páginas
- [ ] Stats-bar exibe valores corretos
- [ ] Filtros funcionam
- [ ] Pesquisa funciona

## Evolução Futura

### Melhorias Planejadas

1. **Componentização:** Extrair sidebar, header, toast para componentes reutilizáveis
2. **Backend Integration:** API REST para CRUD de questões
3. **Autenticação:** Login com LDAP/OAuth
4. **Real-time:** WebSockets para atualizações ao vivo
5. **PWA:** Service Worker para offline

### Migração para Vue.js

Estrutura atual facilita handoff:
- Cada página → componente Vue
- styles.css → scoped styles
- script.js → Vue methods/computed
- localStorage → Vuex store

## Referências

- [SNAPSHOT-BASELINE-2b18808.md](../../docs/SNAPSHOT-BASELINE-2b18808.md) - Estado PRÉ-reorganização
- [CHECKLIST-VALIDACAO-POS-MIGRACAO.md](../../docs/CHECKLIST-VALIDACAO-POS-MIGRACAO.md) - Testes
- [README.md](../README.md) - Documentação principal

---

**Última atualização:** 2025-11-17  
**Versão:** 2.0 (Pós-reorganização)
