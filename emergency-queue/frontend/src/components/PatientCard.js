import React from 'react';

function PatientCard({ patient, selected, onClick, onDischarge }) {
  const p = patient;

  return (
    <div
      className={`patient-card priority-${p.priority_level} ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="card-top">
        <div>
          <div className="patient-name">{p.name}</div>
          <div className="patient-meta">
            {p.age}{p.gender} · {p.chief_complaint}
          </div>
        </div>
        <div>
          <div className={`priority-badge ${p.priority_level}`}>
            {p.priority_level}
          </div>
          <div className="score-text">Score: {p.priority_score}</div>
        </div>
      </div>

      <div className="vitals-row">
        <span>HR: {p.heart_rate}</span>
        <span>BP: {p.systolic_bp}</span>
        <span>SpO₂: {p.spo2}%</span>
        <span>Temp: {p.temperature}°C</span>
        <span>RR: {p.respiratory_rate}</span>
      </div>

      <div className="card-footer">
        <button
          className="btn-discharge"
          onClick={(e) => { e.stopPropagation(); onDischarge(p.id); }}
        >
          Discharge
        </button>
      </div>
    </div>
  );
}

export default PatientCard;