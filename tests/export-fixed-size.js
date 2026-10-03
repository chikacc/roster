// export-fixed-size.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const logs=[];const p=await b.newPage({viewport:{width:1300,height:900}});p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2026-10-01T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(800);
for(const id of ['retail','part','nurse']) for(const sh of ['wide','tall']) for(const fit of ['fixed']){
 await p.evaluate(id=>enterDemo(id),id);await p.waitForTimeout(300);
 const url=await p.evaluate(async([sh,fit])=>{S.exportShape=sh;S.exportFit=fit;const c=await renderCanvas();return [c.width,c.height,c.toDataURL()];},[sh,fit]);
 console.log(id,sh,fit,url[0],url[1]);fs.writeFileSync(`${OUT}xf_${id}_${sh}.png`,Buffer.from(url[2].split(',')[1],'base64'));}
console.log(logs);await b.close();})();
