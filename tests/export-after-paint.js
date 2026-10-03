// export-after-paint.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.addInitScript(()=>{localStorage.setItem('roster-v1',JSON.stringify({v:3,guideDismissed:true,exportShape:'tall',months:{}}));});
await p.goto('http://localhost:8765/');await p.waitForTimeout(800);
const cell=p.locator('.grid .cell:not(.empty)').nth(9);await cell.click();await p.waitForTimeout(30);
const r=await p.evaluate(async()=>{const c=await renderCanvas();return c.toDataURL('image/png');});
require('fs').writeFileSync(OUT+'fl.png',Buffer.from(r.split(',')[1],'base64'));console.log(e);await b.close();})();
