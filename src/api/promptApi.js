import { storage } from "../utils/storage";
import { skillItemsTable, parametersTable } from "./mockData";

const SKILLS_KEY = "admin_skills";
const PARAMETERS_KEY = "admin_parameters";

function seedSkills() {
  const existing = storage.get(SKILLS_KEY);
  if (existing && existing.length > 0 && "is_active" in existing[0]) {
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
  storage.set(SKILLS_KEY, skillItemsTable);
  return skillItemsTable;
}

function seedParameters() {
  const existing = storage.get(PARAMETERS_KEY);
  if (existing && existing.length > 0 && "is_active" in existing[0]) {
    let updated = false;
    const merged = [...existing];
    parametersTable.forEach((param) => {
      if (!merged.some((p) => p.id === param.id)) {
        merged.push({ ...param });
        updated = true;
      }
    });
    if (updated) {
      storage.set(PARAMETERS_KEY, merged);
      return merged;
    }
    return existing;
  }
  storage.set(PARAMETERS_KEY, parametersTable);
  return parametersTable;
}

export function getCategories() {
  const params = seedParameters();
  return Promise.resolve(params.filter((p) => p.type === "category" && p.is_active));
}

export function getTags() {
  const params = seedParameters();
  return Promise.resolve(params.filter((p) => p.type === "tag" && p.is_active));
}

export function getParameterName(id) {
  const params = seedParameters();
  const p = params.find((item) => item.id === id);
  return p ? p.name : "";
}

export function normalizeExampleOutput(exampleOutput) {
  if (typeof exampleOutput === "string") {
    return {
      outputText: exampleOutput,
      outputImages: [],
    };
  }
  if (exampleOutput && typeof exampleOutput === "object") {
    return {
      outputText: exampleOutput.outputText || "",
      outputImages: Array.isArray(exampleOutput.outputImages)
        ? exampleOutput.outputImages
        : [],
    };
  }
  return {
    outputText: "",
    outputImages: [],
  };
}

export function getPublishedPrompts() {
  const skills = seedSkills();
  const params = seedParameters();

  const getParamName = (id) => {
    const p = params.find((item) => item.id === id);
    return p ? p.name : "";
  };

  const list = skills
    .filter((s) => s.is_active)
    .map((item) => {
      const categoryName = getParamName(item.category_id);
      const tagNames = (item.tags || []).map((tagId) => getParamName(tagId));
      const createdDate = item.created_at.split("T")[0];

      // Calculate dynamic tags
      const isNew = new Date(item.created_at) >= new Date("2026-06-25T00:00:00Z");
      const isHot = item.favorite_count >= 20;

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        intro: item.intro,
        contentTypeId: item.content_type_id,
        modelType: item.model_type,
        promptContent: item.prompt_content,
        useCase: item.use_case,
        exampleInput: item.example_input,
        exampleOutput: normalizeExampleOutput(item.example_output),
        categoryId: item.category_id,
        tags: tagNames,
        sourceUrl: item.source_url,
        copyCount: item.copy_count,
        favoriteCount: item.favorite_count,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isActive: item.is_active,

        category: categoryName,
        date: createdDate,
        isNew,
        isHot,
        likes: item.favorite_count,
        uses: item.copy_count,
        description: item.intro,
        content: item.prompt_content,
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
    (s) => s.id === id && s.is_active
  );
  if (!item) return Promise.resolve(null);

  const categoryName = getParamName(item.category_id);
  const tagNames = (item.tags || []).map((tagId) => getParamName(tagId));

  const promptData = {
    id: item.id,
    title: item.title,
    slug: item.slug,
    intro: item.intro,
    contentTypeId: item.content_type_id,
    modelType: item.model_type,
    promptContent: item.prompt_content,
    useCase: item.use_case,
    exampleInput: item.example_input,
    exampleOutput: normalizeExampleOutput(item.example_output),
    categoryId: item.category_id,
    tags: tagNames,
    sourceUrl: item.source_url,
    copyCount: item.copy_count,
    favoriteCount: item.favorite_count,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    isActive: item.is_active,

    category: categoryName,
    description: item.intro,
    exampleContent: item.example_input, // Maps to exampleInput in the schema
    phoneDesc: item.intro,
    phoneCode: item.prompt_content.slice(0, 40),
  };

  return Promise.resolve(promptData);
}

export function incrementCopyCount(id) {
  const skills = seedSkills();
  const list = skills.map((s) => {
    if (s.id === id) {
      return { ...s, copy_count: (s.copy_count || 0) + 1 };
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
      return { ...s, favorite_count: Math.max(0, (s.favorite_count || 0) + amount) };
    }
    return s;
  });
  storage.set(SKILLS_KEY, list);
  return Promise.resolve(true);
}
