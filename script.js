/**
 * TRI WAHYUDI — PERSONAL SITE SCRIPTS
 * Simple contact form feedback
 */

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName');
      const email = document.getElementById('senderEmail');
      const message = document.getElementById('senderMessage');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Mohon isi semua kolom pesan.');
        return;
      }

      if (feedback) {
        feedback.classList.remove('hidden');
        form.reset();

        setTimeout(() => {
          feedback.classList.add('hidden');
        }, 5000);
      }
    });
  }
})();
