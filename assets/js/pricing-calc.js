/**
 * ANISQ LTD — Pricing & Add-on Calculator Module
 * Real-time dynamic quotation estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingCalculator();
});

function initPricingCalculator() {
  const calcContainer = document.querySelector('.addon-calculator');
  if (!calcContainer) return;

  const basePackageSelect = document.getElementById('calc-base-package');
  const addonItems = calcContainer.querySelectorAll('.addon-item');
  const totalDisplay = document.getElementById('calc-total-amount');
  const addonCountDisplay = document.getElementById('calc-addon-count');

  let basePrice = 1850; // Default Signature
  let addonTotal = 0;

  function recalculate() {
    if (basePackageSelect) {
      basePrice = parseInt(basePackageSelect.value, 10) || 0;
    }

    let currentAddonSum = 0;
    let selectedCount = 0;

    addonItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        item.classList.add('selected');
        const price = parseInt(item.dataset.price, 10) || 0;
        currentAddonSum += price;
        selectedCount++;
      } else {
        item.classList.remove('selected');
      }
    });

    const grandTotal = basePrice + currentAddonSum;

    if (totalDisplay) {
      totalDisplay.textContent = `£${grandTotal.toLocaleString('en-GB')}`;
    }
    if (addonCountDisplay) {
      addonCountDisplay.textContent = `${selectedCount} add-on${selectedCount === 1 ? '' : 's'} selected`;
    }
  }

  if (basePackageSelect) {
    basePackageSelect.addEventListener('change', recalculate);
  }

  addonItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
      recalculate();
    });
  });

  recalculate();
}
