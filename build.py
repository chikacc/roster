# 從 src/ 產生要發佈到 gh-pages 分支的 dist/（GitHub Actions 的 Deploy 會跑這支）
# src/index.html 是預覽（Claude artifact）用的版本：html2canvas 走 CDN、沒有 <head>；
# dist/index.html 改用 vendor/ 裡的 html2canvas，補上 PWA 的 <head> 和 service worker。
import os, shutil
ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(ROOT,'src'); DIST=os.path.join(ROOT,'dist')
if os.path.isdir(DIST): shutil.rmtree(DIST)
shutil.copytree(SRC,DIST,ignore=shutil.ignore_patterns('index.html'))
for f in ('LICENSE','THIRD_PARTY_NOTICES.md'): shutil.copy(os.path.join(ROOT,f),DIST)   # 授權跟著網站一起發佈
src=open(os.path.join(SRC,'index.html'),encoding='utf-8').read()
src=src.replace('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','vendor/html2canvas.min.js')
assert 'cdnjs' not in src
i=src.index('</style>')+len('</style>')
head_part=src[:i].replace('<title>班表</title>',''); body_part=src[i:]
head='''<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>班表</title>
<meta name="description" content="可以自訂標籤的月曆班表：點選或按住連續塗，匯出圖片分享，資料只存在自己的瀏覽器。">
<meta name="theme-color" content="#eef1f4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12171c" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="班表">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<style>
/* 基本重設（Claude 版由外層提供，這裡自己補上） */
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html{-webkit-text-size-adjust:100%}
img{max-width:100%}
</style>
'''
out=(head+head_part+'\n</head>\n<body>\n'+body_part).rstrip()
assert out.endswith('</script>')
out+='''
<script>
/* 離線使用：只有放在 https 網站（例如 GitHub Pages）或本機測試時才啟用 */
if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
</script>
</body>
</html>
'''
open(os.path.join(DIST,'index.html'),'w',encoding='utf-8').write(out)
print('dist/ ok',len(out))
