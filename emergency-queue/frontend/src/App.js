import React, { useState, useEffect, useCallback } from 'react';
import PatientCard from './components/PatientCard';
import AdmitForm from './components/AdmitForm';
import StatsBar from './components/StatsBar';
import SuccessModal from './components/SuccessModal';
import DoctorDashboard from './components/DoctorDashboard';
import LiveFeed from './components/LiveFeed';
import './App.css';

function calculatePriorityScore(v) {
  let score = 0;
  const hr=Number(v.heart_rate),sbp=Number(v.systolic_bp),spo2=Number(v.spo2),
        temp=Number(v.temperature),rr=Number(v.respiratory_rate),gcs=Number(v.gcs_score);
  if(spo2<85)score+=40;else if(spo2<90)score+=30;else if(spo2<94)score+=15;
  if(hr<40||hr>150)score+=35;else if(hr<50||hr>130)score+=20;else if(hr<60||hr>110)score+=8;
  if(sbp<70||sbp>200)score+=35;else if(sbp<80||sbp>180)score+=22;else if(sbp<90||sbp>160)score+=10;
  if(temp>40||temp<35)score+=20;else if(temp>39||temp<35.5)score+=10;else if(temp>38.5)score+=5;
  if(rr<8||rr>30)score+=25;else if(rr<10||rr>25)score+=12;else if(rr<12||rr>20)score+=5;
  if(gcs<=8)score+=30;else if(gcs<=12)score+=15;else if(gcs<15)score+=5;
  return Math.min(score,100);
}

function scoreToPriority(s){
  return s>=60?'critical':s>=35?'high':s>=15?'medium':'low';
}

const AVG_SERVICE={critical:5,high:12,medium:20,low:30};
export function estimateWaitTime(patient,allPatients){
  const ahead=allPatients.filter(p=>p.id!==patient.id&&p.priority_score>=patient.priority_score);
  const mins=ahead.reduce((s,p)=>s+AVG_SERVICE[p.priority_level],0);
  if(mins===0)return'Next up';
  if(mins<60)return`~${mins} min`;
  return`~${Math.floor(mins/60)}h ${mins%60}m`;
}

const TPFX={critical:'CR',high:'HI',medium:'ME',low:'LO'};
const TCNT={critical:0,high:0,medium:0,low:0};
function genToken(pri){TCNT[pri]++;return`${TPFX[pri]}-${String(TCNT[pri]).padStart(3,'0')}`;}

let nextId=1;
const clamp=(v,a,b)=>Math.round(Math.max(a,Math.min(b,v)));
const rand=(lo,hi)=>Math.random()*(hi-lo)+lo;

export default function App(){
  const[patients,setPatients]=useState([]);
  const[selected,setSelected]=useState(null);
  const[showForm,setShowForm]=useState(false);
  const[successData,setSuccessData]=useState(null);
  const[filter,setFilter]=useState('all');
  const[activeTab,setActiveTab]=useState('queue');
  const[liveFeed,setLiveFeed]=useState([]);
  const[clock,setClock]=useState('');

  useEffect(()=>{
    const tick=()=>setClock(new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    tick();const t=setInterval(tick,1000);return()=>clearInterval(t);
  },[]);

  const pushFeed=useCallback((msg,type='info')=>{
    setLiveFeed(prev=>[{id:Date.now(),time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),msg,type},...prev].slice(0,30));
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setPatients(prev=>{
        const updated=prev.map(p=>{
          const v={...p.vitals};
          v.heart_rate=clamp(v.heart_rate+rand(-4,4),30,200);
          v.systolic_bp=clamp(v.systolic_bp+rand(-5,5),50,230);
          v.spo2=clamp(v.spo2+rand(-1,1),70,100);
          v.temperature=+Math.max(33,Math.min(42,v.temperature+rand(-0.1,0.1))).toFixed(1);
          v.respiratory_rate=clamp(v.respiratory_rate+rand(-2,2),5,40);
          const score=calculatePriorityScore(v);
          const priority=scoreToPriority(score);
          if(priority!==p.priority_level&&score>p.priority_score)
            pushFeed(`🔴 ${p.name} escalated → ${priority.toUpperCase()} (Score ${score})`,'alert');
          return{...p,vitals:v,priority_score:score,priority_level:priority,wait_mins:(p.wait_mins||0)+1};
        });
        return updated.sort((a,b)=>b.priority_score-a.priority_score);
      });
    },4000);
    return()=>clearInterval(iv);
  },[pushFeed]);

  const handleAdmit=(formData)=>{
    const score=calculatePriorityScore(formData);
    const priority=scoreToPriority(score);
    const token=genToken(priority);
    const patient={
      id:nextId++,token,name:formData.name,age:formData.age,gender:formData.gender,
      chief_complaint:formData.chief_complaint,
      vitals:{
        heart_rate:+formData.heart_rate,systolic_bp:+formData.systolic_bp,
        spo2:+formData.spo2,temperature:+formData.temperature,
        respiratory_rate:+formData.respiratory_rate,gcs_score:+formData.gcs_score
      },
      priority_score:score,priority_level:priority,
      admitted_at:new Date().toISOString(),wait_mins:0,
    };
    setPatients(prev=>[...prev,patient].sort((a,b)=>b.priority_score-a.priority_score));
    setShowForm(false);setSuccessData(patient);setSelected(patient);
    pushFeed(`✅ ${patient.name} admitted — Token ${token} — ${priority.toUpperCase()}`,'admit');
  };

  const handleDischarge=(id)=>{
    const p=patients.find(x=>x.id===id);
    setPatients(prev=>prev.filter(x=>x.id!==id));
    if(selected?.id===id)setSelected(null);
    if(p)pushFeed(`🏁 ${p.name} (${p.token}) discharged`,'discharge');
  };

  const visible=filter==='all'?patients:patients.filter(p=>p.priority_level===filter);
  const counts={
    critical:patients.filter(p=>p.priority_level==='critical').length,
    high:patients.filter(p=>p.priority_level==='high').length,
    medium:patients.filter(p=>p.priority_level==='medium').length,
    low:patients.filter(p=>p.priority_level==='low').length,
  };
  const liveSelected=selected?patients.find(p=>p.id===selected.id)||selected:null;

  return(
    <div className="app">
      <div className="header">
        <div className="header-left">
          <div className="header-logo">🏥 EMERQ · Patient Queue System</div>
          <div className="nav-tabs">
            <button className={`nav-tab${activeTab==='queue'?' active':''}`} onClick={()=>setActiveTab('queue')}>Queue</button>
            <button className={`nav-tab${activeTab==='dashboard'?' active':''}`} onClick={()=>setActiveTab('dashboard')}>Doctor Dashboard</button>
          </div>
        </div>
        <div className="header-right">
          <span className="live-badge">● LIVE</span>
          <span className="clock">{clock}</span>
          <button className="btn-admit" onClick={()=>setShowForm(true)}>+ Admit Patient</button>
        </div>
      </div>

      <StatsBar counts={counts} total={patients.length}/>

      {activeTab==='queue'?(
        <div className="main-layout">
          <div className="queue-panel">
            <div className="panel-header">
              <span className="panel-title">Patient Queue — Sorted by Priority Score</span>
              <div className="filter-tabs">
                {['all','critical','high','medium','low'].map(f=>(
                  <button key={f} className={`tab${filter===f?' active':''}`} onClick={()=>setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            {patients.length===0&&<p className="empty-text">No patients. Click "+ Admit Patient" to begin.</p>}
            {visible.map(p=>(
              <PatientCard key={p.id} patient={p} waitTime={estimateWaitTime(p,patients)}
                selected={selected?.id===p.id} onClick={()=>setSelected(p)} onDischarge={handleDischarge}/>
            ))}
          </div>
          <div className="right-column">
            <div className="detail-panel">
              {liveSelected
                ?<PatientDetail patient={liveSelected} allPatients={patients}/>
                :<p className="no-selection">📋 Select a patient to view details</p>}
            </div>
            <LiveFeed feed={liveFeed}/>
          </div>
        </div>
      ):(
        <DoctorDashboard patients={patients} onDischarge={handleDischarge} estimateWait={estimateWaitTime}/>
      )}

      {showForm&&<AdmitForm onSubmit={handleAdmit} onClose={()=>setShowForm(false)}/>}
      {successData&&<SuccessModal patient={successData} allPatients={patients} onClose={()=>setSuccessData(null)}/>}
    </div>
  );
}

function PatientDetail({patient:p,allPatients}){
  const v=p.vitals;
  const wait=estimateWaitTime(p,allPatients);
  const sc={critical:'#ff4757',high:'#ff8c42',medium:'#ffd32a',low:'#2ed573'}[p.priority_level];
  return(
    <div className="detail-content">
      <div className="detail-top">
        <div>
          <div className="detail-name">{p.name}</div>
          <div className="detail-meta">{p.age} yrs · {p.gender} · ID #{p.id}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className={`priority-badge ${p.priority_level}`}>{p.priority_level}</div>
          <div className="token-pill">🎫 {p.token}</div>
        </div>
      </div>
      <div className="complaint-box">📋 {p.chief_complaint}</div>
      <div className="wait-box">
        <span className="wait-label">⏱ Estimated Wait</span>
        <span className="wait-val" style={{color:sc}}>{wait}</span>
      </div>
      <div className="score-wrap">
        <div className="score-row">
          <span style={{color:'#7a9ab8',fontSize:12}}>Priority Score</span>
          <span style={{color:sc,fontWeight:700}}>{p.priority_score} / 100</span>
        </div>
        <div className="score-track"><div className="score-fill" style={{width:`${p.priority_score}%`,background:sc}}/></div>
      </div>
      <div className="vitals-label">Live Vitals</div>
      <div className="vitals-detail-grid">
        <VBox label="Heart Rate" val={v.heart_rate} unit="bpm" st={hrSt(v.heart_rate)}/>
        <VBox label="Systolic BP" val={v.systolic_bp} unit="mmHg" st={bpSt(v.systolic_bp)}/>
        <VBox label="SpO₂" val={v.spo2} unit="%" st={o2St(v.spo2)}/>
        <VBox label="Temperature" val={v.temperature} unit="°C" st={tmpSt(v.temperature)}/>
        <VBox label="Resp. Rate" val={v.respiratory_rate} unit="bpm" st={rrSt(v.respiratory_rate)}/>
        <VBox label="GCS" val={v.gcs_score} unit="/15" st={gcsSt(v.gcs_score)}/>
      </div>
      <div className="admit-time">Admitted: {new Date(p.admitted_at).toLocaleString()}</div>
    </div>
  );
}

function VBox({label,val,unit,st}){
  const c=st==='alert'?'#ff4757':st==='warn'?'#ff8c42':'#2ed573';
  const bg=st==='alert'?'rgba(255,71,87,0.08)':st==='warn'?'rgba(255,140,66,0.08)':'#131b27';
  const bd=st==='alert'?'rgba(255,71,87,0.3)':st==='warn'?'rgba(255,140,66,0.3)':'#1e2d42';
  return(
    <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:8,padding:'10px 12px'}}>
      <div style={{fontSize:10,color:'#7a9ab8',textTransform:'uppercase',marginBottom:4}}>{label}</div>
      <div style={{fontSize:19,fontWeight:700,color:c,fontFamily:'monospace'}}>{val}<span style={{fontSize:11,color:'#7a9ab8',marginLeft:3}}>{unit}</span></div>
      <div style={{fontSize:10,color:c,marginTop:3}}>{st==='alert'?'↑ Alert':st==='warn'?'⚠ Warn':'✓ OK'}</div>
    </div>
  );
}

const hrSt=v=>(v<50||v>130)?'alert':(v<60||v>110)?'warn':'ok';
const bpSt=v=>(v<80||v>180)?'alert':(v<90||v>160)?'warn':'ok';
const o2St=v=>v<88?'alert':v<94?'warn':'ok';
const tmpSt=v=>(v>40||v<35)?'alert':(v>39||v<35.5)?'warn':'ok';
const rrSt=v=>(v<8||v>30)?'alert':(v<12||v>24)?'warn':'ok';
const gcsSt=v=>v<=8?'alert':v<=12?'warn':'ok';