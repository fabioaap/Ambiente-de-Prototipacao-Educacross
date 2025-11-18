/**
 * Banco de Questões - Em Revisão
 * JavaScript FUNCIONAL com filtros simulados
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Banco de Questões carregado');

    // ============================================
    // TOAST PENDENTE (cross-page persistence)
    // ============================================
    const toastPendente = localStorage.getItem('toastPendente');
    if (toastPendente) {
        try {
            const data = JSON.parse(toastPendente);
            // Pequeno delay para garantir que a página carregou completamente
            setTimeout(() => {
                window.showToast(data.title, data.message, data.type, data.duration);
            }, 100);
            localStorage.removeItem('toastPendente');
        } catch (e) {
            console.error('❌ Erro ao processar toast pendente:', e);
        }
    }

    // ============================================
    // DADOS MOCKADOS
    // ============================================

    const questoesMock = [
        {
            id: 1,
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            tipo: 'Quiz',
            nivelDificuldade: 'Muito Difícil',
            origem: 'IA',
            autoria: 'Canoas',
            ativo: true
        },
        {
            id: 2,
            areaConhecimento: 'Matemática',
            anoEscolar: '6º ano',
            tipo: 'Quiz',
            nivelDificuldade: 'Muito Difícil',
            origem: 'Humano',
            autoria: 'Canoas',
            ativo: true
        },
        {
            id: 3,
            areaConhecimento: 'Língua Portuguesa',
            anoEscolar: '7º ano',
            tipo: 'Dissertativa',
            nivelDificuldade: 'Médio',
            origem: 'IA',
            autoria: 'Porto Alegre',
            ativo: true
        },
        {
            id: 4,
            areaConhecimento: 'Ciências',
            anoEscolar: '8º ano',
            tipo: 'Múltipla Escolha',
            nivelDificuldade: 'Fácil',
            origem: 'Humano',
            autoria: 'São Paulo',
            ativo: false
        },
        {
            id: 5,
            areaConhecimento: 'História',
            anoEscolar: '9º ano',
            tipo: 'Quiz',
            nivelDificuldade: 'Difícil',
            origem: 'IA',
            autoria: 'Rio de Janeiro',
            ativo: true
        },
        {
            id: 6,
            areaConhecimento: 'Geografia',
            anoEscolar: '5º ano',
            tipo: 'Dissertativa',
            nivelDificuldade: 'Médio',
            origem: 'Humano',
            autoria: 'Brasília',
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
        pesquisa: '',
        ativas: true,
        inativas: true
    };

    // ============================================
    // FUNÇÃO DE FILTRAGEM
    // ============================================

    function aplicarFiltros() {
        console.log('🔍 Aplicando filtros:', filtrosAtivos);

        let questoesFiltradas = questoesMock.filter(questao => {
            // Filtro de área
            if (filtrosAtivos.areaConhecimento !== 'Todas' &&
                questao.areaConhecimento !== filtrosAtivos.areaConhecimento) {
                return false;
            }

            // Filtro de ano
            if (filtrosAtivos.anoEscolar !== 'Todos' &&
                questao.anoEscolar !== filtrosAtivos.anoEscolar) {
                return false;
            }

            // Filtro de tipo
            if (filtrosAtivos.tipo !== 'Todos' &&
                questao.tipo !== filtrosAtivos.tipo) {
                return false;
            }

            // Filtro de dificuldade
            if (filtrosAtivos.nivelDificuldade !== 'Todos' &&
                questao.nivelDificuldade !== filtrosAtivos.nivelDificuldade) {
                return false;
            }

            // Filtro de origem
            if (filtrosAtivos.origem !== 'Todas' &&
                questao.origem !== filtrosAtivos.origem) {
                return false;
            }

            // Filtro de status (ativas/inativas)
            if (!filtrosAtivos.ativas && questao.ativo) return false;
            if (!filtrosAtivos.inativas && !questao.ativo) return false;

            return true;
        });

        console.log(`📊 ${questoesFiltradas.length} questões encontradas`);
        renderizarTabela(questoesFiltradas);
    }

    // ============================================
    // RENDERIZAR TABELA
    // ============================================

    function renderizarTabela(questoes) {
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        questoes.forEach(questao => {
            const row = document.createElement('tr');
            row.className = 'table-row';

            const badgeOrigem = questao.origem === 'IA'
                ? '<span class="badge-ai"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg> IA</span>'
                : '<span class="badge-human"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" stroke-width="2"/></svg> Humano</span>';

            row.innerHTML = `
                <td class="cell-area">${questao.areaConhecimento}</td>
                <td class="cell-ano">${questao.anoEscolar}</td>
                <td class="cell-tipo">${questao.tipo}</td>
                <td class="cell-origem">${badgeOrigem}</td>
                <td class="cell-autoria">${questao.autoria}</td>
                <td class="cell-status">
                    <span class="status-badge ${questao.ativo ? 'status-active' : 'status-inactive'}">
                        ${questao.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    // (Simulador removido a pedido - sem atalho ou botão extra)

    // ============================================
    // FILTROS INTERATIVOS (CLICÁVEIS)
    // ============================================

    function inicializarFiltrosInterativos() {
        console.log('🎮 Inicializando filtros interativos...');

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

        // Para cada filter-group, adicionar evento de clique
        const filterGroups = document.querySelectorAll('.filter-group');

        filterGroups.forEach((group, index) => {
            const label = group.querySelector('.filter-label');
            if (!label) return;

            const labelText = label.textContent.trim();
            const config = filtrosConfig[labelText];

            if (!config) return;

            const selectWrapper = group.querySelector('.select-wrapper');
            if (!selectWrapper) return;

            // Criar dropdown
            const dropdown = criarDropdown(config.opcoes, config.propriedade);
            selectWrapper.appendChild(dropdown);

            // Toggle dropdown ao clicar
            selectWrapper.addEventListener('click', function (e) {
                e.stopPropagation();

                // Fechar outros dropdowns
                document.querySelectorAll('.filter-dropdown.active').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });

                dropdown.classList.toggle('active');
            });
        });

        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', function () {
            document.querySelectorAll('.filter-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
        });

        console.log('✅ Filtros interativos prontos!');
    }

    function criarDropdown(opcoes, propriedade) {
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';

        opcoes.forEach(opcao => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = opcao;

            item.addEventListener('click', function (e) {
                e.stopPropagation();

                // Atualizar filtro
                filtrosAtivos[propriedade] = opcao;

                // Atualizar badge visual
                const group = this.closest('.filter-group');
                const badge = group.querySelector('.badge');
                const selectText = group.querySelector('.select-text-primary');
                const elemento = badge || selectText;

                if (elemento) {
                    elemento.textContent = opcao;
                }

                // Fechar dropdown
                dropdown.classList.remove('active');

                // Aplicar filtros
                aplicarFiltros();

                console.log(`✅ Filtro aplicado: ${propriedade} = ${opcao}`);
            });

            dropdown.appendChild(item);
        });

        return dropdown;
    }

    // ============================================
    // BOTÃO: NOVA QUESTÃO (com Toast)
    // ============================================
    function inicializarBtnNovaQuestao() {
        const btn = document.getElementById('btnNovaQuestao');

        if (btn) {
            btn.addEventListener('click', () => {
                // Mostrar notificação de geração em andamento
                if (window.showToast) {
                    window.showToast(
                        'Lote em Geração',
                        'Seu lote de questões está sendo gerado. Isso pode levar alguns momentos...',
                        'info',
                        5000
                    );
                }

                // Aguardar um tempo para o toast aparecer, depois redirecionar
                setTimeout(() => {
                    window.location.href = 'criar-questao-quiz.html';
                }, 500);
            });
        }
    }

    // ============================================
    // DRAWER: PAINEL DE GERAÇÃO (IA)
    // ============================================
    function inicializarDrawerGeracaoIA() {
        const btn = document.getElementById('btnPainelGeracao');
        const drawer = document.getElementById('painelGeracaoDrawer');
        const overlay = document.getElementById('drawerOverlay');
        const closeBtn = document.getElementById('closeDrawer');

        if (!btn || !drawer || !overlay || !closeBtn) {
            console.warn('Drawer IA: elementos não encontrados.');
            return;
        }

        const abrir = () => {
            drawer.classList.add('active');
            overlay.classList.add('active');
        };

        const fechar = () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        };

        btn.addEventListener('click', abrir);
        closeBtn.addEventListener('click', fechar);
        overlay.addEventListener('click', fechar);

        // Tecla ESC fecha o drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') fechar();
        });
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    aplicarFiltros(); // Renderizar todas as questões inicialmente
    inicializarFiltrosInterativos(); // Tornar filtros clicáveis
    inicializarBtnNovaQuestao(); // Ativar botão "Nova questão" com Toast
    inicializarDrawerGeracaoIA(); // Ativar drawer Painel de Geração (IA)
    inicializarModalErroGeracao(); // Ativar modal de dificuldades (apenas quando erro)
    console.log('🖱️ Clique nos filtros para filtrar manualmente!');
});

// ============================================
// MODAL: Detalhes de dificuldades com erro
// ============================================
function inicializarModalErroGeracao() {
    const modal = document.getElementById('modalDificuldades');
    const overlay = document.getElementById('modalDificuldadesOverlay');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('modalCancel');
    const cta = document.getElementById('modalCta');

    if (!modal || !overlay || !closeBtn || !cancelBtn || !cta) {
        console.warn('Modal Erro: elementos não encontrados');
        return;
    }

    let lastFocus = null;
    function mostrarModal() {
        lastFocus = document.activeElement;
        overlay.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'false');
        // foco no primeiro elemento do modal
        closeBtn.focus();
    }

    function fecharModal() {
        overlay.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocus) lastFocus.focus();
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });

    closeBtn.addEventListener('click', fecharModal);
    cancelBtn.addEventListener('click', fecharModal);
    overlay.addEventListener('click', fecharModal);

    // CTA já aponta para criar-questao-quiz.html; pode fechar o modal
    cta.addEventListener('click', () => {
        fecharModal();
    });

    // Abrir o modal apenas nos itens do drawer com status 'Erro'
    const drawer = document.getElementById('painelGeracaoDrawer');
    if (!drawer) return;

    const rows = drawer.querySelectorAll('.table-row');
    rows.forEach(row => {
        const status = row.querySelector('.status-error') || row.querySelector('.status-badge.status-error');
        const btn = row.querySelector('.btn-view');
        if (status && btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Preencher os valores estáticos (200) — se quiser, podemos calcular dinamicamente
                const counts = [200, 200, 200, 200, 200];
                const countCells = modal.querySelectorAll('.modal-table tbody .count');
                countCells.forEach((td, idx) => {
                    td.textContent = counts[idx] || '0';
                });
                mostrarModal();
            });
        }
    });
}
