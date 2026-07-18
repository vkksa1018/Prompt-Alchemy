import { apiRequest } from "./apiClient";
import { storage } from "../utils/storage";

const USERS_KEY = "admin_users";

/**
 * 會員登入 (直連後端 Express API)
 * 打 POST /auth/login 取得 JWT Token，隨後打 GET /auth/me 取得使用者資料
 */
export async function loginUser({ email, password }) {
  try {
    const loginRes = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.token) {
      localStorage.setItem("token", loginRes.token);
    }

    const userRes = await apiRequest("/auth/me", {
      method: "GET",
    });

    const userData = {
      ...userRes.user,
      token: loginRes.token,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (err) {
    localStorage.removeItem("token");
    throw err;
  }
}

/**
 * 會員註冊 (直連後端 Express API)
 * 打 POST /auth/register 註冊新帳號
 */
export async function registerUser({ email, name, password }) {
  const res = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });

  return {
    id: res.data?.id,
    email: res.data?.email,
    name: res.data?.name,
    role: "member",
  };
}

/**
 * 取得當前已登入使用者資訊
 * 打 GET /auth/me 驗證 Token
 */
export async function getCurrentUser() {
  const res = await apiRequest("/auth/me", {
    method: "GET",
  });
  return res.user;
}

/**
 * 會員登出
 * 打 POST /auth/logout 並清除本地 Token
 */
export async function logoutUser() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.warn("Logout API notice:", err.message);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

/**
 * 更新個人資料
 */
export function updateUserProfile(email, data) {
  const users = storage.get(USERS_KEY) || [];
  let updated = null;
  const list = users.map((u) => {
    if (u.email === email) {
      updated = {
        ...u,
        name: data.name ?? u.name,
        role: data.role ?? u.role,
      };
      return updated;
    }
    return u;
  });
  if (updated) {
    storage.set(USERS_KEY, list);
  }
  return Promise.resolve({
    email,
    name: data.name,
    role: data.role || "member",
  });
}

/**
 * 修改密碼
 */
export function updateUserPassword(email, currentPassword, newPassword) {
  return Promise.resolve(true);
}
