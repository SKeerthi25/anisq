/**
 * ANISQ LTD — Portfolio Gallery Filter Module
 * Filterable category chips with smooth animated transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
});

function initGalleryFilter() {
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  if (!filterChips.length || !galleryItems.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category') || '';

        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}
