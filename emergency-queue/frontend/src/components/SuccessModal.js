import React, { useEffect } from 'react';

const PRIORITY_COLOR = {
  critical: '#ff4757',
  high:     '#ff8c42',
  medium:   '#ffd32a',
  low:      '#2ed573',
};

const PRIORITY_ICON = {
  critical: '🚨',
  high:     '⚠️',
  medium:   '🟡',
  low:      '🟢',
};

function SuccessModal({ patient: p, onClose }) {
  // Auto-close after 6 seconds
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = PRIORITY_COLOR[p.priority_level];
  const icon  = PRIORITY_ICON[p.priority_level];
  const v     = p.vitals;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal success-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: color, maxWidth: 480 }}
      >
        {/* Top check icon */}
        <div className="success-icon-wrap" style={{ borderColor: color }}>
          <span className="success-check" style={{ color }}>✓</span>
        </div>

        <div className="success-title" style={{ color }}>
          Patient Admitted Successfully
        </div>

        <div className="success-subtitle">
          Triage complete — priority assigned based on vitals
        </div>

        {/* Patient summary card */}
        <div className="success-card" style={{ borderColor: color }}>
          <div className="success-card-header">
            <div>
              <div className="success-name">{p.name}</div>
              <div className="success-meta">
                {p.age} yrs · {p.gender} · ID #{p.id}
              </div>
            </div>
            <div className="success-priority-badge" style={{ color, borderColor: color, background: `${color}18` }}>
              {icon} {p.priority_level.toUpperCase()}
            </div>
          </div>

          <div className="success-complaint">📋 {p.chief_complaint}</div>

          {/* Score bar */}
          <div className="success-score-wrap">
            <div className="success-score-label">
              <span>Priority Score</span>
              <span style={{ color, fontWeight: 700 }}>{p.priority_score} / 100</span>
            </div>
            <div className="success-score-track">
              <div
                className="success-score-fill"
                style={{ width: `${p.priority_score}%`, background: color }}
              />
            </div>
          </div>

          {/* Vitals summary */}
          <div className="success-vitals">
            <div className="success-vital-chip">
              <span className="sv-label">HR</span>
              <span className="sv-val">{v.heart_rate} bpm</span>
            </div>
            <div className="success-vital-chip">
              <span className="sv-label">BP</span>
              <span className="sv-val">{v.systolic_bp} mmHg</span>
            </div>
            <div className="success-vital-chip">
              <span className="sv-label">SpO₂</span>
              <span className="sv-val">{v.spo2}%</span>
            </div>
            <div className="success-vital-chip">
              <span className="sv-label">Temp</span>
              <span className="sv-val">{v.temperature}°C</span>
            </div>
            <div className="success-vital-chip">
              <span className="sv-label">RR</span>
              <span className="sv-val">{v.respiratory_rate}</span>
            </div>
            <div className="success-vital-chip">
              <span className="sv-label">GCS</span>
              <span className="sv-val">{v.gcs_score}/15</span>
            </div>
          </div>
        </div>

        {/* Admitted time */}
        <div className="success-time">
          Admitted at {new Date(p.admitted_at).toLocaleTimeString()}
        </div>

        {/* Progress bar showing auto-close */}
        <div className="success-progress-track">
          <div className="success-progress-fill" style={{ background: color }} />
        </div>

        <button className="success-close-btn" style={{ borderColor: color, color }} onClick={onClose}>
          View in Queue →
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;