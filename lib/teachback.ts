export type TeachbackResult={status:'waiting'|'match'|'clarify';message:string};
export function checkFollowUpTeachback(text:string,confirmed:boolean):TeachbackResult{
 if(!confirmed)return{status:'waiting',message:'Clinician must confirm the demo plan first.'};
 const normalized=text.trim().toLowerCase();
 if(!normalized)return{status:'waiting',message:'Waiting for patient teach-back.'};
 // Reject explicit negation and contradictory timing; never silently certify an ambiguous answer.
 if(/\b(no|not|never|instead|rather than|don't|do not)\b/.test(normalized))return{status:'clarify',message:'Please confirm the follow-up timing with the clinician.'};
 const matches=[...normalized.matchAll(/\b(\d+|one|two|three|four)\s*(day|days|week|weeks|month|months)\b/g)];
 const numbers:Record<string,number>={one:1,two:2,three:3,four:4};
 const durations=matches.map(m=>({value:numbers[m[1]]??Number(m[1]),unit:m[2]}));
 if(durations.length!==1)return{status:'clarify',message:'Please state one clear follow-up time: 2 weeks.'};
 const d=durations[0];
 if(d.value===2&&/^weeks?$/.test(d.unit))return{status:'match',message:'Follow-up timing matches the confirmed demo plan (2 weeks).'};
 return{status:'clarify',message:'Needs clarification: the confirmed follow-up is in 2 weeks.'};
}
