// Performance Optimization Utilities for Spectrum of Excellence Design System

// GPU Acceleration Helper
export const gpuAccelerate = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Debounce function for scroll/resize events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for animation events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
};

// Optimize animations for mobile
export const optimizeForMobile = () => {
  if (isMobile()) {
    // Disable heavy effects
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.classList.add('mobile-optimized');
    
    // Disable particles
    const particles = document.querySelectorAll('.hero-particles, .color-echo-system');
    particles.forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Reduce blur effects
    const blurElements = document.querySelectorAll('.glassmorphism');
    blurElements.forEach(el => {
      (el as HTMLElement).style.backdropFilter = 'blur(5px)';
    });
  }
};

// Performance monitoring
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      const resourceLoadTime = perfData.loadEventEnd - perfData.responseEnd;
      
      console.log('Performance Metrics:');
      console.log(`Page Load Time: ${pageLoadTime}ms`);
      console.log(`DOM Ready Time: ${domReadyTime}ms`);
      console.log(`Resource Load Time: ${resourceLoadTime}ms`);
      
      // Check if animations are smooth
      let lastTime = 0;
      let frameCount = 0;
      const checkFPS = (currentTime: number) => {
        frameCount++;
        if (currentTime - lastTime >= 1000) {
          console.log(`FPS: ${frameCount}`);
          frameCount = 0;
          lastTime = currentTime;
        }
        if (currentTime < 5000) {
          requestAnimationFrame(checkFPS);
        }
      };
      requestAnimationFrame(checkFPS);
    });
  }
};

// Initialize all optimizations
export const initializeOptimizations = () => {
  // Apply mobile optimizations
  optimizeForMobile();
  
  // Set up lazy loading
  if ('IntersectionObserver' in window) {
    lazyLoadImages();
  }
  
  // GPU accelerate key elements
  document.querySelectorAll('.spectrum-gradient, .hero-spectrum, .particle').forEach(el => {
    gpuAccelerate(el as HTMLElement);
  });
  
  // Optimize scroll performance
  let ticking = false;
  const updateOnScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Update parallax or other scroll-based effects here
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  
  // Monitor performance in development
  if (process.env.NODE_ENV === 'development') {
    measurePerformance();
  }
};