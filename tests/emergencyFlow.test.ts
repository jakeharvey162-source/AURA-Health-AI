import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {emergencyDialLink,prepareEmergencyReport,validEmergencyNumber} from '../lib/emergencyFlow';
test('South African SOS opens dialer but cannot silently place a call',()=>{
 assert.equal(emergencyDialLink('za'),'tel:112');
 assert.equal(emergencyDialLink('other'),null);
 assert.equal(emergencyDialLink('other','999'),'tel:999');
 assert.equal(emergencyDialLink('other','+44 999'), 'tel:+44999');
 assert.equal(validEmergencyNumber('javascript:alert(1)'),false);
 assert.equal(emergencyDialLink('other','javascript:alert(1)'),null);
});
test('Emergency handoff includes patient-entered labour and never claims dispatch',()=>{
 const report=prepareEmergencyReport({createdAt:'2026-10-10T10:00:00.000Z',scenario:'labour',symptoms:'painful contractions',pregnancyWeeks:37,bloodPressure:'123/80 mmHg'});
 assert.match(report,/possible labour or painful contractions/);
 assert.match(report,/37 weeks/);
 assert.match(report,/123\/80 mmHg/);
 assert.match(report,/Not sent to ambulance or hospital/);
 assert.match(report,/Not provided/);
});
test('handoff never invents location or claims clinical verification',()=>{
 const report=prepareEmergencyReport({createdAt:'2026-10-10T10:00:00.000Z',scenario:'bleeding',symptoms:'',pregnancyWeeks:99});
 assert.match(report,/Patient reports bleeding/);
 assert.match(report,/Location: Not provided/);
 assert.match(report,/Pregnancy: Not provided/);
 assert.match(report,/NOT VERIFIED/);
});
test('emergency handoff copies only opted-in coordinates when supplied',()=>{
 const report=prepareEmergencyReport({createdAt:'2026-10-10T10:00:00.000Z',scenario:'breathing',symptoms:'',coordinates:{latitude:-26.2041,longitude:28.0473}});
 assert.match(report,/-26.20410, 28.04730/);
});
