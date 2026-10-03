// readme-screenshots.js — 用 dist/ 起的本機伺服器（http://localhost:8765）跑；截圖輸出到 out/
const OUT=require('path').join(__dirname,'..','out')+'/'; require('fs').mkdirSync(OUT,{recursive:true});
const {chromium,devices}=require('playwright');
(async()=>{
 const b=await chromium.launch();
 const E="早班 7-15",L="晚班 15-23",N="夜班 23-7",T="家教 19-21",O="休假",P="特休";
 const plan={1:[E],2:[E],3:[O],4:[O],5:[L],6:[L],7:[L],8:[O],9:[O],10:[O],11:[E],12:[E,T],13:[E],14:[E,T],15:[E],16:[N],17:[N],18:[N],19:[O],20:[O],21:[E],22:[E],23:[E,T],24:[L],25:[L],26:[P],27:[P],28:[L],29:[L],30:[O],31:[E]};
 const S={v:3,guideDismissed:true,title:"小晴的班表",fileName:"",exportDark:false,exportShape:"wide",exportRes:"default",exportWidth:2000,showTitle:true,titleAutoDone:true,showHours:true,showOverflow:true,showHolidays:true,hiddenMode:"edit",theme:"system",weekStart:0,stampExport:true,stack:false,textFmt:"label",textDefs:false,
  layout:{rows:"auto",tag:"m",date:"m",fill:"some",dispMode:"always"},ics:{range:"month",pick:{},prefix:false},times:{},cross:{[N]:"end"},
  disp:{[E]:"早",[L]:"晚",[N]:"夜",[T]:"家教"},
  colors:{[O]:"#2b8a6e",[P]:"#2f6fd6",[E]:"#d9822b",[L]:"#7c4dcc",[N]:"#475569",[T]:"#d1477a"},
  months:{"2026-10":{labels:[{name:O,type:"off",style:"solid"},{name:P,type:"off",style:"outline"},{name:E,type:"work",style:"solid"},{name:L,type:"work",style:"solid"},{name:N,type:"work",style:"solid"},{name:T,type:"work",style:"solid"}],def:O,days:plan,updatedAt:Date.now()-12*60000}}};

 const FR=require('path').join(__dirname,'..','node_modules','@fontsource')+'/';
 const fs=require('fs');
 const css=['noto-sans-tc/400.css','noto-sans-tc/500.css','noto-sans-tc/700.css','noto-sans-tc/900.css','ibm-plex-mono/500.css','ibm-plex-mono/600.css','ibm-plex-mono/700.css'].map(f=>fs.readFileSync(FR+f,'utf8').replace(/url\(\.\/files\//g,'url(https://fonts.local/'+f.split('/')[0]+'/files/')).join('\n');
 const fontRoute=async c=>{ await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));
   await c.route('https://fonts.local/**',r=>{ const u=new URL(r.request().url()); const f=FR+u.pathname.slice(1); r.fulfill({contentType:f.endsWith('woff2')?'font/woff2':'font/woff',body:fs.readFileSync(f)}); }); };
 const go=async(opts,scheme,path,sel)=>{const c=await b.newContext({...opts,colorScheme:scheme});await fontRoute(c);const p=await c.newPage();
  await p.addInitScript(s=>{window.__TODAY="2026-10-01T15:40:00";localStorage.setItem("roster-v1",JSON.stringify(s));},S);
  await p.goto('http://localhost:8765/');await p.waitForTimeout(1500);await p.addStyleTag({content:'.dock{display:none!important}'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);console.log(path,await p.evaluate(()=>[document.fonts.check('16px "Noto Sans TC"'),document.fonts.check('16px "IBM Plex Mono"')]));
  const box=await p.evaluate(sel=>{const [a,z]=sel.map(q=>document.querySelector(q).getBoundingClientRect());return {x:0,y:a.top+scrollY-4,width:document.documentElement.clientWidth,height:z.bottom-a.top+10};},sel);
  await p.screenshot({path,clip:box,fullPage:true});await c.close();};
 const D=require('path').join(__dirname,'..','docs')+'/';
 await go({viewport:{width:1100,height:1400},deviceScaleFactor:2},'light',D+'screenshot-desktop.png',['.topbar','#sheet']);
 const ph={...devices['iPhone 13'],deviceScaleFactor:2};
 await go(ph,'light',D+'screenshot-mobile.png',['#sheet','#sheet']);
 await go(ph,'dark',D+'screenshot-mobile-dark.png',['#sheet','#sheet']);
 await b.close();})();
