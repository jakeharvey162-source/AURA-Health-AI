'use client';
import {useState} from 'react';
import {AlertTriangle,PhoneCall,MapPin,ClipboardCopy,CheckCircle2,X,ShieldAlert,Download} from 'lucide-react';
import {emergencyDialLink,prepareEmergencyReport,type EmergencyRegion,type EmergencyScenario} from '../lib/emergencyFlow';
import type {AuraLocale} from '../lib/i18n';
import {readRecentLocalCheckins,type RecentCheckin} from '../lib/emergencyHistory';

type Props={locale:AuraLocale;symptoms:string;pregnancyWeeks?:number;bloodPressure?:string;onClose:()=>void};
const labels={
 en:{title:'Emergency help',intro:'If you or someone nearby may be in danger, use the emergency number. AURA cannot call or dispatch an ambulance automatically.',choose:'What is happening?',labour:'Possible labour / painful contractions',bleeding:'Bleeding',breathing:'Trouble breathing',fainting:'Fainted or unresponsive',other:'Something else / unsure',region:'Where are you calling from?',southAfrica:'South Africa — 112',otherRegion:'Another country',number:'Enter the official local emergency number',call:'Open emergency dialer',noNumber:'Use your phone’s built-in Emergency SOS or local emergency number.',location:'Add my location (optional)',locationStatus:'AURA has not accessed your location.',locationError:'Location unavailable or permission denied. Tell the operator your address.',locationSaved:'Approximate location added to your handoff. It has not been sent.',summary:'Patient-entered emergency summary',consent:'I agree to put this information on my clipboard / device share sheet. I will choose whom to send it to.',copy:'Copy summary',share:'Share with chosen person',copied:'Summary copied. It has NOT been sent to a hospital.',notCopied:'Clipboard permission was blocked. Select and copy the summary manually.',notShared:'AURA has not sent anything to an ambulance or hospital. Only share with a trusted, verified healthcare provider or emergency responder.',closed:'Close emergency panel',explanation:'When does AURA send the hospital my report?',answer:'Never automatically in this prototype. A verified hospital connection, lawful data-sharing basis, patient consent or valid emergency legal basis, and confirmed delivery are required before a system can claim transmission.',warning:'Call first. Do not delay urgent help to fill in this form.',none:'Do not enter real patient information in this demo.',recent:'Include recent check-ins from this device (optional)',recentWarning:'Only check-ins previously saved on this device can be added. Confirm details with a clinician.',recentLoaded:'Recent local entries added (not shared).',recentError:'Saved entries are unavailable; the emergency report still works.',download:'Save report as text file',downloaded:'Report saved to this device. It has NOT been sent to a hospital.'},
 fr:{title:'Aide urgente',intro:'En cas de danger, utilisez le numéro des secours. AURA ne peut pas appeler ni envoyer une ambulance automatiquement.',choose:'Que se passe-t-il ?',labour:'Accouchement possible / contractions douloureuses',bleeding:'Saignement',breathing:'Difficulté à respirer',fainting:'Perte de connaissance',other:'Autre situation / incertitude',region:'D’où appelez-vous ?',southAfrica:'Afrique du Sud — 112',otherRegion:'Autre pays',number:'Entrez le numéro officiel des secours',call:'Ouvrir le téléphone',noNumber:'Utilisez la fonction SOS du téléphone ou le numéro des secours local.',location:'Ajouter ma position (facultatif)',locationStatus:'AURA n’a pas accédé à votre position.',locationError:'Position indisponible. Donnez votre adresse à l’opérateur.',locationSaved:'Position approximative ajoutée au résumé. Rien n’a été envoyé.',summary:'Résumé d’urgence saisi par le patient',consent:'J’autorise la copie ou le partage de ce résumé sur mon appareil. Je choisis le destinataire.',copy:'Copier le résumé',share:'Partager avec un destinataire choisi',copied:'Résumé copié. Rien n’a été envoyé à un hôpital.',notCopied:'La copie est bloquée. Copiez manuellement le résumé.',notShared:'AURA n’a envoyé aucune donnée à une ambulance ou un hôpital. Ne partagez qu’avec un professionnel ou secouriste vérifié.',closed:'Fermer l’aide urgente',explanation:'Quand AURA envoie-t-il mon dossier à l’hôpital ?',answer:'Jamais automatiquement dans ce prototype. Une connexion hospitalière vérifiée, une base légale valable et une preuve de livraison seraient nécessaires.',warning:'Appelez en premier. Ne retardez pas les secours pour remplir ce formulaire.',none:'N’utilisez pas de véritables données de patient dans cette démo.',recent:'Inclure les derniers bilans enregistrés sur cet appareil (facultatif)',recentWarning:'Seuls les bilans enregistrés sur cet appareil peuvent être ajoutés. Vérifiez avec un professionnel.',recentLoaded:'Bilans locaux ajoutés (non envoyés).',recentError:'Bilans indisponibles ; le résumé d’urgence reste accessible.',download:'Enregistrer le résumé en texte',downloaded:'Résumé enregistré sur votre appareil. Rien n’a été envoyé à un hôpital.'},
 zu:{title:'Usizo oluphuthumayo',intro:'Uma kukhona ingozi, sebenzisa inombolo yezimo eziphuthumayo. I-AURA ayikwazi ukufonela noma ukuthumela i-ambulensi ngokuzenzakalela.',choose:'Kwenzekani?',labour:'Kungenzeka ngiyabeletha / izinhlungu zokubeletha',bleeding:'Ukopha',breathing:'Kunzima ukuphefumula',fainting:'Ukuquleka noma ukungaphenduli',other:'Okunye / angiqiniseki',region:'Ufonela ukuphi?',southAfrica:'INingizimu Afrika — 112',otherRegion:'Elinye izwe',number:'Faka inombolo yezimo eziphuthumayo yakuleyo ndawo',call:'Vula ifoni yosizo',noNumber:'Sebenzisa i-Emergency SOS yefoni noma inombolo yosizo yakini.',location:'Faka indawo yami (uma ngivuma)',locationStatus:'I-AURA ayikayisebenzisi indawo yakho.',locationError:'Indawo ayitholakali. Tshela osefonini ikheli lakho.',locationSaved:'Indawo eseduze ifakiwe embikweni. Akukho okuthunyelwe.',summary:'Umbiko ophuthumayo ofakwe isiguli',consent:'Ngiyavuma ukukopisha noma ukwabelana ngalo mbiko kudivayisi yami. Ngizokhetha ozowuthola.',copy:'Kopisha umbiko',share:'Yabelana nomuntu engimkhethayo',copied:'Umbiko ukopishiwe. Awukathunyelwa esibhedlela.',notCopied:'Ukukopisha kuvinjiwe. Kopisha umbiko ngesandla.',notShared:'I-AURA ayikathumeli lutho ku-ambulensi noma esibhedlela. Yabelana kuphela nabezempilo abaqinisekisiwe.',closed:'Vala usizo oluphuthumayo',explanation:'I-AURA ithumela nini umbiko wami esibhedlela?',answer:'Ayithumeli ngokuzenzakalela kulesi sibonelo. Kudingeka isibhedlela esiqinisekisiwe, isisekelo somthetho, nesiqinisekiso sokwamukelwa.',warning:'Shayela kuqala. Ungalibazisi ukufuna usizo ngenxa yaleli fomu.',none:'Ungafaki imininingwane yangempela yesiguli kulesi sibonelo.',recent:'Faka imibiko yakamuva egcinwe kule foni (uma ngivuma)',recentWarning:'Kufakwa kuphela imininingwane egcinwe kule divayisi. Qinisekisa nodokotela.',recentLoaded:'Imininingwane yedivayisi ifakiwe (ayithunyelwanga).',recentError:'Imibiko egciniwe ayitholakali; umbiko ophuthumayo usekhona.',download:'Londoloza umbiko njengefayela',downloaded:'Umbiko ulondoloziwe kule divayisi. Awukathunyelwa esibhedlela.'}
} as const;
const scenarios:EmergencyScenario[]=['labour','bleeding','breathing','fainting','other'];
export default function EmergencyPanel({locale,symptoms,pregnancyWeeks,bloodPressure,onClose}:Props){
 const t=labels[locale];
 const [scenario,setScenario]=useState<EmergencyScenario>('other');
 const [region,setRegion]=useState<EmergencyRegion>('za');
 const [customNumber,setCustomNumber]=useState('');
 const [coords,setCoords]=useState<{latitude:number;longitude:number}|undefined>();
 const [locationStatus,setLocationStatus]=useState<string>(t.locationStatus);
 const [consent,setConsent]=useState(false);
 const [includeRecent,setIncludeRecent]=useState(false);
 const [recentHistory,setRecentHistory]=useState<RecentCheckin[]>([]);
 const [recentStatus,setRecentStatus]=useState('');
 const [deliveryStatus,setDeliveryStatus]=useState('');
 const [openedAt]=useState(()=>new Date().toISOString());
 const dial=emergencyDialLink(region,customNumber);
 const report=prepareEmergencyReport({createdAt:openedAt,scenario,symptoms,pregnancyWeeks,bloodPressure,coordinates:coords,recentCheckins:includeRecent?recentHistory:[]});
 async function changeRecent(value:boolean){
  setIncludeRecent(value);setRecentStatus('');
  if(!value){setRecentHistory([]);return;}
  try{const recent=await readRecentLocalCheckins();setRecentHistory(recent);setRecentStatus(t.recentLoaded)}
  catch{setRecentHistory([]);setRecentStatus(t.recentError)}
 }
 function downloadReport(){
  if(!consent)return;
  const blob=new Blob([report],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='aura-emergency-handoff.txt';document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1500);
  setDeliveryStatus(t.downloaded);
 }
 async function copyReport(){
  if(!consent)return;
  try{await navigator.clipboard.writeText(report);setDeliveryStatus(t.copied)}
  catch{setDeliveryStatus(t.notCopied)}
 }
 async function shareReport(){
  if(!consent)return;
  if(typeof navigator.share==='function'){
   try{await navigator.share({title:'AURA patient-entered emergency report',text:report});setDeliveryStatus(t.notShared)}
   catch{setDeliveryStatus(t.notShared)}
  }else await copyReport();
 }
 function requestLocation(){
  if(!navigator.geolocation){setLocationStatus(t.locationError);return}
  navigator.geolocation.getCurrentPosition(
   pos=>{setCoords({latitude:pos.coords.latitude,longitude:pos.coords.longitude});setLocationStatus(t.locationSaved)},
   ()=>setLocationStatus(t.locationError),
   {enableHighAccuracy:false,timeout:9000,maximumAge:0}
  );
 }
 return <section className="aura-emergency-panel" role="dialog" aria-modal="true" aria-labelledby="aura-emergency-title">
  <div className="aura-emergency-head"><div><span className="aura-emergency-eyebrow"><AlertTriangle size={17}/> AURA / EMERGENCY MODE</span><h2 id="aura-emergency-title">{t.title}</h2></div><button className="aura-emergency-close" aria-label={t.closed} onClick={onClose}><X size={24}/></button></div>
  <p className="aura-emergency-lead">{t.intro}</p>
  <p className="aura-emergency-priority" role="alert"><ShieldAlert size={20}/>{t.warning}</p>
  <div className="aura-emergency-field"><strong>{t.region}</strong><div className="aura-emergency-options"><label><input type="radio" name="aura-emergency-region" checked={region==='za'} onChange={()=>setRegion('za')}/>{t.southAfrica}</label><label><input type="radio" name="aura-emergency-region" checked={region==='other'} onChange={()=>setRegion('other')}/>{t.otherRegion}</label></div>{region==='other'&&<input className="input" aria-label={t.number} inputMode="tel" placeholder={t.number} value={customNumber} onChange={e=>setCustomNumber(e.target.value)}/>}</div>
  {dial?<a className="aura-emergency-call" href={dial} aria-label={t.call+' '+(region==='za'?'112':customNumber)}><PhoneCall size={23}/><span>{t.call} · {region==='za'?'112':customNumber}</span></a>:<p role="status" className="aura-emergency-priority">{t.noNumber}</p>}
  <div className="aura-emergency-field"><strong>{t.choose}</strong><div className="aura-emergency-scenarios">{scenarios.map(kind=><button type="button" aria-pressed={scenario===kind} key={kind} onClick={()=>setScenario(kind)}>{t[kind]}</button>)}</div></div>
  <div className="aura-emergency-location"><button type="button" className="btn secondary" onClick={requestLocation}><MapPin size={18}/>{t.location}</button><p role="status">{locationStatus}</p></div>
  <div className="aura-emergency-handoff"><h3>{t.summary}</h3><p>{t.none}</p><label className="aura-emergency-consent"><input type="checkbox" checked={includeRecent} onChange={e=>void changeRecent(e.target.checked)}/>{t.recent}</label><p>{t.recentWarning}</p>{recentStatus&&<p role="status">{recentStatus}</p>}<pre lang="en" aria-label="Emergency patient summary">{report}</pre><label className="aura-emergency-consent"><input type="checkbox" checked={consent} onChange={e=>{setConsent(e.target.checked);setDeliveryStatus('')}}/>{t.consent}</label><div className="aura-emergency-actions"><button type="button" className="btn secondary" disabled={!consent} onClick={copyReport}><ClipboardCopy size={18}/>{t.copy}</button><button type="button" className="btn secondary" disabled={!consent} onClick={shareReport}><CheckCircle2 size={18}/>{t.share}</button><button type="button" className="btn secondary" disabled={!consent} onClick={downloadReport}><Download size={18}/>{t.download}</button></div>{deliveryStatus&&<p role="status">{deliveryStatus}</p>}<p className="aura-emergency-not-sent">{t.notShared}</p></div>
  <details className="aura-emergency-details"><summary>{t.explanation}</summary><p>{t.answer}</p></details>
 </section>;
}
