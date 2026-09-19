/**
 * ANISQ LTD — Before/After Photo Comparison Slider
 * Touch, mouse drag, and keyboard interactive image reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
});

function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider-container');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const overlay = slider.querySelector('.ba-slider-overlay');
    const handle = slider.querySelector('.ba-slider-handle');
    const overlayImg = overlay ? overlay.querySelector('img') : null;

    if (!overlay || !handle) return;

    let isDragging = false;

    function setSliderPosition(x) {
      const rect = slider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;

      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;

      const percentage = pos * 100;
      overlay.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;

      if (overlayImg) {
        overlayImg.style.width = `${rect.width}px`;
      }
    }

    // Resize sync for overlay image width
    function syncDimensions() {
      const rect = slider.getBoundingClientRect();
      if (overlayImg) {
        overlayImg.style.width = `${rect.width}px`;
      }
    }
    window.addEventListener('resize', syncDimensions);
    syncDimensions();

    // Mouse Events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}
