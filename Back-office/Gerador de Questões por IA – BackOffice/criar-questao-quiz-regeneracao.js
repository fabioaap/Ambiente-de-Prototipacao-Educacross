/**
 * MODO REGENERAÇÃO - Lógica separada para não afetar página original
 * Esta página SEMPRE tenta carregar contexto de erro do localStorage
 */

// ========================================
// ETAPA 2: VERIFICAR CONTEXTO DE REGENERAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Regeneração] Página de regeneração carregada');

    // Tentar carregar contexto do localStorage
    const contextoErroStr = localStorage.getItem('errosRegeneracao');

    if (!contextoErroStr) {
        console.warn('[Regeneração] Contexto não encontrado no localStorage');
        console.warn('[Regeneração] Esta página deve ser acessada através do modal de erro');

        // Mostrar mensagem ao usuário
        mostrarMensagemSemContexto();
        return;
    }

    try {
        const contextoErro = JSON.parse(contextoErroStr);
        console.log('[Regeneração] Contexto carregado:', contextoErro);

        // Aplicar contexto visual de erro após DOM estar pronto
        setTimeout(() => {
            aplicarContextoDeErro(contextoErro);
        }, 100);
    } catch (e) {
        console.error('[Regeneração] Erro ao processar contexto:', e);
        mostrarMensagemErro();
    }

    // ========================================
    // ETAPA 4: LIMPAR CONTEXTO APÓS SUBMISSÃO
    // ========================================
    const btnGerar = document.getElementById('btnGerar');
    if (btnGerar) {
        btnGerar.addEventListener('click', function () {
            localStorage.removeItem('errosRegeneracao');
            console.log('[Regeneração] Contexto de erro limpo após submissão');
        });
    }
});

// ========================================
// MENSAGEM QUANDO NÃO HÁ CONTEXTO
// ========================================
function mostrarMensagemSemContexto() {
    const main = document.querySelector('main');
    if (!main) return;

    const banner = document.createElement('div');
    banner.className = 'banner-erro-regeneracao';
    banner.style.background = '#e8f5ff';
    banner.style.borderColor = '#90c9ff';
    banner.innerHTML = `
        <svg class="banner-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="banner-content">
            <strong>Nenhum contexto de erro encontrado</strong>
            <p>Esta página deve ser acessada através do botão "Tentar Novamente" no modal de erro do Banco de Questões.</p>
            <p style="margin-top: 8px;"><a href="banco-questoes-revisao.html" style="color: #7367f0; text-decoration: underline;">← Voltar ao Banco de Questões</a></p>
        </div>
    `;

    const pageTitle = main.querySelector('.page-title');
    if (pageTitle) {
        main.insertBefore(banner, pageTitle);
    }
}

function mostrarMensagemErro() {
    const main = document.querySelector('main');
    if (!main) return;

    const banner = document.createElement('div');
    banner.className = 'banner-erro-regeneracao';
    banner.style.background = '#fff5f5';
    banner.style.borderColor = '#ffc9c9';
    banner.innerHTML = `
        <svg class="banner-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ea5455" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="banner-content">
            <strong>Erro ao processar contexto</strong>
            <p>Não foi possível carregar os dados de erro. Por favor, tente novamente.</p>
        </div>
    `;

    const pageTitle = main.querySelector('.page-title');
    if (pageTitle) {
        main.insertBefore(banner, pageTitle);
    }
}

// ========================================
// ETAPA 3: APLICAR CONTEXTO VISUAL DE ERRO
// ========================================
function aplicarContextoDeErro(contextoErro) {
    console.log('[Regeneração] Aplicando contexto visual de erro');

    // Criar banner de contexto
    const main = document.querySelector('main');
    if (!main) return;

    const banner = document.createElement('div');
    banner.className = 'banner-erro-regeneracao';
    banner.innerHTML = `
        <svg class="banner-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ff9f43" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="banner-content">
            <strong>Modo de Regeneração Ativado</strong>
            <p>Você está tentando gerar novamente <strong>${contextoErro.totalErros} questões que falharam</strong>. Os campos com erro estão destacados abaixo.</p>
        </div>
        <button class="banner-close" onclick="this.parentElement.remove()">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#6E6B7B" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    `;

    // Inserir banner ANTES da seção "Quantidades do lote"
    const pageSubtitle = main.querySelector('.page-subtitle');
    if (pageSubtitle) {
        main.insertBefore(banner, pageSubtitle);
        console.log('[Regeneração] Banner inserido antes de "Quantidades do lote"');
    } else {
        // Fallback: inserir antes do título da página
        const pageTitle = main.querySelector('.page-title');
        if (pageTitle) {
            main.insertBefore(banner, pageTitle);
            console.log('[Regeneração] Banner inserido antes do título (fallback)');
        }
    }

    // Mapear IDs dos inputs por índice: [muitoFácil, fácil, médio, difícil, muitoDifícil]
    const inputIds = ['muitoFacil', 'facil', 'medio', 'dificil', 'muitoDificil'];

    // Aplicar estado de erro nos campos afetados
    contextoErro.dificuldades.forEach(dif => {
        const inputId = inputIds[dif.indice];
        const input = document.getElementById(inputId);
        if (!input) return;

        // Adicionar classe de erro ao input
        input.classList.add('input-com-erro');

        // Pré-preencher com quantidade de erro
        input.value = dif.quantidade;

        // Criar badge de erro no label
        const inputGroup = input.closest('.input-group');
        if (inputGroup) {
            const label = inputGroup.querySelector('.input-label');
            if (label && !label.querySelector('.badge-erro-input')) {
                // Badge vermelha
                const badge = document.createElement('span');
                badge.className = 'badge-erro-input';
                badge.textContent = `${dif.quantidade} erro${dif.quantidade > 1 ? 's' : ''}`;
                badge.style.marginLeft = '6px';
                label.appendChild(badge);
            }
        }

        console.log(`[Regeneração] Campo ${inputId} marcado com erro:`, dif.quantidade);
    });

    // REMOVER DESTAQUE quando usuário deletar/zerar o valor
    inputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', function () {
            const valor = parseInt(this.value) || 0;

            if (valor === 0) {
                // Remover classe de erro
                this.classList.remove('input-com-erro');

                // Remover badge do label
                const inputGroup = this.closest('.input-group');
                if (inputGroup) {
                    const label = inputGroup.querySelector('.input-label');
                    if (label) {
                        const badge = label.querySelector('.badge-erro-input');
                        if (badge) badge.remove();
                    }
                }

                console.log(`[Regeneração] Destaque removido de ${inputId}`);
            }
        });
    });

    // Chamar validação do formulário (assumindo que existe na página principal)
    if (typeof validarFormulario === 'function') {
        validarFormulario();
    } else {
        // Fallback: habilitar botão manualmente
        const btnGerar = document.getElementById('btnGerar');
        if (btnGerar) {
            btnGerar.disabled = false;
            btnGerar.style.background = 'var(--primary)';
        }
    }

    // Scroll suave para o primeiro campo com erro
    const primeiroComErro = document.querySelector('.input-com-erro');
    if (primeiroComErro) {
        setTimeout(() => {
            primeiroComErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}
