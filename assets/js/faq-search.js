/**
 * ANISQ LTD — FAQ Search & Accordion Module
 * Live search filtering and category tab integration for FAQs
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
});

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');
  const categoryChips = document.querySelectorAll('.faq-category-chip');

  if (!faqItems.length) return;

  // Accordion Toggle
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Optional: Close others
      faqItems.forEach(i => {
        if (i !== item) i.classList.remove('active');
      });
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // Live Instant Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

        if (questionText.includes(term) || answerText.includes(term)) {
          item.style.display = 'block';
          if (term.length > 2) {
            item.classList.add('active'); // auto-expand on specific match
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Category Filter Chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedCategory = chip.dataset.category || 'all';

      faqItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
