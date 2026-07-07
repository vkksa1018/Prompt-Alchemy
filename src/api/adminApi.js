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

const PARAMETERS_KEY = "admin_parameters";
const SKILLS_KEY = "admin_skills";
const USERS_KEY = "admin_users";
const ADMIN_AUTH_KEY = "admin_auth";

// ---- 種子初始化 -------------------------------------------------------------

function seedParameters() {
  const existing = storage.get(PARAMETERS_KEY);
  if (existing) return existing;

  const seed = parametersTable.map((p, index) => ({
    id: p.id,
    type: p.type,
    name: p.name,
    description: p.memo || p.description || "",
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt || `2026-06-0${(index % 9) + 1}T08:00:00Z`,
  }));

  storage.set(PARAMETERS_KEY, seed);
  return seed;
}

function seedSkills() {
  const existing = storage.get(SKILLS_KEY);
  if (existing) return existing;

  const seed = skillItemsTable.map((item) => ({ ...item }));
  storage.set(SKILLS_KEY, seed);
  return seed;
}

function seedUsers() {
  const existing = storage.get(USERS_KEY);
  if (existing) return existing;

  const seed = usersTable.map((u) => ({
    ...u,
    createdAt: `2026-06-01T08:00:00Z`,
  }));
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

export function getParametersByType(type) {
  const list = readParameters()
    .filter((p) => p.type === type)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return resolve(list);
}

// 為了相容舊版呼叫，提供別名
export function getCategories() {
  return getParametersByType("category");
}

export function createParameter(type, data) {
  const list = readParameters();
  const param = {
    id: generateId(type),
    type: type,
    name: data.name,
    description: data.description || "",
    isActive: data.isActive ?? true,
    sortOrder: list.length + 1,
    createdAt: nowIso(),
  };
  writeParameters([...list, param]);
  return resolve(param);
}

export function updateParameter(id, data) {
  const list = readParameters();
  let updated = null;
  const next = list.map((p) => {
    if (p.id !== id) return p;
    updated = {
      ...p,
      name: data.name ?? p.name,
      description: data.description ?? p.description,
      isActive: data.isActive ?? p.isActive,
    };
    return updated;
  });
  writeParameters(next);
  return updated ? resolve(updated) : Promise.reject(new Error("找不到參數"));
}

export function disableParameter(id) {
  return updateParameter(id, { isActive: false });
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

// 狀態顯示
export const STATUS_OPTIONS = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已發布" },
  { value: "archived", label: "封存" },
];

export function getStatusLabel(status) {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
}

// ---- Auth -------------------------------------------------------------------

export function loginAdmin({ email, password }) {
  const list = readUsers();
  const user = list.find(
    (u) => u.email === email && u.role_id?.startsWith("role-admin") && u.isActive
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

export function getUsers(roleId = null) {
  let list = readUsers();
  if (roleId) {
    list = list.filter((u) => u.role_id === roleId);
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
    role_id: data.role_id || "",
    passwordHash: "bcrypt-hash-placeholder-new",
    isActive: data.isActive ?? true,
    createdAt: nowIso(),
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
      role_id: data.role_id ?? u.role_id,
      isActive: data.isActive ?? u.isActive,
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
  const { keyword, contentTypeId, categoryId, status } = filters;
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
  if (status) {
    list = list.filter((s) => s.status === status);
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
    exampleOutput: data.exampleOutput || "",
    status: data.status || "draft",
    userId: admin?.id || "",
    sourceUrl: "",
    copyCount: 0,
    favoriteCount: 0,
    isActive: true,
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
  "status",
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
    updated.updatedAt = nowIso();
    return updated;
  });
  writeSkills(next);
  return updated ? resolve(updated) : Promise.reject(new Error("找不到資料"));
}

export function archiveSkill(id) {
  return updateSkill(id, { status: "archived" });
}
