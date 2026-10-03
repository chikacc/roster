// demo-kai.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const logs=[];const p=await b.newPage({viewport:{width:1300,height:900}});p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
await p.evaluate(()=>enterDemo('night'));await p.waitForTimeout(300);
await p.screenshot({path:OUT+'kai_screen.png'});
for(const sh of ['wide','tall']){const u=await p.evaluate(async sh=>{S.exportShape=sh;S.exportFit='fixed';return (await renderCanvas()).toDataURL();},sh);fs.writeFileSync(`${OUT}kai_${sh}.png`,Buffer.from(u.split(',')[1],'base64'));}
console.log(logs);await b.close();})();
