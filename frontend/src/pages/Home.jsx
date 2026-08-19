import React from 'react';
import { Heart, Sparkles, MessageCircle, Activity, ShieldCheck, ArrowRight, Smile, Brain, Compass, Lock } from 'lucide-react';

export default function Home({ setActivePage }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Non-Diagnostic Platform Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          border: '1px solid rgba(13, 148, 136, 0.2)'
        }}>
          <ShieldCheck size={16} />
          SIH25092 • Non-Clinical Student Emotional Wellbeing & Support System
        </div>
      </div>

      {/* Hero Section */}
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '60px 30px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 249, 255, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(13, 148, 136, 0.1)',
          blur: '40px'
        }}></div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #0f766e 0%, #4338ca 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          MAANMITRA
        </h1>

        <p style={{
          fontSize: '1.4rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 32px auto',
          fontWeight: 500
        }}>
          "Your space to pause, express and feel supported."
        </p>

        {/* Primary CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActivePage('checkin')}
            className="btn btn-primary pulse"
            style={{ fontSize: '1.1rem', padding: '16px 36px' }}
          >
            <Smile size={22} />
            How are you feeling today?
          </button>
          
          <button 
            onClick={() => setActivePage('companion')}
            className="btn btn-secondary"
            style={{ fontSize: '1.1rem', padding: '16px 32px' }}
          >
            <MessageCircle size={22} />
            Talk to AI Companion
          </button>
        </div>
      </div>

      {/* Main Workflow Section */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>
          Student Support Journey
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {[
            { step: '01', title: 'Mood Check-in', desc: 'Select your mood emoji or express in your own words' },
            { step: '02', title: 'NLP Emotion Analysis', desc: 'Intelligent TF-IDF & ML model classifies emotional state' },
            { step: '03', title: 'Distress Indicator', desc: 'Calculates non-diagnostic indicator level (Low/Moderate/High)' },
            { step: '04', title: 'Personalized Support', desc: 'Recommends 1 of 8 customized interactive wellbeing activities' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--primary)',
                marginBottom: '8px'
              }}>
                STEP {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '50px'
      }}>
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Brain size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Dual ML & NLP Engines</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Trained on real student mental health datasets using scikit-learn models (Logistic Regression, Linear SVM, Naive Bayes, Random Forest).
          </p>
          <button onClick={() => setActivePage('metrics')} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            View ML Metrics <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'var(--secondary-light)',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Activity size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>8 Wellbeing Support Modes</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Breathing exercises, memory games, positive study challenges, sleep preparation, jokes, and express & reflect journaling.
          </p>
          <button onClick={() => setActivePage('activities')} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Explore Activities <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Lock size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Privacy & Crisis Safety</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            100% private, anonymous IDs, zero medical claims, and an immediate safety filter for college counsellor escalation.
          </p>
          <button onClick={() => setActivePage('gethelp')} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Get Help & Hotlines <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Emergency Crisis Bar */}
      <div className="glass-card" style={{
        padding: '20px 30px',
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        border: '1px solid #fecdd3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Heart color="#e11d48" size={28} />
          <div>
            <h4 style={{ color: '#9f1239', fontWeight: 700, margin: 0, fontSize: '1rem' }}>
              Need immediate support or feeling overwhelmed?
            </h4>
            <p style={{ color: '#be123c', fontSize: '0.85rem', margin: 0 }}>
              National Helpline Tele-MANAS: <strong>14416 / 1800 891 4416</strong> | KIRAN: <strong>1800-599-0019</strong>
            </p>
          </div>
        </div>
        <button onClick={() => setActivePage('gethelp')} className="btn btn-accent" style={{ fontSize: '0.85rem' }}>
          Connect to Counsellor
        </button>
      </div>

    </div>
  );
}
