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
        document.getElementById('statusQuestaoLabel')
    );
    inicializarSwitch(
        document.getElementById('caixaAlta'),
        document.getElementById('caixaAltaLabel')
    );

    // Upload de imagem
    configurarUploadImagem(
        document.getElementById('imageUploadArea'),
        document.getElementById('imageUploadInput'),
        (arquivo) => {
            const uploadArea = document.getElementById('imageUploadArea');
            uploadArea.innerHTML = `<p class="image-upload-text">Imagem selecionada: ${arquivo.name}</p>`;
        }
    );

    // Botão Cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
                window.location.href = 'habilidades-topicos.html';
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
            alert(`Questões geradas com sucesso!\n\nTotal: ${total} questões`);
        });
    }

    // Validação inicial
    validarFormulario();
});
