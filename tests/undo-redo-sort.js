// undo-redo-sort.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const logs=[];p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(1000);
const d=()=>p.evaluate(()=>JSON.stringify(monthData(false).days));
const st=()=>p.evaluate(()=>[document.getElementById('undoTb').disabled,document.getElementById('redoTb').disabled,document.getElementById('undoTb').title,document.getElementById('redoTb').title].join(' | '));
console.log('init',await st());
await p.evaluate(()=>{document.querySelector('#grid .cell[data-d="5"]').click();});
console.log('painted',await d(),await st());
await p.click('#undoTb');await p.waitForTimeout(100);
console.log('undone',await d(),await st(), await p.textContent('#toastbox'));
await p.keyboard.press('Control+Shift+Z');await p.waitForTimeout(100);
console.log('redone',await d(),await st());
await p.keyboard.press('Control+z');await p.waitForTimeout(100);
console.log('undo2',await d(),await st());
await p.keyboard.press('Control+y');await p.waitForTimeout(100);
console.log('redo2',await d(),await st());
await p.keyboard.press('Control+z');await p.waitForTimeout(100);
await p.evaluate(()=>{document.querySelector('#grid .cell[data-d="9"]').click();});
console.log('new action clears redo',await d(),await st());
await p.screenshot({path:OUT+'ur1.png',clip:{x:0,y:0,width:1300,height:200}});
// sort mode
await p.click('#sortLabels');await p.waitForTimeout(200);
console.log('labels',await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')));
await p.screenshot({path:OUT+'ur2.png'});
const rows=await p.$$('#labs .srow');const r0=await rows[0].boundingBox(), r1=await rows[1].boundingBox();
await p.mouse.move(r0.x+100,r0.y+r0.height/2);await p.mouse.down();await p.mouse.move(r0.x+100,r1.y+r1.height-2,{steps:8});
await p.screenshot({path:OUT+'ur3.png'});
await p.mouse.up();await p.waitForTimeout(400);
console.log('after drag',await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')),await st());
await p.focus('#labs .grip[data-grip="0"]');await p.keyboard.press('ArrowDown');await p.waitForTimeout(300);
console.log('after key',await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')),await p.evaluate(()=>document.activeElement.dataset.grip));
await p.keyboard.press('Escape');await p.waitForTimeout(200);
console.log('sortMode',await p.evaluate(()=>!!sortMode),await p.textContent('#toastbox'));
await p.click('#undoTb');await p.waitForTimeout(200);
console.log('undo sort',await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')));
// setdef
await p.click('[data-more="0"]');await p.waitForTimeout(200);
await p.screenshot({path:OUT+'ur4.png'});
const sd=await p.$('[data-setdef]'); if(sd){await sd.click();await p.waitForTimeout(200);}
console.log('def',await p.evaluate(()=>monthData(false).def),await p.textContent('#toastbox'));
console.log(logs);await b.close();})();
