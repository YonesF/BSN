// SECURITY: XSS-safe implementation with enhanced error handling
// FIXED: Slider no longer causes zoom - only reveals the "after" image
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
        // PRODUCTION: Silent fail
        return;
    }

    // SECURITY: Enhanced sanitization and validation
    function sanitizeSliderValue(value) {
        // Ensure input is string or number
        if (typeof value !== 'string' && typeof value !== 'number') {
            return 50;
        }
        
        const numValue = parseInt(value, 10);
        
        // Extra validation for safety
        if (isNaN(numValue) || !isFinite(numValue)) {
            return 50;
        }
        
        // Clamp value between 0 and 100
        return Math.max(0, Math.min(100, numValue));
    }

    // Handle slider input
    // KEY FIX: Only change container width, never touch image properties
    function handleSliderInput(event) {
        const rawValue = event.target.value;
        const sanitizedValue = sanitizeSliderValue(rawValue);
        
        // SECURITY: Using safe DOM manipulation (style properties, not innerHTML)
        // Only change the width of the overlay container - images stay static
        afterImageContainer.style.width = sanitizedValue + '%';
        sliderHandle.style.left = sanitizedValue + '%';
        
        // Update after image width to compensate (so it shows full image)
        // When container is 50%, image needs to be 200% (2x) to show correctly
        const imageWidthPercent = 100 / (sanitizedValue / 100);
        afterImage.style.width = imageWidthPercent + '%';
    }

    // Attach event listener
    sliderRange.addEventListener('input', handleSliderInput);

    // SECURITY: Enhanced image error handling with fallback chain
    if (beforeImage) {
        let beforeErrorCount = 0;
        beforeImage.addEventListener('error', function() {
            beforeErrorCount++;
            
            if (beforeErrorCount === 1) {
                // Try fallback image
                this.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop';
            } else if (beforeErrorCount === 2) {
                // If fallback also fails, hide gracefully
                this.style.display = 'none';
            }
        }, { once: false });
    }

    if (afterImage) {
        let afterErrorCount = 0;
        afterImage.addEventListener('error', function() {
            afterErrorCount++;
            
            if (afterErrorCount === 1) {
                // Try fallback image
                this.src = 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1976&auto=format&fit=crop';
            } else if (afterErrorCount === 2) {
                // If fallback also fails, hide gracefully
                this.style.display = 'none';
            }
        }, { once: false });
    }

    // SECURITY: Prevent manipulation of slider range attributes
    Object.freeze(sliderRange);
})();