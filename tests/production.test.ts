import test from 'node:test';import {checkFollowUpTeachback} from '../lib/teachback';import assert from 'node:assert/strict';import {assessMaternalRisk} from '../lib/risk';import {requireEvidence,evidenceIsStale} from '../lib/grounding';import {reviewTranscript} from '../lib/voiceSafety';import {safeBaseline,needsClinicalVerification,type PatientDatum} from '../lib/patientData';import {buildEmergencyHandoff} from '../lib/emergencyHandoff';
test('production maternal rule escalates configured demo pattern',()=>{const r=assessMaternalRisk([{type:'bp',value:151},{type:'symptom',text:'severe headache'}]);assert.equal(r.level,'urgent');assert.ok(r.reasons.length>=1)});
test('routine input does not fabricate urgency',()=>assert.equal(assessMaternalRisk([{type:'symptom',text:'I feel normal today'}]).level,'routine'));
test('grounding abstains without evidence',()=>assert.equal(requireEvidence('answer',[]).status,'abstain'));
test('grounding returns supplied evidence',()=>assert.equal(requireEvidence('answer',[{source:'WHO',version:'demo',retrievedAt:new Date().toISOString(),claim:'approved demo evidence'}]).status,'grounded'));
test('invalid or old evidence is stale',()=>{assert.equal(evidenceIsStale('not-a-date'),true);assert.equal(evidenceIsStale('2020-01-01T00:00:00Z'),true)});
test('medication and dose from speech always require confirmation',()=>{const x=reviewTranscript([{kind:'medication',value:'demo medicine',confidence:.99},{kind:'dose',value:'demo dose',confidence:.99}]);assert.ok(x.every(e=>e.requiresConfirmation))});
test('low-confidence symptom requires confirmation',()=>assert.equal(reviewTranscript([{kind:'symptom',value:'headache',confidence:.5}])[0].requiresConfirmation,true));
test('patient-entered datum requires clinical verification',()=>{const x:PatientDatum={id:'1',source:'patient',type:'symptom',value:'headache',recordedAt:new Date().toISOString(),verified:false};assert.equal(needsClinicalVerification(x),true)});
test('safe baseline excludes unverified patient data',()=>{const a:PatientDatum={id:'1',source:'patient',type:'bp',value:'151/96',recordedAt:'2026-01-01',verified:false};const b:PatientDatum={id:'2',source:'device',type:'bp',value:'126/82',recordedAt:'2026-01-01',verified:true};assert.deepEqual(safeBaseline([a,b]).map(x=>x.id),['2'])});
test('handoff preserves verification notice and supplied facts',()=>{const h=buildEmergencyHandoff({pregnancyWeeks:31,symptoms:['severe headache'],bp:'151/96 mmHg'});assert.match(h.notice,/verification required/i);assert.equal(h.bloodPressure,'151/96 mmHg');assert.deepEqual(h.symptoms,['severe headache'])});

test('nonfinite speech confidence requires confirmation',()=>{for(const confidence of [NaN,Infinity,-Infinity,-0.1,1.1]){assert.equal(reviewTranscript([{kind:'symptom',value:'headache',confidence}])[0].requiresConfirmation,true)}});
test('spoken measurements require confirmation even at high confidence',()=>{assert.equal(reviewTranscript([{kind:'measurement',value:'blood pressure reading',confidence:1}])[0].requiresConfirmation,true)});

test('handoff does not present invalid pregnancy weeks as clinical fact',()=>{for(const weeks of [NaN,-2,Infinity,50]){assert.equal(buildEmergencyHandoff({pregnancyWeeks:weeks,symptoms:[]}).pregnancy,'Not provided')}});

test('spoken medication frequency requires explicit confirmation',()=>{assert.equal(reviewTranscript([{kind:'frequency',value:'twice daily',confidence:1}])[0].requiresConfirmation,true)});

test('diastolic-only elevated reading triggers configured review',()=>{const r=assessMaternalRisk([{type:'bp',value:125},{type:'bp_diastolic',value:96}]);assert.equal(r.level,'urgent')});
test('invalid BP does not get labelled routine',()=>{for(const value of [NaN,Infinity,-1,0,999]){const r=assessMaternalRisk([{type:'bp',value},{type:'bp_diastolic',value:80}]);assert.equal(r.level,'watch');assert.match(r.reasons.join(' '),/invalid/i)}});

test('CareBridge accepts exactly two weeks only after confirmation',()=>{assert.equal(checkFollowUpTeachback('I will return in two weeks',true).status,'match');assert.equal(checkFollowUpTeachback('follow up in 2 weeks',true).status,'match');assert.equal(checkFollowUpTeachback('in two weeks',false).status,'waiting')});
test('CareBridge rejects negated, contradictory and ambiguous timing',()=>{for(const phrase of ['not in two weeks','in three weeks','in 2 days','in 2 weeks or 3 weeks','I will return soon','I will not return in 2 weeks'])assert.equal(checkFollowUpTeachback(phrase,true).status,'clarify',phrase)});
