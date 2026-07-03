import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PromptCard from "../../components/PromptCard/promptCard";

const initialPrompts = [
  {
    id: 1,
    title: "後端 API 審查",
    description: "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。",
    likes: 32,
    uses: 125,
    category: "後端開發",
    tags: ["#API", "#Security"],
    content: "請審查以下後端 API 程式碼的錯誤處理、安全性與 RESTful 回傳結構：\n\n[在此輸入程式碼]",
    date: "2026-07-01",
    isNew: true,
    isHot: true
  },
  {
    id: 2,
    title: "前端 Debug 助手",
    description: "協助找出 React / Next.js 專案的錯誤原因與除錯線索。",
    likes: 21,
    uses: 98,
    category: "前端開發",
    tags: ["#React", "#Debug"],
    content: "請分析以下 React/Next.js 錯誤訊息，並給出可能的修復方案及除錯步驟：\n\n[在此輸入錯誤訊息]",
    date: "2026-06-28",
    isNew: false,
    isHot: true
  },
  {
    id: 3,
    title: "SQL 查詢優化",
    description: "分析 SQL 查詢效能瓶頸與最佳化建議。",
    likes: 18,
    uses: 77,
    category: "後端開發",
    tags: ["#SQL"],
    content: "請分析以下 SQL 查詢的效能瓶頸，並提供最佳化建議及索引設計：\n\n[在此輸入 SQL 語句]",
    date: "2026-06-25",
    isNew: false,
    isHot: false
  },
  {
    id: 4,
    title: "資安漏洞檢查清單",
    description: "檢查常見的 Web 與雲端環境風險掃描方式。",
    likes: 15,
    uses: 63,
    category: "資安相關",
    tags: ["#Security"],
    content: "請提供一份針對以下環境的 Web 應用程式安全檢測清單與常見漏洞防範建議：\n\n[在此說明技術棧環境]",
    date: "2026-06-20",
    isNew: false,
    isHot: false
  },
  {
    id: 5,
    title: "英文翻譯與潤飾",
    description: "將中文技術文件翻譯為專業流暢的英文，並提供多種口吻潤飾。",
    likes: 42,
    uses: 180,
    category: "翻譯助手",
    tags: ["#Translation"],
    content: "請將以下中文技術內容翻譯成專業、自然的英文，並提供 Academic 與 Professional 兩種口吻：\n\n[在此輸入內容]",
    date: "2026-07-02",
    isNew: true,
    isHot: true
  },
  {
    id: 6,
    title: "Regex 自動生成器",
    description: "輸入期望匹配與排除的規則，自動產生高效率的正則表達式。",
    likes: 29,
    uses: 110,
    category: "小工具",
    tags: ["#Debug"],
    content: "請根據以下條件生成一個高效的正則表達式，並附上測試案例說明：\n- 匹配：[條件]\n- 排除：[條件]\n\n輸入字串範例：",
    date: "2026-06-15",
    isNew: false,
    isHot: false
  }
];

export default function Skills() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // "date" | "popularity"

  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Filter & Sort logic
  const filteredPrompts = initialPrompts
    .filter((prompt) => {
      // Category filter
      if (selectedCategory === "最新技能") return prompt.isNew;
      if (selectedCategory === "熱門分類") return prompt.isHot;
      if (selectedCategory !== "全部" && prompt.category !== selectedCategory) return false;

      // Tag filter
      if (selectedTag && !prompt.tags.includes(selectedTag)) return false;

      // Search text filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(query) ||
          prompt.description.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") {
        return b.likes - a.likes;
      }
      return new Date(b.date) - new Date(a.date);
    });

  const categories = [
    { name: "全部", icon: null },
    { name: "最新技能", icon: "✦", iconColor: "text-[#00FFFF]" },
    { name: "熱門分類", icon: "🔥", iconColor: "text-[#FF8C00]" },
    { name: "前端開發", icon: null },
    { name: "後端開發", icon: null },
    { name: "資安相關", icon: null },
    { name: "除錯技巧", icon: null },
    { name: "翻譯助手", icon: null },
    { name: "小工具", icon: null }
  ];

  const sidebarTags = [
    { label: "#API", bg: "bg-[#0A1520]", border: "border-[#00FFFF]", text: "text-[#00FFFF]" },
    { label: "#React", bg: "bg-[#1A0A15]", border: "border-[#FF00FF]", text: "text-[#FF00FF]" },
    { label: "#SQL", bg: "bg-[#1A1A0A]", border: "border-[#FFD700]", text: "text-[#FFD700]" },
    { label: "#Security", bg: "bg-[#0A1F1A]", border: "border-[#39FF14]", text: "text-[#39FF14]" },
    { label: "#Debug", bg: "bg-[#1A0A0A]", border: "border-[#FF8C00]", text: "text-[#FF8C00]" },
    { label: "#Node.js", bg: "bg-[#1A0A15]", border: "border-[#FF3366]", text: "text-[#FF3366]" }
  ];

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleTagToggle = (tagLabel) => {
    setSelectedTag((prev) => (prev === tagLabel ? null : tagLabel));
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0E1A] text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] py-8 px-6 flex flex-col items-center">
      <div
        data-pencil-name="List Content"
        className="box-border w-full max-w-[1200px] flex flex-col lg:flex-row gap-[24px] justify-start items-start"
      >
        {/* Filters Sidebar */}
        <div
          data-pencil-name="Filters Sidebar"
          className="box-border w-full lg:w-[250px] shrink-0 flex flex-col gap-[14px] p-[18px] justify-start items-start bg-[#111827] border border-[#1A3A2A] rounded-[16px]"
        >
          <div
            data-pencil-name="Sidebar Heading"
            className="text-[16px]/[normal] box-border text-[#FFD700] font-bold text-left whitespace-nowrap"
          >
            分類
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`box-border w-full h-fit flex flex-row gap-[8px] py-[10px] px-[12px] justify-start items-center border-0 rounded-[8px] cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-[#39FF14] text-[#0A0E1A] font-semibold" : "bg-transparent text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                {cat.icon && (
                  <span className={`text-[12px]/[normal] ${isSelected ? "text-[#0A0E1A]" : cat.iconColor}`}>
                    {cat.icon}
                  </span>
                )}
                <span className="text-[14px]/[normal] whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}

          <div
            data-pencil-name="Tag Heading"
            className="text-[16px]/[normal] box-border text-[#FFD700] font-bold text-left whitespace-nowrap mt-4"
          >
            標籤
          </div>

          <div
            data-pencil-name="Tag Column"
            className="box-border w-full h-fit flex flex-wrap gap-[8px] justify-start items-start"
          >
            {sidebarTags.map((tag) => {
              const isSelected = selectedTag === tag.label;
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagToggle(tag.label)}
                  className={`box-border w-fit h-fit flex flex-row gap-0 py-[6px] px-[10px] justify-start items-start rounded-[999px] border cursor-pointer transition-all ${
                    isSelected
                      ? `bg-transparent ${tag.border} ring-2 ring-offset-2 ring-offset-[#111827] ring-[#00FFFF]`
                      : `${tag.bg} ${tag.border} hover:opacity-80`
                  }`}
                >
                  <span className={`text-[12px]/[normal] ${tag.text} whitespace-nowrap`}>
                    {tag.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill List Region */}
        <div
          data-pencil-name="Skill List Region"
          className="box-border flex-1 w-full flex flex-col gap-[18px] justify-start items-start"
        >
          {/* List Search Bar */}
          <div
            data-pencil-name="List Search Bar"
            className="box-border w-full h-fit flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111827]/40 p-4 rounded-xl border border-[#1A3A2A]/50"
          >
            <div
              data-pencil-name="Search Field"
              className="box-border w-full sm:w-[420px] shrink-0 h-fit flex flex-row gap-[10px] py-[10px] px-[14px] justify-start items-center bg-[#0F1F18] border border-[#1A3A2A] rounded-[10px]"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋 Prompt / Skill..."
                className="w-full bg-transparent border-0 text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none text-[13px] font-['JetBrains_Mono',system-ui,sans-serif]"
              />
            </div>

            <div
              data-pencil-name="Sort Group"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
            >
              <div
                data-pencil-name="Sort Label"
                className="text-[13px]/[normal] box-border text-[#7DCEA0] font-normal text-left whitespace-nowrap"
              >
                排序：
              </div>
              <button
                type="button"
                onClick={() => setSortBy("date")}
                className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] py-[8px] px-[14px] justify-start items-center border-0 rounded-[8px] cursor-pointer transition-all ${
                  sortBy === "date" ? "bg-[#39FF14] text-[#0A0E1A] font-semibold" : "bg-transparent text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                <span className="text-[13px]/[normal] whitespace-nowrap">依日期</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("popularity")}
                className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] py-[8px] px-[14px] justify-start items-center border rounded-[8px] cursor-pointer transition-all ${
                  sortBy === "popularity"
                    ? "bg-[#39FF14] border-[#39FF14] text-[#0A0E1A] font-semibold"
                    : "bg-transparent border-[#1A3A2A] text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                <span className="text-[13px]/[normal] whitespace-nowrap">依熱門度</span>
              </button>
            </div>
          </div>

          {/* List Cards */}
          <div
            data-pencil-name="List Cards"
            className="box-border w-full h-fit flex flex-col gap-[16px] justify-start items-start"
          >
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <div key={prompt.id} className="w-full flex">
                  <PromptCard prompt={prompt} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12 text-[#7DCEA0]/60 border border-[#1A3A2A] border-dashed rounded-xl">
                沒有找到符合條件的 Prompt。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
