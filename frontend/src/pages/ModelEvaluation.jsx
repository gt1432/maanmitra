import React, { useState, useEffect } from 'react';
import { getModelMetrics } from '../services/api';
import { Award, Brain, Database, BarChart2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ModelEvaluation() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getModelMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error loading model metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Machine Learning & NLP Evaluation Metrics...</p>
      </div>
    );
  }

  const nlpData = metrics?.nlp_model_evaluation || {};
  const mhData = metrics?.student_mental_health_evaluation || {};

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Award size={16} /> Developer & Admin Evaluation Dashboard
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>
          Machine Learning & NLP Pipelines Evaluation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '8px' }}>
          Empirical validation metrics computed on test split datasets. No hardcoded predictions.
        </p>
      </div>

      {/* SECTION 1: NLP TEXT MODEL PIPELINE B */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Brain size={28} color="var(--primary)" />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              PIPELINE B: Mental Health Text Classification (NLP)
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Kaggle Mental Health Text Classification Dataset (49,612 samples)
            </span>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Dataset Size</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {nlpData.dataset_size?.toLocaleString() || '49,612'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Training Samples (80%)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {nlpData.train_samples?.toLocaleString() || '39,688'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Testing Samples (20%)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
              {nlpData.test_samples?.toLocaleString() || '9,922'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Selected Best Model</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
              🏆 {nlpData.best_model || 'Logistic Regression'}
            </div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Model Comparison Matrix</h4>
        <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Model Architecture</th>
                <th style={{ padding: '12px' }}>Accuracy</th>
                <th style={{ padding: '12px' }}>Precision</th>
                <th style={{ padding: '12px' }}>Recall</th>
                <th style={{ padding: '12px' }}>F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {nlpData.models_comparison && Object.entries(nlpData.models_comparison).map(([mName, mStats]) => (
                <tr key={mName} style={{
                  borderBottom: '1px solid var(--border-color)',
                  fontWeight: mName === nlpData.best_model ? '700' : 'normal',
                  background: mName === nlpData.best_model ? 'var(--primary-light)' : 'transparent'
                }}>
                  <td style={{ padding: '12px' }}>{mName} {mName === nlpData.best_model && '🏆 (Selected)'}</td>
                  <td style={{ padding: '12px' }}>{(mStats.accuracy * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px' }}>{(mStats.precision * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px' }}>{(mStats.recall * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 800 }}>{(mStats.f1_score * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confusion Matrix Visualizer */}
        {nlpData.best_model && nlpData.models_comparison[nlpData.best_model]?.confusion_matrix && (
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              Confusion Matrix ({nlpData.best_model})
            </h4>
            <RenderConfusionMatrix 
              matrix={nlpData.models_comparison[nlpData.best_model].confusion_matrix}
              labels={nlpData.labels || ['Anxiety', 'Depression', 'Normal', 'Suicidal']}
            />
          </div>
        )}
      </div>

      {/* SECTION 2: STUDENT MENTAL HEALTH PIPELINE A */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Database size={28} color="var(--secondary)" />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              PIPELINE A: Student Mental Health Structured ML Model
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Kaggle Student Mental Health Dataset (101 student survey samples)
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Dataset Size</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {mhData.dataset_size || '101'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Training Samples (80%)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {mhData.train_samples || '80'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Testing Samples (20%)</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
              {mhData.test_samples || '21'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Selected Best Model</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
              🏆 {mhData.best_model || 'Logistic Regression'}
            </div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Model Comparison Matrix</h4>
        <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Model Architecture</th>
                <th style={{ padding: '12px' }}>Accuracy</th>
                <th style={{ padding: '12px' }}>Precision</th>
                <th style={{ padding: '12px' }}>Recall</th>
                <th style={{ padding: '12px' }}>F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {mhData.models_comparison && Object.entries(mhData.models_comparison).map(([mName, mStats]) => (
                <tr key={mName} style={{
                  borderBottom: '1px solid var(--border-color)',
                  fontWeight: mName === mhData.best_model ? '700' : 'normal',
                  background: mName === mhData.best_model ? 'var(--primary-light)' : 'transparent'
                }}>
                  <td style={{ padding: '12px' }}>{mName} {mName === mhData.best_model && '🏆 (Selected)'}</td>
                  <td style={{ padding: '12px' }}>{(mStats.accuracy * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px' }}>{(mStats.precision * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px' }}>{(mStats.recall * 100).toFixed(2)}%</td>
                  <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 800 }}>{(mStats.f1_score * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confusion Matrix Visualizer */}
        {mhData.best_model && mhData.models_comparison[mhData.best_model]?.confusion_matrix && (
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              Confusion Matrix ({mhData.best_model})
            </h4>
            <RenderConfusionMatrix 
              matrix={mhData.models_comparison[mhData.best_model].confusion_matrix}
              labels={mhData.labels || ['HIGH', 'LOW', 'MODERATE']}
            />
          </div>
        )}
      </div>

    </div>
  );
}

/* Helper function to draw Confusion Matrix grid */
function RenderConfusionMatrix({ matrix, labels }) {
  if (!matrix || !matrix.length) return null;

  return (
    <div style={{ overflowX: 'auto', padding: '10px 0' }}>
      <table style={{ borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem', margin: '0 auto' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}></th>
            {labels.map((lbl, idx) => (
              <th key={idx} style={{ padding: '8px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                Pred: {lbl}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rIdx) => (
            <tr key={rIdx}>
              <td style={{ padding: '8px', color: 'var(--text-secondary)', fontWeight: 700, textAlign: 'right' }}>
                Actual: {labels[rIdx]}
              </td>
              {row.map((val, cIdx) => (
                <td
                  key={cIdx}
                  style={{
                    padding: '16px 24px',
                    border: '1px solid var(--border-color)',
                    background: rIdx === cIdx ? 'rgba(13, 148, 136, 0.25)' : 'var(--bg-card)',
                    fontWeight: rIdx === cIdx ? 800 : 400,
                    color: rIdx === cIdx ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
