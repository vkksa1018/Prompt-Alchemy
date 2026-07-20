import { describe, it, expect, beforeEach } from "vitest";
import {
  isSkillActive,
  createSkill,
  updateSkill,
  setSkillActive,
  getSkillById,
  loginAdmin,
} from "./adminApi";
import { getPublishedPrompts } from "./promptApi";

describe("isSkillActive", () => {
  it("prefers camelCase isActive over snake_case", () => {
    expect(isSkillActive({ isActive: false, is_active: true })).toBe(false);
    expect(isSkillActive({ isActive: true, is_active: false })).toBe(true);
  });

  it("falls back to snake_case is_active for seeded records", () => {
    expect(isSkillActive({ is_active: false })).toBe(false);
    expect(isSkillActive({ is_active: true })).toBe(true);
  });

  it("defaults to true when neither field is present", () => {
    expect(isSkillActive({})).toBe(true);
  });

  it("defaults to true for null and undefined", () => {
    expect(isSkillActive(null)).toBe(true);
    expect(isSkillActive(undefined)).toBe(true);
  });
});

const mockSkillData = (overrides = {}) => ({
  title: "測試",
  slug: `test-slug-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  intro: "測試簡介",
  contentTypeId: "content-type-uuid-0000-000000000001",
  categoryId: "cat-writing-uuid-0000-000000000001",
  promptContent: "You are a helpful assistant.",
  useCase: "日常輔助",
  exampleInput: "你好",
  exampleOutput: "你好！請問有什麼我可以協助您的？",
  ...overrides,
});

describe("skill active field writes", () => {
  beforeEach(async () => {
    localStorage.clear();
    await loginAdmin({ email: "admin@example.com", password: "Admin1234" });
  });

  it("createSkill writes both isActive and is_active", async () => {
    const skill = await createSkill(mockSkillData({ isActive: false }));

    expect(skill.isActive).toBe(false);
    expect(skill.is_active).toBe(false);
  });

  it("createSkill defaults to active when isActive is omitted", async () => {
    const skill = await createSkill(mockSkillData());

    expect(skill.isActive).toBe(true);
    expect(skill.is_active).toBe(true);
  });

  it("createSkill no longer stores a status field", async () => {
    const skill = await createSkill(mockSkillData());

    expect(skill.status).toBeUndefined();
  });

  it("updateSkill keeps both fields in sync", async () => {
    const created = await createSkill(mockSkillData());
    const updated = await updateSkill(created.id, { isActive: false });

    expect(updated.isActive).toBe(false);
    expect(updated.is_active).toBe(false);
  });

  it("setSkillActive deactivates a skill", async () => {
    const created = await createSkill(mockSkillData());
    await setSkillActive(created.id, false);
    const found = await getSkillById(created.id);

    expect(isSkillActive(found)).toBe(false);
  });

  it("setSkillActive reactivates a deactivated skill", async () => {
    const created = await createSkill(mockSkillData({ isActive: false }));
    await setSkillActive(created.id, true);
    const found = await getSkillById(created.id);

    expect(isSkillActive(found)).toBe(true);
  });
});

describe("deactivating a seeded skill hides it from the public list", () => {
  beforeEach(async () => {
    localStorage.clear();
    await loginAdmin({ email: "admin@example.com", password: "Admin1234" });
  });

  // 這是本次設計的核心風險：seed 資料只有 snake_case 的 is_active，
  // 前台 getPublishedPrompts 讀的也是它。只寫 camelCase 會讓停用完全失效。
  it("removes the skill from getPublishedPrompts after deactivating", async () => {
    const before = await getPublishedPrompts();
    const target = before[0];
    expect(target).toBeDefined();

    await setSkillActive(target.id, false);

    const after = await getPublishedPrompts();
    expect(after.find((p) => p.id === target.id)).toBeUndefined();
    expect(after.length).toBe(before.length - 1);
  });
});
