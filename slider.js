/**
 * LuksusEiendom Luxury Before/After Slider
 * Pure JavaScript implementation with intro animation
 */

class LuxurySlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Slider container not found:', containerId);
      return;
    }

    this.sliderPosition = 0; // Start at 0 for intro animation
    this.isDragging = false;
    this.isHovered = false;
    
    this.init();
  }

  init() {
    // Make sure images are loaded before initializing
    const images = this.container.querySelectorAll('img');
    let loadedCount = 0;
    
    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) {
            this.startSlider();
          }
        });
      }
    });
    
    // If all images already loaded
    if (loadedCount === images.length) {
      this.startSlider();
    }
  }

  startSlider() {
    this.fixBeforeImageWidth();
    this.setupEventListeners();
    this.runIntroAnimation();
  }

  fixBeforeImageWidth() {
    // Fix the before image to match container width
    const beforeImg = this.container.querySelector('.before-image-container img');
    if (beforeImg) {
      const containerWidth = this.container.offsetWidth;
      beforeImg.style.width = containerWidth + 'px';
    }
  }

  runIntroAnimation() {
    const start = 0;
    const end = 50;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart) for smooth luxury feel
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      this.sliderPosition = start + (end - start) * easeOut;
      this.updateSliderPosition();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Wait 500ms before starting animation
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);
  }

  setupEventListeners() {
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
  }

  handleStart(e) {
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LuxurySlider('luxury-slider-container');
  });
} else {
  // DOM already loaded
  new LuxurySlider('luxury-slider-container');
}