import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../utils/copyToClipboard";

export default function PromptCard({ prompt }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(prompt?.likes ?? 32);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const textToCopy = prompt?.content || prompt?.description || "Default Prompt Content";
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleCardClick = () => {
    navigate(`/skills/${prompt.id || 1}`);
  };

  const tags = prompt?.tags || ["後端", "#API", "#Security"];

  const getTagStyles = (index) => {
    const styles = [
      { bg: "bg-[#0A1F1A]", border: "border-[#39FF14]", text: "text-[#39FF14]" },
      { bg: "bg-[#0A1520]", border: "border-[#00FFFF]", text: "text-[#00FFFF]" },
      { bg: "bg-[#1A0A1A]", border: "border-[#FF00FF]", text: "text-[#FF00FF]" },
    ];
    return styles[index % styles.length];
  };

  return (
    <div
      onClick={handleCardClick}
      data-pencil-name={prompt?.title || "後端 API 審查"}
      className="box-border flex-1 h-fit flex flex-col gap-[14px] p-[16px_16px_14px_16px] justify-start items-start bg-[#111827] border border-[#1A4A2A] rounded-[12px] hover:border-[#39FF14]/40 hover:scale-[1.01] hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div
        data-pencil-name="Card Top"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
      >
        <div
          data-pencil-name="Card Meta"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
        >
          <div
            data-pencil-name="Icon Wrap"
            className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#0F1F18] rounded-[10px]"
          >
            <div
              data-pencil-name="Icon Glyph"
              className="text-[16px]/[normal] box-border text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              &gt;_
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLike}
          data-pencil-name="Heart"
          className="text-[12px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] active:scale-95 transition-all bg-transparent border-0 cursor-pointer font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
        >
          {liked ? "♥" : "♡"} {likesCount}
        </button>
      </div>
      <div
        data-pencil-name="Title Block"
        className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
      >
        <div
          data-pencil-name="Card Title"
          className="text-[20px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap overflow-hidden text-ellipsis w-full"
        >
          {prompt?.title || "後端 API 審查"}
        </div>
        <div
          data-pencil-name="Card Description"
          className="text-[12px]/[18px] box-border w-full text-[#7DCEA0] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left line-clamp-2 h-[36px] overflow-hidden"
        >
          {prompt?.description || "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。"}
        </div>
      </div>
      <div
        data-pencil-name="Tags Row"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        {tags.map((tag, idx) => {
          const style = getTagStyles(idx);
          return (
            <div
              key={idx}
              data-pencil-name={`Tag ${tag}`}
              className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[4px] px-[8px] justify-start items-start ${style.bg} border ${style.border} rounded-[999px]`}
            >
              <div
                data-pencil-name={`Tag Label ${tag}`}
                className={`text-[11px]/[normal] box-border ${style.text} font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap`}
              >
                {tag}
              </div>
            </div>
          );
        })}
      </div>
      <div
        data-pencil-name="Card Footer"
        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
      >
        <button
          type="button"
          onClick={handleCopy}
          data-pencil-name="Copy Pill"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[5px] px-[10px] justify-start items-start bg-[#0F1F18] hover:bg-[#39FF14]/15 active:scale-95 transition-all border-0 rounded-[999px] cursor-pointer"
        >
          <div
            data-pencil-name="Copy Label"
            className="text-[11px]/[normal] box-border text-[#00FFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
          >
            {copied ? "已複製" : "複製"}
          </div>
        </button>
        <div
          data-pencil-name="Uses"
          className="text-[12px]/[normal] box-border text-[#7DCEA0] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
        >
          {prompt?.uses || 125}
        </div>
      </div>
    </div>
  );
}
