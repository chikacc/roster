// export-dialog.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const logs=[];
for(const [w,h,n] of [[1142,718,'d'],[390,800,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>logs.push(e.message));
await p.addInitScript(()=>{window.__TODAY="2031-01-10T15:40:00";});
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
await p.evaluate(()=>enterDemo('night'));await p.waitForTimeout(300);
await p.click('#exportBtn');await p.waitForTimeout(2500);
await p.screenshot({path:`${OUT}fin_${n}.png`});
if(n==='d'){ await p.click('#xOpts [data-info="xfit"]');await p.waitForTimeout(300);await p.screenshot({path:OUT+'fin_info.png'});
 const url=await p.evaluate(()=>xCanvas.toDataURL());fs.writeFileSync(OUT+'fin_img.png',Buffer.from(url.split(',')[1],'base64'));
 await p.evaluate(()=>{exitDemo();});await p.evaluate(()=>enterDemo('part'));await p.waitForTimeout(200);
 const u2=await p.evaluate(async()=>{S.exportShape='wide';return (await renderCanvas()).toDataURL();});fs.writeFileSync(OUT+'fin_part.png',Buffer.from(u2.split(',')[1],'base64'));}
await p.close();}
console.log(logs);await b.close();})();
