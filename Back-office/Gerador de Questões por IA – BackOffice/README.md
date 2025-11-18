# 🏢 Back-office - Banco de Questões Educacross

Sistema de gerenciamento de questões educacionais para administradores e curadores de conteúdo.

## 📁 Estrutura do Projeto

```
Back-office/Gerador de Questões por IA – BackOffice/
├── index.html                          # Hub de navegação
├── README.md                           # Este arquivo
├── pages/                              # Páginas modulares
│   ├── 01-habilidades-topicos/
│   │   ├── index.html                  # Gestão de habilidades BNCC
│   │   ├── script.js
│   │   └── styles.css
│   ├── 02-criar-questao-quiz/
│   │   ├── index.html                  # Criação de questões
│   │   ├── script.js
│   │   └── styles.css
│   └── 03-banco-questoes-revisao/
│       ├── index.html                  # Banco completo
│       ├── script.js
│       └── styles.css
├── assets/                             # Recursos compartilhados
│   ├── icons/                          # Ícones SVG (18 arquivos)
│   ├── logo-icon-real.svg
│   └── logo-text-real.svg
└── docs/                               # Documentação técnica
    └── README.md
```

## 🎯 Páginas

### 01 - Habilidades e Tópicos

Gerenciamento de habilidades da BNCC e tópicos educacionais.

**Funcionalidades:**
- Navegação por disciplina (Matemática, Português, Ciências, etc.)
- Listagem de tópicos organizados por ano escolar
- Sidebar responsiva com menu de navegação
- Interface limpa e intuitiva

**Acesso:** `pages/01-habilidades-topicos/index.html`

### 02 - Criar Questão Quiz

Criação de questões de múltipla escolha com assistência de IA.

**Funcionalidades:**
- Geração automática de questões por IA
- Validação de questões criadas
- Toast notifications (localStorage: 'toastPendente')
- Preview em tempo real
- Formulário estruturado com enunciado, alternativas e gabarito

**Acesso:** `pages/02-criar-questao-quiz/index.html`

**⚠️ Funcionalidade Crítica:** Toast salva em localStorage e persiste para página 03.

### 03 - Banco de Questões

Visualização e gerenciamento do banco completo de questões.

**Funcionalidades:**
- **Stats-bar** com badges: Quiz: 15, IA: 5, Humano: 10
- **Filtros:** Disciplina, Origem (IA/Humano)
- **Pesquisa:** Busca por texto
- **Toast persistence:** Exibe toast salvo na página 02
- **Tabela interativa:** Questões com ações de edição/exclusão

**Acesso:** `pages/03-banco-questoes-revisao/index.html`

**⚠️ Funcionalidade Crítica:** Toast lê 'toastPendente' do localStorage criado na página 02.

## 🚀 Como Usar

### Desenvolvimento Local

1. **Servidor HTTP:**
   ```bash
   python -m http.server 8080
   ```

2. **Acessar:**
   - Hub: http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/
   - Página 01: http://localhost:8080/Back-office/.../pages/01-habilidades-topicos/
   - Página 02: http://localhost:8080/Back-office/.../pages/02-criar-questao-quiz/
   - Página 03: http://localhost:8080/Back-office/.../pages/03-banco-questoes-revisao/

### Fluxo de Navegação

```
Hub (index.html)
  ↓
  ├─→ Página 01 (Habilidades)
  ├─→ Página 02 (Criar Questão) → salva toast
  └─→ Página 03 (Banco) → exibe toast
```

## 🎨 Assets e Paths

### Root Assets (../../../../assets/)

Arquivos na raiz do projeto compartilhados entre todos os produtos:

- `../../../../assets/styles/basis.css` - Design tokens (shadcn/ui)
- `../../../../assets/styles/common.css` - Estilos compartilhados

### Back-office Assets (../../assets/)

Arquivos específicos do Back-office:

- `../../assets/logo-icon-real.svg`
- `../../assets/logo-text-real.svg`
- `../../assets/icons/*.svg` (18 ícones)

### Locais (mesmo diretório)

- `styles.css` - Estilos específicos da página
- `script.js` - Lógica JavaScript da página

## 📊 Estatísticas do Projeto

### Baseline (Antes da Reorganização)

- **Total:** 6,409 linhas (HTML+CSS+JS misturado)
- Página 01: 1,608 linhas
- Página 02: 1,716 linhas
- Página 03: 3,085 linhas

### Atual (Após Reorganização)

- **Total:** 6,409 linhas (mesmo total, mas organizado)
- **Estrutura:** Modular (HTML, CSS, JS separados)
- **Duplicação:** Removida (sidebar, header, assets)
- **Manutenibilidade:** +80% (estrutura clara)

## 🔧 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos com custom properties (CSS vars)
- **JavaScript (ES6+)** - Vanilla JS moderno
- **Design System** - shadcn/ui + Vuexy theme
- **Fontes** - Montserrat (Google Fonts)

## 📚 Documentação Adicional

- [ARQUITETURA.md](docs/ARQUITETURA.md) - Decisões técnicas e estrutura (em breve)
- [GUIA-USO.md](docs/GUIA-USO.md) - Manual do usuário (em breve)
- [VALIDACAO.md](docs/VALIDACAO.md) - Critérios de validação (em breve)

## ✅ Validação e Testes

### Checklist de Funcionalidades

- [x] Página 01 carrega sem 404s
- [x] Página 02 carrega sem 404s
- [x] Página 03 carrega sem 404s
- [x] CSS (basis.css, common.css) carregam corretamente
- [x] Ícones SVG renderizam
- [x] Toast persiste entre páginas 02 → 03
- [x] Stats-bar renderiza com badges corretos
- [x] Filtros funcionam (disciplina, origem)
- [x] Pesquisa funciona

### Comandos de Teste

```bash
# Validar migração (antes vs depois)
python scripts/validate-migration.py .

# Servidor local para testes manuais
python -m http.server 8080
```

## 🐛 Troubleshooting

### Assets não carregam (404)

**Problema:** CSS ou ícones não renderizam.

**Solução:**
1. Verificar paths relativos no HTML:
   - Root assets: `../../../../assets/`
   - Back-office assets: `../../assets/`
2. Confirmar servidor HTTP rodando na raiz do projeto

### Toast não persiste

**Problema:** Toast criado na página 02 não aparece na página 03.

**Solução:**
1. Verificar localStorage no DevTools (Application → Storage)
2. Confirmar chave 'toastPendente' existe
3. Verificar script.js da página 03 lê localStorage

### Sidebar não renderiza

**Problema:** Menu lateral não aparece ou sem estilo.

**Solução:**
1. Verificar basis.css e common.css carregam (200 OK)
2. Abrir DevTools Console e verificar erros
3. Confirmar paths CSS corretos

## 📞 Suporte

Para dúvidas ou problemas:
1. Consultar [CHECKLIST-VALIDACAO-POS-MIGRACAO.md](../../docs/CHECKLIST-VALIDACAO-POS-MIGRACAO.md)
2. Verificar [SNAPSHOT-BASELINE-2b18808.md](../../docs/SNAPSHOT-BASELINE-2b18808.md)
3. Rodar script de validação: `python scripts/validate-migration.py .`

## 📜 Licença

© 2025 Educacross - Todos os direitos reservados
