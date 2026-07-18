import { createContext, useState, useEffect } from "react";
import { getUserFavorites, saveUserFavorites } from "../api/favoriteApi";
import { updateUserProfile, getCurrentUser, logoutUser as apiLogoutUser } from "../api/authApi";
import { updateFavoriteCount } from "../api/promptApi";
import { alertHelper } from "../utils/sweetAlert";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        try {
          const fetchedUser = await getCurrentUser();
          const fullUser = { ...fetchedUser, token };
          setUser(fullUser);
          localStorage.setItem("user", JSON.stringify(fullUser));

          const favs = await getUserFavorites(fullUser.email, fullUser.id);
          setFavorites(favs);
        } catch (err) {
          console.warn("Token 即將或已無效，清除本地 Token", err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          const favs = await getUserFavorites(parsedUser.email, parsedUser.id);
          setFavorites(favs);
        } catch (err) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = (userData, options = {}) => {
    const { showSuccessAlert = true } = options;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    getUserFavorites(userData.email, userData.id).then((favs) => {
      setFavorites(favs);
      if (showSuccessAlert) {
        alertHelper.success(
          "登入成功",
          `歡迎回來，${userData.name || "成員"}！`,
          true
        );
      }
    });
  };

  const logoutUser = () => {
    apiLogoutUser();
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alertHelper.success("已登出", "您已安全登出帳號", true);
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updated));
      updateUserProfile(updated.email, newUserData).catch((err) => {
        console.error("Failed to sync profile update to db", err);
      });
      return updated;
    });
  };

  const toggleFavorite = (promptId) => {
    if (!user) return;
    const isAlreadyFav = favorites.includes(promptId);

    setFavorites((prev) => {
      const updated = prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId];
      saveUserFavorites(user.email, updated);
      return updated;
    });

    const amount = isAlreadyFav ? -1 : 1;
    updateFavoriteCount(promptId, amount).catch((err) => {
      console.error("Failed to sync favorite count to db", err);
    });

    if (!isAlreadyFav) {
      alertHelper.success("已收藏", "已加入您的收藏清單", true);
    } else {
      alertHelper.success("已取消收藏", "已從您的收藏清單移除", true);
    }
  };

  const clearFavorites = () => {
    if (!user) return;
    setFavorites([]);
    saveUserFavorites(user.email, []);
    favorites.forEach((favId) => {
      updateFavoriteCount(favId, -1).catch(console.error);
    });
  };

  const resetFavorites = () => {
    if (!user) return;
    const defaults = [
      "prompt-uuid-0001-0000-000000000001",
      "prompt-uuid-0001-0000-000000000002",
    ];
    setFavorites(defaults);
    saveUserFavorites(user.email, defaults);
    defaults.forEach((favId) => {
      updateFavoriteCount(favId, 1).catch(console.error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        logout: logoutUser,
        updateUser,
        favorites,
        toggleFavorite,
        clearFavorites,
        resetFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
