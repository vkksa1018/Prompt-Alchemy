// Relational Mock Database and Lookups

// 1. Parameters Table (Category, Role, contentType, model, tag)
export const parametersTable = [
  // Roles
  {
    id: "role-admin-uuid-0000-000000000001",
    type: "role",
    name: "Admin",
    memo: "系統管理員",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "role-member-uuid-0000-000000000002",
    type: "role",
    name: "Member",
    memo: "一般會員",
    isActive: true,
    sortOrder: 2,
  },

  // Content Types
  {
    id: "ct-prompt-uuid-0000-000000000001",
    type: "contentType",
    name: "prompt",
    memo: "Prompt 提示詞",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "ct-skill-uuid-0000-000000000002",
    type: "contentType",
    name: "skills",
    memo: "AI 技能",
    isActive: true,
    sortOrder: 2,
  },

  // Categories
  {
    id: "cat-frontend-uuid-0000-000000000001",
    type: "category",
    name: "前端開發",
    memo: "React, Vue, CSS 等前端開發技能",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-backend-uuid-0000-000000000002",
    type: "category",
    name: "後端開發",
    memo: "Node.js, Python, API 設計等後端開發技能",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-security-uuid-0000-000000000003",
    type: "category",
    name: "資安相關",
    memo: "漏洞檢測, 安全性檢查等資安相關技能",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "cat-debug-uuid-0000-000000000004",
    type: "category",
    name: "除錯技巧",
    memo: "除錯助手, 錯誤訊息分析等技能",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "cat-translate-uuid-0000-000000000005",
    type: "category",
    name: "翻譯助手",
    memo: "多國語言翻譯與文件潤飾技能",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "cat-utility-uuid-0000-000000000006",
    type: "category",
    name: "小工具",
    memo: "Regex 生成, JSON 格式化等輔助小工具",
    isActive: true,
    sortOrder: 6,
  },

  // Models
  {
    id: "model-gpt-uuid-0000-000000000001",
    type: "model",
    name: "gpt-4",
    memo: "OpenAI GPT-4",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "model-claude-uuid-0000-000000000002",
    type: "model",
    name: "claude-3.5",
    memo: "Anthropic Claude 3.5 Sonnet",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "model-codex-uuid-0000-000000000003",
    type: "model",
    name: "codex",
    memo: "GitHub Copilot Codex",
    isActive: true,
    sortOrder: 3,
  },

  // Tags
  {
    id: "tag-api-uuid-0000-000000000001",
    type: "tag",
    name: "#API",
    memo: "API 串接與設計",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "tag-security-uuid-0000-000000000002",
    type: "tag",
    name: "#Security",
    memo: "資訊安全與防禦",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "tag-react-uuid-0000-000000000003",
    type: "tag",
    name: "#React",
    memo: "React 元件開發",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "tag-debug-uuid-0000-000000000004",
    type: "tag",
    name: "#Debug",
    memo: "故障排除與除錯",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "tag-sql-uuid-0000-000000000005",
    type: "tag",
    name: "#SQL",
    memo: "資料庫查詢優化",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "tag-translation-uuid-0000-000000000006",
    type: "tag",
    name: "#Translation",
    memo: "多國語系翻譯",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "tag-node-uuid-0000-000000000007",
    type: "tag",
    name: "#Node.js",
    memo: "Node.js 執行環境",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "tag-express-uuid-0000-000000000008",
    type: "tag",
    name: "#Express",
    memo: "Express.js 框架",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "tag-vite-uuid-0000-000000000009",
    type: "tag",
    name: "#Vite",
    memo: "Vite 建置工具",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "tag-database-uuid-0000-000000000010",
    type: "tag",
    name: "#Database",
    memo: "資料庫儲存",
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "tag-mysql-uuid-0000-000000000011",
    type: "tag",
    name: "#MySQL",
    memo: "MySQL 資料庫",
    isActive: true,
    sortOrder: 11,
  },
  {
    id: "tag-web-uuid-0000-000000000012",
    type: "tag",
    name: "#Web",
    memo: "網頁應用開發",
    isActive: true,
    sortOrder: 12,
  },
];

// 2. Users Table
export const usersTable = [
  {
    id: "user-admin-uuid-0000-000000000001",
    name: "James Admin",
    email: "admin@promptalchemy.com",
    passwordHash: "bcrypt-hash-placeholder-admin",
    role_id: "role-admin-uuid-0000-000000000001", // FK
    isActive: true,
  },
  {
    id: "user-member-uuid-0000-000000000002",
    name: "Jane User",
    email: "user@promptalchemy.com",
    passwordHash: "bcrypt-hash-placeholder-member",
    role_id: "role-member-uuid-0000-000000000002", // FK
    isActive: true,
    avatar: "👤",
    role: "前端工程師",
    bio: "預設測試帳號，專門用於系統測試與功能展示。",
  },
];

// 3. SkillItem Table (Prompts / Skills)
export const skillItemsTable = [
  {
    id: "prompt-uuid-0001-0000-000000000001",
    title: "後端 API 審查",
    slug: "backend-api-review",
    intro: "檢查 Express / Next.js API 的錯誤處理、安全性與回傳結構。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-gpt-uuid-0000-000000000001", "model-claude-uuid-0000-000000000002"],
    promptContent: "請你扮演資深後端工程師，檢查以下 API 程式碼。\n幫我找出可能的錯誤、安全性風險、效能問題，\n並提出改善建議。\n\n輸出請包含：\n【程式碼問題】\n【改善建議程式碼】\n【為什麼這樣改】",
    useCase: "當你接收一支 API，需要 AI 幫你檢查安全性、錯誤處理與資料結構時使用。",
    exampleInput: "app.get('/api/user', async (req, res) => {\n  const id = req.query.id;\n  const user = await db.query(...);\n  res.json(user);\n});",
    exampleOutput: "【程式碼問題】\n1. 未進行輸入驗證，可能存在 SQL Injection 安全風險。\n2. 缺乏 try-catch 區塊，若資料庫查詢失敗會導致 server 當機。\n\n【改善建議程式碼】\n```javascript\napp.get('/api/user', async (req, res, next) => {\n  try {\n    const id = parseInt(req.query.id, 10);\n    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });\n    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);\n    res.json(user);\n  } catch (error) {\n    next(error);\n  }\n});\n```",
    categoryId: "cat-backend-uuid-0000-000000000002", // 後端開發
    tags: ["tag-api-uuid-0000-000000000001", "tag-security-uuid-0000-000000000002", "tag-express-uuid-0000-000000000008"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "https://expressjs.com/zh-tw/advanced/best-practice-security.html",
    copyCount: 125,
    favoriteCount: 32,
    status: "published",
    createdAt: "2026-07-01T08:00:00Z",
    updatedAt: "2026-07-01T12:00:00Z",
    isActive: true,
  },
  {
    id: "prompt-uuid-0001-0000-000000000002",
    title: "前端 Debug 助手",
    slug: "frontend-debug-assistant",
    intro: "協助找出 React / Next.js 專案的錯誤原因與除錯線索。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-claude-uuid-0000-000000000002"],
    promptContent: "請分析以下 React/Next.js 錯誤訊息，並給出可能的修復方案及除錯步驟：\n\n[在此輸入錯誤訊息]",
    useCase: "當 React 網頁發生 Runtime Error 或編譯失敗時，用於快速定位問題。",
    exampleInput: "TypeError: Cannot read properties of undefined (reading 'map')\n  at ProductList (ProductList.jsx:12)",
    exampleOutput: "【錯誤原因】\nProductList 組件中的資料（如 products）在渲染時尚為 undefined，就直接調用了 .map() 方法。\n\n【解決方案】\n使用 Optional Chaining (`products?.map(...)`) 或短路求值提供預設空陣列 (`(products || []).map(...)`)。",
    categoryId: "cat-frontend-uuid-0000-000000000001", // 前端開發
    tags: ["tag-react-uuid-0000-000000000003", "tag-debug-uuid-0000-000000000004", "tag-vite-uuid-0000-000000000009"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "https://react.dev/reference/react",
    copyCount: 98,
    favoriteCount: 21,
    status: "published",
    createdAt: "2026-06-28T09:30:00Z",
    updatedAt: "2026-06-28T09:30:00Z",
    isActive: true,
  },
  {
    id: "prompt-uuid-0001-0000-000000000003",
    title: "SQL 查詢優化",
    slug: "sql-query-optimization",
    intro: "分析 SQL 查詢效能瓶頸與最佳化建議。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-gpt-uuid-0000-000000000001", "model-codex-uuid-0000-000000000003"],
    promptContent: "請分析以下 SQL 查詢的效能瓶頸，並提供最佳化建議及索引設計：\n\n[在此輸入 SQL 語句]",
    useCase: "資料庫查詢速度過慢，或 Explain 計畫顯示進行全表掃描（Full Table Scan）時。",
    exampleInput: "SELECT * FROM orders WHERE user_id = 5 AND status = 'pending' ORDER BY created_at DESC;",
    exampleOutput: "【效能評估】\n如果 user_id 與 status 欄位沒有建立聯合索引（Composite Index），將會導致慢查詢。\n\n【建議索引】\n`CREATE INDEX idx_user_status_created ON orders (user_id, status, created_at DESC);`",
    categoryId: "cat-backend-uuid-0000-000000000002", // 後端開發
    tags: ["tag-sql-uuid-0000-000000000005", "tag-database-uuid-0000-000000000010", "tag-mysql-uuid-0000-000000000011"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "",
    copyCount: 77,
    favoriteCount: 18,
    status: "published",
    createdAt: "2026-06-25T14:15:00Z",
    updatedAt: "2026-06-25T14:15:00Z",
    isActive: true,
  },
  {
    id: "prompt-uuid-0001-0000-000000000004",
    title: "資安漏洞檢查清單",
    slug: "security-vulnerabilities-checklist",
    intro: "檢查常見的 Web 與雲端環境風險掃描方式。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-gpt-uuid-0000-000000000001", "model-claude-uuid-0000-000000000002"],
    promptContent: "請提供一份針對以下環境的 Web 應用程式安全檢測清單與常見漏洞防範建議：\n\n[在此說明技術棧環境]",
    useCase: "部署前進行安全性弱點自檢，或準備進行滲透測試時。",
    exampleInput: "Web API Node.js environment...",
    exampleOutput: "1. 檢查並停用不安全的 HTTP Header (建議使用 helmet 中間件)\n2. 防範 CORS 跨網域資源共享不當設定\n3. 限制 API 請求頻率 (Rate Limiting) 避免 DDoS 攻擊",
    categoryId: "cat-security-uuid-0000-000000000003", // 資安相關
    tags: ["tag-security-uuid-0000-000000000002", "tag-web-uuid-0000-000000000012"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "https://owasp.org/www-project-top-ten/",
    copyCount: 63,
    favoriteCount: 15,
    status: "published",
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    isActive: true,
  },
  {
    id: "prompt-uuid-0001-0000-000000000005",
    title: "英文翻譯與潤飾",
    slug: "english-translation-polishing",
    intro: "將中文技術文件翻譯為專業流暢的英文，並提供多種口吻潤飾。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-claude-uuid-0000-000000000002"],
    promptContent: "請將以下中文技術內容翻譯成專業、自然的英文，並提供 Academic 與 Professional 兩種口吻：\n\n[在此輸入內容]",
    useCase: "需要撰寫英文 API 文件、發布 PR 說明或學術發表論文時。",
    exampleInput: "如何使用 React 進行狀態管理...",
    exampleOutput: "Academic: How to leverage React for state management within web applications...\nProfessional: Efficient ways to manage state in your React projects...",
    categoryId: "cat-translate-uuid-0000-000000000005", // 翻譯助手
    tags: ["tag-translation-uuid-0000-000000000006", "tag-web-uuid-0000-000000000012"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "",
    copyCount: 180,
    favoriteCount: 42,
    status: "published",
    createdAt: "2026-07-02T11:00:00Z",
    updatedAt: "2026-07-02T11:00:00Z",
    isActive: true,
  },
  {
    id: "prompt-uuid-0001-0000-000000000006",
    title: "Regex 自動生成器",
    slug: "regex-generator",
    intro: "輸入期望匹配與排除的規則，自動產生高效率的正則表達式。",
    contentTypeId: "ct-prompt-uuid-0000-000000000001", // prompt
    modelType: ["model-gpt-uuid-0000-000000000001", "model-codex-uuid-0000-000000000003"],
    promptContent: "請根據以下條件生成一個高效的正則表達式，並附上測試案例說明：\n- 匹配：[條件]\n- 排除：[條件]\n\n輸入字串範例：",
    useCase: "驗證複雜輸入（如密碼複雜度、身分證字號、特定日誌格式）時。",
    exampleInput: "匹配 email 格式，並排除 .com 結尾...",
    exampleOutput: "`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?!com$)[a-zA-Z]{2,}$`",
    categoryId: "cat-utility-uuid-0000-000000000006", // 小工具
    tags: ["tag-debug-uuid-0000-000000000004", "tag-web-uuid-0000-000000000012"],
    userId: "user-admin-uuid-0000-000000000001",
    sourceUrl: "https://regex101.com/",
    copyCount: 110,
    favoriteCount: 29,
    status: "published",
    createdAt: "2026-06-15T15:45:00Z",
    updatedAt: "2026-06-15T15:45:00Z",
    isActive: true,
  },
];

// 4. Favorites Table (Composite PK: userId, SkillItemId)
export const favoritesTable = [
  {
    userId: "user-member-uuid-0000-000000000002",
    SkillItemId: "prompt-uuid-0001-0000-000000000001",
    createdAt: "2026-07-02T10:00:00Z",
    sortOrder: 1,
    memo: "API 審查必備",
  },
  {
    userId: "user-member-uuid-0000-000000000002",
    SkillItemId: "prompt-uuid-0001-0000-000000000002",
    createdAt: "2026-07-02T10:15:00Z",
    sortOrder: 2,
    memo: "前端 Debug",
  },
];

// Lookup Helpers & Selectors
export function getParameterById(id) {
  return parametersTable.find((p) => p.id === id);
}

export function getParameterName(id) {
  const p = getParameterById(id);
  return p ? p.name : "";
}

export function getParametersByType(type) {
  return parametersTable.filter((p) => p.type === type && p.isActive);
}

export function getPrompts() {
  return skillItemsTable.filter((item) => item.isActive && item.status === "published");
}

export function getPromptById(id) {
  return skillItemsTable.find((item) => item.id === id);
}
