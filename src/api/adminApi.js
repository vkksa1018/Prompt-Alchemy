// Admin API
//
// 集中管理後台的資料存取。第一版使用 localStorage 作為 mock 儲存層，
// 以 mockData 為種子初始化，之後可將這些函式改為呼叫真實後端 API。
//
// 注意：前台頁面仍直接讀取 mockData 的靜態陣列，這裡的變更不會影響前台。

import { storage } from "../utils/storage";
import {
  parametersTable,
  skillItemsTable,
  usersTable,
} from "./mockData";
import { apiRequest } from "./apiClient";

const PARAMETERS_KEY = "admin_parameters";
const SKILLS_KEY = "admin_skills";
const USERS_KEY = "admin_users";
const ADMIN_AUTH_KEY = "admin_auth";

// ---- 種子初始化 -------------------------------------------------------------

function seedParameters() {
  const existing = storage.get(PARAMETERS_KEY);
  if (existing) {
    let updated = false;
    const merged = [...existing];
    parametersTable.forEach((p, index) => {
      if (!merged.some((item) => item.id === p.id)) {
        merged.push({
          id: p.id,
          type: p.type,
          name: p.name,
          description: p.memo || p.description || "",
          isActive: p.isActive ?? p.is_active ?? true,
          sortOrder: p.sortOrder ?? p.sort_order ?? (merged.length + 1),
          createdAt: p.createdAt || p.created_at || `2026-06-0${(index % 9) + 1}T08:00:00Z`,
        });
        updated = true;
      }
    });
    if (updated) {
      storage.set(PARAMETERS_KEY, merged);
      return merged;
    }
    return existing;
  }

  const seed = parametersTable.map((p, index) => ({
    id: p.id,
    type: p.type,
    name: p.name,
    description: p.memo || p.description || "",
    isActive: p.isActive ?? p.is_active ?? true,
    sortOrder: p.sortOrder ?? p.sort_order ?? (index + 1),
    createdAt: p.createdAt || p.created_at || `2026-06-0${(index % 9) + 1}T08:00:00Z`,
  }));

  storage.set(PARAMETERS_KEY, seed);
  return seed;
}

function seedSkills() {
  const existing = storage.get(SKILLS_KEY);
  if (existing) {
    let updated = false;
    const merged = [...existing];
    skillItemsTable.forEach((item) => {
      if (!merged.some((s) => s.id === item.id)) {
        merged.push({ ...item });
        updated = true;
      }
    });
    if (updated) {
      storage.set(SKILLS_KEY, merged);
      return merged;
    }
    return existing;
  }

  const seed = skillItemsTable.map((item) => ({ ...item }));
  storage.set(SKILLS_KEY, seed);
  return seed;
}

function seedUsers() {
  const existing = storage.get(USERS_KEY);
  if (existing) {
    let modified = false;
    const migrated = existing.map((u) => {
      let updatedUser = { ...u };
      if (updatedUser.isActive === undefined) {
        updatedUser.isActive = true;
        modified = true;
      }
      if (updatedUser.role_id !== undefined) {
        delete updatedUser.role_id;
        modified = true;
      }
      return updatedUser;
    });
    if (modified) {
      storage.set(USERS_KEY, migrated);
      return migrated;
    }
    return existing;
  }

  const seed = usersTable.map((u) => {
    return {
      ...u,
      isActive: true,
      createdAt: `2026-06-01T08:00:00Z`,
    };
  });
  storage.set(USERS_KEY, seed);
  return seed;
}

function readParameters() {
  return seedParameters();
}

function writeParameters(list) {
  storage.set(PARAMETERS_KEY, list);
  return list;
}

function readSkills() {
  return seedSkills();
}

function writeSkills(list) {
  storage.set(SKILLS_KEY, list);
  return list;
}

function readUsers() {
  return seedUsers();
}

function writeUsers(list) {
  storage.set(USERS_KEY, list);
  return list;
}

// ---- 工具 -------------------------------------------------------------------

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

// 模擬非同步 API，方便日後替換成真實請求
function resolve(value) {
  return Promise.resolve(
    typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value)),
  );
}

// ---- 統一參數管理 (Parameters CRUD) -------------------------------------------

export async function getParametersByType(type) {
  const result = await apiRequest(`/admin/parameters?type=${type}`);
  return result.data;
}

// 為了相容舊版呼叫，提供別名
export function getCategories() {
  return getParametersByType("category");
}

export async function createParameter(type, data) {
  const result = await apiRequest(`/admin/parameters`, {
    method: "POST",
    body: {
      type,
      name: data.name,
      description: data.description || "",
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder
    },
  });
  return result.data;
}

export async function updateParameter(id, data) {
  const result = await apiRequest(`/admin/parameters/${id}`, {
    method: "PUT",
    body: data,
  });
  return result.data;
}

export async function disableParameter(id) {
  const result = await apiRequest(`/admin/parameters/${id}`, {
    method: "DELETE",
  });
  return result.data;
}

// ---- 顯示用名稱解析（同步，供 Table 渲染用）-----------------------------------

export function getContentTypeLabel(id) {
  const opt = readParameters().find((p) => p.id === id);
  // name 為 "prompt" / "skills"，統一顯示為 Prompt / Skill
  if (!opt) return "";
  return opt.name === "prompt" ? "Prompt" : opt.name === "skills" ? "Skill" : opt.name;
}

export function getCategoryName(id) {
  const cat = readParameters().find((c) => c.id === id);
  return cat ? cat.name : "";
}

export function getModelLabels(ids = []) {
  const options = readParameters().filter((p) => p.type === "model");
  return ids
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean)
    .map((o) => o.name);
}

export function getTagLabels(ids = []) {
  const options = readParameters().filter((p) => p.type === "tag");
  return ids
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean)
    .map((o) => o.name);
}

// 狀態顯示。狀態只有啟用 / 未啟用兩種，用 isActive 這個布林表示。
export const ACTIVE_OPTIONS = [
  { value: "active", label: "啟用" },
  { value: "inactive", label: "未啟用" },
];

// 讀取「這筆資料是否啟用」的唯一入口。
//
// 為什麼要 fallback：seed 進來的資料（skillItemsTable）只有 snake_case 的
// is_active，後台新增的則是 camelCase 的 isActive。兩種命名會同時存在，
// 所以一律走這裡判斷，不要在各處自己寫 s.isActive。
// 都沒有時預設為啟用 —舊資料沒這個欄位不代表它被停用。
export function isSkillActive(skill) {
  return skill?.isActive ?? skill?.is_active ?? true;
}

// ---- Auth -------------------------------------------------------------------

export function loginAdmin({ email, password }) {
  const list = readUsers();
  const user = list.find(
    (u) => u.email === email && u.role === "admin" && (u.isActive ?? u.is_active ?? true)
  );

  if (!user) {
    return Promise.reject(new Error("帳號不存在或非管理者帳號"));
  }

  void password;

  const authUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "admin",
  };
  storage.set(ADMIN_AUTH_KEY, authUser);
  return resolve(authUser);
}

export function logoutAdmin() {
  storage.remove(ADMIN_AUTH_KEY);
  return Promise.resolve(true);
}

export function getAdminAuth() {
  return storage.get(ADMIN_AUTH_KEY);
}

// ---- Users ------------------------------------------------------------------

export function getUsers(role = null) {
  let list = readUsers();
  if (role) {
    list = list.filter((u) => u.role === role);
  }
  list = list.sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  return resolve(list);
}

export function createUser(data) {
  const list = readUsers();
  const user = {
    id: generateId("user"),
    name: data.name || "",
    email: data.email || "",
    role: data.role || "member",
    passwordHash: "bcrypt-hash-placeholder-new",
    password_hash: "bcrypt-hash-placeholder-new",
    isActive: data.isActive ?? true,
    is_active: data.isActive ?? true,
    createdAt: nowIso(),
    created_at: nowIso(),
  };
  writeUsers([user, ...list]);
  return resolve(user);
}

export function updateUser(id, data) {
  const list = readUsers();
  let updated = null;
  const next = list.map((u) => {
    if (u.id !== id) return u;
    updated = {
      ...u,
      name: data.name ?? u.name,
      email: data.email ?? u.email,
      role: data.role ?? u.role ?? "member",
      isActive: data.isActive ?? u.isActive ?? true,
      is_active: data.isActive ?? u.isActive ?? true,
    };
    return updated;
  });
  writeUsers(next);
  return updated ? resolve(updated) : Promise.reject(new Error("找不到會員"));
}

export function disableUser(id) {
  return updateUser(id, { isActive: false });
}

// ---- Skills -----------------------------------------------------------------

export function getSkills(filters = {}) {
  const { keyword, contentTypeId, categoryId, active } = filters;
  let list = readSkills();

  if (keyword) {
    const q = keyword.toLowerCase();
    list = list.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.intro || "").toLowerCase().includes(q),
    );
  }
  if (contentTypeId) {
    list = list.filter((s) => s.contentTypeId === contentTypeId);
  }
  if (categoryId) {
    list = list.filter((s) => s.categoryId === categoryId);
  }
  if (active) {
    const wantActive = active === "active";
    list = list.filter((s) => isSkillActive(s) === wantActive);
  }

  list = [...list].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  return resolve(list);
}

export function getSkillById(id) {
  const found = readSkills().find((s) => s.id === id);
  return found ? resolve(found) : Promise.resolve(null);
}

export function createSkill(data) {
  const list = readSkills();
  const timestamp = nowIso();
  const admin = getAdminAuth();
  const skill = {
    id: generateId("skill"),
    title: data.title || "",
    slug: data.slug || "",
    intro: data.intro || "",
    contentTypeId: data.contentTypeId || "",
    categoryId: data.categoryId || "",
    modelType: data.modelType || [],
    tags: data.tags || [],
    promptContent: data.promptContent || "",
    useCase: data.useCase || "",
    exampleInput: data.exampleInput || "",
    exampleOutput: data.exampleOutput || [],
    userId: admin?.id || "",
    sourceUrl: "",
    copyCount: 0,
    favoriteCount: 0,
    // 兩種命名都寫：前台的 getPublishedPrompts 讀的是 snake_case 的 is_active。
    // 只寫其中一個，停用就會在前台失效。
    isActive: data.isActive ?? true,
    is_active: data.isActive ?? true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  writeSkills([skill, ...list]);
  return resolve(skill);
}

const EDITABLE_SKILL_FIELDS = [
  "title",
  "slug",
  "intro",
  "contentTypeId",
  "categoryId",
  "modelType",
  "tags",
  "promptContent",
  "useCase",
  "exampleInput",
  "exampleOutput",
];

export function updateSkill(id, data) {
  const list = readSkills();
  let updated = null;
  const next = list.map((s) => {
    if (s.id !== id) return s;
    updated = { ...s };
    EDITABLE_SKILL_FIELDS.forEach((field) => {
      if (data[field] !== undefined) updated[field] = data[field];
    });
    // isActive 不走上面的迴圈：它得同時寫入兩種命名，否則前台讀不到。
    if (data.isActive !== undefined) {
      updated.isActive = data.isActive;
      updated.is_active = data.isActive;
    }
    updated.updatedAt = nowIso();
    return updated;
  });
  if (!updated && data && data.isActive !== undefined) {
    updated = { id, isActive: data.isActive, is_active: data.isActive, updatedAt: nowIso() };
    next.push(updated);
  }
  writeSkills(next);
  return updated ? resolve(updated) : Promise.reject(new Error("找不到資料"));
}

export function setSkillActive(id, isActive) {
  return updateSkill(id, { isActive });
}
