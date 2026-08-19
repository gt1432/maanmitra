import React, { useState, useEffect } from 'react';
import { getMoodHistory } from '../services/api';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { BarChart2, Activity, Heart, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodTracker({ setActivePage }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayMood: 'Okay',
    currentEmotion: 'Stress',
    distressLevel: 'MODERATE',
    mostCommon: 'Stress',
    trend: 'Improving'
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getMoodHistory();
        if (res.history && res.history.length > 0) {
          setHistory(res.history);
          const latest = res.history[0];
          setStats({
            todayMood: latest.mood || 'Okay',
            currentEmotion: latest.emotion || 'Stress',
            distressLevel: latest.distress_level || 'MODERATE',
            mostCommon: res.most_common_emotion || 'Stress',
            trend: res.trend || 'Stable'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Prepare chart data
  const emotionCounts = {};
  history.forEach(item => {
    const emo = item.emotion || 'Okay';
    emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(emotionCounts).length ? Object.keys(emotionCounts) : ['Stress', 'Anxiety', 'Happy', 'Okay'],
    datasets: [
      {
        data: Object.values(emotionCounts).length ? Object.values(emotionCounts) : [4, 3, 2, 5],
        backgroundColor: ['#0d9488', '#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Stress & Distress Score',
        data: [3, 4, 2, 5, 3, 2, 2],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood Check-ins Count',
        data: [2, 3, 1, 4, 2, 1, 3],
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 8
      }
    ]
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Student Wellbeing & Mood Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Track emotional health trends over time with visual analytics.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            TODAY'S MOOD
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>
            {stats.todayMood}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            CURRENT EMOTION
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '8px' }}>
            {stats.currentEmotion}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            DISTRESS INDICATOR
          </span>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge badge-${stats.distressLevel.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {stats.distressLevel}
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            MOOD TREND
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={20} /> {stats.trend}
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Emotion Distribution */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Emotion Distribution
          </h3>
          <div style={{ maxHeight: '260px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Weekly Stress Trend */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Weekly Stress Trend
          </h3>
          <div style={{ height: '220px' }}>
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Check-ins Frequency */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Weekly Check-ins Frequency
          </h3>
          <div style={{ height: '220px' }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
          Recent Mood Check-ins
        </h3>

        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recorded check-ins yet. Take your first mood check-in!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Mood</th>
                  <th style={{ padding: '12px' }}>Emotion</th>
                  <th style={{ padding: '12px' }}>Distress</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{row.mood}</td>
                    <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 600 }}>{row.emotion}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${(row.distress_level || 'low').toLowerCase()}`}>
                        {row.distress_level || 'LOW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
