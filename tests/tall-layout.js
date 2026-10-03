// tall-layout.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
await p.addInitScript(()=>{window.__TODAY="2026-10-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
for(const id of ['night','part','office','nurse','shift','retail']){await p.evaluate(id=>enterDemo(id),id);await p.waitForTimeout(250);
const u=await p.evaluate(async()=>{S.exportShape='tall';S.exportFit='fixed';return (await renderCanvas()).toDataURL();});fs.writeFileSync(`${OUT}tall_${id}.png`,Buffer.from(u.split(',')[1],'base64'));}
await b.close();})();
