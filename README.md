# RecSys LLM Wiki｜推薦系統：AI 如何讀懂你的喜好？

這是生成式 AI 課程專案，透過電影、歌單與影片等生活情境，帶沒有機器學習背景的讀者理解偏好訊號、推薦排序、評估與冷啟動。

- **本機簡報**　直接以瀏覽器開啟 [presentation/index.html](presentation/index.html)，或從儲存庫根目錄啟動 VS Code Live Server，再開啟同一檔案。主要功能可離線使用。
- **線上簡報**　GitHub Pages 啟用並完成部署後，使用 [公開簡報網址](https://boyang-by.github.io/LLM-Wiki/presentation/index.html)。
- **操作**　以「上一頁／下一頁」、方向鍵或章節選單切換。每頁的「Wiki 依據」可追溯技術內容。

## 12 頁互動教學

簡報依序介紹生活情境、偏好訊號、使用者－物品矩陣、候選生成／評分／重排序、內容式推薦、協同過濾與混合式推薦、推薦評估、冷啟動、推薦模擬器、倫理、概念測驗與知識地圖。

可模擬觀影事件、點選評分矩陣、查看候選與排名改變、追蹤協同關係圖、比較 Hit@3、切換冷啟動策略和曝光清單。第 9 頁以虛構電影和固定規則展示新使用者及有歷史偏好者的推薦；第 11 頁提供可重作的測驗與逐題解析。範例資料為教學模擬。Netflix 實務案例限定於 2015 年論文，Spotify 與 YouTube 用於生活情境。

## Wiki 與開發流程

專案參考 [Andrej Karpathy 的 LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)，把原始來源定位、跨來源整理的 Markdown Wiki 與維護規則分開管理。

1. **Ingest**　查核來源的正文、版本與適用範圍，摘錄帶定位的證據，更新主題頁、索引與交叉連結。
2. **Query**　從 Wiki 索引找主題及來源證據，記錄教學問題、答案與依據。證據不足時回到 Wiki 維護。
3. **Lint**　檢查缺頁、斷鏈與反向連結，再人工核對主張、術語和來源範圍。從根目錄在 PowerShell 執行下列結構檢查。

```powershell
& ([scriptblock]::Create((Get-Content -LiteralPath scripts/lint-wiki.ps1 -Raw -Encoding UTF8)))
```

流程由資料蒐集、Ingest、Wiki 更新、Lint 和 Query 進入教材整理。教材驗證與審閱後才生成 HTML。發現知識問題時回到 Wiki，發現操作或版面問題時修正簡報後重測。

### 六大知識模組

1. [基礎概念與應用](wiki/topics/basics.md)
2. [使用者行為與資料表示](wiki/topics/signals.md)
3. [內容式、協同過濾與混合式推薦](wiki/topics/methods.md)
4. [推薦系統評估](wiki/topics/evaluation.md)
5. [冷啟動與進階技術](wiki/topics/cold-start.md)
6. [倫理與實務挑戰](wiki/topics/ethics.md)

### 七篇資料來源

| 來源 | 教材用途 |
|---|---|
| [S01 Google Developers](wiki/sources/S01.md) | 推薦系統三階段 |
| [S02 GroupLens MovieLens 100K README](wiki/sources/S02.md) | 評分資料結構與資料切分 |
| [S03 TensorFlow Recommenders](wiki/sources/S03.md) | 電影檢索、雙塔與前 K 名命中 |
| [S04 Burke](wiki/sources/S04.md) | 內容式、協同與混合策略 |
| [S05 Çano 與 Morisio](wiki/sources/S05.md) | 冷啟動、資料稀疏與混合推薦回顧 |
| [S06 Gomez-Uribe 與 Hunt](wiki/sources/S06.md) | Netflix 2015 年案例與離線／線上評估 |
| [S07 Stray 等人](wiki/sources/S07.md) | 多樣性、公平性與使用者控制 |

### 專案與開發紀錄

- [Wiki 索引](wiki/index.md)、[來源清冊](sources/index.md)、[Wiki 規範](wiki_schema.md)
- [逐頁教材與來源對照](presentation/teaching-outline.md)、[簡報原始碼](presentation/)
- [Workflow 日誌](logs/workflow.md)、[V3 教材驗證](logs/v3-content-validation.md)、[V4 簡報驗證](logs/v4-presentation-validation.md)、[V5 改版驗證](logs/v5-presentation-redesign.md)
