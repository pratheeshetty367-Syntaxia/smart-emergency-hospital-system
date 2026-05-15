import React from 'react';

export default function PatientCard({patient:p, waitTime, selected, onClick, onDischarge}){
  const v = p.vitals;
  return(
    <div className={`patient-card priority-${p.priority_level}${selected?' selected':''}`} onClick={onClick}>
      <div className="card-top">
        <div>
          <div className="patient-name">{p.name}</div>
          <div className="patient-meta">{p.age} · {p.gender} · {p.chief_complaint}</div>
        </div>
        <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
          <div className={`priority-badge ${p.priority_level}`}>{p.priority_level}</div>
          <div className="score-text">Score: {p.priority_score}/100</div>
        </div>
      </div>

      <div className="card-meta-row">
        <span className="card-token">🎫 {p.token}</span>
        <span className="card-wait">⏱ Wait: <strong>{waitTime}</strong></span>
        <span className="card-wait-mins">In queue: {p.wait_mins}m</span>
      </div>

      <div className="vitals-row">
        <span className={hrSt(v.heart_rate)==='alert'?'vital-alert':hrSt(v.heart_rate)==='warn'?'vital-warn':''}>HR {v.heart_rate}</span>
        <span className={bpSt(v.systolic_bp)==='alert'?'vital-alert':bpSt(v.systolic_bp)==='warn'?'vital-warn':''}>BP {v.systolic_bp}</span>
        <span className={o2St(v.spo2)==='alert'?'vital-alert':o2St(v.spo2)==='warn'?'vital-warn':''}>SpO₂ {v.spo2}%</span>
        <span className={tmpSt(v.temperature)==='alert'?'vital-alert':tmpSt(v.temperature)==='warn'?'vital-warn':''}>Temp {v.temperature}°</span>
        <span className={rrSt(v.respiratory_rate)==='alert'?'vital-alert':rrSt(v.respiratory_rate)==='warn'?'vital-warn':''}>RR {v.respiratory_rate}</span>
      </div>

      <div className="card-footer">
        <button className="btn-discharge" onClick={e=>{e.stopPropagation();onDischarge(p.id);}}>Discharge</button>
      </div>
    </div>
  );
}

const hrSt=v=>(v<50||v>130)?'alert':(v<60||v>110)?'warn':'ok';
const bpSt=v=>(v<80||v>180)?'alert':(v<90||v>160)?'warn':'ok';
const o2St=v=>v<88?'alert':v<94?'warn':'ok';
const tmpSt=v=>(v>40||v<35)?'alert':(v>39||v<35.5)?'warn':'ok';
const rrSt=v=>(v<8||v>30)?'alert':(v<12||v>24)?'warn':'ok';