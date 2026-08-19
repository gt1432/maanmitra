import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, UserCheck, Clock, CheckCircle2, Calendar } from 'lucide-react';

export default function GetHelp() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    slot: 'Tomorrow, 10:00 AM',
    notes: ''
  });

  const handleBook = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      alert("Counsellor appointment request received. A peer support counsellor will reach out via college portal.");
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: '#ffe4e6',
          color: '#be123c',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <ShieldAlert size={16} /> Confidential Professional Support Portal
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>
          Connect & Get Help
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '8px' }}>
          You don't have to navigate difficult moments alone. Help is available 24/7.
        </p>
      </div>

      {/* Primary Counsellor Banner */}
      <div className="glass-card" style={{
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid var(--primary)',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>
            CAMPUS COUNSELLING SERVICE
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', marginBottom: '10px' }}>
            Talk to a Qualified Campus Counsellor
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Free, confidential 1-on-1 psychological support sessions for higher education students.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
          style={{ fontSize: '1.05rem', padding: '16px 32px' }}
        >
          <UserCheck size={20} />
          Talk to a Counsellor
        </button>
      </div>

      {/* Emergency Helplines Directory */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
          24/7 Verified Crisis Helplines (India)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              name: 'Tele-MANAS (Ministry of Health)',
              number: '14416 / 1800 891 4416',
              desc: 'Toll-free 24/7 tele-mental health services in 20+ languages.',
              color: '#0d9488'
            },
            {
              name: 'KIRAN Helpline',
              number: '1800-599-0019',
              desc: 'Govt. Mental Health Rehabilitation Helpline.',
              color: '#6366f1'
            },
            {
              name: 'Vandrevala Foundation',
              number: '+91 9999 666 555',
              desc: '24/7 free emotional support & crisis counseling.',
              color: '#f59e0b'
            },
            {
              name: 'National Emergency Helpline',
              number: '112',
              desc: 'Immediate emergency medical and police assistance.',
              color: '#f43f5e'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <PhoneCall size={20} color={item.color} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{item.name}</h4>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color, marginBottom: '8px' }}>
                {item.number}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted Person Option */}
      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <HeartHandshake size={28} color="var(--primary)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
            Connect with a Trusted Person
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Sometimes sharing with a friend, mentor, hostel warden, or family member makes a world of difference. Reach out to someone you trust today.
        </p>
      </div>

      {/* Counsellor Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            background: 'var(--bg-card)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
              Request Counsellor Appointment
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Select a preferred time. This request is kept completely confidential.
            </p>

            <form onSubmit={handleBook}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  YOUR NAME / ALIAS
                </label>
                <input
                  type="text"
                  required
                  placeholder="Student Alias"
                  value={bookingData.name}
                  onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  STUDENT EMAIL / CONTACT
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={bookingData.email}
                  onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  PREFERRED TIME SLOT
                </label>
                <select
                  value={bookingData.slot}
                  onChange={e => setBookingData({ ...bookingData, slot: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option>Tomorrow, 10:00 AM</option>
                  <option>Tomorrow, 02:00 PM</option>
                  <option>Day after, 11:30 AM</option>
                  <option>Weekend, 04:00 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={submitted} className="btn btn-primary">
                  {submitted ? 'Submitting...' : 'CONFIRM REQUEST'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
