import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import { Send, Bot, User, Sparkles, Heart, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AICompanion({ setActivePage }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm MaanMitra, your supportive companion. I'm here to listen without judgment. How can I support you today?",
      emotion: 'Supportive'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [isCrisis, setIsCrisis] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.ai_response,
            emotion: res.detected_emotion,
            actionButtons: res.action_buttons
          }
        ]);

        if (res.recommendation_label) {
          setCurrentRecommendation(res.recommendation_label);
        }

        if (res.is_crisis) {
          setIsCrisis(true);
        }

        setLoading(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "I'm having a little trouble connecting right now, but please know I'm here for you." }
      ]);
      setLoading(false);
    }
  };

  const quickPrompts = [
    "I am stressed about my exams.",
    "I feel overwhelmed with assignments.",
    "I'm feeling lonely today.",
    "I need a quick breathing break."
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '8px'
        }}>
          <Bot size={16} /> Empathetic Student Companion
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>AI Companion Chat</h1>
      </div>

      {/* Crisis Banner */}
      {isCrisis && (
        <div className="glass-card" style={{
          padding: '20px',
          background: '#fff1f2',
          border: '2px solid #f43f5e',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={28} color="#e11d48" />
            <div>
              <h4 style={{ color: '#9f1239', fontWeight: 700, margin: 0 }}>Immediate Support Recommended</h4>
              <p style={{ color: '#be123c', fontSize: '0.85rem', margin: 0 }}>
                You don't have to carry this alone. Please reach out to a professional counsellor or emergency hotline.
              </p>
            </div>
          </div>
          <button onClick={() => setActivePage('gethelp')} className="btn btn-accent">
            CONNECT & GET HELP <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className="glass-card" style={{
        height: '520px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: isAI ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                {isAI && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Bot size={20} />
                  </div>
                )}

                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: isAI ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                    background: isAI ? 'var(--bg-card)' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                    color: isAI ? 'var(--text-primary)' : 'white',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    border: isAI ? '1px solid var(--border-color)' : 'none'
                  }}>
                    {msg.text}

                    {msg.emotion && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={12} /> Emotion: {msg.emotion}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons if present */}
                  {msg.actionButtons && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {msg.actionButtons.map((btnLabel, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePage('activities')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            border: '1px solid var(--primary)',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {btnLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <User size={20} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Bot size={20} />
              <div style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>MaanMitra is typing...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '8px', padding: '10px 0', overflowX: 'auto' }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type how you are feeling..."
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <button onClick={() => handleSend()} className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <Send size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}
