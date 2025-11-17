/**
 * Banco de Questões - Em Revisão
 * JavaScript para interatividade com filtros funcionais
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Banco de Questões - Em Revisão carregado');

    // ============================================
    // 1. DADOS MOCKADOS
    // ============================================

    const questoesMock = [
        {
            id: 1,
            codigo: { emoji: '📐', ano: 4 },
            habilidade: 'EF06MA05',
            dificuldade: 'DI',
            skillCode: '1.1.1.3',
            topico: 'Números irracionais na reta numérica',
            tipo: 'Quiz',
            origem: 'IA',
            autoria: 'Canoas',
            criador: 'MG',
            revisor: 'RF',
            data: '27/05/2025 12:00:42',
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            nivelDificuldade: 'Muito Difícil',
            ativo: true
        },
        {
            id: 2,
            codigo: { emoji: '📐', ano: 4 },
            habilidade: 'EF06MA05',
            dificuldade: 'DI',
            skillCode: '1.1.1.3',
            topico: 'Números irracionais na reta numérica',
            tipo: 'Quiz',
            origem: 'Humano',
            autoria: 'Canoas',
            criador: 'MG',
            revisor: 'RF',
            data: '27/05/2025 12:00:42',
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            nivelDificuldade: 'Muito Difícil',
            ativo: true
        },
        {
            id: 3,
            codigo: { emoji: '📐', ano: 4 },
            habilidade: 'EF06MA05',
            dificuldade: 'DI',
            skillCode: '1.1.1.3',
            topico: 'Números irracionais na reta numérica',
            tipo: 'Quiz',
            origem: 'IA',
            autoria: 'Canoas',
            criador: 'MG',
            revisor: 'RF',
            data: '27/05/2025 12:00:42',
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            nivelDificuldade: 'Muito Difícil',
            ativo: true
        },
        {
            id: 4,
            codigo: { emoji: '📐', ano: 4 },
            habilidade: 'EF06MA05',
            dificuldade: 'DI',
            skillCode: '1.1.1.3',
            topico: 'Números irracionais na reta numérica',
            tipo: 'Quiz',
            origem: 'Humano',
            autoria: 'Canoas',
            criador: 'MG',
            revisor: 'RF',
            data: '27/05/2025 12:00:42',
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            nivelDificuldade: 'Muito Difícil',
            ativo: false
        },
        {
            id: 5,
            codigo: { emoji: '📚', ano: 5 },
            habilidade: 'EF05LP10',
            dificuldade: 'FA',
            skillCode: '2.3.1.5',
            topico: 'Interpretação textual',
            tipo: 'Dissertativa',
            origem: 'IA',
            autoria: 'Porto Alegre',
            criador: 'AB',
            revisor: 'CD',
            data: '26/05/2025 10:30:15',
            areaConhecimento: 'Língua Portuguesa',
            anoEscolar: '5º ano',
            nivelDificuldade: 'Fácil',
            ativo: true
        },
        {
            id: 6,
            codigo: { emoji: '🔬', ano: 7 },
            habilidade: 'EF07CI04',
            dificuldade: 'ME',
            skillCode: '3.2.4.1',
            topico: 'Sistema digestório',
            tipo: 'Quiz',
            origem: 'Humano',
            autoria: 'Curitiba',
            criador: 'EF',
            revisor: 'GH',
            data: '25/05/2025 14:20:30',
            areaConhecimento: 'Ciências',
            anoEscolar: '7º ano',
            nivelDificuldade: 'Médio',
            ativo: true
        }
    ];

    // Estado dos filtros
    let filtrosAtivos = {
        areaConhecimento: 'Todas',
        anoEscolar: 'Todos',
        tipo: 'Todos',
        nivelDificuldade: 'Todos',
        origem: 'Todas',
        habilidade: 'Todas',
        topico: 'Todos',
        autoria: 'Todas',
        pesquisa: '',
        ativas: true,
        inativas: true
    };

    // ============================================
    // 2. INICIALIZAÇÃO
    // ============================================

    inicializarTabs();
    inicializarFiltros();
    inicializarSwitches();
    inicializarTabela();
    inicializarPaginacao();
    renderizarTabela(questoesMock);

    // ============================================
    // 3. TABS
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
        console.log('🔧 Inicializando filtros...');

        // Configuração dos filtros com suas opções
        const filtrosConfig = {
            'Área de Conhecimento': {
                propriedade: 'areaConhecimento',
                opcoes: ['Todas', 'Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia']
            },
            'Ano Escolar adequado*': {
                propriedade: 'anoEscolar',
                opcoes: ['Todos', '1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano']
            },
            'Tipo de questão': {
                propriedade: 'tipo',
                opcoes: ['Todos', 'Quiz', 'Dissertativa', 'Múltipla Escolha']
            },
            'Nível de dificuldade': {
                propriedade: 'nivelDificuldade',
                opcoes: ['Todos', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil']
            },
            'Origem da Questão': {
                propriedade: 'origem',
                opcoes: ['Todas', 'IA', 'Humano']
            }
        };

        const selects = document.querySelectorAll('.filter-group');
        console.log(`📦 Encontrados ${selects.length} filter-groups`);

        selects.forEach((filterGroup, index) => {
            const label = filterGroup.querySelector('.filter-label');
            const selectWrapper = filterGroup.querySelector('.select-wrapper');
            const badgeSelect = filterGroup.querySelector('.badge-select');

            if (!label || !selectWrapper || !badgeSelect) {
                console.warn(`⚠️ Filter group ${index} incompleto`, { label: !!label, selectWrapper: !!selectWrapper, badgeSelect: !!badgeSelect });
                return;
            }

            const labelText = label.textContent.trim();
            const config = filtrosConfig[labelText];

            if (!config) {
                console.warn(`⚠️ Config não encontrada para: "${labelText}"`);
                return;
            }

            console.log(`✅ Criando dropdown para: ${labelText}`);

            // Criar dropdown
            const dropdown = criarDropdown(config.opcoes, badgeSelect, config.propriedade);
            selectWrapper.appendChild(dropdown);

            // Toggle dropdown
            selectWrapper.addEventListener('click', function (e) {
                e.stopPropagation();
                console.log(`🖱️ Filtro clicado: ${labelText}`);

                // Fechar outros dropdowns
                document.querySelectorAll('.filter-dropdown.active').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });

                dropdown.classList.toggle('active');
                console.log(`📋 Dropdown ${dropdown.classList.contains('active') ? 'aberto' : 'fechado'}`);
            });
        });

        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', function () {
            document.querySelectorAll('.filter-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
        });

        // Barra de pesquisa
        const searchInput = document.querySelector('.search-input input');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                filtrosAtivos.pesquisa = e.target.value.toLowerCase();
                aplicarFiltros();
            });
        }

        console.log('✅ Filtros inicializados com sucesso!');
    }

    function criarDropdown(opcoes, badgeSelect, propriedade) {
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';

        console.log(`📝 Criando dropdown com ${opcoes.length} opções para ${propriedade}`);

        opcoes.forEach(opcao => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = opcao;

            item.addEventListener('click', function (e) {
                e.stopPropagation();

                console.log(`✅ Opção selecionada: ${propriedade} = ${opcao}`);

                // Atualizar badge visual
                const badge = badgeSelect.querySelector('.badge');
                if (badge) {
                    badge.textContent = opcao;
                    console.log(`🏷️ Badge atualizado para: ${opcao}`);
                } else {
                    console.warn('⚠️ Badge não encontrado!');
                }

                // Atualizar filtro ativo
                filtrosAtivos[propriedade] = opcao;

                // Aplicar filtros
                aplicarFiltros();

                // Fechar dropdown
                dropdown.classList.remove('active');
            });

            dropdown.appendChild(item);
        });

        return dropdown;
    }

    function aplicarFiltros() {
        let questoesFiltradas = [...questoesMock];

        // Filtro de Área de Conhecimento
        if (filtrosAtivos.areaConhecimento !== 'Todas') {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.areaConhecimento === filtrosAtivos.areaConhecimento
            );
        }

        // Filtro de Ano Escolar
        if (filtrosAtivos.anoEscolar !== 'Todos') {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.anoEscolar === filtrosAtivos.anoEscolar
            );
        }

        // Filtro de Tipo
        if (filtrosAtivos.tipo !== 'Todos') {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.tipo === filtrosAtivos.tipo
            );
        }

        // Filtro de Nível de Dificuldade
        if (filtrosAtivos.nivelDificuldade !== 'Todos') {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.nivelDificuldade === filtrosAtivos.nivelDificuldade
            );
        }

        // Filtro de Origem
        if (filtrosAtivos.origem !== 'Todas') {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.origem === filtrosAtivos.origem
            );
        }

        // Filtro de Pesquisa
        if (filtrosAtivos.pesquisa) {
            questoesFiltradas = questoesFiltradas.filter(q =>
                q.topico.toLowerCase().includes(filtrosAtivos.pesquisa) ||
                q.habilidade.toLowerCase().includes(filtrosAtivos.pesquisa) ||
                q.skillCode.toLowerCase().includes(filtrosAtivos.pesquisa)
            );
        }

        // Filtro de Ativas/Inativas
        questoesFiltradas = questoesFiltradas.filter(q => {
            if (filtrosAtivos.ativas && filtrosAtivos.inativas) return true;
            if (filtrosAtivos.ativas) return q.ativo === true;
            if (filtrosAtivos.inativas) return q.ativo === false;
            return false;
        });

        // Renderizar tabela filtrada
        renderizarTabela(questoesFiltradas);
        atualizarContador(questoesFiltradas.length);

        console.log(`📊 ${questoesFiltradas.length} questões após filtros`);
    }

    // ============================================
    // 4. SWITCHES
    // ============================================

    function inicializarSwitches() {
        const switches = document.querySelectorAll('.switch-input');

        switches.forEach(switchInput => {
            switchInput.addEventListener('change', function () {
                const label = this.parentElement.nextElementSibling;
                const tipo = label ? label.textContent.trim() : '';

                if (tipo.includes('ativas')) {
                    filtrosAtivos.ativas = this.checked;
                } else if (tipo.includes('inativas')) {
                    filtrosAtivos.inativas = this.checked;
                }

                aplicarFiltros();

                console.log(`Switch ${tipo}: ${this.checked ? 'ATIVO' : 'INATIVO'}`);
            });
        });
    }

    // ============================================
    // 5. RENDERIZAÇÃO DA TABELA
    // ============================================

    function renderizarTabela(questoes) {
        const tbody = document.querySelector('.questions-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        questoes.forEach(questao => {
            const tr = document.createElement('tr');

            // Badge de origem
            const origemBadge = questao.origem === 'IA'
                ? `<span class="badge badge-ai">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" fill="currentColor"/>
                        </svg>
                        IA
                    </span>`
                : `<span class="badge badge-human">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Humano
                    </span>`;

            tr.innerHTML = `
                <td>
                    <div class="code-cell">
                        <div class="warning-icon">⚠️</div>
                        <span class="badge badge-teal-icon">${questao.codigo.emoji}</span>
                        <span class="year-badge">${questao.codigo.ano}</span>
                    </div>
                </td>
                <td>
                    <div class="badges-cell">
                        <span class="badge badge-habilidade">${questao.habilidade}</span>
                        <span class="badge badge-danger-small">${questao.dificuldade}</span>
                    </div>
                    <div class="skill-code">${questao.skillCode}</div>
                </td>
                <td class="topic-cell">${questao.topico}</td>
                <td><span class="badge badge-cyan">${questao.tipo}</span></td>
                <td>${origemBadge}</td>
                <td class="author-cell">${questao.autoria}</td>
                <td>
                    <div class="avatar avatar-purple">${questao.criador}</div>
                </td>
                <td>
                    <div class="avatar avatar-purple">${questao.revisor}</div>
                </td>
                <td class="date-cell">${questao.data}</td>
                <td>
                    <button class="btn-icon" data-id="${questao.id}">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7Z" stroke="#6E6B7B" stroke-width="1.5" />
                            <path d="M10 3C15 3 18 10 18 10C18 10 15 17 10 17C5 17 2 10 2 10C2 10 5 3 10 3Z" stroke="#6E6B7B" stroke-width="1.5" />
                        </svg>
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Reinicializar eventos da tabela
        reinicializarEventosTabela();
    }

    function reinicializarEventosTabela() {
        // Botões de visualizar
        const btnVisualizar = document.querySelectorAll('.btn-icon');
        btnVisualizar.forEach(btn => {
            btn.addEventListener('click', function () {
                const questaoId = this.dataset.id;
                const questao = questoesMock.find(q => q.id === parseInt(questaoId));

                if (questao) {
                    console.log(`Visualizar questão:`, questao);
                    alert(`Visualizando questão:\n\nTópico: ${questao.topico}\nHabilidade: ${questao.habilidade}\nOrigem: ${questao.origem}`);
                }
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
    // 6. TABELA (FUNÇÃO ANTIGA - MANTIDA PARA COMPATIBILIDADE)
    // ============================================

    function inicializarTabela() {
        // ============================================
        // 6. TABELA (FUNÇÃO ANTIGA - MANTIDA PARA COMPATIBILIDADE)
        // ============================================

        function inicializarTabela() {
            // Esta função agora é tratada por renderizarTabela()
            // Mantida para não quebrar a inicialização
            console.log('Tabela inicializada via renderizarTabela()');
        }

        // ============================================
        // 7. PAGINAÇÃO
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

        // ============================================
        // 10. SIMULAÇÃO AUTOMÁTICA DE FILTROS
        // ============================================

        // Adicionar botão de simulação
        function adicionarBotaoSimulacao() {
            const pageHeader = document.querySelector('.page-header');
            if (!pageHeader) return;

            const btnSimular = document.createElement('button');
            btnSimular.className = 'btn-outline-primary';
            btnSimular.id = 'btnSimular';
            btnSimular.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" fill="currentColor"/>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Simular Filtros</span>
        `;
            btnSimular.style.marginLeft = 'auto';

            btnSimular.addEventListener('click', iniciarSimulacao);
            pageHeader.appendChild(btnSimular);

            // Adicionar badge de atalho
            const atalho = document.createElement('span');
            atalho.className = 'atalho-badge';
            atalho.textContent = 'Ctrl+S';
            btnSimular.appendChild(atalho);
        }

        let simulacaoAtiva = false;
        let timeoutSimulacao;

        function iniciarSimulacao() {
            if (simulacaoAtiva) {
                pararSimulacao();
                return;
            }

            simulacaoAtiva = true;
            const btnSimular = document.getElementById('btnSimular');
            if (btnSimular) {
                btnSimular.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                </svg>
                <span>Pausar</span>
            `;
            }

            console.log('🎬 INICIANDO SIMULAÇÃO AUTOMÁTICA DE FILTROS');
            mostrarNotificacao('🎬 Simulação iniciada! Acompanhe no console (F12)');

            const sequencia = [
                {
                    delay: 1000,
                    acao: () => {
                        console.log('📌 Passo 1/9: Mostrando todas as questões (6 total)');
                        mostrarNotificacao('📌 Passo 1/9: Todas as questões');
                        destacarFiltro('Origem da Questão', 'Todas');
                    }
                },
                {
                    delay: 3000,
                    acao: () => {
                        console.log('📌 Passo 2/9: Filtrando apenas questões de IA');
                        mostrarNotificacao('📌 Passo 2/9: Apenas IA → 3 questões');
                        simularSelecaoFiltro('origem', 'IA', 'Origem da Questão');
                    }
                },
                {
                    delay: 6000,
                    acao: () => {
                        console.log('📌 Passo 3/9: Filtrando apenas questões Humanas');
                        mostrarNotificacao('📌 Passo 3/9: Apenas Humano → 3 questões');
                        simularSelecaoFiltro('origem', 'Humano', 'Origem da Questão');
                    }
                },
                {
                    delay: 9000,
                    acao: () => {
                        console.log('📌 Passo 4/9: Voltando para Todas');
                        mostrarNotificacao('📌 Passo 4/9: Todas → 6 questões');
                        simularSelecaoFiltro('origem', 'Todas', 'Origem da Questão');
                    }
                },
                {
                    delay: 12000,
                    acao: () => {
                        console.log('📌 Passo 5/9: Filtrando por Área - Matemática');
                        mostrarNotificacao('📌 Passo 5/9: Matemática → 4 questões');
                        simularSelecaoFiltro('areaConhecimento', 'Matemática', 'Área de Conhecimento');
                    }
                },
                {
                    delay: 15000,
                    acao: () => {
                        console.log('📌 Passo 6/9: Combinando Matemática + IA');
                        mostrarNotificacao('📌 Passo 6/9: Matemática + IA → 2 questões');
                        simularSelecaoFiltro('origem', 'IA', 'Origem da Questão');
                    }
                },
                {
                    delay: 18000,
                    acao: () => {
                        console.log('📌 Passo 7/9: Testando busca - "digestório"');
                        mostrarNotificacao('📌 Passo 7/9: Busca "digestório" → 1 questão');
                        simularPesquisa('digestório');
                    }
                },
                {
                    delay: 21000,
                    acao: () => {
                        console.log('📌 Passo 8/9: Limpando busca');
                        mostrarNotificacao('📌 Passo 8/9: Limpando busca');
                        simularPesquisa('');
                    }
                },
                {
                    delay: 24000,
                    acao: () => {
                        console.log('📌 Passo 9/9: Resetando todos os filtros');
                        mostrarNotificacao('📌 Passo 9/9: Resetando filtros');
                        resetarFiltros();
                    }
                },
                {
                    delay: 27000,
                    acao: () => {
                        console.log('✅ SIMULAÇÃO CONCLUÍDA!');
                        mostrarNotificacao('✅ Simulação concluída!', 'success');
                        pararSimulacao();
                    }
                }
            ];

            sequencia.forEach(({ delay, acao }) => {
                timeoutSimulacao = setTimeout(acao, delay);
            });
        }

        function pararSimulacao() {
            simulacaoAtiva = false;
            clearTimeout(timeoutSimulacao);

            const btnSimular = document.getElementById('btnSimular');
            if (btnSimular) {
                btnSimular.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" fill="currentColor"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Simular Filtros</span>
            `;
                const atalho = document.createElement('span');
                atalho.className = 'atalho-badge';
                atalho.textContent = 'Ctrl+S';
                btnSimular.appendChild(atalho);
            }

            console.log('⏸️ Simulação pausada');
        }

        function mostrarNotificacao(mensagem, tipo = 'info') {
            // Remover notificação anterior
            const notificacaoAnterior = document.querySelector('.notificacao-simulacao');
            if (notificacaoAnterior) {
                notificacaoAnterior.remove();
            }

            // Criar nova notificação
            const notificacao = document.createElement('div');
            notificacao.className = `notificacao-simulacao ${tipo}`;
            notificacao.textContent = mensagem;

            document.body.appendChild(notificacao);

            // Animar entrada
            setTimeout(() => {
                notificacao.classList.add('show');
            }, 10);

            // Remover após 2.5 segundos
            setTimeout(() => {
                notificacao.classList.remove('show');
                setTimeout(() => {
                    notificacao.remove();
                }, 300);
            }, 2500);
        }

        function simularSelecaoFiltro(propriedade, valor, labelFiltro) {
            // Atualizar badge visual
            const filterGroups = document.querySelectorAll('.filter-group');
            filterGroups.forEach(group => {
                const label = group.querySelector('.filter-label');
                if (label && label.textContent.trim() === labelFiltro) {
                    const badge = group.querySelector('.badge');
                    if (badge) {
                        // Animação de destaque
                        group.style.transform = 'scale(1.05)';
                        group.style.transition = 'transform 0.3s ease';

                        setTimeout(() => {
                            badge.textContent = valor;
                            filtrosAtivos[propriedade] = valor;
                            aplicarFiltros();

                            setTimeout(() => {
                                group.style.transform = 'scale(1)';
                            }, 300);
                        }, 150);
                    }
                }
            });
        }

        function simularPesquisa(texto) {
            const searchInput = document.querySelector('.search-input input');
            if (searchInput) {
                // Animação de destaque
                searchInput.parentElement.style.transform = 'scale(1.05)';
                searchInput.parentElement.style.transition = 'transform 0.3s ease';

                setTimeout(() => {
                    searchInput.value = texto;
                    filtrosAtivos.pesquisa = texto.toLowerCase();
                    aplicarFiltros();

                    setTimeout(() => {
                        searchInput.parentElement.style.transform = 'scale(1)';
                    }, 300);
                }, 150);
            }
        }

        function destacarFiltro(labelFiltro, valor) {
            const filterGroups = document.querySelectorAll('.filter-group');
            filterGroups.forEach(group => {
                const label = group.querySelector('.filter-label');
                if (label && label.textContent.trim() === labelFiltro) {
                    group.style.boxShadow = '0 0 0 3px rgba(115, 103, 240, 0.3)';
                    group.style.transition = 'box-shadow 0.3s ease';

                    setTimeout(() => {
                        group.style.boxShadow = 'none';
                    }, 2000);
                }
            });
        }

        function resetarFiltros() {
            filtrosAtivos = {
                areaConhecimento: 'Todas',
                anoEscolar: 'Todos',
                tipo: 'Todos',
                nivelDificuldade: 'Todos',
                origem: 'Todas',
                habilidade: 'Todas',
                topico: 'Todos',
                autoria: 'Todas',
                pesquisa: '',
                ativas: true,
                inativas: true
            };

            // Resetar badges visuais
            document.querySelectorAll('.badge-select .badge').forEach((badge, index) => {
                const valores = ['Matemática', '6º ano', 'Quiz', 'Muito Difícil', 'Todas'];
                if (valores[index]) {
                    badge.textContent = valores[index];
                }
            });

            // Limpar busca
            const searchInput = document.querySelector('.search-input input');
            if (searchInput) searchInput.value = '';

            aplicarFiltros();
        }

        // Adicionar botão após carregamento
        adicionarBotaoSimulacao();

        // Adicionar atalho de teclado
        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                iniciarSimulacao();
            }
        });

        console.log('💡 Dica: Clique no botão "Simular Filtros" ou pressione Ctrl+S para ver uma demonstração automática!');

        // Executar inicialização
        inicializarFiltros();
    });
