/**
 * MODO REGENERAÇÃO - Lógica separada para não afetar página original
 * Esta página SEMPRE tenta carregar contexto de erro do localStorage
 */

// Prefill automático das seções "Habilidades" e "Tópico" (estado B do Figma)
if (!window.__habilidadeSelecionadaInicial) {
    window.__habilidadeSelecionadaInicial = {
        texto: 'BNCC 6º Ano - Números - EF06MA02',
        subtexto: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.'
    };
}

if (!window.__topicoSelecionadoInicial) {
    window.__topicoSelecionadoInicial = {
        titulo: '1.31.1.2 Período de uma dízima periódica',
        objeto: 'Dízimas Periódicas',
        tematica: 'Números'
    };
}

// ========================================
// VERIFICAR CONTEXTO DE REGENERAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Regeneração] Página de regeneração carregada');

    const contextoErroStr = localStorage.getItem('errosRegeneracao');
    if (!contextoErroStr) {
        console.warn('[Regeneração] Contexto não encontrado no localStorage');
        return;
    }

    try {
        const contextoErro = JSON.parse(contextoErroStr);
        console.log('[Regeneração] Contexto carregado:', contextoErro);
        setTimeout(() => aplicarContextoDeErro(contextoErro), 100);
    } catch (erro) {
        console.error('[Regeneração] Erro ao processar contexto:', erro);
    }

    const btnGerar = document.getElementById('btnGerar');
    if (btnGerar) {
        btnGerar.addEventListener('click', () => {
            localStorage.removeItem('errosRegeneracao');
            console.log('[Regeneração] Contexto de erro limpo após submissão');
        });
    }
});

// ========================================
// APLICAR CONTEXTO VISUAL DE ERRO
// ========================================
function aplicarContextoDeErro(contextoErro) {
    if (!contextoErro || !Array.isArray(contextoErro.dificuldades)) {
        console.warn('[Regeneração] Contexto inválido recebido:', contextoErro);
        return;
    }

    console.log('[Regeneração] Aplicando contexto visual de erro');

    const inputIds = ['muitoFacil', 'facil', 'medio', 'dificil', 'muitoDificil'];
    const camposComErro = [];

    contextoErro.dificuldades.forEach(dif => {
        const inputId = inputIds[dif.indice];
        if (!inputId) return;

        const input = document.getElementById(inputId);
        if (!input) return;

        input.classList.add('input-com-erro');
        input.value = dif.quantidade;
        camposComErro.push(input);

        const inputGroup = input.closest('.input-group');
        if (inputGroup) {
            const label = inputGroup.querySelector('.input-label');
            if (label && !label.querySelector('.badge-erro-input')) {
                const badge = document.createElement('span');
                badge.className = 'badge-erro-input';
                badge.textContent = `${dif.quantidade} erro${dif.quantidade > 1 ? 's' : ''}`;
                label.appendChild(badge);
            }
        }

        console.log(`[Regeneração] Campo ${inputId} marcado com erro:`, dif.quantidade);
    });

    // Listeners para limpar destaque assim que usuário corrigir valores
    inputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', function () {
            const valor = parseInt(this.value, 10) || 0;
            if (valor !== 0) return;

            this.classList.remove('input-com-erro');

            const inputGroup = this.closest('.input-group');
            if (inputGroup) {
                const label = inputGroup.querySelector('.input-label');
                if (label) {
                    const badge = label.querySelector('.badge-erro-input');
                    if (badge) badge.remove();
                }
            }

            console.log(`[Regeneração] Destaque removido de ${inputId}`);
        });
    });

    if (typeof validarFormulario === 'function') {
        validarFormulario();
    } else {
        const btnGerar = document.getElementById('btnGerar');
        if (btnGerar) {
            btnGerar.disabled = false;
            btnGerar.style.background = 'var(--primary)';
        }
    }

    const primeiroComErro = camposComErro[0];
    if (primeiroComErro) {
        setTimeout(() => {
            primeiroComErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}
