export type Signal={type:string,value?:number,text?:string};
export type RiskResult={level:'routine'|'watch'|'urgent';reasons:string[]};
export function assessMaternalRisk(signals:Signal[]):RiskResult{
 const reasons:string[]=[]; let urgent=false; let watch=false;
 const bp=signals.find(s=>s.type==='bp')?.value;
 const text=signals.filter(s=>s.text).map(s=>s.text!.toLowerCase()).join(' ');
 if(bp && bp>=140){urgent=true;reasons.push('Elevated blood-pressure reading requires prompt clinical review.');}
 if(/severe headache|blurred vision|vaginal bleeding|reduced fetal movement|difficulty breathing/.test(text)){urgent=true;reasons.push('A configured maternal warning symptom was reported.');}
 if(/swelling|dizzy|dizziness|nausea|pain/.test(text)){watch=true;reasons.push('New symptom change recorded for follow-up.');}
 if(urgent)return{level:'urgent',reasons};
 if(watch)return{level:'watch',reasons};
 return{level:'routine',reasons:['No configured escalation rule was triggered by this demo input.']};
}