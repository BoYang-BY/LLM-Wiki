# 內容式、協同過濾與混合式推薦

## 內容式推薦

內容式推薦（Content-based recommendation）比對個人偏好與物品特徵。例如依偏好的科幻標籤把含科幻標籤的電影排前面。 [S04](../sources/S04.md#evidence)

## 協同過濾

協同過濾（Collaborative filtering）從多人互動找規律。以虛構例子，甲和乙都喜歡《星港》，乙還喜歡《週末劇場》。在有更多共同互動支持相似性的情況下，可把《週末劇場》列為甲的候選。教材可用矩陣和箭頭表示這條推論。 [S04](../sources/S04.md#evidence)

## 混合式推薦

混合式推薦（Hybrid recommendation）組合多種推薦策略。例如把兩種方法的分數加權，或先使用一種方法再由另一種細分候選。Burke 的 Entree 案例使用餐廳條件和協同訊號。 [S04](../sources/S04.md#evidence)

回顧把冷啟動與稀疏列入混合式研究處理的挑戰。選擇組合前先盤點可用資料，再用相同條件比較。 [S05](../sources/S05.md#evidence)

## 相關主題

- [使用者行為與資料表示](signals.md)
- [冷啟動與進階技術](cold-start.md)
