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

const CATEGORIES_KEY = "admin_categories";
const SKILLS_KEY = "admin_skills";
const ADMIN_AUTH_KEY = "admin_auth";

// ---- 種子初始化 -------------------------------------------------------------

function seedCategories() {
  const existing = storage.get(CATEGORIES_KEY);
  if (existing) return existing;

  const seed = parametersTable
    .filter((p) => p.type === "category")
    .map((p, index) => ({
      id: p.id,
      name: p.name,
      description: p.memo || "",
      isActive: p.isActive,
      sortOrder: p.sortOrder,
      // 原始資料沒有建立時間，種子階段補上一個合理的時間
      createdAt: p.createdAt || `2026-06-0${index + 1}T08:00:00Z`,
    }));

  storage.set(CATEGORIES_KEY, seed);
  return seed;
}

function seedSkills() {
  const existing = storage.get(SKILLS_KEY);
  if (existing) return existing;

  const seed = skillItemsTable.map((item) => ({ ...item }));
  storage.set(SKILLS_KEY, seed);
  return seed;
}

function readCategories() {
  return seedCategories();
}

function writeCategories(list) {
  storage.set(CATEGORIES_KEY, list);
  return list;
}

function readSkills() {
  return seedSkills();
}

function writeSkills(list) {
  storage.set(SKILLS_KEY, list);
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

// ---- 參數 / 選項 lookup（models / tags / contentTypes 維持靜態）------------

export function getContentTypeOptions() {
  return parametersTable
    .filter((p) => p.type === "contentType" && p.isActive)
    .map((p) => ({
      id: p.id,
      value: p.name,
      // name 為 "prompt" / "skills"，統一顯示為 Prompt / Skill
      label: p.name === "prompt" ? "Prompt" : "Skill",
    }));
}

export function getModelOptions() {
  return parametersTable
    .filter((p) => p.type === "model" && p.isActive)
    .map((p) => ({ id: p.id, label: p.name, memo: p.memo }));
}

export function getTagOptions() {
  return parametersTable
    .filter((p) => p.type === "tag" && p.isActive)
    .map((p) => ({ id: p.id, label: p.name, memo: p.memo }));
}

// 顯示用名稱解析（同步）
export function getContentTypeLabel(id) {
  const opt = getContentTypeOptions().find((o) => o.id === id);
  return opt ? opt.label : "";
}

export function getCategoryName(id) {
  const cat = readCategories().find((c) => c.id === id);
  return cat ? cat.name : "";
}

export function getModelLabels(ids = []) {
  const options = getModelOptions();
  return ids
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean)
    .map((o) => o.label);
}

export function getTagLabels(ids = []) {
  const options = getTagOptions();
  return ids
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean)
    .map((o) => o.label);
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
  // Mock login：比對 usersTable 中的 admin 帳號，密碼不驗證（第一版）。
  const user = usersTable.find(
    (u) => u.email === email && u.role_id?.startsWith("role-admin"),
  );

  if (!user) {
    return Promise.reject(new Error("帳號不存在或非管理者帳號"));
  }

  // 保留 password 參數位置，未來可在此串接真實驗證
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

// ---- Categories -------------------------------------------------------------

export function getCategories() {
  const list = [...readCategories()].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );
  return resolve(list);
}

export function createCategory(data) {
  const list = readCategories();
  const category = {
    id: generateId("cat"),
    name: data.name,
    description: data.description || "",
    isActive: data.isActive ?? true,
    sortOrder: list.length + 1,
    createdAt: nowIso(),
  };
  writeCategories([...list, category]);
  return resolve(category);
}

export function updateCategory(id, data) {
  const list = readCategories();
  let updated = null;
  const next = list.map((c) => {
    if (c.id !== id) return c;
    updated = {
      ...c,
      name: data.name ?? c.name,
      description: data.description ?? c.description,
      isActive: data.isActive ?? c.isActive,
    };
    return updated;
  });
  writeCategories(next);
  return updated
    ? resolve(updated)
    : Promise.reject(new Error("找不到分類"));
}

export function disableCategory(id) {
  return updateCategory(id, { isActive: false });
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
