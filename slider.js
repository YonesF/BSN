// Simple and robust before/after slider
(function() {
    'use strict';
    
    const container = document.querySelector('.before-after-container');
    const afterWrapper = document.querySelector('.after-image-wrapper');
    const sliderControl = document.querySelector('.slider-control');
    
    if (!container || !afterWrapper || !sliderControl) return;
    
    let isDragging = false;
    
    function updateSlider(clientX) {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        afterWrapper.style.width = percentage + '%';
        sliderControl.style.left = percentage + '%';
    }
    
    // Mouse events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.touches[0].clientX);
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Prevent text selection while dragging
    container.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });
})();