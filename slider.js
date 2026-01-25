/**
 * LuksusEiendom Luxury Before/After Slider
 * PRODUCTION VERSION - Multi-instance support with robust event handling
 */

(function () {
    'use strict';

    console.log('[SLIDER] ?? Script loaded and executing');

    class LuxurySlider {
        constructor(container) {
            // Support both ID string and DOM element
            if (typeof container === 'string') {
                this.container = document.getElementById(container);
            } else {
                this.container = container;
            }

            if (!this.container) {
                console.error('[SLIDER] ? Container not found');
                return;
            }

            // Generate a unique ID for logging if none exists
            this.id = this.container.id || 'slider-' + Math.random().toString(36).substr(2, 9);
            console.log('[SLIDER] ?? Initializing slider instance:', this.id);

            this.sliderPosition = 50; // Start at 50% immediately
            this.isDragging = false;
            this.isHovered = false;

            this.init();
        }

        init() {
            // Set initial position immediately to avoid layout shift or zero width
            this.updateSliderPosition();

            const images = this.container.querySelectorAll('img');

            // Wait for images to load, but don't block initialization
            images.forEach((img, index) => {
                if (!img.complete) {
                    img.addEventListener('load', () => {
                        console.log(`[SLIDER:${this.id}] ? Image ${index} loaded`);
                    });
                    img.addEventListener('error', (e) => {
                        console.error(`[SLIDER:${this.id}] ? Image ${index} failed to load:`, img.src);
                    });
                }
            });

            // Start slider immediately (don't wait for images)
            setTimeout(() => {
                this.startSlider();
            }, 100);
        }

        startSlider() {
            this.fixBeforeImageWidth();
            this.setupEventListeners();
            this.runIntroAnimation();
        }

        fixBeforeImageWidth() {
            const beforeContainer = this.container.querySelector('.before-image-container');
            const beforeImg = beforeContainer?.querySelector('img');

            if (beforeContainer && beforeImg) {
                const containerWidth = this.container.offsetWidth;
                if (containerWidth > 0) {
                    beforeImg.style.width = containerWidth + 'px';
                }
            }
        }

        runIntroAnimation() {
            const start = 0;
            const end = 50;
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 4);

                this.sliderPosition = start + (end - start) * easeOut;
                this.updateSliderPosition();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 500);
        }

        setupEventListeners() {
            // Bind methods to this instance
            this.handleStart = this.handleStart.bind(this);
            this.handleMove = this.handleMove.bind(this);
            this.handleEnd = this.handleEnd.bind(this);
            this.handleHover = this.handleHover.bind(this);

            // Container-specific listeners (start dragging)
            this.container.addEventListener('mousedown', this.handleStart);
            this.container.addEventListener('touchstart', this.handleStart, { passive: false });

            this.container.addEventListener('mouseenter', () => this.handleHover(true));
            this.container.addEventListener('mouseleave', () => this.handleHover(false));

            // Global listeners (move/end dragging)
            document.addEventListener('mousemove', this.handleMove);
            document.addEventListener('mouseup', this.handleEnd);
            document.addEventListener('touchmove', this.handleMove, { passive: false });
            document.addEventListener('touchend', this.handleEnd);

            window.addEventListener('resize', () => {
                this.fixBeforeImageWidth();
                this.updateSliderPosition();
            });
        }

        handleStart(e) {
            // Only left mouse button or touch
            if (e.type === 'mousedown' && e.button !== 0) return;

            this.isDragging = true;
            this.container.classList.add('dragging');

            // Prevent text selection
            e.preventDefault();

            this.updatePosition(e);
        }

        handleMove(e) {
            if (!this.isDragging) return;

            e.preventDefault(); // Prevent scrolling on touch while dragging
            this.updatePosition(e);
        }

        handleEnd() {
            if (this.isDragging) {
                this.isDragging = false;
                this.container.classList.remove('dragging');
            }
        }

        handleHover(isHovered) {
            this.isHovered = isHovered;
            const instruction = this.container.querySelector('.slider-instruction');
            if (instruction) {
                instruction.style.opacity = isHovered || this.isDragging ? '0' : '0.8';
            }
        }

        updatePosition(e) {
            const rect = this.container.getBoundingClientRect();
            let clientX;

            if (e.type.includes('touch')) {
                // Use the first touch
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }

            // Calculate x relative to this container
            const x = clientX - rect.left;
            const width = rect.width;

            if (width > 0) {
                this.sliderPosition = Math.max(0, Math.min(100, (x / width) * 100));
                this.updateSliderPosition();
            }
        }

        updateSliderPosition() {
            const beforeContainer = this.container.querySelector('.before-image-container');
            const handle = this.container.querySelector('.slider-handle');
            const beforeLabel = this.container.querySelector('.before-label');
            const afterLabel = this.container.querySelector('.after-label');

            if (beforeContainer) {
                beforeContainer.style.width = `${this.sliderPosition}%`;
            }

            if (handle) {
                handle.style.left = `${this.sliderPosition}%`;
            }

            if (beforeLabel) {
                beforeLabel.style.opacity = this.sliderPosition < 10 ? '0' : '1';
            }
            if (afterLabel) {
                afterLabel.style.opacity = this.sliderPosition > 90 ? '0' : '1';
            }
        }
    }

    // Initialize when DOM is ready
    function initSlider() {
        console.log('[SLIDER] ?? DOM State:', document.readyState);

        // Find all elements with class 'luxury-slider-wrapper'
        const sliders = document.querySelectorAll('.luxury-slider-wrapper');

        if (sliders.length > 0) {
            console.log(`[SLIDER] Found ${sliders.length} sliders. Initializing...`);
            sliders.forEach(sliderEl => {
                // Prevention against double initialization if script runs twice
                if (sliderEl.dataset.sliderInitialized) return;

                new LuxurySlider(sliderEl);
                sliderEl.dataset.sliderInitialized = 'true';
            });
        } else {
            console.warn('[SLIDER] No sliders found with class .luxury-slider-wrapper');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }
})();