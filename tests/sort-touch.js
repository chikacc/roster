// sort-touch.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();const logs=[];p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(1000);
await p.evaluate(()=>{const md=monthData(true);md.labels.push({name:"早班",type:"work",style:"solid"},{name:"晚班",type:"work",style:"outline"});touch();render();});
await p.tap('[data-dock="labels"]');await p.waitForTimeout(400);
await p.tap('#sortLabels');await p.waitForTimeout(300);
await p.screenshot({path:OUT+'um1.png'});
const cdp=await ctx.newCDPSession(p);
const g=await (await p.$('#labs .grip[data-grip="0"]')).boundingBox();const r3=await (await p.$$('#labs .srow'))[2].boundingBox();
const x=g.x+g.width/2;let y=g.y+g.height/2;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+(r3.y+r3.height*0.7-y)*i/10}]});await p.waitForTimeout(30);}
await p.screenshot({path:OUT+'um2.png'});
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(400);
console.log(await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')));
// swipe on row body should not drag
const rb=await (await p.$$('#labs .srow'))[0].boundingBox();
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rb.x+150,y:rb.y+10}]});
for(let i=1;i<=5;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rb.x+150,y:rb.y+10+i*15}]});}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(300);
console.log('body swipe',await p.evaluate(()=>monthData(false).labels.map(l=>l.name).join(',')));
await p.tap('.panel.peek .peekdone');await p.waitForTimeout(400);
console.log('sortMode after close',await p.evaluate(()=>!!sortMode),await p.textContent('#toastbox'));
await p.screenshot({path:OUT+'um3.png'});
console.log(logs);await b.close();})();
