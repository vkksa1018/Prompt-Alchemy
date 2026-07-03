import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { copyToClipboard } from "../../utils/copyToClipboard";

const promptsDb = {
  1: {
    title: "後端 API 審查",
    category: "後端開發",
    tags: ["後端", "#API", "#Security", "#Express"],
    description: "當你接收一支 API，需要 AI 幫你檢查安全性、錯誤處理與資料結構時使用。",
    promptContent: "請你扮演資深後端工程師，檢查以下 API 程式碼。\n幫我找出可能的錯誤、安全性風險、效能問題，\n並提出改善建議。\n\n輸出請包含：\n【程式碼問題】\n【改善建議程式碼】\n【為什麼這樣改】",
    exampleContent: "請檢查這段 Express route...\n\napp.get('/api/user', async (req, res) => {\n  const id = req.query.id;\n  const user = await db.query(...);\n  res.json(user);\n});",
    phoneDesc: "幫你檢查 API 規格、錯誤回應與安全性。",
    phoneCode: "app.get('/api', async () => {\n  return json(data)\n})"
  },
  2: {
    title: "前端 Debug 助手",
    category: "前端開發",
    tags: ["前端", "#React", "#Debug", "#Vite"],
    description: "協助找出 React / Next.js 專案的錯誤原因與除錯線索。",
    promptContent: "請分析以下 React/Next.js 錯誤訊息，並給出可能的修復方案及除錯步驟：\n\n[在此輸入錯誤訊息]",
    exampleContent: "TypeError: Cannot read properties of undefined (reading 'map')\n  at ProductList (ProductList.jsx:12)",
    phoneDesc: "協助您進行前端元件的故障排除。",
    phoneCode: "const [data, setData] = useState()"
  },
  3: {
    title: "SQL 查詢優化",
    category: "後端開發",
    tags: ["後端", "#SQL", "#Database", "#MySQL"],
    description: "分析 SQL 查詢效能瓶頸與最佳化建議。",
    promptContent: "請分析以下 SQL 查詢的效能瓶頸，並提供最佳化建議及索引設計：\n\n[在此輸入 SQL 語句]",
    exampleContent: "SELECT * FROM orders WHERE user_id = 5 AND status = 'pending' ORDER BY created_at DESC;",
    phoneDesc: "檢查 SQL 與進行效能最佳化。",
    phoneCode: "SELECT * FROM users WHERE id = 1"
  },
  4: {
    title: "資安漏洞檢查清單",
    category: "資安相關",
    tags: ["資安", "#Security", "#Web"],
    description: "檢查常見的 Web 與雲端環境風險掃描方式。",
    promptContent: "請提供一份針對以下環境的 Web 應用程式安全檢測清單與常見漏洞防範建議：\n\n[在此說明技術棧環境]",
    exampleContent: "Web API Node.js environment...",
    phoneDesc: "檢查 Web 常見安全性風險。",
    phoneCode: "npm audit"
  },
  5: {
    title: "英文翻譯與潤飾",
    category: "翻譯助手",
    tags: ["寫作", "#English", "#Translation"],
    description: "將中文技術文件翻譯為專業流暢的英文，並提供多種口吻潤飾。",
    promptContent: "請將以下中文技術內容翻譯成專業、自然的英文，並提供 Academic 與 Professional 兩種口吻：\n\n[在此輸入內容]",
    exampleContent: "如何使用 React 進行狀態管理...",
    phoneDesc: "英文技術文件專家翻譯與修飾。",
    phoneCode: "Translate: How to use React..."
  },
  6: {
    title: "Regex 自動生成器",
    category: "小工具",
    tags: ["工具", "#Regex", "#Helper"],
    description: "輸入期望匹配與排除的規則，自動產生高效率的正則表達式。",
    promptContent: "請根據以下條件生成一個高效的正則表達式，並附上測試案例說明：\n- 匹配：[條件]\n- 排除：[條件]\n\n輸入字串範例：",
    exampleContent: "匹配 email 格式，並排除 .com 結尾...",
    phoneDesc: "自動生成正則表達式小工具。",
    phoneCode: "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/"
  }
};

export default function SkillDetail() {
  const { id } = useParams();
  const promptData = promptsDb[id] || promptsDb[1]; // Fallback to 1 if not match

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(promptData.promptContent);
    if (success) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCopyExample = async () => {
    const success = await copyToClipboard(promptData.exampleContent);
    if (success) {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  };

  const getTagStyles = (index) => {
    const styles = [
      { bg: "bg-[#0A1F1A]", border: "border-[#39FF14]", text: "text-[#39FF14]" },
      { bg: "bg-[#0A1520]", border: "border-[#00FFFF]", text: "text-[#00FFFF]" },
      { bg: "bg-[#1A0A1A]", border: "border-[#FF00FF]", text: "text-[#FF00FF]" },
      { bg: "bg-[#1A1A0A]", border: "border-[#FF8C00]", text: "text-[#FF8C00]" }
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0E1A] text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] py-8 px-6 flex flex-col items-center">
      <div
        data-pencil-name="Page Content"
        className="box-border w-full max-w-[1100px] flex flex-col lg:flex-row gap-[24px] justify-start items-start"
      >
        {/* Detail Main */}
        <div
          data-pencil-name="Detail Main"
          className="box-border flex-1 w-full h-full flex flex-col gap-[22px] py-[12px] justify-start items-start"
        >
          {/* Back Row */}
          <div
            data-pencil-name="Back Row"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          >
            <Link
              to="/skills"
              data-pencil-name="Back Text Group"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center no-underline hover:opacity-80 transition-opacity"
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
              onClick={() => setIsFavorited(!isFavorited)}
              data-pencil-name="Favorite Toggle"
              className="text-[14px]/[normal] box-border bg-transparent border-0 cursor-pointer text-[#FF00FF] font-normal text-left whitespace-nowrap hover:scale-105 active:scale-95 transition-all"
            >
              {isFavorited ? "♥ 已收藏" : "♡ 收藏"}
            </button>
          </div>

          {/* Detail Article */}
          <div
            data-pencil-name="Detail Article"
            className="box-border w-full flex flex-col gap-[22px] justify-start items-start"
          >
            <div
              data-pencil-name="Detail Head"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] justify-start items-start"
            >
              <div
                data-pencil-name="Detail Title"
                className="text-[32px] sm:text-[44px]/[normal] box-border text-[#FFFFFF] font-bold text-left whitespace-normal break-words w-full"
              >
                {promptData.title}
              </div>
              <div
                data-pencil-name="Detail Chips"
                className="box-border w-full h-fit shrink-0 flex flex-wrap gap-[8px] justify-start items-start"
              >
                {promptData.tags.map((tag, index) => {
                  const style = getTagStyles(index);
                  return (
                    <div
                      key={tag}
                      data-pencil-name={`Detail Chip ${tag}`}
                      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[6px] px-[10px] justify-start items-start ${style.bg} border ${style.border} rounded-[999px]`}
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
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
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
                  className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[8px] px-[14px] justify-start items-start bg-[#39FF14] hover:bg-[#32dd10] active:scale-95 border-0 transition-all rounded-[999px] cursor-pointer"
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
                className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[18px] justify-start items-start bg-[#080C12] border border-[#39FF14]/50 rounded-[14px]"
              >
                <pre
                  data-pencil-name="Prompt Text"
                  className="text-[15px] sm:text-[17px]/[28px] box-border w-full text-[#E0F0E8] font-normal text-left whitespace-pre-wrap break-words font-['JetBrains_Mono',system-ui,sans-serif]"
                >
                  {promptData.promptContent}
                </pre>
              </div>
            </div>

            {/* Example Section */}
            <div
              data-pencil-name="Example Section"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
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
                  className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[8px] px-[14px] justify-start items-start bg-[#0A1520] border border-[#00FFFF] hover:bg-[#00FFFF]/10 active:scale-95 transition-all rounded-[999px] cursor-pointer"
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
                className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[18px] justify-start items-start bg-[#080C12] border border-[#00FFFF]/50 rounded-[18px]"
              >
                <pre
                  data-pencil-name="Example Code"
                  className="text-[13px] sm:text-[14px]/[22px] box-border w-full text-[#E0F0E8] font-normal text-left whitespace-pre-wrap break-words font-['JetBrains_Mono',system-ui,sans-serif]"
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
