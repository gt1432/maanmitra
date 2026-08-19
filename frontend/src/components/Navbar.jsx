import React from 'react';
import { Heart, Sun, Moon, ShieldAlert, Sparkles, MessageCircle, Activity, BookOpen, BarChart2, HelpCircle, Award } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, darkMode, setDarkMode }) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Sparkles },
    { id: 'checkin', label: 'MOOD CHECK-IN', icon: Heart },
    { id: 'companion', label: 'AI COMPANION', icon: MessageCircle },
    { id: 'activities', label: 'ACTIVITIES', icon: Activity },
    { id: 'journal', label: 'JOURNAL', icon: BookOpen },
    { id: 'tracker', label: 'MOOD TRACKER', icon: BarChart2 },
    { id: 'gethelp', label: 'GET HELP', icon: HelpCircle },
    { id: 'metrics', label: 'MODEL METRICS', icon: Award }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}>
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.5px', margin: 0, lineHeight: 1 }}>
              MAAN<span style={{ color: '#0d9488' }}>MITRA</span>
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Digital Emotional Support for Students
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  background: isActive 
                    ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' 
                    : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '8px'
            }}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
