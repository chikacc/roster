# 班表

可以自訂標籤的月曆班表，排休、排班、值班都能用。點日期或按住連續塗來標記，也可以用文字一次貼上整個月，最後產生圖片傳到群組，或匯出成日曆檔加進手機行事曆。

**👉 開始使用：https://roster.chika.cc/**

<p align="center">
  <img src="docs/screenshot-desktop.png" alt="桌機畫面：2026 年 10 月班表，早班、晚班、夜班顯示成「早」「晚」「夜」，有幾天同時排早班和家教，國慶日和補假的日期是紅字並標出節日名稱，特休用空心標籤">
</p>
<p align="center">
  <img src="docs/screenshot-mobile.png" alt="手機畫面（淺色）：同一個月在窄螢幕上的樣子" width="300">
  <img src="docs/screenshot-mobile-dark.png" alt="手機畫面（深色）" width="300">
</p>

**使用方式請看[使用說明](https://roster.chika.cc/help.html)**（原始檔是 [`help.html`](help.html)）。

所有資料只存在你的瀏覽器，不會上傳，也沒有任何追蹤或分析程式。換手機或清除瀏覽器資料前，記得先備份，詳見[資料與備份](https://roster.chika.cc/help.html#backup)。

## 自己架設

這是純靜態網頁，沒有建置步驟，放到任何靜態網站空間都能用。

1. Fork 或下載這個 repo。
2. 在 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`。
3. 等一兩分鐘，網址會是 `https://你的帳號.github.io/repo名稱/`。

所有路徑都是相對路徑，repo 取什麼名字都可以。這個 repo 裡的 `CNAME` 檔案是用來綁定 `roster.chika.cc` 的，fork 後請刪掉或改成你自己的網域。

### 檔案說明

| 檔案 | 用途 |
|---|---|
| `index.html` | 整個工具（介面、樣式、程式） |
| `help.html` | 使用說明 |
| `vendor/` | 產生圖片的程式庫（html2canvas） |
| `manifest.webmanifest`、`icons/` | 加到主畫面用的名稱與圖示 |
| `sw.js` | 離線快取 |
| `holidays.json` | 國定假日與補班日（自動產生，不用手動改） |
| `scripts/update-holidays.mjs`、`.github/workflows/` | 每月從官方辦公日曆表更新 `holidays.json` |
| `docs/` | README 用的截圖 |

### 更新時要注意

- 只改 `index.html` 或 `help.html`：直接覆蓋即可，使用者下次連網打開就是新版。
- 有換 `vendor/` 或 `icons/` 裡的檔案：把 `sw.js` 裡 `CACHE` 的版本號加 1，舊的快取才會被換掉。
- 版本號遵循[語意化版本](https://semver.org/lang/zh-TW/)，記得同步修改 `index.html` 裡的 `VERSION` 和 [CHANGELOG](CHANGELOG.md)。

### 國定假日資料

- `holidays.json` 由 GitHub Actions 每月 1 號自動執行 `scripts/update-holidays.mjs` 產生：下載行政院人事行政總處的「中華民國政府行政機關辦公日曆表」（[政府資料開放平臺](https://data.gov.tw/dataset/14718)），只保留放假日和補班日，有變更才會透過 GitHub API 建立 commit（由 GitHub 簽章，作者是 github-actions[bot]）。
- 也可以在 repo 的 **Actions → Update holiday data → Run workflow** 手動執行。
- 如果自動下載失敗，可以把官方 CSV 放進 `scripts/holidays-csv/` 再執行一次，或用環境變數 `HOLIDAY_CSV_URLS` 指定下載網址。
- 出現超過 7 個字、還沒有簡稱的放假日名稱時，執行紀錄會出現提醒；簡稱表在 `index.html` 的 `HOL_SHORT`。

## 授權

本專案以 [MIT 授權](LICENSE) 釋出。使用的第三方元件與授權請見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
