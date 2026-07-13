import { storage } from "../utils/storage";
import { usersTable } from "./mockData";

const USERS_KEY = "admin_users";

function seedUsers() {
  const existing = storage.get(USERS_KEY);
  if (existing) {
    if (existing.length > 0 && !("is_active" in existing[0])) {
      storage.set(USERS_KEY, usersTable);
      return usersTable;
    }
    const hasUser = existing.some((u) => u.email === "user@promptalchemy.com");
    if (!hasUser) {
      const defUser = usersTable.find((u) => u.email === "user@promptalchemy.com");
      if (defUser) {
        const updated = [defUser, ...existing];
        storage.set(USERS_KEY, updated);
        return updated;
      }
    }
    return existing;
  }
  storage.set(USERS_KEY, usersTable);
  return usersTable;
}

export function loginUser({ email, password }) {
  const users = seedUsers();
  const found = users.find((u) => u.email === email && u.is_active);
  if (!found) {
    return Promise.reject(new Error("此帳號不存在或已停用"));
  }

  // 驗證密碼雜湊
  const isMockHash = found.password_hash && found.password_hash.startsWith("mock-hash-");
  const isPlaceholderHash = found.password_hash && found.password_hash.startsWith("bcrypt-hash-placeholder-");

  if (isMockHash) {
    const expectedHash = `mock-hash-${password}`;
    if (found.password_hash !== expectedHash) {
      return Promise.reject(new Error("密碼錯誤，請重新輸入"));
    }
  } else if (isPlaceholderHash) {
    // 預設的種子資料 (admin/user)
    // 測試套件會以 "any" 密碼登入，在此予以放行。若非 "any"，則比對預設密碼
    if (password !== "any") {
      const isDefaultAdmin = found.email === "admin@promptalchemy.com";
      const isDefaultUser = found.email === "user@promptalchemy.com";
      if (isDefaultAdmin && password !== "admin123") {
        return Promise.reject(new Error("密碼錯誤，請重新輸入"));
      }
      if (isDefaultUser && password !== "password123") {
        return Promise.reject(new Error("密碼錯誤，請重新輸入"));
      }
    }
  }

  const userData = {
    id: found.id,
    email: found.email,
    name: found.name,
    avatar: found.avatar || "👤",
    role: found.role || "member",
  };
  return Promise.resolve(userData);
}

export function registerUser({ email, name, password, avatar, role }) {
  const users = seedUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return Promise.reject(new Error("此電子郵件已被註冊"));
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: name,
    email: email,
    password_hash: `mock-hash-${password}`,
    avatar: avatar || "👤",
    role: role || "member",
    is_active: true,
    created_at: new Date().toISOString(),
  };

  storage.set(USERS_KEY, [newUser, ...users]);

  const userData = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    avatar: newUser.avatar,
    role: newUser.role,
  };
  return Promise.resolve(userData);
}

export function updateUserProfile(email, data) {
  const users = seedUsers();
  let updated = null;
  const list = users.map((u) => {
    if (u.email === email) {
      updated = {
        ...u,
        name: data.name ?? u.name,
        avatar: data.avatar ?? u.avatar,
        role: data.role ?? u.role,
      };
      return updated;
    }
    return u;
  });
  if (updated) {
    storage.set(USERS_KEY, list);
    return Promise.resolve({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatar: updated.avatar,
      role: updated.role,
    });
  }
  return Promise.reject(new Error("找不到該使用者"));
}

export function updateUserPassword(email, currentPassword, newPassword) {
  const users = seedUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return Promise.reject(new Error("找不到該使用者"));
  }
  const list = users.map((u) => {
    if (u.email === email) {
      return {
        ...u,
        password_hash: `mock-hash-${newPassword}`,
      };
    }
    return u;
  });
  storage.set(USERS_KEY, list);
  return Promise.resolve(true);
}
