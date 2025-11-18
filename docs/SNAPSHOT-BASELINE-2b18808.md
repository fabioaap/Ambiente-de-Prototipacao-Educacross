# Snapshot Baseline - Commit 2b18808

## Estado PRÉ-reorganização Back-office

### Back-office - Arquivos Principais

**Habilidades e Tópicos:**
- habilidades-topicos-v2.html (266 linhas)
- habilidades-topicos-v2.js (41 linhas)
- habilidades-topicos-v2.css (66 linhas)
- habilidades-topicos.html (248 linhas) - v1 para referência

**Criar Questão Quiz:**
- criar-questao-quiz.html (489 linhas)
- criar-questao-quiz.js (325 linhas)
- criar-questao-quiz.css (250 linhas)
- criar-questao-quiz-new.css (147 linhas)

**Banco de Questões Revisão:**
- banco-questoes-revisao.html (951 linhas)
- banco-questoes-revisao-FUNCIONANDO.js (784 linhas)
- banco-questoes-revisao.css (1,306 linhas)

**Total:** ~5,000 linhas (HTML+CSS+JS misturado em arquivos monolíticos)

### Back-office - Estrutura Atual

```
Back-office/Gerador de Questões por IA – BackOffice/
├── *.html (6 arquivos HTML na raiz)
├── *.css (4 arquivos CSS na raiz)
├── *.js (3 arquivos JS na raiz)
├── assets/
│   ├── styles/ (basis.css, common.css)
│   ├── icons/ (18 SVGs)
│   └── logo-*.svg
├── pages/
│   └── habilidades-topicos/ (estrutura parcial iniciada)
└── docs/ (vários MD)
```

### Front-office - Estado Atual

```
Front-office/
└── Adicionar modal de visualizaçãoaprovação no Banco de Questões/
    └── prototipo-modal-aprovacao/
        └── demo-interativo.html (1 arquivo)
```

**Status:** 📍 ESPARSO - apenas 1 protótipo de modal

### Stats - 4 Pilares

✅ **Root Dashboard:** Working (index.html, 404.html, .nojekyll)
✅ **Environment Docs:** Consolidados em docs/ambiente-prototipacao/ (FASE 0 concluída)
✅ **Games:** Working (src/, apps/, packages/)
⚠️ **Back-office:** Precisa reorganização (FASES 2-6)

### Critical Features a Preservar

**Back-office:**
- ✅ Toast localStorage: 'toastPendente' (cria em página 02, exibe em página 03)
- ✅ Stats-bar badges: Quiz: 15, IA: 5, Humano: 10
- ✅ Paths assets: ../../assets/styles/ (2 níveis acima da raiz dos HTMLs)
- ✅ Sidebar/header: Duplicado em 3 páginas (~150 linhas cada)
- ✅ Filtros e pesquisa: Funcionando em banco-questoes-revisao.html

**Front-office:**
- ✅ Modal aprovação: demo-interativo.html funcionando

### Objetivo de Redução

**Meta:** Reduzir Back-office de ~5,000 linhas para ~1,500 linhas (-70%)

**Como:**
- Separar HTML, CSS e JS em arquivos individuais por página
- Extrair CSS duplicado para assets/styles/
- Remover sidebar/header inline, usar componente compartilhado
- Organizar em estrutura modular: pages/01-*, pages/02-*, pages/03-*

### Commit de Referência

- **Branch:** copilot/reorganize-project-structure
- **Commit:** 2b18808
- **Data:** 2025-11-17
- **Autor:** Copilot + fabioaap

### Validação Esperada Pós-Reorganização

1. ✅ Todas as 3 páginas carregam sem 404s
2. ✅ Toast persiste entre páginas
3. ✅ Stats-bar renderiza corretamente
4. ✅ Assets (CSS, ícones) carregam corretamente
5. ✅ Funcionalidades (filtros, pesquisa) mantidas
6. ✅ Redução mínima de 50% em linhas totais
