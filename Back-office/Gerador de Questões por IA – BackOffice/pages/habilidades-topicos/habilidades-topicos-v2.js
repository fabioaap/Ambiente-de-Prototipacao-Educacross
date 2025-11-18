/**
 * HABILIDADES E TÓPICOS - JavaScript
 * Gerenciamento de tabs e redirecionamentos
 */

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Função para redirecionar para criar-questao-quiz.html com estado de habilidade
     * @param {string} habilidade - Nome da habilidade selecionada
     */
    function redirecionarParaNovaQuestaoIA(habilidade = null) {
        let url = '../../criar-questao-quiz.html'; // 2 níveis acima (pages/habilidades-topicos/ -> BackOffice)
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

    // Event listeners para botões IA na tabela (dinâmicos)
    // Usar event delegation para capturar clicks nos botões de IA
    document.addEventListener('click', function (e) {
        const btnIA = e.target.closest('.btn-ia-tabela');
        if (btnIA) {
            const habilidade = btnIA.dataset.habilidade;
            redirecionarParaNovaQuestaoIA(habilidade);
        }
    });

    // Gerenciamento de tabs (se necessário no futuro)
    const tabs = document.querySelectorAll('[data-role="tabs"] .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Adiciona active na tab clicada
            this.classList.add('active');

            // Esconde todos os conteúdos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            // Mostra o conteúdo correspondente
            const targetContent = document.getElementById(`tab-${tabName}`);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
});
