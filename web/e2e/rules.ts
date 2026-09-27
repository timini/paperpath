// @ts-nocheck
// Checks firestore.rules against the live project using throwaway anonymous accounts.
//   npm run test:rules
const KEY='AIzaSyDCV7gR6CCBeeH_6Wywh2eR_At-y0fRqq8';
const signUp = () => fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({returnSecureToken:true})}).then(r=>r.json());
const A = await signUp(), Bu = await signUp();
const base='https://firestore.googleapis.com/v1/projects/paperpath-learn/databases/(default)/documents';
const val = v => typeof v==='number' ? {integerValue:String(v)} : typeof v==='string' ? {stringValue:v} : {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,val(x)]))}};
const req = (tok, method, path, fields, mask) => fetch(`${base}/${path}${mask?'?'+mask.map(m=>'updateMask.fieldPaths='+m).join('&'):''}`,{method,headers:{Authorization:'Bearer '+tok,'Content-Type':'application/json'},body:fields?JSON.stringify({fields:Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,val(v)]))}):undefined}).then(r=>r.status);
const t=A.idToken, u=A.localId;
const cases = [
  ['create own profile with free journey', await req(t,'PATCH',`users/${u}`,{xp:0,freeJourneyId:'turing-1936'}), 200],
  ['change free journey', await req(t,'PATCH',`users/${u}`,{xp:0,freeJourneyId:'nash-1950'}), 403],
  ['raise xp', await req(t,'PATCH',`users/${u}`,{xp:150,freeJourneyId:'turing-1936'}), 200],
  ['lower xp', await req(t,'PATCH',`users/${u}`,{xp:10,freeJourneyId:'turing-1936'}), 403],
  ['add unknown field', await req(t,'PATCH',`users/${u}`,{xp:150,freeJourneyId:'turing-1936',isAdmin:'yes'}), 403],
  ['grant own entitlement', await req(t,'PATCH',`users/${u}/entitlements/nash-1950`,{source:'purchase'}), 403],
  ['write own progress', await req(t,'PATCH',`users/${u}/progress/turing-1936`,{startedAt:1}), 200],
  ['read own entitlements', await req(t,'GET',`users/${u}/entitlements`), 200],
  ['read another user', await req(Bu.idToken,'GET',`users/${u}`), 403],
  ['write another user progress', await req(Bu.idToken,'PATCH',`users/${u}/progress/x`,{startedAt:1}), 403],
  ['write journey content', await req(t,'PATCH',`journeys/turing-1936`,{title:'x'}), 403],
  ['read journey content (public)', await req(t,'GET',`journeys/turing-1936`), 200],
];
let fail=0;
for (const [name,got,want] of cases) { const ok=got===want; if(!ok) fail++; console.log(`${ok?'PASS':'FAIL'} ${name}: ${got} (expected ${want})`); }
process.exit(fail?1:0);
