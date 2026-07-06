// Prompt / Skill 管理頁：篩選列 + 列表。
// 篩選條件（關鍵字/類型/分類/狀態）存在這頁，實際過濾邏輯放在 adminApi 的 getSkills。
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "../../components/admin/adminPageHeader";
import SkillFilterBar from "../../components/admin/skillFilterBar";
import SkillTable from "../../components/admin/skillTable";
import { getSkills, getCategories, archiveSkill } from "../../api/adminApi";
import { alertHelper } from "../../utils/sweetAlert";

// 篩選的初始值（空字串代表「全部」）。
const EMPTY_FILTERS = {
  keyword: "",
  contentTypeId: "",
  categoryId: "",
  status: "",
};

export default function AdminSkillsPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]); // 分類篩選下拉用
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);

  // 載入分類清單（只需一次，給篩選列的分類選項用）。
  useEffect(() => {
    let active = true;
    getCategories().then((data) => {
      if (active) setCategories(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // filters 一改變就重新查詢列表（帶著目前的篩選條件）。
  useEffect(() => {
    let active = true;
    getSkills(filters).then((data) => {
      if (!active) return;
      setSkills(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [filters]);

  // 封存後用目前條件重抓列表（不改 loading，避免畫面閃爍）。
  const reload = () => {
    getSkills(filters).then(setSkills);
  };

  // 封存：先確認，再把 status 改成 archived（非刪除，資料仍留在後台）。
  const handleArchive = async (skill) => {
    const confirmed = await alertHelper.confirm(
      "確定要封存嗎？",
      `「${skill.title}」封存後前台將不再顯示，但資料仍保留在後台。`,
    );
    if (!confirmed) return;
    await archiveSkill(skill.id);
    reload();
  };

  return (
    <>
      <AdminPageHeader
        title="Prompt / Skill 管理"
        description="管理所有 Prompt / Skill 資料"
        actions={
          <button
            type="button"
            onClick={() => navigate("/admin/skills/new")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + 新增 Prompt / Skill
          </button>
        }
      />

      <div className="space-y-4 p-8">
        <SkillFilterBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
        />
        <SkillTable
          skills={skills}
          loading={loading}
          onArchive={handleArchive}
        />
      </div>
    </>
  );
}
