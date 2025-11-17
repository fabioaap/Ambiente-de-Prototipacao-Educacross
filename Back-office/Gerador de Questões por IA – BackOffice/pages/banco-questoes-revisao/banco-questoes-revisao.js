/**
 * Banco de Questões - Em Revisão
 * JavaScript para interatividade
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Banco de Questões - Em Revisão carregado');

    // ============================================
    // 1. INICIALIZAÇÃO
    // ============================================

    inicializarTabs();
    inicializarFiltros();
    inicializarSwitches();
    inicializarTabela();
    inicializarPaginacao();

    // ============================================
    // 2. TABS
    // ============================================

    function inicializarTabs() {
        const tabs = document.querySelectorAll('.tab-item');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Remove ativo de todas
                tabs.forEach(t => t.classList.remove('tab-active'));

                // Adiciona ativo na clicada
                this.classList.add('tab-active');

                console.log(`Tab ativada: ${this.textContent.trim()}`);
            });
        });
    }

    // ============================================
    // 3. FILTROS
    // ============================================

    function inicializarFiltros() {
        const selects = document.querySelectorAll('.select-wrapper');

        selects.forEach(select => {
            select.addEventListener('click', function () {
                console.log('Filtro clicado:', this);
                // Aqui seria aberto um dropdown real
                // Por enquanto, apenas simula a interação
            });
        });

        // Barra de pesquisa
        const searchInput = document.querySelector('.search-input input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                console.log('Pesquisa:', e.target.value);
                // Aqui seria implementada a filtragem
            });
        }
    }

    // ============================================
    // 4. SWITCHES
    // ============================================

    function inicializarSwitches() {
        const switches = document.querySelectorAll('.switch-input');

        switches.forEach(switchInput => {
            switchInput.addEventListener('change', function () {
                const label = this.parentElement.nextElementSibling;
                const tipo = label ? label.textContent.trim() : 'desconhecido';

                console.log(`Switch ${tipo}: ${this.checked ? 'ATIVO' : 'INATIVO'}`);

                // Aqui seria implementada a filtragem por estado
            });
        });
    }

    // ============================================
    // 5. TABELA
    // ============================================

    function inicializarTabela() {
        // Botões de visualizar (ícone de olho)
        const btnVisualizar = document.querySelectorAll('.btn-icon');

        btnVisualizar.forEach(btn => {
            btn.addEventListener('click', function () {
                const row = this.closest('tr');
                const codigo = row.querySelector('.skill-code')?.textContent.trim();

                console.log(`Visualizar questão: ${codigo}`);

                // Aqui seria aberto um modal com detalhes da questão
                alert(`Visualizando questão ${codigo || 'sem código'}`);
            });
        });

        // Hover nas linhas
        const rows = document.querySelectorAll('.questions-table tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function () {
                this.style.backgroundColor = 'rgba(115, 103, 240, 0.03)';
            });

            row.addEventListener('mouseleave', function () {
                this.style.backgroundColor = '';
            });
        });
    }

    // ============================================
    // 6. PAGINAÇÃO
    // ============================================

    function inicializarPaginacao() {
        const paginationNumbers = document.querySelectorAll('.pagination-number');
        const paginationArrows = document.querySelectorAll('.pagination-arrow');

        // Números de página
        paginationNumbers.forEach(btn => {
            btn.addEventListener('click', function () {
                if (this.classList.contains('pagination-active')) return;

                // Remove ativo de todas
                paginationNumbers.forEach(b => b.classList.remove('pagination-active'));

                // Adiciona ativo na clicada
                this.classList.add('pagination-active');

                const pagina = this.textContent.trim();
                console.log(`Página ${pagina} selecionada`);

                // Aqui seria carregada a nova página de resultados
                carregarPagina(parseInt(pagina));
            });
        });

        // Setas de navegação
        paginationArrows.forEach(arrow => {
            arrow.addEventListener('click', function () {
                if (this.disabled) return;

                const isNext = this.querySelector('path').getAttribute('d').includes('M8 6L12');
                const paginaAtual = document.querySelector('.pagination-active');
                const numeroPaginaAtual = parseInt(paginaAtual.textContent);

                if (isNext) {
                    console.log(`Próxima página: ${numeroPaginaAtual + 1}`);
                    carregarPagina(numeroPaginaAtual + 1);
                } else {
                    console.log(`Página anterior: ${numeroPaginaAtual - 1}`);
                    carregarPagina(numeroPaginaAtual - 1);
                }
            });
        });
    }

    function carregarPagina(numeroPagina) {
        console.log(`🔄 Carregando página ${numeroPagina}...`);

        // Simula carregamento
        const tableContainer = document.querySelector('.table-container');
        tableContainer.style.opacity = '0.5';

        setTimeout(() => {
            tableContainer.style.opacity = '1';
            console.log(`✅ Página ${numeroPagina} carregada`);
        }, 300);

        // Aqui seria feita uma chamada à API para buscar os dados
    }

    // ============================================
    // 7. BOTÕES DE AÇÃO
    // ============================================

    const btnImportar = document.querySelector('.btn-primary:nth-child(2)');
    const btnExportar = document.querySelector('.btn-primary:nth-child(3)');
    const btnNovaQuestao = document.querySelector('.btn-primary:nth-child(4)');

    if (btnImportar) {
        btnImportar.addEventListener('click', function () {
            console.log('Importar questões clicado');
            alert('Funcionalidade de importação em desenvolvimento');
        });
    }

    if (btnExportar) {
        btnExportar.addEventListener('click', function () {
            console.log('Exportar questões clicado');
            alert('Funcionalidade de exportação em desenvolvimento');
        });
    }

    if (btnNovaQuestao) {
        btnNovaQuestao.addEventListener('click', function () {
            console.log('Nova questão clicado');
            // Redireciona para tela de criação
            window.location.href = 'criar-questao-quiz.html';
        });
    }

    // ============================================
    // 8. UTILS
    // ============================================

    // Atualiza contador de questões
    function atualizarContador(total) {
        const totalValue = document.querySelector('.total-value');
        if (totalValue) {
            totalValue.textContent = total;
            console.log(`Contador atualizado: ${total} questões`);
        }
    }

    // Simula atualização dinâmica (exemplo)
    setTimeout(() => {
        atualizarContador(4);
    }, 2000);

    // ============================================
    // 9. CONTROLE DO DRAWER PAINEL DE GERAÇÃO IA
    // ============================================

    const btnPainelGeracao = document.getElementById('btnPainelGeracao');
    const drawer = document.getElementById('painelGeracaoDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const btnCloseDrawer = document.getElementById('closeDrawer');

    // Função para abrir o drawer
    function abrirDrawer() {
        drawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll do body
    }

    // Função para fechar o drawer
    function fecharDrawer() {
        drawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll do body
    }

    // Event listeners
    if (btnPainelGeracao) {
        btnPainelGeracao.addEventListener('click', abrirDrawer);
    }

    if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener('click', fecharDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', fecharDrawer);
    }

    // Fechar drawer com tecla ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && drawer.classList.contains('active')) {
            fecharDrawer();
        }
    });

    // Simulação de cliques nos botões de visualizar do drawer
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('.table-row');
            const area = row.querySelector('.cell-area').textContent;
            const status = row.querySelector('.status-badge').textContent;
            alert(`Visualizar detalhes da geração:\nÁrea: ${area}\nStatus: ${status}`);
        });
    });
});
