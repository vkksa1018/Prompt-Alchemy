import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Password() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!user) {
    return (
      <div className="box-border w-full flex flex-col gap-5 p-10 justify-center items-center bg-[#111827] border border-[#1A3A2A] rounded-[14px] text-center ">
        <div className="text-[48px]">🔒</div>
        <div className="text-[20px] font-bold text-[#FFFFFF]">請先登入帳號</div>
        <div className="text-[14px] text-[#7DCEA0] max-w-[320px]">
          你需要先登入，才能修改密碼。
        </div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="box-border w-fit h-fit py-3 px-6 bg-[#39FF14] text-[#0A0E1A] font-bold rounded-lg border-none cursor-pointer hover:bg-[#39FF14]/90 transition-colors"
        >
          前往登入
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword !== confirmNewPassword) {
      setError("新密碼與確認新密碼不一致！");
      return;
    }

    if (newPassword.length < 6) {
      setError("新密碼長度必須至少為 6 個字元！");
      return;
    }

    if (currentPassword === newPassword) {
      setError("新密碼不能與目前密碼相同！");
      return;
    }

    // Mock password change success
    setSuccessMsg("密碼已修改成功！下一次登入時請使用新密碼。");

    // Clear fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="box-border w-full flex flex-col gap-6 p-[24px_28px] bg-[#111827] border border-[#1A3A2A] rounded-[14px] ">
      <div className="box-border w-full h-fit flex flex-col gap-1.5 border-b border-[#1A3A2A] pb-4">
        <div className="text-[28px]/[normal] text-[#FFFFFF] font-bold">
          修改密碼
        </div>
        <div className="text-[14px]/[normal] text-[#7DCEA0]">
          為保護帳號安全，請使用強度足夠的密碼。
        </div>
      </div>

      {error && (
        <div className="box-border w-full p-[12px_16px] bg-[#FF00FF]/10 border border-[#FF00FF]/40 rounded-[10px] text-[14px] text-[#FF00FF] font-medium">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="box-border w-full p-[12px_16px] bg-[#39FF14]/10 border border-[#39FF14]/40 rounded-[10px] text-[14px] text-[#39FF14] font-medium">
          ✨ {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="box-border w-full flex flex-col gap-5"
      >
        {/* Current Password */}
        <div className="box-border w-full flex flex-col gap-2">
          <label
            htmlFor="current-pwd"
            className="text-[13px] font-semibold text-[#E0F0E8]"
          >
            目前密碼 Current Password
          </label>
          <div className="box-border w-full relative">
            <input
              id="current-pwd"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="請輸入目前密碼"
              className="box-border w-full p-3.5 pr-11 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-3.75 text-[16px] text-[#7DCEA0] hover:text-[#39FF14] bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
            >
              {showCurrent ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="box-border w-full flex flex-col gap-2">
          <label
            htmlFor="new-pwd"
            className="text-[13px] font-semibold text-[#E0F0E8]"
          >
            新密碼 New Password
          </label>
          <div className="box-border w-full relative">
            <input
              id="new-pwd"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="最少 6 位字元"
              className="box-border w-full p-3.5 pr-11 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-3.75 text-[16px] text-[#7DCEA0] hover:text-[#39FF14] bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
            >
              {showNew ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="box-border w-full flex flex-col gap-2">
          <label
            htmlFor="confirm-new-pwd"
            className="text-[13px] font-semibold text-[#E0F0E8]"
          >
            確認新密碼 Confirm New Password
          </label>
          <div className="box-border w-full relative">
            <input
              id="confirm-new-pwd"
              type={showConfirm ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              placeholder="請再次輸入新密碼"
              className="box-border w-full p-3.5 pr-11 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-3.75 text-[16px] text-[#7DCEA0] hover:text-[#39FF14] bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
            >
              {showConfirm ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="box-border w-full py-3.5 bg-[#39FF14] hover:bg-[#39FF14]/90 active:scale-[0.98] transition-all rounded-xl text-[#0A0E1A] font-bold border-none cursor-pointer mt-2.5"
        >
          修改密碼
        </button>
      </form>
    </div>
  );
}
