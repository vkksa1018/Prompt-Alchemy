import { useNavigate } from "react-router-dom";
import PromptCard from "../../components/PromptCard/promptCard";
import { initialPrompts } from "../prompt/skills";
import useAuth from "../../hooks/useAuth";

export default function Favorite() {
  const navigate = useNavigate();
  const { favorites, clearFavorites, resetFavorites } = useAuth();

  const favoritePrompts = initialPrompts.filter((prompt) =>
    favorites.includes(prompt.id)
  );

  const handleClearAll = () => {
    clearFavorites();
  };

  const handleReset = () => {
    resetFavorites();
  };

  return (
    <div
      data-pencil-name="Favorites Main"
      className="box-border w-full h-full flex flex-col gap-4.5 p-[8px_6px] justify-start items-start "
    >
      <div
        data-pencil-name="Favorites Header"
        className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
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
          className="box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4.5 justify-start items-start"
        >
          {favoritePrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          data-pencil-name="Empty State Wrap"
          className="box-border w-full flex-1 flex flex-col gap-3.5 justify-center items-center py-12 mx-auto"
        >
          <div
            data-pencil-name="Empty Icon"
            className="text-[56px]/[normal] box-border text-[#FF00FF] font-normal text-left whitespace-nowrap"
          >
            ♡♡
          </div>
          <div
            data-pencil-name="Empty Text"
            className="text-[16px]/[26px] box-border w-90 text-[#7DCEA0] font-normal text-center"
          >
            你還沒有收藏任何 Prompt / Skill
            <br />
            去列表找幾個趁手的 AI 幫手吧！
          </div>
          <button
            type="button"
            onClick={() => navigate("/skills")}
            data-pencil-name="Browse CTA"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 py-3 px-5 justify-start items-start bg-[#39FF14] rounded-lg border-none cursor-pointer hover:bg-[#39FF14]/90 transition-colors"
          >
            <div
              data-pencil-name="Browse CTA Label"
              className="text-[14px]/[normal] box-border text-[#0A0E1A] font-semibold text-left whitespace-nowrap"
            >
              前往技能列表
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
