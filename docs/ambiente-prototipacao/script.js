/**
 * SCRIPT DA PÁGINA - AMBIENTE DE PROTOTIPAÇÃO
 * Funcionalidades interativas e navegação
 */

/**
 * Constrói regex de busca com suporte a palavra inteira e acentos
 */
function buildSearchRegex(query, { wholeWord = false, ignoreAccents = true } = {}) {
    if (!query) return null;

    const map = {
        a: '[aàáâãä]', A: '[AÀÁÂÃÄ]',
        e: '[eèéêë]', E: '[EÈÉÊË]',
        i: '[iìíîï]', I: '[IÌÍÎÏ]',
        o: '[oòóôõö]', O: '[OÒÓÔÕÖ]',
        u: '[uùúûü]', U: '[UÙÚÛÜ]',
        c: '[cç]', C: '[CÇ]',
        n: '[nñ]', N: '[NÑ]'
    };

    let pattern = '';
    for (const ch of query) {
        if (ignoreAccents && map[ch]) pattern += map[ch];
        else pattern += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (wholeWord) {
        pattern = `(?<!\\p{L})${pattern}(?!\\p{L})`;
    }

    try {
        return new RegExp(pattern, 'giu');
    } catch (e) {
        // Fallback sem lookbehind
        if (wholeWord) {
            pattern = `(^|[^\\p{L}])(${pattern})(?=$|[^\\p{L}])`;
            return new RegExp(pattern, 'giu');
        }
        return new RegExp(pattern, 'giu');
    }
}
/**
 * Destaca palavras em um texto usando <mark> tag (regex configurável)
 */
function highlightText(text, query, options = {}) {
    if (!query) return text;
    const re = buildSearchRegex(query, options);
    if (!re) return text;
    return text.replace(re, (m, ...args) => {
        // Fallback pode criar grupos: prefixo (grupo 1) + match (grupo 2)
        const lastIsIndex = typeof args[args.length - 2] === 'number';
        const hasGroups = lastIsIndex && args.length >= 2;
        if (hasGroups && args[0] !== undefined && args[1] !== undefined) {
            const prefix = args[0] || '';
            const real = args[1];
            return `${prefix}<mark>${real}</mark>`;
        }
        return `<mark>${m}</mark>`;
    });
}

/**
 * Destaca palavras em todo o conteúdo HTML mantendo estrutura
 */
function highlightInDOM(html, query, options = {}) {
    if (!query) return html;
    const re = buildSearchRegex(query, options);

    // Parser temporário
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Função recursiva para destacar
    function highlightNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text || !re) return;
            if (!re.test(text)) return;
            const span = document.createElement('span');
            span.innerHTML = highlightText(text, query, options);
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (!['MARK', 'SCRIPT', 'STYLE', 'CODE'].includes(node.tagName)) {
                const children = Array.from(node.childNodes);
                children.forEach(highlightNode);
            }
        }
    }

    Array.from(temp.childNodes).forEach(highlightNode);
    return temp.innerHTML;
}

/**
 * Inicializa navegação ativa e scroll suave (unificados)
 */
let isManualClick = false; // Flag para pausar scrollspy durante cliques

function initActiveNavigation() {
    const sidebarLinksAll = document.querySelectorAll('.sidebar a[href^="#"]');
    // Evitar conflito com o toggle do submenu
    const allLinks = document.querySelectorAll('a[href^="#"]:not(.has-submenu)');

    // Função para atualizar link ativo (inclui submenu)
    function updateActiveLink(hash) {
        sidebarLinksAll.forEach(link => link.classList.remove('active'));

        const targetLink = Array.from(sidebarLinksAll).find(l => l.getAttribute('href') === hash);
        if (!targetLink) return;

        targetLink.classList.add('active');

        if (targetLink.classList.contains('submenu-item')) {
            const submenu = targetLink.closest('.submenu');
            if (submenu) {
                // Accordion: fechar outros submenus
                document.querySelectorAll('.submenu').forEach(sm => {
                    if (sm !== submenu) {
                        sm.classList.remove('open');
                        const p = sm.previousElementSibling;
                        if (p && p.classList.contains('has-submenu')) p.classList.remove('open');
                    }
                });
                submenu.classList.add('open');
                const parent = submenu.previousElementSibling;
                if (parent && parent.classList.contains('has-submenu')) {
                    parent.classList.add('open');
                    // Realce duplo: parent também ativo
                    parent.classList.add('active');
                }
            }
        }
    }

    // Definir active inicial
    const currentHash = window.location.hash || '#intro';
    updateActiveLink(currentHash);

    // Listener de clique: scroll suave + atualizar active
    allLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Pausar scrollspy por 1 segundo durante clique
                isManualClick = true;
                setTimeout(() => { isManualClick = false; }, 1000);

                // Atualizar hash (dispara hashchange)
                window.location.hash = targetId;

                // Scroll suave
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Garantir que .active seja aplicado imediatamente
                updateActiveLink(targetId);
            }
        });
    });

    // Listener de hashchange (navegação via histórico)
    window.addEventListener('hashchange', function () {
        updateActiveLink(window.location.hash);
    });
}

/**
 * Toggle do menu mobile
 */
/**
 * Atualiza ícone do botão toggle baseado no estado da sidebar
 */
function updateToggleIcon() {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (!sidebar || !menuIcon || !closeIcon) return;

    if (sidebar.classList.contains('open')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

function initMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    if (!sidebar || !menuToggle) return;

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        updateToggleIcon();
    });

    // Fechar ao clicar em um link (mobile)
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                updateToggleIcon();
            }
        });
    });

    // Fechar ao clicar fora (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            updateToggleIcon();
        }
    });

    // Inicializar estado do ícone
    updateToggleIcon();
}

/**
 * Observador de seções para destacar link ativo
 */
function initScrollSpy() {
    // Considera seções principais e subtítulos com ID (h2/h3)
    const sections = document.querySelectorAll('section[id], h2[id], h3[id]');
    // Incluir itens de submenu; apenas excluir o cabeçalho que abre submenu
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]:not(.has-submenu)');

    window.addEventListener('scroll', debounce(() => {
        // Não atualizar durante cliques manuais
        if (isManualClick) return;

        let current = '';
        let bestDist = Infinity;
        const anchorOffset = 140; // distância do topo para considerar "ativo"

        // Encontrar o heading/seção mais próximo do topo visível
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Considera apenas elementos visíveis na viewport (parcialmente)
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
            const dist = Math.abs(rect.top - anchorOffset);
            if (dist < bestDist) {
                bestDist = dist;
                current = section.getAttribute('id');
            }
        });

        // Atualizar highlights e abrir submenu se necessário (accordion)
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${current}`);
        if (activeLink) {
            activeLink.classList.add('active');
            if (activeLink.classList.contains('submenu-item')) {
                const submenu = activeLink.closest('.submenu');
                if (submenu) {
                    document.querySelectorAll('.submenu').forEach(sm => {
                        if (sm !== submenu) {
                            sm.classList.remove('open');
                            const p = sm.previousElementSibling;
                            if (p && p.classList.contains('has-submenu')) p.classList.remove('open');
                        }
                    });
                    submenu.classList.add('open');
                    const parent = submenu.previousElementSibling;
                    if (parent && parent.classList.contains('has-submenu')) {
                        parent.classList.add('open');
                        parent.classList.add('active');
                    }
                }
            }
        }
    }, 80));
}

/**
 * Função debounce para otimizar performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Busca no sidebar - Filtra links por texto com highlight em todo o documento
 */
function initSidebarSearch() {
    const searchInput = document.getElementById('sidebarSearch');
    const container = document.querySelector('.sidebar-search');
    const clearBtn = document.getElementById('btnClear');
    const navLinks = document.querySelectorAll('.sidebar a:not(.has-submenu)');
    const submenus = document.querySelectorAll('.submenu');
    const mainContent = document.querySelector('main');
    let originalContent = mainContent ? mainContent.innerHTML : '';
    const countEl = document.getElementById('searchCount');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    let marks = [];
    let currentIndex = -1;

    if (!searchInput) return; function updateToolbar() {
        const total = marks.length;
        const current = currentIndex >= 0 ? currentIndex + 1 : 0;
        if (countEl) {
            countEl.textContent = total > 0 ? `${current} de ${total}` : '0 resultados';
        }
        if (btnPrev) btnPrev.disabled = total === 0;
        if (btnNext) btnNext.disabled = total === 0;
    }

    function clearActive() {
        marks.forEach(m => m.classList.remove('mark-active'));
    }

    function goTo(index, { scroll = true } = {}) {
        if (marks.length === 0) {
            currentIndex = -1;
            updateToolbar();
            return;
        }
        currentIndex = (index + marks.length) % marks.length;
        clearActive();
        const el = marks[currentIndex];
        el.classList.add('mark-active');
        if (scroll) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updateToolbar();
    }

    function next() {
        if (marks.length === 0) return;
        const target = currentIndex < 0 ? 0 : currentIndex + 1;
        goTo(target);
    }

    function prev() {
        if (marks.length === 0) return;
        const target = currentIndex < 0 ? marks.length - 1 : currentIndex - 1;
        goTo(target);
    }

    searchInput.addEventListener('input', function (e) {
        const query = this.value.trim();
        const wholeWord = document.getElementById('optWholeWord')?.checked || false;
        const ignoreAccents = document.getElementById('optIgnoreAccents')?.checked !== false;
        const options = { wholeWord, ignoreAccents };

        // Atualiza estado visual do container
        if (container) {
            container.classList.toggle('has-value', query.length > 0);
            if (query.length > 0) container.classList.add('expanded');
        }

        // 1. Filtrar links no sidebar (sem highlight, apenas mostrar/ocultar)
        if (query.length > 0) {
            navLinks.forEach(link => {
                const text = link.textContent || '';
                const re = buildSearchRegex(query, options);
                const isMatch = !!(re && re.test(text));

                link.style.display = isMatch ? 'block' : 'none';
                // Não adicionar highlight no sidebar, apenas filtrar
            });
        } else {
            // Restaurar visibilidade
            navLinks.forEach(link => {
                link.style.display = 'block';
            });
        }

        // 2. Filtrar submenus (sem highlight, apenas mostrar/ocultar)
        if (query.length > 0) {
            submenus.forEach(submenu => {
                submenu.querySelectorAll('.submenu-item').forEach(item => {
                    const itemText = item.textContent || '';
                    const re = buildSearchRegex(query, options);
                    const match = !!(re && re.test(itemText));
                    item.style.display = match ? 'block' : 'none';
                    // Não adicionar highlight no sidebar
                });

                const hasVisibleAfterFilter = Array.from(submenu.querySelectorAll('.submenu-item'))
                    .some(item => item.style.display !== 'none');

                if (hasVisibleAfterFilter) {
                    submenu.classList.add('open');
                    const parentLink = submenu.previousElementSibling;
                    if (parentLink && parentLink.classList.contains('has-submenu')) {
                        parentLink.classList.add('open');
                    }
                }
            });
        } else {
            // Restaurar visibilidade
            submenus.forEach(submenu => {
                submenu.querySelectorAll('.submenu-item').forEach(item => {
                    item.style.display = 'block';
                });
            });
        }

        // 3. Destacar em todo o conteúdo principal
        if (mainContent && query.length > 0) {
            const highlightedContent = highlightInDOM(originalContent, query, options);
            mainContent.innerHTML = highlightedContent;
            marks = Array.from(mainContent.querySelectorAll('mark'));
            if (marks.length > 0) {
                goTo(0, { scroll: false });
            } else {
                currentIndex = -1;
                updateToolbar();
            }
        } else if (mainContent && query.length === 0) {
            mainContent.innerHTML = originalContent;
            marks = [];
            currentIndex = -1;
            updateToolbar();
            // Colapsa se vazio e sem foco
            setTimeout(() => {
                if (container && document.activeElement !== searchInput) {
                    container.classList.remove('expanded');
                }
            }, 0);
        }
    });

    // Expandir ao focar o input principal; não usamos blur para fechar (apenas clique fora controla fechamento)
    searchInput.addEventListener('focus', () => container?.classList.add('expanded'));

    // Garantir que interação nos botões de navegação mantenha expansão
    [btnNext, btnPrev].forEach(btn => {
        if (btn) {
            ['mousedown', 'click', 'focus'].forEach(ev => btn.addEventListener(ev, () => container?.classList.add('expanded')));
        }
    });

    // Manter expandido ao interagir com os checkboxes de opções
    const optionCheckboxes = container?.querySelectorAll('.sidebar-search-options input[type="checkbox"]') || [];
    optionCheckboxes.forEach(cb => {
        ['mousedown', 'click', 'focus', 'change'].forEach(ev => {
            cb.addEventListener(ev, () => container?.classList.add('expanded'));
        });
    });

    // Colapsa ao clicar fora se vazio
    document.addEventListener('click', (e) => {
        if (!container) return;
        const isInside = container.contains(e.target);
        if (!isInside && searchInput.value.trim().length === 0) {
            container.classList.remove('expanded');
        }
    });

    // Clique no hint '/' também foca o input
    document.getElementById('kbdShortcut')?.addEventListener('click', () => {
        searchInput.focus();
        container?.classList.add('expanded');
    });

    // Botão limpar
    clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
        container?.classList.remove('expanded');
    });

    // Opções de busca: reexecutar ao alternar
    document.getElementById('optWholeWord')?.addEventListener('change', () => {
        searchInput.dispatchEvent(new Event('input'));
    });
    document.getElementById('optIgnoreAccents')?.addEventListener('change', () => {
        searchInput.dispatchEvent(new Event('input'));
    });

    // Navegação pelos resultados
    btnNext?.addEventListener('click', () => next());
    btnPrev?.addEventListener('click', () => prev());

    // Teclado: Enter = próximo, Shift+Enter = anterior
    searchInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            if (ev.shiftKey) prev(); else next();
        }
    });

    // Limpar busca ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    });

    // Estado inicial da toolbar
    updateToolbar();

    // Atalhos globais: '/' foca busca, ESC limpa
    document.addEventListener('keydown', (ev) => {
        const tag = (ev.target && ev.target.tagName) ? ev.target.tagName.toLowerCase() : '';
        const isTyping = tag === 'input' || tag === 'textarea' || (ev.target && ev.target.isContentEditable);
        if (ev.key === '/' && !isTyping) {
            ev.preventDefault();
            searchInput.focus();
            searchInput.select();
            container?.classList.add('expanded');
        }
        if (ev.key === 'Escape') {
            if (searchInput.value.trim().length > 0) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            } else {
                container?.classList.remove('expanded');
            }
        }
    });
}

/**
 * Toggle de submenu - Expand/collapse com animação
 */
function initSubmenuToggle() {
    const menuItems = document.querySelectorAll('.sidebar a.has-submenu');

    menuItems.forEach(menuItem => {
        menuItem.addEventListener('click', function (e) {
            e.preventDefault();

            const submenu = this.nextElementSibling;
            if (!submenu || !submenu.classList.contains('submenu')) {
                return;
            }

            const opening = !submenu.classList.contains('open');
            // Accordion: fechar todos antes
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.remove('open');
                    const p = sm.previousElementSibling;
                    if (p && p.classList.contains('has-submenu')) p.classList.remove('open');
                }
            });

            if (opening) {
                this.classList.add('open');
                submenu.classList.add('open');
            } else {
                this.classList.remove('open');
                submenu.classList.remove('open');
            }

            const searchInput = document.getElementById('sidebarSearch');
            if (this.classList.contains('open') && searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });

    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
}

/**
 * Inicializar página quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function () {
    initActiveNavigation();
    initMobileMenu();
    initScrollSpy();
    initSidebarSearch();
    initSubmenuToggle();

    console.log('Ambiente de Prototipação Educacross - Página carregada');
});

