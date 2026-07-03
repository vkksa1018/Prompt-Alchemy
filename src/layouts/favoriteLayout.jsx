import { Outlet } from "react-router-dom";

export default function FavoriteLayout() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] py-8 px-6 flex flex-col items-center">
      <div
        data-pencil-name="Page Content"
        className="box-border w-full max-w-[1100px] flex flex-col md:flex-row gap-[22px] justify-start items-start"
      >
        {/* Favorites Menu Sidebar */}
        <div
          data-pencil-name="Favorites Menu"
          className="box-border w-full md:w-[240px] shrink-0 flex flex-col gap-[18px] p-[18px] justify-start items-start bg-[#111827] border border-[#1A3A2A] rounded-[14px]"
        >
          <div
            data-pencil-name="Favorites Brand"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
          >
            <div
              data-pencil-name="Favorites Mark"
              className="box-border w-[28px] shrink-0 h-[28px] bg-[#39FF14] rounded-full"
            ></div>
            <div
              data-pencil-name="Favorites Brand Text"
              className="text-[16px]/[normal] box-border text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
            >
              Prompt Skill Library
            </div>
          </div>
          <div
            data-pencil-name="Menu 我的收藏"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 py-[10px] px-[12px] justify-start items-start bg-[#39FF14] rounded-[8px]"
          >
            <div
              data-pencil-name="Menu Label 我的收藏"
              className="text-[14px]/[normal] box-border text-[#0A0E1A] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
            >
              我的收藏
            </div>
          </div>
          <div
            data-pencil-name="Menu 個人資料"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 py-[10px] px-[12px] justify-start items-start bg-transparent hover:bg-[#39FF14]/10 rounded-[8px] cursor-pointer"
          >
            <div
              data-pencil-name="Menu Label 個人資料"
              className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
            >
              個人資料
            </div>
          </div>
          <div
            data-pencil-name="Menu 修改密碼"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 py-[10px] px-[12px] justify-start items-start bg-transparent hover:bg-[#39FF14]/10 rounded-[8px] cursor-pointer"
          >
            <div
              data-pencil-name="Menu Label 修改密碼"
              className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
            >
              修改密碼
            </div>
          </div>
          <div
            data-pencil-name="Menu 登出"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 py-[10px] px-[12px] justify-start items-start bg-transparent hover:bg-[#39FF14]/10 rounded-[8px] cursor-pointer"
          >
            <div
              data-pencil-name="Menu Label 登出"
              className="text-[14px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
            >
              登出
            </div>
          </div>
        </div>

        {/* Main Content Layout Outlet */}
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
