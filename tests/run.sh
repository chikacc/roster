#!/usr/bin/env bash
# 建置 dist/，在 8765 起本機伺服器，依序跑 tests/ 下的腳本（或只跑指定的幾個）。
# 用法：bash tests/run.sh            全部（readme-screenshots 除外，它會改寫 docs/ 的截圖）
#       bash tests/run.sh demo-eggs   只跑指定的
set -u
cd "$(dirname "$0")/.."
# Playwright 用環境裡全域安裝的那一份（版本要對得上已下載的瀏覽器）；字型（只有截圖用）裝在 repo 的 node_modules
export NODE_PATH="$PWD/node_modules:$(npm root -g)"
# Playwright 用環境裡全域安裝的那一份（版本要對得上預先下載好的瀏覽器）；字型（只有截圖用）裝在 repo 的 node_modules
export NODE_PATH="$PWD/node_modules:$(npm root -g)"
python3 build.py >/dev/null || exit 1
python3 -m http.server 8765 -d dist >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
sleep 0.6
if [ $# -gt 0 ]; then list=("$@"); else list=($(ls tests/*.js | xargs -n1 basename | sed 's/\.js$//' | grep -v '^readme-screenshots$')); fi
fail=0
for t in "${list[@]}"; do
  echo "== $t"
  out=$(timeout 180 node "tests/$t.js" 2>&1); code=$?
  echo "$out" | tail -6
  # 結束碼不是 0，或印出的 pageerror 陣列不是空的（以 [ 開頭、不是 []），就算失敗
  if [ $code -ne 0 ] || echo "$out" | grep -E '^\[.+\]$' | grep -vq '^\[\]$'; then echo "!! $t 失敗"; fail=1; fi
done
exit $fail
