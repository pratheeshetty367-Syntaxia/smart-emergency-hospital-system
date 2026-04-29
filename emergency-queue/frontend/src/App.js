import React, { useState, useEffect } from 'react';
import PatientCard from './components/PatientCard';
import AdmitForm from './components/AdmitForm';
import StatsBar from './components/StatsBar';
import SuccessModal from './components/SuccessModal';
import './App.css';

// ─── Priority Algorithm (mirrors your Django backend) ───────────────────────
function calculatePriorityScore(v) {
  let score = 0;
  const hr = Number(v.heart_rate);
  const sbp = Number(v.systolic_bp);
  const spo2 = Number(v.spo2);
  const temp = Number(v.temperature);
  const rr = Number(v.respiratory_rate);
  const gcs = Number(v.gcs_score);

  if (spo2 < 85) score += 40; else if (spo2 < 90) score += 30; else if (spo2 < 94) score += 15;
  if (hr < 40 || hr > 150) score += 35; else if (hr < 50 || hr > 130) score += 20; else if (hr < 60 || hr > 110) score += 8;
  if (sbp < 70 || sbp > 200) score += 35; else if (sbp < 80 || sbp > 180) score += 22; else if (sbp < 90 || sbp > 160) score += 10;
  if (temp > 40 || temp < 35) score += 20; else if (temp > 39 || temp < 35.5) score += 10; else if (temp > 38.5) score += 5;
  if (rr < 8 || rr > 30) score += 25; else if (rr < 10 || rr > 25) score += 12; else if (rr < 12 || rr > 20) score += 5;
  if (gcs <= 8) score += 30; else if (gcs <= 12) score += 15; else if (gcs < 15) score += 5;
  return Math.min(score, 100);
}

function scoreToPriority(score) {
  if (score >= 60) return 'critical';
  if (score >= 35) return 'high';
  if (score >= 15) return 'medium';
  return 'low';
}

let nextId = 1;

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Success modal state
  const [successData, setSuccessData] = useState(null); // holds admitted patient info

  // Simulate live vitals fluctuation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prev =>
        prev.map(p => {
          const v = { ...p.vitals };
          v.heart_rate     = clamp(v.heart_rate     + rand(-4, 4),  30, 200);
          v.systolic_bp    = clamp(v.systolic_bp    + rand(-5, 5),  50, 230);
          v.spo2           = clamp(v.spo2           + rand(-1, 1),  70, 100);
          v.temperature    = +(v.temperature        + rand(-0.1, 0.1)).toFixed(1);
          v.respiratory_rate = clamp(v.respiratory_rate + rand(-2, 2), 5, 40);
          const score    = calculatePriorityScore(v);
          const priority = scoreToPriority(score);
          return { ...p, vitals: v, priority_score: score, priority_level: priority };
        }).sort((a, b) => b.priority_score - a.priority_score)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Admit a patient ────────────────────────────────────────────────────────
  const handleAdmit = (formData) => {
    const score    = calculatePriorityScore(formData);
    const priority = scoreToPriority(score);
    const now      = new Date();

    const newPatient = {
      id:               nextId++,
      name:             formData.name,
      age:              formData.age,
      gender:           formData.gender,
      chief_complaint:  formData.chief_complaint,
      vitals: {
        heart_rate:        Number(formData.heart_rate),
        systolic_bp:       Number(formData.systolic_bp),
        spo2:              Number(formData.spo2),
        temperature:       Number(formData.temperature),
        respiratory_rate:  Number(formData.respiratory_rate),
        gcs_score:         Number(formData.gcs_score),
      },
      priority_score:  score,
      priority_level:  priority,
      admitted_at:     now.toISOString(),
      wait_mins:       0,
    };

    setPatients(prev =>
      [...prev, newPatient].sort((a, b) => b.priority_score - a.priority_score)
    );
    setShowForm(false);
    setSuccessData(newPatient);   // ← triggers success modal
    setSelectedPatient(newPatient);
  };

  const handleDischarge = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    if (selectedPatient?.id === id) setSelectedPatient(null);
  };

  const visiblePatients = filter === 'all'
    ? patients
    : patients.filter(p => p.priority_level === filter);

  const counts = {
    critical: patients.filter(p => p.priority_level === 'critical').length,
    high:     patients.filter(p => p.priority_level === 'high').length,
    medium:   patients.filter(p => p.priority_level === 'medium').length,
    low:      patients.filter(p => p.priority_level === 'low').length,
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <div className="header">
        <div className="header-logo">🏥 EMERQ · Patient Queue System</div>
        <div className="header-right">
          <span className="live-badge">● LIVE</span>
          <button className="btn-admit" onClick={() => setShowForm(true)}>
            + Admit Patient
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <StatsBar counts={counts} total={patients.length} />

      {/* ── Main Layout ── */}
      <div className="main-layout">
        {/* Queue */}
        <div className="queue-panel">
          <div className="panel-header">
            <span className="panel-title">Patient Queue</span>
            <div className="filter-tabs">
              {['all', 'critical', 'high', 'medium', 'low'].map(f => (
                <button
                  key={f}
                  className={`tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {patients.length === 0 && (
            <p className="empty-text">No patients in queue. Click "+ Admit Patient" to begin.</p>
          )}

          {visiblePatients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              selected={selectedPatient?.id === patient.id}
              onClick={() => setSelectedPatient(patient)}
              onDischarge={handleDischarge}
            />
          ))}
        </div>

        {/* Detail Panel */}
        <div className="detail-panel">
          {selectedPatient ? (
            <PatientDetail patient={selectedPatient} />
          ) : (
            <p className="no-selection">Select a patient to view details</p>
          )}
        </div>
      </div>

      {/* ── Admit Form Modal ── */}
      {showForm && (
        <AdmitForm
          onSubmit={handleAdmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* ── Success Modal ── */}
      {successData && (
        <SuccessModal
          patient={successData}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
}

// ─── Patient Detail Sidebar ──────────────────────────────────────────────────
function PatientDetail({ patient: p }) {
  const v = p.vitals;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 4 }}>{p.name}</h2>
          <p style={{ fontSize: 12, color: '#7a9ab8' }}>
            {p.age} yrs · {p.gender} · ID #{p.id}
          </p>
        </div>
        <div className={`priority-badge ${p.priority_level}`}>
          {p.priority_level}
        </div>
      </div>

      <div style={{ background: '#131b27', border: '1px solid #1e2d42', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#b0c4d8' }}>
        📋 {p.chief_complaint}
      </div>

      {/* Score Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: '#7a9ab8' }}>Priority Score</span>
          <span style={{ fontWeight: 600, color: scoreColor(p.priority_level) }}>
            {p.priority_score} / 100
          </span>
        </div>
        <div style={{ height: 6, background: '#1e2d42', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${p.priority_score}%`, background: scoreColor(p.priority_level), borderRadius: 3, transition: 'width 0.5s' }} />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #1e2d42', margin: '14px 0' }} />

      <h3 style={{ fontSize: 11, color: '#7a9ab8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Live Vitals</h3>
      <div className="vitals-detail-grid">
        <VitalBox label="Heart Rate"   value={v.heart_rate}      unit="bpm"  status={hrSt(v.heart_rate)} />
        <VitalBox label="Systolic BP"  value={v.systolic_bp}     unit="mmHg" status={bpSt(v.systolic_bp)} />
        <VitalBox label="SpO₂"         value={v.spo2}            unit="%"    status={o2St(v.spo2)} />
        <VitalBox label="Temperature"  value={v.temperature}     unit="°C"   status={tmpSt(v.temperature)} />
        <VitalBox label="Resp. Rate"   value={v.respiratory_rate} unit="bpm" status={rrSt(v.respiratory_rate)} />
        <VitalBox label="GCS Score"    value={v.gcs_score}       unit="/15"  status={gcsSt(v.gcs_score)} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #1e2d42', margin: '14px 0' }} />
      <p style={{ fontSize: 11, color: '#3d5470' }}>
        Admitted: {new Date(p.admitted_at).toLocaleString()}
      </p>
    </div>
  );
}

function VitalBox({ label, value, unit, status }) {
  const color = status === 'alert' ? '#ff4757' : status === 'warn' ? '#ff8c42' : '#2ed573';
  const bg    = status === 'alert' ? 'rgba(255,71,87,0.08)' : status === 'warn' ? 'rgba(255,140,66,0.08)' : '#131b27';
  const border= status === 'alert' ? 'rgba(255,71,87,0.3)' : status === 'warn' ? 'rgba(255,140,66,0.3)' : '#1e2d42';
  const tag   = status === 'alert' ? '↑ Alert' : status === 'warn' ? '⚠ Warn' : '✓ OK';
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#7a9ab8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'monospace' }}>{value} <span style={{ fontSize: 11, fontWeight: 400, color: '#7a9ab8' }}>{unit}</span></div>
      <div style={{ fontSize: 10, color, marginTop: 3 }}>{tag}</div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const clamp = (v, mn, mx) => Math.round(Math.max(mn, Math.min(mx, v)));
const rand  = (lo, hi) => Math.random() * (hi - lo) + lo;
const scoreColor = (lvl) => ({ critical:'#ff4757', high:'#ff8c42', medium:'#ffd32a', low:'#2ed573' }[lvl]);
const hrSt  = v => (v < 50 || v > 130) ? 'alert' : (v < 60 || v > 110) ? 'warn' : 'ok';
const bpSt  = v => (v < 80 || v > 180) ? 'alert' : (v < 90 || v > 160) ? 'warn' : 'ok';
const o2St  = v => v < 88 ? 'alert' : v < 94 ? 'warn' : 'ok';
const tmpSt = v => (v > 40 || v < 35) ? 'alert' : (v > 39 || v < 35.5) ? 'warn' : 'ok';
const rrSt  = v => (v < 8  || v > 30) ? 'alert' : (v < 12 || v > 24) ? 'warn' : 'ok';
const gcsSt = v => v <= 8 ? 'alert' : v <= 12 ? 'warn' : 'ok';

export default App;