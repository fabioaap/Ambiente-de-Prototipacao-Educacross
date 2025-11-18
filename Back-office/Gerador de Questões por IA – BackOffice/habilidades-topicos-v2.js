/**
 * Habilidades e Tópicos V2 - Lógica de Aplicação
 * Educacross - Back-office
 * VERSÃO: 2.0 - Pixel-perfect baseado no Figma
 */

// =========================
// DADOS FICTÍCIOS
// =========================
const dadosHabilidades = [
    {
        id: 1,
        titulo: 'Números',
        tematica: true,
        ia: 165,
        professor: 165,
        total: 330,
        filhos: [
            { codigo: 'EF01MA01', descricao: 'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação.', ia: 55, professor: 55, total: 110 },
            { codigo: 'EF01MA02', descricao: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.', ia: 35, professor: 35, total: 70 },
            { codigo: 'EF01MA03', descricao: 'Estimar e comparar quantidades de objetos de dois conjuntos (em torno de 20 elementos), por estimativa e/ou por correspondência (um a um, dois a dois) para indicar "tem mais", "tem menos" ou "tem a mesma quantidade".', ia: 40, professor: 40, total: 80 },
            { codigo: 'EF01MA04', descricao: 'Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos, em situações de seu interesse, como jogos, brincadeiras, materiais da sala de aula, entre outros.', ia: 35, professor: 35, total: 70 }
        ]
    },
    {
        id: 2,
        titulo: 'Geometria',
        tematica: true,
        ia: 229,
        professor: 229,
        total: 458,
        filhos: [
            { codigo: 'EF01MA11', descricao: 'Descrever a localização de pessoas e de objetos no espaço em relação à sua própria posição, utilizando termos como à direita, à esquerda, em frente, atrás.', ia: 75, professor: 75, total: 150 },
            { codigo: 'EF01MA12', descricao: 'Descrever a localização de pessoas e de objetos no espaço segundo um dado ponto de referência, compreendendo que, para a utilização de termos que se referem à posição, como direita, esquerda, em cima, embaixo, é necessário explicitar-se o referencial.', ia: 80, professor: 80, total: 160 },
            { codigo: 'EF01MA13', descricao: 'Relacionar figuras geométricas espaciais (cones, cilindros, esferas e blocos retangulares) a objetos familiares do mundo físico.', ia: 74, professor: 74, total: 148 }
        ]
    },
    {
        id: 3,
        titulo: 'Grandezas e Medidas',
        tematica: true,
        ia: 165,
        professor: 35,
        total: 200,
        filhos: [
            { codigo: 'EF01MA15', descricao: 'Comparar comprimentos, capacidades ou massas, utilizando termos como mais alto, mais baixo, mais comprido, mais curto, mais grosso, mais fino, mais largo, mais pesado, mais leve, cabe mais, cabe menos, entre outros, para ordenar objetos de uso quotidiano.', ia: 90, professor: 20, total: 110 },
            { codigo: 'EF01MA16', descricao: 'Relatar em linguagem verbal ou não verbal sequência de acontecimentos relativos a um dia, utilizando, quando possível, os horários dos eventos.', ia: 75, professor: 15, total: 90 }
        ]
    },
    {
        id: 4,
        titulo: 'Probabilidade e Estatística',
        tematica: true,
        ia: 0,
        professor: 0,
        total: 0,
        filhos: []
    },
    {
        id: 5,
        titulo: 'Álgebra',
        tematica: true,
        ia: 120,
        professor: 95,
        total: 215,
        filhos: []
    }
];

const dadosTopicos = [
    {
        id: 1,
        numero: '1',
        titulo: 'Análise linguística/semiótica - CIE',
        tipoBadge: 'tematica',
        ia: 40,
        professor: 135,
        total: 165,
        filhos: [
            {
                id: 2,
                numero: '1.1',
                titulo: 'Morfologia',
                tipoBadge: 'objeto',
                ia: 40,
                professor: 135,
                total: 45,
                filhos: [
                    {
                        id: 3,
                        numero: '1.1.1',
                        titulo: 'Substantivos',
                        tipoBadge: null,
                        ia: 40,
                        professor: 135,
                        total: 2,
                        filhos: []
                    }
                ]
            },
            {
                id: 4,
                numero: '1.2',
                titulo: 'Adjetivos e locução adjetivas',
                tipoBadge: null,
                ia: 40,
                professor: 135,
                total: 17,
                filhos: []
            }
        ]
    },
    {
        id: 5,
        numero: '2',
        titulo: 'Escrita - CIE',
        tipoBadge: 'tematica',
        ia: 320,
        professor: 138,
        total: 458,
        filhos: [
            {
                id: 6,
                numero: '2.1',
                titulo: 'Construção do texto',
                tipoBadge: 'objeto',
                ia: 160,
                professor: 68,
                total: 228,
                filhos: []
            },
            {
                id: 7,
                numero: '2.2',
                titulo: 'Estratégias de produção',
                tipoBadge: 'objeto',
                ia: 160,
                professor: 70,
                total: 230,
                filhos: []
            }
        ]
    }
];

// =========================
// ESTADO DA APLICAÇÃO
// =========================
const estado = {
    abaAtiva: 'habilidades',
    paginaAtual: 1,
    itensPorPagina: 5,
    itensExpandidos: new Set()
};

// =========================
// FUNÇÕES DE RENDERIZAÇÃO
// =========================

/**
 * Renderiza badge com ícone e número
 */
function renderizarBadge(icone, numero, classe = 'badge') {
    return `
        <span class="${classe}">
            <span class="icon" style="--icon: url('assets/icons/icon-${icone}.svg'); width: 16px; height: 16px;"></span>
            ${numero}
        </span>
    `;
}

/**
 * Renderiza linha da tabela de habilidades
 */
function renderizarLinhaHabilidade(item, nivel = 0) {
    const temFilhos = item.filhos && item.filhos.length > 0;
    const expandido = estado.itensExpandidos.has(item.id);
    const paddingLeft = nivel * 40;
    const ehLinhaFilha = nivel > 0;

    let html = `
        <div class="table-row ${ehLinhaFilha ? 'table-row-child' : ''}" data-id="${item.id}" style="padding-left: ${paddingLeft + 20}px;">
            <div class="table-row-expand ${expandido ? 'expanded' : ''}" ${temFilhos ? `onclick="toggleExpansao(${item.id})"` : ''}>
                <span class="icon" style="--icon: url('assets/icons/icon-keyboard-arrow-down.svg'); width: 24px; height: 24px;"></span>
            </div>
            
            <div class="table-row-number">${item.codigo || item.id}</div>
            
            <div class="table-row-content">
                <div class="${ehLinhaFilha ? 'table-row-description' : 'table-row-title'}">${item.titulo || item.descricao}</div>
                
                ${item.tematica ? '<span class="badge-tematica">Temática</span>' : ''}
                
                ${renderizarBadge('psychology', item.ia, 'badge-purple')}
                ${renderizarBadge('emoji-objects', item.professor, 'badge-purple')}
                ${renderizarBadge('quiz', item.total, 'badge-purple')}
            </div>
            
            ${ehLinhaFilha ? `
                <div class="table-row-actions">
                    <button class="action-btn" title="Adicionar questão">
                        <span class="icon" style="--icon: url('assets/icons/icon-add-circle.svg'); width: 24px; height: 24px;"></span>
                    </button>
                    <button class="action-btn btn-ia-tabela" title="Nova questão IA (Acordeon)">
                        <span class="icon" style="--icon: url('assets/icons/icon-psychology.svg'); width: 24px; height: 24px;"></span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    // Renderizar filhos se expandido
    if (temFilhos && expandido) {
        item.filhos.forEach(filho => {
            html += renderizarLinhaHabilidade(filho, nivel + 1);
        });
    }

    return html;
}

/**
 * Renderiza linha da tabela de tópicos
 * MESMO COMPORTAMENTO DA ABA HABILIDADES (acordeão com expansão)
 */
function renderizarLinhaTopico(item, nivel = 0) {
    const temFilhos = item.filhos && item.filhos.length > 0;
    const expandido = estado.itensExpandidos.has(item.id);
    const paddingLeft = nivel * 40;
    const ehLinhaFilha = nivel > 0;

    // Badge de tipo conforme Figma
    let badgeTipo = '';
    if (item.tipoBadge === 'tematica') {
        badgeTipo = '<span class="badge badge-pink">Temática</span>';
    } else if (item.tipoBadge === 'objeto') {
        badgeTipo = '<span class="badge badge-cyan">Objeto do Conhecimento</span>';
    }

    let html = `
        <div class="table-row ${ehLinhaFilha ? 'table-row-child' : ''}" data-id="${item.id}" style="padding-left: ${paddingLeft + 20}px;">
            <div class="table-row-expand ${expandido ? 'expanded' : ''}" ${temFilhos ? `onclick="toggleExpansao(${item.id})"` : ''}>
                <span class="icon" style="--icon: url('assets/icons/icon-keyboard-arrow-down.svg'); width: 24px; height: 24px;"></span>
            </div>
            
            <div class="table-row-number">${item.numero}</div>
                <div class="table-row-title">${item.titulo}</div>
                
                ${badgeTipo}
                
                ${renderizarBadge('psychology', item.ia, 'badge badge-purple')}
                ${renderizarBadge('emoji-objects', item.professor, 'badge badge-purple')}
                ${renderizarBadge('quiz', item.total, 'badge badge-purple')}
                
                ${!temFilhos ? `
                <div class="table-row-actions">
                    <button class="action-btn" title="Nova questão">
                        <span class="icon" style="--icon: url('assets/icons/icon-add-circle.svg'); width: 24px; height: 24px;"></span>
                    </button>
                    <button class="action-btn btn-ia-tabela" title="Nova questão IA" data-habilidade="${item.titulo}">
                        <span class="icon" style="--icon: url('assets/icons/icon-psychology.svg'); width: 24px; height: 24px;"></span>
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Renderizar filhos se expandido
    if (temFilhos && expandido) {
        item.filhos.forEach(filho => {
            html += renderizarLinhaTopico(filho, nivel + 1);
        });
    }

    return html;
}/**
 * Renderiza tabela completa
 */
function renderizarTabela() {
    const dados = estado.abaAtiva === 'habilidades' ? dadosHabilidades : dadosTopicos;
    const container = document.querySelector(`#tab-${estado.abaAtiva} [data-role="table-card"]`);

    if (!container) return;

    // Paginação
    const inicio = (estado.paginaAtual - 1) * estado.itensPorPagina;
    const fim = inicio + estado.itensPorPagina;
    const dadosPaginados = dados.slice(inicio, fim);

    let html = '';
    dadosPaginados.forEach(item => {
        if (estado.abaAtiva === 'habilidades') {
            html += renderizarLinhaHabilidade(item);
        } else {
            html += renderizarLinhaTopico(item);
        }
    });

    container.innerHTML = html;
}

/**
 * Renderiza controles de paginação
 */
function renderizarPaginacao() {
    const dados = estado.abaAtiva === 'habilidades' ? dadosHabilidades : dadosTopicos;
    const totalPaginas = Math.ceil(dados.length / estado.itensPorPagina);
    const container = document.querySelector(`#tab-${estado.abaAtiva} .pagination-controls`);

    if (!container) return;

    let html = `
        <button class="pagination-btn" onclick="mudarPagina(${estado.paginaAtual - 1})" ${estado.paginaAtual === 1 ? 'disabled' : ''}>
            <span class="icon" style="--icon: url('assets/icons/icon-chevron-left.svg'); width: 16px; height: 16px;"></span>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <button class="pagination-page ${i === estado.paginaAtual ? 'active' : ''}" onclick="mudarPagina(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="pagination-btn" onclick="mudarPagina(${estado.paginaAtual + 1})" ${estado.paginaAtual === totalPaginas ? 'disabled' : ''}>
            <span class="icon" style="--icon: url('assets/icons/icon-chevron-right.svg'); width: 16px; height: 16px;"></span>
        </button>
    `;

    container.innerHTML = html;
}

// =========================
// FUNÇÕES DE INTERAÇÃO
// =========================

/**
 * Toggle expansão de item
 */
function toggleExpansao(id) {
    if (estado.itensExpandidos.has(id)) {
        estado.itensExpandidos.delete(id);
    } else {
        estado.itensExpandidos.add(id);
    }
    renderizarTabela();
}

// Tornar função global para onclick HTML
window.toggleExpansao = toggleExpansao;
window.mudarPagina = mudarPagina;

/**
 * Mudar página
 */
function mudarPagina(novaPagina) {
    const dados = estado.abaAtiva === 'habilidades' ? dadosHabilidades : dadosTopicos;
    const totalPaginas = Math.ceil(dados.length / estado.itensPorPagina);

    if (novaPagina < 1 || novaPagina > totalPaginas) return;

    estado.paginaAtual = novaPagina;
    renderizarTabela();
    renderizarPaginacao();
}

/**
 * Trocar aba
 */
function trocarAba(nomeAba) {
    // Resetar estado
    estado.abaAtiva = nomeAba;
    estado.paginaAtual = 1;
    estado.itensExpandidos.clear();

    // Atualizar UI
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${nomeAba}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`tab-${nomeAba}`).style.display = 'block';

    // Renderizar conteúdo
    renderizarTabela();
    renderizarPaginacao();
}

document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // SISTEMA DE TOAST NOTIFICAÇÕES
    // =========================

    window.showToast = function (title, message, type = 'info', duration = 5000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.error('❌ Toast container não encontrado!');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Ícones por tipo
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <p class="toast-title">${title}</p>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Botão de fechar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(20px)';
                    toast.style.transition = 'all 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    };

    // =========================
    // INICIALIZAÇÃO
    // =========================

    // Event listeners para tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const nomeAba = e.target.dataset.tab;
            trocarAba(nomeAba);
        });
    });

    /**
     * Função para redirecionar para criar-questao-quiz.html com estado de habilidade
     * @param {string} habilidade - Nome da habilidade selecionada
     */
    function redirecionarParaNovaQuestaoIA(habilidade = null) {
        let url = 'criar-questao-quiz.html';
        if (habilidade) {
            url += '?habilidade=' + encodeURIComponent(habilidade);
        }
        window.location.href = url;
    }

    // Event listener para botão Nova Questão IA (header - Habilidades)
    const btnNovaQuestaoIA = document.getElementById('btnNovaQuestaoIA');
    if (btnNovaQuestaoIA) {
        btnNovaQuestaoIA.addEventListener('click', () => {
            const filterAreaText = document.getElementById('filterAreaTextHabilidades')?.textContent || '';
            redirecionarParaNovaQuestaoIA(filterAreaText);
        });
    }

    // Event listener para botão Nova Questão IA (header - Tópicos)
    const btnNovaQuestaoIATopicos = document.getElementById('btnNovaQuestaoIATopicos');
    if (btnNovaQuestaoIATopicos) {
        btnNovaQuestaoIATopicos.addEventListener('click', () => {
            const filterAreaText = document.getElementById('filterAreaTextTopicos')?.textContent || '';
            redirecionarParaNovaQuestaoIA(filterAreaText);
        });
    }

    // Event listeners para badges psychology (stats-bar)
    document.addEventListener('click', function (e) {
        const badgeClicavel = e.target.closest('.badge-clicavel[data-acao="nova-questao-ia"]');
        if (badgeClicavel) {
            // Determinar qual aba está ativa e pegar a habilidade correspondente
            const abaAtiva = document.querySelector('[data-role="tabs"] .tab.active')?.dataset.tab || 'habilidades';
            let habilidade = '';

            if (abaAtiva === 'habilidades') {
                habilidade = document.getElementById('filterAreaTextHabilidades')?.textContent || '';
            } else if (abaAtiva === 'topicos') {
                habilidade = document.getElementById('filterAreaTextTopicos')?.textContent || '';
            }

            redirecionarParaNovaQuestaoIA(habilidade);
        }
    });

    // Renderização inicial
    renderizarTabela();
    renderizarPaginacao();

    // Event listeners para botões IA na tabela (depois da renderização)
    // Usar event delegation para capturar clicks nos botões de IA
    document.querySelector(`#tab-${estado.abaAtiva} [data-role="table-card"]`)?.addEventListener('click', function (e) {
        const btnIA = e.target.closest('.btn-ia-tabela');
        if (btnIA) {
            // Prioriza data-habilidade (usado em Tópicos). Se ausente, usa estado B (filtro de Habilidades/Tópicos)
            const habilidade = btnIA.dataset.habilidade
                || document.getElementById('filterAreaTextHabilidades')?.textContent
                || document.getElementById('filterAreaTextTopicos')?.textContent
                || '';
            redirecionarParaNovaQuestaoIA(habilidade);
        }
    });

    // DEBUG: Verificar se tudo foi carregado corretamente
    window.debugToast = function () {
        console.group('🔍 DEBUG TOAST SYSTEM');

        const container = document.getElementById('toastContainer');
        console.log('Container existe?', !!container);
        console.log('Container:', container);

        const btn = document.getElementById('btnNovaQuestaoIA');
        console.log('Botão existe?', !!btn);
        console.log('Botão:', btn);

        console.log('showToast é função?', typeof window.showToast === 'function');

        if (container && typeof window.showToast === 'function') {
            console.log('✅ TUDO OK - Testando...');
            window.showToast('Teste de Debug', 'Sistema funcionando!', 'success');
        } else {
            console.error('❌ PROBLEMA: Container ou showToast não disponível');
        }

        console.groupEnd();
    };

    // Executar debug automaticamente
    window.debugToast();
});
