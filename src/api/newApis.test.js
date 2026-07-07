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
      expect(user.username).toBe("James Admin");
    });

    it("should register new user and login", async () => {
      const reg = await registerUser({
        email: "test@example.com",
        username: "Tester",
        password: "password123",
      });
      expect(reg.email).toBe("test@example.com");

      const user = await loginUser({ email: "test@example.com", password: "password123" });
      expect(user.username).toBe("Tester");
    });

    it("should update user profile", async () => {
      await registerUser({
        email: "test@example.com",
        username: "Tester",
        password: "password123",
      });

      const updated = await updateUserProfile("test@example.com", {
        username: "Tester New",
        bio: "Bio Test",
      });
      expect(updated.username).toBe("Tester New");
      expect(updated.bio).toBe("Bio Test");

      const user = await loginUser({ email: "test@example.com", password: "password123" });
      expect(user.username).toBe("Tester New");
      expect(user.bio).toBe("Bio Test");
    });

    it("should update user password hash", async () => {
      await registerUser({
        email: "test@example.com",
        username: "Tester",
        password: "password123",
      });

      const success = await updateUserPassword("test@example.com", "password123", "newpassword");
      expect(success).toBe(true);
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
