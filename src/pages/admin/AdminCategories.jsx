// 分類管理頁：列出分類、新增 / 編輯（彈窗）、停用。
// 第一版不做真正刪除，一律用「停用」（把 isActive 改成 false）。
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/adminPageHeader";
import CategoryFormModal from "../../components/admin/categoryFormModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  disableCategory,
} from "../../api/adminApi";
import { alertHelper } from "../../utils/sweetAlert";
import { formatDate } from "../../utils/date";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  // editing 有值 → 編輯該筆；為 null → 新增。彈窗會依此切換模式。
  const [editing, setEditing] = useState(null);

  // 重新抓分類清單，供新增 / 編輯 / 停用後刷新畫面用。
  const loadCategories = () => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  // 進頁先載入一次。用 active 旗標避免卸載後才 setState。
  useEffect(() => {
    let active = true;
    getCategories().then((data) => {
      if (!active) return;
      setCategories(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = () => {
    setEditing(null); // 清空 → 新增模式
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditing(category); // 帶入該筆 → 編輯模式
    setModalOpen(true);
  };

  // 彈窗送出：有 editing 就更新、否則新增；完成後關窗並刷新列表。
  const handleSubmit = async (form) => {
    if (editing) {
      await updateCategory(editing.id, form);
    } else {
      await createCategory(form);
    }
    setModalOpen(false);
    loadCategories();
  };

  // 停用：先跳確認視窗，確認後把 isActive 改成 false（非刪除）。
  const handleDisable = async (category) => {
    const confirmed = await alertHelper.confirm(
      "確定要停用此分類嗎？",
      `分類「${category.name}」將被停用。`,
    );
    if (!confirmed) return;
    await disableCategory(category.id);
    loadCategories();
  };

  return (
    <>
      <AdminPageHeader
        title="分類管理"
        description="管理 Prompt / Skill 的分類"
        actions={
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + 新增分類
          </button>
        }
      />

      <div className="p-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">分類名稱</th>
                  <th className="px-6 py-3 font-medium">分類說明</th>
                  <th className="px-6 py-3 font-medium">狀態</th>
                  <th className="px-6 py-3 font-medium">建立時間</th>
                  <th className="px-6 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      載入中…
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      尚無分類資料
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="text-gray-700 dark:text-gray-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </td>
                      <td className="max-w-xs px-6 py-4 text-gray-500 dark:text-gray-400">
                        <span className="line-clamp-2">
                          {category.description || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {category.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                            啟用
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {category.createdAt
                          ? formatDate(category.createdAt)
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisable(category)}
                            disabled={!category.isActive}
                            className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                          >
                            停用
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 只有開啟時才掛載彈窗；key 隨編輯對象改變，
          切換「新增/不同分類」時會重新掛載，讓表單預設值正確重置。 */}
      {modalOpen && (
        <CategoryFormModal
          key={editing?.id || "new"}
          category={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
