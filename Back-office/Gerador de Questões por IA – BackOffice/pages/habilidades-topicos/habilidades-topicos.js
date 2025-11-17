/**
 * Habilidades e Tópicos - Lógica de Aplicação
 * Educacross - Back-office
 */

// =========================
// DADOS FICTÍCIOS (iguais aos usados anteriormente)
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
        filhos: [
            { codigo: 'EF01MA09', descricao: 'Organizar e ordenar objetos familiares ou representações por figuras, por meio de atributos, tais como cor, forma e medida.', ia: 60, professor: 45, total: 105 },
            { codigo: 'EF01MA10', descricao: 'Descrever, após o reconhecimento e a explicitação de um padrão (ou regularidade), os elementos ausentes em sequências recursivas de números naturais, objetos ou figuras.', ia: 60, professor: 50, total: 110 }
        ]
    }
];

const dadosTopicos = [
    {
        id: 1,
        numero: '1',
        titulo: 'Análise linguística/semiótica - CIE',
        tematica: true,
        ia: 40,
        professor: 135,
        total: 165,
        filhos: [
            {
                numero: '1.1',
                titulo: 'Morfologia',
                objetoConhecimento: true,
                ia: 40,
                professor: 135,
                total: 45,
                filhos: [
                    { numero: '1.1.1', titulo: 'Substantivos', ia: 40, professor: 135, total: 2 },
                    { numero: '1.2', titulo: 'Adjetivos e locução adjetivas', ia: 40, professor: 135, total: 17 }
                ]
            }
        ]
    },
    {
        id: 2,
        numero: '2',
        titulo: 'Escrita - CIE',
        tematica: true,
        ia: 320,
        professor: 138,
        total: 458,
        filhos: []
    },
    {
        id: 3,
        numero: '3',
        titulo: 'Leitura - CIE',
        tematica: true,
        ia: 280,
        professor: 95,
        total: 375,
        filhos: [
            {
                numero: '3.1',
                titulo: 'Estratégias de leitura',
                objetoConhecimento: true,
                ia: 150,
                professor: 50,
                total: 200,
                filhos: [
                    { numero: '3.1.1', titulo: 'Localização de informações', ia: 80, professor: 25, total: 105 },
                    { numero: '3.1.2', titulo: 'Inferência', ia: 70, professor: 25, total: 95 }
                ]
            },
            {
                numero: '3.2',
                titulo: 'Compreensão textual',
                objetoConhecimento: true,
                ia: 130,
                professor: 45,
                total: 175,
                filhos: []
            }
        ]
    },
    {
        id: 4,
        numero: '4',
        titulo: 'Oralidade - CIE',
        tematica: true,
        ia: 90,
        professor: 60,
        total: 150,
        filhos: []
    },
    {
        id: 5,
        numero: '5',
        titulo: 'Produção textual',
        tematica: true,
        ia: 200,
        professor: 110,
        total: 310,
        filhos: [
            {
                numero: '5.1',
                titulo: 'Gêneros textuais',
                objetoConhecimento: true,
                ia: 120,
                professor: 70,
                total: 190,
                filhos: [
                    { numero: '5.1.1', titulo: 'Narrativos', ia: 60, professor: 35, total: 95 },
                    { numero: '5.1.2', titulo: 'Descritivos', ia: 35, professor: 20, total: 55 },
                    { numero: '5.1.3', titulo: 'Argumentativos', ia: 25, professor: 15, total: 40 }
                ]
            },
            {
                numero: '5.2',
                titulo: 'Coesão e coerência',
                objetoConhecimento: true,
                ia: 80,
                professor: 40,
                total: 120,
                filhos: []
            }
        ]
    }
];

// =========================
// ESTADO DA APLICAÇÃO
// =========================
let paginaAtualHabilidades = 1;
let paginaAtualTopicos = 1;
const itensPorPagina = 3;

// =========================
// FUNÇÕES DE RENDERIZAÇÃO
// =========================
function renderizarHabilidades(pagina) {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = dadosHabilidades.slice(inicio, fim);

    const tableCard = document.querySelector('#tab-habilidades [data-role="table-card"]');
    tableCard.innerHTML = '';

    dadosPagina.forEach(item => {
        // Row pai
        const rowPai = document.createElement('div');
        rowPai.className = 'table-row expandable';
        rowPai.dataset.itemId = item.id;

        rowPai.innerHTML = `
            <span class="table-expand-icon icon ${item.id === 1 ? 'rotate' : ''}"
                style="--icon: url('assets/icons/icon-keyboard-arrow-down.svg'); width: 24px; height: 24px;"></span>
            <div class="table-number indent-0">${item.id}</div>
            <div class="table-content gap-root" style="flex: 1;">
                <span class="table-title">${item.titulo}</span>
                ${item.tematica ? '<span class="badge pink">Temática</span>' : ''}
                <span class="badge">
                    <span class="icon" style="--icon: url('assets/icons/icon-psychology.svg'); width: 16px; height: 16px;"></span>
                    ${item.ia}
                </span>
                <span class="badge">
                    <span class="icon" style="--icon: url('assets/icons/icon-emoji-objects.svg'); width: 16px; height: 16px;"></span>
                    ${item.professor}
                </span>
                <span class="badge ${item.total === 0 ? 'warning' : ''}">
                    <span class="icon" style="--icon: url('assets/icons/icon-quiz.svg'); width: 16px; height: 16px;"></span>
                    ${item.total === 0 ? '0 questões' : item.total}
                </span>
            </div>
        `;

        // Toggle filhos
        const expandIcon = rowPai.querySelector('.table-expand-icon');
        if (expandIcon) {
            expandIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('rotate');
                const parentRow = this.closest('.table-row');
                const itemId = parentRow.dataset.itemId;
                const childRows = document.querySelectorAll(`#tab-habilidades [data-parent-id="${itemId}"]`);
                childRows.forEach(childRow => {
                    childRow.style.display = childRow.style.display === 'none' ? '' : 'none';
                });
            });
        }

        tableCard.appendChild(rowPai);

        // Rows filhos
        item.filhos.forEach(filho => {
            const rowFilho = document.createElement('div');
            rowFilho.className = 'table-row child bg-depth-1';
            rowFilho.dataset.parentId = item.id;
            rowFilho.style.display = item.id === 1 ? '' : 'none';

            rowFilho.innerHTML = `
                <span style="width: 24px; display: inline-block;"></span>
                <div class="table-number indent-1">${filho.codigo}</div>
                <div class="table-content gap-child" style="flex: 1;">
                    <span class="table-description">${filho.descricao}</span>
                    <div class="table-badges">
                        <span class="badge">
                            <span class="icon" style="--icon: url('assets/icons/icon-psychology.svg'); width: 16px; height: 16px;"></span>
                            ${filho.ia}
                        </span>
                        <span class="badge">
                            <span class="icon" style="--icon: url('assets/icons/icon-emoji-objects.svg'); width: 16px; height: 16px;"></span>
                            ${filho.professor}
                        </span>
                        <span class="badge">
                            <span class="icon" style="--icon: url('assets/icons/icon-quiz.svg'); width: 16px; height: 16px;"></span>
                            ${filho.total}
                        </span>
                    </div>
                    <div class="table-actions">
                        <span class="action-icon icon" style="--icon: url('assets/icons/icon-add-circle.svg');"></span>
                        <span class="action-icon icon" style="--icon: url('assets/icons/icon-psychology.svg');"></span>
                    </div>
                </div>
            `;
            tableCard.appendChild(rowFilho);
        });
    });

    // Atualizar paginação
    atualizarPaginacao('habilidades', pagina, Math.ceil(dadosHabilidades.length / itensPorPagina));
}

function renderizarTopicos(pagina) {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = dadosTopicos.slice(inicio, fim);

    const tableCard = document.querySelector('#tab-topicos [data-role="table-card"]');
    tableCard.innerHTML = '';

    function renderizarNivel(itens, nivel = 0, parentId = null) {
        itens.forEach(item => {
            const rowPai = document.createElement('div');
            rowPai.className = nivel > 0 ? 'table-row child' : 'table-row expandable';
            rowPai.dataset.itemId = item.id || item.numero;
            if (parentId) {
                rowPai.dataset.parentId = parentId;
                rowPai.style.display = 'none';
            }
            if (item.filhos && item.filhos.length > 0) {
                rowPai.classList.add('expandable');
            }

            rowPai.classList.add(`bg-depth-${Math.min(nivel, 2)}`);

            const hasChildren = item.filhos && item.filhos.length > 0;
            const gapClass = nivel === 0 ? 'gap-root' : 'gap-child';
            const mostrarAcoes = nivel === 2 && (!item.filhos || item.filhos.length === 0);

            rowPai.innerHTML = `
                ${hasChildren ? '<span class="table-expand-icon icon" style="--icon: url(\'assets/icons/icon-keyboard-arrow-down.svg\'); width: 24px; height: 24px;"></span>' : '<span style="width: 24px; display: inline-block;"></span>'}
                <div class="table-number indent-${nivel}">${item.numero}</div>
                <div class="table-content ${gapClass}" style="flex: 1;">
                    <span class="${nivel === 0 ? 'table-title' : 'table-description'}">${item.titulo}</span>
                    ${item.tematica ? '<span class="badge pink">Temática</span>' : ''}
                    ${item.objetoConhecimento ? '<span class="badge cyan">Objeto do Conhecimento</span>' : ''}
                    ${item.ia !== undefined ? `<span class="badge"><span class="icon" style="--icon: url('assets/icons/icon-psychology.svg'); width: 16px; height: 16px;"></span>${item.ia}</span>` : ''}
                    ${item.professor !== undefined ? `<span class="badge"><span class="icon" style="--icon: url('assets/icons/icon-emoji-objects.svg'); width: 16px; height: 16px;"></span>${item.professor}</span>` : ''}
                    <span class="badge">
                        <span class="icon" style="--icon: url('assets/icons/icon-quiz.svg'); width: 16px; height: 16px;"></span>
                        ${item.total}
                    </span>
                    ${mostrarAcoes ? '<div class="table-actions"><span class="action-icon icon" style="--icon: url(\'assets/icons/icon-add-circle.svg\');"></span><span class="action-icon icon" style="--icon: url(\'assets/icons/icon-psychology.svg\');"></span></div>' : ''}
                </div>
            `;

            if (hasChildren) {
                const expandIcon = rowPai.querySelector('.table-expand-icon');
                if (expandIcon) {
                    expandIcon.addEventListener('click', function (e) {
                        e.stopPropagation();
                        this.classList.toggle('rotate');
                        const parentRow = this.closest('.table-row');
                        const itemId = parentRow.dataset.itemId;
                        const childRows = document.querySelectorAll(`#tab-topicos [data-parent-id="${itemId}"]`);
                        childRows.forEach(childRow => {
                            childRow.style.display = childRow.style.display === 'none' ? '' : 'none';
                        });
                    });
                }
            }

            tableCard.appendChild(rowPai);

            if (item.filhos && item.filhos.length > 0) {
                renderizarNivel(item.filhos, nivel + 1, item.numero);
            }
        });
    }

    renderizarNivel(dadosPagina);
    atualizarPaginacao('topicos', pagina, Math.ceil(dadosTopicos.length / itensPorPagina));
}

function atualizarPaginacao(tipo, paginaAtual, totalPaginas) {
    const tab = tipo === 'habilidades' ? '#tab-habilidades' : '#tab-topicos';
    const paginationControls = document.querySelector(`${tab} .pagination-controls`);

    paginationControls.innerHTML = '';

    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'pagination-button';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.innerHTML = '<span class="icon" style="--icon: url(\'assets/icons/icon-chevron-left.svg\'); width: 16px; height: 16px;"></span>';
    btnAnterior.onclick = () => {
        if (tipo === 'habilidades') {
            paginaAtualHabilidades--;
            renderizarHabilidades(paginaAtualHabilidades);
        } else {
            paginaAtualTopicos--;
            renderizarTopicos(paginaAtualTopicos);
        }
    };
    paginationControls.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.className = `pagination-button ${i === paginaAtual ? 'active' : ''}`;
        btnPagina.textContent = i;
        btnPagina.onclick = () => {
            if (tipo === 'habilidades') {
                paginaAtualHabilidades = i;
                renderizarHabilidades(i);
            } else {
                paginaAtualTopicos = i;
                renderizarTopicos(i);
            }
        };
        paginationControls.appendChild(btnPagina);
    }

    const btnProximo = document.createElement('button');
    btnProximo.className = 'pagination-button';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.innerHTML = '<span class="icon" style="--icon: url(\'assets/icons/icon-chevron-right.svg\'); width: 16px; height: 16px;"></span>';
    btnProximo.onclick = () => {
        if (tipo === 'habilidades') {
            paginaAtualHabilidades++;
            renderizarHabilidades(paginaAtualHabilidades);
        } else {
            paginaAtualTopicos++;
            renderizarTopicos(paginaAtualTopicos);
        }
    };
    paginationControls.appendChild(btnProximo);
}

// =========================
// ALTERNÂNCIA DE ABAS
// =========================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const tabKey = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
        document.getElementById('tab-habilidades').style.display = tabKey === 'habilidades' ? '' : 'none';
        document.getElementById('tab-topicos').style.display = tabKey === 'topicos' ? '' : 'none';
    });
});

// =========================
// INICIALIZAÇÃO + NAVEGAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', function () {
    renderizarHabilidades(1);
    renderizarTopicos(1);

    // Navegação: Nova questão IA -> criar-questao-quiz.html
    const btnNovaIA = document.getElementById('btnNovaQuestaoIA');
    if (btnNovaIA) {
        btnNovaIA.addEventListener('click', () => {
            window.location.href = 'criar-questao-quiz.html';
        });
    }
});
