// paint-and-month-anim.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const logs=[];
for(const [opts,n] of [[{viewport:{width:1300,height:850}},'d'],[{...devices['iPhone 13']},'m']]){const c=await b.newContext(opts);const p=await c.newPage();p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
const box=d=>p.evaluate(d=>{const r=document.querySelector(`#grid .cell[data-d="${d}"]`).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];},d);
await p.evaluate(()=>{intendScroll();document.getElementById("sheet").scrollIntoView();});await p.waitForTimeout(200);
if(n==='d'){const a=await box(5),z=await box(7);await p.mouse.move(...a);await p.mouse.down();await p.mouse.move(z[0],z[1],{steps:6});await p.mouse.up();}
else {const a=await box(12); await p.tap('#grid .cell[data-d="12"]');}
await p.waitForTimeout(300);
console.log(n,await p.evaluate(()=>JSON.stringify(monthData(false).days)));
await p.click('#nextM');await p.waitForTimeout(120);await p.screenshot({path:`${OUT}zm_${n}_mid.png`});await p.waitForTimeout(600);await p.screenshot({path:`${OUT}zm_${n}_end.png`});
await c.close();}
console.log(logs);await b.close();})();
