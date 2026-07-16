# Prompt / Skill 狀態改為布林（啟用 / 未啟用）— 設計文件

日期：2026-07-16
範圍：後台狀態欄位與相關 UI，前台不需改動

## 背景

後台的「狀態」目前是三選一的下拉：草稿 / 已發布 / 封存（`STATUS_OPTIONS`，`adminApi.js:210`）。需求是簡化為布林 —只有啟用與未啟用，草稿的概念不再需要。

探查現況後發現 `status` 不只是多餘，而且是錯的：

- **前台的可見性早就由布林決定。** `getPublishedPrompts()`（`promptApi.js:73`）過濾的是 `s.is_active`，與 `status` 無關。
- **seed 資料沒有 `status` 欄位。** `skillItemsTable` 只有 `is_active: true`。`status` 僅存在於後台新增的紀錄上。
- **因此後台列表顯示的狀態是假的。** `StatusBadge` 找不到 `status` 就 fallback 成 draft 樣式，於是所有 seed 進來的 prompt 都顯示為「草稿」，儘管它們在前台全部是上架中。
- 前台沒有任何地方讀取 `status`（已全域搜尋確認）。

所以本次不是新增欄位，而是**移除 `status`、統一使用既有的 `isActive`**，順帶消除上述矛盾。

## 資料欄位

移除 `status`，以 `isActive` 為單一事實來源。比照會員管理的既有做法（`adminApi.js:276-277`）**同時寫入兩種命名**：

```js
isActive: data.isActive ?? true,
is_active: data.isActive ?? true,  // 前台 getPublishedPrompts 讀這個
```

**這是本設計的關鍵。** seed 紀錄只有 snake_case 的 `is_active`，而前台讀的正是它。若後台只寫 camelCase 的 `isActive`，在後台按「停用」後前台仍會照常上架 —停用完全失效。

讀取一律透過單一函式處理 fallback，避免判斷式散落各處：

```js
export function isSkillActive(skill) {
  return skill?.isActive ?? skill?.is_active ?? true;
}
```

（同樣比照 `adminApi.js:226` 既有的 `u.isActive ?? u.is_active ?? true` 寫法。）

## 移除項目

- `STATUS_OPTIONS`、`getStatusLabel`（`adminApi.js:210-219`）
- `createSkill` 的 `status` 欄位（`adminApi.js:360`）
- `EDITABLE_SKILL_FIELDS` 中的 `"status"`，改為 `"isActive"`
- `promptApi.js:98`、`promptApi.js:150` 傳給前台的 `status`（前台未使用）
- `archiveSkill(id)` → 改為 `setSkillActive(id, isActive)`，語意對應按鈕

`listSkills` 的篩選由 `s.status === status` 改為依 `isSkillActive(s)` 比對。

## UI 變動

| 位置 | 現在 | 改成 |
|---|---|---|
| `skillForm.jsx`「發布設定」 | 狀態下拉（三選一） | 滑動 toggle「啟用中 / 已停用」，比照 `parameterFormModal.jsx:82` |
| `statusBadge.jsx` | 三色 badge | 兩色：啟用 / 未啟用 |
| `skillTable.jsx` 封存按鈕 | 「封存」，archived 時 disabled | 「停用」／「啟用」，依目前狀態切換文字，不再 disabled |
| `skillFilterBar.jsx` 狀態篩選 | 三選項 | 全部（預設）／啟用／未啟用 |

表單 `DEFAULTS` 的 `status: "draft"` 改為 `isActive: true`。狀態不再是必填驗證項 —布林永遠有值。

篩選列預設維持「全部」：後台本來就該看到全部資料。

## 測試

沿用專案的純函式測試慣例（`src/api/*.test.js`，無 React Testing Library）。

測 `isSkillActive` 的 fallback 順序與雙寫行為 —這是最容易出錯、且純邏輯的部分：

- `{ isActive: false, is_active: true }` → `false`（camelCase 優先）
- `{ is_active: false }` → `false`（僅 snake_case，即 seed 資料）
- `{}` / `null` → `true`（預設啟用）
- `createSkill` / `updateSkill` 後，兩個欄位皆寫入且一致

UI toggle 本身不另外測。

## 已知後果

改動後，後台列表中 seed 資料將正確顯示為「啟用」，不再假裝是草稿。這是修正，非退步。

`status` 欄位可能仍殘留在既有 localStorage 的紀錄上，但不再被任何程式碼讀取，無需遷移。
