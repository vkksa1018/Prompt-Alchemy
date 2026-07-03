import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../../components/PromptCard/promptCard";

export default function Favorite() {
  const navigate = useNavigate();
  const [favoritePrompts, setFavoritePrompts] = useState([
    {
      id: 1,
      title: "後端 API 審查",
      description: "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。",
      likes: 32,
      uses: 125,
      tags: ["後端", "#API", "#Security"]
    },
    {
      id: 2,
      title: "前端 Debug 助手",
      description: "協助找出 React / Next.js 專案的錯誤原因與除錯線索。",
      likes: 21,
      uses: 98,
      tags: ["前端", "#React", "#Debug"]
    },
    {
      id: 3,
      title: "SQL 查詢優化",
      description: "分析 SQL 查詢效能瓶頸與最佳化建議。",
      likes: 18,
      uses: 77,
      tags: ["後端", "#SQL", "#Database"]
    },
    {
      id: 4,
      title: "資安漏洞檢查清單",
      description: "檢查常見的 Web 與雲端環境風險掃描方式。",
      likes: 15,
      uses: 63,
      tags: ["資安", "#Security", "#Web"]
    }
  ]);

  const handleClearAll = () => {
    setFavoritePrompts([]);
  };

  const handleReset = () => {
    setFavoritePrompts([
      {
        id: 1,
        title: "後端 API 審查",
        description: "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。",
        likes: 32,
        uses: 125,
        tags: ["後端", "#API", "#Security"]
      },
      {
        id: 2,
        title: "前端 Debug 助手",
        description: "協助找出 React / Next.js 專案的錯誤原因與除錯線索。",
        likes: 21,
        uses: 98,
        tags: ["前端", "#React", "#Debug"]
      },
      {
        id: 3,
        title: "SQL 查詢優化",
        description: "分析 SQL 查詢效能瓶頸與最佳化建議。",
        likes: 18,
        uses: 77,
        tags: ["後端", "#SQL", "#Database"]
      },
      {
        id: 4,
        title: "資安漏洞檢查清單",
        description: "檢查常見的 Web 與雲端環境風險掃描方式。",
        likes: 15,
        uses: 63,
        tags: ["資安", "#Security", "#Web"]
      }
    ]);
  };

  return (
    <div
      data-pencil-name="Favorites Main"
      className="box-border w-full h-full flex flex-col gap-[18px] p-[8px_6px] justify-start items-start font-['JetBrains_Mono',system-ui,sans-serif]"
    >
      <div
        data-pencil-name="Favorites Header"
        className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
      >
        <div className="flex flex-row justify-between items-center w-full">
          <div
            data-pencil-name="Favorites Title"
            className="text-[34px]/[normal] box-border text-[#FFFFFF] font-bold text-left whitespace-nowrap"
          >
            我的收藏
          </div>
          <div>
            {favoritePrompts.length > 0 ? (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[12px] text-[#FF00FF] border border-[#FF00FF] py-1 px-3 rounded hover:bg-[#FF00FF]/10 transition-colors cursor-pointer bg-transparent"
              >
                模擬清空收藏
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="text-[12px] text-[#39FF14] border border-[#39FF14] py-1 px-3 rounded hover:bg-[#39FF14]/10 transition-colors cursor-pointer bg-transparent"
              >
                重設模擬資料
              </button>
            )}
          </div>
        </div>
        <div
          data-pencil-name="Favorites Subtitle"
          className="text-[16px]/[normal] box-border text-[#7DCEA0] font-normal text-left whitespace-nowrap"
        >
          {favoritePrompts.length > 0
            ? `你收藏了 ${favoritePrompts.length} 個 Prompt / Skill`
            : "你還沒有收藏任何項目"}
        </div>
      </div>

      {favoritePrompts.length > 0 ? (
        <div
          data-pencil-name="Favorites Grid"
          className="box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 gap-[18px] justify-start items-start"
        >
          {favoritePrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          data-pencil-name="Empty State Wrap"
          className="box-border w-full flex-1 flex flex-col gap-[14px] justify-center items-center py-12 mx-auto"
        >
          <div
            data-pencil-name="Empty Icon"
            className="text-[56px]/[normal] box-border text-[#FF00FF] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
          >
            ♡♡
          </div>
          <div
            data-pencil-name="Empty Text"
            className="text-[16px]/[26px] box-border w-[360px] text-[#7DCEA0] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-center"
          >
            你還沒有收藏任何 Prompt / Skill
            <br />
            去列表找幾個趁手的 AI 幫手吧！
          </div>
          <button
            type="button"
            onClick={() => navigate("/skills")}
            data-pencil-name="Browse CTA"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 py-[12px] px-[20px] justify-start items-start bg-[#39FF14] rounded-[8px] border-none cursor-pointer hover:bg-[#39FF14]/90 transition-colors"
          >
            <div
              data-pencil-name="Browse CTA Label"
              className="text-[14px]/[normal] box-border text-[#0A0E1A] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              前往技能列表
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
