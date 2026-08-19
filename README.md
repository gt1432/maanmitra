# MAANMITRA — Digital Emotional Support for Students

**Smart India Hackathon 2026**  
**Problem Statement ID:** SIH25092  
**Problem Statement:** Development of a Digital Mental Health and Psychological Support System for Students in Higher Education.

> [!IMPORTANT]
> **Non-Diagnostic Disclaimer**: MaanMitra is a student emotional-support and psychological wellbeing platform, **NOT a medical diagnosis system**. It offers supportive micro-interventions, interactive relaxation, and peer/counsellor escalation without claiming medical diagnostics.

---

## 1. Project Objective

MaanMitra is built as a safe, modern, and interactive space where higher-education students can:
- Check in with their daily mood using interactive emojis and text expressions.
- Classify emotion and sentiment using intelligent NLP text models.
- Receive a non-diagnostic distress indicator (LOW, MODERATE, HIGH).
- Engage with 8 personalized wellbeing support modes.
- Chat with an empathetic AI companion.
- Maintain a private encrypted journal with automatic NLP emotion tagging.
- Track mood and stress analytics over time.
- Escalate immediately to verified campus counsellors and 24/7 crisis hotlines.

### Main Workflow
```
Student
  ↓
Mood Check-in
  ↓
Understand Emotion
  ↓
NLP & ML Analysis
  ↓
Non-Diagnostic Distress Indicator
  ↓
Personalized Recommendation (8 Support Modes)
  ↓
Engage & Support (Breathing, Games, AI Chat, Motivation, Journal)
  ↓
Monitor Analytics
  ↓
Professional Help & Counsellor Escalation
```

---

## 2. Dataset Sources & Dual ML Pipelines

MaanMitra utilizes two real-world Kaggle datasets through separate machine learning pipelines:

### Dataset 1 — Kaggle Student Mental Health Dataset (`Student Mental health.csv`)
- **Purpose**: Predictive modeling of student demographic & academic risk factors (CGPA, Year of Study, Age, Marital status, Depression, Anxiety, Panic Attacks, Specialist treatment).
- **Pipeline A**: Clean missing values → Categorical & numerical encoding → Feature selection → Train & compare Logistic Regression, Random Forest, and Gradient Boosting → 80/20 train/test evaluation → `models/mental_health_model.pkl`.

### Dataset 2 — Kaggle Mental Health Text Dataset (`mental_heath_unbanlanced.csv`)
- **Purpose**: NLP sentiment and emotion classification on student text (49,612 samples).
- **Pipeline B**: Lowercasing & symbol cleaning → Tokenization & stopword removal → TF-IDF Vectorization → Train & compare Logistic Regression, Linear SVM (`LinearSVC`), and Naive Bayes (`MultinomialNB`) → 80/20 train/test evaluation → `models/nlp_model.pkl` & `models/tfidf_vectorizer.pkl`.

---

## 3. Technology Stack

- **Frontend**: React.js (Vite), HTML5, Vanilla CSS Design Tokens, JavaScript (ES6+), Chart.js / `react-chartjs-2`, Lucide React Icons.
- **Backend**: Python 3, Flask REST API, Flask-CORS, SQLite.
- **Machine Learning & NLP**: `pandas`, `numpy`, `scikit-learn`, `joblib`, `nltk`.

---

## 4. Key Features & 8 Support Modes

1. **Mood Check-In**: Emoji selectors (😊 Happy, 😐 Okay, 😟 Worried, 😢 Sad, 😡 Angry, 😰 Stressed, 😴 Tired, 😔 Lonely) + text input + instant NLP sentiment & distress analysis.
2. **AI Companion Chat**: Empathetic, non-judgmental conversational bot with typing indicator, emotion tags, and quick reply action shortcuts.
3. **8 Interactive Support Modes**:
   - 🌬️ **HELP ME CALM DOWN**: 4-4-4 Box Breathing exercise with expanding animated circle, timer counter, start/pause controls.
   - 🎮 **DISTRACT ME**: Memory flip card game, reflex game, color painter.
   - 😄 **MAKE ME LAUGH**: Student jokes, uplifting short stories, positive cards with "Give me another 😄".
   - 🔥 **MOTIVATE ME**: 15-minute micro study challenge countdown timer and positive goal checklists.
   - 🌙 **HELP ME SLEEP**: Bedtime wind-down checklist, 4-7-8 breathing technique, sleep preparation tips.
   - 💬 **I WANT TO TALK**: Direct connection to empathetic AI companion.
   - 📖 **EXPRESS & REFLECT**: Private journal with auto NLP sentiment & emotion tagging.
   - 📞 **CONNECT & GET HELP**: Counsellor booking form, Tele-MANAS (14416 / 1800 891 4416), KIRAN (1800-599-0019), Vandrevala, Emergency 112.
4. **Mood Analytics Dashboard**: Interactive visual charts for weekly mood distribution, stress trends, emotion frequencies, and historical entries.
5. **Crisis Safety Filter**: Automatic detection of high-risk keywords (self-harm, suicide, severe crisis) triggering immediate escalation to `CONNECT & GET HELP` with crisis hotlines.
6. **Model Evaluation Page**: Real-time admin dashboard displaying actual dataset counts, accuracy comparison tables across all models, precision, recall, F1 scores, and confusion matrix grids!

---

## 5. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-text` | Performs TF-IDF + NLP classification, returns emotion, sentiment, distress level & recommendation. |
| `POST` | `/api/mood` | Logs student mood check-in to SQLite database. |
| `GET` | `/api/mood-history` | Fetches student mood check-in history and stats. |
| `POST` | `/api/journal` | Adds journal entry with automated NLP emotion analysis. |
| `GET` | `/api/journal` | Retrieves journal entries list. |
| `DELETE` | `/api/journal/<id>` | Deletes a journal entry. |
| `POST` | `/api/chat` | AI Companion chat endpoint with safety overrides. |
| `POST` | `/api/risk-check` | Scans text for high-risk crisis keywords. |
| `GET` | `/api/model-metrics` | Returns empirical scikit-learn evaluation metrics & confusion matrices. |

---

## 6. Installation & Running Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+ & npm

### Setup & Run Backend
```bash
# 1. Navigate to project root
cd maanmitra

# 2. Install python dependencies
pip install -r requirements.txt

# 3. Train ML & NLP models (if not already trained)
python ml/train_nlp.py
python ml/train_mental_health.py

# 4. Start Flask backend server
python backend/app.py
```
*Backend runs at:* `http://localhost:5000`

### Setup & Run Frontend
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Run development server
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 7. Privacy, Security & Ethics

- **Anonymous IDs**: No unnecessary storing of personal identity or sensitive conversation transcripts.
- **Data Minimization**: Stores only lightweight mood check-in stats and optional journal notes.
- **Strict Non-Clinical Scope**: All system prompts, responses, and distress badges use supportive language rather than medical diagnostic terminology.

---

## 8. Future Scope

- Integration with college ERP student portals for seamless counsellor scheduling.
- Multilingual support in Hindi, Tamil, Telugu, Bengali, and regional Indian languages.
- Wearable bio-feedback integration for heart-rate variability (HRV) stress detection.
