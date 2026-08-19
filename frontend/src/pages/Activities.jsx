import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Smile, Wind, Gamepad2, Flame, Moon, BookOpen, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Activities({ activeMode = 'HELP_ME_CALM_DOWN', setActivePage }) {
  const [selectedTab, setSelectedTab] = useState(activeMode);

  useEffect(() => {
    if (activeMode) setSelectedTab(activeMode);
  }, [activeMode]);

  const tabs = [
    { id: 'HELP_ME_CALM_DOWN', label: 'HELP ME CALM DOWN', icon: Wind },
    { id: 'DISTRACT_ME', label: 'DISTRACT ME', icon: Gamepad2 },
    { id: 'MAKE_ME_LAUGH', label: 'MAKE ME LAUGH', icon: Smile },
    { id: 'MOTIVATE_ME', label: 'MOTIVATE ME', icon: Flame },
    { id: 'HELP_ME_SLEEP', label: 'HELP ME SLEEP', icon: Moon },
    { id: 'I_WANT_TO_TALK', label: 'I WANT TO TALK', icon: Sparkles },
    { id: 'EXPRESS_AND_REFLECT', label: 'EXPRESS & REFLECT', icon: BookOpen },
    { id: 'CONNECT_AND_GET_HELP', label: 'CONNECT & GET HELP', icon: PhoneCall }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Personalized Wellbeing Activities
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Interactive tools designed to support your mind, pause pressure, and boost your mood.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px',
        marginBottom: '32px',
        borderRadius: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: isActive ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="glass-card" style={{ padding: '40px' }}>
        {selectedTab === 'HELP_ME_CALM_DOWN' && <BreathingExercise />}
        {selectedTab === 'DISTRACT_ME' && <DistractMeGames />}
        {selectedTab === 'MAKE_ME_LAUGH' && <MakeMeLaugh />}
        {selectedTab === 'MOTIVATE_ME' && <MotivateMeTimer />}
        {selectedTab === 'HELP_ME_SLEEP' && <HelpMeSleepChecklist />}
        {selectedTab === 'I_WANT_TO_TALK' && (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Talk with your AI Companion</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px auto' }}>
              Express what's on your mind in a safe, non-judgmental space.
            </p>
            <button onClick={() => setActivePage('companion')} className="btn btn-primary">
              Start Talking Now
            </button>
          </div>
        )}
        {selectedTab === 'EXPRESS_AND_REFLECT' && (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <BookOpen size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Private Student Journal</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px auto' }}>
              Write your feelings, reflect on your day, and get NLP emotion insights.
            </p>
            <button onClick={() => setActivePage('journal')} className="btn btn-secondary">
              Open My Journal
            </button>
          </div>
        )}
        {selectedTab === 'CONNECT_AND_GET_HELP' && (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <PhoneCall size={48} color="var(--accent)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Connect with a Professional</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px auto' }}>
              Reach college counsellors or verified mental-health support helplines.
            </p>
            <button onClick={() => setActivePage('gethelp')} className="btn btn-accent">
              Get Professional Help
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

/* ================= 1. HELP ME CALM DOWN (4-4-4 BREATHING) ================= */
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('BREATHE IN');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (phase === 'BREATHE IN') {
              setPhase('HOLD');
              return 4;
            } else if (phase === 'HOLD') {
              setPhase('BREATHE OUT');
              return 4;
            } else {
              setPhase('BREATHE IN');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('BREATHE IN');
    setTimer(4);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
        4-4-4 Box Breathing Relaxation
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Follow the circle to soothe your nervous system and reduce stress.
      </p>

      {/* Breathing Circle Animation */}
      <div className={`breathe-circle ${isActive ? 'breathe-active' : ''}`} style={{ marginBottom: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{phase}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{timer}s</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setIsActive(!isActive)} className="btn btn-primary" style={{ padding: '14px 28px' }}>
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'PAUSE' : 'START BREATHING'}
        </button>
        <button onClick={handleReset} className="btn btn-outline">
          <RotateCcw size={18} /> RESET
        </button>
      </div>

      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto', lineHeight: 1.5 }}>
        💡 <strong>Instruction:</strong> Inhale slowly through your nose for 4 seconds, hold your breath gently for 4 seconds, and exhale completely for 4 seconds.
      </div>
    </div>
  );
}

/* ================= 2. DISTRACT ME (MINI GAMES) ================= */
function DistractMeGames() {
  const [cards, setCards] = useState([
    { id: 1, symbol: '🌸', flipped: false, matched: false },
    { id: 2, symbol: '🚀', flipped: false, matched: false },
    { id: 3, symbol: '🎨', flipped: false, matched: false },
    { id: 4, symbol: '🎧', flipped: false, matched: false },
    { id: 5, symbol: '🌸', flipped: false, matched: false },
    { id: 6, symbol: '🚀', flipped: false, matched: false },
    { id: 7, symbol: '🎨', flipped: false, matched: false },
    { id: 8, symbol: '🎧', flipped: false, matched: false }
  ]);
  const [selected, setSelected] = useState([]);

  const handleCardClick = (index) => {
    if (selected.length === 2 || cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setSelected([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setSelected([]);
        }, 800);
      }
    }
  };

  const resetGame = () => {
    setCards(cards.map(c => ({ ...c, flipped: false, matched: false })).sort(() => Math.random() - 0.5));
    setSelected([]);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
        Memory Match Relaxation Game
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Take a quick 2-minute mind break matching pairs.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              border: 'none',
              background: card.flipped || card.matched ? 'var(--primary-light)' : 'var(--secondary)',
              fontSize: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
              color: 'white'
            }}
          >
            {card.flipped || card.matched ? card.symbol : '❓'}
          </button>
        ))}
      </div>

      <button onClick={resetGame} className="btn btn-outline">
        <RotateCcw size={16} /> Shuffle Cards
      </button>
    </div>
  );
}

/* ================= 3. MAKE ME LAUGH ================= */
function MakeMeLaugh() {
  const jokes = [
    { title: "Exam Prep", joke: "Why did the computer take a break? Because it had too many open tabs!" },
    { title: "Physics Student", joke: "Why can't you trust atoms? Because they make up everything!" },
    { title: "Math Logic", joke: "Parallel lines have so much in common. It's a shame they'll never meet." },
    { title: "Late Night Study", joke: "My study routine: 5 minutes of studying, 55 minutes of wondering how I got here." },
    { title: "Coding Humor", joke: "There are 10 types of people in the world: those who understand binary, and those who don't." }
  ];

  const [index, setIndex] = useState(0);

  const nextJoke = () => {
    setIndex((prev) => (prev + 1) % jokes.length);
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
        Lighten Up Your Mood 😄
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
        Safe, uplifting student humor to bring a smile.
      </p>

      <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', background: 'var(--bg-card)' }}>
        <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '12px', fontSize: '1.1rem' }}>
          {jokes[index].title}
        </h4>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          "{jokes[index].joke}"
        </p>
      </div>

      <button onClick={nextJoke} className="btn btn-primary" style={{ padding: '14px 28px' }}>
        Give me another 😄
      </button>
    </div>
  );
}

/* ================= 4. MOTIVATE ME ================= */
function MotivateMeTimer() {
  const [seconds, setSeconds] = useState(900); // 15 minutes
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (running && seconds > 0) {
      timer = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [running, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
        15-Minute Micro Study Challenge
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        "Let's start with just 15 minutes. Small steps build giant momentum!"
      </p>

      <div style={{
        fontSize: '3.5rem',
        fontWeight: 800,
        color: 'var(--primary)',
        marginBottom: '24px',
        fontFamily: 'monospace'
      }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={() => setRunning(!running)} className="btn btn-primary">
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? 'PAUSE' : 'START CHALLENGE'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(900); }} className="btn btn-outline">
          <RotateCcw size={18} /> RESET
        </button>
      </div>
    </div>
  );
}

/* ================= 5. HELP ME SLEEP ================= */
function HelpMeSleepChecklist() {
  const items = [
    "Turn off heavy screen lights or enable Night Shift mode 30 mins before sleep.",
    "Practice 4-7-8 breathing (Inhale 4s, Hold 7s, Exhale 8s).",
    "Keep a glass of water near your bedside.",
    "Write down any lingering study thoughts in your journal to clear your mind."
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
        Bedtime Wind-Down Checklist
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
        Prepare your mind and body for restorative rest.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((text, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}>
            <CheckCircle2 color="var(--primary)" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
