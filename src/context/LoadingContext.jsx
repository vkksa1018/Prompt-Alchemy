import { createContext, useState, useContext, useRef, useCallback } from "react";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const LoadingContext = createContext(null);

// 最短顯示時間 300ms，保證小鴨至少跑一趟
const MIN_LOADING_MS = 300;

export function LoadingProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const startTimeRef = useRef(null);
  const hideTimerRef = useRef(null);

  const setIsLoading = useCallback((loading) => {
    if (loading) {
      // 清掉上一次還沒結束的隱藏計時器
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      startTimeRef.current = Date.now();
      setFadeOut(false);
      setVisible(true);
    } else {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      hideTimerRef.current = setTimeout(() => {
        // 先觸發 fade-out CSS，動畫結束後才真正隱藏
        setFadeOut(true);
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
          setFadeOut(false);
        }, 350); // 與 CSS fade-out transition 相同
      }, remaining);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {children}
      {visible && <LoadingScreen fadeOut={fadeOut} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
