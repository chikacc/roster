# 第三方授權說明 / Third-Party Notices

本專案本身以 [MIT 授權](LICENSE) 釋出。以下第三方元件依各自的授權條款使用，原始的版權聲明保留在檔案開頭及對應的授權檔中。

This project is released under the [MIT License](LICENSE). The third-party components below are used under their own licenses; their original copyright notices are kept at the top of each file and in the license files listed.

## 隨專案附帶的檔案 / Bundled files

| 元件 Component | 版本 Version | 檔案 File | 授權 License | 授權全文 License text |
|---|---|---|---|---|
| [html2canvas](https://github.com/niklasvh/html2canvas) | 1.4.1 | `vendor/html2canvas.min.js` | MIT — Copyright (c) Niklas von Hertzen | [`vendor/LICENSE-html2canvas.txt`](vendor/LICENSE-html2canvas.txt) |

`vendor/html2canvas.min.js` 內含 Microsoft 的 tslib 輔助程式碼（0BSD 授權），其聲明保留在檔案內。
`vendor/html2canvas.min.js` includes helper code from Microsoft's tslib (0BSD); its notice is kept inside the file.

## 資料 / Data

| 資料 Data | 來源 Source | 授權 License |
|---|---|---|
| `holidays.json`（國定假日與補班日） | 行政院人事行政總處「中華民國政府行政機關辦公日曆表」，[政府資料開放平臺](https://data.gov.tw/dataset/14718) | [政府資料開放授權條款－第1版](https://data.gov.tw/license) |

`holidays.json` 由 GitHub Actions（`.github/workflows/update-holidays.yml`）每月依官方資料自動更新，只保留放假日與補班日。
`holidays.json` is generated monthly by GitHub Actions from the official Taiwan government office calendar and keeps only holidays and make-up workdays.

## 執行時從網路載入 / Loaded at runtime (not redistributed)

| 元件 Component | 來源 Source | 授權 License |
|---|---|---|
| Noto Sans TC | Google Fonts | SIL Open Font License 1.1 |
| IBM Plex Mono | Google Fonts | SIL Open Font License 1.1 |

字型由瀏覽器直接向 Google Fonts 下載，本專案沒有重新散布字型檔。沒有網路時會改用裝置內建字型。
The fonts are downloaded by the browser from Google Fonts and are not redistributed by this project. Without a network connection, the device's built-in fonts are used instead.
