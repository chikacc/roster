// demo-shift-fishing.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const logs=[];const p=await b.newPage();p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
console.log(await p.evaluate(()=>{const out=[];for(const k of ['2026-10','2026-11','2027-01','2027-07','2028-07']){const md=genDemoMonth('shift',k);out.push(k+': '+Object.entries(md.days).filter(([d,v])=>v.includes('夜釣')).map(([d,v])=>d+'='+v.join('+')).join(' '));}return out.join('\n');}));
console.log(logs);await b.close();})();
