// @ts-nocheck
import { chromium } from 'playwright-core';
import { JOURNEYS as J } from "../src/content/journeys";

// End-to-end smoke test on a phone-sized screen. Run against the live site or a preview:
//   BASE_URL=https://paperpath-learn.web.app npm run test:e2e
// Needs Google Chrome installed (CHROME_PATH to override).
const B = process.env.BASE_URL ?? "https://paperpath-learn.web.app";
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
const p = await ctx.newPage();
const bad=[]; p.on('response',r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(0,100)); }); p.on('pageerror',e=>bad.push('PAGEERR '+e.message)); p.on('console',m=>{ if(m.type()==='warning'||m.type()==='error') console.log('CONSOLE',m.type(),m.text().slice(0,300)); });
const plain = (s: string) => s.split('$')[0].trim();

async function passNode(jid, nid) {
  const node = J.find(j=>j.id===jid).nodes.find(n=>n.id===nid);
  await p.goto(`${B}/j/${jid}/n/${nid}`, {waitUntil:'load'});
  await p.waitForSelector('fieldset.q'); await p.waitForTimeout(800);
  const sets = await p.$$('fieldset.q');
  for (const fs of sets) {
    const prompt = (await fs.$eval('.q-prompt', e=>e.textContent)).trim();
    const q = node.quiz.questions.find(x => prompt.startsWith(plain(x.prompt)));
    if (!q) throw new Error('no match for '+prompt);
    if (q.type==='single' || q.type==='multi') {
      for (const o of q.options.filter(o=>o.correct)) {
        const labels = await fs.$$('label.option');
        for (const l of labels) { const t=(await l.$eval('.option-text',e=>e.textContent)).trim(); if (t===o.text.trim() || t.startsWith(plain(o.text))) { await l.click(); break; } }
      }
    } else if (q.type==='numeric') { await (await fs.$('input')).fill(String(q.answer)); }
    else if (q.type==='order') {
      for (let target=0; target<q.correctOrder.length; target++) {
        const want = q.items.find(i=>i.id===q.correctOrder[target]).text;
        for (let guard=0; guard<10; guard++) {
          const texts = await fs.$$eval('ol.order li > span:first-child', els=>els.map(e=>e.textContent.trim()));
          const at = texts.indexOf(want); if (at===target) break;
          await (await fs.$$('ol.order li'))[at].$$('button').then(bs=>bs[0].click());
        }
      }
    }
  }
  await p.click('button:has-text("Check answers")');
  const res = (await p.textContent('.result')).trim();
  const xp = await p.$('.xp') ? (await p.textContent('.xp')).trim() : '';
  console.log(`${jid}/${nid}: ${res.slice(0,60)} ${xp}`);
}

await p.goto(B+'/j/turing-1936',{waitUntil:'load'});
await p.click('button:has-text("Start as your free journey")');
await p.click('button:has-text("Yes, start it")');
await p.waitForURL(/\/n\/algorithm/);
await passNode('turing-1936','algorithm');
await passNode('turing-1936','symbols');
await p.goto(B+'/j/turing-1936',{waitUntil:'load'});
const states = await p.$$eval('.pnode', els=>els.map(e=>e.querySelector('.pnode-title').textContent+': '+e.querySelector('.pnode-state').textContent.split(' · ')[0]));
console.log(states.slice(0,4).join(' | '));
console.log('header:', (await p.textContent('.meters')).replace(/\s+/g,' '));
const fsCheck = async()=> p.evaluate(async()=>{
  const db = await new Promise(r=>{const q=indexedDB.open('firebaseLocalStorageDb'); q.onsuccess=()=>r(q.result);});
  const rows = await new Promise(r=>{const t=db.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll(); t.onsuccess=()=>r(t.result);});
  const u = rows[0].value; const h={Authorization:'Bearer '+u.stsTokenManager.accessToken};
  const base=`https://firestore.googleapis.com/v1/projects/paperpath-learn/databases/(default)/documents/users/${u.uid}`;
  return {user: await fetch(base,{headers:h}).then(r=>r.status), progress: await fetch(base+'/progress',{headers:h}).then(r=>r.text()).then(t=>t.slice(0,120))};
});
await p.waitForTimeout(8000); console.log('firestore after passing:', JSON.stringify(await fsCheck()));
// Clear local storage: progress must come back from Firestore for the same anonymous user.
await p.evaluate(()=>localStorage.clear()); await p.reload({waitUntil:'load'}); await p.waitForTimeout(3000);
const after = await p.$$eval('.pnode', els=>els.slice(0,2).map(e=>e.querySelector('.pnode-state').textContent.split(' · ')[0]));
console.log('after clearing localStorage:', after.join(', '));
// Another journey: preview is free, the rest goes to the paywall.
await p.goto(B+'/j/nash-1950/n/best-response',{waitUntil:'load'}); await p.waitForTimeout(1500); console.log('non-preview node ->', new URL(p.url()).pathname);
await p.goto(B+'/j/nash-1950/n/games',{waitUntil:'load'}); console.log('preview node ->', new URL(p.url()).pathname);
console.log('errors:', bad.slice(0,5));
await b.close();
