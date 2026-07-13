import { describe, it, expect } from "vitest";
import {
  getParameterById,
  getParameterName,
  getParametersByType,
  getPrompts,
  getPromptById,
  parametersTable,
  skillItemsTable,
} from "./mockData";

describe("Relational Mock Database Helper Tests", () => {
  describe("getParameterById", () => {
    it("should return the correct parameter details for a valid ID", () => {
      const paramId = "cat-frontend-uuid-0000-000000000001";
      const param = getParameterById(paramId);
      expect(param).toBeDefined();
      expect(param.name).toBe("前端開發");
      expect(param.type).toBe("category");
    });

    it("should return undefined for a non-existent ID", () => {
      const param = getParameterById("invalid-id");
      expect(param).toBeUndefined();
    });
  });

  describe("getParameterName", () => {
    it("should return the name string for a valid ID", () => {
      const name = getParameterName("role-admin-uuid-0000-000000000001");
      expect(name).toBe("Admin");
    });

    it("should return an empty string for an invalid ID", () => {
      const name = getParameterName("invalid-id");
      expect(name).toBe("");
    });
  });

  describe("getParametersByType", () => {
    it("should return only parameters of the specified type", () => {
      const categories = getParametersByType("category");
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((cat) => {
        expect(cat.type).toBe("category");
        expect(cat.is_active).toBe(true);
      });
    });

    it("should return empty list if no active parameters match the type", () => {
      const results = getParametersByType("non-existent-type");
      expect(results).toEqual([]);
    });
  });

  describe("getPrompts", () => {
    it("should return only active and published prompts", () => {
      const prompts = getPrompts();
      expect(prompts.length).toBeGreaterThan(0);
      prompts.forEach((prompt) => {
        expect(prompt.is_active).toBe(true);
        expect(prompt.status).toBe(true);
      });
    });
  });

  describe("getPromptById", () => {
    it("should fetch details for a valid prompt ID", () => {
      const firstPrompt = skillItemsTable[0];
      const prompt = getPromptById(firstPrompt.id);
      expect(prompt).toBeDefined();
      expect(prompt.title).toBe(firstPrompt.title);
    });

    it("should return undefined for a non-existent prompt ID", () => {
      const prompt = getPromptById("invalid-prompt-uuid");
      expect(prompt).toBeUndefined();
    });
  });
});
