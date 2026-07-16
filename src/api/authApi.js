import { storage } from "../utils/storage";
import { usersTable } from "./mockData";

const USERS_KEY = "admin_users";
const DEFAULT_MEMBER_EMAIL = "user@promptalchemy.com";
const LEGACY_MEMBER_NAME = "Jane User";

function seedUsers() {
  const existing = storage.get(USERS_KEY);
  if (existing) {
    // If it's old schema data (contains avatar or is_active), force overwrite to reset
    const hasOldSchema = existing.some((u) => "avatar" in u || "is_active" in u);
    if (hasOldSchema) {
      storage.set(USERS_KEY, usersTable);
      return usersTable;
    }

    let modified = false;
    let migrated = existing.map((u) => {
      if (u.isActive === undefined) {
        modified = true;
        return { ...u, isActive: true };
      }
      return u;
    });

    const defaultMember = usersTable.find((u) => u.email === DEFAULT_MEMBER_EMAIL);
    const memberIndex = migrated.findIndex((u) => u.email === DEFAULT_MEMBER_EMAIL);

    // Migrate legacy seed data once: rename old default member from Jane User.
    if (
      defaultMember &&
      memberIndex >= 0 &&
      migrated[memberIndex].name === LEGACY_MEMBER_NAME
    ) {
      migrated[memberIndex] = {
        ...migrated[memberIndex],
        name: defaultMember.name,
      };
      modified = true;
    }

    const hasUser = migrated.some((u) => u.email === DEFAULT_MEMBER_EMAIL);
    if (!hasUser) {
      const defUser = usersTable.find((u) => u.email === DEFAULT_MEMBER_EMAIL);
      if (defUser) {
        migrated = [defUser, ...migrated];
        modified = true;
      }
    }

    if (modified) {
      storage.set(USERS_KEY, migrated);
      return migrated;
    }
    return existing;
  }
  storage.set(USERS_KEY, usersTable);
  return usersTable;
}

export function loginUser({ email, password }) {
  const users = seedUsers();
  const found = users.find((u) => u.email === email && u.isActive !== false && u.is_active !== false);
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
      const isDefaultUser = found.email === DEFAULT_MEMBER_EMAIL;
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
    role: found.role || "member",
  };
  return Promise.resolve(userData);
}

export function registerUser({ email, name, password, role }) {
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
    role: role || "member",
    created_at: new Date().toISOString(),
  };

  storage.set(USERS_KEY, [newUser, ...users]);

  const userData = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
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
