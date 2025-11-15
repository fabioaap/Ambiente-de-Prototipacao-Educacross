/**
 * UTILS COMPARTILHADOS - BACK-OFFICE
 * Educacross - Vanilla JS
 * 
 * Este arquivo contém funções reutilizáveis entre páginas:
 * - Validação de formulários
 * - Componentes switch (toggle)
 * - Upload de imagens
 * - Notificações/Toast
 */

// ============================================
// VALIDAÇÃO DE FORMULÁRIOS
// ============================================

/**
 * Valida todos os campos obrigatórios de um formulário
 * @param {HTMLFormElement} formElement - Elemento do formulário
 * @returns {boolean} - True se todos os campos estão válidos
 */
export function validarCamposObrigatorios(formElement) {
    const camposObrigatorios = formElement.querySelectorAll('[required]');
    let valido = true;

    camposObrigatorios.forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('erro');
            valido = false;
        } else {
            campo.classList.remove('erro');
        }
    });

    return valido;
}

/**
 * Valida se um campo está preenchido
 * @param {HTMLInputElement} campo - Campo de entrada
 * @returns {boolean} - True se válido
 */
export function validarCampo(campo) {
    if (!campo.value.trim()) {
        campo.classList.add('erro');
        return false;
    }
    campo.classList.remove('erro');
    return true;
}

/**
 * Valida se pelo menos um campo de um grupo tem valor
 * @param {Array<HTMLInputElement>} campos - Array de campos
 * @returns {boolean} - True se pelo menos um tem valor
 */
export function validarGrupo(campos) {
    return campos.some(campo => {
        const valor = parseInt(campo.value) || 0;
        return valor > 0;
    });
}

// ============================================
// SWITCHES (TOGGLE)
// ============================================

/**
 * Inicializa um switch com label dinâmica
 * @param {HTMLInputElement} switchElement - Elemento checkbox do switch
 * @param {HTMLElement} labelElement - Elemento de texto da label
 * @param {string} textoAtivo - Texto quando switch está ON (padrão: 'Ativa')
 * @param {string} textoInativo - Texto quando switch está OFF (padrão: 'Inativa')
 */
export function inicializarSwitch(switchElement, labelElement, textoAtivo = 'Ativa', textoInativo = 'Inativa') {
    if (!switchElement || !labelElement) {
        console.error('inicializarSwitch: elementos não encontrados');
        return;
    }

    // Define texto inicial
    labelElement.textContent = switchElement.checked ? textoAtivo : textoInativo;

    // Event listener para mudança
    switchElement.addEventListener('change', function () {
        labelElement.textContent = this.checked ? textoAtivo : textoInativo;
    });
}

/**
 * Obtém o estado atual de um switch
 * @param {HTMLInputElement} switchElement - Elemento checkbox do switch
 * @returns {boolean} - True se switch está ON
 */
export function obterEstadoSwitch(switchElement) {
    return switchElement.checked;
}

/**
 * Define o estado de um switch
 * @param {HTMLInputElement} switchElement - Elemento checkbox do switch
 * @param {boolean} estado - Novo estado (true = ON, false = OFF)
 */
export function definirEstadoSwitch(switchElement, estado) {
    switchElement.checked = estado;
    // Disparar evento change para atualizar label
    switchElement.dispatchEvent(new Event('change'));
}

// ============================================
// UPLOAD DE IMAGEM
// ============================================

/**
 * Configura área de upload de imagem com drag & drop
 * @param {HTMLElement} areaElement - Área clicável para upload
 * @param {HTMLInputElement} inputElement - Input file (oculto)
 * @param {Function} callback - Função chamada após seleção (recebe objeto File)
 */
export function configurarUploadImagem(areaElement, inputElement, callback) {
    if (!areaElement || !inputElement) {
        console.error('configurarUploadImagem: elementos não encontrados');
        return;
    }

    // Click na área abre seletor de arquivos
    areaElement.addEventListener('click', () => {
        inputElement.click();
    });

    // Quando arquivo é selecionado
    inputElement.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const arquivo = e.target.files[0];

            // Validar tipo de arquivo (apenas imagens)
            if (!arquivo.type.startsWith('image/')) {
                mostrarNotificacao('Por favor, selecione apenas arquivos de imagem', 'erro');
                return;
            }

            // Validar tamanho (máx 5MB)
            const tamanhoMaxMB = 5;
            const tamanhoMaxBytes = tamanhoMaxMB * 1024 * 1024;
            if (arquivo.size > tamanhoMaxBytes) {
                mostrarNotificacao(`Arquivo muito grande. Máximo: ${tamanhoMaxMB}MB`, 'erro');
                return;
            }

            // Callback com o arquivo
            if (callback) {
                callback(arquivo);
            }
        }
    });

    // Drag & Drop (opcional - previne comportamento padrão)
    areaElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        areaElement.style.borderColor = 'var(--primary)';
    });

    areaElement.addEventListener('dragleave', (e) => {
        e.preventDefault();
        areaElement.style.borderColor = '';
    });

    areaElement.addEventListener('drop', (e) => {
        e.preventDefault();
        areaElement.style.borderColor = '';

        if (e.dataTransfer.files.length > 0) {
            inputElement.files = e.dataTransfer.files;
            // Disparar evento change
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

/**
 * Converte File para Data URL (base64)
 * @param {File} arquivo - Arquivo de imagem
 * @returns {Promise<string>} - URL em base64
 */
export function arquivoParaDataURL(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(arquivo);
    });
}

// ============================================
// NOTIFICAÇÕES / TOAST
// ============================================

/**
 * Mostra notificação temporária (toast/snackbar)
 * @param {string} mensagem - Texto da notificação
 * @param {string} tipo - Tipo: 'info', 'sucesso', 'erro', 'aviso' (padrão: 'info')
 * @param {number} duracao - Duração em ms (padrão: 3000)
 */
export function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;

    // Estilos inline (caso não tenha CSS específico)
    Object.assign(notificacao.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'slideInUp 0.3s ease-out',
        maxWidth: '400px'
    });

    // Cores por tipo
    const cores = {
        info: { bg: '#7367f0', color: 'white' },
        sucesso: { bg: '#28c76f', color: 'white' },
        erro: { bg: '#ea5455', color: 'white' },
        aviso: { bg: '#ff9f43', color: 'white' }
    };

    const cor = cores[tipo] || cores.info;
    notificacao.style.backgroundColor = cor.bg;
    notificacao.style.color = cor.color;

    // Adicionar ao DOM
    document.body.appendChild(notificacao);

    // Remover após duração
    setTimeout(() => {
        notificacao.style.animation = 'slideOutDown 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, duracao);
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata número com separadores de milhar
 * @param {number} numero - Número a formatar
 * @returns {string} - Número formatado (ex: "1.234")
 */
export function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR');
}

/**
 * Formata data para padrão brasileiro
 * @param {Date|string} data - Data a formatar
 * @returns {string} - Data formatada (ex: "15/11/2025")
 */
export function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora para padrão brasileiro
 * @param {Date|string} data - Data a formatar
 * @returns {string} - Data e hora formatadas (ex: "15/11/2025 14:30")
 */
export function formatarDataHora(data) {
    const d = new Date(data);
    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// DEBOUNCE (para otimizar buscas/filtros)
// ============================================

/**
 * Cria função com debounce (atraso antes de executar)
 * @param {Function} func - Função a executar
 * @param {number} delay - Atraso em ms (padrão: 300)
 * @returns {Function} - Função com debounce aplicado
 */
export function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// CONFIRMAÇÃO DE AÇÕES
// ============================================

/**
 * Mostra diálogo de confirmação customizado
 * @param {string} mensagem - Mensagem de confirmação
 * @param {Function} onConfirmar - Callback ao confirmar
 * @param {Function} onCancelar - Callback ao cancelar (opcional)
 */
export function confirmarAcao(mensagem, onConfirmar, onCancelar) {
    // Por enquanto usa confirm nativo (pode ser melhorado com modal custom)
    if (confirm(mensagem)) {
        if (onConfirmar) onConfirmar();
    } else {
        if (onCancelar) onCancelar();
    }
}

// ============================================
// NAVEGAÇÃO
// ============================================

/**
 * Redireciona para outra página com confirmação (se houver mudanças não salvas)
 * @param {string} url - URL de destino
 * @param {boolean} temMudancas - Se há mudanças não salvas
 */
export function navegarPara(url, temMudancas = false) {
    if (temMudancas) {
        confirmarAcao(
            'Tem certeza que deseja sair? Alterações não salvas serão perdidas.',
            () => window.location.href = url
        );
    } else {
        window.location.href = url;
    }
}

/**
 * Volta para página anterior
 */
export function voltarPagina() {
    window.history.back();
}

// ============================================
// ANIMAÇÕES CSS (Keyframes)
// ============================================

// Adicionar keyframes ao documento (se ainda não existir)
if (!document.getElementById('common-animations')) {
    const style = document.createElement('style');
    style.id = 'common-animations';
    style.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }

        .erro {
            border-color: var(--danger) !important;
        }
    `;
    document.head.appendChild(style);
}
