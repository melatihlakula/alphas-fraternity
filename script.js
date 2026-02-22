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

// --- Added: centralized API base (forces localhost to use port 3000) ---
const API_BASE = (() => {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocalhost) {
        return `${window.location.protocol}//${window.location.hostname}:3000`;
    }
    return window.location.origin;
})();
function apiUrl(path) {
    // Ensure path starts with a slash
    return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
}
// --- end added ---

// Form Management
class FormManager {
    constructor() {
        this.contactForm = document.querySelector('#contactForm') || document.querySelector('.contact-form');
        this.formStatus = document.getElementById('formStatus'); // optional status element
        this.init();
    }

    init() {
        if (this.contactForm) {
            // Ensure only one listener is attached
            this.contactForm.removeEventListener('submit', this.handleSubmitBound);
            this.handleSubmitBound = (e) => this.handleSubmit(e);
            this.contactForm.addEventListener('submit', this.handleSubmitBound);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        
        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        // Optional: update #formStatus element if present
        const setFormStatus = (text, type = 'info') => {
            if (!this.formStatus) return;
            this.formStatus.className = 'mb-4 rounded-md px-4 py-3 text-sm';
            if (type === 'success') {
                this.formStatus.classList.add('bg-green-100', 'text-green-800');
            } else if (type === 'error') {
                this.formStatus.classList.add('bg-red-100', 'text-red-800');
            } else {
                this.formStatus.classList.add('bg-yellow-100', 'text-yellow-800');
            }
            this.formStatus.textContent = text;
        };

        try {
            // Submit to Node.js API using centralized apiUrl and retry helper
            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            setFormStatus('Sending message...', 'info');

            // Include honeypot field
            payload.website = formData.get('website') || '';

            const response = await Utils.fetchWithRetry(apiUrl('/api/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }, 3, 500);

            // If fetchWithRetry returned a Response object, parse and handle it.
            let result = {};
            try {
                result = await response.json();
            } catch (err) {
                // Non-JSON or empty response
                result = { success: response.ok, message: response.statusText || 'Unexpected response' };
            }

            if (result.success || (response && response.ok)) {
                // Show success message
                const successMsg = result.message || 'Message sent successfully! We\'ll get back to you soon.';
                this.showMessage(successMsg, 'success');
                setFormStatus(successMsg, 'success');
                this.contactForm.reset();
            } else {
                // Show error message (server responded with success:false)
                const errorMsg = result.error || result.message || 'Failed to send message. Please try again.';
                this.showMessage(errorMsg, 'error');
                setFormStatus(errorMsg, 'error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            // Show error message and allow retry by user
            this.showMessage('Failed to send message. Please check your connection and try again.', 'error');
            setFormStatus('Network error. Please try again.', 'error');
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            // Auto-clear status after a short delay
            if (this.formStatus) {
                setTimeout(() => {
                    if (this.formStatus) this.formStatus.textContent = '';
                }, 5000);
            }
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

    // --- added: robust fetch with retry + exponential backoff ---
    static async fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const resp = await fetch(url, options);
                // If server returned 429 (rate limit), honor Retry-After if provided
                if (resp.status === 429) {
                    const retryAfter = resp.headers.get('Retry-After');
                    const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : backoff * Math.pow(2, attempt);
                    if (attempt === retries) return resp; // return final response
                    await new Promise(r => setTimeout(r, waitMs));
                    continue;
                }
                // For other non-2xx responses, return response so caller can inspect JSON/status
                return resp;
            } catch (err) {
                // Network error: retry unless out of attempts
                if (attempt === retries) throw err;
                const waitMs = backoff * Math.pow(2, attempt);
                await new Promise(r => setTimeout(r, waitMs));
            }
        }
    }
    // --- end added ---
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
                const response = await fetch(apiUrl('/api/auth/verify'), {
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

// Scroll Reveal: elegant fade-in when sections enter viewport
class ScrollRevealManager {
    constructor() {
        this.selector = '.reveal, .reveal-stagger, .pledge-reveal';
        this.observer = null;
        this.init();
    }

    init() {
        if (typeof IntersectionObserver === 'undefined') {
            document.querySelectorAll(this.selector).forEach(el => el.classList.add('in-view'));
            return;
        }
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        document.querySelectorAll(this.selector).forEach(el => this.observer.observe(el));
    }
}

// Scroll progress bar (elegant top line)
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.transform = `scaleX(${height > 0 ? winScroll / height : 0})`;
    }
    window.addEventListener('scroll', () => requestAnimationFrame(update));
    update();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    // ThemeManager is now in theme.js and auto-initializes
    new NavigationManager();
    new FormManager();
    new AnimationManager();
    new ScrollRevealManager();
    initScrollProgress();
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

(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function showStatus(message, type = 'error', container = null) {
    // container element (if not provided, try to find #formStatus)
    var el = container || qs('#formStatus');
    if (!el) {
      // create a small status bar at top of body if none exists
      el = document.createElement('div');
      el.id = 'formStatus';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4';
      document.body.prepend(el);
    }

    // reset classes
    el.classList.remove('hidden', 'bg-red-100', 'bg-green-100', 'text-red-800', 'text-green-800', 'dark:bg-red-900', 'dark:bg-green-900', 'rounded-md', 'px-4', 'py-3');

    // apply simple styling (matches Tailwind-ish classes used in page)
    el.classList.add('rounded-md', 'px-4', 'py-3');
    if (type === 'success') {
      el.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900');
    } else {
      el.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900');
    }
    el.textContent = message;
    el.classList.remove('hidden');

    // auto-hide after 8s
    window.clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () {
      el.classList.add('hidden');
    }, 8000);
  }

  // show messages from URL query params (e.g. ?error=Bad+email or ?message=Thanks)
  function showFromQuery() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
      try { showStatus(decodeURIComponent(params.get('error')), 'error'); } catch (e) { showStatus(params.get('error'), 'error'); }
    } else if (params.has('message')) {
      try { showStatus(decodeURIComponent(params.get('message')), 'success'); } catch (e) { showStatus(params.get('message'), 'success'); }
    }
  }

  // Attach AJAX submit handler to forms marked data-ajax="true"
  function attachAjaxForms() {
    qsa('form[data-ajax="true"]').forEach(function (form) {
      form.addEventListener('submit', async function (ev) {
        ev.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.origText = submitBtn.innerText; submitBtn.innerText = 'Sending...'; }

        var action = form.getAttribute('action') || window.location.href;
        var method = (form.getAttribute('method') || 'POST').toUpperCase();
        var formData = new FormData(form);

        try {
          var res = await fetch(action, {
            method: method,
            body: formData,
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json'
            }
          });

          var contentType = res.headers.get('Content-Type') || '';
          var isJson = contentType.indexOf('application/json') !== -1;

          if (!res.ok) {
            // try to extract JSON error or text
            if (isJson) {
              var data = await res.json();
              var msg = data.error || data.message || JSON.stringify(data);
              showStatus(msg || ('Request failed: ' + res.status), 'error', qs('#formStatus'));
            } else {
              var txt = await res.text();
              showStatus(txt || ('Request failed: ' + res.status), 'error', qs('#formStatus'));
            }
            return;
          }

          // success
          if (isJson) {
            var body = await res.json();
            if (body.error) {
              showStatus(body.error, 'error', qs('#formStatus'));
            } else if (body.message) {
              showStatus(body.message, 'success', qs('#formStatus'));
              // optional: clear form on success
              form.reset();
            } else {
              showStatus('Success', 'success', qs('#formStatus'));
              form.reset();
            }
          } else {
            // non-json success — display server text
            var text = await res.text();
            showStatus(text || 'Success', 'success', qs('#formStatus'));
            form.reset();
          }
        } catch (err) {
          showStatus('Network error: ' + (err && err.message ? err.message : err), 'error', qs('#formStatus'));
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = submitBtn.dataset.origText || submitBtn.innerText;
          }
        }
      });
    });
  }

  // If a signup page redirects back with ?error=... or ?message=..., showFromQuery will display it.
  document.addEventListener('DOMContentLoaded', function () {
    showFromQuery();
    attachAjaxForms();
  });

  // Expose showStatus to the window for quick manual testing
  window.__showStatus = showStatus;

})();

// Note: Form submission is handled by FormManager class above
// This duplicate handler has been removed to prevent conflicts
