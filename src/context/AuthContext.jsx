import { createContext, useState, useEffect } from "react";
import { IS_ONLINE_MODE } from "../config/runMode";
import {
  getUserFavoriteAPI,
  toggleFavoriteAPI,
  getUserFavorites,
  saveUserFavorites,
} from "../api/favoriteApi";
import {
  updateUserProfile,
  getCurrentUser,
  logoutUser as apiLogoutUser,
} from "../api/authApi";
import { updateFavoriteCount } from "../api/promptApi";
import { alertHelper } from "../utils/sweetAlert";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteCounts, setFavoriteCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [favoriteSource, setFavoriteSource] = useState("local"); // "local" or "online"

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

          const favs = IS_ONLINE_MODE
            ? await getUserFavoriteAPI()
            : await getUserFavorites(fullUser.email, fullUser.id);

          setFavorites(favs);
          setFavoriteSource(IS_ONLINE_MODE ? "online" : "local");
        } catch (err) {
          console.warn("Token 即將或已無效，清除本地 Token", err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setFavorites([]);
          setFavoriteSource("local");
        }
      } else if (!IS_ONLINE_MODE && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const favs = IS_ONLINE_MODE
            ? await getUserFavoriteAPI()
            : await getUserFavorites(parsedUser.email, parsedUser.id);

          setFavorites(favs);
          setFavoriteSource(IS_ONLINE_MODE ? "online" : "local");
        } catch (err) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (userData, options = {}) => {
    const { showSuccessAlert = true } = options;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    try {
      const favs = IS_ONLINE_MODE
        ? await getUserFavoriteAPI()
        : await getUserFavorites(userData.email, userData.id);
      setFavorites(favs);
      setFavoriteSource(IS_ONLINE_MODE ? "online" : "local");
    } catch (err) {
      // online 模式不回退至 localStorage，避免混用舊資料。
      console.error("讀取收藏失敗", err);
      setFavorites([]);
      setFavoriteSource(IS_ONLINE_MODE ? "online" : "local");
    }

    if (showSuccessAlert) {
      alertHelper.success(
        "登入成功",
        `歡迎回來，${userData.name || "成員"}！`,
        true
      );
    }
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

  const toggleFavorite = async (promptId) => {
    if (!user) return;

    const isAlreadyFav = favorites.includes(promptId);

    if (favoriteSource === "online") {
      try {
        const result = await toggleFavoriteAPI(promptId);

        setFavorites((prev) =>
          prev.includes(promptId)
            ? prev.filter((id) => id !== promptId)
            : [...prev, promptId]
        );
        if (typeof result?.favoriteCount === "number") {
          setFavoriteCounts((prev) => ({
            ...prev,
            [promptId]: result.favoriteCount,
          }));
        }

        if (!isAlreadyFav) {
          alertHelper.success("已收藏", "已加入您的收藏清單", true);
        } else {
          alertHelper.success("已取消收藏", "已從您的收藏清單移除", true);
        }
      } catch (err) {
        console.error("Failed to toggle favorite via API", err);
        alertHelper.error("收藏失敗", "目前無法同步到伺服器", true);
      }
      return;
    }

    // local fallback 模式
    const updated = favorites.includes(promptId)
      ? favorites.filter((id) => id !== promptId)
      : [...favorites, promptId];

    setFavorites(updated);
    saveUserFavorites(user.email, updated);

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

  const clearFavorites = async () => {
    if (!user) return;

    if (favoriteSource === "online") {
      try {
        const results = await Promise.all(
          favorites.map((favId) => toggleFavoriteAPI(favId))
        );
        setFavoriteCounts((prev) => {
          const next = { ...prev };
          favorites.forEach((favId, index) => {
            const favoriteCount = results[index]?.favoriteCount;
            if (typeof favoriteCount === "number") {
              next[favId] = favoriteCount;
            }
          });
          return next;
        });
        setFavorites([]);
      } catch (err) {
        console.error("Failed to clear favorites via API", err);
        alertHelper.error("清空失敗", "目前無法同步到伺服器", true);
      }
      return;
    }

    setFavorites([]);
    saveUserFavorites(user.email, []);
    favorites.forEach((favId) => {
      updateFavoriteCount(favId, -1).catch(console.error);
    });
  };

  const resetFavorites = () => {
    if (!user) return;
    if (favoriteSource === "online") {
      alertHelper.error("無法重設", "連線模式不使用本機預設收藏", true);
      return;
    }
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
        favoriteCounts,
        toggleFavorite,
        clearFavorites,
        resetFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
