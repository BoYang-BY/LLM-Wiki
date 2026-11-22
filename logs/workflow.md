# 執行日誌

日期使用台北時區。

## 2026-11-22 來源檢查

已重開七項正文。S02 以完整 README 查核欄位與條款。S04、S06 使用全文副本。S07 原候選 UW PDF 逾時，改核閱 arXiv 全文。先核對正文、版本與用途，再按 S01–S07 寫入。

## 2026-11-22 Ingest S01

已將 正文的 Candidate generation、Scoring、Re-ranking 小節。 的證據整合到[基礎概念與應用](../wiki/topics/basics.md)、[倫理與實務挑戰](../wiki/topics/ethics.md)。見 [S01 來源頁](../wiki/sources/S01.md)。

## 2026-11-22 Ingest S02

已將 SUMMARY & USAGE LICENSE、DETAILED DESCRIPTIONS OF DATA FILES（u.data、u.item、u1.base–u5.test）。 的證據整合到[使用者行為與資料表示](../wiki/topics/signals.md)、[推薦系統評估](../wiki/topics/evaluation.md)、[冷啟動與進階技術](../wiki/topics/cold-start.md)。見 [S02 來源頁](../wiki/sources/S02.md)。

## 2026-11-22 Ingest S03

已將 The dataset、Preparing the dataset、Implementing a model、Fitting and evaluating。 的證據整合到[基礎概念與應用](../wiki/topics/basics.md)、[使用者行為與資料表示](../wiki/topics/signals.md)、[推薦系統評估](../wiki/topics/evaluation.md)、[冷啟動與進階技術](../wiki/topics/cold-start.md)。見 [S03 來源頁](../wiki/sources/S03.md)。

## 2026-11-22 Ingest S04

已將 第 2 節推薦技術、第 3 節混合分類、第 4–5 節餐廳案例與第 7 節結論。 的證據整合到[內容式、協同過濾與混合式推薦](../wiki/topics/methods.md)。見 [S04 來源頁](../wiki/sources/S04.md)。

## 2026-11-22 Ingest S05

已將 第 2 節 Methodology、第 3 節 RQ2 的 Cold-start 與 Data sparsity。 的證據整合到[使用者行為與資料表示](../wiki/topics/signals.md)、[內容式、協同過濾與混合式推薦](../wiki/topics/methods.md)、[冷啟動與進階技術](../wiki/topics/cold-start.md)。見 [S05 來源頁](../wiki/sources/S05.md)。

## 2026-11-22 Ingest S06

已將 第 2 節、第 2.1–2.3 小節、第 4 節及 §4.6。 的證據整合到[基礎概念與應用](../wiki/topics/basics.md)、[使用者行為與資料表示](../wiki/topics/signals.md)、[推薦系統評估](../wiki/topics/evaluation.md)、[倫理與實務挑戰](../wiki/topics/ethics.md)。見 [S06 來源頁](../wiki/sources/S06.md)。

## 2026-11-22 Ingest S07

已將 arXiv PDF 第 10–11 頁（公平、多樣性），第 36 頁（顯式控制與隱式訊號）。頁碼自 1 起算。 的證據整合到[倫理與實務挑戰](../wiki/topics/ethics.md)、[使用者行為與資料表示](../wiki/topics/signals.md)。見 [S07 來源頁](../wiki/sources/S07.md)。

## 2026-11-22 初步 Lint 第 1 次

結構檢查讀取六篇主題頁、七篇來源頁及 Wiki 索引，檢查 79 個本機連結，其中 14 個為主題間連結。發現 S04 缺少冷啟動頁的反向連結。原先使用 PowerShell 的 -File 啟動檢查，但本機執行原則拒絕載入，改用 README 所列指令從目前工作目錄執行，未修改執行原則。

內容檢查釐清兩組範圍差異。Google 的三階段架構與 TensorFlow 的兩階段教學用語採不同粒度，已在基礎頁對照。GroupLens 發行包的預切分與 TensorFlow 教程從 TFDS 單一 split 自行切分可以同時成立，已在評估頁區分。MovieLens 清冊和證據頁以原始 README 的精確規模為準。Netflix 主張限於 2015 年，Spotify 與 YouTube 留作應用情境。

## 2026-11-22 Wiki 修正

新增 S04 至冷啟動的反向連結。依使用者指定的兩種情境擴充冷啟動頁，記錄虛構資料、預設排序、切換行為與個別推薦理由，並從 S06 加上整合主題連結。七篇來源頁補上直達本次查核版本的連結。這一輪新增反向連結的需求後續納入每篇 Ingest 後的局部檢查。待下一輪採相同方式重跑後，再比較提前檢查的效果。

## 2026-11-22 初步 Lint 第 2 次

通過結構檢查。六篇主題頁、七篇來源頁、85 個本機連結（含 15 個主題間連結），未回報結構問題。另人工核對三階段的描述、資料集版本與用途、歷史案例的年代，以及模擬資料與真實來源的界線。

## 2026-11-22 Wiki 驗收 Query

- 新使用者沒有歷史，仍能收到什麼推薦？先依整體熱門度，主動選擇類型後再依內容特徵重排。見[冷啟動](../wiki/topics/cold-start.md)與 [S04](../wiki/sources/S04.md#evidence)、[S05](../wiki/sources/S05.md#evidence)、[S06](../wiki/sources/S06.md#evidence)。
- 已有偏好的使用者切換類型後會怎樣？依 Wiki 的虛構表手算，原先偏好紀錄片，《島嶼漫步》居首，切換喜劇後《週末劇場》居首。協同過濾另外透過多人互動展示。見[冷啟動](../wiki/topics/cold-start.md)及[推薦方法](../wiki/topics/methods.md)。
- 離線命中可以回答什麼？可檢查保留的正例有沒有進候選清單。要觀察換用不同模型後的真實行為，可透過 A/B 測試。見[評估](../wiki/topics/evaluation.md)與 [S03](../wiki/sources/S03.md#evidence)、[S06](../wiki/sources/S06.md#evidence)。

本階段的內容驗證止於 Wiki 主張與模擬規則。逐頁教材對照、HTML 與瀏覽器測試待 Wiki 確認後執行。

## 2026-11-22 V3 教材規劃與驗證

已從 Wiki 完成逐頁 Query、文案、證據對照及互動規格。內容檢查後修正評估與協同案例，再複驗。使用者確認教材後才開始 HTML。見 [V3 完整紀錄](v3-content-validation.md)。

## 2026-11-22 V4 HTML 生成與複驗

已交付 12 頁本機互動簡報。以 Edge 驗證 file://、互動、四種尺寸、重新整理與未捕捉的 JavaScript 例外。針對 320px 溢出及首頁捲動修正後重跑。見 [V4 生成、測試與修正](v4-presentation-validation.md)。

## 2026-11-22 V5 互動教學改版

依 V4 實際使用回饋重做 12 頁投影版面及資料互動。Edge 驗證 44 項功能與三種桌面尺寸，第 4 頁完整片庫造成的 27px 垂直捲動已修正並複驗。見 [V5 改版與驗證](v5-presentation-redesign.md)。
