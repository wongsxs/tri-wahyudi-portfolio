/**
 * FAISAL ABDAU // 16-BIT RETRO CLASSIC PORTFOLIO
 * Interactive Audio Engine, Gamepad Controller, PS3 Tribute & PO Bus Canvas Game
 */

(function () {
  'use strict';

  // ==========================================
  // 1. WEB AUDIO API - 16-BIT RETRO SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play custom synthesized 8-bit/16-bit tone
  function playSynthTone(freq, type = 'square', duration = 0.1, startVol = 0.15, endVol = 0.01) {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(startVol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  // Sound: UI Click Blip
  function sfxClick() {
    playSynthTone(750, 'square', 0.05, 0.12, 0.01);
  }

  // Sound: Classic Coin / Item Pickup
  function sfxCoin() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Sound: Jump / Action
  function sfxJump() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Sound: Power Up Arpeggio
  function sfxPowerUp() {
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSynthTone(freq, 'square', 0.1, 0.15, 0.01);
      }, idx * 60);
    });
  }

  // Sound: Authentic PS3 Platinum Trophy Unlock Chime!
  function sfxTrophyUnlock() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // High bright shimmer
      const chord = [932.33, 1244.51, 1567.98, 1864.66]; // Bb5, Eb6, G6, Bb6
      chord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.18, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + 1.2);
      });
    } catch (e) {}
  }

  // Sound: Crash / Collision
  function sfxCrash() {
    playSynthTone(90, 'sawtooth', 0.25, 0.3, 0.01);
  }

  // Sound: Mechanical Eject / Click
  function sfxMechanical() {
    playSynthTone(220, 'square', 0.1, 0.15, 0.05);
    setTimeout(() => {
      playSynthTone(180, 'square', 0.15, 0.15, 0.01);
    }, 120);
  }

  // ==========================================
  // 2. HUD & STATE MANAGEMENT
  // ==========================================
  let currentScore = 99500;
  let trophyCount = 12;

  const hudScoreEl = document.getElementById('hudScore');
  const trophyCountEl = document.getElementById('trophyCount');
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const retroNav = document.getElementById('retroNav');
  const audioUnlockBanner = document.getElementById('audioUnlockBanner');
  const enableSoundBtn = document.getElementById('enableSoundBtn');

  function addScore(points = 100) {
    currentScore += points;
    if (hudScoreEl) {
      hudScoreEl.textContent = currentScore.toString().padStart(6, '0');
    }
  }

  // Audio Banner Dismissal
  if (enableSoundBtn) {
    enableSoundBtn.addEventListener('click', () => {
      initAudioContext();
      sfxPowerUp();
      if (audioUnlockBanner) {
        audioUnlockBanner.classList.add('dismissed');
      }
    });
  }

  // Global sound click triggers
  document.addEventListener('click', (e) => {
    initAudioContext();
    if (e.target.closest('.sound-click')) {
      sfxClick();
    }
  });

  // SFX Toggle
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      const textSpan = sfxToggleBtn.querySelector('.btn-text');
      const iconSpan = sfxToggleBtn.querySelector('.icon');
      if (sfxEnabled) {
        textSpan.textContent = 'SFX: ON';
        iconSpan.textContent = '🔊';
        sfxCoin();
      } else {
        textSpan.textContent = 'SFX: OFF';
        iconSpan.textContent = '🔇';
      }
    });
  }

  // CRT Filter Toggle
  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-active');
      const isActive = document.body.classList.contains('crt-active');
      const textSpan = crtToggleBtn.querySelector('.btn-text');
      textSpan.textContent = isActive ? 'CRT: ON' : 'CRT: OFF';
      sfxClick();
    });
  }

  // Mobile Menu Toggle
  if (menuToggleBtn && retroNav) {
    menuToggleBtn.addEventListener('click', () => {
      retroNav.classList.toggle('mobile-open');
      sfxClick();
    });

    // Close menu when link is clicked
    retroNav.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        retroNav.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================
  // 3. PS3 CONSOLE & DUALSHOCK 3 INTERACTION
  // ==========================================
  const padButtons = document.querySelectorAll('.pad-btn');
  const lastPressedKeyEl = document.getElementById('lastPressedKey');
  const ps3EjectBtn = document.getElementById('ps3EjectBtn');
  const ps3PowerBtn = document.getElementById('ps3PowerBtn');
  const ejectDiscEl = document.getElementById('ejectDisc');
  const ps3PowerLedEl = document.getElementById('ps3PowerLed');
  const ps3StatusText = document.getElementById('ps3StatusText');
  const trophyNotification = document.getElementById('trophyNotification');
  const trophyPopupName = document.getElementById('trophyPopupName');

  // Button notes mapping for musical controller experience
  const buttonFreqs = {
    UP: 523.25, // C5
    DOWN: 440.0, // A4
    LEFT: 493.88, // B4
    RIGHT: 587.33, // D5
    TRIANGLE: 659.25, // E5
    CIRCLE: 698.46, // F5
    CROSS: 783.99, // G5
    SQUARE: 880.0, // A5
    L1: 349.23,
    L2: 329.63,
    R1: 987.77,
    R2: 1046.5,
    SELECT: 415.3,
    START: 830.61,
    PS: 1174.66,
    L3: 261.63,
    R3: 293.66,
  };

  // Konami Code Sequence: UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, SQUARE, CIRCLE
  const secretSequence = ['UP', 'UP', 'DOWN', 'DOWN', 'LEFT', 'RIGHT', 'LEFT', 'RIGHT', 'SQUARE', 'CIRCLE'];
  let currentSequence = [];

  function triggerTrophyUnlock(title = 'PLATINUM: SECRET KONAMI MASTER!') {
    sfxTrophyUnlock();
    trophyCount += 1;
    if (trophyCountEl) {
      trophyCountEl.textContent = `🏆 x${trophyCount}`;
    }
    addScore(5000);

    if (trophyPopupName) {
      trophyPopupName.textContent = title;
    }
    if (trophyNotification) {
      trophyNotification.classList.add('show');
      setTimeout(() => {
        trophyNotification.classList.remove('show');
      }, 4500);
    }
  }

  padButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (lastPressedKeyEl) {
        lastPressedKeyEl.textContent = `[ ${key} ]`;
      }

      // Play sound
      const freq = buttonFreqs[key] || 500;
      playSynthTone(freq, 'square', 0.12, 0.18, 0.01);
      addScore(100);

      // Flash button pressed
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 150);

      // Check Konami Code
      currentSequence.push(key);
      if (currentSequence.length > secretSequence.length) {
        currentSequence.shift();
      }

      const isMatch = secretSequence.every((val, index) => val === currentSequence[index]);
      if (isMatch) {
        triggerTrophyUnlock('PLATINUM: SECRET DUALSHOCK MASTER!');
        currentSequence = [];
      }
    });
  });

  // Eject Disc Interaction
  let discEjected = false;
  if (ps3EjectBtn && ejectDiscEl) {
    ps3EjectBtn.addEventListener('click', () => {
      sfxMechanical();
      discEjected = !discEjected;
      if (discEjected) {
        ejectDiscEl.classList.add('ejected');
        ps3EjectBtn.textContent = '⏏ INSERT';
        if (ps3StatusText) ps3StatusText.textContent = 'DISC EJECTED // STANDBY';
      } else {
        ejectDiscEl.classList.remove('ejected');
        ps3EjectBtn.textContent = '⏏ EJECT';
        if (ps3StatusText) ps3StatusText.textContent = 'DISC LOADED: Web Po Bus & Cleaning Corp';
        sfxCoin();
        addScore(250);
      }
    });
  }

  // Power Button Interaction (Healthy -> Overclocked -> Normal)
  let powerMode = 0; // 0: Normal Green, 1: Overclocked Yellow, 2: Standby Red
  if (ps3PowerBtn && ps3PowerLedEl) {
    ps3PowerBtn.addEventListener('click', () => {
      sfxClick();
      powerMode = (powerMode + 1) % 3;
      if (powerMode === 0) {
        ps3PowerLedEl.className = 'led-light led-green';
        if (ps3StatusText) ps3StatusText.textContent = 'RUNNING SMOOTH (0 ERRORS)';
        sfxPowerUp();
      } else if (powerMode === 1) {
        ps3PowerLedEl.className = 'led-light led-green ylod';
        if (ps3StatusText) ps3StatusText.textContent = 'CELL ENGINE TURBO BOOST: 120 FPS!';
        playSynthTone(1050, 'square', 0.2, 0.2, 0.01);
        addScore(500);
      } else {
        ps3PowerLedEl.className = 'led-light led-orange';
        if (ps3StatusText) ps3StatusText.textContent = 'SLEEP MODE // PS3 WAITING FOR PLAYER';
        playSynthTone(200, 'sawtooth', 0.3, 0.15, 0.01);
      }
    });
  }

  // Copy PSN ID
  const copyPsnBtn = document.getElementById('copyPsnBtn');
  if (copyPsnBtn) {
    copyPsnBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('FAISAL_PS3_VETERAN').then(() => {
        sfxCoin();
        alert('PSN ID: "FAISAL_PS3_VETERAN" berhasil disalin ke clipboard!');
      });
    });
  }

  // ==========================================
  // 4. PROJECT MODALS & DEMO ACTIONS
  // ==========================================
  const modalOpenBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const demoBtns = document.querySelectorAll('.btn-interactive-demo');

  modalOpenBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        sfxClick();
        addScore(150);
      }
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.retro-modal');
      if (modal) {
        modal.classList.remove('open');
        sfxClick();
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.closest('.retro-modal');
      if (modal) modal.classList.remove('open');
    });
  });

  // Interactive Demo Buttons (Stage Test Run)
  demoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.demo;
      if (type === 'bus') {
        sfxCoin();
        alert('🚌 [PO BUS ENGINE SIMULATION]\n\nRute: Jakarta -> Surabaya\nKursi: 12A (Eksekutif Seat Terpilih)\nStatus: E-Ticket QR Code Terbit!\n\nSistem bekerja 100% realtime.');
        addScore(300);
      } else if (type === 'clean') {
        sfxPowerUp();
        alert('✨ [CLEANING CORP QUOTATION SIMULATION]\n\nItem: Heavy Duty Floor Polisher 17 Inch\nKuantiti: 2 Unit\nRFQ Status: Draf Penawaran Harga terkirim ke WhatsApp Sales!\n\nKatalog B2B siap pakai.');
        addScore(300);
      }
    });
  });

  // ==========================================
  // 5. PLAYABLE 16-BIT MINI GAME: PO BUS RUNNER
  // ==========================================
  const canvas = document.getElementById('gameCanvas');
  const gameOverlay = document.getElementById('gameOverlay');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameScoreEl = document.getElementById('gameScore');
  const gameHighScoreEl = document.getElementById('gameHighScore');
  const gameCoinsEl = document.getElementById('gameCoins');
  const gameLivesEl = document.getElementById('gameLives');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlaySubtitle = document.getElementById('overlaySubtitle');

  const ctrlLeft = document.getElementById('ctrlLeft');
  const ctrlJump = document.getElementById('ctrlJump');
  const ctrlRight = document.getElementById('ctrlRight');

  let ctx = null;
  let gameRunning = false;
  let gameAnimationId = null;

  let gScore = 0;
  let gCoins = 0;
  let gLives = 3;
  let gHighScore = parseInt(localStorage.getItem('poBus_highScore') || '0', 10);

  if (gameHighScoreEl) {
    gameHighScoreEl.textContent = gHighScore.toString();
  }

  // Game state objects
  const LANE_WIDTH = 130;
  const LANES = [160, 320, 480]; // Center X positions of 3 lanes

  const player = {
    laneIndex: 1, // 0: Left, 1: Center, 2: Right
    x: 320,
    y: 280,
    width: 60,
    height: 38,
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    color: '#00f0ff',
  };

  let roadOffset = 0;
  let obstacles = [];
  let coins = [];
  let lastSpawnTime = 0;
  let gameSpeed = 5;

  if (canvas) {
    ctx = canvas.getContext('2d');
  }

  function resetGame() {
    gScore = 0;
    gCoins = 0;
    gLives = 3;
    player.laneIndex = 1;
    player.x = LANES[1];
    player.jumpY = 0;
    player.isJumping = false;
    obstacles = [];
    coins = [];
    gameSpeed = 5;
    lastSpawnTime = Date.now();
    updateGameUI();
  }

  function updateGameUI() {
    if (gameScoreEl) gameScoreEl.textContent = gScore.toString();
    if (gameCoinsEl) gameCoinsEl.textContent = gCoins.toString();
    if (gameLivesEl) {
      gameLivesEl.textContent = '♥'.repeat(Math.max(0, gLives));
    }
  }

  function moveLeft() {
    if (player.laneIndex > 0) {
      player.laneIndex--;
      sfxClick();
    }
  }

  function moveRight() {
    if (player.laneIndex < LANES.length - 1) {
      player.laneIndex++;
      sfxClick();
    }
  }

  function jump() {
    if (!player.isJumping) {
      player.isJumping = true;
      player.jumpVelocity = 12;
      sfxJump();
    }
  }

  // Keyboard navigation for game & accessibility
  window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      moveLeft();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      moveRight();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
      jump();
      e.preventDefault();
    }
  });

  // Mobile virtual touch controls
  if (ctrlLeft) {
    ctrlLeft.addEventListener('click', (e) => {
      e.preventDefault();
      if (gameRunning) moveLeft();
    });
  }
  if (ctrlRight) {
    ctrlRight.addEventListener('click', (e) => {
      e.preventDefault();
      if (gameRunning) moveRight();
    });
  }
  if (ctrlJump) {
    ctrlJump.addEventListener('click', (e) => {
      e.preventDefault();
      if (gameRunning) jump();
    });
  }

  function spawnEntities() {
    const now = Date.now();
    if (now - lastSpawnTime > 1400) {
      lastSpawnTime = now;
      const targetLane = Math.floor(Math.random() * 3);

      // 70% chance obstacle, 30% bonus coin
      if (Math.random() > 0.3) {
        obstacles.push({
          lane: targetLane,
          x: LANES[targetLane],
          y: -50,
          width: 44,
          height: 28,
          type: Math.random() > 0.5 ? 'cone' : 'barrier',
        });
      } else {
        coins.push({
          lane: targetLane,
          x: LANES[targetLane],
          y: -40,
          size: 16,
        });
      }
    }
  }

  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimationId);
    sfxCrash();

    if (gScore > gHighScore) {
      gHighScore = gScore;
      localStorage.setItem('poBus_highScore', gHighScore.toString());
      if (gameHighScoreEl) gameHighScoreEl.textContent = gHighScore.toString();
      triggerTrophyUnlock('GOLD: HIGHWAY RUNNER CHAMPION!');
    }

    if (overlayTitle) overlayTitle.textContent = 'GAME OVER - PO BUS CRASH';
    if (overlaySubtitle) overlaySubtitle.textContent = `FINAL SCORE: ${gScore} | COINS: ${gCoins}`;
    if (startGameBtn) startGameBtn.textContent = '▶ COBA LAGI [RETRY]';
    if (gameOverlay) gameOverlay.classList.remove('hidden');
  }

  function drawPixelBus(x, y) {
    // 16-bit PO Bus drawing on Canvas
    const bx = x - 30;
    const by = y - 18;

    // Body (Cyan)
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(bx, by + 4, 60, 26);

    // Roof & Trim (White)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 4, by, 52, 4);

    // Dark Windows
    ctx.fillStyle = '#112233';
    ctx.fillRect(bx + 6, by + 6, 12, 10);
    ctx.fillRect(bx + 22, by + 6, 12, 10);
    ctx.fillRect(bx + 38, by + 6, 16, 10);

    // Livery Stripe (Magenta & Gold)
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(bx, by + 18, 60, 4);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(bx, by + 22, 60, 2);

    // Headlights
    ctx.fillStyle = '#ffff66';
    ctx.fillRect(bx + 54, by + 22, 6, 5);

    // Taillights
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(bx, by + 22, 4, 5);

    // Wheels
    ctx.fillStyle = '#111';
    ctx.fillRect(bx + 8, by + 28, 12, 8);
    ctx.fillRect(bx + 40, by + 28, 12, 8);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(bx + 12, by + 31, 4, 3);
    ctx.fillRect(bx + 44, by + 31, 4, 3);
  }

  function gameLoop() {
    if (!gameRunning || !ctx) return;

    // Clear Screen (Night Sky / Road)
    ctx.fillStyle = '#140c26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road Area
    const roadX = 80;
    const roadW = 480;
    ctx.fillStyle = '#222330';
    ctx.fillRect(roadX, 0, roadW, canvas.height);

    // Road Borders (Red & White Curb)
    const curbW = 12;
    for (let c = 0; c < canvas.height; c += 24) {
      const isRed = ((c + roadOffset) % 48) < 24;
      ctx.fillStyle = isRed ? '#ff2244' : '#ffffff';
      ctx.fillRect(roadX - curbW, c, curbW, 24);
      ctx.fillRect(roadX + roadW, c, curbW, 24);
    }

    // Lane dividing dashed lines
    roadOffset = (roadOffset + gameSpeed) % 40;
    ctx.fillStyle = '#ffcc00';
    for (let i = 1; i <= 2; i++) {
      const lx = roadX + (roadW / 3) * i;
      for (let y = -40; y < canvas.height; y += 40) {
        ctx.fillRect(lx - 2, y + roadOffset, 4, 20);
      }
    }

    // Smooth lane interpolation
    const targetX = LANES[player.laneIndex];
    player.x += (targetX - player.x) * 0.25;

    // Jumping physics
    if (player.isJumping) {
      player.jumpY += player.jumpVelocity;
      player.jumpVelocity -= 1.2;
      if (player.jumpY <= 0) {
        player.jumpY = 0;
        player.isJumping = false;
      }
    }

    // Spawn obstacles & coins
    spawnEntities();

    // Update & draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.y += gameSpeed;

      // Draw Obstacle (Traffic Cone or Barrier)
      if (obs.type === 'cone') {
        // Pixel Traffic Cone
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(obs.x - 14, obs.y + 12, 28, 8);
        ctx.fillRect(obs.x - 10, obs.y + 4, 20, 8);
        ctx.fillRect(obs.x - 6, obs.y - 4, 12, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x - 10, obs.y + 4, 20, 3);
      } else {
        // Roadwork Hazard Barrier
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(obs.x - 22, obs.y - 10, 44, 20);
        ctx.fillStyle = '#111';
        ctx.fillRect(obs.x - 18, obs.y - 6, 8, 12);
        ctx.fillRect(obs.x - 2, obs.y - 6, 8, 12);
        ctx.fillRect(obs.x + 10, obs.y - 6, 8, 12);
      }

      // Collision Check (Only if not jumping high)
      if (
        player.jumpY < 20 &&
        Math.abs(player.x - obs.x) < 32 &&
        Math.abs(player.y - obs.y) < 26
      ) {
        obstacles.splice(i, 1);
        gLives--;
        sfxCrash();
        updateGameUI();
        if (gLives <= 0) {
          gameOver();
          return;
        }
        continue;
      }

      // Remove off-screen obstacles
      if (obs.y > canvas.height + 50) {
        obstacles.splice(i, 1);
        gScore += 10;
        addScore(10);
        updateGameUI();
      }
    }

    // Update & draw coins
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.y += gameSpeed;

      // Draw 16-bit Gold Coin
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff488';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Coin Pickup Collision
      if (Math.abs(player.x - c.x) < 30 && Math.abs((player.y - player.jumpY) - c.y) < 30) {
        coins.splice(i, 1);
        gCoins++;
        gScore += 100;
        sfxCoin();
        addScore(100);
        updateGameUI();
        continue;
      }

      if (c.y > canvas.height + 30) {
        coins.splice(i, 1);
      }
    }

    // Draw PO Bus
    drawPixelBus(player.x, player.y - player.jumpY);

    // Increase game speed gradually
    gameSpeed += 0.0008;

    gameAnimationId = requestAnimationFrame(gameLoop);
  }

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      initAudioContext();
      sfxPowerUp();
      resetGame();
      if (gameOverlay) gameOverlay.classList.add('hidden');
      gameRunning = true;
      gameAnimationId = requestAnimationFrame(gameLoop);
    });
  }

  // Draw initial idle road on canvas
  if (ctx) {
    ctx.fillStyle = '#140c26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222330';
    ctx.fillRect(80, 0, 480, canvas.height);
    drawPixelBus(320, 280);
  }

  // ==========================================
  // 6. CONTACT FORM SAVE POINT
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const saveSuccessAlert = document.getElementById('saveSuccessAlert');
  const saveMsgBtn = document.getElementById('saveMsgBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('senderName').value.trim();
      const senderEmail = document.getElementById('senderEmail').value.trim();
      const senderMessage = document.getElementById('senderMessage').value.trim();

      if (!senderName || !senderEmail || !senderMessage) {
        alert('Lengkapi semua slot data sebelum menyimpan transmisi!');
        return;
      }

      // Simulate 16-bit memory card save
      sfxMechanical();
      if (saveMsgBtn) {
        saveMsgBtn.disabled = true;
        saveMsgBtn.innerHTML = '<span>💾 SAVING TO MEMORY CARD...</span>';
      }

      setTimeout(() => {
        sfxPowerUp();
        addScore(1500);
        if (saveSuccessAlert) saveSuccessAlert.classList.remove('hidden');

        if (saveMsgBtn) {
          saveMsgBtn.disabled = false;
          saveMsgBtn.innerHTML = '<span class="btn-icon">💾</span> SAVE DATA &amp; KIRIM PESAN';
        }

        contactForm.reset();

        // Unlock bronze or gold trophy if first contact
        triggerTrophyUnlock('BRONZE: TRANSMISSION DISPATCHED!');
      }, 1000);
    });
  }

  // ==========================================
  // 7. KEYBOARD KONAMI CODE EASTER EGG (GLOBAL)
  // ==========================================
  const konamiKeySequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let keyHistory = [];

  window.addEventListener('keydown', (e) => {
    keyHistory.push(e.key);
    if (keyHistory.length > konamiKeySequence.length) {
      keyHistory.shift();
    }
    const matched = konamiKeySequence.every((val, i) => val.toLowerCase() === (keyHistory[i] || '').toLowerCase());
    if (matched) {
      triggerTrophyUnlock('PLATINUM: RETRO CHEAT CODE UNLOCKED!');
      keyHistory = [];
    }
  });

  // Ready log in console for retro gamer fans
  console.log(
    '%c[16-BIT SYSTEM LOADED] Ready Player: FAISAL ABDAU // PS3 Console Edition',
    'background: #110926; color: #00f0ff; font-size: 14px; font-weight: bold; padding: 8px;'
  );
})();
