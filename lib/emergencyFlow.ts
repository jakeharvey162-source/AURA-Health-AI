export type EmergencyScenario='labour'|'bleeding'|'breathing'|'fainting'|'other';
export type EmergencyRegion='za'|'other';
export const emergencyNumbers:Record<EmergencyRegion,string|null>={za:'112',other:null};
export function validEmergencyNumber(value:string):boolean{
 return /^\+?[0-9][0-9 -]{1,17}[0-9]$/.test(value.trim());
}
export function emergencyDialLink(region:EmergencyRegion,otherNumber=''):string|null{
 const number=region==='za'?'112':otherNumber.trim();
 return validEmergencyNumber(number)?'tel:'+number.replace(/[^0-9+]/g,''):null;
}
export type EmergencyReport={
 createdAt:string;
 scenario:EmergencyScenario;
 symptoms:string;
 pregnancyWeeks?:number;
 bloodPressure?:string;
 coordinates?:{latitude:number;longitude:number};
};
export function prepareEmergencyReport(x:EmergencyReport):string{
 const clean=(value:string)=>value.replace(/[\r\n\t]+/g,' ').slice(0,900).trim();
 const cases:Record<EmergencyScenario,string>={
  labour:'Patient reports possible labour or painful contractions (not clinically confirmed).',
  bleeding:'Patient reports bleeding (amount and cause not clinically confirmed).',
  breathing:'Patient reports breathing difficulty.',
  fainting:'Patient reports collapse or loss of consciousness.',
  other:'Patient requests urgent help; details are not clinically verified.'
 };
 const lines=[
  'AURA EMERGENCY HANDOFF — PATIENT REPORTED / NOT VERIFIED',
  'Created: '+clean(x.createdAt),
  'Reported concern: '+cases[x.scenario],
  'Other patient-entered symptoms: '+(clean(x.symptoms)||'Not provided'),
  'Pregnancy: '+(x.pregnancyWeeks!==undefined && Number.isInteger(x.pregnancyWeeks)&&x.pregnancyWeeks>=1&&x.pregnancyWeeks<=45?x.pregnancyWeeks+' weeks (patient entered)':'Not provided'),
  'Blood pressure: '+(x.bloodPressure?clean(x.bloodPressure)+' (patient entered)':'Not provided'),
  'Location: '+(x.coordinates&&Number.isFinite(x.coordinates.latitude)&&Number.isFinite(x.coordinates.longitude)?x.coordinates.latitude.toFixed(5)+', '+x.coordinates.longitude.toFixed(5)+' (approximate, permission granted)':'Not provided'),
  'Status: Not sent to ambulance or hospital by AURA.',
  'This summary is not a diagnosis. Confirm details with patient and clinician.'
 ];
 return lines.join('\n');
}
