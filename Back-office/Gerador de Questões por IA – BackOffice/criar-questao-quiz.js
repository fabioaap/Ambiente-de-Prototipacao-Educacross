// Criar Questão de Quiz - Lógica da página
// Tenta usar utils compartilhados; se indisponíveis, aplica fallbacks locais

let inicializarSwitch = function (switchElement, labelElement, textoAtivo = 'Ativa', textoInativo = 'Inativa') {
    if (!switchElement || !labelElement) return;
    labelElement.textContent = switchElement.checked ? textoAtivo : textoInativo;
    switchElement.addEventListener('change', function () {
        labelElement.textContent = this.checked ? textoAtivo : textoInativo;
    });
};

let configurarUploadImagem = function (areaElement, inputElement, callback) {
    if (!areaElement || !inputElement) return;
    areaElement.addEventListener('click', () => inputElement.click());
    inputElement.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0 && typeof callback === 'function') {
            callback(e.target.files[0]);
        }
    });
};

function validarFormulario() {
    const muitoFacil = parseInt(document.getElementById('muitoFacil').value) || 0;
    const facil = parseInt(document.getElementById('facil').value) || 0;
    const medio = parseInt(document.getElementById('medio').value) || 0;
    const dificil = parseInt(document.getElementById('dificil').value) || 0;
    const muitoDificil = parseInt(document.getElementById('muitoDificil').value) || 0;

    const total = muitoFacil + facil + medio + dificil + muitoDificil;
    const btnGerar = document.getElementById('btnGerar');

    if (total > 0) {
        btnGerar.disabled = false;
        btnGerar.style.background = 'var(--primary)';
    } else {
        btnGerar.disabled = true;
        btnGerar.style.background = 'rgba(115, 103, 240, 0.65)';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Tentar carregar módulo compartilhado (opcional)
    try {
        const mod = await import('../../assets/scripts/common.js');
        if (mod.inicializarSwitch) inicializarSwitch = mod.inicializarSwitch;
        if (mod.configurarUploadImagem) configurarUploadImagem = mod.configurarUploadImagem;
    } catch (e) {
        console.warn('common.js não carregado, usando fallbacks locais');
    }
    // ========================================
    // CARREGAR ESTADO DE HABILIDADE DA URL
    // ========================================

    // Capturar parâmetros de query string
    const params = new URLSearchParams(window.location.search);
    const habilidadeParam = params.get('habilidade');
    const topicoParam = params.get('topico');

    if (habilidadeParam) {
        // Tentar setar em um possível select/hidden (fallback)
        const selectHabilidade = document.getElementById('habilidade') ||
            document.querySelector('select[name="habilidade"]') ||
            document.querySelector('[data-field="habilidade"]');
        if (selectHabilidade) {
            selectHabilidade.value = habilidadeParam;
            selectHabilidade.dispatchEvent(new Event('change', { bubbles: true }));
        }
        // Exibir imediatamente o "estado B" de Habilidades com o texto vindo da URL
        // (equivalente a clicar em "Incluir Habilidade")
        window.__habilidadeSelecionadaInicial = habilidadeParam;
    }
    if (topicoParam) {
        // Guardar para render imediato do estado B de Tópico
        window.__topicoSelecionadoInicial = topicoParam;
    }

    // ========================================
    // SISTEMA DE TOAST NOTIFICAÇÕES
    // ========================================

    window.showToast = function (title, message, type = 'info', duration = 5000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.error('Toast container não encontrado');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

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

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        });

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

    // Inputs de dificuldade
    ['muitoFacil', 'facil', 'medio', 'dificil', 'muitoDificil'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validarFormulario);
    });

    // Switches
    // Garantir que statusQuestao esteja habilitado por padrão (nova regra)
    const statusQuestaoEl = document.getElementById('statusQuestao');
    if (statusQuestaoEl) statusQuestaoEl.checked = true;
    inicializarSwitch(
        statusQuestaoEl,
        document.getElementById('statusQuestaoLabel'),
        'Ativa',
        'Inativa'
    );
    inicializarSwitch(
        document.getElementById('caixaAlta'),
        document.getElementById('caixaAltaLabel'),
        'Ativa',
        'Inativa'
    );

    // Upload de imagem - Simulação direta sem janela de seleção
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageUploadInput = document.getElementById('imageUploadInput');

    if (imageUploadArea) {
        imageUploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Mostrar diretamente o estado B com a imagem
            imageUploadArea.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; gap: 10px; padding: 10px;">
                    <div style="flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 6px; overflow: hidden;">
                        <img src="assets/Group 10000.png" 
                             style="width: 100%; height: 100%; object-fit: cover;" 
                             alt="Imagem de exemplo">
                    </div>
                    <button type="button" id="btnRemoverImagem"
                            style="width: 44px; height: 44px; background: #ffffff; border: 1px solid #d8d6de; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#ea5455"/>
                        </svg>
                    </button>
                </div>
            `;

            // Adicionar evento ao botão de remover
            const btnRemover = document.getElementById('btnRemoverImagem');
            if (btnRemover) {
                btnRemover.addEventListener('click', (e) => {
                    e.stopPropagation();
                    imageUploadArea.innerHTML = '<p class="image-upload-text">Clique para inserir a imagem</p>';
                });
            }
        });
    }

    // Tooltip: posicionar dinamicamente para cada tooltip (hover) e fallback click/touch
    document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
        const infoIcon = wrapper.querySelector('.info-icon');
        const tooltipContent = wrapper.querySelector('.tooltip-content');
        if (!infoIcon || !tooltipContent) return;

        const positionTooltip = () => {
            // Temporariamente exibe para medir
            const prevDisplay = tooltipContent.style.display;
            tooltipContent.style.display = 'block';
            tooltipContent.style.visibility = 'hidden';

            const iconRect = infoIcon.getBoundingClientRect();
            const tooltipWidth = tooltipContent.offsetWidth || 320;
            const tooltipHeight = tooltipContent.offsetHeight || 160;

            // Tenta posicionar à esquerda do ícone; se pouco espaço, posiciona à direita
            let left = iconRect.left - tooltipWidth - 12;
            let position = 'left';
            if (left < 8) {
                left = iconRect.right + 12;
                // Force left arrow visual; keep tooltip offset but do not change arrow orientation
            }

            let top = iconRect.top + (iconRect.height / 2) - (tooltipHeight / 2);
            if (top < 8) top = 8;
            if ((top + tooltipHeight) > (window.innerHeight - 8)) top = window.innerHeight - tooltipHeight - 8;

            tooltipContent.style.left = left + 'px';
            tooltipContent.style.top = top + 'px';
            // Set orientation attribute for CSS arrow styling (always left)
            tooltipContent.setAttribute('data-position', 'left');

            tooltipContent.style.display = prevDisplay;
            tooltipContent.style.visibility = '';
        };

        // Atualizar no hover e resize
        infoIcon.addEventListener('mouseenter', positionTooltip);
        window.addEventListener('resize', positionTooltip);

        // Click/touch fallback (mobile) - toggle tooltip on click or touch
        const toggleTooltip = (event) => {
            event.stopPropagation();
            const isVisible = tooltipContent.style.display === 'block';
            if (isVisible) {
                tooltipContent.style.display = '';
                tooltipContent.setAttribute('aria-hidden', 'true');
            } else {
                positionTooltip();
                tooltipContent.style.display = 'block';
                tooltipContent.setAttribute('aria-hidden', 'false');
            }
        };

        infoIcon.addEventListener('click', toggleTooltip);

        // Close tooltip on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                tooltipContent.style.display = '';
                tooltipContent.setAttribute('aria-hidden', 'true');
            }
        });

        // Inicializa aria-hidden
        tooltipContent.setAttribute('aria-hidden', 'true');
        // window.addEventListener('resize', positionTooltip); // already bound above
    });

    // Botão Cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
                // Voltar para a lista de Habilidades e Tópicos
                window.location.href = 'habilidades-topicos-v2.html';
            }
        });
    }

    // Botão Gerar
    const btnGerar = document.getElementById('btnGerar');
    if (btnGerar) {
        btnGerar.addEventListener('click', function () {
            if (this.disabled) return;

            const dados = {
                muitoFacil: parseInt(document.getElementById('muitoFacil').value) || 0,
                facil: parseInt(document.getElementById('facil').value) || 0,
                medio: parseInt(document.getElementById('medio').value) || 0,
                dificil: parseInt(document.getElementById('dificil').value) || 0,
                muitoDificil: parseInt(document.getElementById('muitoDificil').value) || 0,
                statusAtivo: document.getElementById('statusQuestao').checked,
                caixaAlta: document.getElementById('caixaAlta').checked,
                instrucoes: document.getElementById('instrucoesAdicionais').value,
            };


            console.log('Gerando questões com:', dados);

            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = 'banco-questoes-revisao.html';
            }, 1000);
            const total = dados.muitoFacil + dados.facil + dados.medio + dados.dificil + dados.muitoDificil;

            // Simular resultado da geração: salvar resumo detalhado no localStorage
            // Nova lógica: cada dificuldade pode ter sucesso total ou parcial independente
            const requestedPerDifficulty = [
                dados.muitoFacil,
                dados.facil,
                dados.medio,
                dados.dificil,
                dados.muitoDificil
            ];
            const successPerDifficulty = requestedPerDifficulty.map(req => {
                if (req === 0) return 0;
                const r = Math.random();
                // 35% chance de sucesso total
                if (r < 0.35) return req;
                // 20% chance de falha moderada (60% a 80%)
                if (r < 0.55) return Math.max(0, Math.round(req * (0.60 + Math.random() * 0.20)));
                // Caso geral: alto sucesso (85% a 98%)
                return Math.max(0, Math.round(req * (0.85 + Math.random() * 0.13)));
            });
            const errorPerDifficulty = requestedPerDifficulty.map((req, i) => Math.max(0, req - successPerDifficulty[i]));
            const counts = {
                total,
                success: successPerDifficulty.reduce((a, b) => a + b, 0),
                error: errorPerDifficulty.reduce((a, b) => a + b, 0),
                requestedPerDifficulty,
                successPerDifficulty,
                errorPerDifficulty
            };
            localStorage.setItem('geracaoResumo', JSON.stringify(counts));

            // Redirecionar para banco de questões após gerar
            window.location.href = 'banco-questoes-revisao.html';
        });
    }

    // Validação inicial
    validarFormulario();

    // ===== Estado B (selecionado) — Habilidades e Tópico (Figma) =====
    function svgIcon(pathD, { width = 24, height = 24, cls = '' } = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('width', String(width))
        svg.setAttribute('height', String(height))
        if (cls) svg.setAttribute('class', cls)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill', 'currentColor')
        path.setAttribute('d', pathD)
        svg.appendChild(path)
        return svg
    }

    function createHabilidadeSelecionadaRow(textoCustom) {
        const row = document.createElement('div')
        row.className = 'skill-selected-row'

        const texto = document.createElement('div')
        texto.className = 'skill-selected-text'
        texto.textContent = textoCustom || 'Selecionado: Interpretação de texto — 5.º ano — EF15LP02'

        const iconBox = document.createElement('div')
        iconBox.className = 'icon-box'
        const btnRemove = document.createElement('button')
        btnRemove.type = 'button'
        btnRemove.className = 'icon-button'
        btnRemove.setAttribute('aria-label', 'Remover habilidade selecionada')
        const trash = svgIcon('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z', { cls: 'delete-icon' })
        btnRemove.appendChild(trash)
        iconBox.appendChild(btnRemove)

        btnRemove.addEventListener('click', () => {
            const container = row.parentElement
            if (!container) return
            row.remove()
            const addBtn = container.querySelector('[data-role="add-habilidade"]')
            if (addBtn) addBtn.style.display = ''
        })

        row.appendChild(texto)
        row.appendChild(iconBox)
        return row
    }

    function createTopicoSelecionadoRow(textoCustom) {
        const row = document.createElement('div')
        row.className = 'topic-selected-row'

        const box = document.createElement('div')
        box.className = 'topic-selected-box'
        const h = document.createElement('h4')
        h.className = 'topic-title'
        h.textContent = textoCustom || 'Interpretação de texto'
        const p = document.createElement('p')
        p.className = 'topic-desc'
        p.innerHTML = 'Gerar questões de <span class="strong">interpretação de texto</span> com foco em <span class="strong">análise literal</span> e compreensão global.'
        box.appendChild(h)
        box.appendChild(p)

        const iconBox = document.createElement('div')
        iconBox.className = 'icon-box'
        const btnRemove = document.createElement('button')
        btnRemove.type = 'button'
        btnRemove.className = 'icon-button'
        btnRemove.setAttribute('aria-label', 'Remover tópico selecionado')
        const trash = svgIcon('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z', { cls: 'delete-icon' })
        btnRemove.appendChild(trash)
        iconBox.appendChild(btnRemove)

        btnRemove.addEventListener('click', () => {
            const container = row.parentElement
            if (!container) return
            row.remove()
            const addBtn = container.querySelector('[data-role="add-topico"]')
            if (addBtn) addBtn.style.display = ''
        })

        row.appendChild(box)
        row.appendChild(iconBox)
        return row
    }

    function initEstadoBHandlers() {
        const btnAddHabilidade = document.querySelector('[data-role="add-habilidade"]')
        const btnAddTopico = document.querySelector('[data-role="add-topico"]')

        if (btnAddHabilidade) {
            btnAddHabilidade.addEventListener('click', () => {
                const section = btnAddHabilidade.closest('.section-block') || btnAddHabilidade.parentElement
                if (!section) return
                if (section.querySelector('.skill-selected-row')) return
                const row = createHabilidadeSelecionadaRow()
                section.insertBefore(row, btnAddHabilidade)
                btnAddHabilidade.style.display = 'none'
            })

            // Caso a página tenha sido aberta com ?habilidade=..., já mostrar a seleção
            if (window.__habilidadeSelecionadaInicial) {
                const section = btnAddHabilidade.closest('.section-block') || btnAddHabilidade.parentElement
                if (section && !section.querySelector('.skill-selected-row')) {
                    const texto = `Selecionado: ${window.__habilidadeSelecionadaInicial}`
                    const row = createHabilidadeSelecionadaRow(texto)
                    section.insertBefore(row, btnAddHabilidade)
                    btnAddHabilidade.style.display = 'none'
                }
            }
        }

        if (btnAddTopico) {
            btnAddTopico.addEventListener('click', () => {
                const section = btnAddTopico.closest('.section-block') || btnAddTopico.parentElement
                if (!section) return
                if (section.querySelector('.topic-selected-row')) return
                const row = createTopicoSelecionadoRow()
                section.insertBefore(row, btnAddTopico)
                btnAddTopico.style.display = 'none'
            })

            // Caso a página tenha sido aberta com ?topico=..., já mostrar a seleção
            if (window.__topicoSelecionadoInicial) {
                const section = btnAddTopico.closest('.section-block') || btnAddTopico.parentElement
                if (section && !section.querySelector('.topic-selected-row')) {
                    const row = createTopicoSelecionadoRow(window.__topicoSelecionadoInicial)
                    section.insertBefore(row, btnAddTopico)
                    btnAddTopico.style.display = 'none'
                }
            }
        }
    }

    initEstadoBHandlers()
});
