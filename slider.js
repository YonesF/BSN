// Simple and robust before/after slider - FIXED VERSION
(function() {
    'use strict';
    
    const container = document.querySelector('.before-after-container');
    const afterWrapper = document.querySelector('.after-image-wrapper');
    const sliderControl = document.querySelector('.slider-control');
    
    if (!container || !afterWrapper || !sliderControl) {
        console.error('Slider elements not found');
        return;
    }
    
    let isDragging = false;
    
    function updateSlider(clientX) {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        
        // Clamp between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Update after image wrapper (use right instead of width)
        afterWrapper.style.right = (100 - percentage) + '%';
        
        // Update slider control position
        sliderControl.style.left = percentage + '%';
    }
    
    // Mouse events
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        updateSlider(e.clientX);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.touches[0].clientX);
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Prevent text selection
    container.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });
    
    // Prevent image dragging
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    console.log('Slider initialized successfully');
})();