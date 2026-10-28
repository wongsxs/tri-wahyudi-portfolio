/**
 * TRI WAHYUDI — HIGH-CRAFT INTERACTIVE SOFTWARE PORTFOLIO
 * Features:
 * 1. Magnetic Custom Cursor
 * 2. Particle Network Canvas
 * 3. Web Audio Synthesizer (Haptic Click FX)
 * 4. Dynamic Typing Animation
 * 5. Interactive Developer CLI Terminal (wongsxs@dev:~$)
 * 6. 3D Tilt Physics (Card Gyroscope)
 * 7. Simulated 52-Week GitHub Heatmap
 * 8. PO Bus Seat Reservation & E-Ticket Boarding Pass
 * 9. Android Phone Viewport Switcher
 * 10. Company DAU WhatsApp RFQ Builder
 * 11. ESP32 Telemetry & GPIO Switchboard
 * 12. Category Filter & Command Palette (Ctrl+K)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO SYNTHESIZER (HAPTIC SOUND FX)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHapticSound(freq = 800, type = 'sine', duration = 0.04) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundOnIcon = document.getElementById('soundOnIcon');
  const soundOffIcon = document.getElementById('soundOffIcon');
  const soundStateText = document.getElementById('soundStateText');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundOnIcon?.classList.remove('hidden');
        soundOffIcon?.classList.add('hidden');
        if (soundStateText) soundStateText.textContent = 'ON';
        playHapticSound(1000, 'triangle', 0.08);
      } else {
        soundOnIcon?.classList.add('hidden');
        soundOffIcon?.classList.remove('hidden');
        if (soundStateText) soundStateText.textContent = 'OFF';
      }
    });
  }

  // Bind subtle click sound to interactive elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .seat-node, .dest-btn, .term-chip, .filter-pill, .toggle-switch')) {
      playHapticSound(880, 'sine', 0.035);
    }
  });

  // =========================================================================
  // 2. MAGNETIC CUSTOM CURSOR & ITACHI EYE TRACKING
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const itachiEyeWidget = document.getElementById('itachiEyeWidget');
  const itachiIris = document.getElementById('itachiIris');
  const genjutsuState = document.getElementById('genjutsuState');
  let tsukuyomiActive = false;

  function trackItachiEye(targetX, targetY) {
    if (!itachiEyeWidget || !itachiIris) return;
    const rect = itachiEyeWidget.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = targetX - eyeCenterX;
    const dy = targetY - eyeCenterY;
    const angle = Math.atan2(dy, dx);

    const maxDist = 13;
    const rawDist = Math.hypot(dx, dy);
    const dist = Math.min(rawDist / 18, maxDist);

    const moveX = Math.cos(angle) * dist;
    const moveY = Math.sin(angle) * (dist * 0.55); // Flattened for eye socket contour

    itachiIris.style.transform = `translate(calc(-50% + ${moveX.toFixed(1)}px), calc(-50% + ${moveY.toFixed(1)}px))`;
  }

  // Natural Blinking Cycle
  function scheduleBlink() {
    if (!itachiEyeWidget) return;
    const delay = Math.random() * 2500 + 3500;
    setTimeout(() => {
      itachiEyeWidget.classList.add('blinking');
      setTimeout(() => {
        itachiEyeWidget.classList.remove('blinking');
        scheduleBlink();
      }, 160);
    }, delay);
  }
  scheduleBlink();

  function toggleTsukuyomi() {
    tsukuyomiActive = !tsukuyomiActive;
    if (tsukuyomiActive) {
      document.body.classList.add('tsukuyomi-mode');
      itachiEyeWidget?.classList.add('tsukuyomi');
      if (genjutsuState) genjutsuState.textContent = 'TSUKUYOMI ACTIVE';
      playHapticSound(180, 'sawtooth', 0.28);
      showToast('👁️ Tsukuyomi Activated: "You are already under my Genjutsu."');
    } else {
      document.body.classList.remove('tsukuyomi-mode');
      itachiEyeWidget?.classList.remove('tsukuyomi');
      if (genjutsuState) genjutsuState.textContent = 'GAZE ACTIVE';
      playHapticSound(550, 'sine', 0.08);
      showToast('Genjutsu released.');
    }
  }

  if (itachiEyeWidget) {
    itachiEyeWidget.addEventListener('click', toggleTsukuyomi);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    trackItachiEye(mouseX, mouseY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      trackItachiEye(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expand ring on interactive elements
  const hoverTargets = 'button, a, input, select, textarea, [data-magnetic], .seat-node, .dest-btn, .term-chip';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing?.classList.add('active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing?.classList.remove('active');
    }
  });

  // =========================================================================
  // 3. PARTICLE NETWORK CANVAS (60 FPS PURE 2D PHYSICS)
  // =========================================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 22000), 55);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // =========================================================================
  // 4. DYNAMIC TYPING HEADLINE ANIMATION
  // =========================================================================
  const typingEl = document.getElementById('typingDynamicText');
  const words = [
    'Full-Stack Web Systems',
    'Native Android Kotlin Apps',
    'ESP32 IoT Firmware',
    'Relational Database Schemas',
    'Fleet Reservation Engines'
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    if (!typingEl) return;
    const currentWord = words[wordIdx % words.length];

    if (isDeleting) {
      charIdx--;
      typingEl.textContent = currentWord.substring(0, charIdx);
    } else {
      charIdx++;
      typingEl.textContent = currentWord.substring(0, charIdx);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx++;
      delay = 400;
    }

    setTimeout(typeStep, delay);
  }
  setTimeout(typeStep, 600);

  // =========================================================================
  // 5. 3D CARD TILT PHYSICS (PROPORTIONAL GYRO EFFECT)
  // =========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return; // Disable tilt on mobile for buttery smooth scrolling

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

      // Also set spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // =========================================================================
  // 6. INTERACTIVE DEVELOPER CLI (wongsxs@dev:~$)
  // =========================================================================
  const terminalInput = document.getElementById('terminalInput');
  const termOutputLog = document.getElementById('termOutputLog');
  const termChips = document.querySelectorAll('.term-chip');
  const matrixCanvas = document.getElementById('matrixCanvas');
  let matrixRunning = false;
  let matrixInterval = null;

  const cliResponses = {
    help: `
Daftar perintah yang tersedia:
  • <span class="cmd-highlight">about</span>      : Informasi profil Tri Wahyudi & semester
  • <span class="cmd-highlight">projects</span>   : Repositori karya utama (Web, Android, IoT)
  • <span class="cmd-highlight">skills</span>     : Ringkasan tech stack & framework
  • <span class="cmd-highlight">contact</span>    : Detail WhatsApp, Email, & GitHub
  • <span class="cmd-highlight">sharingan</span>  : Aktifkan Itachi Mangekyou Tsukuyomi Mode
  • <span class="cmd-highlight">matrix</span>     : Trigger animasi digital rain Cyber Matrix
  • <span class="cmd-highlight">clear</span>      : Bersihkan layar terminal
  • <span class="cmd-highlight">date</span>       : Tampilkan waktu dan status server
  • <span class="cmd-highlight">whoami</span>     : Menampilkan identitas sesi tamu
    `,
    about: `
Nama       : Tri Wahyudi (21 Tahun)
Status     : Mahasiswa S1 Teknik Informatika (Semester 5)
Fokus      : Fullstack Web (PHP/Laravel), Android Native (Kotlin), Embedded C++ (ESP32)
Lokasi     : Kebumen / Terbuka untuk magang (internship) remote & on-site
GitHub     : https://github.com/wongsxs (30+ Repositories)
    `,
    projects: `
1. <a href="https://github.com/wongsxs/asmputratrans" target="_blank" style="color:#38bdf8;text-decoration:underline;">asmputratrans</a> - Sistem PO Bus denah kursi dinamis & validasi QR
2. <a href="https://github.com/wongsxs/smart-tourism-kebumen-v1" target="_blank" style="color:#38bdf8;text-decoration:underline;">smart-tourism-kebumen-v1</a> - Aplikasi Android panduan rute wisata
3. <a href="https://github.com/wongsxs/companyDAU" target="_blank" style="color:#38bdf8;text-decoration:underline;">companyDAU</a> - Portal B2B peralatan kebersihan & WhatsApp RFQ
4. <a href="https://github.com/wongsxs/ESP32project" target="_blank" style="color:#38bdf8;text-decoration:underline;">ESP32project</a> - Firmware UART serial & GPIO actuator controller
5. <a href="https://github.com/wongsxs/kt-cloud" target="_blank" style="color:#38bdf8;text-decoration:underline;">kt-cloud</a> - Personal cloud storage powered by Google Drive
    `,
    skills: `
• Backend  : PHP 8.x, Laravel MVC, Node.js, REST API, Session Security
• Mobile   : Android Studio, Kotlin Native, MVVM, Google Maps Location API
• Database : MySQL, Relational Normalization (1NF-3NF), Query Indexing, ACID
• Hardware : ESP32-WROOM-32, C++ Embedded, UART Serial, GPIO Relay
• DevOps   : Git, GitHub CLI, Linux Bash, PowerShell
    `,
    contact: `
• WhatsApp : https://wa.me/6281234567890 (Diskusi Langsung)
• Email    : triw0224@gmail.com (Email Resmi)
• GitHub   : https://github.com/wongsxs (30+ Repositori Publik & Privat)
    `,
    whoami: 'guest@wongsxs-portfolio [role: tech recruiter / software engineer visitor]',
    date: () => `System Time: ${new Date().toLocaleString('id-ID')} • Node: Production`,
    sudo: 'Permission denied: user "guest" is not in the sudoers file. This incident will be reported.'
  };

  function executeCliCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      if (termOutputLog) termOutputLog.innerHTML = '';
      return;
    }

    if (cmd === 'matrix') {
      toggleMatrixRain();
      return;
    }

    let res = null;
    if (cmd === 'sharingan' || cmd === 'tsukuyomi') {
      toggleTsukuyomi();
      res = tsukuyomiActive 
        ? '<span style="color:#ff0033;font-weight:bold;">[MANGEKYO SHARINGAN AWAKENED]</span> Tsukuyomi Genjutsu is now cast over the entire domain.'
        : '<span style="color:#4ade80;">[SHARINGAN SEALED]</span> Returning to standard reality.';
    }

    const entry = document.createElement('div');
    entry.className = 'term-output-entry';

    if (!res) {
      res = cliResponses[cmd];
      if (typeof res === 'function') res = res();
    }

    if (!res) {
      res = `Perintah tidak dikenal: "${cmd}". Ketik <span class="cmd-highlight">help</span> untuk panduan.`;
    }

    entry.innerHTML = `
      <div class="term-cmd-history">
        <span class="term-prompt">wongsxs@dev:~$</span>
        <span>${cmdRaw}</span>
      </div>
      <div class="term-res-body">${res}</div>
    `;

    if (termOutputLog) {
      termOutputLog.appendChild(entry);
      const body = document.getElementById('devTerminalBody');
      if (body) body.scrollTop = body.scrollHeight;
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCliCommand(val);
      }
    });
  }

  termChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCliCommand(cmd);
    });
  });

  // Matrix Digital Rain
  function toggleMatrixRain() {
    if (!matrixCanvas) return;

    if (matrixRunning) {
      matrixCanvas.classList.add('hidden');
      clearInterval(matrixInterval);
      matrixRunning = false;
      return;
    }

    matrixCanvas.classList.remove('hidden');
    matrixRunning = true;
    const mCtx = matrixCanvas.getContext('2d');

    const mWidth = (matrixCanvas.width = window.innerWidth);
    const mHeight = (matrixCanvas.height = window.innerHeight);

    const chars = '0123456789ABCDEFѰЖДWONGSTRIWAHYUDI';
    const fontSize = 14;
    const cols = Math.floor(mWidth / fontSize);
    const drops = Array(cols).fill(1);

    matrixInterval = setInterval(() => {
      mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      mCtx.fillRect(0, 0, mWidth, mHeight);

      mCtx.fillStyle = '#4ade80';
      mCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > mHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 35);

    // Auto dismiss after 10 seconds or click
    matrixCanvas.onclick = () => toggleMatrixRain();
  }

  // =========================================================================
  // 7. SIMULATED 52-WEEK GITHUB HEATMAP
  // =========================================================================
  const heatmapGrid = document.getElementById('simulatedHeatmapGrid');
  if (heatmapGrid) {
    // 52 columns x 7 days = 364 days
    const totalDays = 52 * 7;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < totalDays; i++) {
      const day = document.createElement('div');
      day.className = 'heat-day';

      // Higher density of commits toward the recent days (i close to 364)
      const rand = Math.random();
      const recencyBoost = i / totalDays;
      let lvl = 0;

      if (rand + recencyBoost > 1.25) lvl = 4;
      else if (rand + recencyBoost > 1.0) lvl = 3;
      else if (rand + recencyBoost > 0.75) lvl = 2;
      else if (rand + recencyBoost > 0.45) lvl = 1;
      else lvl = 0;

      day.classList.add(`lvl-${lvl}`);
      day.title = `${lvl * 2 + Math.floor(Math.random() * 3)} commits`;
      frag.appendChild(day);
    }
    heatmapGrid.appendChild(frag);
  }

  // =========================================================================
  // 8. BUS SEAT RESERVATION & E-TICKET PASS (PO BUS ASM PUTRA TRANS)
  // =========================================================================
  const seatNodes = document.querySelectorAll('.seat-node.available');
  const summarySeat = document.getElementById('selectedSeatSummary');
  const summaryPrice = document.getElementById('selectedPriceSummary');
  const btnIssueTicket = document.getElementById('btnIssueTicket');

  const ticketModal = document.getElementById('ticketModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnDismissModal = document.getElementById('btnDismissModal');
  const passSeatNum = document.getElementById('passSeatNum');
  const passPrice = document.getElementById('passPrice');
  const passBookingRef = document.getElementById('passBookingRef');

  let activeSeat = null;
  let activePrice = 0;

  seatNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const seat = node.getAttribute('data-seat');
      const price = parseInt(node.getAttribute('data-price') || '185000', 10);

      if (node.classList.contains('selected')) {
        node.classList.remove('selected');
        activeSeat = null;
        activePrice = 0;
        if (summarySeat) summarySeat.textContent = 'Pilih Kursi';
        if (summaryPrice) summaryPrice.textContent = 'Rp 0';
        if (btnIssueTicket) btnIssueTicket.disabled = true;
      } else {
        seatNodes.forEach((n) => n.classList.remove('selected'));
        node.classList.add('selected');
        activeSeat = seat;
        activePrice = price;

        if (summarySeat) summarySeat.textContent = `Kursi ${seat} (Eksekutif)`;
        if (summaryPrice) summaryPrice.textContent = `Rp ${price.toLocaleString('id-ID')}`;
        if (btnIssueTicket) btnIssueTicket.disabled = false;
      }
    });
  });

  function openTicketModal() {
    if (!activeSeat || !ticketModal) return;
    const randomRef = 'ASM-' + Math.floor(1000 + Math.random() * 9000) + 'X';
    if (passBookingRef) passBookingRef.textContent = randomRef;
    if (passSeatNum) passSeatNum.textContent = activeSeat;
    if (passPrice) passPrice.textContent = `Rp ${activePrice.toLocaleString('id-ID')}`;

    ticketModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeTicketModal() {
    if (!ticketModal) return;
    ticketModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnIssueTicket) btnIssueTicket.addEventListener('click', openTicketModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeTicketModal);
  if (btnDismissModal) btnDismissModal.addEventListener('click', closeTicketModal);

  if (ticketModal) {
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) closeTicketModal();
    });
  }

  // =========================================================================
  // 9. ANDROID PHONE VIEWPORT (SMART TOURISM KEBUMEN)
  // =========================================================================
  const phoneClock = document.getElementById('phoneClock');
  const destButtons = document.querySelectorAll('.dest-btn');
  const phoneSpotTitle = document.getElementById('phoneSpotTitle');
  const phoneSpotCoord = document.getElementById('phoneSpotCoord');
  const phoneSpotDist = document.getElementById('phoneSpotDist');
  const phoneSpotTime = document.getElementById('phoneSpotTime');
  const phoneSpotCat = document.getElementById('phoneSpotCat');

  function updatePhoneClock() {
    if (!phoneClock) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    phoneClock.textContent = `${h}:${m}`;
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);

  const spotData = {
    menganti: {
      title: 'Pantai Menganti',
      coord: '7.7694° S, 109.4147° E • Rute Pesisir',
      dist: '28 Km',
      time: '~45 Menit',
      cat: 'Bahari'
    },
    benteng: {
      title: 'Benteng Van Der Wijck',
      coord: '7.6042° S, 109.5165° E • Gombong',
      dist: '19 Km',
      time: '~30 Menit',
      cat: 'Sejarah'
    },
    jatijajar: {
      title: 'Goa Jatijajar',
      coord: '7.6698° S, 109.4243° E • Ayah',
      dist: '32 Km',
      time: '~50 Menit',
      cat: 'Geowisata'
    }
  };

  destButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      destButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const spotKey = btn.getAttribute('data-spot');
      const spot = spotData[spotKey];

      if (spot) {
        if (phoneSpotTitle) phoneSpotTitle.textContent = spot.title;
        if (phoneSpotCoord) phoneSpotCoord.textContent = spot.coord;
        if (phoneSpotDist) phoneSpotDist.textContent = spot.dist;
        if (phoneSpotTime) phoneSpotTime.textContent = spot.time;
        if (phoneSpotCat) phoneSpotCat.textContent = spot.cat;
      }
    });
  });

  // =========================================================================
  // 10. COMPANY DAU B2B RFQ WHATSAPP BUILDER
  // =========================================================================
  const rfqSelect = document.getElementById('rfqProductSelect');
  const rfqQtyDec = document.getElementById('rfqQtyDec');
  const rfqQtyInc = document.getElementById('rfqQtyInc');
  const rfqQtyVal = document.getElementById('rfqQtyVal');
  const rfqWaLink = document.getElementById('rfqWaLink');

  let rfqCount = 2;

  function updateRfqUrl() {
    if (!rfqSelect || !rfqQtyVal || !rfqWaLink) return;
    rfqQtyVal.textContent = String(rfqCount);
    const prodName = rfqSelect.value;
    const msg = `Halo Company DAU, saya ingin meminta penawaran harga resmi untuk produk ${prodName} sejumlah ${rfqCount} unit. Mohon lampirkan spesifikasi teknis dan estimasi delivery time. Terima kasih.`;
    rfqWaLink.href = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
  }

  if (rfqQtyDec) {
    rfqQtyDec.addEventListener('click', () => {
      if (rfqCount > 1) {
        rfqCount--;
        updateRfqUrl();
      }
    });
  }

  if (rfqQtyInc) {
    rfqQtyInc.addEventListener('click', () => {
      if (rfqCount < 50) {
        rfqCount++;
        updateRfqUrl();
      }
    });
  }

  if (rfqSelect) {
    rfqSelect.addEventListener('change', updateRfqUrl);
  }

  // =========================================================================
  // 11. ESP32 FIRMWARE TELEMETRY CONSOLE & GPIO SWITCHBOARD
  // =========================================================================
  const esp32Console = document.getElementById('esp32LogConsole');
  const btnClearLog = document.getElementById('btnClearLog');
  const btnToggleStream = document.getElementById('btnToggleStream');
  const pinCheckboxes = document.querySelectorAll('.pin-check');

  let streamPaused = false;

  const telemetryFeed = [
    'DHT22 Temp: 27.2°C, Humidity: 64% • CRC Check: OK',
    'Ultrasonic HC-SR04: Distance 138 cm • Safe Margin',
    'WiFi RSSI: -52 dBm • Channel 6 • Connection Stable',
    'Free DRAM Heap: 218,490 Bytes • Core 0 Load: 12%',
    'MQTT Keepalive ACK received from broker: /fleet/telemetry',
    'RTC Drift Check: +0.02ms • Clock Synchronized via NTP'
  ];
  let telemetryIdx = 0;

  function formatTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `[${h}:${m}:${s}]`;
  }

  function appendConsoleLog(text, type = 'sys') {
    if (!esp32Console) return;
    const line = document.createElement('div');
    line.className = `log-entry ${type}`;
    line.innerHTML = `${formatTimestamp()} ${text}`;
    esp32Console.appendChild(line);

    while (esp32Console.children.length > 15) {
      esp32Console.removeChild(esp32Console.firstChild);
    }
    esp32Console.scrollTop = esp32Console.scrollHeight;
  }

  function streamStep() {
    if (!streamPaused) {
      const msg = telemetryFeed[telemetryIdx % telemetryFeed.length];
      appendConsoleLog(msg, 'sys');
      telemetryIdx++;
    }
  }

  setInterval(streamStep, 4000);

  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      if (esp32Console) {
        esp32Console.innerHTML = '';
        appendConsoleLog('Console cleared by host operator', 'ok');
      }
    });
  }

  if (btnToggleStream) {
    btnToggleStream.addEventListener('click', () => {
      streamPaused = !streamPaused;
      if (streamPaused) {
        btnToggleStream.textContent = 'Resume Stream';
        btnToggleStream.classList.remove('active');
        appendConsoleLog('Telemetry stream PAUSED', 'ok');
      } else {
        btnToggleStream.textContent = 'Pause Stream';
        btnToggleStream.classList.add('active');
        appendConsoleLog('Telemetry stream RESUMED', 'ok');
      }
    });
  }

  pinCheckboxes.forEach((chk) => {
    chk.addEventListener('change', () => {
      const pin = chk.getAttribute('data-pin');
      const label = chk.getAttribute('data-label');
      const state = chk.checked ? 'HIGH (3.3V) [ACTIVE]' : 'LOW (0.0V) [INACTIVE]';
      const logClass = chk.checked ? 'trigger' : 'ok';
      appendConsoleLog(`>> INTERRUPT: GPIO ${pin} (${label}) -> ${state}`, logClass);
    });
  });

  // =========================================================================
  // 12. PROJECT CATEGORY FILTER
  // =========================================================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const bentoCards = document.querySelectorAll('.bento-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-filter');

      bentoCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('dimmed');
        } else {
          card.classList.add('dimmed');
        }
      });
    });
  });

  // =========================================================================
  // 13. COMMAND PALETTE (CTRL+K / CMD+K)
  // =========================================================================
  const cmdPaletteModal = document.getElementById('cmdPaletteModal');
  const cmdTriggerBtn = document.getElementById('cmdPaletteBtn');
  const cmdSearchInput = document.getElementById('cmdSearchInput');
  const cmdResultsList = document.getElementById('cmdResultsList');

  function openCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.remove('hidden');
    if (cmdSearchInput) {
      cmdSearchInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdSearchInput.focus(), 50);
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function filterCmdItems(query) {
    if (!cmdResultsList) return;
    const items = cmdResultsList.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();

    items.forEach((item) => {
      const title = item.querySelector('.cmd-item-title')?.textContent.toLowerCase() || '';
      const meta = item.querySelector('.cmd-item-meta')?.textContent.toLowerCase() || '';
      if (!q || title.includes(q) || meta.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdTriggerBtn) cmdTriggerBtn.addEventListener('click', openCmdPalette);

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', (e) => {
      filterCmdItems(e.target.value);
    });
  }

  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener('click', (e) => {
      if (e.target === cmdPaletteModal) closeCmdPalette();
    });
  }

  if (cmdResultsList) {
    cmdResultsList.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (!item) return;

      const action = item.getAttribute('data-action');
      if (action === 'goto') {
        const target = item.getAttribute('data-target');
        closeCmdPalette();
        if (target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'copy-email') {
        closeCmdPalette();
        copyEmailToClipboard();
      } else if (action === 'external') {
        const url = item.getAttribute('data-url');
        closeCmdPalette();
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteModal && !cmdPaletteModal.classList.contains('hidden')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      if (cmdPaletteModal && !cmdPaletteModal.classList.contains('hidden')) {
        closeCmdPalette();
      }
      if (ticketModal && !ticketModal.classList.contains('hidden')) {
        closeTicketModal();
      }
      if (matrixRunning) {
        toggleMatrixRain();
      }
    }
  });

  // =========================================================================
  // 14. COPY EMAIL & CONTACT FORM
  // =========================================================================
  const copyBtn = document.getElementById('copyEmailBtn');
  const heroCopyEmailBtn = document.getElementById('heroCopyEmailBtn');
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

  function copyEmailToClipboard() {
    const email = 'triw0224@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email ${email} berhasil disalin!`);
      }).catch(() => {
        prompt('Salin email secara manual:', email);
      });
    } else {
      prompt('Salin email secara manual:', email);
    }
  }

  if (copyBtn) copyBtn.addEventListener('click', copyEmailToClipboard);
  if (heroCopyEmailBtn) heroCopyEmailBtn.addEventListener('click', copyEmailToClipboard);

  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName');
      const email = document.getElementById('senderEmail');
      const msg = document.getElementById('senderMessage');

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        alert('Mohon isi semua data pesan.');
        return;
      }

      if (formFeedback) {
        formFeedback.classList.remove('hidden');
        contactForm.reset();
        showToast('Pesan berhasil dikirim!');

        setTimeout(() => {
          formFeedback.classList.add('hidden');
        }, 6000);
      }
    });
  }

  // =========================================================================
  // 15. MOBILE DOCK ACTIVE SECTION HIGHLIGHT
  // =========================================================================
  const dockButtons = document.querySelectorAll('.mobile-dock .dock-btn');
  const observedSections = document.querySelectorAll('section[id], header[id]');

  if (dockButtons.length > 0 && observedSections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          dockButtons.forEach((btn) => {
            if (btn.getAttribute('href') === `#${id}`) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    observedSections.forEach((sec) => observer.observe(sec));
  }

})();
