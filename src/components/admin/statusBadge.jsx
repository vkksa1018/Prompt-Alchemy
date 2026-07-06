// 狀態徽章：把英文狀態（draft/published/archived）顯示成中文並配上顏色。
// 顯示文字由 getStatusLabel 轉換，資料庫實際存的仍是英文。
import { getStatusLabel } from "../../api/adminApi";

// 每種狀態對應的底色 / 文字色（含深色模式）。
const STATUS_STYLES = {
  draft:
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  published:
    "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  archived:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
