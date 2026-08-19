import os
import sys
import json
import re
import joblib
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocessing import clean_text
from backend.database import init_db, get_db_connection

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.abspath(os.path.join(BASE_DIR, "frontend", "dist"))

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")
CORS(app)

# Initialize Database
init_db()

MODELS_DIR = os.path.join(BASE_DIR, "models")
NLP_MODEL_PATH = os.path.join(MODELS_DIR, "nlp_model.pkl")
TFIDF_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
MENTAL_HEALTH_MODEL_PATH = os.path.join(MODELS_DIR, "mental_health_model.pkl")
NLP_METRICS_PATH = os.path.join(MODELS_DIR, "nlp_metrics.json")
MH_METRICS_PATH = os.path.join(MODELS_DIR, "mental_health_metrics.json")

nlp_model = None
tfidf_vectorizer = None
mental_health_bundle = None

def load_ml_models():
    global nlp_model, tfidf_vectorizer, mental_health_bundle
    try:
        if os.path.exists(NLP_MODEL_PATH) and os.path.exists(TFIDF_PATH):
            nlp_model = joblib.load(NLP_MODEL_PATH)
            tfidf_vectorizer = joblib.load(TFIDF_PATH)
            print("NLP Model and TF-IDF Vectorizer loaded successfully.")
    except Exception as e:
        print(f"Error loading NLP model: {e}")

    try:
        if os.path.exists(MENTAL_HEALTH_MODEL_PATH):
            mental_health_bundle = joblib.load(MENTAL_HEALTH_MODEL_PATH)
            print("Student Mental Health ML Model loaded successfully.")
    except Exception as e:
        print(f"Error loading Mental Health model: {e}")

load_ml_models()

CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'self harm',
    'cut myself', 'ending it all', 'cannot live anymore', 'dont want to live',
    'hopeless life', 'better off dead', 'take my life'
]

def check_crisis_risk(text):
    text_lower = text.lower()
    for kw in CRISIS_KEYWORDS:
        if kw in text_lower:
            return True
    return False

def derive_sentiment_and_emotion(text, nlp_pred_label=None):
    text_cleaned = clean_text(text)
    text_lower = text.lower()
    if any(w in text_lower for w in ['stress', 'exam', 'pressure', 'deadline', 'workload', 'overwhelmed']):
        emotion = "Stress"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['sad', 'lonely', 'depressed', 'cry', 'grief', 'heartbroken']):
        emotion = "Sadness"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['anxious', 'worried', 'panic', 'scared', 'fear', 'nervous']):
        emotion = "Anxiety"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['angry', 'frustrated', 'furious', 'mad', 'irritated']):
        emotion = "Anger"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['tired', 'exhausted', 'sleepy', 'fatigue', 'burnout']):
        emotion = "Tiredness"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['unmotivated', 'lazy', 'procrastinating', 'cant focus']):
        emotion = "Low Motivation"
        sentiment = "Negative"
    elif any(w in text_lower for w in ['happy', 'great', 'awesome', 'good', 'joy', 'excited', 'calm']):
        emotion = "Happy"
        sentiment = "Positive"
    else:
        if nlp_pred_label:
            if nlp_pred_label == 'Anxiety':
                emotion = 'Anxiety'
                sentiment = 'Negative'
            elif nlp_pred_label == 'Depression':
                emotion = 'Sadness'
                sentiment = 'Negative'
            elif nlp_pred_label == 'Suicidal':
                emotion = 'Severe Distress'
                sentiment = 'Negative'
            else:
                emotion = 'Okay'
                sentiment = 'Neutral'
        else:
            emotion = 'Okay'
            sentiment = 'Neutral'
            
    return emotion, sentiment

def derive_distress_level(emotion, sentiment, mood_input="", is_crisis=False):
    if is_crisis or emotion in ['Severe Distress']:
        return "HIGH"
    
    mood_lower = str(mood_input).lower()
    if mood_lower in ['sad', 'stressed', 'worried', 'angry', 'lonely', 'tired'] or sentiment == 'Negative':
        return "MODERATE"
        
    return "LOW"

def derive_recommendation(emotion, distress_level):
    if distress_level == "HIGH":
        return "CONNECT_AND_GET_HELP", "CONNECT & GET HELP"
    
    mapping = {
        "Stress": ("HELP_ME_CALM_DOWN", "HELP ME CALM DOWN"),
        "Anxiety": ("HELP_ME_CALM_DOWN", "HELP ME CALM DOWN"),
        "Sadness": ("I_WANT_TO_TALK", "I WANT TO TALK"),
        "Low Motivation": ("MOTIVATE_ME", "MOTIVATE ME"),
        "Anger": ("HELP_ME_CALM_DOWN", "HELP ME CALM DOWN"),
        "Tiredness": ("HELP_ME_SLEEP", "HELP ME SLEEP"),
        "Happy": ("MAKE_ME_LAUGH", "MAKE ME LAUGH"),
        "Okay": ("DISTRACT_ME", "DISTRACT ME")
    }
    
    return mapping.get(emotion, ("HELP_ME_CALM_DOWN", "HELP ME CALM DOWN"))

# ==================== ENDPOINTS ====================

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    mood = data.get('mood', '').strip()
    
    if not text and not mood:
        return jsonify({'error': 'No text or mood provided'}), 400

    if nlp_model is None or tfidf_vectorizer is None:
        load_ml_models()

    nlp_pred_label = None
    if text and nlp_model and tfidf_vectorizer:
        try:
            cleaned = clean_text(text)
            vec = tfidf_vectorizer.transform([cleaned])
            nlp_pred_label = nlp_model.predict(vec)[0]
        except Exception as e:
            print(f"Prediction error: {e}")

    is_crisis = check_crisis_risk(text)
    emotion, sentiment = derive_sentiment_and_emotion(text or mood, nlp_pred_label)
    distress_level = derive_distress_level(emotion, sentiment, mood, is_crisis)
    rec_code, rec_label = derive_recommendation(emotion, distress_level)

    if distress_level == "LOW":
        distress_desc = "Your responses show relatively low distress indicators. Keep up healthy daily routines!"
    elif distress_level == "MODERATE":
        distress_desc = "Your responses show some signs of emotional distress. Consider taking a short break or talking to someone you trust."
    else:
        distress_desc = "Your responses indicate significant distress. Consider contacting your college counsellor or a qualified mental-health professional."

    return jsonify({
        'emotion': emotion,
        'sentiment': sentiment,
        'distress_level': distress_level,
        'distress_description': distress_desc,
        'recommendation': rec_code,
        'recommendation_label': rec_label,
        'is_crisis': is_crisis
    })

@app.route('/api/mood', methods=['POST'])
def save_mood():
    data = request.get_json() or {}
    mood = data.get('mood', '')
    text_input = data.get('text_input', '')
    
    if not mood:
        return jsonify({'error': 'Mood is required'}), 400
        
    analysis = analyze_text().json if text_input else {}
    emotion = analysis.get('emotion', mood)
    sentiment = analysis.get('sentiment', 'Neutral')
    distress_level = analysis.get('distress_level', 'LOW')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO mood_entries (mood, text_input, emotion, sentiment, distress_level)
        VALUES (?, ?, ?, ?, ?)
    ''', (mood, text_input, emotion, sentiment, distress_level))
    conn.commit()
    entry_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'status': 'success',
        'id': entry_id,
        'mood': mood,
        'emotion': emotion,
        'distress_level': distress_level
    })

@app.route('/api/mood-history', methods=['GET'])
def get_mood_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM mood_entries ORDER BY created_at DESC LIMIT 30')
    rows = cursor.fetchall()
    conn.close()
    
    entries = [dict(r) for r in rows]
    emotions = [e['emotion'] for e in entries if e.get('emotion')]
    most_common = max(set(emotions), key=emotions.count) if emotions else 'Okay'
    
    return jsonify({
        'history': entries,
        'total_entries': len(entries),
        'most_common_emotion': most_common,
        'trend': 'Stable'
    })

@app.route('/api/journal', methods=['POST', 'GET'])
def journal_handler():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        content = data.get('content', '').strip()
        if not content:
            conn.close()
            return jsonify({'error': 'Content is required'}), 400
            
        is_crisis = check_crisis_risk(content)
        emotion, sentiment = derive_sentiment_and_emotion(content)
        distress_level = derive_distress_level(emotion, sentiment, "", is_crisis)
        rec_code, rec_label = derive_recommendation(emotion, distress_level)
        
        cursor.execute('''
            INSERT INTO journal_entries (content, emotion, sentiment, recommendation)
            VALUES (?, ?, ?, ?)
        ''', (content, emotion, sentiment, rec_label))
        conn.commit()
        entry_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'status': 'success',
            'id': entry_id,
            'content': content,
            'emotion': emotion,
            'sentiment': sentiment,
            'recommendation': rec_label
        })
        
    elif request.method == 'GET':
        cursor.execute('SELECT * FROM journal_entries ORDER BY created_at DESC')
        rows = cursor.fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])

@app.route('/api/journal/<int:entry_id>', methods=['DELETE'])
def delete_journal(entry_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM journal_entries WHERE id = ?', (entry_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted', 'id': entry_id})

@app.route('/api/recommendation', methods=['GET'])
def get_recommendations():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT emotion, distress_level FROM mood_entries ORDER BY created_at DESC LIMIT 1')
    last_entry = cursor.fetchone()
    conn.close()
    
    if last_entry:
        emotion = last_entry['emotion']
        distress = last_entry['distress_level']
    else:
        emotion = 'Stress'
        distress = 'MODERATE'
        
    code, label = derive_recommendation(emotion, distress)
    return jsonify({
        'current_emotion': emotion,
        'distress_level': distress,
        'recommendation_code': code,
        'recommendation_label': label
    })

@app.route('/api/chat', methods=['POST'])
def ai_companion_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    
    if not message:
        return jsonify({'error': 'Message is empty'}), 400
        
    is_crisis = check_crisis_risk(message)
    emotion, sentiment = derive_sentiment_and_emotion(message)
    distress_level = derive_distress_level(emotion, sentiment, "", is_crisis)
    rec_code, rec_label = derive_recommendation(emotion, distress_level)
    
    if is_crisis:
        ai_response = "It sounds like you may be going through a very difficult moment. You don't have to handle this alone. Please reach out to a professional counsellor or emergency helpline right now."
        action_buttons = ["CONNECT & GET HELP", "TALK TO COUNSELLOR"]
    else:
        responses = {
            "Stress": f"It sounds like you're experiencing a lot of pressure right now. Remember that it's okay to take things one step at a time. Would you like to take a 4-second breathing pause together?",
            "Sadness": f"I hear you, and your feelings are completely valid. Sometimes putting your thoughts into words can lighten the weight. Would you like to share a bit more or express this in your journal?",
            "Anxiety": f"I can feel that things feel overwhelming right now. Let's focus on what you can control right here and now. Taking a quick relaxation break might help soothe your mind.",
            "Anger": f"It's natural to feel frustrated when things don't go as expected. Let's pause for a moment to let the heat cool down before deciding your next move.",
            "Low Motivation": f"Feeling unmotivated happens to all of us! How about we start with just a tiny 15-minute micro challenge today?",
            "Tiredness": f"You sound exhausted. Resting isn't quitting—it's recharging. Have you had enough water and rest today?",
            "Happy": f"That's fantastic! I'm really glad to hear you're feeling good today. Spread that positive light around!"
        }
        ai_response = responses.get(emotion, f"Thank you for sharing how you feel. I am here to support you whenever you need to pause or reflect.")
        action_buttons = [rec_label, "EXPRESS & REFLECT", "I WANT TO TALK"]
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO chat_sessions (sender, message, emotion) VALUES (?, ?, ?)', ('student', message, emotion))
    cursor.execute('INSERT INTO chat_sessions (sender, message, emotion) VALUES (?, ?, ?)', ('ai', ai_response, emotion))
    conn.commit()
    conn.close()
    
    return jsonify({
        'ai_response': ai_response,
        'detected_emotion': emotion,
        'sentiment': sentiment,
        'distress_level': distress_level,
        'recommendation': rec_code,
        'recommendation_label': rec_label,
        'action_buttons': action_buttons,
        'is_crisis': is_crisis
    })

@app.route('/api/risk-check', methods=['POST'])
def risk_check():
    data = request.get_json() or {}
    text = data.get('text', '')
    is_crisis = check_crisis_risk(text)
    
    return jsonify({
        'is_crisis': is_crisis,
        'message': "It sounds like you may be going through a very difficult moment. You don't have to handle this alone." if is_crisis else "Low risk detected.",
        'helplines': [
            {'name': 'Tele-MANAS (Govt of India)', 'number': '14416 / 1800 891 4416'},
            {'name': 'KIRAN Mental Health Helpline', 'number': '1800-599-0019'},
            {'name': 'Vandrevala Foundation Helpline', 'number': '+91 9999 666 555'},
            {'name': 'National Emergency', 'number': '112'}
        ]
    })

@app.route('/api/model-metrics', methods=['GET'])
def get_model_metrics():
    load_ml_models()
    nlp_metrics = {}
    mh_metrics = {}
    
    if os.path.exists(NLP_METRICS_PATH):
        with open(NLP_METRICS_PATH, 'r') as f:
            nlp_metrics = json.load(f)
            
    if os.path.exists(MH_METRICS_PATH):
        with open(MH_METRICS_PATH, 'r') as f:
            mh_metrics = json.load(f)
            
    return jsonify({
        'nlp_model_evaluation': nlp_metrics,
        'student_mental_health_evaluation': mh_metrics
    })

# ==================== STATIC & REACT SPA SERVING ====================

@app.route('/')
def index():
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return jsonify({'status': 'MaanMitra Backend API Running', 'version': '1.0.0'})

@app.route('/<path:path>')
def serve_static(path):
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    if os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return jsonify({'error': 'Page not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
