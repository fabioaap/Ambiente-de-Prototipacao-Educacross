# 🎯 Guia de Uso - Banco de Questões Em Revisão

## 📌 Visão Geral

Tela de gerenciamento do banco de questões na fase "Em Revisão". Permite filtrar, visualizar e gerenciar questões que estão sendo revisadas antes da aprovação.

## 🚀 Como Usar

### Acessando a Tela

1. Abrir servidor local:
```powershell
python -m http.server 8080 --directory "Back-office\Gerador de Questões por IA – BackOffice"
```

2. Acessar no navegador:
```
http://localhost:8080/banco-questoes-revisao.html
```

### Navegação

#### 1. Tabs de Status
- **Aprovadas:** Questões já aprovadas
- **Em revisão:** ⭐ Tab ativa - questões sendo revisadas
- **Em correção:** Questões aguardando correção

**Como usar:**
- Clicar na tab para alternar entre status
- Tab ativa tem fundo roxo (#7367F0)

#### 2. Filtros

**Filtros com badges coloridas (Row 1):**
- **Área de Conhecimento:** Matemática (verde-água)
- **Ano Escolar:** 6º ano (roxo claro)
- **Tipo de questão:** Quiz (ciano)
- **Nível de dificuldade:** Muito Difícil (vermelho com borda)

**Filtros de texto (Row 2):**
- **Habilidade:** "Todas as habilidades" (texto roxo)
- **Tópico de Conhecimento:** "Todos os Tópicos" (texto roxo)
- **Autoria:** "Todos os autores" (texto roxo)

**Como usar:**
- Clicar no select para abrir dropdown (simulado por enquanto)
- Console.log mostra interação

#### 3. Barra de Pesquisa

Pesquisar por código ou conteúdo da questão.

**Como usar:**
- Digitar texto no campo
- Console.log mostra termo pesquisado
- (API backend necessária para busca real)

#### 4. Switches

Filtrar exibição por estado:
- **Questões ativas:** ✅ Habilitado (switch roxo)
- **Questões inativas:** ✅ Habilitado (switch roxo)

**Como usar:**
- Clicar no switch para toggle
- Ambos podem estar ativos simultaneamente
- Console.log mostra mudança

#### 5. Botões de Ação

**Total de Questões: 1**
- Badge informativo (atualiza dinamicamente)

**Botões principais:**
- 📥 **Importar questões:** Upload de arquivo CSV/JSON
- 📄 **Exportar questões:** Download das questões filtradas
- ➕ **Nova questão:** Redireciona para `criar-questao-quiz.html`

**Como usar:**
- Clicar no botão desejado
- Funcionalidades mostram alert (em desenvolvimento)
- Botão "Nova questão" redireciona para criação

#### 6. Tabela de Questões

**Colunas:**
1. **CÓDIGO:** ⚠️ + 📐 + número do ano
2. **HABILIDADES:** Badge rosa EF06MA05 + badge vermelha DI + código 1.1.1.3
3. **TÓPICO:** Texto descritivo
4. **TIPO:** Badge ciano "Quiz"
5. **AUTORIA:** Texto (ex: Canoas)
6. **CRIADOR:** Avatar circular MG
7. **REVISOR:** Avatar circular RF
8. **DATA:** 27/05/2025 12:00:42
9. **AÇÕES:** 👁️ Visualizar

**Como usar:**
- Hover nas linhas: background roxo claro
- Clicar no ícone 👁️: abre modal (simulado com alert)
- Console.log mostra questão selecionada

#### 7. Paginação

Navegar entre páginas de resultados.

**Elementos:**
- Seta esquerda: página anterior
- Números 1-5: páginas disponíveis
- Seta direita: próxima página

**Como usar:**
- Clicar no número: vai para página
- Clicar na seta: navega sequencialmente
- Página ativa tem fundo roxo
- Animação de carregamento (opacity 0.5)

## 🎨 Detalhes Visuais

### Cores por Badge

| Tipo | Background | Texto | Uso |
|------|-----------|-------|-----|
| Matemática | `rgba(0, 189, 185, 0.12)` | `#00BDB9` | Área conhecimento |
| 6º ano | `rgba(115, 103, 240, 0.12)` | `#7367F0` | Ano escolar |
| Quiz | `rgba(0, 189, 185, 0.12)` | `#00BDB9` | Tipo questão |
| Muito Difícil | `rgba(234, 84, 85, 0.12)` + borda | `#EA5455` | Nível dificuldade |
| EF06MA05 | `rgba(234, 84, 85, 0.12)` | `#EA5455` | Habilidade |
| DI | `#EA5455` | `#FFFFFF` | Dificuldade na tabela |

### Tamanhos

- **Sidebar:** 265px (fixa)
- **Header:** 50px altura
- **Tabs:** 45px altura + 2px borda
- **Switches:** 35px × 20px
- **Switch ball:** 14px
- **Avatares:** 32px círculo
- **Ícones:** 20px-24px
- **Paginação botões:** 40px × 40px

## 🔧 Extensões Possíveis

### 1. Conectar com API Backend

Modificar `banco-questoes-revisao.js`:

```javascript
async function carregarPagina(numeroPagina) {
    try {
        const filtros = obterFiltrosAtivos();
        const response = await fetch(`/api/questoes?page=${numeroPagina}&status=em-revisao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filtros)
        });
        
        const data = await response.json();
        renderizarTabela(data.questoes);
        atualizarContador(data.total);
        atualizarPaginacao(data.paginaAtual, data.totalPaginas);
    } catch (error) {
        console.error('Erro ao carregar questões:', error);
        alert('Erro ao carregar dados');
    }
}

function renderizarTabela(questoes) {
    const tbody = document.querySelector('.questions-table tbody');
    tbody.innerHTML = questoes.map(q => `
        <tr>
            <td>
                <div class="code-cell">
                    ${q.warning ? '<div class="warning-icon">⚠️</div>' : ''}
                    <span class="badge badge-teal-icon">${q.icone}</span>
                    <span class="year-badge">${q.ano}</span>
                </div>
            </td>
            <td>
                <div class="badges-cell">
                    ${q.habilidades.map(h => `<span class="badge badge-habilidade">${h}</span>`).join('')}
                </div>
                <div class="skill-code">${q.codigo}</div>
            </td>
            <td class="topic-cell">${q.topico}</td>
            <td><span class="badge badge-cyan">${q.tipo}</span></td>
            <td class="author-cell">${q.autoria}</td>
            <td><div class="avatar avatar-purple">${q.criador}</div></td>
            <td><div class="avatar avatar-purple">${q.revisor}</div></td>
            <td class="date-cell">${q.dataCriacao}</td>
            <td>
                <button class="btn-icon" onclick="visualizarQuestao('${q.id}')">
                    <svg>...</svg>
                </button>
            </td>
        </tr>
    `).join('');
}
```

### 2. Implementar Dropdowns Reais

Adicionar biblioteca select2 ou criar componente custom:

```html
<!-- No head -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<!-- No JS -->
<script>
$(document).ready(function() {
    $('.select-wrapper').select2({
        placeholder: 'Selecione',
        width: '100%'
    });
});
</script>
```

### 3. Modal de Visualização

Criar modal para exibir detalhes da questão:

```html
<!-- Adicionar no body -->
<div id="modalVisualizar" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2 id="modalTitulo"></h2>
        <div id="modalConteudo"></div>
    </div>
</div>
```

```javascript
function visualizarQuestao(idQuestao) {
    const modal = document.getElementById('modalVisualizar');
    
    fetch(`/api/questoes/${idQuestao}`)
        .then(res => res.json())
        .then(questao => {
            document.getElementById('modalTitulo').textContent = questao.enunciado;
            document.getElementById('modalConteudo').innerHTML = `
                <p><strong>Tipo:</strong> ${questao.tipo}</p>
                <p><strong>Nível:</strong> ${questao.nivel}</p>
                <p><strong>Habilidades:</strong> ${questao.habilidades.join(', ')}</p>
                <div class="alternativas">
                    ${questao.alternativas.map(a => `<p>${a}</p>`).join('')}
                </div>
            `;
            modal.style.display = 'block';
        });
}
```

### 4. Exportação CSV

```javascript
function exportarQuestoes() {
    const questoes = obterQuestoesFiltradas();
    
    const csv = [
        ['Código', 'Habilidades', 'Tópico', 'Tipo', 'Autoria', 'Data'].join(','),
        ...questoes.map(q => [
            q.codigo,
            q.habilidades.join(';'),
            q.topico,
            q.tipo,
            q.autoria,
            q.dataCriacao
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questoes-em-revisao-${Date.now()}.csv`;
    a.click();
}
```

### 5. Filtros Avançados

Adicionar mais filtros com auto-complete:

```javascript
function inicializarAutoComplete() {
    const inputHabilidade = document.querySelector('input[name="habilidade"]');
    
    inputHabilidade.addEventListener('input', async function() {
        const termo = this.value;
        if (termo.length < 2) return;
        
        const resultados = await fetch(`/api/habilidades/busca?q=${termo}`);
        const habilidades = await resultados.json();
        
        mostrarSugestoes(habilidades);
    });
}
```

## 🐛 Troubleshooting

### CSS não carrega
- Verificar caminho: `../../assets/styles/basis.css`
- Confirmar que arquivos CSS existem
- Limpar cache do navegador (Ctrl+F5)

### JavaScript não funciona
- Abrir DevTools (F12) → Console
- Verificar erros
- Confirmar que `banco-questoes-revisao.js` foi carregado

### Servidor não inicia
- Verificar se porta 8080 está livre
- Usar porta alternativa: `python -m http.server 8081`
- Verificar se Python está instalado: `python --version`

### Imagens não aparecem
- Verificar paths de SVGs (localhost:3845 do MCP)
- Substituir por ícones locais se necessário
- Usar Font Awesome como alternativa

## 📚 Arquivos Relacionados

- `banco-questoes-revisao.html` — Estrutura HTML
- `banco-questoes-revisao.css` — Estilos completos
- `banco-questoes-revisao.js` — Lógica de interação
- `VALIDACAO-BANCO-QUESTOES-REVISAO.md` — Validação MCP Figma
- `../../assets/styles/basis.css` — Estilos base (deve existir)
- `../../assets/styles/common.css` — Estilos comuns (deve existir)

## 🎯 Próximos Passos

1. ✅ **Integrar com Backend:** Conectar com API REST
2. ✅ **Implementar Modals:** Visualização detalhada de questões
3. ✅ **Adicionar Dropdowns:** Componentes select funcionais
4. ✅ **Exportação Real:** Gerar CSV/PDF com questões
5. ✅ **Importação Real:** Upload e parsing de arquivos
6. ✅ **Testes E2E:** Playwright para automação
7. ✅ **Melhorar Acessibilidade:** ARIA labels, navegação por teclado

---

**Desenvolvido seguindo pipeline MCP Figma + Vanilla JS**  
**Tokens CSS | HTML Semântico | JavaScript Modular**
