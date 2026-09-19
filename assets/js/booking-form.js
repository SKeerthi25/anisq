/**
 * ANISQ LTD — Multi-Step Booking Wizard Script
 * Service Selection -> Date/Time & Location -> Client Details -> Review & Confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const wizard = document.getElementById('booking-wizard');
  if (!wizard) return;

  const panels = wizard.querySelectorAll('.wizard-step-panel');
  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const progressBar = document.querySelector('.wizard-progress-bar');
  const prevBtns = wizard.querySelectorAll('.wizard-prev-btn');
  const nextBtns = wizard.querySelectorAll('.wizard-next-btn');
  const serviceCards = wizard.querySelectorAll('.service-option-card');

  let currentStep = 1;
  const totalSteps = panels.length;

  // Selected state tracking
  const bookingState = {
    service: 'Weddings',
    package: 'Signature Coverage (£1,850)',
    date: '',
    timeSlot: 'Morning (09:00 - 13:00)',
    location: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    addons: []
  };

  // Service Card Select Interaction
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        bookingState.service = card.dataset.serviceName || radio.value;
        bookingState.package = card.dataset.servicePrice || 'Custom Quote';
      }
    });
  });

  function updateWizardUI() {
    // Update Panels
    panels.forEach((panel, idx) => {
      if (idx + 1 === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Step Indicators
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        node.classList.add('active');
      } else if (stepNum < currentStep) {
        node.classList.add('completed');
      }
    });

    // Update Progress Bar
    if (progressBar) {
      const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // If step 4 (Review), populate receipt
    if (currentStep === 4) {
      populateConfirmationReceipt();
    }

    // Scroll to wizard top
    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const currentPanel = wizard.querySelector(`.wizard-step-panel[data-step="${step}"]`);
    if (!currentPanel) return true;

    let valid = true;
    const requiredInputs = currentPanel.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        valid = false;
        if (group) group.classList.add('has-error');
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    if (step === 2) {
      const dateInput = currentPanel.querySelector('#booking-date');
      const locationInput = currentPanel.querySelector('#booking-location');
      if (dateInput) bookingState.date = dateInput.value;
      if (locationInput) bookingState.location = locationInput.value;
      const slotSelect = currentPanel.querySelector('#booking-time');
      if (slotSelect) bookingState.timeSlot = slotSelect.value;
    }

    if (step === 3) {
      const nameInput = currentPanel.querySelector('#client-name');
      const emailInput = currentPanel.querySelector('#client-email');
      const phoneInput = currentPanel.querySelector('#client-phone');
      const notesInput = currentPanel.querySelector('#client-notes');

      if (nameInput) bookingState.name = nameInput.value;
      if (emailInput) bookingState.email = emailInput.value;
      if (phoneInput) bookingState.phone = phoneInput.value;
      if (notesInput) bookingState.notes = notesInput.value;
    }

    return valid;
  }

  function populateConfirmationReceipt() {
    const receiptBox = document.getElementById('wizard-summary-receipt');
    if (!receiptBox) return;

    receiptBox.innerHTML = `
      <div style="background-color: var(--color-surface-subtle); border-radius: var(--radius-md); padding: var(--space-lg); margin-bottom: var(--space-lg); border: 1px solid var(--color-card-border);">
        <h4 style="color: var(--color-primary); margin-bottom: var(--space-md); display: flex; align-items: center; justify-content: space-between;">
          <span>${bookingState.service}</span>
          <span style="font-size: 1.1rem; color: var(--color-ink);">${bookingState.package}</span>
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-sm); font-size: 0.9rem;">
          <div><strong>Date:</strong> ${bookingState.date || 'To be confirmed'}</div>
          <div><strong>Time:</strong> ${bookingState.timeSlot}</div>
          <div><strong>Location:</strong> ${bookingState.location || 'London & Greater London'}</div>
          <div><strong>Client Name:</strong> ${bookingState.name}</div>
          <div><strong>Email:</strong> ${bookingState.email}</div>
          <div><strong>Phone:</strong> ${bookingState.phone}</div>
        </div>
        ${bookingState.notes ? `<div style="margin-top: var(--space-sm); font-size: 0.85rem; color: var(--color-muted);"><strong>Special Requests:</strong> ${bookingState.notes}</div>` : ''}
      </div>
    `;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateWizardUI();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  });

  // Final Form Submission
  const finalSubmitBtn = wizard.querySelector('#wizard-final-submit');
  if (finalSubmitBtn) {
    finalSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      finalSubmitBtn.disabled = true;
      finalSubmitBtn.innerHTML = 'Securing Booking...';

      setTimeout(() => {
        finalSubmitBtn.disabled = false;
        const successBox = document.getElementById('wizard-success-state');
        const contentBox = document.getElementById('wizard-form-content');
        if (successBox && contentBox) {
          contentBox.style.display = 'none';
          successBox.style.display = 'block';
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000);
    });
  }
}
