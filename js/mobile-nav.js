/**
 * Modern Mobile Navigation Handler
 * Features: Animated hamburger, body scroll lock, smooth transitions
 */

class MobileNavigation {
    constructor() {
        this.toggle = document.getElementById('navbar-toggle');
        this.menu = document.getElementById('navbar-menu');
        this.links = document.querySelectorAll('.navbar__link');
        this.isOpen = false;

        if (this.toggle && this.menu) {
            this.init();
        }
    }

    init() {
        // Create hamburger lines if not exist
        this.createHamburgerIcon();

        // Toggle button click
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close when clicking outside menu content (on overlay area)
        this.menu.addEventListener('click', (e) => {
            if (e.target === this.menu) {
                this.closeMenu();
            }
        });

        // Handle resize - close menu if window becomes desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    createHamburgerIcon() {
        // Check if hamburger already exists
        if (this.toggle.querySelector('.hamburger')) return;

        // Clear existing content (like <i> icon)
        this.toggle.innerHTML = '';

        // Create hamburger structure
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            line.className = 'hamburger__line';
            hamburger.appendChild(line);
        }

        this.toggle.appendChild(hamburger);

        // Add ARIA attributes
        this.toggle.setAttribute('aria-label', 'Menüyü aç/kapat');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.setAttribute('aria-controls', 'navbar-menu');
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('show-menu');
        this.toggle.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');

        // Lock body scroll
        document.body.classList.add('menu-open');
        document.body.style.top = `-${window.scrollY}px`;
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('show-menu');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');

        // Restore body scroll
        const scrollY = document.body.style.top;
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});

// Also export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}
