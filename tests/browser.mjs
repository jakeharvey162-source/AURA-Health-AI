import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';

const port = 3217;
const origin = `http://127.0.0.1:${port}`;
const server = spawn('npm', ['run', 'start', '--', '-p', String(port)], {stdio:'pipe',detached:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
let logs='';
server.stdout.on('data',x=>{logs+=x.toString()});
server.stderr.on('data',x=>{logs+=x.toString()});
async function ready(){
  for(let i=0;i<60;i++){
    if(server.exitCode!==null)throw Error('Next server exited: '+logs.slice(-2000));
    try{const r=await fetch(origin);if(r.ok)return}catch{}
    await new Promise(r=>setTimeout(r,500));
  }
  throw Error('Next server did not start: '+logs.slice(-2000));
}
let browser;
try{
 await ready();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const viewport of [{width:1365,height:850},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   page.setDefaultTimeout(8000);
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin,{waitUntil:'networkidle'});
   assert.equal(await page.getByRole('heading',{name:/Feel more in control/i}).count(),1);
   assert.equal(await page.locator('.hero-art .care-photo').count(),1,'Doctor image element exists');
   assert.equal(await page.locator('.hero-art .art-card').count(),2,'Glass hero cards render');
   const theme=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.ok(theme,'Theme styling is available');
   assert.equal(await page.getByRole('button',{name:'Save this check-in'}).isEnabled(),true);
   assert.equal(await page.getByRole('checkbox',{name:'I have a blood-pressure reading'}).isChecked(),false);
   await page.getByRole('button',{name:'I have a severe headache'}).click();
   assert.equal(await page.getByText('You may need medical attention').isVisible(),true);
   await page.getByRole('spinbutton',{name:'Weeks pregnant'}).fill('32');
   await page.getByRole('button',{name:/Prepare a note for my care team/}).click();
   assert.equal(await page.getByRole('heading',{name:'Your care summary'}).isVisible(),true);
   assert.match(await page.locator('.handoff').innerText(),/32 weeks/);
   await page.getByRole('checkbox',{name:'I have a blood-pressure reading'}).check();
   await page.getByRole('spinbutton',{name:'Systolic blood pressure'}).fill('90');
   await page.getByRole('spinbutton',{name:'Diastolic blood pressure'}).fill('110');
   assert.equal(await page.getByRole('button',{name:'Save this check-in'}).isDisabled(),true);
   await page.getByRole('spinbutton',{name:'Systolic blood pressure'}).fill('145');
   assert.equal(await page.getByRole('button',{name:'Save this check-in'}).isEnabled(),true);
   await page.getByRole('button',{name:'Save this check-in'}).click();
   await page.getByRole('button',{name:/Check-in saved/}).waitFor({state:'visible'});
   const stored = await page.evaluate(async()=>{
     const db=await new Promise((resolve,reject)=>{const q=indexedDB.open('aura-local');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)});
     return await new Promise((resolve,reject)=>{const q=db.transaction('events','readonly').objectStore('events').getAll();q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)});
   });
   assert.ok(stored.some(x=>x.payload?.bloodPressure?.systolic===145),'Offline check-in was persisted in IndexedDB');
   await page.getByRole('button',{name:'My care plan',exact:true}).click();
   assert.equal(await page.getByRole('heading',{name:'Know what happens next'}).isVisible(),true);
   await page.getByRole('button',{name:'I understand my follow-up'}).click();
   await page.getByRole('textbox',{name:'Teach back the care plan'}).fill('In two weeks');
   assert.match(await page.locator('[role=status]').last().innerText(),/matches/i);
   await page.getByRole('button',{name:'Accessibility'}).click();
   assert.equal(await page.getByRole('heading',{name:'Built for more people'}).isVisible(),true);
   await page.getByRole('button',{name:'My check-in',exact:true}).click();
   await page.getByRole('button',{name:'My account'}).click();
   assert.equal(await page.getByRole('heading',{name:'Your private health journal'}).isVisible(),true);
   assert.equal(await page.locator('#aura-account .account-security').isVisible(),true,'Privacy reminder is visible');
   await page.getByRole('button',{name:'Create account'}).click();
   assert.match(await page.locator('.account-panel [role=status]').innerText(),/valid email/i);
   assert.deepEqual(errors,[], 'No uncaught client-side exceptions');
   const horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(horizontalOverflow,false,'No horizontal viewport overflow');
   await page.getByRole('combobox',{name:'Language'}).selectOption('fr');
   assert.equal(await page.getByRole('heading',{name:/Prenez davantage soin/i}).isVisible(),true);
   await page.getByRole('button',{name:'J’ai très mal à la tête'}).click();
   assert.equal(await page.getByText('Une consultation médicale peut être nécessaire').isVisible(),true);
   assert.equal(await page.getByRole('button',{name:'Enregistrer ce bilan'}).isVisible(),true);
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await page.getByRole('combobox',{name:'Language'}).inputValue(),'fr');
   await page.getByRole('combobox',{name:'Language'}).selectOption('zu');
   assert.equal(await page.getByRole('heading',{name:/Nakekela kangcono/i}).isVisible(),true);
   await page.getByRole('button',{name:'Ngiphethwe ikhanda elibuhlungu kakhulu'}).click();
   assert.equal(await page.getByText('Ungase udinge usizo lwezempilo').isVisible(),true);
   assert.deepEqual(errors,[], 'No uncaught exceptions after language changes');
   const overflowAfterTranslation=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflowAfterTranslation,false,'No horizontal overflow in translated layout');
   await page.close();
   console.log('PASS patient and multilingual browser walkthrough at '+viewport.width+'px');
 }
}finally{
 await browser?.close();
 try{process.kill(-server.pid,'SIGTERM')}catch{server.kill('SIGTERM')}
}
