/**
 * MODO REGENERAÇÃO - Lógica separada para não afetar página original
 * Esta página SEMPRE tenta carregar contexto de erro do localStorage
 */

// ========================================
// VERIFICAR CONTEXTO DE REGENERAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Regeneração] Página de regeneração carregada');

    // Tentar carregar contexto do localStorage
    const contextoErroStr = localStorage.getItem('errosRegeneracao');

    if (!contextoErroStr) {
        console.warn('[Regeneração] Contexto não encontrado no localStorage');
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
    }

    // Limpar contexto após submissão
    const btnGerar = document.getElementById('btnGerar');
    if (btnGerar) {
        btnGerar.addEventListener('click', function () {
            localStorage.removeItem('errosRegeneracao');
            console.log('[Regeneração] Contexto de erro limpo após submissão');
        });
    }
});

// ========================================
// APLICAR CONTEXTO VISUAL DE ERRO
// ========================================
function aplicarContextoDeErro(contextoErro) {
    console.log('[Regeneração] Aplicando contexto visual de erro');
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
