// ========== SISTEMA DE QUANTIDADES DO LOTE ==========
// Sistema de distribuição de questões com gráfico interativo
// Gerencia: dificuldade, Bloom, tópicos, habilidades e imagens

// ===== ESTADO GLOBAL =====
window.batchState = {
    totalQuestoes: 120,
    distribuicao: {
        dificuldade: { facil: 40, medio: 60, dificil: 20 },
        bloom: { lembrar: 20, compreender: 30, aplicar: 30, analisar: 25, avaliar: 10, criar: 5 },
        topicos: [],
        habilidades: []
    },
    imagens: {
        porQuestao: 0,
        estrategia: "gerar"
    }
};

// ===== VARIÁVEIS GLOBAIS PARA GRÁFICO =====
let pieCanvas = null;
let pieCtx = null;
let topicoCounter = 0;
let habilidadeCounter = 0;

// ===== UTILITÁRIOS =====
function equalizarTotal(total, partes) {
    const base = Math.floor(total / partes);
    const resto = total - (base * partes);
    const resultado = [];
    for (let i = 0; i < partes; i++) {
        resultado.push(base + (i < resto ? 1 : 0));
    }
    return resultado;
}

function distribuirProporcional(alvo, mapa) {
    const keys = Object.keys(mapa);
    const somaAtual = keys.reduce((acc, k) => acc + mapa[k], 0);

    if (somaAtual === 0) {
        return equalizarTotal(alvo, keys.length).reduce((obj, val, i) => {
            obj[keys[i]] = val;
            return obj;
        }, {});
    }

    const razao = alvo / somaAtual;
    const temp = {};
    keys.forEach(k => temp[k] = Math.floor(mapa[k] * razao));

    let somaTemp = Object.values(temp).reduce((a, b) => a + b, 0);
    const diff = alvo - somaTemp;

    if (diff !== 0) {
        const erros = keys.map(k => ({
            key: k,
            erro: Math.abs((mapa[k] * razao) - temp[k])
        })).sort((a, b) => b.erro - a.erro);

        for (let i = 0; i < Math.abs(diff); i++) {
            temp[erros[i % erros.length].key] += (diff > 0 ? 1 : -1);
        }
    }

    return temp;
}

function somaDiff() {
    const d = window.batchState.distribuicao.dificuldade;
    return d.facil + d.medio + d.dificil;
}

function somaBloom() {
    const b = window.batchState.distribuicao.bloom;
    return b.lembrar + b.compreender + b.aplicar + b.analisar + b.avaliar + b.criar;
}

function somaTopicos() {
    return window.batchState.distribuicao.topicos.reduce((acc, t) => acc + t.qtd, 0);
}

function somaHabilidades() {
    return window.batchState.distribuicao.habilidades.reduce((acc, h) => acc + h.qtd, 0);
}

// ===== RENDERIZAÇÃO DE GRÁFICO =====
function renderPieChart() {
    if (!pieCanvas) {
        pieCanvas = document.getElementById('pie-dificuldade');
        if (!pieCanvas) return;
        pieCtx = pieCanvas.getContext('2d');
    }

    const d = window.batchState.distribuicao.dificuldade;
    const total = somaDiff();
    const dados = [
        { label: 'Fácil', valor: d.facil, cor: '#28c76f' },
        { label: 'Médio', valor: d.medio, cor: '#ff9f43' },
        { label: 'Difícil', valor: d.dificil, cor: '#ea5455' }
    ];

    // Limpar canvas
    pieCtx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);

    // Desenhar pizza
    let startAngle = -Math.PI / 2;
    const centerX = pieCanvas.width / 2;
    const centerY = pieCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    dados.forEach(item => {
        const sliceAngle = (item.valor / total) * 2 * Math.PI;

        pieCtx.beginPath();
        pieCtx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        pieCtx.lineTo(centerX, centerY);
        pieCtx.fillStyle = item.cor;
        pieCtx.fill();
        pieCtx.strokeStyle = '#fff';
        pieCtx.lineWidth = 2;
        pieCtx.stroke();

        startAngle += sliceAngle;
    });

    // Atualizar legenda
    const legendHTML = dados.map(item => {
        const perc = total > 0 ? Math.round((item.valor / total) * 100) : 0;
        return `<div style="display:flex;align-items:center;gap:8px;">
            <span style="width:12px;height:12px;background:${item.cor};border-radius:2px;"></span>
            <span>${item.label}: ${item.valor} (${perc}%)</span>
        </div>`;
    }).join('');

    const legendEl = document.getElementById('pie-legend');
    if (legendEl) legendEl.innerHTML = legendHTML;
}

// ===== ATUALIZAÇÃO DE STATUS =====
function updateValidationStatus() {
    const totalQuestoes = window.batchState.totalQuestoes;
    const totalDiff = somaDiff();
    const totalBloom = somaBloom();

    // Status Dificuldade
    const diffEl = document.getElementById('diff-status');
    if (diffEl) {
        if (totalDiff === totalQuestoes) {
            diffEl.innerHTML = '<span class="badge-dificuldade badge-facil" style="font-size:11px;">✓ OK</span>';
        } else {
            diffEl.innerHTML = `<span class="badge-dificuldade badge-dificil" style="font-size:11px;">⚠ Soma: ${totalDiff}/${totalQuestoes}</span>`;
        }
    }

    // Status Bloom
    const bloomEl = document.getElementById('bloom-status');
    if (bloomEl) {
        if (totalBloom === totalQuestoes) {
            bloomEl.innerHTML = '<span class="badge-dificuldade badge-facil" style="font-size:11px;">✓ OK</span>';
        } else {
            bloomEl.innerHTML = `<span class="badge-dificuldade badge-dificil" style="font-size:11px;">⚠ Soma: ${totalBloom}/${totalQuestoes}</span>`;
        }
    }

    // KPIs
    const kpiTotal = document.getElementById('kpi-total');
    const kpiTopicos = document.getElementById('kpi-topicos');
    const kpiHab = document.getElementById('kpi-habilidades');
    const kpiRest = document.getElementById('kpi-restante');

    if (kpiTotal) kpiTotal.textContent = totalQuestoes;
    if (kpiTopicos) kpiTopicos.textContent = somaTopicos();
    if (kpiHab) kpiHab.textContent = somaHabilidades();
    if (kpiRest) kpiRest.textContent = totalQuestoes - somaTopicos();

    // Resumo
    updateResumo();

    // Botão Prosseguir
    const btnProsseguir = document.getElementById('btn-prosseguir');
    if (btnProsseguir) {
        if (totalDiff === totalQuestoes && totalBloom === totalQuestoes) {
            btnProsseguir.disabled = false;
            btnProsseguir.style.opacity = '1';
        } else {
            btnProsseguir.disabled = true;
            btnProsseguir.style.opacity = '0.6';
        }
    }
}

function updateResumo() {
    const resumoEl = document.getElementById('resumo-lote');
    if (!resumoEl) return;

    const state = window.batchState;
    const d = state.distribuicao.dificuldade;
    const b = state.distribuicao.bloom;

    let imgText = 'sem';
    if (state.imagens.porQuestao === 1) imgText = '1 por questão';
    else if (state.imagens.porQuestao === 2) imgText = '2 por questão';

    const resumo = `Total ${state.totalQuestoes} • Fácil ${d.facil} Médio ${d.medio} Difícil ${d.dificil} • ` +
        `Bloom L${b.lembrar} C${b.compreender} A${b.aplicar} N${b.analisar} V${b.avaliar} Cr${b.criar} • ` +
        `Imagens: ${imgText}`;

    resumoEl.textContent = resumo;
}

// ===== FUNÇÕES PÚBLICAS =====
window.getBatchState = function () {
    console.log('[lote] Estado atual:', window.batchState);
    return window.batchState;
};

window.setTotalQuestoes = function (novoTotal) {
    if (novoTotal < 1 || isNaN(novoTotal)) {
        novoTotal = 1;
        document.getElementById('total-questoes').value = 1;
    }

    window.batchState.totalQuestoes = novoTotal;

    // Redistribuir proporcionalmente
    const newDiff = distribuirProporcional(novoTotal, window.batchState.distribuicao.dificuldade);
    window.batchState.distribuicao.dificuldade = newDiff;

    const newBloom = distribuirProporcional(novoTotal, window.batchState.distribuicao.bloom);
    window.batchState.distribuicao.bloom = newBloom;

    // Atualizar inputs
    document.getElementById('diff-facil').value = newDiff.facil;
    document.getElementById('diff-medio').value = newDiff.medio;
    document.getElementById('diff-dificil').value = newDiff.dificil;

    document.getElementById('bloom-lembrar').value = newBloom.lembrar;
    document.getElementById('bloom-compreender').value = newBloom.compreender;
    document.getElementById('bloom-aplicar').value = newBloom.aplicar;
    document.getElementById('bloom-analisar').value = newBloom.analisar;
    document.getElementById('bloom-avaliar').value = newBloom.avaliar;
    document.getElementById('bloom-criar').value = newBloom.criar;

    renderPieChart();
    updateValidationStatus();
    console.info('[lote] Total alterado para', novoTotal);
};

window.updateDiff = function (nivel, valor) {
    if (valor < 0 || isNaN(valor)) valor = 0;
    window.batchState.distribuicao.dificuldade[nivel] = valor;
    renderPieChart();
    updateValidationStatus();
    console.info('[lote] diffChanged', window.batchState.distribuicao.dificuldade);
};

window.updateBloom = function (nivel, valor) {
    if (valor < 0 || isNaN(valor)) valor = 0;
    window.batchState.distribuicao.bloom[nivel] = valor;
    updateValidationStatus();
    console.info('[lote] bloomChanged', window.batchState.distribuicao.bloom);
};

window.applyPreset = function (type) {
    const total = window.batchState.totalQuestoes;
    let newDiff, newBloom;

    switch (type) {
        case 'diffA':
            newDiff = distribuirProporcional(total, { facil: 40, medio: 40, dificil: 20 });
            break;
        case 'diffB':
            newDiff = distribuirProporcional(total, { facil: 30, medio: 50, dificil: 20 });
            break;
        case 'equalizar':
            const eq = equalizarTotal(total, 3);
            newDiff = { facil: eq[0], medio: eq[1], dificil: eq[2] };
            break;
        case 'bloomBase':
            newBloom = distribuirProporcional(total, {
                lembrar: 20, compreender: 25, aplicar: 25,
                analisar: 15, avaliar: 10, criar: 5
            });
            break;
    }

    if (newDiff) {
        window.batchState.distribuicao.dificuldade = newDiff;
        document.getElementById('diff-facil').value = newDiff.facil;
        document.getElementById('diff-medio').value = newDiff.medio;
        document.getElementById('diff-dificil').value = newDiff.dificil;
        renderPieChart();
    }

    if (newBloom) {
        window.batchState.distribuicao.bloom = newBloom;
        document.getElementById('bloom-lembrar').value = newBloom.lembrar;
        document.getElementById('bloom-compreender').value = newBloom.compreender;
        document.getElementById('bloom-aplicar').value = newBloom.aplicar;
        document.getElementById('bloom-analisar').value = newBloom.analisar;
        document.getElementById('bloom-avaliar').value = newBloom.avaliar;
        document.getElementById('bloom-criar').value = newBloom.criar;
    }

    updateValidationStatus();
    console.info('[lote] Preset aplicado:', type);
};

window.addLinhaTopico = function () {
    topicoCounter++;
    const novoTopico = {
        id: 'topico-' + topicoCounter,
        nome: 'Tópico ' + topicoCounter,
        qtd: 0
    };
    window.batchState.distribuicao.topicos.push(novoTopico);
    renderTabelaTopicos();
    updateValidationStatus();
};

window.removeTopico = function (id) {
    window.batchState.distribuicao.topicos = window.batchState.distribuicao.topicos.filter(t => t.id !== id);
    renderTabelaTopicos();
    updateValidationStatus();
};

window.updateTopico = function (id, valor) {
    const topico = window.batchState.distribuicao.topicos.find(t => t.id === id);
    if (topico) {
        topico.qtd = parseInt(valor) || 0;
        updateValidationStatus();
    }
};

function renderTabelaTopicos() {
    const tbody = document.getElementById('topicos-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.batchState.distribuicao.topicos.map(t => `
        <tr>
            <td>${t.nome}</td>
            <td>
                <input type="number" class="input-field input-qtd" value="${t.qtd}" min="0" 
                    onchange="window.updateTopico('${t.id}', this.value)" 
                    aria-label="Quantidade para ${t.nome}">
            </td>
            <td style="text-align:center;">
                <button type="button" class="btn btn-outline" onclick="window.removeTopico('${t.id}')" 
                    style="padding:4px 8px;font-size:12px;" aria-label="Remover ${t.nome}">
                    <span class="material-icons" style="font-size:16px;">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

window.addLinhaHabilidade = function () {
    habilidadeCounter++;
    const novaHab = {
        id: 'hab-' + habilidadeCounter,
        codigo: 'EF0' + habilidadeCounter,
        qtd: 0
    };
    window.batchState.distribuicao.habilidades.push(novaHab);
    renderTabelaHabilidades();
    updateValidationStatus();
};

window.removeHabilidade = function (id) {
    window.batchState.distribuicao.habilidades = window.batchState.distribuicao.habilidades.filter(h => h.id !== id);
    renderTabelaHabilidades();
    updateValidationStatus();
};

window.updateHabilidade = function (id, valor) {
    const hab = window.batchState.distribuicao.habilidades.find(h => h.id === id);
    if (hab) {
        hab.qtd = parseInt(valor) || 0;
        updateValidationStatus();
    }
};

function renderTabelaHabilidades() {
    const tbody = document.getElementById('habilidades-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.batchState.distribuicao.habilidades.map(h => `
        <tr>
            <td>${h.codigo}</td>
            <td>
                <input type="number" class="input-field input-qtd" value="${h.qtd}" min="0" 
                    onchange="window.updateHabilidade('${h.id}', this.value)" 
                    aria-label="Quantidade para ${h.codigo}">
            </td>
            <td style="text-align:center;">
                <button type="button" class="btn btn-outline" onclick="window.removeHabilidade('${h.id}')" 
                    style="padding:4px 8px;font-size:12px;" aria-label="Remover ${h.codigo}">
                    <span class="material-icons" style="font-size:16px;">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

window.updateImagens = function (campo, valor) {
    if (campo === 'porQuestao') {
        valor = parseInt(valor) || 0;
    }
    window.batchState.imagens[campo] = valor;

    // Mostrar/ocultar seletor de estratégia
    const container = document.getElementById('imagem-estrategia-container');
    if (container) {
        if (window.batchState.imagens.porQuestao > 0) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }

    updateValidationStatus();
    console.info('[lote] imagensChanged', window.batchState.imagens);
};

window.salvarRascunho = function () {
    console.info('[lote] Salvando rascunho...', window.batchState);
    alert('Rascunho salvo com sucesso! (mock)');
};

window.prosseguirGeracao = function () {
    const totalDiff = somaDiff();
    const totalBloom = somaBloom();
    const total = window.batchState.totalQuestoes;

    if (totalDiff !== total || totalBloom !== total) {
        alert('As somas de Dificuldade e Bloom precisam bater o total antes de prosseguir.');
        return;
    }

    console.info('[lote] Prosseguindo para geração com estado:', window.batchState);
    // window.location.assign('/backoffice/geracao-ia');
    alert('Prosseguindo para Geração por IA... (mock)\n\nEstado salvo no console.');
};

// ===== SUPORTE A TECLADO =====
document.addEventListener('keydown', function (e) {
    if (e.target.type === 'number' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        const step = e.shiftKey ? 5 : 1;
        const currentVal = parseInt(e.target.value) || 0;
        const newVal = e.key === 'ArrowUp' ? currentVal + step : Math.max(0, currentVal - step);
        e.target.value = newVal;
        e.target.dispatchEvent(new Event('change'));
    }
});

// ===== INICIALIZAÇÃO =====
window.addEventListener('load', function () {
    setTimeout(() => {
        console.info('[lote] Sistema de quantidades inicializado');
        renderPieChart();
        updateValidationStatus();
        renderTabelaTopicos();
        renderTabelaHabilidades();
    }, 200);
});

// Adicionar CSS responsivo
const styleResponsivo = document.createElement('style');
styleResponsivo.textContent = `
    @media (max-width: 968px) {
        .responsive-grid {
            grid-template-columns: 1fr !important;
        }
        #pie-dificuldade {
            width: 250px !important;
            height: 250px !important;
        }
    }
`;
document.head.appendChild(styleResponsivo);
