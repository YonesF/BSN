// Premium Motion Design & Scroll Animations
// LuksusEiendom 2025

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Skip animations if user prefers reduced motion
    }

    // Fade-in on scroll animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-animate="fade-up"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add parallax effect to hero section (subtle)
    const heroSection = document.querySelector('.relative.min-h-\\[80vh\\]');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = heroSection.querySelector('.relative.z-10');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        }, { passive: true });
    }

    // Add stagger delay to elements
    const addStaggerDelay = () => {
        const featureCards = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-4 > div');
        featureCards.forEach((card, index) => {
            card.setAttribute('data-animate', 'fade-up');
            card.setAttribute('data-animate-delay', (index * 100).toString());
        });
    };

    addStaggerDelay();
    
    // Re-initialize observer after adding attributes
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});
