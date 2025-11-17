# 🎨 Página do Ambiente de Prototipação - Estrutura Organizada

## 📁 Arquivos Criados

A página foi separada em múltiplos arquivos seguindo as melhores práticas de desenvolvimento web:

```
ambiente-index.html        # HTML estruturado e semântico
ambiente-base.css          # Tokens do Design System (shadcn/ui)
ambiente-styles.css        # Estilos específicos da página
ambiente-script.js         # Interatividade e comportamento
```

## 🎯 Benefícios da Separação

### 1. **Manutenibilidade**
- Cada arquivo tem uma responsabilidade clara
- Fácil localizar e modificar estilos ou comportamentos
- Reduz risco de conflitos em edições simultâneas

### 2. **Performance**
- Navegadores podem cachear CSS e JS separadamente
- Permite minificação e otimização independente
- Carregamento paralelo de recursos

### 3. **Reutilização**
- `ambiente-base.css` pode ser compartilhado com outros projetos
- Tokens do Design System centralizados
- Componentes JavaScript modulares

### 4. **Escalabilidade**
- Fácil adicionar novos estilos sem poluir o arquivo base
- JavaScript organizado em funções reutilizáveis
- Estrutura preparada para crescimento

## 🎨 Estrutura dos Arquivos

### `ambiente-base.css` - Tokens do Design System
Contém todas as variáveis CSS (custom properties) baseadas no shadcn/ui:
- **Cores:** `--bg`, `--fg`, `--accent`, etc.
- **Espaçamento:** `--spacing-xs` até `--spacing-3xl`
- **Tipografia:** Tamanhos, pesos e line-heights
- **Border Radius:** `--radius-sm`, `--radius`, `--radius-lg`
- **Sombras:** `--shadow`, `--shadow-md`, `--shadow-lg`
- **Transições:** `--transition-fast`, `--transition-base`
- **Z-index:** Organização de camadas

**Estilos base:** Reset CSS, tipografia, listas, tabelas, code blocks

### `ambiente-styles.css` - Estilos da Página
Estilos específicos dos componentes da página:
- **Layout:** Header, sidebar, main, footer
- **Componentes:** Hero, sections, tooltip
- **Responsivo:** Media queries para mobile
- **Animações:** Fade-in, transições
- **Print:** Estilos para impressão

### `ambiente-script.js` - Interatividade
Funcionalidades JavaScript:
- **Navegação ativa:** Destaca link da seção atual
- **Scroll suave:** Animação ao clicar em links
- **Menu mobile:** Toggle do menu lateral
- **Scroll spy:** Atualiza menu conforme scroll
- **Indicador de progresso:** Barra de leitura (opcional)

### `ambiente-index.html` - Estrutura HTML
HTML semântico e acessível:
- Meta tags completas (SEO)
- Estrutura hierárquica clara
- Landmarks (header, nav, main, footer)
- Links internos com IDs
- Conteúdo completo da proposta

## 🚀 Como Usar

### Opção 1: Abrir Diretamente
1. Dê duplo clique em `ambiente-index.html`
2. O navegador abrirá a página com todos os recursos

### Opção 2: Servidor Local (Recomendado)
```bash
# Na pasta do projeto
python -m http.server 8080

# Abra no navegador
http://localhost:8080/ambiente-index.html
```

### Opção 3: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com botão direito em `ambiente-index.html`
3. Selecione "Open with Live Server"

## 📱 Recursos Implementados

### ✅ Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu lateral colapsável em telas pequenas
- Tipografia fluida

### ✅ Navegação Inteligente
- Scroll suave entre seções
- Destaque automático da seção atual
- URL atualizada conforme navegação

### ✅ Acessibilidade
- HTML semântico
- Contraste de cores adequado
- Navegação por teclado funcional
- ARIA labels onde necessário

### ✅ Performance
- CSS otimizado e modular
- JavaScript vanilla (zero dependências)
- Assets externos apenas (Google Fonts)

### ✅ Print-Friendly
- Estilos específicos para impressão
- Remove elementos desnecessários (menu, header, footer)
- Layout otimizado para papel

## 🎯 Próximos Passos

### Organização Final
1. Criar pasta `docs/ambiente-prototipacao/`
2. Mover os 4 arquivos para lá
3. Renomear `ambiente-index.html` para `index.html`

### Estrutura Recomendada
```
docs/
└── ambiente-prototipacao/
    ├── index.html          # (renomeado de ambiente-index.html)
    ├── base.css            # (renomeado de ambiente-base.css)
    ├── styles.css          # (renomeado de ambiente-styles.css)
    ├── script.js           # (renomeado de ambiente-script.js)
    └── README.md           # Documentação
```

### Melhorias Futuras
- [ ] Adicionar dark mode
- [ ] Implementar busca na página
- [ ] Exportar para PDF
- [ ] Adicionar animações avançadas
- [ ] Integrar com sistema de analytics

## 🔧 Customização

### Alterar Cores
Edite `ambiente-base.css`, seção `:root`:
```css
:root {
    --bg: #ffffff;          /* Cor de fundo */
    --accent: #000000;      /* Cor de destaque */
    /* ... */
}
```

### Adicionar Seções
1. Edite `ambiente-index.html`
2. Adicione nova `<section>` no `<main>`
3. Adicione link correspondente no `<nav>`

### Modificar Comportamento
Edite `ambiente-script.js` e customize as funções existentes ou adicione novas.

## 📊 Métricas

- **HTML:** ~20 KB
- **CSS (base):** ~5 KB
- **CSS (styles):** ~6 KB
- **JavaScript:** ~6 KB
- **Total:** ~37 KB (sem minificação)

## 🤝 Contribuindo

Para modificar a página:
1. Edite o arquivo apropriado (HTML, CSS ou JS)
2. Teste em diferentes navegadores
3. Valide acessibilidade
4. Documente mudanças significativas

## 📝 Licença

© 2025 Educacross - Documento interno de produto

---

**Criado em:** 2025-01-14
**Versão:** 2.0 (Modular)
**Autor:** Time de Produto Educacross
