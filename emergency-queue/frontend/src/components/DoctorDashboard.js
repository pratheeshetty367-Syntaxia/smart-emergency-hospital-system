import React, { useState } from 'react';

const PCOL = {critical:'#ff4757',high:'#ff8c42',medium:'#ffd32a',low:'#2ed573'};

export default function DoctorDashboard({ patients, onDischarge, estimateWait }) {
  const [docFilter, setDocFilter] = useState('all');
  const visible = docFilter==='all' ? patients : patients.filter(p=>p.priority_level===docFilter);
  const counts = {
    critical: patients.filter(p=>p.priority_level==='critical').length,
    high:     patients.filter(p=>p.priority_level==='high').length,
    medium:   patients.filter(p=>p.priority_level==='medium').length,
    low:      patients.filter(p=>p.priority_level==='low').length,
  };
  const alerts = patients.filter(p=>
    p.vitals.spo2<90 || p.vitals.heart_rate>130 || p.vitals.systolic_bp>180 || p.vitals.gcs_score<=8
  );

  return (
    <div className="dashboard">
      <div className="dash-summary">
        <div className="dash-card" style={{borderColor:PCOL.critical}}>
          <div className="dash-card-label">Critical</div>
          <div className="dash-card-val" style={{color:PCOL.critical}}>{counts.critical}</div>
          <div className="dash-card-sub">Immediate attention</div>
        </div>
        <div className="dash-card" style={{borderColor:PCOL.high}}>
          <div className="dash-card-label">High Priority</div>
          <div className="dash-card-val" style={{color:PCOL.high}}>{counts.high}</div>
          <div className="dash-card-sub">Within 15 min</div>
        </div>
        <div className="dash-card" style={{borderColor:PCOL.medium}}>
          <div className="dash-card-label">Medium Priority</div>
          <div className="dash-card-val" style={{color:PCOL.medium}}>{counts.medium}</div>
          <div className="dash-card-sub">Within 30 min</div>
        </div>
        <div className="dash-card" style={{borderColor:PCOL.low}}>
          <div className="dash-card-label">Low Priority</div>
          <div className="dash-card-val" style={{color:PCOL.low}}>{counts.low}</div>
          <div className="dash-card-sub">Routine care</div>
        </div>
        <div className="dash-card" style={{borderColor:'#00b4d8'}}>
          <div className="dash-card-label">Total Patients</div>
          <div className="dash-card-val" style={{color:'#00b4d8'}}>{patients.length}</div>
          <div className="dash-card-sub">In queue now</div>
        </div>
        <div className="dash-card" style={{borderColor:'#a29bfe'}}>
          <div className="dash-card-label">Vital Alerts</div>
          <div className="dash-card-val" style={{color:'#a29bfe'}}>{alerts.length}</div>
          <div className="dash-card-sub">Need immediate check</div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="dash-alerts">
          <div className="dash-section-title">⚠️ Vital Sign Alerts — Immediate Attention Required</div>
          <div className="dash-alerts-grid">
            {alerts.map(p=>(
              <div key={p.id} className="dash-alert-item">
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontWeight:600}}>{p.name}</span>
                  <span className="token-pill">🎫 {p.token}</span>
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {p.vitals.spo2<90&&<span className="alert-tag">SpO₂ {p.vitals.spo2}%</span>}
                  {p.vitals.heart_rate>130&&<span className="alert-tag">HR {p.vitals.heart_rate}</span>}
                  {p.vitals.systolic_bp>180&&<span className="alert-tag">BP {p.vitals.systolic_bp}</span>}
                  {p.vitals.gcs_score<=8&&<span className="alert-tag">GCS {p.vitals.gcs_score}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dash-table-wrap">
        <div className="dash-table-header">
          <div className="dash-section-title">All Patients</div>
          <div className="filter-tabs">
            {['all','critical','high','medium','low'].map(f=>(
              <button key={f} className={`tab${docFilter===f?' active':''}`} onClick={()=>setDocFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        {patients.length===0 && <p className="empty-text">No patients admitted yet.</p>}
        {visible.length>0&&(
          <table className="dash-table">
            <thead>
              <tr>
                <th>Token</th><th>Name</th><th>Age</th><th>Complaint</th>
                <th>HR</th><th>BP</th><th>SpO₂</th><th>Temp</th><th>RR</th><th>GCS</th>
                <th>Score</th><th>Priority</th><th>In Queue</th><th>Est. Wait</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(p=>{
                const v=p.vitals;
                return(
                  <tr key={p.id} className={`dash-row priority-row-${p.priority_level}`}>
                    <td><span style={{fontFamily:'monospace',color:'#00b4d8',fontSize:12}}>{p.token}</span></td>
                    <td style={{fontWeight:600}}>{p.name}</td>
                    <td>{p.age}</td>
                    <td style={{fontSize:12,color:'#b0c4d8',maxWidth:140}}>{p.chief_complaint}</td>
                    <td className={v.heart_rate>130||v.heart_rate<50?'cell-alert':v.heart_rate>110?'cell-warn':''}>{v.heart_rate}</td>
                    <td className={v.systolic_bp>180||v.systolic_bp<80?'cell-alert':v.systolic_bp>160?'cell-warn':''}>{v.systolic_bp}</td>
                    <td className={v.spo2<88?'cell-alert':v.spo2<94?'cell-warn':''}>{v.spo2}%</td>
                    <td className={v.temperature>40||v.temperature<35?'cell-alert':v.temperature>39?'cell-warn':''}>{v.temperature}</td>
                    <td className={v.respiratory_rate>30||v.respiratory_rate<8?'cell-alert':v.respiratory_rate>24?'cell-warn':''}>{v.respiratory_rate}</td>
                    <td className={v.gcs_score<=8?'cell-alert':v.gcs_score<=12?'cell-warn':''}>{v.gcs_score}</td>
                    <td style={{fontFamily:'monospace',fontWeight:700,color:PCOL[p.priority_level]}}>{p.priority_score}</td>
                    <td><span className={`priority-badge ${p.priority_level}`}>{p.priority_level}</span></td>
                    <td style={{color:'#7a9ab8',fontSize:12}}>{p.wait_mins}m</td>
                    <td style={{color:PCOL[p.priority_level],fontWeight:600,fontSize:12}}>{estimateWait(p,patients)}</td>
                    <td><button className="btn-discharge" onClick={()=>onDischarge(p.id)}>Discharge</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}