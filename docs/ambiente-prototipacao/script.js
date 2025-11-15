/**
 * SCRIPT DA PÁGINA - AMBIENTE DE PROTOTIPAÇÃO
 * Funcionalidades interativas e navegação
 */

document.addEventListener('DOMContentLoaded', function () {

    // Gerenciamento do menu lateral ativo
    initActiveNavigation();

    // Scroll suave para âncoras
    initSmoothScroll();

    // Toggle menu mobile
    initMobileMenu();

    // Observador de seções para menu ativo
    initScrollSpy();

    console.log('Ambiente de Prototipação Educacross - Página carregada');
});

/**
 * Inicializa navegação ativa baseada no hash da URL
 */
function initActiveNavigation() {
    const links = document.querySelectorAll('.sidebar a');
    const currentHash = window.location.hash || '#intro';

    links.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll suave para links de âncora
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Remover classe active de todos os links
                document.querySelectorAll('.sidebar a').forEach(l => {
                    l.classList.remove('active');
                });

                // Adicionar active no link clicado
                this.classList.add('active');

                // Scroll suave
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Atualizar URL sem recarregar
                history.pushState(null, null, targetId);

                // Fechar menu mobile se aberto
                const sidebar = document.querySelector('.sidebar');
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            }
        });
    });
}

/**
 * Toggle do menu mobile
 */
function initMobileMenu() {
    // Criar botão de menu se não existir
    const header = document.querySelector('header');
    let menuToggle = document.querySelector('.menu-toggle');

    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Toggle menu');
        header.insertBefore(menuToggle, header.firstChild);
    }

    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuToggle.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    // Fechar menu ao clicar fora (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                menuToggle.innerHTML = '☰';
            }
        }
    });
}

/**
 * Observa seções visíveis e atualiza menu ativo
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remover active de todos
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Adicionar active no link correspondente
                const activeLink = document.querySelector(`.sidebar a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                // Atualizar URL
                history.replaceState(null, null, `#${id}`);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Utilitário: debounce para performance
 */
function debounce(func, wait = 10) {
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
 * Adicionar indicador de progresso de leitura (opcional)
 */
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 64px;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--accent);
        z-index: 100;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', debounce(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }));
}

// Inicializar indicador de progresso de leitura
// initReadingProgress(); // Descomentar se desejar ativar
