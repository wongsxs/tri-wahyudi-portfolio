/**
 * TRI WAHYUDI — APPLE STYLE PORTFOLIO
 * Interactivity: 2D Seat Picker Demo, Copy Email Toast, Telemetry Stream & Contact Form
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. INTERACTIVE 2D BUS SEAT PICKER DEMO (PO BUS ASM PUTRA TRANS)
  // =========================================================================
  const seatButtons = document.querySelectorAll('.seat-btn.available');
  const seatStatus = document.getElementById('seatStatusIndicator');
  let selectedSeat = null;

  seatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const seatNum = btn.getAttribute('data-seat');

      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedSeat = null;
        if (seatStatus) {
          seatStatus.textContent = 'PILIH KURSI UNTUK TEST';
          seatStatus.style.color = 'var(--apple-blue)';
        }
      } else {
        // Deselect previous
        seatButtons.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSeat = seatNum;
        if (seatStatus) {
          seatStatus.textContent = `✓ KURSI ${seatNum} DIPILIH (STATUS: TERKUNCI)`;
          seatStatus.style.color = 'var(--apple-green)';
        }
      }
    });
  });

  // =========================================================================
  // 2. 1-CLICK COPY EMAIL WITH APPLE TOAST
  // =========================================================================
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'triw0224@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email ${email} disalin ke clipboard!`);
        }).catch(() => {
          prompt('Salin email secara manual:', email);
        });
      } else {
        prompt('Salin email secara manual:', email);
      }
    });
  }

  // =========================================================================
  // 3. ESP32 LIVE SERIAL MONITOR LOG STREAM (SIMULATED TELEMETRY)
  // =========================================================================
  const terminalLog = document.getElementById('terminalLog');
  const sampleSensors = [
    'DHT22: Temp 27.4°C, Hum 62% &bull; Packet checksum OK',
    'Ultrasonic HC-SR04: Distance 142cm &bull; Threshold Normal',
    'MQTT Client: Published telemetry to topic /fleet/telemetry',
    'WiFi RSSI: -54 dBm &bull; Link quality: Excellent',
    'Free Heap Memory: 214,840 bytes &bull; System healthy'
  ];
  let sensorIdx = 0;

  function appendTelemetry() {
    if (!terminalLog) return;
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    const newLog = document.createElement('div');
    newLog.className = 'log-line';
    newLog.innerHTML = `${timeStr} ${sampleSensors[sensorIdx % sampleSensors.length]}`;
    
    terminalLog.appendChild(newLog);
    sensorIdx++;

    // Keep maximum 6 lines
    while (terminalLog.children.length > 6) {
      terminalLog.removeChild(terminalLog.firstChild);
    }
  }

  // Stream a telemetry line every 4.5 seconds
  setInterval(appendTelemetry, 4500);

  // =========================================================================
  // 4. CONTACT FORM HANDLER
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName');
      const email = document.getElementById('senderEmail');
      const msg = document.getElementById('senderMessage');

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        alert('Mohon isi semua kolom pesan.');
        return;
      }

      if (formFeedback) {
        formFeedback.classList.remove('hidden');
        contactForm.reset();
        showToast('Pesan transmisi berhasil terkirim!');

        setTimeout(() => {
          formFeedback.classList.add('hidden');
        }, 5000);
      }
    });
  }

})();
