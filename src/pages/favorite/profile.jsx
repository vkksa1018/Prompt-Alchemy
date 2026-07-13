import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("👤");
  const [role, setRole] = useState("member");
  const [successMsg, setSuccessMsg] = useState("");

  const avatarOptions = ["👤", "🤖", "💻", "✦", "🔥", "🧬", "🧪", "🚀"];

  // Load user data on mount/change
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "👤");
      setRole(user.role || "member");
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name,
      avatar,
      role,
      theme: "default",
    });
    setSuccessMsg("個人資料已成功更新！");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="box-border w-full flex flex-col gap-6 p-[24px_28px] bg-[#111827] border border-[#1A3A2A] rounded-[14px]">
      <div className="box-border w-full h-fit flex flex-col gap-1.5 border-b border-[#1A3A2A] pb-4">
        <div className="text-[28px]/[normal] text-[#FFFFFF] font-bold">
          個人資料
        </div>
        <div className="text-[14px]/[normal] text-[#7DCEA0]">
          檢視與編輯你的公開帳號資料。
        </div>
      </div>

      {successMsg && (
        <div className="box-border w-full p-[12px_16px] bg-[#39FF14]/10 border border-[#39FF14]/40 rounded-[10px] text-[14px] text-[#39FF14] font-medium flex flex-row items-center gap-2.5 animate-pulse">
          ✨ {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="box-border w-full flex flex-col gap-5"
      >
        {/* Avatar Select */}
        <div className="box-border w-full flex flex-col gap-2.5 md:flex-row md:items-center md:gap-7">
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="text-[13px] font-semibold text-[#E0F0E8]">
              當前頭像
            </div>
            <div className="box-border w-17.5 h-17.5 bg-[#0F1F18] border border-[#39FF14]/40 rounded-full flex items-center justify-center text-[32px] shadow-[0_0_15px_rgba(57,255,20,0.15)]">
              {avatar}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-[13px] font-semibold text-[#E0F0E8]">
              選擇新頭像
            </div>
            <div className="flex flex-wrap gap-2.5">
              {avatarOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAvatar(opt)}
                  className={`box-border w-9.5 h-9.5 rounded-full flex items-center justify-center text-[18px] cursor-pointer transition-all duration-200 ${
                    avatar === opt
                      ? "bg-[#39FF14] border border-[#39FF14] text-[#0A0E1A] scale-110"
                      : "bg-[#0F1F18] border border-[#1A3A2A] hover:border-[#39FF14]/60 text-[#7DCEA0]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Read-only */}
        <div className="box-border w-full flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#E0F0E8]">
            電子郵件 Email (不可更改)
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="box-border w-full p-3.5 bg-[#0A0E1A] border border-[#1A3A2A] rounded-xl text-[14px] text-[#7DCEA0] cursor-not-allowed opacity-60"
          />
        </div>

        {/* Name */}
        <div className="box-border w-full flex flex-col gap-2">
          <label
            htmlFor="name-input"
            className="text-[13px] font-semibold text-[#E0F0E8]"
          >
            姓名 Name
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="請輸入姓名"
            className="box-border w-full p-3.5 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] focus:outline-none focus:border-[#39FF14] transition-all"
          />
        </div>


        {/* Action Button */}
        <button
          type="submit"
          className="box-border w-full py-3.5 bg-[#39FF14] hover:bg-[#39FF14]/90 active:scale-[0.98] transition-all rounded-xl text-[#0A0E1A] font-bold border-none cursor-pointer mt-2.5"
        >
          儲存修改
        </button>
      </form>
    </div>
  );
}
