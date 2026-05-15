import React, { useEffect } from 'react';
import { estimateWaitTime } from '../App';

const PCOL={critical:'#ff4757',high:'#ff8c42',medium:'#ffd32a',low:'#2ed573'};
const PICO={critical:'🚨',high:'⚠️',medium:'🟡',low:'🟢'};

export default function SuccessModal({patient:p, allPatients, onClose}){
  useEffect(()=>{const t=setTimeout(onClose,7000);return()=>clearTimeout(t);},[onClose]);
  const color=PCOL[p.priority_level];
  const wait=estimateWaitTime(p,allPatients);
  const v=p.vitals;

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" style={{borderColor:color}} onClick={e=>e.stopPropagation()}>
        <div className="success-icon-wrap" style={{borderColor:color}}>
          <span style={{color,fontSize:28,fontWeight:700}}>✓</span>
        </div>
        <div className="success-title" style={{color}}>Patient Admitted Successfully</div>
        <div className="success-subtitle">Triage complete — priority assigned based on vitals</div>
        <div className="success-token-box" style={{borderColor:color,background:`${color}12`}}>
          <div className="success-token-label">Queue Token</div>
          <div className="success-token-val" style={{color}}>{p.token}</div>
          <div className="success-token-sub">Show this token to the patient</div>
        </div>
        <div className="success-card" style={{borderColor:color}}>
          <div className="success-card-header">
            <div>
              <div className="success-name">{p.name}</div>
              <div className="success-meta">{p.age} yrs · {p.gender}</div>
            </div>
            <div className="success-priority-badge" style={{color,borderColor:color,background:`${color}18`}}>
              {PICO[p.priority_level]} {p.priority_level.toUpperCase()}
            </div>
          </div>
          <div className="success-complaint">📋 {p.chief_complaint}</div>
          <div className="success-wait-row">
            <span style={{color:'#7a9ab8',fontSize:12}}>⏱ Estimated Wait</span>
            <span style={{color,fontWeight:700,fontSize:14}}>{wait}</span>
          </div>
          <div className="success-score-wrap">
            <div className="success-score-label">
              <span>Priority Score</span>
              <span style={{color,fontWeight:700}}>{p.priority_score} / 100</span>
            </div>
            <div className="success-score-track">
              <div className="success-score-fill" style={{width:`${p.priority_score}%`,background:color}}/>
            </div>
          </div>
          <div className="success-vitals">
            {[['HR',`${v.heart_rate} bpm`],['BP',`${v.systolic_bp} mmHg`],['SpO₂',`${v.spo2}%`],
              ['Temp',`${v.temperature}°C`],['RR',v.respiratory_rate],['GCS',`${v.gcs_score}/15`]
            ].map(([l,val])=>(
              <div key={l} className="success-vital-chip">
                <span className="sv-label">{l}</span>
                <span className="sv-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="success-time">Admitted at {new Date(p.admitted_at).toLocaleTimeString()}</div>
        <div className="success-progress-track">
          <div className="success-progress-fill" style={{background:color}}/>
        </div>
        <button className="success-close-btn" style={{borderColor:color,color}} onClick={onClose}>
          View in Queue →
        </button>
      </div>
    </div>
  );
}