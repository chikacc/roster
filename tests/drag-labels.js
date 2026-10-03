// drag-labels.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1300}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";try{localStorage.setItem("roster-ui",JSON.stringify({"p-labels":true,"p-text":true,"p-layout":true,"p-ics":true,"p-lists":true,"p-backup":true,layout:true}))}catch(e){};});
await p.goto('http://localhost:8765/');await p.waitForTimeout(800);
await p.evaluate(()=>document.getElementById('openDemo').click());await p.waitForTimeout(200);
await p.evaluate(()=>document.querySelector('[data-demo="nurse"]').click());await p.waitForTimeout(200);
const order=()=>p.evaluate(()=>[...document.querySelectorAll('#brushes .brush[data-b]')].map(b=>b.textContent.trim()).join(','));
console.log('start',await order());
const box=async t=>{const e=await p.$(`#brushes .brush[data-b="${t}"]`);return e.boundingBox();};
let a=await box('白班 8-16'), c=await box('大夜 0-8');
await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+30,a.y+10,{steps:3});
await p.mouse.move(c.x+c.width*0.8,c.y+c.height/2,{steps:8});await p.waitForTimeout(200);
console.log('during',await order(), await p.evaluate(()=>!!document.querySelector('.brush-ghost')));
{const bb=await (await p.$('.brushbar')).boundingBox(); await p.screenshot({path:OUT+'drag.png',clip:{x:0,y:bb.y-10,width:1100,height:bb.height+40}});}
await p.keyboard.press('Escape');await p.waitForTimeout(300);
console.log('esc',await order(), await p.evaluate(()=>!!document.querySelector('.brush-ghost')));
await p.mouse.up();
a=await box('白班 8-16'); c=await box('大夜 0-8');
await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+30,a.y+10,{steps:3});
await p.mouse.move(c.x+c.width*0.8,c.y+c.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(400);
console.log('drop',await order(), await p.evaluate(()=>[...document.querySelectorAll('#legend>span')].map(x=>x.textContent).join(',')));
console.log(errs);await b.close();})();
