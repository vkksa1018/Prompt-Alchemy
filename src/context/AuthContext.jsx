import { createContext, useState, useEffect } from "react";
import { getUserFavorites, saveUserFavorites } from "../api/favoriteApi";
import { updateUserProfile } from "../api/authApi";
import { updateFavoriteCount } from "../api/promptApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      getUserFavorites(parsedUser.email, parsedUser.id).then((favs) => {
        setFavorites(favs);
      });
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    getUserFavorites(userData.email, userData.id).then((favs) => {
      setFavorites(favs);
    });
  };

  const logoutUser = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updated));
      // Sync update to dynamic user database (admin_users)
      updateUserProfile(updated.email, newUserData).catch((err) => {
        console.error("Failed to sync profile update to db", err);
      });
      return updated;
    });
  };

  const toggleFavorite = (promptId) => {
    if (!user) return;
    let isAdding = false;
    setFavorites((prev) => {
      let updated;
      if (prev.includes(promptId)) {
        updated = prev.filter((id) => id !== promptId);
        isAdding = false;
      } else {
        updated = [...prev, promptId];
        isAdding = true;
      }
      saveUserFavorites(user.email, updated);

      // Sync back favorite count increment/decrement to dynamic skills db
      updateFavoriteCount(promptId, isAdding ? 1 : -1).catch((err) => {
        console.error("Failed to sync favorite count to db", err);
      });

      return updated;
    });
  };

  const clearFavorites = () => {
    if (!user) return;
    setFavorites([]);
    saveUserFavorites(user.email, []);
    // Optional: decrement favorite counts in database for all previously favorited items
    favorites.forEach((favId) => {
      updateFavoriteCount(favId, -1).catch(console.error);
    });
  };

  const resetFavorites = () => {
    if (!user) return;
    const defaults = ["prompt-uuid-0001-0000-000000000001", "prompt-uuid-0001-0000-000000000002"];
    setFavorites(defaults);
    saveUserFavorites(user.email, defaults);
    // Optional: sync counts
    defaults.forEach((favId) => {
      updateFavoriteCount(favId, 1).catch(console.error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginUser,
        logout: logoutUser,
        updateUser,
        favorites,
        toggleFavorite,
        clearFavorites,
        resetFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

