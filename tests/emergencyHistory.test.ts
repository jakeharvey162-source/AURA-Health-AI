import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {prepareRecentCheckins} from '../lib/emergencyHistory';
import {prepareEmergencyReport} from '../lib/emergencyFlow';
import type {LocalEvent} from '../lib/offline';

const event=(createdAt:string,symptom:string,bp?:unknown):LocalEvent=>({
 id:createdAt,createdAt,kind:'health-signal',sync:'pending',
 payload:{symptom,bloodPressure:bp,internalSecret:'never-export-private-metadata'}
});
test('SOS report can include only three locally saved check-ins, newest first',()=>{
 const events=[
  event('2026-10-07T12:00:00.000Z','older'),
  event('2026-10-10T12:00:00.000Z','recent',{systolic:140,diastolic:90}),
  event('2026-10-08T12:00:00.000Z','middle'),
  event('2026-10-06T12:00:00.000Z','oldest'),
 ];
 const recent=prepareRecentCheckins(events);
 assert.equal(recent.length,3);
 assert.equal(recent[0].symptom,'recent');
 assert.equal(recent[0].bloodPressure,'140/90 mmHg');
 const report=prepareEmergencyReport({createdAt:'2026-10-10T12:05:00.000Z',scenario:'labour',symptoms:'pain',recentCheckins:recent});
 assert.match(report,/Recent patient-entered local check-ins/);
 assert.match(report,/140\/90 mmHg/);
 assert.doesNotMatch(report,/oldest|never-export-private-metadata/);
 assert.match(report,/Not sent to ambulance or hospital/);
});
test('SOS excludes invalid blood-pressure values, unrelated events and malformed data',()=>{
 const rows=[
  event('2026-10-10T12:00:00.000Z','stomach pain\nnew line',{systolic:90,diastolic:110}),
  {...event('2026-10-09T12:00:00.000Z','not health'),kind:'other'} as LocalEvent,
  event('not a timestamp','invalid')
 ];
 const recent=prepareRecentCheckins(rows);
 assert.equal(recent.length,1);
 assert.equal(recent[0].bloodPressure,undefined);
 assert.doesNotMatch(recent[0].symptom,/\n/);
 assert.equal(prepareEmergencyReport({createdAt:'2026-10-10T12:00:00.000Z',scenario:'other',symptoms:''}).includes('Not included by patient'),true);
});
