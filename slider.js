// SECURITY: XSS-safe implementation with enhanced error handling
(function() {
    'use strict';
    
    // Get DOM elements
    const sliderRange = document.getElementById('slider-range');
    const afterImageContainer = document.getElementById('after-image-container');
    const sliderHandle = document.getElementById('slider-handle');
    const beforeImage = document.getElementById('before-image');
    const afterImage = document.getElementById('after-image');
    const sliderContainer = document.querySelector('.before-after-slider');

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
    function setSliderPosition(value) {
        const sanitizedValue = sanitizeSliderValue(value);
        sliderRange.value = sanitizedValue;
        afterImageContainer.style.width = sanitizedValue + '%';
        sliderHandle.style.left = sanitizedValue + '%';
    }

    function handleSliderInput(event) {
        setSliderPosition(event.target.value);
    }

    // Attach event listener
    sliderRange.addEventListener('input', handleSliderInput);
    sliderRange.addEventListener('change', handleSliderInput);
    
    // Pointer/touch drag support on the slider container
    function clientXToPercent(clientX) {
        if (!sliderContainer) return 50;
        const rect = sliderContainer.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        return Math.max(0, Math.min(100, position));
    }

    let isDragging = false;

    function startDrag(event) {
        isDragging = true;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        setSliderPosition(clientXToPercent(clientX));
    }

    function moveDrag(event) {
        if (!isDragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        setSliderPosition(clientXToPercent(clientX));
    }

    function endDrag() {
        isDragging = false;
    }

    if (sliderContainer) {
        sliderContainer.addEventListener('pointerdown', startDrag);
        sliderContainer.addEventListener('pointermove', moveDrag);
        sliderContainer.addEventListener('pointerup', endDrag);
        sliderContainer.addEventListener('pointerleave', endDrag);
        sliderContainer.addEventListener('touchstart', startDrag, { passive: true });
        sliderContainer.addEventListener('touchmove', moveDrag, { passive: true });
        sliderContainer.addEventListener('touchend', endDrag);
    }

    // Initialize position
    setSliderPosition(sliderRange.value || 50);

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
 })();