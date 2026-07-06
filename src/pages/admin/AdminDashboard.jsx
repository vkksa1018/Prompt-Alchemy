// 後台首頁（/admin）：簡單的統計數字 + 快速前往管理頁的連結。
// 第一版刻意做輕，重點在讓內容管理流程可以跑通。
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageHeader from "../../components/admin/adminPageHeader";
import { getSkills, getCategories, getAdminAuth } from "../../api/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    categories: 0,
  });
  const admin = getAdminAuth();

  useEffect(() => {
    Promise.all([getSkills(), getCategories()]).then(([skills, categories]) => {
      setStats({
        total: skills.length,
        published: skills.filter((s) => s.status === "published").length,
        draft: skills.filter((s) => s.status === "draft").length,
        archived: skills.filter((s) => s.status === "archived").length,
        categories: categories.length,
      });
    });
  }, []);

  const cards = [
    { label: "全部 Prompt / Skill", value: stats.total },
    { label: "已發布", value: stats.published },
    { label: "草稿", value: stats.draft },
    { label: "封存", value: stats.archived },
    { label: "分類數量", value: stats.categories },
  ];

  return (
    <>
      <AdminPageHeader
        title="後台首頁"
        description={admin ? `歡迎回來，${admin.name}` : "後台管理入口"}
      />
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {card.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/skills"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            管理 Prompt / Skill
          </Link>
          <Link
            to="/admin/categories"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            管理分類
          </Link>
        </div>
      </div>
    </>
  );
}
