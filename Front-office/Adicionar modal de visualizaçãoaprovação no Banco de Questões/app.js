// Dados simulados. Troque por fetch da API quando integrar.
const questions = [
    {
        status: 'Inativa',
        title: 'Nova questão de avaliação',
        text: '“Já pensou: sentar-se na mesma poltrona que Sherlock Holmes ocupava quando refletia sobre alguns dos casos mais complicados...”',
        help: 'Mesmo enunciado, apresentado ao aluno como texto de apoio ou dica contextual.',
        alts: [
            { text: 'a coragem de Ariel de encarar inimigos.', correct: false },
            { text: 'a admiração de Ariel e seu desejo genuíno.', correct: true },
            { text: 'o medo de Ariel de sair de casa.', correct: false },
            { text: 'a dúvida de Ariel sobre o futuro.', correct: false },
        ]
    },
    {
        status: 'Em revisão',
        title: 'Questão sobre heurísticas',
        text: 'Explique com suas palavras a heurística de visibilidade do estado do sistema.',
        help: 'Descreva exemplos de feedback imediato em interfaces.',
        alts: [
            { text: 'Mostrar loaders, toasts e estados visuais.', correct: true },
            { text: 'Esconder feedback para reduzir ruído.', correct: false },
            { text: 'Aguardar 10s antes de alertar.', correct: false },
            { text: 'Usar cores aleatórias.', correct: false },
        ]
    },
    {
        status: 'Ativa',
        title: 'Questão sobre testes de usabilidade',
        text: 'Quais os benefícios de testes de usabilidade antes do lançamento?',
        help: 'Foque em riscos e aprendizados.',
        alts: [
            { text: 'Reduz riscos e aumenta aderência ao usuário.', correct: true },
            { text: 'Aumenta custo sem benefício.', correct: false },
            { text: 'Substitui analytics.', correct: false },
            { text: 'Evita qualquer retrabalho.', correct: false },
        ]
    }
];

// Referências
let i = 0;
const qCounter = document.getElementById('qCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const titleEl = document.getElementById('modalTitle');
const statusEl = document.getElementById('qStatus');
const qText = document.getElementById('qText');
const qHelp = document.getElementById('qHelp');

const altAText = document.getElementById('altAText');
const altBText = document.getElementById('altBText');
const altCText = document.getElementById('altCText');
const altDText = document.getElementById('altDText');

const altAStatus = document.getElementById('altAStatus');
const altB = document.getElementById('altB');
const altBStatus = document.getElementById('altBStatus');
const altCStatus = document.getElementById('altCStatus');
const altDStatus = document.getElementById('altDStatus');

// Helpers
function setStatusBadge(text) {
    statusEl.textContent = text;
    statusEl.classList.remove('badge--warn', 'badge--ok', 'badge--hard');
    // mapeamento simples p/ cores (ajuste se quiser)
    if (text === 'Ativa') statusEl.classList.add('badge--ok');
    else if (text === 'Inativa') statusEl.classList.add('badge--warn');
    else statusEl.classList.add('badge--hard'); // Em revisão, etc.
}

// Helper para aplicar classes utilitárias shadcn nos valores
function setValueAs(el, text, kind) {
    const KINDS = {
        chip: 'inline-flex items-center rounded-full border bg-muted/60 px-2.5 py-1 text-sm font-medium text-muted-foreground max-w-[220px] truncate',
        text: 'text-[0.95rem] font-medium text-muted-foreground',
        block: 'rounded-md border bg-muted px-3 py-2 text-[0.95rem] leading-relaxed text-foreground/90',
    };
    const klass = KINDS[kind] || KINDS.text;
    el.innerHTML = `<span class="${klass}">${text}</span>`;
}

// Exemplo de uso no render()
// setValueAs(document.getElementById('modalTitle'), q.title, 'block');
// setValueAs(document.querySelector('#metacampos .field:nth-of-type(1) .field__value'), 'Matemática', 'chip');
// ...

// Navegação
prevBtn.addEventListener('click', () => { if (i > 0) { i--; render(); } });
nextBtn.addEventListener('click', () => { if (i < questions.length - 1) { i++; render(); } });

// Teclas ← / →
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { if (i > 0) { i--; render(); } }
    if (e.key === 'ArrowRight') { if (i < questions.length - 1) { i++; render(); } }
    // Home/End opcionais:
    // if (e.key === 'Home') { i = 0; render(); }
    // if (e.key === 'End')  { i = questions.length - 1; render(); }
});

// Foco inicial + render
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal__close')?.focus();
    render();
});

// Função principal para atualizar o modal conforme o objeto questions[i]
function render() {
    const q = questions[i];
    // Título
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = q.title;

    // Status
    const statusEl = document.getElementById('qStatus');
    if (statusEl) setStatusBadge(q.status);

    // Enunciado
    const qText = document.getElementById('qText');
    if (qText) qText.textContent = q.text;

    // Ajuda/contexto
    const qHelp = document.getElementById('qHelp');
    if (qHelp) qHelp.textContent = q.help;

    // Alternativas
    const altEls = [
        document.getElementById('altAText'),
        document.getElementById('altBText'),
        document.getElementById('altCText'),
        document.getElementById('altDText'),
    ];
    q.alts.forEach((alt, idx) => {
        if (altEls[idx]) altEls[idx].textContent = alt.text;
        // Destacar alternativa correta
        const altCard = document.getElementById(`alt${String.fromCharCode(65 + idx)}`);
        if (altCard) {
            altCard.classList.remove('border-green-500', 'alt--ok');
            if (alt.correct) {
                altCard.classList.add('border-green-500', 'alt--ok');
                // Rodapé de destaque
                let footer = altCard.querySelector('.alt__footer');
                if (!footer) {
                    footer = document.createElement('div');
                    footer.className = 'alt__footer rounded-b-xl bg-green-500/10 text-green-700 text-sm font-semibold px-3 py-2 text-left';
                    altCard.appendChild(footer);
                }
                footer.textContent = 'Alternativa com maior número de respostas.';
            } else {
                // Remove rodapé se não for correta
                const footer = altCard.querySelector('.alt__footer');
                if (footer) footer.remove();
            }
        }
    });

    // Contador de questões
    const qCounter = document.getElementById('qCounter');
    if (qCounter) qCounter.textContent = `${i + 1} / ${questions.length}`;

    // Campos verticais (área, taxonomia, subnível)
    const fields = [
        { id: 'fieldArea', value: 'Matemática' },
        { id: 'fieldTax', value: '4: Analisar' },
        { id: 'fieldSubTax', value: '4.2 Organizar' },
    ];
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.textContent = f.value;
    });
}
