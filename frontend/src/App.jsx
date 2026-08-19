import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoodCheckIn from './pages/MoodCheckIn';
import AICompanion from './pages/AICompanion';
import Activities from './pages/Activities';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import GetHelp from './pages/GetHelp';
import ModelEvaluation from './pages/ModelEvaluation';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [recommendedActivity, setRecommendedActivity] = useState('HELP_ME_CALM_DOWN');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main Page Body */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && <Home setActivePage={setActivePage} />}
        {activePage === 'checkin' && (
          <MoodCheckIn 
            setActivePage={setActivePage} 
            setRecommendedActivity={setRecommendedActivity} 
          />
        )}
        {activePage === 'companion' && <AICompanion setActivePage={setActivePage} />}
        {activePage === 'activities' && (
          <Activities 
            activeMode={recommendedActivity} 
            setActivePage={setActivePage} 
          />
        )}
        {activePage === 'journal' && <Journal setActivePage={setActivePage} />}
        {activePage === 'tracker' && <MoodTracker setActivePage={setActivePage} />}
        {activePage === 'gethelp' && <GetHelp />}
        {activePage === 'metrics' && <ModelEvaluation />}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 20px',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontSize: '0.82rem',
        background: 'var(--bg-card)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <strong>MAANMITRA</strong> • Digital Emotional Support System for Higher Education Students (SIH25092)
          <br />
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            Disclaimer: MaanMitra is a digital emotional-support tool and does not provide medical diagnosis or replace professional care.
          </span>
        </div>
      </footer>
    </div>
  );
}
