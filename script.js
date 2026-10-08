/**
 * TRI WAHYUDI // 16-BIT RETRO CLASSIC PORTFOLIO
 * Modular Tab-Based SPA, Audio Engine, PO Bus Canvas Game & Repo Filters
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

  function playSynthTone(freq, type = 'square', duration = 0.08, startVol = 0.12, endVol = 0.01) {
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
    } catch (e) {}
  }

  function sfxClick() {
    playSynthTone(750, 'square', 0.04, 0.1, 0.01);
  }

  function sfxCoin() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.07);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {}
  }

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
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  function sfxPowerUp() {
    const notes = [330, 392, 523, 659];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSynthTone(freq, 'square', 0.08, 0.14, 0.01);
      }, idx * 50);
    });
  }

  function sfxCrash() {
    playSynthTone(90, 'sawtooth', 0.2, 0.25, 0.01);
  }

  // ==========================================
  // 2. HUD & SCORE
  // ==========================================
  let currentScore = 99950;
  const hudScoreEl = document.getElementById('hudScore');
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');

  function addScore(points = 100) {
    currentScore += points;
    if (hudScoreEl) {
      hudScoreEl.textContent = currentScore.toString().padStart(6, '0');
    }
  }

  document.addEventListener('click', (e) => {
    initAudioContext();
    if (e.target.closest('.sound-click')) {
      sfxClick();
    }
  });

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

  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-active');
      const isActive = document.body.classList.contains('crt-active');
      const textSpan = crtToggleBtn.querySelector('.btn-text');
      textSpan.textContent = isActive ? 'CRT: ON' : 'CRT: OFF';
      sfxClick();
    });
  }

  // ==========================================
  // 3. MODULAR TAB ROUTER (MULTI-SCREEN SPA)
  // ==========================================
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const viewScreens = document.querySelectorAll('.view-screen');
  const quickNavBtns = document.querySelectorAll('.quick-nav-btn');

  function switchTab(targetId) {
    if (!targetId) return;

    // Remove active from all tabs & screens
    navTabs.forEach((tab) => {
      if (tab.dataset.target === targetId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    viewScreens.forEach((screen) => {
      if (screen.id === targetId) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    // Scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addScore(25);

    // Update browser hash cleanly without page jump
    const hash = targetId.replace('view-', '');
    if (history.pushState) {
      history.pushState(null, null, '#' + hash);
    }
  }

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      switchTab(targetId);
    });
  });

  quickNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      switchTab(targetId);
    });
  });

  // Handle URL hash on initial load
  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetScreen = document.getElementById('view-' + hash);
      if (targetScreen) {
        switchTab('view-' + hash);
      }
    }
  }
  window.addEventListener('load', handleInitialHash);
  window.addEventListener('popstate', handleInitialHash);

  // ==========================================
  // 4. GITHUB REPOSITORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const repoCards = document.querySelectorAll('.repo-card-box');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      sfxClick();

      repoCards.forEach((card) => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 5. PROJECT MODALS
  // ==========================================
  const modalOpenBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  modalOpenBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        sfxClick();
        addScore(100);
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

  // ==========================================
  // 6. PLAYABLE ARCADE GAME: PO BUS RUNNER
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

  const LANES = [160, 320, 480];

  const player = {
    laneIndex: 1,
    x: 320,
    y: 280,
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
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

  if (ctrlLeft) ctrlLeft.addEventListener('click', (e) => { e.preventDefault(); if (gameRunning) moveLeft(); });
  if (ctrlRight) ctrlRight.addEventListener('click', (e) => { e.preventDefault(); if (gameRunning) moveRight(); });
  if (ctrlJump) ctrlJump.addEventListener('click', (e) => { e.preventDefault(); if (gameRunning) jump(); });

  function spawnEntities() {
    const now = Date.now();
    if (now - lastSpawnTime > 1400) {
      lastSpawnTime = now;
      const targetLane = Math.floor(Math.random() * 3);

      if (Math.random() > 0.3) {
        obstacles.push({
          lane: targetLane,
          x: LANES[targetLane],
          y: -50,
          type: Math.random() > 0.5 ? 'cone' : 'barrier',
        });
      } else {
        coins.push({
          lane: targetLane,
          x: LANES[targetLane],
          y: -40,
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
    }

    if (overlayTitle) overlayTitle.textContent = 'GAME OVER - PO BUS CRASH';
    if (overlaySubtitle) overlaySubtitle.textContent = `FINAL SCORE: ${gScore} | COINS: ${gCoins}`;
    if (startGameBtn) startGameBtn.textContent = '▶ COBA LAGI [RETRY]';
    if (gameOverlay) gameOverlay.classList.remove('hidden');
  }

  function drawPixelBus(x, y) {
    const bx = x - 30;
    const by = y - 18;

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(bx, by + 4, 60, 26);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 4, by, 52, 4);
    ctx.fillStyle = '#112233';
    ctx.fillRect(bx + 6, by + 6, 12, 10);
    ctx.fillRect(bx + 22, by + 6, 12, 10);
    ctx.fillRect(bx + 38, by + 6, 16, 10);
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(bx, by + 18, 60, 4);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(bx, by + 22, 60, 2);
    ctx.fillStyle = '#ffff66';
    ctx.fillRect(bx + 54, by + 22, 6, 5);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(bx, by + 22, 4, 5);
    ctx.fillStyle = '#111';
    ctx.fillRect(bx + 8, by + 28, 12, 8);
    ctx.fillRect(bx + 40, by + 28, 12, 8);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(bx + 12, by + 31, 4, 3);
    ctx.fillRect(bx + 44, by + 31, 4, 3);
  }

  function gameLoop() {
    if (!gameRunning || !ctx) return;

    ctx.fillStyle = '#140c26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roadX = 80;
    const roadW = 480;
    ctx.fillStyle = '#222330';
    ctx.fillRect(roadX, 0, roadW, canvas.height);

    const curbW = 12;
    for (let c = 0; c < canvas.height; c += 24) {
      const isRed = ((c + roadOffset) % 48) < 24;
      ctx.fillStyle = isRed ? '#ff2244' : '#ffffff';
      ctx.fillRect(roadX - curbW, c, curbW, 24);
      ctx.fillRect(roadX + roadW, c, curbW, 24);
    }

    roadOffset = (roadOffset + gameSpeed) % 40;
    ctx.fillStyle = '#ffcc00';
    for (let i = 1; i <= 2; i++) {
      const lx = roadX + (roadW / 3) * i;
      for (let y = -40; y < canvas.height; y += 40) {
        ctx.fillRect(lx - 2, y + roadOffset, 4, 20);
      }
    }

    const targetX = LANES[player.laneIndex];
    player.x += (targetX - player.x) * 0.25;

    if (player.isJumping) {
      player.jumpY += player.jumpVelocity;
      player.jumpVelocity -= 1.2;
      if (player.jumpY <= 0) {
        player.jumpY = 0;
        player.isJumping = false;
      }
    }

    spawnEntities();

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.y += gameSpeed;

      if (obs.type === 'cone') {
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(obs.x - 14, obs.y + 12, 28, 8);
        ctx.fillRect(obs.x - 10, obs.y + 4, 20, 8);
        ctx.fillRect(obs.x - 6, obs.y - 4, 12, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x - 10, obs.y + 4, 20, 3);
      } else {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(obs.x - 22, obs.y - 10, 44, 20);
        ctx.fillStyle = '#111';
        ctx.fillRect(obs.x - 18, obs.y - 6, 8, 12);
        ctx.fillRect(obs.x - 2, obs.y - 6, 8, 12);
        ctx.fillRect(obs.x + 10, obs.y - 6, 8, 12);
      }

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

      if (obs.y > canvas.height + 50) {
        obstacles.splice(i, 1);
        gScore += 10;
        addScore(10);
        updateGameUI();
      }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.y += gameSpeed;

      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff488';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fill();

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

    drawPixelBus(player.x, player.y - player.jumpY);
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

  // Draw initial idle road
  if (ctx) {
    ctx.fillStyle = '#140c26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222330';
    ctx.fillRect(80, 0, 480, canvas.height);
    drawPixelBus(320, 280);
  }

  // ==========================================
  // 7. CONTACT FORM SAVE POINT
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
        alert('Harap isi nama, email, dan pesan Anda!');
        return;
      }

      if (saveMsgBtn) {
        saveMsgBtn.disabled = true;
        saveMsgBtn.innerHTML = '<span>💾 MENYIMPAN TRANSMISI...</span>';
      }

      setTimeout(() => {
        sfxPowerUp();
        addScore(1000);
        if (saveSuccessAlert) saveSuccessAlert.classList.remove('hidden');

        if (saveMsgBtn) {
          saveMsgBtn.disabled = false;
          saveMsgBtn.innerHTML = '<span class="btn-icon">💾</span> SAVE DATA &amp; KIRIM KE TRI WAHYUDI';
        }

        contactForm.reset();
      }, 800);
    });
  }

  console.log(
    '%c[16-BIT SYSTEM READY] Tri Wahyudi // Informatics Engineering (Age 21)',
    'background: #110926; color: #00f0ff; font-size: 13px; font-weight: bold; padding: 6px;'
  );
})();
