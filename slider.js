/**
 * LuksusEiendom Luxury Before/After Slider
 * Pure JavaScript implementation with intro animation
 * DEBUG VERSION with console logging
 */

(function() {
    'use strict';
    
    console.log('[SLIDER] Script loaded');

    class LuxurySlider {
        constructor(containerId) {
            console.log('[SLIDER] Constructor called with ID:', containerId);
            
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.error('[SLIDER] ? Container not found:', containerId);
                console.log('[SLIDER] Available elements with IDs:', 
                    Array.from(document.querySelectorAll('[id]')).map(el => el.id)
                );
                return;
            }

            console.log('[SLIDER] ? Container found:', this.container);

            this.sliderPosition = 0; // Start at 0 for intro animation
            this.isDragging = false;
            this.isHovered = false;
            
            this.init();
        }

        init() {
            console.log('[SLIDER] Initializing...');
            
            // Make sure images are loaded before initializing
            const images = this.container.querySelectorAll('img');
            console.log('[SLIDER] Found images:', images.length);
            
            let loadedCount = 0;
            
            const checkStart = () => {
                loadedCount++;
                console.log(`[SLIDER] Image loaded: ${loadedCount}/${images.length}`);
                if (loadedCount === images.length) {
                    this.startSlider();
                }
            };
            
            images.forEach((img, index) => {
                if (img.complete) {
                    console.log(`[SLIDER] Image ${index} already loaded:`, img.src);
                    checkStart();
                } else {
                    img.addEventListener('load', () => {
                        console.log(`[SLIDER] Image ${index} loaded:`, img.src);
                        checkStart();
                    });
                    img.addEventListener('error', (e) => {
                        console.error(`[SLIDER] Image ${index} failed to load:`, img.src);
                        checkStart(); // Still count it to avoid hanging
                    });
                }
            });
            
            // Fallback: start after 1 second even if images haven't loaded
            setTimeout(() => {
                if (loadedCount < images.length) {
                    console.warn('[SLIDER] Starting anyway - not all images loaded');
                    this.startSlider();
                }
            }, 1000);
        }

        startSlider() {
            console.log('[SLIDER] Starting slider functionality');
            this.fixBeforeImageWidth();
            this.setupEventListeners();
            this.runIntroAnimation();
        }

        fixBeforeImageWidth() {
            const beforeImg = this.container.querySelector('.before-image-container img');
            if (beforeImg) {
                const containerWidth = this.container.offsetWidth;
                beforeImg.style.width = containerWidth + 'px';
                console.log('[SLIDER] Fixed before-image width:', containerWidth + 'px');
            } else {
                console.error('[SLIDER] ? Before image not found');
            }
        }

        runIntroAnimation() {
            console.log('[SLIDER] Starting intro animation');
            
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
                } else {
                    console.log('[SLIDER] ? Intro animation complete');
                }
            };

            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 500);
        }

        setupEventListeners() {
            console.log('[SLIDER] Setting up event listeners');
            
            // Click/tap anywhere to jump
            this.container.addEventListener('mousedown', (e) => this.handleStart(e));
            this.container.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
            
            // Hover effect
            this.container.addEventListener('mouseenter', () => this.handleHover(true));
            this.container.addEventListener('mouseleave', () => this.handleHover(false));
            
            // Global move/end events
            document.addEventListener('mousemove', (e) => this.handleMove(e));
            document.addEventListener('mouseup', () => this.handleEnd());
            document.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
            document.addEventListener('touchend', () => this.handleEnd());
            
            // Recalculate on window resize
            window.addEventListener('resize', () => {
                this.fixBeforeImageWidth();
                this.updateSliderPosition();
            });

            console.log('[SLIDER] ? Event listeners attached');
        }

        handleStart(e) {
            console.log('[SLIDER] Drag started');
            this.isDragging = true;
            this.container.classList.add('dragging');
            this.updatePosition(e);
        }

        handleMove(e) {
            if (this.isDragging) {
                e.preventDefault();
                this.updatePosition(e);
            }
        }

        handleEnd() {
            if (this.isDragging) {
                console.log('[SLIDER] Drag ended');
            }
            this.isDragging = false;
            this.container.classList.remove('dragging');
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

            // Fade labels near edges
            if (beforeLabel) {
                beforeLabel.style.opacity = this.sliderPosition < 10 ? '0' : '1';
            }
            if (afterLabel) {
                afterLabel.style.opacity = this.sliderPosition > 90 ? '0' : '1';
            }
        }
    }

    // Initialize slider when DOM is ready
    function initSlider() {
        console.log('[SLIDER] DOM State:', document.readyState);
        console.log('[SLIDER] Initializing LuxurySlider...');
        
        const slider = new LuxurySlider('luxury-slider-container');
        
        if (slider.container) {
            console.log('[SLIDER] ? Slider initialized successfully!');
        } else {
            console.error('[SLIDER] ? Slider initialization failed!');
        }
    }

    if (document.readyState === 'loading') {
        console.log('[SLIDER] Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        console.log('[SLIDER] DOM already loaded, initializing immediately');
        initSlider();
    }
})();