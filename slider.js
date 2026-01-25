/**
 * LuksusEiendom Luxury Before/After Slider
 * PRODUCTION VERSION - Multi-instance support
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
            // Set initial position immediately
            this.updateSliderPosition();

            const images = this.container.querySelectorAll('img');

            // Check if images exist
            images.forEach((img, index) => {
                if (img.complete) {
                    // Already loaded
                } else {
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
                beforeImg.style.width = containerWidth + 'px';
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
            this.container.addEventListener('mousedown', (e) => this.handleStart(e));
            this.container.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
            this.container.addEventListener('mouseenter', () => this.handleHover(true));
            this.container.addEventListener('mouseleave', () => this.handleHover(false));

            // Global listeners for drag (bound to this instance)
            this.boundHandleMove = (e) => this.handleMove(e);
            this.boundHandleEnd = () => this.handleEnd();

            document.addEventListener('mousemove', this.boundHandleMove);
            document.addEventListener('mouseup', this.boundHandleEnd);
            document.addEventListener('touchmove', this.boundHandleMove, { passive: false });
            document.addEventListener('touchend', this.boundHandleEnd);

            window.addEventListener('resize', () => {
                this.fixBeforeImageWidth();
                this.updateSliderPosition();
            });
        }

        handleStart(e) {
            this.isDragging = true;
            this.container.classList.add('dragging');
            this.updatePosition(e);
        }

        handleMove(e) {
            if (this.isDragging) {
                e.preventDefault(); // Prevent scrolling on touch
                this.updatePosition(e);
            }
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
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

            // Calculate x relative to this container
            const x = clientX - rect.left;
            const width = rect.width;

            this.sliderPosition = Math.max(0, Math.min(100, (x / width) * 100));
            this.updateSliderPosition();
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

        // Find all elements with class 'luxury-slider-container' or 'luxury-slider-wrapper'
        // Using a common class selector is best practice here.
        // Based on existing HTML, the wrapper has class 'luxury-slider-wrapper'.
        const sliders = document.querySelectorAll('.luxury-slider-wrapper');

        if (sliders.length > 0) {
            console.log(`[SLIDER] Found ${sliders.length} sliders. Initializing...`);
            sliders.forEach(sliderEl => {
                new LuxurySlider(sliderEl);
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