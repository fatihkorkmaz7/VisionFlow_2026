/* ===== MAIN APP JS ===== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize App
    initApp();
});

function initApp() {
    console.log('VisionFlow 2026 Initialized');

    setupNavbar();
    setupAnimations();
}

/* --- Navbar Logic --- */
function setupNavbar() {
    const navToggle = document.getElementById('navbar-toggle');
    const navClose = document.getElementById('navbar-close');
    const navMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Toggle Menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Close Menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Change Header Background on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY >= 50) {
            navbar.classList.add('glass');
            navbar.style.background = 'var(--bg-card)';
        } else {
            navbar.style.background = 'var(--bg-card)';
        }
    });
}

/* --- Scroll Animations --- */
function setupAnimations() {
    // Simple Intersection Observer for scroll animations if we want to trigger them on scroll
    // Currently using CSS animations that run on load, but this can be expanded

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate on scroll if needed
    // const animatedElements = document.querySelectorAll('.fade-in-up');
    // animatedElements.forEach(el => observer.observe(el));
}
