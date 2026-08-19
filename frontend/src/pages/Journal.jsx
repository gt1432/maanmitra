import React, { useState, useEffect } from 'react';
import { getJournalEntries, submitJournalEntry, deleteJournalEntry } from '../services/api';
import { BookOpen, Plus, Trash2, Sparkles, Calendar, Tag, ShieldCheck } from 'lucide-react';

export default function Journal({ setActivePage }) {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchJournal = async () => {
    setLoading(true);
    try {
      const data = await getJournalEntries();
      setEntries(data || []);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await submitJournalEntry(content);
      setContent('');
      await fetchJournal();
    } catch (err) {
      console.error(err);
      alert("Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteJournalEntry(id);
      await fetchJournal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'var(--secondary-light)',
          color: 'var(--secondary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '8px'
        }}>
          <BookOpen size={16} /> Private & Encrypted Reflection Space
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Express & Reflect Journal</h1>
      </div>

      {/* Entry Writer Card */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>
          Write a new entry
        </h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely... E.g., 'I feel overwhelmed with assignments and need to take a break...'"
          rows={5}
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
            marginBottom: '16px',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} /> Auto NLP Emotion Tagging Enabled
          </div>

          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            <Plus size={18} /> {saving ? 'Saving...' : 'SAVE JOURNAL ENTRY'}
          </button>
        </div>
      </div>

      {/* Previous Entries List */}
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
          Past Journal Entries ({entries.length})
        </h3>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading entries...</p>
        ) : entries.length === 0 ? (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No journal entries yet. Express your thoughts above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {entries.map((entry) => (
              <div key={entry.id} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} /> {new Date(entry.created_at).toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {entry.emotion && (
                      <span className="badge badge-low" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        Emotion: {entry.emotion}
                      </span>
                    )}
                    {entry.sentiment && (
                      <span className="badge badge-low" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                        {entry.sentiment}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {entry.content}
                </p>

                {entry.recommendation && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px dashed var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      NLP Recommended Support:
                    </span>
                    <button
                      onClick={() => setActivePage('activities')}
                      className="btn btn-outline"
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      <Sparkles size={12} /> {entry.recommendation}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
