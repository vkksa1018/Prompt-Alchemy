const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * 統一 API 請求封裝
 * @param {string} endpoint - API 路徑 (例: '/auth/login')
 * @param {RequestInit} options - fetch 選項
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BASE_URL.replace(/\/$/, "")}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === "object" && (data.message || data.error)) ||
        `HTTP 錯誤 (${response.status})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("無法連線至後端伺服器，請確認後端服務是否正在運行。");
    }
    throw err;
  }
}
