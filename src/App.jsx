import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";

function AppContent() {
  const location = useLocation();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // 每次路徑切換時，觸發 800ms 的載入動畫
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
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
