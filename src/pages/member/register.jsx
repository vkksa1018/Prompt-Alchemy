import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("密碼與確認密碼不一致！");
      return;
    }

    if (password.length < 6) {
      setError("密碼長度必須至少為 6 個字元！");
      return;
    }

    // Mock register: log them in immediately
    login({
      email: email,
      username: username || email.split("@")[0],
      avatar: "👤",
      bio: "這個使用者很懶，還沒有寫下任何個人簡介。",
      role: "前端工程師",
    });

    // Redirect to profile page to let them fill out details
    navigate("/favorites/profile");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/85 backdrop-blur-md p-4">
      <form
        onSubmit={handleSubmit}
        data-pencil-name="Register Modal"
        className="box-border w-full max-w-110 shrink-0 h-fit [box-shadow:0px_0px_40px_0px_#39FF1420] flex flex-col gap-5 p-8 justify-start items-start bg-[#111827] border border-[#39FF14] rounded-3xl"
      >
        <div
          data-pencil-name="Modal Header"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
        >
          <div
            data-pencil-name="Modal Title"
            className="text-[28px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
          >
            建立新帳號
          </div>
          <button
            type="button"
            onClick={handleClose}
            data-pencil-name="Modal Close"
            className="text-[18px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] transition-colors font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap bg-transparent border-none cursor-pointer focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div
          data-pencil-name="Modal Subtitle"
          className="text-[14px]/[21px] box-border w-full text-[#7DCEA0] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left"
        >
          立即註冊以解鎖收藏、管理與自訂 Prompt 技能。
        </div>

        {error && (
          <div className="box-border w-full p-[10px_14px] bg-[#FF00FF]/10 border border-[#FF00FF]/40 rounded-[10px] text-[13px] text-[#FF00FF] font-['JetBrains_Mono',system-ui,sans-serif]">
            ⚠️ {error}
          </div>
        )}

        {/* Email Field */}
        <div
          data-pencil-name="Field Email"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start"
        >
          <div
            data-pencil-name="Field Label Email"
            className="text-[13px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
          >
            電子郵件 Email
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="box-border w-full h-fit shrink-0 p-3.5 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] transition-all"
          />
        </div>

        {/* Username Field */}
        <div
          data-pencil-name="Field Username"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start"
        >
          <div
            data-pencil-name="Field Label Username"
            className="text-[13px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
          >
            使用者名稱 Username
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="例如: cyber_alchemist"
            required
            className="box-border w-full h-fit shrink-0 p-3.5 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] transition-all"
          />
        </div>

        {/* Password Field */}
        <div
          data-pencil-name="Field Password"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start"
        >
          <div
            data-pencil-name="Field Label Password"
            className="text-[13px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
          >
            密碼 Password
          </div>
          <div className="box-border w-full h-fit shrink-0 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="最少 6 位字元"
              required
              className="box-border w-full h-fit shrink-0 p-3.5 pr-11 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              data-pencil-name="Password Toggle"
              className="absolute right-3.5 top-3.75 text-[16px]/[normal] box-border text-[#7DCEA0] hover:text-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] font-normal bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
            >
              👁
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div
          data-pencil-name="Field Confirm Password"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start"
        >
          <div
            data-pencil-name="Field Label Confirm Password"
            className="text-[13px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
          >
            確認密碼 Confirm Password
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="請再次輸入密碼"
            required
            className="box-border w-full h-fit shrink-0 p-3.5 bg-[#0F1F18] border border-[#1A3A2A] rounded-xl text-[14px] text-[#E0F0E8] placeholder-[#3D6B50] focus:outline-none focus:border-[#39FF14] font-['JetBrains_Mono',system-ui,sans-serif] transition-all"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          data-pencil-name="Register Button"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-3.5 justify-center items-center bg-[#39FF14] hover:bg-[#39FF14]/90 active:scale-[0.98] transition-all rounded-xl border-none cursor-pointer mt-2.5"
        >
          <div
            data-pencil-name="Register Button Label"
            className="text-[15px]/[normal] box-border text-[#0A0E1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
          >
            註冊
          </div>
        </button>

        <div
          data-pencil-name="Divider Row"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-3.5 justify-start items-center"
        >
          <div
            data-pencil-name="Divider Left"
            className="box-border flex-1 h-px bg-[#1A3A2A]"
          ></div>
          <div
            data-pencil-name="Divider Text"
            className="text-[12px]/[normal] box-border text-[#3D6B50] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
          >
            或
          </div>
          <div
            data-pencil-name="Divider Right"
            className="box-border flex-1 h-px bg-[#1A3A2A]"
          ></div>
        </div>

        {/* Google sign-up mockup */}
        <button
          type="button"
          onClick={() => {
            login({
              email: "google_user@promptalchemy.com",
              username: "google_coder",
              avatar: "🤖",
              bio: "使用 Google 快速建立的開發者。",
              role: "AI 訓練師",
            });
            navigate("/favorites/profile");
          }}
          data-pencil-name="Google Register Button"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 p-3.5 justify-center items-center bg-transparent hover:bg-[#1A3A2A]/20 transition-all border border-[#1A3A2A] rounded-xl cursor-pointer"
        >
          <div
            data-pencil-name="Google Icon"
            className="text-[16px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left whitespace-nowrap"
          >
            G
          </div>
          <div
            data-pencil-name="Google Register Label"
            className="text-[14px]/[normal] box-border text-[#E0F0E8] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
          >
            使用 Google 帳號註冊
          </div>
        </button>

        <div
          data-pencil-name="Login Row"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-center items-start"
        >
          <div
            data-pencil-name="Login Hint"
            className="text-[13px]/[normal] box-border text-[#7DCEA0] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left whitespace-nowrap"
          >
            已有帳號？
          </div>
          <Link
            to="/login"
            data-pencil-name="Login Link"
            className="text-[13px]/[normal] box-border text-[#39FF14] hover:text-[#39FF14]/80 transition-all cursor-pointer font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left whitespace-nowrap no-underline"
          >
            立即登入
          </Link>
        </div>
      </form>
    </div>
  );
}
