import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";

function AppContent() {
  const location = useLocation();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // 路由切換時啟動載入動畫
    setIsLoading(true);

    // Fallback：若頁面沒有主動呼叫 setIsLoading(false)（例如後台靜態頁面），
    // 800ms 後自動關閉，避免 loading 永遠跑不完。
    const fallback = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(fallback);
  }, [location.pathname, setIsLoading]);

  return <Outlet />;
}

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}
