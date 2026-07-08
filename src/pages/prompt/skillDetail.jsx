import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../utils/copyToClipboard";
import useAuth from "../../hooks/useAuth";
import { getPromptById, getPublishedPrompts, incrementCopyCount } from "../../api/promptApi";

export default function SkillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite } = useAuth();

  const [promptData, setPromptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPromptById(id).then((data) => {
      if (data) {
        setPromptData(data);
        setLoading(false);
      } else {
        // Fallback to first published prompt if ID not found
        getPublishedPrompts().then((list) => {
          if (list.length > 0) {
            setPromptData(list[0]);
          }
          setLoading(false);
        });
      }
    });
  }, [id]);

  const isFavorited = favorites.includes(id);

  const handleCopyPrompt = async () => {
    if (!promptData) return;
    const success = await copyToClipboard(promptData.promptContent);
    if (success) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
      // Increment copy counter in dynamic local storage database
      incrementCopyCount(promptData.id).catch((err) => {
        console.error("Failed to increment copy count", err);
      });
    }
  };

  const handleCopyExample = async () => {
    if (!promptData) return;
    const success = await copyToClipboard(promptData.exampleContent);
    if (success) {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleFavorite(id);
  };


  const getTagStyles = (tag) => {
    const cleanTag = tag.trim().toLowerCase().replace("#", "");
    switch (cleanTag) {
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
      case "translation":
      case "english":
        return {
          bg: "bg-[#0F1E24]",
          border: "border-[#3b82f6]",
          text: "text-[#3b82f6]",
        };
      case "helper":
      case "regex":
        return {
          bg: "bg-[#150F24]",
          border: "border-[#a855f7]",
          text: "text-[#a855f7]",
        };
      default:
        let hash = 0;
        for (let i = 0; i < cleanTag.length; i++) {
          hash = cleanTag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const styles = [
          {
            bg: "bg-[#0A1F1A]",
            border: "border-[#39FF14]",
            text: "text-[#39FF14]",
          },
          {
            bg: "bg-[#0A1520]",
            border: "border-[#00FFFF]",
            text: "text-[#00FFFF]",
          },
          {
            bg: "bg-[#1A0A1A]",
            border: "border-[#FF00FF]",
            text: "text-[#FF00FF]",
          },
          {
            bg: "bg-[#1A1A0A]",
            border: "border-[#FF8C00]",
            text: "text-[#FF8C00]",
          },
        ];
        return styles[Math.abs(hash) % styles.length];
    }
  };

  if (loading || !promptData) {
    return (
      <div className="w-full min-h-screen bg-[#0A0E1A] text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] py-8 px-6 flex items-center justify-center">
        <div className="text-[18px] text-[#7DCEA0]">載入中...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0E1A] text-[#E0F0E8] py-8 px-6 flex flex-col items-center">
      <div
        data-pencil-name="Page Content"
        className="box-border w-full max-w-275 flex flex-col lg:flex-row gap-6 justify-start items-start"
      >
        {/* Detail Main */}
        <div
          data-pencil-name="Detail Main"
          className="box-border flex-1 w-full h-full flex flex-col gap-5.5 py-3 justify-start items-start"
        >
          {/* Back Row */}
          <div
            data-pencil-name="Back Row"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          >
            <Link
              to="/skills"
              data-pencil-name="Back Text Group"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-2.5 justify-start items-center no-underline hover:opacity-80 transition-opacity"
            >
              <div
                data-pencil-name="Back Arrow"
                className="text-[18px]/[normal] box-border text-[#E0F0E8] font-normal text-left whitespace-nowrap"
              >
                ←
              </div>
              <div
                data-pencil-name="Back Label"
                className="text-[14px]/[normal] box-border text-[#7DCEA0] font-normal text-left whitespace-nowrap"
              >
                返回列表
              </div>
            </Link>
            <button
              type="button"
              onClick={handleFavoriteToggle}
              data-pencil-name="Favorite Toggle"
              className="text-[14px]/[normal] box-border bg-transparent border-0 cursor-pointer text-[#FF00FF] font-normal text-left whitespace-nowrap hover:scale-105 active:scale-95 transition-all"
            >
              {isFavorited ? "♥ 已收藏" : "♡ 收藏"}
            </button>
          </div>

          {/* Detail Article */}
          <div
            data-pencil-name="Detail Article"
            className="box-border w-full flex flex-col gap-5.5 justify-start items-start"
          >
            <div
              data-pencil-name="Detail Head"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-3.5 justify-start items-start"
            >
              <div
                data-pencil-name="Detail Title"
                className="text-[32px] sm:text-[44px]/[normal] box-border text-[#FFFFFF] font-bold text-left whitespace-normal wrap-break-word w-full"
              >
                {promptData.title}
              </div>
              <div
                data-pencil-name="Detail Chips"
                className="box-border w-full h-fit shrink-0 flex flex-wrap gap-2 justify-start items-start"
              >
                {promptData.tags.map((tag, index) => {
                  const style = getTagStyles(tag);
                  return (
                    <div
                      key={tag}
                      data-pencil-name={`Detail Chip ${tag}`}
                      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-1.5 px-2.5 justify-start items-start ${style.bg} border ${style.border} rounded-[999px]`}
                    >
                      <div
                        data-pencil-name={`Detail Chip Label ${tag}`}
                        className={`text-[12px]/[normal] box-border ${style.text} font-normal text-left whitespace-nowrap`}
                      >
                        {tag}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                data-pencil-name="Detail Desc"
                className="text-[16px] sm:text-[18px]/[29px] box-border w-full text-[#7DCEA0] font-normal text-left"
              >
                {promptData.description}
              </div>
            </div>

            {/* Prompt Section */}
            <div
              data-pencil-name="Prompt Section"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-3 justify-start items-start"
            >
              <div
                data-pencil-name="Prompt Section Header"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              >
                <div
                  data-pencil-name="Prompt Section Title"
                  className="text-[18px] sm:text-[20px]/[normal] box-border text-[#FFD700] font-bold text-left whitespace-nowrap"
                >
                  Prompt / Skill 內容
                </div>
                 <button
                  type="button"
                  onClick={handleCopyPrompt}
                  data-pencil-name="Copy Action"
                  className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-2 px-3.5 justify-start items-start bg-[#39FF14] hover:bg-[#32dd10] active:scale-95 border-0 transition-all rounded-[999px] cursor-pointer"
                >
                  <div
                    data-pencil-name="Copy Action Label"
                    className="text-[13px]/[normal] box-border text-[#0A0E1A] font-semibold text-left whitespace-nowrap"
                  >
                    {copiedPrompt ? "已複製" : "複製內容"}
                  </div>
                </button>
              </div>
              <div
                data-pencil-name="Prompt Box"
                className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-4.5 justify-start items-start bg-[#080C12] border border-[#39FF14]/50 rounded-[14px]"
              >
                <pre
                  data-pencil-name="Prompt Text"
                  className="text-[15px] sm:text-[17px]/[28px] box-border w-full text-[#E0F0E8] font-normal text-left whitespace-pre-wrap wrap-break-word "
                >
                  {promptData.promptContent}
                </pre>
              </div>
            </div>

            {/* Example Section */}
            <div
              data-pencil-name="Example Section"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-3 justify-start items-start"
            >
              <div
                data-pencil-name="Example Header"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              >
                <div
                  data-pencil-name="Example Title"
                  className="text-[18px] sm:text-[20px]/[normal] box-border text-[#00FFFF] font-bold text-left whitespace-nowrap"
                >
                  範例輸入
                </div>
                <button
                  type="button"
                  onClick={handleCopyExample}
                  data-pencil-name="Example Copy"
                  className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-2 px-3.5 justify-start items-start bg-[#0A1520] border border-[#00FFFF] hover:bg-[#00FFFF]/10 active:scale-95 transition-all rounded-[999px] cursor-pointer"
                >
                  <div
                    data-pencil-name="Example Copy Label"
                    className="text-[13px]/[normal] box-border text-[#00FFFF] font-normal text-left whitespace-nowrap"
                  >
                    {copiedExample ? "已複製" : "複製範例"}
                  </div>
                </button>
              </div>
              <div
                data-pencil-name="Example Box"
                className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-4.5 justify-start items-start bg-[#080C12] border border-[#00FFFF]/50 rounded-[18px]"
              >
                <pre
                  data-pencil-name="Example Code"
                  className="text-[13px] sm:text-[14px]/[22px] box-border w-full text-[#E0F0E8] font-normal text-left whitespace-pre-wrap wrap-break-word "
                >
                  {promptData.exampleContent}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
