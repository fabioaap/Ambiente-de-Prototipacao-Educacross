// Criar Questão de Quiz - Lógica da página
// Usa utils compartilhados em ../../assets/scripts/common.js

import { inicializarSwitch, configurarUploadImagem } from '../../assets/scripts/common.js';

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

document.addEventListener('DOMContentLoaded', () => {
    // Inputs de dificuldade
    ['muitoFacil', 'facil', 'medio', 'dificil', 'muitoDificil'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validarFormulario);
    });

    // Switches
    inicializarSwitch(
        document.getElementById('statusQuestao'),
        document.getElementById('statusQuestaoLabel'),
        'Ativa',
        'Ativa'
    );
    inicializarSwitch(
        document.getElementById('caixaAlta'),
        document.getElementById('caixaAltaLabel'),
        'Ativa',
        'Ativa'
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

    // Botão Cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
                window.location.href = 'banco-questoes-revisao.html';
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
            const total = dados.muitoFacil + dados.facil + dados.medio + dados.dificil + dados.muitoDificil;

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

    function createHabilidadeSelecionadaRow() {
        const row = document.createElement('div')
        row.className = 'skill-selected-row'

        const texto = document.createElement('div')
        texto.className = 'skill-selected-text'
        texto.textContent = 'Selecionado: Interpretação de texto — 5.º ano — EF15LP02'

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

    function createTopicoSelecionadoRow() {
        const row = document.createElement('div')
        row.className = 'topic-selected-row'

        const box = document.createElement('div')
        box.className = 'topic-selected-box'
        const h = document.createElement('h4')
        h.className = 'topic-title'
        h.textContent = 'Interpretação de texto'
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
        }
    }

    initEstadoBHandlers()
});
