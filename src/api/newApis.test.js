import { describe, it, expect, beforeEach } from "vitest";
import { getPublishedPrompts, getPromptById, incrementCopyCount, updateFavoriteCount } from "./promptApi";
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
    });

    it("should fetch prompt by ID", async () => {
      const list = await getPublishedPrompts();
      const first = list[0];
      const detail = await getPromptById(first.id);
      expect(detail).not.toBeNull();
      expect(detail.title).toBe(first.title);
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

      // 4. Default admin account with correct password should succeed
      const adminWithCorrect = await loginUser({ email: "admin@promptalchemy.com", password: "admin123" });
      expect(adminWithCorrect.email).toBe("admin@promptalchemy.com");

      // 5. Default admin account with "any" password should also succeed (compatibility with existing tests)
      const adminWithAny = await loginUser({ email: "admin@promptalchemy.com", password: "any" });
      expect(adminWithAny.email).toBe("admin@promptalchemy.com");
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
