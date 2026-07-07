import { storage } from "../utils/storage";
import { usersTable } from "./mockData";

const USERS_KEY = "admin_users";

function seedUsers() {
  const existing = storage.get(USERS_KEY);
  if (existing) return existing;
  storage.set(USERS_KEY, usersTable);
  return usersTable;
}

export function loginUser({ email, password }) {
  const users = seedUsers();
  const found = users.find((u) => u.email === email && u.isActive);
  if (!found) {
    return Promise.reject(new Error("此帳號不存在或已停用"));
  }
  // In a mock setting, accept any password or verify against mock database if desired.
  // Note that password hash checks can be mocked.
  const userData = {
    id: found.id,
    email: found.email,
    username: found.name,
    avatar: found.avatar || "👤",
    bio: found.bio || "這個使用者很懶，還沒有寫下任何個人簡介。",
    role: found.role || "前端工程師",
  };
  return Promise.resolve(userData);
}

export function registerUser({ email, username, password, avatar, role, bio }) {
  const users = seedUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return Promise.reject(new Error("此電子郵件已被註冊"));
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: username,
    email: email,
    passwordHash: `mock-hash-${password}`,
    role_id: "role-member-uuid-0000-000000000002", // general member
    avatar: avatar || "👤",
    role: role || "前端工程師",
    bio: bio || "這個使用者很懶，還沒有寫下任何個人簡介。",
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  storage.set(USERS_KEY, [newUser, ...users]);

  const userData = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.name,
    avatar: newUser.avatar,
    bio: newUser.bio,
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
        name: data.username ?? u.name,
        avatar: data.avatar ?? u.avatar,
        role: data.role ?? u.role,
        bio: data.bio ?? u.bio,
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
      username: updated.name,
      avatar: updated.avatar,
      bio: updated.bio,
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
        passwordHash: `mock-hash-${newPassword}`,
      };
    }
    return u;
  });
  storage.set(USERS_KEY, list);
  return Promise.resolve(true);
}
