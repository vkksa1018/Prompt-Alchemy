import { describe, it, expect, beforeEach } from "vitest";
import { getPublishedPrompts, getPromptById, incrementCopyCount, updateFavoriteCount, normalizeExampleOutput } from "./promptApi";
import { loginUser, registerUser, updateUserProfile, updateUserPassword } from "./authApi";
import { getUserFavorites, saveUserFavorites } from "./favoriteApi";

describe("New Frontend Dynamic Mock APIs Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("promptApi tests", () => {
    it("should fetch published prompts and map categories/tags", async () => {
      const list = await getPublishedPrompts();
      expect(list.length).toBeGreaterThan(0);
      const first = list[0];
      expect(first.category).toBeDefined();
      expect(first.tags).toBeInstanceOf(Array);
      expect(first.date).toBeDefined();
      expect(first.likes).toBeDefined();
      expect(first.exampleOutput).toBeDefined();
      expect(Array.isArray(first.exampleOutput)).toBe(true);
    });

    it("should fetch prompt by ID", async () => {
      const list = await getPublishedPrompts();
      const first = list[0];
      const detail = await getPromptById(first.id);
      expect(detail).not.toBeNull();
      expect(detail.title).toBe(first.title);
      expect(detail.exampleOutput).toBeDefined();
      expect(Array.isArray(detail.exampleOutput)).toBe(true);
    });

    it("should normalize string exampleOutput correctly", () => {
      const normalized = normalizeExampleOutput("plain text output");
      expect(normalized).toEqual([
        { type: "text", data: { context: "plain text output" }, seq: 0 },
      ]);
    });

    it("should normalize object exampleOutput correctly", () => {
      const original = {
        outputText: "some text",
        outputImages: [{ url: "http://example.com/img.png", alt: "img", caption: "caption" }]
      };
      const normalized = normalizeExampleOutput(original);
      expect(normalized).toEqual([
        { type: "text", data: { context: "some text" }, seq: 0 },
        { type: "image", data: { context: "http://example.com/img.png", alt: "img", caption: "caption" }, seq: 1 },
      ]);
    });

    it("should fallback for null/undefined or invalid exampleOutput", () => {
      expect(normalizeExampleOutput(null)).toEqual([]);
      expect(normalizeExampleOutput(undefined)).toEqual([]);
      expect(normalizeExampleOutput(123)).toEqual([]);
    });

    it("should increment copy count", async () => {
      const list = await getPublishedPrompts();
      const first = list[0];
      const initialCopy = first.copyCount || 0;
      await incrementCopyCount(first.id);
      const updatedList = await getPublishedPrompts();
      const updated = updatedList.find(s => s.id === first.id);
      expect(updated.copyCount).toBe(initialCopy + 1);
    });

    it("should update favorite count", async () => {
      const list = await getPublishedPrompts();
      const first = list[0];
      const initialFav = first.favoriteCount || 0;
      await updateFavoriteCount(first.id, 1);
      let updatedList = await getPublishedPrompts();
      let updated = updatedList.find(s => s.id === first.id);
      expect(updated.favoriteCount).toBe(initialFav + 1);

      await updateFavoriteCount(first.id, -1);
      updatedList = await getPublishedPrompts();
      updated = updatedList.find(s => s.id === first.id);
      expect(updated.favoriteCount).toBe(initialFav);
    });

    it("should merge new skills and parameters when local storage contains only partial/legacy data", async () => {
      // Pre-seed with partial data (only 1 item)
      const partialSkills = [
        {
          id: "prompt-uuid-0001-0000-000000000001",
          title: "後端 API 審查",
          slug: "backend-api-review",
          intro: "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。",
          content_type_id: "ct-prompt-uuid-0000-000000000001",
          model_type: [
            "model-gpt-uuid-0000-000000000001",
          ],
          prompt_content: "foo",
          use_case: "bar",
          example_input: "baz",
          example_output: [{ type: "text", data: { context: "qux" }, seq: 0 }],
          category_id: "cat-backend-uuid-0000-000000000002",
          tags: [],
          source_url: "",
          copy_count: 0,
          favorite_count: 0,
          created_at: "2026-07-01T08:00:00Z",
          updated_at: "2026-07-01T12:00:00Z",
          is_active: true,
        }
      ];
      localStorage.setItem("admin_skills", JSON.stringify(partialSkills));

      const partialParams = [
        {
          id: "role-admin-uuid-0000-000000000001",
          type: "role",
          name: "Admin",
          memo: "系統管理員",
          is_active: true,
          sort_order: 1,
        }
      ];
      localStorage.setItem("admin_parameters", JSON.stringify(partialParams));

      // This call should merge the rest of the skills and parameters
      const list = await getPublishedPrompts();
      
      // Verify that skills 8 and 9 are present
      const item8 = list.find(s => s.id === "prompt-uuid-0001-0000-000000000008");
      const item9 = list.find(s => s.id === "prompt-uuid-0001-0000-000000000009");
      expect(item8).toBeDefined();
      expect(item8.title).toBe("動畫、影像產出_Gemini I");
      expect(item9).toBeDefined();
      expect(item9.title).toBe("動畫、影像產出_Gemini II");

      // Verify that other parameters (like models and categories) are also merged
      const cachedParams = JSON.parse(localStorage.getItem("admin_parameters"));
      const categoryUX = cachedParams.find(p => p.id === "cat-utility-uuid-0000-000000000011");
      expect(categoryUX).toBeDefined();
      expect(categoryUX.name).toBe("設計 / UX");
    });
  });

  describe("authApi tests", () => {
    it("should register new user and login via backend API", async () => {
      const testEmail = `test_${Date.now()}@example.com`;
      const reg = await registerUser({
        email: testEmail,
        name: "Tester",
        password: "Password123",
      });
      expect(reg.email).toBe(testEmail);

      const user = await loginUser({ email: testEmail, password: "Password123" });
      expect(user.email).toBe(testEmail);
      expect(user.token).toBeTruthy();
    });

    it("should authenticate default admin user and assign admin role", async () => {
      const admin = await loginUser({ email: "admin@example.com", password: "Admin1234" });
      expect(admin.email).toBe("admin@example.com");
      expect(admin.role).toBe("admin");
    });

    it("should reject invalid login credentials", async () => {
      await expect(
        loginUser({ email: "invalid_user_9999@example.com", password: "wrongpassword" })
      ).rejects.toThrow("email 或密碼錯誤");
    });
  });

  describe("favoriteApi tests", () => {
    it("should get defaults or save favorite lists", async () => {
      const favs = await getUserFavorites("test@example.com", "user-id");
      expect(favs).toBeInstanceOf(Array);

      await saveUserFavorites("test@example.com", ["item-1", "item-2"]);
      const updatedFavs = await getUserFavorites("test@example.com", "user-id");
      expect(updatedFavs).toEqual(["item-1", "item-2"]);
    });
  });
});
