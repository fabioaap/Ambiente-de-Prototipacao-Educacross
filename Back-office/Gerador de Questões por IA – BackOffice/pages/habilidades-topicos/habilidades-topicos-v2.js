/**
 * HABILIDADES E TÓPICOS - JavaScript
 * Gerenciamento de tabs e redirecionamentos
 */

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Redireciona com habilidade/topico para a página de criação
     * @param {{habilidade?: string, topico?: string}} params
     */
    function redirecionarParaNovaQuestaoIA(params = {}) {
        const qs = new URLSearchParams();
        if (params.habilidade) qs.set('habilidade', params.habilidade);
        if (params.topico) qs.set('topico', params.topico);
        const url = '../../criar-questao-quiz.html' + (qs.toString() ? `?${qs.toString()}` : '');
        window.location.href = url;
    }

    // Event listener para botão Nova Questão IA (header - Habilidades)
    const btnNovaQuestaoIA = document.getElementById('btnNovaQuestaoIA');
    if (btnNovaQuestaoIA) {
        btnNovaQuestaoIA.addEventListener('click', () => {
            // Estado A: sem parâmetros
            redirecionarParaNovaQuestaoIA();
        });
    }

    // Event listener para botão Nova Questão IA (header - Tópicos)
    const btnNovaQuestaoIATopicos = document.getElementById('btnNovaQuestaoIATopicos');
    if (btnNovaQuestaoIATopicos) {
        btnNovaQuestaoIATopicos.addEventListener('click', () => {
            // Estado A: sem parâmetros
            redirecionarParaNovaQuestaoIA();
        });
    }

    // Removido: badges da stats-bar não são interativos

    // Event listeners para botões IA na tabela (dinâmicos)
    // Usar event delegation para capturar clicks nos botões de IA
    document.addEventListener('click', function (e) {
        const btnIA = e.target.closest('.btn-ia-tabela');
        if (btnIA) {
            const topico = btnIA.dataset.topico || document.getElementById('filterAreaTextTopicos')?.textContent || '';
            const habilidade = btnIA.dataset.habilidade || document.getElementById('filterAreaTextHabilidades')?.textContent || '';
            const aba = document.querySelector('[data-role="tabs"] .tab.active')?.dataset.tab || 'habilidades';
            if (aba === 'topicos' && topico) {
                redirecionarParaNovaQuestaoIA({ topico });
            } else if (habilidade) {
                redirecionarParaNovaQuestaoIA({ habilidade });
            } else if (topico) {
                redirecionarParaNovaQuestaoIA({ topico });
            }
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
