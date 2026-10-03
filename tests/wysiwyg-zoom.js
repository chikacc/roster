// wysiwyg-zoom.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const logs=[];
for(const [opts,n] of [[{viewport:{width:1300,height:850}},'d'],[{...devices['iPhone 13']},'m']]){const c=await b.newContext(opts);const p=await c.newPage();p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
for(const id of ['night','office']){await p.evaluate(id=>enterDemo(id),id);await p.waitForTimeout(500);
await p.evaluate(()=>{intendScroll();document.getElementById("sheet").scrollIntoView();});await p.waitForTimeout(300);await p.screenshot({path:`${OUT}live_${n}_${id}.png`});
console.log(n,id,await p.evaluate(()=>[$("sheet").style.zoom,$("sheet").offsetWidth,$("sheet").offsetHeight,$("sheet").className]));}
await c.close();}
console.log(logs);await b.close();})();
