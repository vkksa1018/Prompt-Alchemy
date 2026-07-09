import { storage } from "../utils/storage";
import { skillItemsTable, parametersTable } from "./mockData";

const SKILLS_KEY = "admin_skills";
const PARAMETERS_KEY = "admin_parameters";

function seedSkills() {
  const existing = storage.get(SKILLS_KEY);
  if (existing) return existing;
  storage.set(SKILLS_KEY, skillItemsTable);
  return skillItemsTable;
}

function seedParameters() {
  const existing = storage.get(PARAMETERS_KEY);
  if (existing) return existing;
  storage.set(PARAMETERS_KEY, parametersTable);
  return parametersTable;
}

export function getCategories() {
  const params = seedParameters();
  return Promise.resolve(params.filter((p) => p.type === "category" && p.isActive));
}

export function getTags() {
  const params = seedParameters();
  return Promise.resolve(params.filter((p) => p.type === "tag" && p.isActive));
}

export function getParameterName(id) {
  const params = seedParameters();
  const p = params.find((item) => item.id === id);
  return p ? p.name : "";
}

export function getPublishedPrompts() {
  const skills = seedSkills();
  const params = seedParameters();

  const getParamName = (id) => {
    const p = params.find((item) => item.id === id);
    return p ? p.name : "";
  };

  const list = skills
    .filter((s) => s.isActive && s.status === "published")
    .map((item) => {
      const categoryName = getParamName(item.categoryId);
      const tagNames = (item.tags || []).map((tagId) => getParamName(tagId));
      const createdDate = item.createdAt.split("T")[0];

      // Calculate dynamic tags
      const isNew = new Date(item.createdAt) >= new Date("2026-06-25T00:00:00Z");
      const isHot = item.favoriteCount >= 20;

      return {
        ...item,
        category: categoryName,
        tags: tagNames,
        date: createdDate,
        isNew,
        isHot,
        likes: item.favoriteCount,
        uses: item.copyCount,
        description: item.intro,
        content: item.promptContent,
      };
    });

  return Promise.resolve(list);
}

export function getPromptById(id) {
  const skills = seedSkills();
  const params = seedParameters();

  const getParamName = (id) => {
    const p = params.find((item) => item.id === id);
    return p ? p.name : "";
  };

  const item = skills.find(
    (s) => s.id === id && s.isActive && s.status === "published"
  );
  if (!item) return Promise.resolve(null);

  const categoryName = getParamName(item.categoryId);
  const tagNames = (item.tags || []).map((tagId) => getParamName(tagId));

  const promptData = {
    ...item,
    category: categoryName,
    tags: tagNames,
    description: item.intro,
    promptContent: item.promptContent,
    exampleContent: item.exampleInput, // Maps to exampleInput in the schema
    phoneDesc: item.intro,
    phoneCode: item.promptContent.slice(0, 40),
  };

  return Promise.resolve(promptData);
}

export function incrementCopyCount(id) {
  const skills = seedSkills();
  const list = skills.map((s) => {
    if (s.id === id) {
      return { ...s, copyCount: (s.copyCount || 0) + 1 };
    }
    return s;
  });
  storage.set(SKILLS_KEY, list);
  return Promise.resolve(true);
}

export function updateFavoriteCount(id, amount) {
  const skills = seedSkills();
  const list = skills.map((s) => {
    if (s.id === id) {
      return { ...s, favoriteCount: Math.max(0, (s.favoriteCount || 0) + amount) };
    }
    return s;
  });
  storage.set(SKILLS_KEY, list);
  return Promise.resolve(true);
}
