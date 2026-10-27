/**
 * TRI WAHYUDI - WINDOWS 98 / 95 CLASSIC IT PORTFOLIO
 * Window Manager, Web Audio Synth, Playable Minesweeper & PO Bus Arcade
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API - 90s RETRO SYNTHESIZER
  // =========================================================================
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

  function playTone(freq, type = 'square', duration = 0.08, startVol = 0.1, endVol = 0.01) {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(startVol, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Windows 95/98 Classic Startup Chord
  function playStartupChime() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major extended
      const now = audioCtx.currentTime;
      chord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + 1.8);
      });
    } catch (e) {}
  }

  function sfxClick() {
    playTone(850, 'square', 0.03, 0.08, 0.01);
  }

  function sfxOpenWin() {
    playTone(440, 'triangle', 0.05, 0.08, 0.01);
    setTimeout(() => playTone(880, 'triangle', 0.07, 0.08, 0.01), 40);
  }

  function sfxCloseWin() {
    playTone(660, 'triangle', 0.05, 0.08, 0.01);
    setTimeout(() => playTone(330, 'triangle', 0.06, 0.08, 0.01), 40);
  }

  function sfxMineClick() {
    playTone(900, 'square', 0.02, 0.06, 0.01);
  }

  function sfxMineFlag() {
    playTone(550, 'triangle', 0.05, 0.08, 0.01);
  }

  function sfxExplosion() {
    if (!sfxEnabled) return;
    initAudioContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  function sfxVictory() {
    const melody = [523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.12, 0.12, 0.01), idx * 90);
    });
  }

  // Play startup sound on first user interaction
  let startupPlayed = false;
  document.addEventListener('pointerdown', () => {
    initAudioContext();
    if (!startupPlayed) {
      startupPlayed = true;
      playStartupChime();
    }
  }, { once: true });


  // =========================================================================
  // 2. WINDOW MANAGER & DESKTOP INTERACTION
  // =========================================================================
  let highestZIndex = 100;
  const windows = Array.from(document.querySelectorAll('.win98-window:not(.win98-modal)'));
  const taskbarItems = document.getElementById('taskbarItems');
  const startBtn = document.getElementById('startBtn');
  const startMenu = document.getElementById('startMenu');

  function bringToFront(win) {
    if (!win) return;
    highestZIndex += 1;
    win.style.zIndex = highestZIndex;

    windows.forEach(w => w.classList.remove('active'));
    win.classList.add('active');

    updateTaskbar();
  }

  function openWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    win.classList.remove('hidden');
    win.classList.remove('minimized');
    bringToFront(win);
    sfxOpenWin();

    // If Minesweeper, ensure game is initialized
    if (winId === 'win-minesweeper' && !window.msInitialized) {
      initMinesweeper();
    }
    // If Arcade, resize canvas if needed
    if (winId === 'win-arcade') {
      resizeArcadeCanvas();
    }
  }

  function closeWindow(win) {
    win.classList.add('hidden');
    win.classList.remove('active');
    sfxCloseWin();
    updateTaskbar();
  }

  function minimizeWindow(win) {
    win.classList.add('minimized');
    win.classList.remove('active');
    sfxCloseWin();
    updateTaskbar();
  }

  function toggleMaximize(win) {
    win.classList.toggle('maximized');
    const maxBtn = win.querySelector('[data-action="max"]');
    if (maxBtn) {
      maxBtn.textContent = win.classList.contains('maximized') ? '❐' : '□';
    }
    sfxClick();
  }

  // Update Taskbar Buttons for Open Windows
  function updateTaskbar() {
    if (!taskbarItems) return;
    taskbarItems.innerHTML = '';

    windows.forEach(win => {
      if (win.classList.contains('hidden')) return;

      const titleEl = win.querySelector('.titlebar-text');
      const iconEl = win.querySelector('.titlebar-icon');
      const title = titleEl ? titleEl.textContent : 'Window';
      const icon = iconEl ? iconEl.textContent : '🪟';

      const btn = document.createElement('button');
      btn.className = 'taskbar-item-btn win-outset-box';
      if (win.classList.contains('active') && !win.classList.contains('minimized')) {
        btn.classList.add('active');
      }

      btn.innerHTML = `<span class="tb-icon">${icon}</span> <span class="tb-title">${title}</span>`;
      btn.addEventListener('click', () => {
        sfxClick();
        if (win.classList.contains('minimized')) {
          win.classList.remove('minimized');
          bringToFront(win);
        } else if (win.classList.contains('active')) {
          minimizeWindow(win);
        } else {
          bringToFront(win);
        }
      });

      taskbarItems.appendChild(btn);
    });
  }

  // Setup Windows Listeners (Drag, Controls, Focus)
  windows.forEach((win) => {
    // Focus on click
    win.addEventListener('pointerdown', (e) => {
      if (!win.classList.contains('active')) {
        bringToFront(win);
      }
    });

    // Window controls
    const minBtn = win.querySelector('[data-action="min"]');
    const maxBtn = win.querySelector('[data-action="max"]');
    const closeBtn = win.querySelector('[data-action="close"]');

    if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(win); });
    if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(win); });
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win); });

    // Dragging Logic
    const titlebar = win.querySelector('.window-titlebar');
    if (titlebar) {
      let isDragging = false;
      let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

      titlebar.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.win-btn')) return; // Don't drag when clicking titlebar buttons
        if (win.classList.contains('maximized')) return;
        if (window.innerWidth <= 768) return; // Disable drag on mobile for layout stability

        isDragging = true;
        titlebar.setPointerCapture(e.pointerId);
        bringToFront(win);

        startX = e.clientX;
        startY = e.clientY;
        initialLeft = win.offsetLeft;
        initialTop = win.offsetTop;
      });

      titlebar.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Keep inside desktop
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 80));
        newLeft = Math.max(-100, Math.min(newLeft, window.innerWidth - 100));

        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try { titlebar.releasePointerCapture(e.pointerId); } catch(err) {}
        }
      };

      titlebar.addEventListener('pointerup', stopDrag);
      titlebar.addEventListener('pointercancel', stopDrag);
    }
  });

  // Desktop Icons Triggers
  const desktopIcons = document.querySelectorAll('.desktop-icon-btn');
  desktopIcons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      desktopIcons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const targetId = btn.getAttribute('data-target');
      if (targetId) openWindow(targetId);
    });
  });

  // Generic Open Window Triggers
  document.querySelectorAll('.open-win-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      if (targetId) {
        openWindow(targetId);
        if (startMenu) startMenu.classList.add('hidden');
        if (startBtn) startBtn.classList.remove('active');
      }
    });
  });

  // Start Menu Toggle
  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sfxClick();
      const isHidden = startMenu.classList.contains('hidden');
      if (isHidden) {
        startMenu.classList.remove('hidden');
        startBtn.classList.add('active');
      } else {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      }
    });
  }

  // System Properties Subtabs
  const tabBtns = document.querySelectorAll('.tabs-header .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      const targetSubtab = btn.getAttribute('data-subtab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetSubtab) pane.classList.add('active');
      });
    });
  });

  // Real-Time System Tray Clock
  const trayClock = document.getElementById('trayClock');
  function updateClock() {
    if (!trayClock) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    trayClock.textContent = `${hrs}:${mins}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Tray Controls: SFX & CRT
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxIcon = document.getElementById('sfxIcon');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      if (sfxIcon) sfxIcon.textContent = sfxEnabled ? '🔊' : '🔇';
      if (sfxEnabled) sfxClick();
    });
  }

  const crtToggleBtn = document.getElementById('crtToggleBtn');
  const crtOverlay = document.getElementById('crtOverlay');
  if (crtToggleBtn && crtOverlay) {
    crtToggleBtn.addEventListener('click', () => {
      sfxClick();
      crtOverlay.classList.toggle('active');
    });
  }

  // Shutdown Dialog
  const shutDownBtn = document.getElementById('shutDownBtn');
  const shutdownModal = document.getElementById('shutdownModal');
  const confirmShutdownBtn = document.getElementById('confirmShutdownBtn');
  const cancelShutdownBtn = document.getElementById('cancelShutdownBtn');
  const cancelShutdownX = document.getElementById('cancelShutdownX');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openShutdown() {
    if (shutdownModal) shutdownModal.classList.remove('hidden');
    if (modalBackdrop) modalBackdrop.classList.remove('hidden');
    if (startMenu) startMenu.classList.add('hidden');
    if (startBtn) startBtn.classList.remove('active');
    sfxClick();
  }

  function closeShutdown() {
    if (shutdownModal) shutdownModal.classList.add('hidden');
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    sfxClick();
  }

  if (shutDownBtn) shutDownBtn.addEventListener('click', openShutdown);
  if (cancelShutdownBtn) cancelShutdownBtn.addEventListener('click', closeShutdown);
  if (cancelShutdownX) cancelShutdownX.addEventListener('click', closeShutdown);

  if (confirmShutdownBtn) {
    confirmShutdownBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[name="sd-action"]:checked');
      const val = selected ? selected.value : 'restart';
      if (val === 'restart') {
        window.location.reload();
      } else if (val === 'shutdown') {
        document.body.innerHTML = `
          <div style="background:#000;color:#ff8000;font-family:'VT323',monospace;font-size:28px;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;">
            <div>
              <p>It's now safe to turn off your computer.</p>
              <p style="font-size:18px;margin-top:16px;color:#888;">(Atau klik di mana saja untuk kembali ke portfolio Tri Wahyudi)</p>
            </div>
          </div>
        `;
        document.body.addEventListener('click', () => window.location.reload(), { once: true });
      } else {
        closeShutdown();
      }
    });
  }

  // Project Modals
  document.querySelectorAll('.open-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      sfxClick();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal && modalBackdrop) {
        modal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
      }
    });
  });

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfxCloseWin();
      document.querySelectorAll('.win98-modal').forEach(m => m.classList.add('hidden'));
      if (modalBackdrop) modalBackdrop.classList.add('hidden');
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', () => {
      document.querySelectorAll('.win98-modal').forEach(m => m.classList.add('hidden'));
      modalBackdrop.classList.add('hidden');
    });
  }

  // GitHub Explorer Filter Tabs
  const repoFilterBtns = document.querySelectorAll('.repo-filter-btn');
  const repoRows = document.querySelectorAll('.repo-item-row');

  repoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      repoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      repoRows.forEach(row => {
        const cat = row.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Contact Form (Outlook Express)
  const contactForm = document.getElementById('contactForm');
  const toolbarSendBtn = document.getElementById('toolbarSendBtn');
  const saveSuccessAlert = document.getElementById('saveSuccessAlert');

  function handleSendMail() {
    const senderName = document.getElementById('senderName');
    const senderEmail = document.getElementById('senderEmail');
    const senderMessage = document.getElementById('senderMessage');

    if (!senderName || !senderName.value.trim()) {
      alert('Mohon isi nama Anda di kolom From!');
      if (senderName) senderName.focus();
      return;
    }
    if (!senderEmail || !senderEmail.value.trim()) {
      alert('Mohon isi alamat email Anda!');
      if (senderEmail) senderEmail.focus();
      return;
    }
    if (!senderMessage || !senderMessage.value.trim()) {
      alert('Mohon tulis pesan Anda!');
      if (senderMessage) senderMessage.focus();
      return;
    }

    sfxVictory();
    if (saveSuccessAlert) {
      saveSuccessAlert.classList.remove('hidden');
      setTimeout(() => {
        saveSuccessAlert.classList.add('hidden');
      }, 5000);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMail();
    });
  }
  if (toolbarSendBtn) {
    toolbarSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSendMail();
    });
  }


  // =========================================================================
  // 3. MINESWEEPER PLAYABLE 90s GAME ENGINE
  // =========================================================================
  const MS_ROWS = 9;
  const MS_COLS = 9;
  const MS_MINES = 10;

  let msGrid = [];
  let msGameOver = false;
  let msGameWon = false;
  let msMinesLeft = MS_MINES;
  let msTimerVal = 0;
  let msTimerInterval = null;
  let msFirstClick = true;

  const msBoardEl = document.getElementById('msBoard');
  const msFaceBtn = document.getElementById('msFaceBtn');
  const msMineCountEl = document.getElementById('msMineCount');
  const msTimerEl = document.getElementById('msTimer');

  function initMinesweeper() {
    window.msInitialized = true;
    msGameOver = false;
    msGameWon = false;
    msFirstClick = true;
    msMinesLeft = MS_MINES;
    msTimerVal = 0;
    clearInterval(msTimerInterval);

    if (msFaceBtn) msFaceBtn.textContent = '🙂';
    if (msMineCountEl) msMineCountEl.textContent = String(msMinesLeft).padStart(3, '0');
    if (msTimerEl) msTimerEl.textContent = '000';

    // Build empty grid
    msGrid = [];
    if (msBoardEl) msBoardEl.innerHTML = '';

    for (let r = 0; r < MS_ROWS; r++) {
      const row = [];
      for (let c = 0; c < MS_COLS; c++) {
        const cellData = {
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          element: null
        };

        const cellEl = document.createElement('div');
        cellEl.className = 'ms-cell';

        // Mouse listeners
        cellEl.addEventListener('pointerdown', (e) => {
          if (msGameOver || msGameWon) return;
          if (e.button === 0 && msFaceBtn) msFaceBtn.textContent = '😮';
        });

        cellEl.addEventListener('pointerup', () => {
          if (!msGameOver && !msGameWon && msFaceBtn) msFaceBtn.textContent = '🙂';
        });

        // Left Click / Tap
        cellEl.addEventListener('click', (e) => {
          e.preventDefault();
          onCellClick(r, c);
        });

        // Right Click / Contextmenu for Flag
        cellEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          onCellRightClick(r, c);
        });

        cellData.element = cellEl;
        row.push(cellData);
        if (msBoardEl) msBoardEl.appendChild(cellEl);
      }
      msGrid.push(row);
    }
  }

  function startMsTimer() {
    clearInterval(msTimerInterval);
    msTimerInterval = setInterval(() => {
      if (msTimerVal < 999) {
        msTimerVal++;
        if (msTimerEl) msTimerEl.textContent = String(msTimerVal).padStart(3, '0');
      }
    }, 1000);
  }

  function placeMines(firstR, firstC) {
    let placed = 0;
    while (placed < MS_MINES) {
      const r = Math.floor(Math.random() * MS_ROWS);
      const c = Math.floor(Math.random() * MS_COLS);

      // Safe zone around first click
      if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

      if (!msGrid[r][c].isMine) {
        msGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < MS_ROWS; r++) {
      for (let c = 0; c < MS_COLS; c++) {
        if (msGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < MS_ROWS && nc >= 0 && nc < MS_COLS) {
              if (msGrid[nr][nc].isMine) count++;
            }
          }
        }
        msGrid[r][c].neighborMines = count;
      }
    }
  }

  function onCellClick(r, c) {
    if (msGameOver || msGameWon) return;
    const cell = msGrid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (msFirstClick) {
      msFirstClick = false;
      placeMines(r, c);
      startMsTimer();
    }

    if (cell.isMine) {
      // Hit mine! Game over
      revealAllMines(cell);
      msGameOver = true;
      clearInterval(msTimerInterval);
      if (msFaceBtn) msFaceBtn.textContent = '😵';
      sfxExplosion();
      return;
    }

    sfxMineClick();
    revealCell(r, c);
    checkWinCondition();
  }

  function onCellRightClick(r, c) {
    if (msGameOver || msGameWon) return;
    const cell = msGrid[r][c];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    if (cell.isFlagged) {
      cell.element.classList.add('flagged');
      cell.element.textContent = '🚩';
      msMinesLeft--;
      sfxMineFlag();
    } else {
      cell.element.classList.remove('flagged');
      cell.element.textContent = '';
      msMinesLeft++;
      sfxMineClick();
    }

    if (msMineCountEl) {
      msMineCountEl.textContent = String(Math.max(-99, msMinesLeft)).padStart(3, '0');
    }
  }

  function revealCell(r, c) {
    const cell = msGrid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.neighborMines > 0) {
      cell.element.textContent = cell.neighborMines;
      cell.element.classList.add(`ms-n-${cell.neighborMines}`);
    } else {
      cell.element.textContent = '';
      // Flood fill cascade
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < MS_ROWS && nc >= 0 && nc < MS_COLS) {
            if (!msGrid[nr][nc].isRevealed && !msGrid[nr][nc].isMine) {
              revealCell(nr, nc);
            }
          }
        }
      }
    }
  }

  function revealAllMines(explodedCell) {
    for (let r = 0; r < MS_ROWS; r++) {
      for (let c = 0; c < MS_COLS; c++) {
        const cell = msGrid[r][c];
        if (cell.isMine) {
          cell.element.classList.add('revealed');
          cell.element.textContent = '💣';
          if (cell === explodedCell) {
            cell.element.classList.add('mine-exploded');
          }
        } else if (cell.isFlagged && !cell.isMine) {
          cell.element.textContent = '❌';
        }
      }
    }
  }

  function checkWinCondition() {
    let unrevealedNonMines = 0;
    for (let r = 0; r < MS_ROWS; r++) {
      for (let c = 0; c < MS_COLS; c++) {
        if (!msGrid[r][c].isMine && !msGrid[r][c].isRevealed) {
          unrevealedNonMines++;
        }
      }
    }

    if (unrevealedNonMines === 0) {
      msGameWon = true;
      clearInterval(msTimerInterval);
      if (msFaceBtn) msFaceBtn.textContent = '😎';
      sfxVictory();
      // Flag all mines
      for (let r = 0; r < MS_ROWS; r++) {
        for (let c = 0; c < MS_COLS; c++) {
          if (msGrid[r][c].isMine && !msGrid[r][c].isFlagged) {
            msGrid[r][c].isFlagged = true;
            msGrid[r][c].element.textContent = '🚩';
            msGrid[r][c].element.classList.add('flagged');
          }
        }
      }
      if (msMineCountEl) msMineCountEl.textContent = '000';
    }
  }

  if (msFaceBtn) {
    msFaceBtn.addEventListener('click', () => {
      sfxClick();
      initMinesweeper();
    });
  }


  // =========================================================================
  // 4. ARCADE PO BUS HIGHWAY RUSH (PLAYABLE CANVAS GAME)
  // =========================================================================
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const gameOverlay = document.getElementById('gameOverlay');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameScoreEl = document.getElementById('gameScore');
  const gameHighScoreEl = document.getElementById('gameHighScore');
  const gameCoinsEl = document.getElementById('gameCoins');
  const gameLivesEl = document.getElementById('gameLives');

  let gameRunning = false;
  let gameAnimId = null;
  let score = 0;
  let coins = 0;
  let lives = 3;
  let highScore = parseInt(localStorage.getItem('poBusHighScore') || '0', 10);
  if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;

  const bus = {
    x: 60,
    y: 200,
    width: 64,
    height: 32,
    dy: 0,
    isJumping: false,
    speed: 5
  };

  let obstacles = [];
  let pickups = [];
  let roadOffset = 0;

  function resizeArcadeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = 640;
      canvas.height = 340;
    }
  }

  function resetGame() {
    score = 0;
    coins = 0;
    lives = 3;
    obstacles = [];
    pickups = [];
    bus.y = 210;
    bus.dy = 0;
    bus.isJumping = false;
    updateGameHud();
  }

  function updateGameHud() {
    if (gameScoreEl) gameScoreEl.textContent = score;
    if (gameCoinsEl) gameCoinsEl.textContent = coins;
    if (gameLivesEl) {
      gameLivesEl.textContent = '♥'.repeat(Math.max(0, lives));
    }
  }

  function jump() {
    if (!bus.isJumping && gameRunning) {
      bus.isJumping = true;
      bus.dy = -10;
      playTone(350, 'triangle', 0.1, 0.12, 0.01);
    }
  }

  function moveLeft() {
    if (gameRunning) bus.x = Math.max(20, bus.x - 20);
  }

  function moveRight() {
    if (gameRunning) bus.x = Math.min(canvas.width - 90, bus.x + 20);
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      jump();
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      moveRight();
    }
  });

  // Mobile Touch buttons
  const ctrlLeft = document.getElementById('ctrlLeft');
  const ctrlJump = document.getElementById('ctrlJump');
  const ctrlRight = document.getElementById('ctrlRight');
  if (ctrlLeft) ctrlLeft.addEventListener('click', moveLeft);
  if (ctrlJump) ctrlJump.addEventListener('click', jump);
  if (ctrlRight) ctrlRight.addEventListener('click', moveRight);

  function spawnObstacle() {
    if (Math.random() < 0.025) {
      obstacles.push({
        x: canvas.width + 20,
        y: 220,
        width: 34,
        height: 24,
        speed: 5 + Math.min(5, Math.floor(score / 500))
      });
    }
  }

  function spawnPickup() {
    if (Math.random() < 0.02) {
      pickups.push({
        x: canvas.width + 20,
        y: 170 + Math.random() * 40,
        radius: 8,
        speed: 4
      });
    }
  }

  function gameLoop() {
    if (!gameRunning || !ctx) return;

    // Clear background (90s retro highway)
    ctx.fillStyle = '#111936';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mountains / skyline
    ctx.fillStyle = '#1b2447';
    ctx.fillRect(0, 80, canvas.width, 100);

    // Highway road
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 180, canvas.width, 160);

    // Road markings
    roadOffset = (roadOffset - 6) % 40;
    ctx.fillStyle = '#ffd040';
    for (let x = roadOffset; x < canvas.width; x += 40) {
      ctx.fillRect(x, 250, 22, 6);
    }

    // Bus physics
    if (bus.isJumping) {
      bus.y += bus.dy;
      bus.dy += 0.55; // gravity
      if (bus.y >= 210) {
        bus.y = 210;
        bus.isJumping = false;
        bus.dy = 0;
      }
    }

    // Draw PO Bus (ASM Putra Trans)
    ctx.fillStyle = '#00a0f0'; // Bus body
    ctx.fillRect(bus.x, bus.y, bus.width, bus.height);

    ctx.fillStyle = '#ffffff'; // White livery
    ctx.fillRect(bus.x, bus.y + 12, bus.width, 6);

    ctx.fillStyle = '#111'; // Windows
    ctx.fillRect(bus.x + 8, bus.y + 4, 12, 8);
    ctx.fillRect(bus.x + 24, bus.y + 4, 12, 8);
    ctx.fillRect(bus.x + 40, bus.y + 4, 16, 8);

    ctx.fillStyle = '#000'; // Wheels
    ctx.beginPath();
    ctx.arc(bus.x + 14, bus.y + bus.height, 6, 0, Math.PI * 2);
    ctx.arc(bus.x + bus.width - 14, bus.y + bus.height, 6, 0, Math.PI * 2);
    ctx.fill();

    // Spawns
    spawnObstacle();
    spawnPickup();

    // Update and draw obstacles (cars / barriers)
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= obs.speed;

      ctx.fillStyle = '#ff3333';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(obs.x + 2, obs.y + 4, 4, 4);

      // Collision detection
      if (
        bus.x < obs.x + obs.width &&
        bus.x + bus.width > obs.x &&
        bus.y < obs.y + obs.height &&
        bus.y + bus.height > obs.y
      ) {
        obstacles.splice(i, 1);
        lives--;
        sfxExplosion();
        updateGameHud();
        if (lives <= 0) {
          endGame();
          return;
        }
        continue;
      }

      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
        score += 50;
        updateGameHud();
      }
    }

    // Update and draw pickups (coins)
    for (let i = pickups.length - 1; i >= 0; i--) {
      const p = pickups[i];
      p.x -= p.speed;

      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Collect coin
      if (
        bus.x < p.x + p.radius &&
        bus.x + bus.width > p.x - p.radius &&
        bus.y < p.y + p.radius &&
        bus.y + bus.height > p.y - p.radius
      ) {
        pickups.splice(i, 1);
        coins++;
        score += 100;
        playTone(987.77, 'square', 0.06, 0.1, 0.01);
        updateGameHud();
        continue;
      }

      if (p.x + p.radius < 0) {
        pickups.splice(i, 1);
      }
    }

    score += 1;
    if (score % 20 === 0) updateGameHud();

    gameAnimId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    resetGame();
    gameRunning = true;
    if (gameOverlay) gameOverlay.classList.add('hidden');
    playTone(523.25, 'triangle', 0.1, 0.15, 0.01);
    gameLoop();
  }

  function endGame() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimId);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('poBusHighScore', highScore);
      if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;
    }

    if (gameOverlay) {
      const title = document.getElementById('overlayTitle');
      const sub = document.getElementById('overlaySubtitle');
      if (title) title.textContent = 'GAME OVER';
      if (sub) sub.textContent = `Skor Anda: ${score} | Koin: ${coins}`;
      gameOverlay.classList.remove('hidden');
    }
  }

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      sfxClick();
      startGame();
    });
  }

  // =========================================================================
  // INITIALIZATION ON LOAD
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    updateTaskbar();
    // Default open window: My Computer
    openWindow('win-mycomputer');
  });

})();
