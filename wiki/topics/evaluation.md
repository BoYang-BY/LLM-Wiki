# 推薦系統評估

## 資料切分

用訓練資料建立規則或模型，用保留的測試互動檢查結果。GroupLens 原始發行包提供預切分。 [S02](../sources/S02.md#evidence)

TensorFlow 教程讀取 TFDS 的 100K 資料後自行切分。教學時應先說明特定實驗的切分做法。 [S03](../sources/S03.md#evidence)

## 前 K 名命中

前 K 名命中（Top-K hit）在每個示例只保留一個測試正例時很好解釋。如果保留的是《島嶼漫步》，它出現在前三名就是一次命中。彙總多個測試例就能比較檢索方法。 [S03](../sources/S03.md#evidence)

## 離線與線上

離線評估（Offline evaluation）用已記錄資料比較版本，適合早期篩選。線上 A/B 測試（A/B testing）讓不同測試組實際使用指定版本，再比較事先選定的指標。Netflix 2015 年論文以相關性指標篩選候選方案，並以實驗觀察會員留存和中期參與。 [S06](../sources/S06.md#evidence)

## 相關主題

- [基礎概念與應用](basics.md)
- [倫理與實務挑戰](ethics.md)
