// clear-month.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const logs=[];p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(1000);
const d=()=>p.evaluate(()=>JSON.stringify(monthData(false).days));
await p.evaluate(()=>{document.querySelector('#grid .cell[data-d="5"]').click();document.querySelector('#grid .cell[data-d="6"]').click();});
console.log('painted',await d());
await p.click('#brushes .brush.clear');await p.waitForTimeout(100);
console.log('brush',await p.evaluate(()=>brush));
await p.evaluate(()=>document.querySelector('#grid .cell[data-d="5"]').click());await p.waitForTimeout(100);
console.log('after clear click',await d());
const box=await p.evaluate(()=>{const r=document.querySelector('#grid .cell[data-d="6"]').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
await p.mouse.move(...box);await p.mouse.down();await p.mouse.move(box[0]+5,box[1]+5,{steps:3});await p.mouse.up();await p.waitForTimeout(100);
console.log('after clear drag',await d());
// demo: clear on a demo day
await p.evaluate(()=>document.getElementById('demoBtn').click());await p.waitForTimeout(400);
console.log('demo before',await p.evaluate(()=>JSON.stringify(monthData(false).days[3])));
await p.click('#brushes .brush.clear');await p.evaluate(()=>document.querySelector('#grid .cell[data-d="3"]').click());await p.waitForTimeout(100);
console.log('demo after',await p.evaluate(()=>JSON.stringify(monthData(false).days[3])));
console.log(logs);await b.close();})();
