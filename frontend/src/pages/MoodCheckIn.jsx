import React, { useState } from 'react';
import { analyzeText, submitMood } from '../services/api';
import { Sparkles, Send, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function MoodCheckIn({ setActivePage, setRecommendedActivity }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const moodOptions = [
    { label: 'Happy', emoji: '😊', desc: 'Feeling joyful & upbeat' },
    { label: 'Okay', emoji: '😐', desc: 'Doing fine' },
    { label: 'Worried', emoji: '😟', desc: 'Feeling uneasy or nervous' },
    { label: 'Sad', emoji: '😢', desc: 'Down or low spirit' },
    { label: 'Angry', emoji: '😡', desc: 'Frustrated or agitated' },
    { label: 'Stressed', emoji: '😰', desc: 'Under exam/work pressure' },
    { label: 'Tired', emoji: '😴', desc: 'Drained or exhausted' },
    { label: 'Lonely', emoji: '😔', desc: 'Feeling isolated' }
  ];

  const handleAnalyze = async () => {
    if (!selectedMood && !textInput.trim()) {
      alert("Please select a mood emoji or describe how you feel in the text box.");
      return;
    }

    setLoading(true);
    try {
      // 1. Analyze text via NLP backend
      const res = await analyzeText(textInput, selectedMood);
      setResult(res);

      // 2. Save entry to DB
      await submitMood(selectedMood || res.emotion, textInput);

      if (res.recommendation) {
        setRecommendedActivity(res.recommendation);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze mood. Please check backend server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setActivePage('activities');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          How are you feeling today?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Select an emoji or type your thoughts. MaanMitra is here to support you.
        </p>
      </div>

      {/* Mood Selector Grid */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '24px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', display: 'block' }}>
          CHOOSE A MOOD
        </label>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {moodOptions.map((item) => {
            const isSelected = selectedMood === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setSelectedMood(item.label)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>{item.emoji}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Text Input */}
        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
          TELL MAANMITRA WHAT YOU'RE FEELING...
        </label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Example: I am feeling very stressed because of my exams and unable to concentrate..."
          rows={4}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            resize: 'vertical',
            marginBottom: '20px',
            outline: 'none'
          }}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={handleSkip} className="btn btn-outline">
            SKIP
          </button>
          <button onClick={handleAnalyze} disabled={loading} className="btn btn-primary">
            {loading ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
            ANALYZE MY FEELINGS
          </button>
        </div>
      </div>

      {/* NLP Result Card */}
      {result && (
        <div className="glass-card" style={{
          padding: '30px',
          background: result.is_crisis 
            ? 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' 
            : 'linear-gradient(135deg, rgba(204, 251, 241, 0.5) 0%, rgba(224, 231, 255, 0.5) 100%)',
          border: result.is_crisis ? '2px solid #f43f5e' : '1px solid var(--primary)',
          marginTop: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
              Feeling Analysis & Recommendation
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Distress Indicator:</span>
              <span className={`badge badge-${result.distress_level.toLowerCase()}`}>
                {result.distress_level} DISTRESS
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Detected Emotion</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{result.emotion}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Sentiment</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>{result.sentiment}</div>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
            "{result.distress_description}"
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} /> Non-clinical distress indicator
            </div>

            <button 
              onClick={() => setActivePage('activities')} 
              className={`btn ${result.is_crisis ? 'btn-accent' : 'btn-primary'}`}
            >
              Recommended: {result.recommendation_label} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
