/**
 * ANISQ LTD — Gallery Lightbox Module
 * Accessible, responsive, swipe-supported fullscreen image viewer with EXIF metadata
 */

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

function initLightbox() {
  const triggerItems = document.querySelectorAll('[data-lightbox="gallery"]');
  if (!triggerItems.length) return;

  // Build Lightbox DOM if not already present
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image Gallery Lightbox');
    modal.innerHTML = `
      <div class="lightbox-counter" id="lb-counter">1 / 1</div>
      <button class="lightbox-btn lightbox-close" id="lb-close" aria-label="Close Lightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="lightbox-btn lightbox-prev" id="lb-prev" aria-label="Previous Image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="lightbox-btn lightbox-next" id="lb-next" aria-label="Next Image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <div class="lightbox-content">
        <div class="lightbox-img-wrapper">
          <img class="lightbox-img" id="lb-img" src="" alt="">
        </div>
        <div class="lightbox-caption">
          <h4 id="lb-title"></h4>
          <p id="lb-desc"></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  let galleryData = [];
  let currentIndex = 0;

  function refreshGalleryData() {
    const visibleTriggers = Array.from(document.querySelectorAll('[data-lightbox="gallery"]')).filter(el => {
      return el.offsetParent !== null; // only visible elements (handles filter chips)
    });

    galleryData = visibleTriggers.map((el, idx) => {
      el.dataset.lbIndex = idx;
      return {
        src: el.getAttribute('data-src') || el.querySelector('img')?.src || '',
        title: el.getAttribute('data-title') || el.querySelector('.gallery-item-title')?.textContent || 'ANISQ Photography',
        category: el.getAttribute('data-category') || 'Portfolio',
        gear: el.getAttribute('data-gear') || 'Sony Alpha 7 IV · 35mm f/1.4 GM'
      };
    });
  }

  refreshGalleryData();

  function openLightbox(index) {
    refreshGalleryData();
    if (!galleryData.length) return;
    currentIndex = parseInt(index, 10);
    if (isNaN(currentIndex) || currentIndex < 0) currentIndex = 0;
    if (currentIndex >= galleryData.length) currentIndex = galleryData.length - 1;

    updateLightboxContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentIndex];
    if (!item) return;

    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbDesc.textContent = `${item.category} — ${item.gear}`;
    lbCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
  }

  function nextImage() {
    if (!galleryData.length) return;
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevImage() {
    if (!galleryData.length) return;
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  // Trigger click handlers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox="gallery"]');
    if (trigger) {
      e.preventDefault();
      const idx = trigger.dataset.lbIndex || 0;
      openLightbox(idx);
    }
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', nextImage);
  lbPrev.addEventListener('click', prevImage);

  // Close when backdrop clicked
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch Swipe gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        nextImage(); // Swiped left -> next
      } else {
        prevImage(); // Swiped right -> prev
      }
    }
  }
}
