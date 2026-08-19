import React, { useState } from 'react';
import { Heart, Sun, Moon, Sparkles, MessageCircle, Activity, BookOpen, BarChart2, HelpCircle, Award, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: darkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
      padding: '12px 20px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            flexShrink: 0
          }}>
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.5px', margin: 0, lineHeight: 1 }}>
              MAAN<span style={{ color: '#0d9488' }}>MITRA</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Digital Emotional Support
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.76rem',
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
              marginLeft: '4px'
            }}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
          </button>
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {darkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          paddingTop: '16px',
          paddingBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '12px'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-primary)'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
