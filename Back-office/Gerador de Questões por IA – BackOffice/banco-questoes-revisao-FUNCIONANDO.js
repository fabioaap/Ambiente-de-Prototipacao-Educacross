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
    // BOTÃO: NOVA QUESTÃO
    // ============================================
    function inicializarBtnNovaQuestao() {
        const btn = document.getElementById('btnNovaQuestao');

        if (btn) {
            btn.addEventListener('click', () => {
                // Redirecionar para criar nova questão
                window.location.href = 'criar-questao-quiz.html';
            });
        }
    }

    // ============================================
    // DRAWER: PAINEL DE GERAÇÃO (IA)
    // ============================================

    function gerarDadosDrawer() {
        const tableBody = document.querySelector('.generations-table .table-body');
        if (!tableBody) {
            console.warn('[Drawer] table-body não encontrado');
            return;
        }

        // Áreas de conhecimento disponíveis
        const areas = ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia'];

        // Gerar data recente
        const hoje = new Date();
        const formatarData = (data) => {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        // Gerar 3 linhas com status diferentes
        const totalSolicitado = 1000;
        const errosTotal = Math.floor(Math.random() * 50) + 20; // 20-70 erros na linha de Erro

        const linhas = [
            {
                status: 'Andamento',
                area: areas[Math.floor(Math.random() * areas.length)],
                data: formatarData(hoje),
                progresso: Math.floor(Math.random() * 500) + 100, // 100-600 (em andamento)
                total: totalSolicitado,
                dados: null
            },
            {
                status: 'Concluído',
                area: areas[Math.floor(Math.random() * areas.length)],
                data: formatarData(new Date(hoje.getTime() - 86400000)), // ontem
                progresso: totalSolicitado, // 1000/1000 sem erros
                total: totalSolicitado,
                dados: null
            },
            {
                status: 'Erro',
                area: areas[Math.floor(Math.random() * areas.length)],
                data: formatarData(new Date(hoje.getTime() - 172800000)), // 2 dias atrás
                progresso: totalSolicitado, // 1000/1000 CONCLUÍDO mas com erros
                total: totalSolicitado,
                dados: {
                    totalSolicitado: totalSolicitado,
                    sucessos: totalSolicitado - errosTotal, // Sucessos reais
                    erros: errosTotal // Erros que ocorreram
                }
            }
        ];        // Limpar e popular tabela
        tableBody.innerHTML = '';
        linhas.forEach(linha => {
            const row = document.createElement('div');
            row.className = 'table-row';

            // Armazenar dados na linha para usar no modal
            if (linha.dados) {
                row.dataset.totalSolicitado = linha.dados.totalSolicitado;
                row.dataset.sucessos = linha.dados.sucessos;
                row.dataset.erros = linha.dados.erros;
            }

            const statusClass = linha.status === 'Andamento' ? 'status-progress'
                : linha.status === 'Concluído' ? 'status-success'
                    : 'status-error';

            row.innerHTML = `
                <span class="cell-area">${linha.area}</span>
                <span class="cell-date">${linha.data}</span>
                <span class="cell-status">
                    <span class="status-badge ${statusClass}">${linha.status}</span>
                </span>
                <span class="cell-progress">${linha.progresso}/${linha.total}</span>
                <span class="cell-action">
                    ${linha.status === 'Erro' ? `
                        <button class="btn-view" aria-label="Visualizar detalhes">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" stroke="#7367F0" stroke-width="1.5" />
                                <path d="M12 5C17 5 20 12 20 12C20 12 17 19 12 19C7 19 4 12 4 12C4 12 7 5 12 5Z" stroke="#7367F0" stroke-width="1.5" />
                            </svg>
                        </button>
                    ` : ''}
                </span>
            `;

            tableBody.appendChild(row);
        });

        console.log('[Drawer] Dados gerados:', linhas.length, 'linhas');
    } function inicializarDrawerGeracaoIA() {
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
            drawer.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');
            console.log('[Drawer] Aberto');
            // Gerar dados dinâmicos do drawer
            gerarDadosDrawer();
            // Re-vincular eventos do modal após drawer abrir e DOM atualizar
            setTimeout(() => {
                console.log('[Drawer] Re-vinculando eventos do modal');
                inicializarModalErroGeracao();
            }, 150);
        }; const fechar = () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            drawer.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            console.log('[Drawer] Fechado');
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            abrir();
        });
        closeBtn.addEventListener('click', fechar);
        overlay.addEventListener('click', fechar);

        // Tecla ESC fecha o drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') fechar();
        });

        // Query param debug: ?abrirDrawer=1 abre automaticamente
        if (new URLSearchParams(window.location.search).get('abrirDrawer') === '1') {
            abrir();
        }
    }    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    aplicarFiltros(); // Renderizar todas as questões inicialmente
    inicializarFiltrosInterativos(); // Tornar filtros clicáveis
    inicializarBtnNovaQuestao(); // Ativar botão "Nova questão" com Toast
    const drawerAPI = inicializarDrawerGeracaoIA(); // Ativar drawer Painel de Geração (IA)
    inicializarModalErroGeracao(); // Ativar modal de dificuldades (apenas quando erro)

    // Expor API do drawer globalmente para re-vincular modal
    window.vincularEventosModal = () => {
        if (drawerAPI && drawerAPI.vincularEventosModal) {
            drawerAPI.vincularEventosModal();
        }
    };

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
        console.log('[Modal] mostrarModal() chamada');
        lastFocus = document.activeElement;
        overlay.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'false');
        // Garantir display flex mesmo se CSS mudar
        overlay.style.display = 'flex';
        modal.style.display = 'flex';
        console.log('[Modal] Overlay display:', window.getComputedStyle(overlay).display);
        console.log('[Modal] Modal display:', window.getComputedStyle(modal).display);
        console.log('[Modal] Overlay aria-hidden:', overlay.getAttribute('aria-hidden'));
        console.log('[Modal] Modal aria-hidden:', modal.getAttribute('aria-hidden'));
        // foco no primeiro elemento do modal
        closeBtn.focus();
    }

    function fecharModal() {
        overlay.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-hidden', 'true');
        overlay.style.display = 'none';
        modal.style.display = 'none';
        console.log('[Modal] Modal fechado');
        if (lastFocus) lastFocus.focus();
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            fecharModal();
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fecharModal();
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fecharModal();
    });

    overlay.addEventListener('click', (e) => {
        // Só fecha se clicar no overlay, não no conteúdo do modal
        if (e.target === overlay) {
            fecharModal();
        }
    });

    // Debug rápido: param ?abrirModal=1 força abrir
    if (new URLSearchParams(window.location.search).get('abrirModal') === '1') {
        mostrarModal();
    }

    // CTA já aponta para criar-questao-quiz.html; pode fechar o modal
    cta.addEventListener('click', () => {
        fecharModal();
    });

    // Abrir o modal apenas nos itens do drawer com status 'Erro'
    const drawer = document.getElementById('painelGeracaoDrawer');
    if (!drawer) return;

    const rows = drawer.querySelectorAll('.table-row');
    console.log('[Modal] Total de linhas no drawer para binding:', rows.length);
    let contadorLinhasErro = 0;
    rows.forEach(row => {
        const status = row.querySelector('.status-error') || row.querySelector('.status-badge.status-error');
        const btn = row.querySelector('.btn-view');
        if (status) {
            contadorLinhasErro++;
            console.log('[Modal] Vinculando click em linha com erro');
            const handler = (e) => {
                e.preventDefault();
                console.log('[Modal] Handler de erro acionado!');

                // Buscar dados da linha clicada
                const linhaClicada = e.currentTarget.closest('.table-row');
                const totalSolicitado = parseInt(linhaClicada?.dataset.totalSolicitado || '1000');
                const sucessos = parseInt(linhaClicada?.dataset.sucessos || '980');
                const errosTotal = parseInt(linhaClicada?.dataset.erros || '20');

                console.log('[Modal] Dados da linha:', { totalSolicitado, sucessos, errosTotal });

                // Gerar simulação baseada nos dados da linha
                let resumo = null;

                // SEMPRE gerar nova simulação com os dados da linha clicada                // SEMPRE gerar nova simulação com os dados da linha clicada
                if (true) {
                    // SIMULAÇÃO baseada nos dados reais da linha do drawer
                    // Ordem de armazenamento: [muitoFácil, fácil, médio, difícil, muitoDifícil]
                    const pesos = Array.from({ length: 5 }, () => 0.5 + Math.random());
                    const somaPesos = pesos.reduce((a, b) => a + b, 0);
                    let requested = pesos.map(p => Math.round((p / somaPesos) * totalSolicitado));
                    // Ajustar diferença para garantir soma exata
                    let ajuste = totalSolicitado - requested.reduce((a, b) => a + b, 0);
                    if (ajuste !== 0) {
                        requested[0] += ajuste;
                    }

                    // Distribuir erros entre 2-4 dificuldades
                    const indicesAfetadosCount = Math.min(5, 2 + Math.floor(Math.random() * 3)); // 2 a 4 dificuldades com erro
                    const indicesDisponiveis = [0, 1, 2, 3, 4];
                    const indicesAfetados = [];
                    while (indicesAfetados.length < indicesAfetadosCount) {
                        const i = indicesDisponiveis.splice(Math.floor(Math.random() * indicesDisponiveis.length), 1)[0];
                        indicesAfetados.push(i);
                    }
                    let errosRestantes = errosTotal;
                    const errors = [0, 0, 0, 0, 0];
                    indicesAfetados.forEach((idx, pos) => {
                        if (pos === indicesAfetados.length - 1) {
                            errors[idx] = errosRestantes; // último recebe o restante
                        } else {
                            const maxDistribuivel = errosRestantes - ((indicesAfetados.length - pos - 1));
                            const val = 1 + Math.floor(Math.random() * Math.max(1, maxDistribuivel - 1));
                            errors[idx] = val;
                            errosRestantes -= val;
                        }
                    });
                    const success = requested.map((q, i) => q - errors[i]);
                    resumo = {
                        requestedPerDifficulty: requested,
                        successPerDifficulty: success,
                        errorPerDifficulty: errors,
                        total: totalSolicitado,
                        success: sucessos,
                        error: errosTotal
                    };
                    localStorage.setItem('geracaoResumo', JSON.stringify(resumo));
                    console.log('[Modal] Simulação criada baseada na linha (total:', totalSolicitado, 'erros:', errosTotal, '):', resumo);
                } else {
                    console.log('[Modal] Usando resumo existente:', resumo);
                }

                // Ordem exibida no modal: Muito difícil, Difícil, Médio, Fácil, Muito Fácil
                // Nosso armazenamento está em: [muitoFácil, fácil, médio, difícil, muitoDifícil]
                const indexMap = [4, 3, 2, 1, 0];
                const errorPerDifficulty = resumo && Array.isArray(resumo.errorPerDifficulty)
                    ? indexMap.map(i => resumo.errorPerDifficulty[i])
                    : [0, 0, 0, 0, 0];
                const requestedOrdered = resumo && Array.isArray(resumo.requestedPerDifficulty)
                    ? indexMap.map(i => resumo.requestedPerDifficulty[i])
                    : [0, 0, 0, 0, 0];
                const successOrdered = resumo && Array.isArray(resumo.successPerDifficulty)
                    ? indexMap.map(i => resumo.successPerDifficulty[i])
                    : [0, 0, 0, 0, 0];
                const errorTotal = errorPerDifficulty.reduce((a, b) => a + b, 0);
                console.log('[Modal] errorPerDifficulty:', errorPerDifficulty);
                console.log('[Modal] errorTotal:', errorTotal);

                // Gerar dinamicamente apenas as dificuldades com erro
                const nomesExibicao = ['Muito difícil', 'Difícil', 'Médio', 'Fácil', 'Muito Fácil'];
                const tbody = modal.querySelector('.modal-table tbody');
                console.log('[Modal] tbody encontrado:', !!tbody);

                if (tbody) {
                    tbody.innerHTML = '';
                    const dificuldadesComErro = nomesExibicao.filter((_, idx) => errorPerDifficulty[idx] > 0);
                    console.log('[Modal] dificuldadesComErro:', dificuldadesComErro);

                    if (dificuldadesComErro.length === 0) {
                        console.log('[Modal] Nenhuma dificuldade com erro');
                    } else {
                        dificuldadesComErro.forEach((nome, visibleIdx) => {
                            const originalIdx = nomesExibicao.indexOf(nome);
                            const errosValor = errorPerDifficulty[originalIdx];
                            console.log('[Modal] Criando linha:', nome, errosValor);
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${nome}</td>
                                <td class="text-right"><span class="badge-erros">${errosValor}</span></td>
                            `;
                            tbody.appendChild(tr);
                        });
                        console.log('[Modal] Total de linhas criadas:', tbody.children.length);
                    }
                }

                // Atualiza subtítulo dinamicamente
                const subtitleEl = modal.querySelector('.modal-subtitle');
                if (subtitleEl) {
                    if (errorTotal > 0) {
                        subtitleEl.textContent = `${errorTotal} questões falharam na geração (de ${resumo.total}). Dificuldades afetadas:`;
                    } else {
                        subtitleEl.textContent = 'Todas as dificuldades foram geradas com sucesso.';
                    }
                }

                // ETAPA 1: Salvar contexto de erros no localStorage para regeneração
                if (errorTotal > 0) {
                    const dificuldadesComErro = [];
                    nomesExibicao.forEach((nome, idx) => {
                        if (errorPerDifficulty[idx] > 0) {
                            // Mapear de volta para o índice original [muitoFácil, fácil, médio, difícil, muitoDifícil]
                            const indiceOriginal = indexMap[idx];
                            dificuldadesComErro.push({
                                nome: nome,
                                quantidade: errorPerDifficulty[idx],
                                indice: indiceOriginal
                            });
                        }
                    });
                    const contextoErro = {
                        dificuldades: dificuldadesComErro,
                        totalErros: errorTotal,
                        totalSolicitado: resumo.total,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem('errosRegeneracao', JSON.stringify(contextoErro));
                    console.log('[Modal] Contexto de erro salvo:', contextoErro);

                    // Atualizar href do CTA para incluir parâmetro de regeneração
                    const ctaButton = modal.querySelector('[href*="criar-questao-quiz.html"]');
                    if (ctaButton) {
                        ctaButton.href = 'criar-questao-quiz-regeneracao.html';
                        console.log('[Modal] CTA atualizado para página de regeneração');
                    }
                }

                mostrarModal();
            };
            // Clique tanto no botão quanto na linha completa abre modal
            if (btn) btn.addEventListener('click', handler);
            row.addEventListener('click', handler);
        }
    });

    // Fallback: se não encontrar nenhuma linha com erro, permitir força via query ?forcarModalErro=1
    if (contadorLinhasErro === 0) {
        console.warn('[Modal] Nenhuma linha com status de erro encontrada no drawer.');
        if (new URLSearchParams(window.location.search).get('forcarModalErro') === '1') {
            // Simular rapidamente para exibição
            const eventoClickFake = new Event('click');
            // Cria simulação sem depender de linha
            let resumo = {
                requestedPerDifficulty: [200, 200, 200, 200, 200],
                successPerDifficulty: [198, 198, 198, 198, 198],
                errorPerDifficulty: [2, 2, 2, 2, 2],
                total: 1000,
                success: 990,
                error: 10
            };
            localStorage.setItem('geracaoResumo', JSON.stringify(resumo));
            // Reaproveita geração de interface usando parte da lógica
            // Ordem exibida no modal: Muito difícil, Difícil, Médio, Fácil, Muito Fácil
            const indexMap = [4, 3, 2, 1, 0];
            const errorPerDifficulty = indexMap.map(i => resumo.errorPerDifficulty[i]);
            const nomesExibicao = ['Muito difícil', 'Difícil', 'Médio', 'Fácil', 'Muito Fácil'];
            const tbody = modal.querySelector('.modal-table tbody');
            if (tbody) {
                tbody.innerHTML = '';
                nomesExibicao.forEach((nome, originalIdx) => {
                    if (errorPerDifficulty[originalIdx] > 0) {
                        const errosValor = errorPerDifficulty[originalIdx];
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${nome} <span class="badge-erros" aria-label="${errosValor} questões com erro">${errosValor} erro${errosValor > 1 ? 's' : ''}</span></td>`;
                        tbody.appendChild(tr);
                    }
                });
            }
            const subtitleEl = modal.querySelector('.modal-subtitle');
            if (subtitleEl) subtitleEl.textContent = `${resumo.error} questões falharam na geração (de ${resumo.total}). Dificuldades afetadas:`;
            mostrarModal();
        }
    }
}

// ========================
// ALERT: LOTE EM GERAÇÃO
// ========================

/**
 * Gerencia o alert de "Lote em geração"
 * Posição: top-right fixa
 * Ativação: Automática ao entrar na página
 */
const AlertLoteGeracao = {
    /**
     * Mostra o alert
     */
    show: function () {
        const alert = document.getElementById('alertLoteGeracao');
        if (alert) {
            alert.style.display = 'flex';
            alert.classList.remove('hide');
            console.log('[AlertLoteGeracao] Exibido');
        }
    },

    /**
     * Oculta o alert com animação
     */
    hide: function () {
        const alert = document.getElementById('alertLoteGeracao');
        if (alert) {
            alert.classList.add('hide');
            setTimeout(() => {
                alert.style.display = 'none';
            }, 300);
            console.log('[AlertLoteGeracao] Oculto');
        }
    },

    /**
     * Alterna visibilidade
     */
    toggle: function () {
        const alert = document.getElementById('alertLoteGeracao');
        if (alert && alert.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    },

    /**
     * Atualiza mensagem do alert
     */
    setMessage: function (title, message) {
        const titleEl = document.querySelector('.alert-lote-geracao__title');
        const messageEl = document.querySelector('.alert-lote-geracao__message');
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
    }
};

// Configurar botão de fechar
document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('closeAlertLote');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            AlertLoteGeracao.hide();
        });
    }

    // Mostrar alert automaticamente ao entrar na página
    setTimeout(() => {
        AlertLoteGeracao.show();
    }, 500);
});
