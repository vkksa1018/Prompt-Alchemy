# 範例輸出（exampleOutput）改為區塊陣列 — 設計文件

日期：2026-07-16
範圍：**僅後台表單**（前台顯示留待後續）

## 背景

後台 Prompt / Skill 表單的「範例輸出」目前是單一 textarea，只能存純文字（`src/components/admin/skillForm.jsx:266-273`，預設值 `exampleOutput: ""`）。

需求是讓填表的人能新增多個輸出區塊，每個區塊自己選類型（文字 / 圖片 / 影片 / HTML），排序由使用者用箭頭調整、`seq` 送出時自動生成。

## 資料形狀

`exampleOutput` 從字串改為 block 陣列：

```js
exampleOutput: [
  { type: "text",  data: { context: "【錯誤原因】…" }, seq: 0 },
  {
    type: "image",
    data: { context: "https://…/a.png", alt: "示意圖", caption: "gpt-image-2" },
    seq: 1,
  },
]
```

- `type`：`"text" | "image" | "video" | "html"`
- `data.context`：必填。`text` 是文字內容；`image` / `video` / `html` 是網址。
- `data.alt` / `data.caption`：選填，**僅 `image` / `video` / `html` 有**。`text` 的 `data` 只有 `context`。
- `seq`：非表單欄位。送出時依陣列順序自動生成（0-based index）。

`html` 的 context 指向一個 HTML 檔案的網址，前台將以 iframe 嵌入（前台不在本次範圍）。

## 元件與職責

### `src/components/admin/exampleOutputBlocks.js`（新增）

純函式模組，不含 React。這是形狀轉換的唯一出入口。

- `toBlocks(exampleOutput)` — 把任意舊形狀正規化成 block 陣列，給編輯模式載入用：
  - 純字串 → 一個 `text` block（空字串 → `[]`）
  - `{ outputText, outputImages }` → `outputText` 轉一個 text block（非空才轉）＋ 每個有 `url` 的 image 轉一個 image block
  - 已是 block 陣列 → 原樣通過
  - `null` / `undefined` / 其他 → `[]`
- `toPayload(blocks)` — 送出前：依順序補 `seq`，並移除 `text` block 的 `alt` / `caption`。

### `src/components/admin/skillForm.jsx`（修改）

- `DEFAULTS.exampleOutput` 由 `""` 改為 `[]`
- 表單載入時以 `toBlocks(initialValues.exampleOutput)` 正規化
- 用 react-hook-form 的 `useFieldArray`（欄位名 `exampleOutput`）管理區塊：`append` 新增、`remove` 刪除、`swap` 上下排序
- 送出時經 `toPayload` 再交給 `props.onSubmit`
- 依 `type` 切換欄位：
  - `text` → `context` 用 textarea（多行）
  - `image` / `video` / `html` → `context` 用單行 input、label 為「網址」，並顯示 `alt`（替代文字）、`caption`（圖說）兩個選填欄位
- 切換 type 時保留已填的 `context`；`alt` / `caption` 隱藏時保留在表單狀態，切回來仍在（`toPayload` 負責在送出時裁掉）

### `src/api/adminApi.js`（修改）

`createSkill` 的 `exampleOutput: data.exampleOutput || ""` 改為 `|| []`。`EDITABLE_SKILL_FIELDS` 已含 `exampleOutput`，透傳即可，`updateSkill` 不需改。

## 驗證

- 整個「範例輸出」維持選填 — 可以一個 block 都不加
- 有 block 時 `context` 必填，沿用現有 `requiredText` 的 trim 邏輯
- **不驗證網址格式**（刻意決定：讓填表的人自由貼）
- `alt` / `caption` 永遠選填

## UI

「範例內容」區塊內，範例輸出呈現為可增減的區塊卡片，每張卡片右上有 `↑` `↓` `✕`，底部一個「+ 新增區塊」按鈕。type 的中文標籤：文字 / 圖片 / 影片 / HTML。沿用檔案既有的 `inputClass`、`Label`、chips 按鈕樣式，不引入新樣式系統。

排序用上下箭頭，**不做拖曳**（拖曳需額外套件，此規模不划算）。

## 測試

專案只有 vitest + jsdom，無 React Testing Library，現有測試（`src/api/*.test.js`）皆為純函式測試。沿用此慣例：

`src/components/admin/exampleOutputBlocks.test.js` 測 `toBlocks` 與 `toPayload` — 形狀轉換、seq 生成、`text` block 的欄位裁切、各種 null / 空值邊界。

UI 行為（按新增多一張卡片、箭頭換位）由 `useFieldArray` 本身保證，不另外測 — 要測就得裝 RTL，對此規模不划算。

## 已知後果

本次不動 `src/api/promptApi.js:41` 的 `normalizeExampleOutput` 與 `src/pages/prompt/skillDetail.jsx:72-80`，兩者仍讀 `{ outputText, outputImages }`。因此**用新表單存的資料，前台範例輸出區塊會暫時顯示不出來**。這是已接受的取捨，前台改造為後續工作。

`src/api/mockData.js` 的 9 筆 `example_output` 維持舊形狀，不在本次範圍。編輯這些舊資料時，`toBlocks` 會負責轉換。
