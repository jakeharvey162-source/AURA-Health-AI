'use client';
import {useMemo,useState} from 'react';
import {Activity,HeartPulse,Mic,ShieldAlert,Stethoscope,Users,Languages,Accessibility} from 'lucide-react';
import {assessMaternalRisk} from '../lib/risk';

type Mode='patient'|'clinician'|'carebridge'|'access';
export default function Home(){
 const [mode,setMode]=useState<Mode>('patient');
 const [symptom,setSymptom]=useState('I have had a severe headache since yesterday and my feet are more swollen.');
 const [bp,setBp]=useState(151);
 const risk=useMemo(()=>assessMaternalRisk([{type:'bp',value:bp},{type:'symptom',text:symptom}]),[bp,symptom]);
 return <main className="wrap">
  <div className="hero"><div><span className="badge">ForgeHacks 2026 · AI + Healthcare</span><h1 className="big">AURA Health AI</h1><p className="muted">An accessible AI health early-warning and care-continuity platform for patients and clinicians.</p></div><div className="card"><div className="muted">Core principle</div><b>Notice changes early. Explain simply. Escalate safely.</b></div></div>
  <div className="nav">
   {([['patient','Patient'],['clinician','Clinician'],['carebridge','CareBridge'],['access','Universal Access']] as const).map(([k,l])=><button key={k} className={mode===k?'active':''} onClick={()=>setMode(k)}>{l}</button>)}
  </div>
  {mode==='patient'&&<div className="grid">
   <section className="card span8"><div className="row"><Mic/><h2>Tell AURA what changed</h2></div><p className="muted">Voice-first by design. Type here for the demo; speech input plugs into the same pipeline.</p><textarea className="input" rows={4} value={symptom} onChange={e=>setSymptom(e.target.value)}/>
   <div style={{height:12}}/><label>Blood pressure systolic</label><input className="input" type="number" value={bp} onChange={e=>setBp(Number(e.target.value))}/>
   <div className="signal"><b>AI signal fusion result:</b><div className="kpi">{risk.level.toUpperCase()}</div>{risk.reasons.map((r,i)=><div key={i} className="muted">• {r}</div>)}</div>
   <div className="row"><button className="btn primary">Save to health timeline</button><button className="btn secondary">Read aloud</button></div></section>
   <aside className={"card span4 "+(risk.level==='urgent'?'emergency':'')}><ShieldAlert/><h2>{risk.level==='urgent'?'Emergency mode ready':'Guardian status'}</h2><p>{risk.level==='urgent'?'AURA would stop casual chat, surface urgent-care actions, and prepare an emergency handoff summary.':'No urgent rule triggered.'}</p>{risk.level==='urgent'&&<button className="btn danger">Open emergency handoff</button>}</aside>
   <section className="card span6"><h3>Personal health baseline</h3><div className="timeline"><div className="item"><span className="dot"/>BP 126/82 · baseline</div><div className="item"><span className="dot"/>BP 137/89 · rising</div><div className="item"><span className="dot"/>BP 151/96 · current</div></div></section>
   <section className="card span6"><h3>Maternal Guardian</h3><p className="muted">Pregnancy + postpartum continuity. Tracks symptoms, vitals, follow-up tasks and clinician-approved care plans without claiming diagnosis.</p></section>
  </div>}
  {mode==='clinician'&&<div className="grid"><section className="card span8"><div className="row"><Stethoscope/><h2>Clinician Command Center</h2></div>{[['Urgent review','31 weeks pregnant · rising BP + severe headache'],['Needs follow-up','Medication side effect reported'],['Routine','Care plan completed']].map((x,i)=><div className="signal" key={i}><b>{x[0]}</b><div className="muted">{x[1]}</div></div>)}</section><aside className="card span4"><h3>Why this reduces overload</h3><p className="muted">AURA summarizes change over time and surfaces why a patient was flagged instead of dumping every message on the clinician.</p></aside></div>}
  {mode==='carebridge'&&<div className="grid"><section className="card span6"><Users/><h2>Clinician confirmation</h2><div className="signal">Medication: clinician confirms dose/frequency</div><div className="signal">Follow-up: 2 weeks</div><button className="btn primary">Confirm care plan</button></section><section className="card span6"><HeartPulse/><h2>Patient teach-back</h2><p className="muted">AURA asks the patient to explain the plan back in their own words. If understanding does not match the approved plan, AURA explains it again and flags the mismatch.</p><button className="btn secondary">Start teach-back</button></section></div>}
  {mode==='access'&&<div className="grid"><section className="card span6"><Languages/><h2>Language + dialect aware</h2><p className="muted">Designed for multilingual and code-switched speech, with low-confidence confirmation instead of silent guessing.</p></section><section className="card span6"><Accessibility/><h2>Universal access</h2><p className="muted">Voice + text, large controls, simple-language mode, screen-reader-friendly structure, high contrast, low-bandwidth fallback and caregiver support.</p></section></div>}
  <footer className="muted" style={{marginTop:28}}>Prototype decision support only. AURA does not diagnose, prescribe, or replace emergency services or qualified clinicians.</footer>
 </main>
}