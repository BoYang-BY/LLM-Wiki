# 基礎概念與應用

## 三階段流程

推薦系統（Recommender system）從眾多選項中挑出可能有用的內容。常見流程是候選生成（Candidate generation）縮小範圍，評分（Scoring）比較候選，重排序（Re-ranking）再依多樣性或明確排除等條件調整順序。 [S01](../sources/S01.md#evidence)

## 檢索與排序的命名

TensorFlow 教程以檢索（Retrieval）與排序（Ranking）兩段介紹整體，再聚焦檢索。此處檢索對應三階段架構的候選生成。三階段圖另外把最終約束的重排序畫出來。 [S03](../sources/S03.md#evidence) [S01](../sources/S01.md#evidence)

## 三個生活情境

想像打開 Netflix 找電影、在 Spotify 選通勤歌單、或在 YouTube 找下一支教學影片。共同問題是，在當下有哪些內容值得優先呈現？Netflix 2015 年論文可用來解釋歷史案例，其中首頁排序依用途而異，例如 Top Picks 與 Trending Now。 [S06](../sources/S06.md#evidence)

## 相關主題

- [使用者行為與資料表示](signals.md)
- [內容式、協同過濾與混合式推薦](methods.md)
