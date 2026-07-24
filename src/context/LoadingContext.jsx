import { createContext, useState, useContext } from "react";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoadingFor = (ms) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, ms);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoadingFor }}>
      {children}
      {isLoading && <LoadingScreen />}
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
