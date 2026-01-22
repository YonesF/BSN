// SECURITY: XSS-safe implementation with enhanced error handling
// FIXED: Simplified slider that just reveals the after image
(function() {
    'use strict';
    
    // Get DOM elements
    const sliderRange = document.getElementById('slider-range');
    const afterImageContainer = document.getElementById('after-image-container');
    const sliderHandle = document.getElementById('slider-handle');
    const beforeImage = document.getElementById('before-image');
    const afterImage = document.getElementById('after-image');

    // Validate all required elements exist
    if (!sliderRange || !afterImageContainer || !sliderHandle) {
        console.error('Slider elements not found');
        return;
    }

    console.log('Slider initialized successfully');

    // SECURITY: Enhanced sanitization and validation
    function sanitizeSliderValue(value) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            return 50;
        }
        
        const numValue = parseInt(value, 10);
        
        if (isNaN(numValue) || !isFinite(numValue)) {
            return 50;
        }
        
        return Math.max(0, Math.min(100, numValue));
    }

    // Handle slider input - SIMPLE APPROACH
    function handleSliderInput(event) {
        const rawValue = event.target.value;
        const sanitizedValue = sanitizeSliderValue(rawValue);
        
        // Only change container width - that's it!
        afterImageContainer.style.width = sanitizedValue + '%';
        sliderHandle.style.left = sanitizedValue + '%';
    }

    // Attach event listener
    sliderRange.addEventListener('input', handleSliderInput);

    // Initialize on load
    handleSliderInput({ target: { value: 50 } });

    // SECURITY: Enhanced image error handling with fallback chain
    if (beforeImage) {
        let beforeErrorCount = 0;
        beforeImage.addEventListener('error', function() {
            beforeErrorCount++;
            console.error('Before image failed to load:', this.src);
            
            if (beforeErrorCount === 1) {
                this.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop';
            } else if (beforeErrorCount === 2) {
                this.style.display = 'none';
            }
        }, { once: false });
        
        beforeImage.addEventListener('load', function() {
            console.log('Before image loaded successfully');
        });
    }

    if (afterImage) {
        let afterErrorCount = 0;
        afterImage.addEventListener('error', function() {
            afterErrorCount++;
            console.error('After image failed to load:', this.src);
            
            if (afterErrorCount === 1) {
                this.src = 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1976&auto=format&fit=crop';
            } else if (afterErrorCount === 2) {
                this.style.display = 'none';
            }
        }, { once: false });
        
        afterImage.addEventListener('load', function() {
            console.log('After image loaded successfully');
        });
    }
})();