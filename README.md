# MAANMITRA — Digital Emotional Support for Students

**Smart India Hackathon 2026**  
**Problem Statement ID:** SIH25092  
**Problem Statement:** Development of a Digital Mental Health and Psychological Support System for Students in Higher Education.

> [!IMPORTANT]
> **Non-Diagnostic Disclaimer**: MaanMitra is a student emotional-support and psychological wellbeing platform, **NOT a medical diagnosis system**. It offers supportive micro-interventions, interactive relaxation, and peer/counsellor escalation without claiming medical diagnostics.

---

## 1. Project Overview

MaanMitra is a standalone, zero-build, responsive web application designed to support higher-education students in pausing, expressing feelings, understanding emotions, and accessing personalized wellbeing activities.

The project runs **directly in any browser by double-clicking `index.html`** with zero installation, zero server dependencies, and zero build processes required.

---

## 2. Key Features

- **Mood Check-In**: Emoji selectors (😊 Happy, 😐 Okay, 😟 Worried, 😢 Sad, 😡 Angry, 😰 Stressed, 😴 Tired, 😔 Lonely) + text input + instant Vanilla JS NLP analysis.
- **Vanilla JS NLP & Sentiment Engine**: Keyword dictionaries for emotion classification (`stress`, `anxiety`, `sadness`, `loneliness`, `anger`, `low motivation`, `happiness`, `neutral`) and sentiment scoring (`POSITIVE`, `NEUTRAL`, `NEGATIVE`).
- **Non-Diagnostic Distress Indicator**: Calculates `LOW`, `MODERATE`, or `HIGH` distress indicator levels based on sentiment, emotion, and negative keyword counts.
- **8 Interactive Support Modes**:
  - 🌬️ **HELP ME CALM DOWN**: 4-4-4 Box Breathing exercise with expanding animated circle, timer counter, start/pause/reset controls.
  - 🎮 **DISTRACT ME**: Memory flip card relaxation game.
  - 😄 **MAKE ME LAUGH**: Student jokes generator with *"Give me another 😄"*.
  - 🔥 **MOTIVATE ME**: 15-minute micro study focus countdown timer.
  - 🌙 **HELP ME SLEEP**: Bedtime wind-down checklist and 4-7-8 breathing tips.
  - 💬 **I WANT TO TALK**: Empathetic AI Companion chatbot interface.
  - 📖 **EXPRESS & REFLECT**: Private journal with `localStorage` persistence and automatic NLP emotion tagging.
  - 📞 **CONNECT & GET HELP**: Counsellor booking form modal & 24/7 verified crisis hotlines.
- **Visual Analytics Dashboard**: Powered by Chart.js (or HTML5 Canvas fallback) showing Doughnut Emotion Distribution, Weekly Stress Trend line chart, and historical check-in data.
- **Crisis Safety System**: Automatic detection of high-risk keywords (`suicide`, `kill myself`, `self harm`, `hurt myself`, `end my life`) triggering immediate emergency escalation cards.
- **Light/Dark Mode**: Glassmorphic theme toggle stored in `localStorage`.

---

## 3. Technology Stack

- **HTML5**: Semantic web architecture, single-page application (SPA) layout.
- **CSS3**: 100% Vanilla CSS3 with CSS variables, Flexbox, CSS Grid, Glassmorphism, and smooth `@keyframes` animations.
- **Vanilla JavaScript**: Pure JS ES6+ (no React, Angular, Vue, Node.js, Bootstrap, or Tailwind dependencies).
- **Storage**: `localStorage` for theme, mood history, and journal entries.

---

## 4. Reference Datasets & ML API Integration

The application references two Kaggle datasets:
1. **Kaggle Student Mental Health Dataset** (`shariful07/student-mental-health`): Reference for student risk factor analysis and demographic statistics.
2. **Kaggle Mental Health Text Classification Dataset** (`priyangshumukherjee/mental-health-text-classification-dataset`): Reference for NLP classification.

### Modular API Service Architecture
The frontend encapsulates text analysis in a modular JavaScript service function:
```javascript
async function analyzeTextService(text, mood) {
  // Production version can connect this frontend to a Python ML API:
  // const res = await fetch("/api/analyze-text", { method:"POST", body: JSON.stringify({text, mood}) });
  // return await res.json();

  return runVanillaNLP(text, mood);
}
```

---

## 5. How to Run

1. Clone or download the repository:
   ```bash
   git clone https://github.com/gt1432/maanmitra.git
   ```
2. Open the project folder `maanmitra`.
3. Double-click **`index.html`** in any web browser (Chrome, Edge, Firefox, Safari).

*No build process, `npm install`, or backend server is required.*

---

## 6. Privacy & Safety Disclaimer

- **Privacy**: All journal entries and mood check-ins are saved locally on the student's browser (`localStorage`).
- **Safety Disclaimer**: MaanMitra is a digital emotional-support tool and does not provide medical diagnosis or replace professional psychiatric care.
