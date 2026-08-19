/**
 * MAANMITRA - Core Application Engine (Vanilla JavaScript)
 * Smart India Hackathon 2026 - Problem Statement SIH25092
 */

// Global State
let currentTheme = localStorage.getItem('maanmitra_theme') || 'light';
let selectedMood = '';
let currentRecommendationCode = 'HELP_ME_CALM_DOWN';
let journalEntries = JSON.parse(localStorage.getItem('maanmitra_journal') || '[]');
let moodHistory = JSON.parse(localStorage.getItem('maanmitra_mood_history') || '[]');

// Breathing exercise state
let breathingActive = false;
let breathingInterval = null;
let breathingPhase = 'BREATHE IN';
let breathingTimer = 4;

// Motivate timer state
let motivateSeconds = 900;
let motivateInterval = null;
let motivateRunning = false;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initMoodCheckIn();
  initChat();
  initJournal();
  initActivities();
  initTrackerCharts();
  initHelpModal();

  // Load sample mood history if empty for demonstration
  if (moodHistory.length === 0) {
    seedSampleMoodData();
  }
  updateDashboard();
});

/* ==================== 1. THEME MANAGER ==================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('maanmitra_theme', currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

/* ==================== 2. NAVIGATION (SPA VIEWS) ==================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const pageId = btn.getAttribute('data-page');
      navigateToPage(pageId);
      if (navLinks) navLinks.classList.remove('mobile-open');
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
}

function navigateToPage(pageId) {
  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-page') === pageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update page sections
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById(`page-${pageId}`);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Refresh charts if opening tracker
  if (pageId === 'tracker' || pageId === 'home') {
    updateDashboard();
    renderTrackerCharts();
  }
}

/* ==================== 3. MOOD CHECK-IN & NLP ENGINE ==================== */
function initMoodCheckIn() {
  const moodCards = document.querySelectorAll('.mood-card-btn');
  const textInput = document.getElementById('moodTextInput');
  const analyzeBtn = document.getElementById('analyzeMoodBtn');

  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      moodCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedMood = card.getAttribute('data-mood');
    });
  });

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      const text = textInput ? textInput.value.trim() : '';
      if (!selectedMood && !text) {
        alert("Please select a mood emoji or tell us how you're feeling in the text box.");
        return;
      }

      // Run Modular Service Function
      const analysis = await analyzeTextService(text, selectedMood);
      renderNLPResultCard(analysis);

      // Save to Mood History in localStorage
      saveMoodEntry({
        mood: selectedMood || analysis.emotion,
        text: text,
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        distressLevel: analysis.distressLevel,
        date: new Date().toISOString()
      });
    });
  }
}

function saveMoodEntry(entry) {
  moodHistory.unshift(entry);
  if (moodHistory.length > 50) moodHistory.pop();
  localStorage.setItem('maanmitra_mood_history', JSON.stringify(moodHistory));
  updateDashboard();
}

function renderNLPResultCard(res) {
  const resultContainer = document.getElementById('nlpResultContainer');
  if (!resultContainer) return;

  currentRecommendationCode = res.recommendation;

  resultContainer.innerHTML = `
    <div class="glass-card" style="padding: 28px; background: ${res.isCrisis ? '#fff1f2' : 'var(--glass-bg)'}; border: ${res.isCrisis ? '2px solid #f43f5e' : '1px solid var(--primary)'};">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <h3 style="fontSize:1.25rem; font-weight:800; margin:0;">Feeling Analysis & Recommendation</h3>
        <div>
          <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">Distress Indicator:</span>
          <span class="badge badge-${res.distressLevel.toLowerCase()}">${res.distressLevel} DISTRESS</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:20px;">
        <div style="background:var(--bg-card); padding:12px 16px; border-radius:12px;">
          <span style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Detected Emotion</span>
          <div style="font-size:1.1rem; font-weight:800; color:var(--primary); margin-top:4px;">${res.emotion}</div>
        </div>
        <div style="background:var(--bg-card); padding:12px 16px; border-radius:12px;">
          <span style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Sentiment</span>
          <div style="font-size:1.1rem; font-weight:800; color:var(--secondary); margin-top:4px;">${res.sentiment}</div>
        </div>
      </div>

      <p style="font-size:0.95rem; color:var(--text-primary); line-height:1.6; margin-bottom:20px; font-style:italic;">
        "${res.distressDescription}"
      </p>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <span style="font-size:0.8rem; color:var(--text-secondary);">🛡️ Non-clinical emotional distress indicator</span>
        <button onclick="openSupportMode('${res.recommendation}')" class="btn ${res.isCrisis ? 'btn-accent' : 'btn-primary'}">
          Recommended: ${res.recommendationLabel} →
        </button>
      </div>
    </div>
  `;

  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/* ==================== 4. ACTIVITIES & 8 SUPPORT MODES ==================== */
function initActivities() {
  const tabBtns = document.querySelectorAll('.act-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      switchActivityTab(mode);
    });
  });
}

function openSupportMode(modeCode) {
  navigateToPage('activities');
  const tabBtn = document.querySelector(`.act-tab-btn[data-mode="${modeCode}"]`);
  if (tabBtn) tabBtn.click();
}

function switchActivityTab(modeCode) {
  document.querySelectorAll('.act-tab-content').forEach(c => c.style.display = 'none');
  const target = document.getElementById(`act-${modeCode}`);
  if (target) target.style.display = 'block';
}

// 4-4-4 Box Breathing Exercise
function toggleBreathing() {
  const circle = document.getElementById('breatheCircle');
  const textElem = document.getElementById('breatheText');
  const timerElem = document.getElementById('breatheTimer');
  const btn = document.getElementById('breatheToggleBtn');

  if (breathingActive) {
    clearInterval(breathingInterval);
    breathingActive = false;
    if (circle) circle.classList.remove('breathe-active');
    if (btn) btn.innerHTML = '▶ START BREATHING';
  } else {
    breathingActive = true;
    if (circle) circle.classList.add('breathe-active');
    if (btn) btn.innerHTML = '⏸ PAUSE';

    breathingInterval = setInterval(() => {
      breathingTimer--;
      if (breathingTimer <= 0) {
        if (breathingPhase === 'BREATHE IN') {
          breathingPhase = 'HOLD';
        } else if (breathingPhase === 'HOLD') {
          breathingPhase = 'BREATHE OUT';
        } else {
          breathingPhase = 'BREATHE IN';
        }
        breathingTimer = 4;
      }
      if (textElem) textElem.textContent = breathingPhase;
      if (timerElem) timerElem.textContent = `${breathingTimer}s`;
    }, 1000);
  }
}

function resetBreathing() {
  if (breathingActive) toggleBreathing();
  breathingPhase = 'BREATHE IN';
  breathingTimer = 4;
  const textElem = document.getElementById('breatheText');
  const timerElem = document.getElementById('breatheTimer');
  if (textElem) textElem.textContent = 'BREATHE IN';
  if (timerElem) timerElem.textContent = '4s';
}

// Distract Me Memory Match Game
let memoryCards = [
  { id:1, symbol:'🌸', flipped:false, matched:false },
  { id:2, symbol:'🚀', flipped:false, matched:false },
  { id:3, symbol:'🎨', flipped:false, matched:false },
  { id:4, symbol:'🎧', flipped:false, matched:false },
  { id:5, symbol:'🌸', flipped:false, matched:false },
  { id:6, symbol:'🚀', flipped:false, matched:false },
  { id:7, symbol:'🎨', flipped:false, matched:false },
  { id:8, symbol:'🎧', flipped:false, matched:false }
];
let selectedMemoryCards = [];

function renderMemoryGame() {
  const container = document.getElementById('memoryGameGrid');
  if (!container) return;
  container.innerHTML = '';

  memoryCards.forEach((card, idx) => {
    const btn = document.createElement('button');
    btn.className = 'glass-card';
    btn.style.cssText = `width:70px; height:70px; border-radius:14px; border:none; font-size:1.8rem; cursor:pointer; background:${card.flipped || card.matched ? 'var(--primary-light)' : 'var(--secondary)'}; color:white; font-family:inherit;`;
    btn.textContent = card.flipped || card.matched ? card.symbol : '❓';
    btn.onclick = () => handleMemoryCardClick(idx);
    container.appendChild(btn);
  });
}

function handleMemoryCardClick(idx) {
  if (selectedMemoryCards.length === 2 || memoryCards[idx].flipped || memoryCards[idx].matched) return;
  memoryCards[idx].flipped = true;
  selectedMemoryCards.push(idx);
  renderMemoryGame();

  if (selectedMemoryCards.length === 2) {
    const [c1, c2] = selectedMemoryCards;
    if (memoryCards[c1].symbol === memoryCards[c2].symbol) {
      memoryCards[c1].matched = true;
      memoryCards[c2].matched = true;
      selectedMemoryCards = [];
      renderMemoryGame();
    } else {
      setTimeout(() => {
        memoryCards[c1].flipped = false;
        memoryCards[c2].flipped = false;
        selectedMemoryCards = [];
        renderMemoryGame();
      }, 700);
    }
  }
}

function shuffleMemoryGame() {
  memoryCards = memoryCards.map(c => ({ ...c, flipped: false, matched: false })).sort(() => Math.random() - 0.5);
  selectedMemoryCards = [];
  renderMemoryGame();
}

// Jokes Generator
let jokeIdx = 0;
function nextJoke() {
  jokeIdx = (jokeIdx + 1) % JOKES_LIST.length;
  const titleElem = document.getElementById('jokeTitle');
  const textElem = document.getElementById('jokeText');
  if (titleElem) titleElem.textContent = JOKES_LIST[jokeIdx].title;
  if (textElem) textElem.textContent = `"${JOKES_LIST[jokeIdx].text}"`;
}

// Motivate Timer
function toggleMotivateTimer() {
  const display = document.getElementById('motivateTimerDisplay');
  const btn = document.getElementById('motivateToggleBtn');

  if (motivateRunning) {
    clearInterval(motivateInterval);
    motivateRunning = false;
    if (btn) btn.innerHTML = '▶ START CHALLENGE';
  } else {
    motivateRunning = true;
    if (btn) btn.innerHTML = '⏸ PAUSE';
    motivateInterval = setInterval(() => {
      if (motivateSeconds > 0) {
        motivateSeconds--;
        const m = Math.floor(motivateSeconds / 60);
        const s = motivateSeconds % 60;
        if (display) display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      } else {
        clearInterval(motivateInterval);
        motivateRunning = false;
        alert("🎉 15-Minute Micro Challenge Complete! Great job taking the step!");
      }
    }, 1000);
  }
}

function resetMotivateTimer() {
  if (motivateRunning) toggleMotivateTimer();
  motivateSeconds = 900;
  const display = document.getElementById('motivateTimerDisplay');
  if (display) display.textContent = '15:00';
}

/* ==================== 5. AI COMPANION CHAT ==================== */
function initChat() {
  const sendBtn = document.getElementById('sendChatBtn');
  const chatInput = document.getElementById('chatInput');

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => sendUserMessage());
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendUserMessage();
    });
  }

  renderMemoryGame();
}

async function sendUserMessage(customText) {
  const input = document.getElementById('chatInput');
  const message = customText || (input ? input.value.trim() : '');
  if (!message) return;

  const messagesContainer = document.getElementById('chatMessages');

  // Append user bubble
  appendChatBubble(messagesContainer, message, 'user');
  if (!customText && input) input.value = '';

  // Show typing indicator
  const typingElem = document.createElement('div');
  typingElem.id = 'typingIndicator';
  typingElem.style.cssText = 'font-style:italic; font-size:0.85rem; color:var(--text-secondary); margin:8px 0;';
  typingElem.textContent = 'MaanMitra is typing...';
  messagesContainer.appendChild(typingElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Run Vanilla NLP Analysis
  const analysis = await analyzeTextService(message);

  setTimeout(() => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();

    if (analysis.isCrisis) {
      appendChatBubble(messagesContainer, "It sounds like you may be going through a very difficult moment. You don't have to handle this alone. Please reach out to a professional counsellor or emergency helpline right now.", 'ai', true);
      showCrisisBanner();
    } else {
      const responseTemplates = {
        STRESS: "It sounds like your studies or exams are putting pressure on you. Remember that taking things one small step at a time works best. Would you like to try a 4-second breathing exercise together?",
        SADNESS: "I hear you, and your feelings are completely valid. Sometimes putting thoughts into words helps lighten the weight. Would you like to share more or write this in your private journal?",
        ANXIETY: "I can feel that things feel overwhelming right now. Let's focus on what you can control right here and now. Taking a short relaxation break might soothe your mind.",
        ANGER: "It is natural to feel frustrated when things don't go as expected. Let's pause for a moment to let the heat cool down before deciding your next move.",
        "LOW MOTIVATION": "Feeling unmotivated happens to all of us! How about we start with just a tiny 15-minute micro challenge today?",
        HAPPINESS: "That is fantastic! I am really glad to hear you are feeling good today. Spread that positive light around!"
      };

      const aiText = responseTemplates[analysis.emotion] || "Thank you for sharing how you feel. I am here to support you whenever you need to pause or reflect.";
      appendChatBubble(messagesContainer, aiText, 'ai', false, analysis.recommendationLabel);
    }
  }, 500);
}

function appendChatBubble(container, text, sender, isCrisis = false, actionLabel = "") {
  if (!container) return;

  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.style.cssText = `display:flex; justify-content:${sender === 'user' ? 'flex-end' : 'flex-start'}; margin-bottom:12px;`;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
  if (isCrisis) {
    bubble.style.border = '2px solid #f43f5e';
    bubble.style.background = '#fff1f2';
    bubble.style.color = '#9f1239';
  }
  bubble.textContent = text;

  if (actionLabel && sender === 'ai') {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline';
    btn.style.cssText = 'padding:4px 10px; font-size:0.75rem; margin-top:8px; display:block;';
    btn.textContent = `Recommended: ${actionLabel}`;
    btn.onclick = () => openSupportMode(currentRecommendationCode);
    bubble.appendChild(btn);
  }

  bubbleWrapper.appendChild(bubble);
  container.appendChild(bubbleWrapper);
  container.scrollTop = container.scrollHeight;
}

function showCrisisBanner() {
  const banner = document.getElementById('crisisAlertBanner');
  if (banner) banner.style.display = 'flex';
}

/* ==================== 6. PRIVATE JOURNAL ==================== */
function initJournal() {
  const saveBtn = document.getElementById('saveJournalBtn');
  const searchInput = document.getElementById('journalSearchInput');

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const textarea = document.getElementById('journalContentInput');
      const content = textarea ? textarea.value.trim() : '';
      if (!content) return;

      const analysis = await analyzeTextService(content);

      const entry = {
        id: Date.now(),
        content: content,
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        recommendation: analysis.recommendationLabel,
        date: new Date().toLocaleString()
      };

      journalEntries.unshift(entry);
      localStorage.setItem('maanmitra_journal', JSON.stringify(journalEntries));
      textarea.value = '';
      renderJournalList();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderJournalList(e.target.value.toLowerCase());
    });
  }

  renderJournalList();
}

function renderJournalList(searchTerm = '') {
  const container = document.getElementById('journalEntriesList');
  if (!container) return;

  const filtered = journalEntries.filter(e => e.content.toLowerCase().includes(searchTerm));

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:20px;">No entries found. Write your thoughts above!</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="glass-card" style="padding:20px; margin-bottom:16px; position:relative;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <span style="font-size:0.8rem; color:var(--text-secondary);">📅 ${item.date}</span>
        <div style="display:flex; gap:6px;">
          <span class="badge badge-low" style="background:var(--primary-light); color:var(--primary);">${item.emotion}</span>
          <span class="badge badge-low" style="background:var(--secondary-light); color:var(--secondary);">${item.sentiment}</span>
          <button onclick="deleteJournalEntry(${item.id})" style="background:transparent; border:none; color:var(--accent); cursor:pointer; font-size:1.1rem; padding:0 4px;" title="Delete">🗑️</button>
        </div>
      </div>
      <p style="font-size:0.95rem; color:var(--text-primary); line-height:1.6; white-space:pre-wrap;">${escapeHtml(item.content)}</p>
      <div style="margin-top:12px; font-size:0.78rem; color:var(--text-secondary); border-top:1px dashed var(--border-color); padding-top:8px;">
        💡 NLP Recommendation: <strong>${item.recommendation || 'HELP ME CALM DOWN'}</strong>
      </div>
    </div>
  `).join('');
}

function deleteJournalEntry(id) {
  if (!confirm("Are you sure you want to delete this journal entry?")) return;
  journalEntries = journalEntries.filter(e => e.id !== id);
  localStorage.setItem('maanmitra_journal', JSON.stringify(journalEntries));
  renderJournalList();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==================== 7. MOOD TRACKER & DASHBOARD ==================== */
function seedSampleMoodData() {
  moodHistory = [
    { mood: 'Stressed', emotion: 'STRESS', distressLevel: 'MODERATE', date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { mood: 'Sad', emotion: 'SADNESS', distressLevel: 'MODERATE', date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { mood: 'Okay', emotion: 'OKAY', distressLevel: 'LOW', date: new Date(Date.now() - 86400000 * 1).toISOString() },
    { mood: 'Happy', emotion: 'HAPPINESS', distressLevel: 'LOW', date: new Date().toISOString() }
  ];
  localStorage.setItem('maanmitra_mood_history', JSON.stringify(moodHistory));
}

function updateDashboard() {
  const latest = moodHistory[0] || { mood: 'Okay', emotion: 'OKAY', distressLevel: 'LOW' };
  
  const todayMoodElem = document.getElementById('dashTodayMood');
  const emotionElem = document.getElementById('dashEmotion');
  const distressElem = document.getElementById('dashDistress');

  if (todayMoodElem) todayMoodElem.textContent = latest.mood;
  if (emotionElem) emotionElem.textContent = latest.emotion;
  if (distressElem) {
    distressElem.className = `badge badge-${latest.distressLevel.toLowerCase()}`;
    distressElem.textContent = `${latest.distressLevel} DISTRESS`;
  }
}

function renderTrackerCharts() {
  const ctxDoughnut = document.getElementById('emotionDoughnutChart');
  const ctxLine = document.getElementById('stressTrendChart');

  if (typeof Chart === 'undefined') return;

  // Emotion Counts
  const counts = {};
  moodHistory.forEach(e => {
    const emo = e.emotion || 'OKAY';
    counts[emo] = (counts[emo] || 0) + 1;
  });

  const labels = Object.keys(counts).length ? Object.keys(counts) : ['STRESS', 'ANXIETY', 'HAPPINESS', 'OKAY'];
  const data = Object.values(counts).length ? Object.values(counts) : [3, 2, 4, 3];

  if (ctxDoughnut) {
    if (window.myDoughnut) window.myDoughnut.destroy();
    window.myDoughnut = new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#0d9488', '#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (ctxLine) {
    if (window.myLine) window.myLine.destroy();
    window.myLine = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Stress & Distress Score',
          data: [3, 4, 2, 4, 3, 2, 2],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

/* ==================== 8. GET HELP MODAL ==================== */
function initHelpModal() {
  const modal = document.getElementById('counsellorModal');
  const openBtn = document.getElementById('openCounsellorModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('counsellorForm');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Appointment request submitted. A campus peer counsellor will contact you via student portal.");
      modal.classList.remove('active');
    });
  }
}
