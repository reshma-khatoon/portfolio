const THEME_KEY = 'portfolio-theme';
const rootEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

function createStarfield() {
    let layer = document.getElementById('starfield');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'starfield';
        document.body.insertBefore(layer, document.body.firstChild);
    }

    layer.innerHTML = '';
    const count = Math.min(90, Math.max(60, Math.floor(window.innerWidth / 14)));

    for (let i = 0; i < count; i += 1) {
        const star = document.createElement('span');
        star.className = 'star';
        const size = (Math.random() * 1.6 + 0.5).toFixed(2);
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = Math.random() * 3 + 3.2;
        const driftX = (Math.random() - 0.5) * 10;
        const driftY = (Math.random() - 0.5) * 10;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        star.style.setProperty('--drift-x', `${driftX}px`);
        star.style.setProperty('--drift-y', `${driftY}px`);
        star.style.opacity = `${0.2 + Math.random() * 0.8}`;
        layer.appendChild(star);
    }
}

function createParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    container.innerHTML = '';
    const particleCount = Math.min(30, Math.max(16, Math.floor(window.innerWidth / 40)));

    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = (Math.random() * 5 + 1).toFixed(2);
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 12;
        const drift = (Math.random() - 0.5) * 220;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = '105%';
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        particle.style.setProperty('--drift', `${drift}px`);
        container.appendChild(particle);
    }
}

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme, { persist = true } = {}) {
    rootEl.setAttribute('data-theme', theme);
    rootEl.style.colorScheme = theme;

    if (themeToggleBtn) {
        const icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
        themeToggleBtn.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
        themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    if (persist) {
        localStorage.setItem(THEME_KEY, theme);
    }
}

function toggleTheme() {
    const current = rootEl.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

function handleNavToggle() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });
}

function handleRevealAnimations() {
    const flowElements = document.querySelectorAll('.project-card, .skill-category, .about-text, .about-info, .contact-item, section h2, .hero-content, .hero-avatar, .about-image, .about-text-section');
    flowElements.forEach((element) => {
        element.classList.add('flow-element');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('flow-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    flowElements.forEach((element) => observer.observe(element));
}

function handleActiveNav() {
    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset || window.scrollY;
                if (navbar) {
                    navbar.style.boxShadow = currentScroll > 100
                        ? '0 10px 24px rgba(2, 8, 23, 0.12)'
                        : '0 2px 12px rgba(2, 8, 23, 0.08)';
                }

                let current = '';
                const sections = document.querySelectorAll('section[id]');
                sections.forEach((section) => {
                    const sectionTop = section.offsetTop;
                    if (currentScroll >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                document.querySelectorAll('.nav-links a').forEach((link) => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href && href.includes(current)) {
                        link.classList.add('active');
                    }
                });

                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        if (name && email && message) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            this.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        } else {
            alert('Please fill in all required fields');
        }
    });
}

function initSkillProgress() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'growWidth 1s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -90px 0px'
    });

    document.querySelectorAll('.skill-progress').forEach((el) => observer.observe(el));
}

function initThemeToggle() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `html { transition: background-color 250ms ease, color 250ms ease; } * { transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease; }`;
    document.head.appendChild(styleEl);

    setTheme(getInitialTheme(), { persist: false });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleTheme();
        });
    }
}

function initAudio() {
    let audioPath = 'button-click-289742.mp3';
    if (window.location.pathname.includes('/projects/') || window.location.pathname.includes('/1project/') || window.location.pathname.includes('/2project/') || window.location.pathname.includes('/3project/') || window.location.pathname.includes('/4project/') || window.location.pathname.includes('/5project/') || window.location.pathname.includes('/6project/') || window.location.pathname.includes('/7project/')) {
        audioPath = '../button-click-289742.mp3';
    }

    const clickAudio = new Audio(audioPath);
    clickAudio.preload = 'auto';
    clickAudio.volume = 0.5;

    document.addEventListener('click', () => {
        try {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(() => {});
        } catch (error) {
            // Ignore audio errors silently.
        }
    }, true);
}

function init() {
    createStarfield();
    createParticles();
    handleNavToggle();
    handleSmoothScroll();
    handleRevealAnimations();
    handleActiveNav();
    initContactForm();
    initSkillProgress();
    initThemeToggle();
    initAudio();
    window.addEventListener('resize', () => {
        createStarfield();
        createParticles();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


