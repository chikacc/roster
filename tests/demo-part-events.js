// demo-part-events.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.addInitScript(()=>{localStorage.setItem('roster-v1',JSON.stringify({v:3,guideDismissed:true,months:{}}));});
await p.goto('http://localhost:8765/');await p.waitForTimeout(700);
console.log(await p.evaluate(()=>{const out=[];for(const Y of [2026,2027,2028]) for(const id of ['part']) for(const m of [10,11]){const k=Y+'-'+String(m).padStart(2,'0');const md=genDemoMonth(id,k);
 const ev=Object.entries(md.days).filter(([d,v])=>v.some(x=>!['回復','18-22','10-14','修行'].includes(x))).map(([d,v])=>d+':'+v.join('+'));out.push(id+' '+k+' '+ev.join(' '));}return out.join('\n')}));
await b.close();})();
