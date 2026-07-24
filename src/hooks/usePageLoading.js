import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";

/**
 * 頁面資料載入完成 Hook
 *
 * 用法：在任何頁面最頂層呼叫，傳入「資料是否已就緒」的布林值。
 * 當 ready 變為 true，LoadingScreen 就會關閉。
 *
 * @param {boolean} ready - 當資料載入完成時設為 true
 *
 * @example
 * const [prompts, setPrompts] = useState([]);
 * const dataReady = prompts.length > 0;
 * usePageLoading(dataReady);
 */
export function usePageLoading(ready) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
    }
  }, [ready, setIsLoading]);
}
