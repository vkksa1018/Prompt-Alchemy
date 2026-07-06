import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      data-pencil-name="Top Nav"
      className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center py-4 px-6 bg-[#0A0E1A] border-b border-[#39FF14]/15"
    >
      <Link
        to="/"
        data-pencil-name="Brand"
        className="box-border w-fit shrink-0 h-fit flex flex-row gap-3 justify-start items-center no-underline"
      >
        <div
          data-pencil-name="Brand Mark Wrap"
          className="box-border w-7.5 shrink-0 h-7.5 relative"
        >
          <div
            data-pencil-name="Brand Mark"
            className="box-border w-7.5 h-7.5 absolute left-0 top-0 bg-[#39FF14] rounded-full z-0"
          ></div>
          <div
            data-pencil-name="Brand Dot"
            className="text-[14px]/[normal] box-border absolute left-2 top-1.5 text-[#0A0E1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap z-10"
          >
            ✦
          </div>
        </div>
        <div
          data-pencil-name="Brand Text"
          className="text-[20px]/[normal] box-border text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
        >
          Prompt 鍊金坊
        </div>
      </Link>

      <div
        data-pencil-name="Nav Links"
        className="box-border w-fit shrink-0 h-fit flex flex-row gap-7 justify-start items-center"
      >
        <Link
          to="/"
          data-pencil-name="Nav 首頁"
          className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap no-underline"
        >
          首頁
        </Link>
        <Link
          to="/skills"
          data-pencil-name="Nav 技能列表"
          className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap no-underline"
        >
          技能列表
        </Link>
        {user && (
          <Link
            to="/favorites"
            data-pencil-name="Nav 我的收藏"
            className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap no-underline"
          >
            我的收藏
          </Link>
        )}
      </div>

      <div
        data-pencil-name="Nav Actions"
        className="box-border w-fit shrink-0 h-fit flex flex-row gap-4 justify-start items-center"
      >
        {user ? (
          <>
            <Link
              to="/favorites/profile"
              title={`個人資料 (${user.username})`}
              data-pencil-name="Avatar Wrap"
              className="box-border w-8 shrink-0 h-8 relative cursor-pointer group"
            >
              <div
                data-pencil-name="Avatar"
                className="box-border w-8 h-8 absolute left-0 top-0 bg-[#0F1F18] border border-[#1A3A2A] group-hover:border-[#39FF14] rounded-full z-0 transition-all"
              ></div>
              <div
                data-pencil-name="Avatar Text"
                className="text-[14px]/[normal] box-border absolute left-1.75 top-1.5 text-[#7DCEA0] group-hover:text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap z-10 transition-colors"
              >
                {user.avatar || "👤"}
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              data-pencil-name="Login Button"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-2.5 px-4.5 justify-start items-start bg-transparent border border-[#39FF14] hover:bg-[#39FF14]/10 transition-all duration-200 rounded-lg no-underline"
            >
              <div
                data-pencil-name="Login Label"
                className="text-[14px]/[normal] box-border text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                登入
              </div>
            </Link>
            <Link
              to="/register"
              data-pencil-name="Signup Button"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-2.5 px-4.5 justify-start items-start bg-[#39FF14] hover:bg-[#32dd10] transition-all duration-200 rounded-lg no-underline"
            >
              <div
                data-pencil-name="Signup Label"
                className="text-[14px]/[normal] box-border text-[#0A0E1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
              >
                註冊
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
