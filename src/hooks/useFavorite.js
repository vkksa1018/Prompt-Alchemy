import { useState } from "react";

export default function useFavorite() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (promptId) => {
    setFavorites((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((id) => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
  };

  return {
    favorites,
    toggleFavorite,
  };
}
