import {openDb,type LocalEvent} from './offline';

export type RecentCheckin={at:string;symptom:string;bloodPressure?:string};
export function prepareRecentCheckins(events:LocalEvent[],maxItems=3):RecentCheckin[]{
 if(!Array.isArray(events))return [];
 return events.filter(e=>e&&e.kind==='health-signal'&&typeof e.createdAt==='string'&&
    Number.isFinite(Date.parse(e.createdAt)))
   .sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))
   .slice(0,Math.max(0,Math.min(maxItems,5)))
   .map(event=>{
     const payload=event.payload && typeof event.payload==='object' ?
       event.payload as Record<string,unknown>:{};
     const symptom=typeof payload.symptom==='string'
       ?payload.symptom.replace(/[\r\n\t]/g,' ').slice(0,170):'Not provided';
     const bp=payload.bloodPressure && typeof payload.bloodPressure==='object'
       ?payload.bloodPressure as Record<string,unknown>:{};
     const systolic=bp.systolic,diastolic=bp.diastolic;
     const valid=typeof systolic==='number'&&Number.isFinite(systolic)&&systolic>=40&&systolic<=300&&
       typeof diastolic==='number'&&Number.isFinite(diastolic)&&diastolic>=20&&diastolic<=200&&systolic>diastolic;
     return {at:event.createdAt,symptom,bloodPressure:valid?`${systolic}/${diastolic} mmHg`:undefined};
   });
}
export async function readRecentLocalCheckins():Promise<RecentCheckin[]>{
 const db=await openDb();
 try{
   const rows=await new Promise<LocalEvent[]>((resolve,reject)=>{
     const tx=db.transaction('events','readonly');
     const request=tx.objectStore('events').getAll();
     request.onsuccess=()=>resolve(request.result as LocalEvent[]);
     request.onerror=()=>reject(request.error);
   });
   return prepareRecentCheckins(rows);
 }finally{db.close()}
}
