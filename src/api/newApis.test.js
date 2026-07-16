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
      expect(first.exampleOutput).toBeTypeOf("object");
      expect(first.exampleOutput.outputText).toBeTypeOf("string");
      expect(Array.isArray(first.exampleOutput.outputImages)).toBe(true);
    });

    it("should fetch prompt by ID", async () => {
      const list = await getPublishedPrompts();
      const first = list[0];
      const detail = await getPromptById(first.id);
      expect(detail).not.toBeNull();
      expect(detail.title).toBe(first.title);
      expect(detail.exampleOutput).toBeDefined();
      expect(detail.exampleOutput).toBeTypeOf("object");
      expect(detail.exampleOutput.outputText).toBeTypeOf("string");
      expect(Array.isArray(detail.exampleOutput.outputImages)).toBe(true);
    });

    it("should normalize string exampleOutput correctly", () => {
      const normalized = normalizeExampleOutput("plain text output");
      expect(normalized.outputText).toBe("plain text output");
      expect(normalized.outputImages).toEqual([]);
    });

    it("should normalize object exampleOutput correctly", () => {
      const original = {
        outputText: "some text",
        outputImages: [{ url: "http://example.com/img.png", alt: "img", caption: "caption" }]
      };
      const normalized = normalizeExampleOutput(original);
      expect(normalized.outputText).toBe("some text");
      expect(normalized.outputImages).toEqual(original.outputImages);
    });

    it("should fallback for null/undefined or invalid exampleOutput", () => {
      expect(normalizeExampleOutput(null)).toEqual({ outputText: "", outputImages: [] });
      expect(normalizeExampleOutput(undefined)).toEqual({ outputText: "", outputImages: [] });
      expect(normalizeExampleOutput(123)).toEqual({ outputText: "", outputImages: [] });
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
          example_output: { outputText: "qux", outputImages: [] },
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
    it("should authenticate mock administrator or member", async () => {
      const user = await loginUser({ email: "admin@promptalchemy.com", password: "any" });
      expect(user.email).toBe("admin@promptalchemy.com");
      expect(user.name).toBe("James Admin");
    });

    it("should register new user and login", async () => {
      const reg = await registerUser({
        email: "test@example.com",
        name: "Tester",
        password: "password123",
      });
      expect(reg.email).toBe("test@example.com");

      const user = await loginUser({ email: "test@example.com", password: "password123" });
      expect(user.name).toBe("Tester");
    });

    it("should update user profile", async () => {
      await registerUser({
        email: "test@example.com",
        name: "Tester",
        password: "password123",
      });

      const updated = await updateUserProfile("test@example.com", {
        name: "Tester New",
      });
      expect(updated.name).toBe("Tester New");

      const user = await loginUser({ email: "test@example.com", password: "password123" });
      expect(user.name).toBe("Tester New");
    });

    it("should handle user password logic correctly", async () => {
      // 1. Register a user
      await registerUser({
        email: "test@example.com",
        name: "Tester",
        password: "password123",
      });

      // 2. Login with incorrect password should fail
      await expect(loginUser({ email: "test@example.com", password: "wrongpassword" }))
        .rejects.toThrow("密碼錯誤，請重新輸入");

      // 3. Login with correct password should succeed
      const user = await loginUser({ email: "test@example.com", password: "password123" });
      expect(user.name).toBe("Tester");

      // 4. Update user password
      const success = await updateUserPassword("test@example.com", "password123", "newpassword");
      expect(success).toBe(true);

      // 5. Login with old password should fail
      await expect(loginUser({ email: "test@example.com", password: "password123" }))
        .rejects.toThrow("密碼錯誤，請重新輸入");

      // 6. Login with new password should succeed
      const updatedUser = await loginUser({ email: "test@example.com", password: "newpassword" });
      expect(updatedUser.name).toBe("Tester");
    });

    it("should handle error cases and default accounts password checking", async () => {
      // 1. Login with non-existent email should fail
      await expect(loginUser({ email: "nonexistent@example.com", password: "any" }))
        .rejects.toThrow("此帳號不存在或已停用");

      // 2. Default member account with incorrect password should fail
      await expect(loginUser({ email: "user@promptalchemy.com", password: "wrongpassword" }))
        .rejects.toThrow("密碼錯誤，請重新輸入");

      // 3. Default member account with correct password should succeed
      const userWithCorrect = await loginUser({ email: "user@promptalchemy.com", password: "password123" });
      expect(userWithCorrect.email).toBe("user@promptalchemy.com");
      expect(userWithCorrect.name).toBe("New User");

      // 4. Default admin account with correct password should succeed
      const adminWithCorrect = await loginUser({ email: "admin@promptalchemy.com", password: "admin123" });
      expect(adminWithCorrect.email).toBe("admin@promptalchemy.com");

      // 5. Default admin account with "any" password should also succeed (compatibility with existing tests)
      const adminWithAny = await loginUser({ email: "admin@promptalchemy.com", password: "any" });
      expect(adminWithAny.email).toBe("admin@promptalchemy.com");
    });

    it("should migrate legacy user 'Jane User' to 'New User' on seed", async () => {
      const legacyUsers = [
        {
          id: "user-member-uuid-0000-000000000002",
          name: "Jane User",
          email: "user@promptalchemy.com",
          password_hash: "bcrypt-hash-placeholder-member",
          role: "member",
        }
      ];
      localStorage.setItem("admin_users", JSON.stringify(legacyUsers));

      const user = await loginUser({ email: "user@promptalchemy.com", password: "password123" });
      expect(user.name).toBe("New User");

      const updatedInStorage = JSON.parse(localStorage.getItem("admin_users"));
      const defaultUser = updatedInStorage.find(u => u.email === "user@promptalchemy.com");
      expect(defaultUser.name).toBe("New User");
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
