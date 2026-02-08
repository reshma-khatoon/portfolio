// Particle Animation Background
function createParticles() {
    const container = document.getElementById('particle-container');
    const particleCount = 50; // Number of particles
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        particle.style.left = startX + 'px';
        particle.style.bottom = '-10px';
        
        // Random duration between 8s and 20s
        const duration = Math.random() * 12 + 8;
        particle.style.animationDuration = duration + 's';
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--tx', drift + 'px');
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        // Remove particle after animation completes to avoid memory issues
        setTimeout(() => {
            particle.remove();
        }, (duration + 2) * 1000);
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        setTimeout(createParticle, i * 100);
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (container.children.length < particleCount) {
            createParticle();
        }
    }, 500);
}

// Initialize particles when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
} else {
    createParticles();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Highlight active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1].value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#28a745';
            
            // Reset form
            this.reset();
            
            // Restore button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
            
            console.log('Form submitted:', { name, email, subject, message });
        } else {
            alert('Please fill in all required fields');
        }
    });
}

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'growWidth 1s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-progress').forEach(el => {
    observer.observe(el);
});

// Enhanced scroll flow animations
const flowAnimationObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for multiple elements
            const delay = index * 100;
            setTimeout(() => {
                entry.target.classList.add('flow-in');
            }, delay);
            flowAnimationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
});

// Apply flow animations to various elements
const flowElements = document.querySelectorAll('.project-card, .skill-category, .about-text, .about-info, .contact-item, section h2');

flowElements.forEach(el => {
    el.classList.add('flow-element');
    flowAnimationObserver.observe(el);
});

// Flow animations are now handling fade-in, so this observer is removed to avoid conflicts

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add keyboard navigation for projects
document.addEventListener('keydown', (e) => {
    const projectCards = document.querySelectorAll('.project-card');
    let currentIndex = -1;
    
    projectCards.forEach((card, index) => {
        if (document.activeElement === card) {
            currentIndex = index;
        }
    });
    
    if (e.key === 'ArrowRight' && currentIndex < projectCards.length - 1) {
        projectCards[currentIndex + 1].focus();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        projectCards[currentIndex - 1].focus();
    }
});

// Log when page loads
console.log('Portfolio loaded successfully!');

// Button/link click sound
// Get the correct path to the audio file (handles both root and subdirectory pages)
let audioPath = 'button-click-289742.mp3';
if (window.location.pathname.includes('/projects/') || window.location.pathname.includes('/1project/') || window.location.pathname.includes('/2project/') || window.location.pathname.includes('/3project/') || window.location.pathname.includes('/4project/') || window.location.pathname.includes('/5project/') || window.location.pathname.includes('/6project/') || window.location.pathname.includes('/7project/')) {
    audioPath = '../button-click-289742.mp3';
}

const clickAudio = new Audio(audioPath);
clickAudio.preload = 'auto';
clickAudio.volume = 0.5;

// Play sound on every click
document.addEventListener('click', function() {
    try {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
    } catch (err) {
        // Silent
    }
}, true);
