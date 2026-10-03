// 更新 holidays.json：下載行政院人事行政總處「中華民國政府行政機關辦公日曆表」（政府資料開放平臺 dataset 14718）
// 只保留需要提示的日子：放假日（週末且沒有備註的不算）和補班日（週末要上班）。
// 資料來源也可以手動指定：環境變數 HOLIDAY_CSV_URLS（逗號分隔）或把 CSV 放在 scripts/holidays-csv/。
// 用法：node scripts/update-holidays.mjs
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUT = "src/holidays.json";   // 從 repo 根目錄執行
const DATASET_API = "https://data.gov.tw/api/v2/rest/dataset/14718";

function decode(buf) {
  try { return new TextDecoder("utf-8", { fatal: true }).decode(buf).replace(/^﻿/, ""); }
  catch { return new TextDecoder("big5").decode(buf); }
}
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}
/* 欄位：西元日期（YYYYMMDD）、是否放假（2＝放假、0＝上班）、備註 */
function extract(rows) {
  const head = rows[0].map(c => c.trim());
  const iDate = head.findIndex(h => h.includes("日期")), iOff = head.findIndex(h => h.includes("放假")), iNote = head.findIndex(h => h.includes("備註"));
  if (iDate < 0 || iOff < 0) return null;
  const out = {};
  for (const r of rows.slice(1)) {
    const m = /^(\d{4})(\d{2})(\d{2})$/.exec((r[iDate] || "").trim()); if (!m) continue;
    const key = `${m[1]}-${m[2]}-${m[3]}`, wd = new Date(+m[1], +m[2] - 1, +m[3]).getDay(), weekend = wd === 0 || wd === 6;
    const off = (r[iOff] || "").trim() === "2", note = iNote >= 0 ? (r[iNote] || "").trim() : "";
    if (off && (!weekend || note)) out[key] = { off: true, name: note || "放假" };
    else if (!off && weekend) out[key] = { off: false, name: note || "補行上班" };
  }
  return out;
}
async function sources() {
  const urls = (process.env.HOLIDAY_CSV_URLS || "").split(",").map(s => s.trim()).filter(Boolean);
  const local = [];
  if (existsSync("scripts/holidays-csv")) for (const f of await readdir("scripts/holidays-csv")) if (/\.csv$/i.test(f)) local.push(`scripts/holidays-csv/${f}`);
  if (!urls.length && !local.length) {
    const res = await fetch(DATASET_API); if (!res.ok) throw new Error(`dataset API ${res.status}`);
    const j = await res.json(), dist = (j.result && j.result.distribution) || [];
    for (const d of dist) {
      const u = d.resourceDownloadUrl || d.downloadURL || ""; const fmt = (d.resourceFormat || d.format || "").toUpperCase();
      if (u && (fmt.includes("CSV") || /csv/i.test(u))) urls.push(u);
    }
  }
  return { urls, local };
}
const { urls, local } = await sources();
console.log(`來源：${urls.length} 個網址、${local.length} 個本機檔案`);
const days = {}, years = new Set(); let ok = 0;
const take = (name, text) => {
  const rows = parseCSV(text); if (!rows.length) return;
  const got = extract(rows); if (!got) { console.log(`略過（欄位不符）：${name}`); return; }
  ok++; Object.assign(days, got);
  for (const r of rows.slice(1)) { const y = /^(\d{4})\d{4}$/.exec((r[0] || "").trim()); if (y) years.add(+y[1]); }
  console.log(`讀取：${name}`);
};
for (const u of urls) {
  try { const r = await fetch(u); if (!r.ok) { console.log(`下載失敗 ${r.status}：${u}`); continue; } take(u, decode(new Uint8Array(await r.arrayBuffer()))); }
  catch (e) { console.log(`下載失敗：${u}（${e.message}）`); }
}
for (const f of local) take(f, decode(await readFile(f)));
if (!ok) { console.error("沒有讀到任何辦公日曆表，holidays.json 沒有變更"); process.exit(1); }

/* 名稱太長、App 裡還沒有簡稱的放假日：只在執行紀錄提醒，不影響資料。簡稱表在 index.html 的 HOL_SHORT */
const SHORTENED = new Set(["臺灣光復暨金門古寧頭大捷紀念日", "孔子誕辰紀念日/教師節", "孔子誕辰紀念日", "兒童節及民族掃墓節", "開國紀念日", "民族掃墓節"]);
const longNames = [...new Set(Object.values(days).filter(v => v.off && [...v.name].length > 7 && !SHORTENED.has(v.name)).map(v => v.name))];
if (longNames.length) console.log(`::warning::這些節日名稱超過 7 個字，可以考慮在 index.html 的 HOL_SHORT 加上簡稱：${longNames.join("、")}`);

/* 跟舊資料合併：新的年份蓋過舊的，舊資料裡有、這次沒抓到的年份保留 */
let old = { years: [], days: {} };
if (existsSync(OUT)) old = JSON.parse(await readFile(OUT, "utf8"));
const merged = {}; for (const [k, v] of Object.entries(old.days || {})) if (!years.has(+k.slice(0, 4))) merged[k] = v;
Object.assign(merged, days);
const allYears = [...new Set([...(old.years || []).filter(y => !years.has(y)), ...years])].sort((a, b) => a - b);
const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
if (JSON.stringify(sorted) === JSON.stringify(old.days || {}) && JSON.stringify(allYears) === JSON.stringify(old.years || [])) { console.log("資料沒有變更"); process.exit(0); }
const out = {
  source: "行政院人事行政總處「中華民國政府行政機關辦公日曆表」（政府資料開放平臺，dataset 14718）",
  license: "政府資料開放授權條款－第1版",
  updated: new Date().toISOString().slice(0, 10),
  years: allYears,
  days: sorted,
};
await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`已更新 ${OUT}：${allYears[0]}–${allYears[allYears.length - 1]} 年、${Object.keys(sorted).length} 天`);
