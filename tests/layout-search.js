// layout-search.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const logs=[];
for(const [w,h,n] of [[1300,1500,'d'],[390,800,'m']]){
const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
if(n==='m'){await p.tap?.('[data-dock="layout"]').catch(()=>{});await p.click('[data-dock="layout"]');await p.waitForTimeout(500);}
else await p.evaluate(()=>setPanel('layout',true));
await p.waitForTimeout(300);
await p.screenshot({path:`${OUT}ls_${n}1.png`,fullPage:n==='d'});
await p.fill('#laySearch','星期');await p.waitForTimeout(300);
console.log(n,await p.evaluate(()=>[...document.querySelectorAll('details.lgrp')].map(g=>g.dataset.grp+':'+(g.hidden?'H':g.open?'O':'C')+':'+[...g.querySelectorAll('.set')].filter(x=>!x.hidden).length).join(' ')));
await p.screenshot({path:`${OUT}ls_${n}2.png`});
await p.fill('#laySearch','xyz');await p.waitForTimeout(200);console.log(await p.evaluate(()=>$("layNone").hidden));
await p.fill('#laySearch','');await p.waitForTimeout(200);console.log(await p.evaluate(()=>[...document.querySelectorAll('details.lgrp')].map(g=>(g.hidden?'H':g.open?'O':'C')).join('')));
await p.close();}
console.log(logs);await b.close();})();
