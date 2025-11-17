/**
 * HABILIDADES E TÓPICOS - JavaScript
 * Gerenciamento de tabs e redirecionamentos
 */

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
    // Botão "Nova questão IA" - Redirecionar para criar-questao-quiz.html
    const btnNovaQuestaoIA = document.getElementById('btnNovaQuestaoIA');
    if (btnNovaQuestaoIA) {
        btnNovaQuestaoIA.addEventListener('click', function () {
            // Redirecionar para a página de criar questão (2 níveis acima, depois criar-questao-quiz.html)
            window.location.href = '../../criar-questao-quiz.html';
        });
    }

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
