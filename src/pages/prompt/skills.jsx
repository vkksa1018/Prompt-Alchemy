import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PromptCard from "../../components/PromptCard/promptCard";
import { getPublishedPrompts, getCategories, getTags } from "../../api/promptApi";

const getTagStyles = (label) => {
  const cleanLabel = label.toLowerCase().replace("#", "");
  switch (cleanLabel) {
    case "api":
      return {
        bg: "bg-[#0A1520]",
        border: "border-[#00FFFF]",
        text: "text-[#00FFFF]",
      };
    case "react":
    case "vite":
      return {
        bg: "bg-[#1A0A1A]",
        border: "border-[#FF00FF]",
        text: "text-[#FF00FF]",
      };
    case "sql":
    case "database":
    case "mysql":
      return {
        bg: "bg-[#1A1A0A]",
        border: "border-[#FFD700]",
        text: "text-[#FFD700]",
      };
    case "security":
    case "web":
      return {
        bg: "bg-[#0A1F1A]",
        border: "border-[#39FF14]",
        text: "text-[#39FF14]",
      };
    case "debug":
      return {
        bg: "bg-[#1A0A0A]",
        border: "border-[#FF8C00]",
        text: "text-[#FF8C00]",
      };
    case "node.js":
    case "node":
    case "express":
      return {
        bg: "bg-[#1A0A15]",
        border: "border-[#FF3366]",
        text: "text-[#FF3366]",
      };
    default:
      return {
        bg: "bg-[#0F1E24]",
        border: "border-[#3b82f6]",
        text: "text-[#3b82f6]",
      };
  }
};

export default function Skills() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // "date" | "popularity"

  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Load categories
    getCategories().then((cats) => {
      setCategories([
        { name: "全部", icon: null },
        { name: "最新技能", icon: "✦", iconColor: "text-[#00FFFF]" },
        { name: "熱門分類", icon: "🔥", iconColor: "text-[#FF8C00]" },
        ...cats.map((c) => ({ name: c.name, icon: null })),
      ]);
    });

    // Load tags
    getTags().then((tgList) => {
      setTags(tgList);
    });

    // Load prompts
    getPublishedPrompts().then((list) => {
      setPrompts(list);
    });
  }, []);

  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Filter & Sort logic
  const filteredPrompts = prompts
    .filter((prompt) => {
      // Category filter
      if (selectedCategory === "最新技能") return prompt.isNew;
      if (selectedCategory === "熱門分類") return prompt.isHot;
      if (selectedCategory !== "全部" && prompt.category !== selectedCategory)
        return false;

      // Tag filter
      if (selectedTag && !prompt.tags.includes(selectedTag)) return false;

      // Search text filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (prompt.title || "").toLowerCase().includes(query) ||
          (prompt.description || "").toLowerCase().includes(query) ||
          (prompt.category || "").toLowerCase().includes(query) ||
          (prompt.tags || []).some((tag) => (tag || "").toLowerCase().includes(query))
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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleTagToggle = (tagLabel) => {
    setSelectedTag((prev) => (prev === tagLabel ? null : tagLabel));
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0E1A] text-[#E0F0E8] py-8 px-6 flex flex-col items-center">
      <div
        data-pencil-name="List Content"
        className="box-border w-full max-w-300 flex flex-col lg:flex-row gap-6 justify-start items-start"
      >
        {/* Filters Sidebar */}
        <div
          data-pencil-name="Filters Sidebar"
          className="box-border w-full lg:w-62.5 shrink-0 flex flex-col gap-3.5 p-4.5 justify-start items-start bg-[#111827] border border-[#1A3A2A] rounded-2xl"
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
                className={`box-border w-full h-fit flex flex-row gap-2 py-2.5 px-3 justify-start items-center border-0 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-[#39FF14] text-[#0A0E1A] font-semibold"
                    : "bg-transparent text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                {cat.icon && (
                  <span
                    className={`text-[12px]/[normal] ${isSelected ? "text-[#0A0E1A]" : cat.iconColor}`}
                  >
                    {cat.icon}
                  </span>
                )}
                <span className="text-[14px]/[normal] whitespace-nowrap">
                  {cat.name}
                </span>
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
            className="box-border w-full h-fit flex flex-wrap gap-2 justify-start items-start"
          >
            {tags.map((tag) => {
              const style = getTagStyles(tag.name);
              const isSelected = selectedTag === tag.name;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.name)}
                  className={`box-border w-fit h-fit flex flex-row gap-0 py-1.5 px-2.5 justify-start items-start rounded-[999px] border cursor-pointer transition-all ${
                    isSelected
                      ? `bg-transparent ${style.border} ring-2 ring-offset-2 ring-offset-[#111827] ring-[#00FFFF]`
                      : `${style.bg} ${style.border} hover:opacity-80`
                  }`}
                >
                  <span
                    className={`text-[12px]/[normal] ${style.text} whitespace-nowrap`}
                  >
                    {tag.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill List Region */}
        <div
          data-pencil-name="Skill List Region"
          className="box-border flex-1 w-full flex flex-col gap-4.5 justify-start items-start"
        >
          {/* List Search Bar */}
          <div
            data-pencil-name="List Search Bar"
            className="box-border w-full h-fit flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111827]/40 p-4 rounded-xl border border-[#1A3A2A]/50"
          >
            <div
              data-pencil-name="Search Field"
              className="box-border w-full sm:w-105 shrink-0 h-fit flex flex-row gap-2.5 py-2.5 px-3.5 justify-start items-center bg-[#0F1F18] border border-[#1A3A2A] rounded-[10px] focus-within:border-[#39FF14] transition-all"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋 Prompt / Skill..."
                className="w-full bg-transparent border-0 text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none text-[13px] "
              />
            </div>

            <div
              data-pencil-name="Sort Group"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-2 justify-start items-center"
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
                className={`box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 py-2 px-3.5 justify-start items-center border-0 rounded-lg cursor-pointer transition-all ${
                  sortBy === "date"
                    ? "bg-[#39FF14] text-[#0A0E1A] font-semibold"
                    : "bg-transparent text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                <span className="text-[13px]/[normal] whitespace-nowrap">
                  依日期
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("popularity")}
                className={`box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 py-2 px-3.5 justify-start items-center border rounded-lg cursor-pointer transition-all ${
                  sortBy === "popularity"
                    ? "bg-[#39FF14] border-[#39FF14] text-[#0A0E1A] font-semibold"
                    : "bg-transparent border-[#1A3A2A] text-[#7DCEA0] hover:bg-[#39FF14]/10"
                }`}
              >
                <span className="text-[13px]/[normal] whitespace-nowrap">
                  依熱門度
                </span>
              </button>
            </div>
          </div>

          {/* List Cards */}
          <div
            data-pencil-name="List Cards"
            className="box-border w-full h-fit flex flex-col gap-4 justify-start items-start"
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

