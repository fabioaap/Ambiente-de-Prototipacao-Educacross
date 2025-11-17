# Gerador de Questões por IA – BackOffice

## 📁 Estrutura Organizada

```
Back-office/Gerador de Questões por IA – BackOffice/
├── pages/                           # 📄 Páginas da aplicação
│   ├── banco-questoes-revisao/      # Página de banco de questões em revisão
│   │   ├── banco-questoes-revisao.html
│   │   ├── banco-questoes-revisao.css
│   │   └── banco-questoes-revisao.js
│   ├── criar-questao-quiz/          # Página de criação de questões
│   │   ├── criar-questao-quiz.html
│   │   ├── criar-questao-quiz.css
│   │   ├── criar-questao-quiz-new.css
│   │   └── criar-questao-quiz.js
│   ├── habilidades-topicos/         # Página de habilidades e tópicos (v1)
│   │   ├── habilidades-topicos.html
│   │   ├── habilidades-topicos.css
│   │   └── habilidades-topicos.js
│   └── habilidades-topicos-v2/      # Página de habilidades e tópicos (v2)
│       ├── habilidades-topicos-v2.html
│       ├── habilidades-topicos-v2.css
│       └── habilidades-topicos-v2.js
├── docs/                            # 📚 Documentação
│   ├── README-MODULAR.md
│   ├── GUIA-USO-BANCO-QUESTOES-REVISAO.md
│   ├── COMPARACAO-FIGMA-VS-IMPLEMENTACAO.md
│   ├── CORRECOES-CRITICAS.md
│   ├── ENTREGA-FINAL-BANCO-QUESTOES.md
│   ├── LICOES-APRENDIDAS-CORES-BADGES.md
│   ├── TOKENS-FIGMA-TOPICOS.md
│   ├── VALIDACAO-BANCO-QUESTOES-REVISAO.md
│   ├── VALIDACAO-FIGMA-V2.md
│   ├── VALIDACAO-FINAL-FIGMA.md
│   ├── VALIDACAO-POS-CODIFICACAO.md
│   ├── VALIDACAO-TOPICOS-FIGMA.md
│   └── banco-questoes-pixel-perfect.txt
├── assets/                          # 🎨 Recursos visuais
│   ├── icons/                       # Ícones SVG
│   ├── logo-icon-real.svg
│   ├── logo-icon.svg
│   ├── logo-text-real.svg
│   ├── logo-text.svg
│   └── Group 10000.png
└── _arquivados/                     # 🗃️ Arquivos legados

```

## 🚀 Como Usar

### Desenvolvimento Local

#### Opção 1: Python HTTP Server
```bash
# Na raiz do repositório
python -m http.server 8080

# Acessar páginas:
# http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/banco-questoes-revisao/banco-questoes-revisao.html
# http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/criar-questao-quiz/criar-questao-quiz.html
# http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/habilidades-topicos/habilidades-topicos.html
# http://localhost:8080/Back-office/Gerador%20de%20Quest%C3%B5es%20por%20IA%20%E2%80%93%20BackOffice/pages/habilidades-topicos-v2/habilidades-topicos-v2.html
```

#### Opção 2: VS Code Live Server
1. Instalar extensão "Live Server"
2. Abrir qualquer arquivo HTML na pasta `pages/`
3. Clicar com botão direito > "Open with Live Server"

## 📄 Páginas Disponíveis

### 1. Banco de Questões - Em Revisão
**Localização:** `pages/banco-questoes-revisao/banco-questoes-revisao.html`

Página para visualização e gerenciamento de questões em revisão.

### 2. Criar Nova Questão de Quiz
**Localização:** `pages/criar-questao-quiz/criar-questao-quiz.html`

Interface para criação de novas questões de quiz com IA.

### 3. Habilidades e Tópicos (v1)
**Localização:** `pages/habilidades-topicos/habilidades-topicos.html`

Primeira versão da página de gerenciamento de habilidades e tópicos.

### 4. Habilidades e Tópicos (v2)
**Localização:** `pages/habilidades-topicos-v2/habilidades-topicos-v2.html`

Segunda versão da página de gerenciamento de habilidades e tópicos.

## 🔧 Dependências

Todas as páginas dependem de:
- **CSS compartilhado:** `../../../../assets/styles/basis.css` e `../../../../assets/styles/common.css` (localizados na raiz do repositório)
- **Google Fonts:** Montserrat
- **Assets locais:** Logos e ícones na pasta `assets/`

## 📚 Documentação

Para mais detalhes sobre cada página e suas funcionalidades, consulte a pasta `docs/`:
- `docs/README-MODULAR.md` - Explicação da arquitetura modular
- `docs/GUIA-USO-BANCO-QUESTOES-REVISAO.md` - Guia de uso da página de banco de questões

## 🏗️ Princípios de Organização

### Separação por Funcionalidade
Cada página está em sua própria pasta contendo:
- HTML (estrutura)
- CSS (estilos específicos)
- JS (lógica da página)

### Documentação Centralizada
Toda documentação foi movida para a pasta `docs/` para facilitar manutenção.

### Assets Compartilhados
Recursos visuais (logos, ícones) ficam na pasta `assets/` e são compartilhados entre todas as páginas.

## 🔄 Histórico de Mudanças

### Versão 2.0 (Nov 2024)
- ✅ Organização da estrutura em pastas por funcionalidade
- ✅ Separação clara entre páginas, documentação e assets
- ✅ Atualização de todas as referências de caminhos
- ✅ Manutenção da compatibilidade com CSS/JS compartilhados
