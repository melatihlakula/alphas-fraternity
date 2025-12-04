// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        if (this.hamburger) {
            this.setupMobileMenu();
        }
        this.setupSmoothScrolling();
        this.setupScrollEffects();
    }

    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            if (this.mobileMenu) {
                this.mobileMenu.classList.toggle('hidden');
            }
            // Animate hamburger
            this.hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        if (this.mobileMenu) {
            const mobileLinks = this.mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.mobileMenu) {
                        this.mobileMenu.classList.add('hidden');
                    }
                    if (this.hamburger) {
                        this.hamburger.classList.remove('active');
                    }
                });
            });
        }
    }

    setupSmoothScrolling() {
        // Handle both desktop and mobile navigation links
        const allNavLinks = document.querySelectorAll('a[href^="#"]');
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                // Only prevent default for anchor links (not external links)
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for navbar styling
            if (this.navbar) {
                if (scrollTop > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
                
                // Hide/show navbar on scroll (optional effect)
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Form Management
class FormManager {
    constructor() {
        this.contactForm = document.querySelector('#contactForm') || document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        
        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Submit to Node.js API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message')
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                this.showMessage(result.message || 'Message sent successfully! We\'ll get back to you soon.', 'success');
                this.contactForm.reset();
            } else {
                // Show error message
                this.showMessage(result.message || 'Failed to send message. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            // Show error message
            this.showMessage('Failed to send message. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            background: ${type === 'success' ? 'var(--accent)' : '#dc3545'};
            color: white;
        `;
        
        // Insert message after form title or at top of form
        const formTitle = this.contactForm.querySelector('h3');
        if (formTitle) {
            formTitle.parentNode.insertBefore(messageDiv, formTitle.nextSibling);
        } else {
            // If no title, insert at the beginning of the form
            this.contactForm.insertBefore(messageDiv, this.contactForm.firstChild);
        }
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.value-item, .feature, .contact-item');
        animateElements.forEach(el => observer.observe(el));
    }

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.wolf-silhouette, .pack-symbol');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Authentication Check for Navigation
class AuthNavManager {
    constructor() {
        this.init();
    }

    async init() {
        // Check if user is logged in
        const sessionId = localStorage.getItem('sessionId');
        
        if (sessionId) {
            try {
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'X-Session-Id': sessionId,
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // User is logged in - show Admin link, hide Login and Sign Up links
                    const adminLink = document.getElementById('adminLink');
                    const loginLink = document.getElementById('loginLink');
                    const signupLink = document.getElementById('signupLink');
                    const mobileAdminLink = document.getElementById('mobileAdminLink');
                    const mobileLoginLink = document.getElementById('mobileLoginLink');
                    const mobileSignupLink = document.getElementById('mobileSignupLink');
                    
                    if (adminLink) {
                        adminLink.classList.remove('hidden');
                    }
                    if (loginLink) {
                        loginLink.classList.add('hidden');
                    }
                    if (signupLink) {
                        signupLink.classList.add('hidden');
                    }
                    if (mobileAdminLink) {
                        mobileAdminLink.classList.remove('hidden');
                    }
                    if (mobileLoginLink) {
                        mobileLoginLink.classList.add('hidden');
                    }
                    if (mobileSignupLink) {
                        mobileSignupLink.classList.add('hidden');
                    }
                } else {
                    // Session invalid - show Login and Sign Up links, hide Admin link
                    this.showLoginLinks();
                }
            } catch (error) {
                // Error checking - show Login link
                this.showLoginLinks();
            }
        } else {
            // No session - show Login link
            this.showLoginLinks();
        }
    }

    showLoginLinks() {
        const adminLink = document.getElementById('adminLink');
        const loginLink = document.getElementById('loginLink');
        const signupLink = document.getElementById('signupLink');
        const mobileAdminLink = document.getElementById('mobileAdminLink');
        const mobileLoginLink = document.getElementById('mobileLoginLink');
        const mobileSignupLink = document.getElementById('mobileSignupLink');
        
        if (adminLink) {
            adminLink.classList.add('hidden');
        }
        if (loginLink) {
            loginLink.classList.remove('hidden');
        }
        if (signupLink) {
            signupLink.classList.remove('hidden');
        }
        if (mobileAdminLink) {
            mobileAdminLink.classList.add('hidden');
        }
        if (mobileLoginLink) {
            mobileLoginLink.classList.remove('hidden');
        }
        if (mobileSignupLink) {
            mobileSignupLink.classList.remove('hidden');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    // ThemeManager is now in theme.js and auto-initializes
    new NavigationManager();
    new FormManager();
    new AnimationManager();
    const authNavManager = new AuthNavManager(); // Check auth status for navigation
    
    // Refresh navigation when page becomes visible (e.g., returning from login/signup)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, refresh auth status
            authNavManager.init();
        }
    });
    
    // Also refresh when window gains focus (useful for tab switching)
    window.addEventListener('focus', () => {
        authNavManager.init();
    });
    
    // Add some additional interactive features
    setupInteractiveFeatures();
});

function setupInteractiveFeatures() {
    // Add hover effects to value items
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add scroll-triggered animations
    const scrollElements = document.querySelectorAll('.section-title, .about-text, .brotherhood-text');
    scrollElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    scrollElements.forEach(element => scrollObserver.observe(element));
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .navbar.scrolled {
        background: var(--nav-bg);
        box-shadow: 0 2px 20px var(--shadow);
    }
    
    .navbar {
        transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }
    
    @media (max-width: 768px) {
        #mobileMenu {
            z-index: 40;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
