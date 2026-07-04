import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const storedFavs = localStorage.getItem(`favorites_${parsedUser.email}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const storedFavs = localStorage.getItem(`favorites_${userData.email}`);
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    } else {
      setFavorites([]);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      const updated = { ...prevUser, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (promptId) => {
    if (!user) return;
    setFavorites((prev) => {
      let updated;
      if (prev.includes(promptId)) {
        updated = prev.filter((id) => id !== promptId);
      } else {
        updated = [...prev, promptId];
      }
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const clearFavorites = () => {
    if (!user) return;
    setFavorites([]);
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify([]));
  };

  const resetFavorites = () => {
    if (!user) return;
    const defaults = [1, 2];
    setFavorites(defaults);
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(defaults));
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
