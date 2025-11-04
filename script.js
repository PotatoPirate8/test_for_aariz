// Responsive Website with Interactive Features
class ResponsiveWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.handleResize();
    }

    init() {
        // Detect device type
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1200;
        this.isDesktop = window.innerWidth > 1200;
        
        // Track scroll position
        this.lastScrollTop = 0;
        
        // Apply initial responsive adjustments
        this.applyResponsiveLayout();
    }

    setupEventListeners() {
        // Responsive resize handler with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Touch events for mobile
        if ('ontouchstart' in window) {
            this.setupTouchEvents();
        }

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Page visibility
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    handleResize() {
        const newWidth = window.innerWidth;
        const previousIsMobile = this.isMobile;
        const previousIsTablet = this.isTablet;
        
        // Update device type
        this.isMobile = newWidth <= 768;
        this.isTablet = newWidth > 768 && newWidth <= 1200;
        this.isDesktop = newWidth > 1200;

        // Apply responsive layout
        this.applyResponsiveLayout();

        // Log breakpoint changes
        if (previousIsMobile !== this.isMobile || previousIsTablet !== this.isTablet) {
            console.log(`Breakpoint changed: ${this.getDeviceType()}`);
            this.adjustAnimations();
        }

        // Update viewport height for mobile browsers
        this.updateViewportHeight();
    }

    applyResponsiveLayout() {
        const container = document.querySelector('.container');
        const heroImage = document.querySelector('.hero-image');
        const title = document.querySelector('.title');
        const relumeLogo = document.querySelector('.relume-logo');

        if (this.isMobile) {
            // Mobile-specific adjustments
            container?.setAttribute('data-device', 'mobile');
            this.adjustMobileLayout();
        } else if (this.isTablet) {
            // Tablet-specific adjustments
            container?.setAttribute('data-device', 'tablet');
            this.adjustTabletLayout();
        } else {
            // Desktop-specific adjustments
            container?.setAttribute('data-device', 'desktop');
            this.adjustDesktopLayout();
        }

        // Adjust image loading strategy
        this.optimizeImages();
    }

    adjustMobileLayout() {
        const heroImage = document.querySelector('.hero-image');
        const badge = document.querySelector('.badge');
        
        // Add mobile-specific classes
        heroImage?.classList.add('mobile-optimized');
        badge?.classList.add('mobile-badge');
        
        // Adjust for smaller screens
        this.scaleElementsForMobile();
    }

    adjustTabletLayout() {
        const heroImage = document.querySelector('.hero-image');
        const badge = document.querySelector('.badge');
        
        // Remove mobile classes
        heroImage?.classList.remove('mobile-optimized');
        badge?.classList.remove('mobile-badge');
        
        // Add tablet classes
        heroImage?.classList.add('tablet-optimized');
    }

    adjustDesktopLayout() {
        const heroImage = document.querySelector('.hero-image');
        
        // Remove mobile/tablet classes
        heroImage?.classList.remove('mobile-optimized', 'tablet-optimized');
    }

    scaleElementsForMobile() {
        // Dynamic scaling for very small screens
        const minWidth = 320;
        const currentWidth = window.innerWidth;
        
        if (currentWidth < minWidth) {
            const scale = currentWidth / minWidth;
            document.body.style.setProperty('--mobile-scale', scale);
        } else {
            document.body.style.removeProperty('--mobile-scale');
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        
        // Parallax effect for background logo
        this.applyParallax(scrollTop);
        
        // Show/hide elements based on scroll
        this.handleScrollVisibility(scrollTop, scrollDirection);
        
        this.lastScrollTop = scrollTop;
    }

    applyParallax(scrollTop) {
        const figmaLogo = document.querySelector('.figma-logo-background');
        const heroImage = document.querySelector('.hero-image');
        
        if (figmaLogo && !this.isMobile) {
            const parallaxSpeed = 0.3;
            figmaLogo.style.transform = `translate(-50%, -50%) translateX(12%) translateY(${scrollTop * parallaxSpeed}px)`;
        }
        
        if (heroImage && !this.isMobile) {
            const parallaxSpeed = 0.15;
            heroImage.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
        }
    }

    handleScrollVisibility(scrollTop, direction) {
        const relumeLogo = document.querySelector('.relume-logo');
        
        if (scrollTop > 100) {
            relumeLogo?.classList.add('scrolled');
        } else {
            relumeLogo?.classList.remove('scrolled');
        }
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Detect swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    this.handleSwipe(deltaX > 0 ? 'right' : 'left');
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }

    handleSwipe(direction) {
        console.log(`Swipe detected: ${direction}`);
        // Add custom swipe functionality here if needed
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading for images below the fold
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }

            // Add responsive image handling
            if (!img.complete) {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }

    updateViewportHeight() {
        // Fix for mobile browsers (address bar height issue)
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.classList.add('paused');
        } else {
            // Resume animations
            document.body.classList.remove('paused');
        }
    }

    getDeviceType() {
        if (this.isMobile) return 'Mobile';
        if (this.isTablet) return 'Tablet';
        return 'Desktop';
    }

    // Public method to get current breakpoint
    getCurrentBreakpoint() {
        return {
            type: this.getDeviceType(),
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop
        };
    }

    adjustAnimations() {
        // Reduce animations on mobile for better performance
        const animatedElements = document.querySelectorAll('[class*="fade"], [class*="slide"]');
        
        if (this.isMobile) {
            animatedElements.forEach(el => {
                el.style.animationDuration = '0.4s';
            });
        } else {
            animatedElements.forEach(el => {
                el.style.animationDuration = '';
            });
        }
    }
}

// Utility functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get device info
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            touchSupport: 'ontouchstart' in window,
            orientation: window.screen.orientation?.type || 'unknown'
        };
    }
};

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            lastFrameTime: performance.now(),
            frameCount: 0
        };
        this.startMonitoring();
    }

    startMonitoring() {
        if (window.requestAnimationFrame) {
            this.measureFPS();
        }
    }

    measureFPS() {
        const now = performance.now();
        this.metrics.frameCount++;
        
        if (now >= this.metrics.lastFrameTime + 1000) {
            this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / (now - this.metrics.lastFrameTime));
            this.metrics.frameCount = 0;
            this.metrics.lastFrameTime = now;
            
            // Adjust quality based on FPS
            if (this.metrics.fps < 30) {
                this.reduceQuality();
            }
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }

    reduceQuality() {
        // Disable heavy animations if FPS is low
        document.body.classList.add('low-performance');
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize responsive website
    window.responsiveWebsite = new ResponsiveWebsite();
    
    // Initialize performance monitor
    window.performanceMonitor = new PerformanceMonitor();
    
    // Log initial device info
    console.log('Device Info:', utils.getDeviceInfo());
    console.log('Current Breakpoint:', window.responsiveWebsite.getCurrentBreakpoint());
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Prevent zoom on double tap (mobile)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    console.log('✅ Responsive Website Initialized');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveWebsite, utils, PerformanceMonitor };
}
