// 後台權限守門員：包在需要登入才能看的路由外層。
// 從 localStorage 讀登入狀態，沒登入就導去 /admin/login。
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminAuth } from "../api/adminApi";

export default function ProtectedRoute() {
  const location = useLocation();
  const admin = getAdminAuth(); // localStorage 裡的管理者資料，null 代表未登入

  if (!admin) {
    // 未登入 → 導向登入頁。state.from 記住原本想去的位置（之後可用來登入後導回）。
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // 已登入 → 放行，Outlet 會渲染子路由（AdminLayout 及其頁面）。
  return <Outlet />;
}
