// Premium Motion Design & Scroll Animations
// LuksusEiendom 2026

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // --------------------------------------------------------
    // 1. Auto-Assign Animation Classes (if not already present)
    // --------------------------------------------------------
    const autoApplyAnimations = () => {
        // Typography: Soft Blur & Rise
        // Targets: h1, h2, p (inside main sections, excluding hero title which might have manual overrides)
        const textElements = document.querySelectorAll('h1, h2, h3, p, .btn-premium, .btn-primary, .btn-secondary');

        textElements.forEach(el => {
            // Skip elements that already have animation attributes
            if (el.hasAttribute('data-animate')) return;

            // Skip elements inside the slider wrapper to avoid conflicts
            if (el.closest('.luxury-slider-wrapper')) return;

            // Apply "blur-rise" as default for text
            el.setAttribute('data-animate', 'blur-rise');
        });

        // Cards & Grids: Staggered Cascade
        // We target specific sections identified by ID or class structure

        // Services / Pricing Cards
        const serviceCards = document.querySelectorAll('#tjenester .grid > div');
        serviceCards.forEach((card, i) => {
            card.setAttribute('data-animate', 'scale-up');
            // Stagger: 150ms difference
            card.setAttribute('data-delay', ((i + 1) * 150).toString());
        });

        // "Slik jobber vi" Steps
        const processSteps = document.querySelectorAll('#hvordan-det-fungerer .step-container, #hvordan-det-fungerer .grid > div:not(.hidden)');
        processSteps.forEach((step, i) => {
            step.setAttribute('data-animate', 'scale-up');
            step.setAttribute('data-delay', ((i + 1) * 150).toString());
        });

        // "Kontor" / Subscription Cards
        const subCards = document.querySelectorAll('#abonnement .grid > div');
        subCards.forEach((card, i) => {
            card.setAttribute('data-animate', 'scale-up');
            card.setAttribute('data-delay', ((i + 1) * 150).toString());
        });

        // "Samme fakta" List Items
        const factListItems = document.querySelectorAll('.space-y-4 li, .space-y-3 li');
        factListItems.forEach((li, i) => {
            // Only animate if parent container is visible/animated
            if (li.closest('[data-animate]')) {
                // If the parent is animated, the children should wait or animate with it. 
                // However, the prompt asks for staggered list items "one by one".
                // We'll trust the parent's "blur-rise" for the block, OR we can animate items.
                // Let's make items specifically animate if they are strictly list items in these sections.
                if (li.closest('ul')) {
                    li.setAttribute('data-animate', 'blur-rise');
                    // Reset delay modulo 3 or 4 to avoid huge delays in long lists
                    li.setAttribute('data-delay', ((i % 5) * 100).toString());
                }
            }
        });

        // Icons & Graphics: Pop Effect
        const icons = document.querySelectorAll('svg.w-8, .step-circle, .rounded-full');
        icons.forEach(icon => {
            if (!icon.hasAttribute('data-animate') && !icon.closest('.luxury-slider-wrapper')) {
                icon.setAttribute('data-animate', 'pop-in');
            }
        });

        // Slider Container: Parallax Reveal container (fade in from bottom)
        const sliderContainer = document.querySelector('.luxury-slider-wrapper');
        if (sliderContainer) {
            sliderContainer.setAttribute('data-animate', 'fade-up'); // Using standard fade-up for container
        }
    };

    autoApplyAnimations();

    // --------------------------------------------------------
    // 2. Intersection Observer (Trigger Animations)
    // --------------------------------------------------------
    const animateOnScroll = () => {
        // Select all elements with data-animate
        const elements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Add delay class if specified
                    const delay = el.getAttribute('data-delay');
                    if (delay) {
                        el.style.transitionDelay = `${delay}ms`;
                    }

                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15, // Wait until 15% visible
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Defer slightly to ensure DOM is fully parsed
    setTimeout(animateOnScroll, 50);

    // --------------------------------------------------------
    // 3. Parallax Effects (Scroll Linked)
    // --------------------------------------------------------

    // Large Images & Containers (Before/After Slider)
    // "Image moves slightly slower than scroll speed"
    const sliderWrapper = document.querySelector('.luxury-slider-wrapper');
    const sliderImages = sliderWrapper ? sliderWrapper.querySelectorAll('img') : [];

    // Hero Parallax
    const heroSection = document.querySelector('section.relative.h-[100dvh]');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Hero Parallax
        if (heroSection) {
            const heroContent = heroSection.querySelector('.max-w-6xl');
            if (heroContent && scrolled < windowHeight) {
                // Text moves down slightly
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / windowHeight) * 0.8;
            }
        }

        // Slider Parallax (Only when in view)
        if (sliderWrapper) {
            const rect = sliderWrapper.getBoundingClientRect();
            // Check if in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate position relative to viewport center
                const distanceFromCenter = (rect.top + rect.height / 2) - (windowHeight / 2);

                // Parallax Factor (Slow movement)
                const moveY = distanceFromCenter * 0.1; // 10% speed of scroll

                sliderImages.forEach(img => {
                    // Apply slight translation to images to create depth inside the container
                    // Note: This requires images to be slightly larger than container to avoid gaps
                    // We'll use scale to ensure coverage
                    img.style.transform = `scale(1.1) translateY(${moveY}px)`;
                    // Ensure we don't override other styles drastically, but 'transform' is main key here.
                    // Note: slider.js might need 'width', but transform is safe.
                });
            }
        }
    }, { passive: true });

    // --------------------------------------------------------
    // 4. Smooth Scroll for Anchors
    // --------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});
