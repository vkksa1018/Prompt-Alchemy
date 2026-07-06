// Prompt / Skill 的「表單畫面」，新增頁與編輯頁共用同一個元件。
//
// 使用 react-hook-form 管理表單狀態與驗證：
//  - 一般欄位（文字 / textarea / select）用 register 綁定，RHF 自動收集值。
//  - 陣列型欄位（適用模型、標籤）不是原生 input，改用 setValue 手動寫入，
//    再用 useWatch 讀回目前選取值來畫出「被選中」的樣式。
//  - 驗證只在送出時觸發；通過後才呼叫 props.onSubmit(data)。
import { useForm, useWatch } from "react-hook-form";
import {
  getContentTypeOptions,
  getModelOptions,
  getTagOptions,
  STATUS_OPTIONS,
} from "../../api/adminApi";

// 共用的 input 樣式，抽出來避免每個欄位重複一長串 className。
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

// 表單所有欄位的預設值。新增模式會整份套用；
// 編輯模式會用 { ...DEFAULTS, ...initialValues } 覆蓋，確保欄位都有初始值。
const DEFAULTS = {
  title: "",
  slug: "",
  intro: "",
  contentTypeId: "",
  categoryId: "",
  modelType: [],
  tags: [],
  promptContent: "",
  useCase: "",
  exampleInput: "",
  exampleOutput: "",
  status: "draft",
};

// 產生「必填文字欄位」的 react-hook-form 驗證規則。
// required 擋空字串；validate 再擋「只打空白」的情況（trim 後仍為空就算沒填）。
const requiredText = (label) => ({
  required: `${label}為必填`,
  validate: (v) => (typeof v === "string" && v.trim() !== "") || `${label}為必填`,
});

function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">
        {title}
      </div>
      {children}
    </section>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export default function SkillForm({
  initialValues,
  categories,
  onSubmit,
  onCancel,
}) {
  const {
    register, // 綁定原生欄位（value + onChange + ref 一次搞定）
    handleSubmit, // 包住送出：先跑驗證，通過才呼叫我們的 onSubmit
    control, // 給 useWatch 訂閱欄位值用
    setValue, // 手動寫入欄位值（給非原生的 chips 用）
    formState: { errors, isSubmitting },
  } = useForm({
    // 編輯模式的 initialValues 會覆蓋 DEFAULTS，達成「同一表單、兩種模式」。
    defaultValues: { ...DEFAULTS, ...initialValues },
  });

  // 下拉 / chips 的選項來源（型別、模型、標籤都來自 adminApi 的參數表）。
  const contentTypes = getContentTypeOptions();
  const models = getModelOptions();
  const tags = getTagOptions();

  // 適用模型、標籤是「多選 chips」，不是原生 input，
  // 所以用 useWatch 讀目前選取的陣列，好在畫面上標示哪些被選中。
  const selectedModels = useWatch({ control, name: "modelType" }) || [];
  const selectedTags = useWatch({ control, name: "tags" }) || [];

  // 點一下 chip：已選就移除、未選就加入，再用 setValue 寫回表單狀態。
  const toggleInArray = (field, current, value) => {
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldDirty: true },
    );
  };

  return (
    // handleSubmit(onSubmit)：送出時先驗證，全部通過才把資料交給 onSubmit。
    // 表單分成 5 個區塊呈現，降低一次填一堆欄位的壓力。
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. 基本資料 */}
      <Section title="基本資料">
        <div className="space-y-1.5">
          <Label required>標題</Label>
          <input
            type="text"
            {...register("title", requiredText("標題"))}
            className={inputClass}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label required>Slug（網址識別名稱）</Label>
          <input
            type="text"
            placeholder="例如：backend-api-review"
            {...register("slug", requiredText("網址識別名稱 (slug)"))}
            className={inputClass}
          />
          {errors.slug && (
            <p className="text-xs text-red-500">{errors.slug.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label required>簡介（顯示在卡片上）</Label>
          <textarea
            rows={2}
            {...register("intro", requiredText("簡介"))}
            className={`${inputClass} resize-y`}
          />
          {errors.intro && (
            <p className="text-xs text-red-500">{errors.intro.message}</p>
          )}
        </div>
      </Section>

      {/* 2. 分類設定 */}
      <Section title="分類設定">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label required>資料類型</Label>
            <select
              {...register("contentTypeId", { required: "資料類型為必填" })}
              className={inputClass}
            >
              <option value="">請選擇</option>
              {contentTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.label}
                </option>
              ))}
            </select>
            {errors.contentTypeId && (
              <p className="text-xs text-red-500">
                {errors.contentTypeId.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label required>所屬分類</Label>
            <select
              {...register("categoryId", { required: "所屬分類為必填" })}
              className={inputClass}
            >
              <option value="">請選擇</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>適用模型</Label>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => {
              const active = selectedModels.includes(model.id);
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() =>
                    toggleInArray("modelType", selectedModels, model.id)
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {model.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>標籤</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleInArray("tags", selectedTags, tag.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 3. 主要內容 */}
      <Section title="主要內容">
        <div className="space-y-1.5">
          <Label required>Prompt / Skill 主要內容</Label>
          <textarea
            rows={6}
            {...register("promptContent", requiredText("主要內容"))}
            className={`${inputClass} resize-y font-mono`}
          />
          {errors.promptContent && (
            <p className="text-xs text-red-500">
              {errors.promptContent.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>使用情境</Label>
          <textarea
            rows={3}
            {...register("useCase")}
            className={`${inputClass} resize-y`}
          />
        </div>
      </Section>

      {/* 4. 範例內容 */}
      <Section title="範例內容">
        <div className="space-y-1.5">
          <Label>範例輸入</Label>
          <textarea
            rows={4}
            {...register("exampleInput")}
            className={`${inputClass} resize-y font-mono`}
          />
        </div>
        <div className="space-y-1.5">
          <Label>範例輸出</Label>
          <textarea
            rows={4}
            {...register("exampleOutput")}
            className={`${inputClass} resize-y font-mono`}
          />
        </div>
      </Section>

      {/* 5. 發布設定 */}
      <Section title="發布設定">
        <div className="space-y-1.5 sm:max-w-xs">
          <Label required>狀態</Label>
          <select
            {...register("status", { required: "狀態為必填" })}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-xs text-red-500">{errors.status.message}</p>
          )}
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "儲存中…" : "儲存"}
        </button>
      </div>
    </form>
  );
}
