/**
 * TRI WAHYUDI — MODERN BENTO GRID PORTFOLIO
 * Interactivity: Filterable Repositories, Architecture Intel Modals & Contact Handlers
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. GITHUB REPOSITORIES FILTER
  // =========================================================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const repoCards = document.querySelectorAll('.repo-card');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // Update active chip state
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedCategory = chip.getAttribute('data-filter');

      repoCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 2. PROJECT ARCHITECTURE INTEL MODALS
  // =========================================================================
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const allDialogs = document.querySelectorAll('.modern-dialog');

  function openModal(modalId) {
    const dialog = document.getElementById(modalId);
    if (!dialog || !modalBackdrop) return;

    modalBackdrop.classList.remove('hidden');
    dialog.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeModal() {
    allDialogs.forEach((d) => d.classList.add('hidden'));
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // =========================================================================
  // 3. CONTACT FORM SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const msgInput = document.getElementById('senderMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        alert('Mohon lengkapi semua kolom formulir.');
        return;
      }

      // Display clean success alert
      if (formSuccessAlert) {
        formSuccessAlert.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => {
          formSuccessAlert.classList.add('hidden');
        }, 6000);
      }
    });
  }

  // =========================================================================
  // 4. HEADER SCROLL SHADOW
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      siteHeader.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
    } else {
      siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      siteHeader.style.boxShadow = 'none';
    }
  });

})();
