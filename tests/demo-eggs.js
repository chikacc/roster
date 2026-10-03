// demo-eggs.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const logs=[];const p=await b.newPage({viewport:{width:1300,height:900}});p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const out=[];const g=(id,y,m,d)=>JSON.stringify(genDemoMonth(id,`${y}-${String(m).padStart(2,'0')}`).days[d]||null);
 for(const y of [2026,2027,2028,2029]){
  out.push(`${y} 10/3 美${g('office',y,10,3)} 安${g('part',y,10,3)} 哲${g('retail',y,10,3)} 凱${g('night',y,10,3)}`);
  out.push(`${y} 7/25 明${g('shift',y,7,25)} 君${g('nurse',y,7,25)} 君26${g('nurse',y,7,26)} 凱${g('night',y,7,25)} sib=${siblingsJul25(y)}`);
  const tm=((y*7+4)%12)+1, tr=tripOf(y,tm,daysIn(y,tm)); out.push(`${y} trip ${tm}/${tr} 美${g('office',y,tm,tr[0]+1)} 君${g('nurse',y,tm,tr[0]+1)}`);
 }
 out.push('2028 2/29 哲'+g('retail',2028,2,29)+' 凱'+g('night',2028,2,29));
 out.push('2026 11/11 哲'+g('retail',2026,11,11)+' 凱'+g('night',2026,11,11));
 for(const y of [2027,2028]){ for(const m of [1,2]){ const c=demoCtx('shift',y,m); const e=c.findHol(/除夕/); if(e) out.push(`${y}/${m}/${e} 除夕 明${g('shift',y,m,e)} 君${g('nurse',y,m,e)} 君+1${g('nurse',y,m,e+1)}`);} }
 return out;});
console.log(r.join('\n'));
await p.evaluate(()=>enterDemo('retail'));await p.waitForTimeout(300);await p.click('#eggBtn');await p.waitForTimeout(200);
console.log(await p.evaluate(()=>$("eggAns").innerText));
console.log(logs);await b.close();})();
