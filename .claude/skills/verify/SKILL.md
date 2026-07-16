---
name: verify
description: Launch and drive the Prompt-Alchemy app (Vite + React, localStorage mock backend) to verify a change at its real surface.
---

# Verifying Prompt-Alchemy

Vite + React SPA. There is no backend — all data lives in `localStorage`,
seeded from `src/api/mockData.js` on first read.

## Launch

```bash
npx vite --port 5199 > $TMPDIR/vite.log 2>&1 &
sleep 4; cat $TMPDIR/vite.log
```

Base path is `/Prompt-Alchemy/`, and the app uses a **hash router**.
URLs must look like:

```
http://localhost:5199/Prompt-Alchemy/#/admin/skills/new
```

`…/Prompt-Alchemy/admin/login` (no `#`) silently renders the public
home page instead of the route you wanted — an easy 10 minutes lost.

Stop with `pkill -f "vite --port 5199"`.

## Getting into the admin area

Don't type into the login form — seed the session directly:

```js
localStorage.setItem("admin_auth", JSON.stringify({
  id: "user-admin-uuid-0000-000000000001",
  name: "James Admin",
  email: "admin@promptalchemy.com",
  role: "admin",
}));
location.hash = "#/admin/skills";
```

`loginAdmin` ignores the password entirely (`adminApi.js`, `void password`),
so the only thing that matters is the `admin_auth` key.

Note `admin_users` is seeded lazily — it may not exist until something reads it.
Don't look up the admin id from localStorage; use the literal above from
`mockData.js` `usersTable`.

## localStorage keys

| Key | Contents |
|---|---|
| `admin_auth` | current admin session |
| `admin_skills` | prompt/skill records (seeded from `skillItemsTable`) |
| `admin_users` | users (seeded from `usersTable`) |
| `admin_parameters` | categories / content types / models / tags |

Reset any of them with `localStorage.removeItem(...)` and reload to re-seed.

## Gotchas

- **Seeded records are snake_case.** `seedSkills` copies `skillItemsTable`
  verbatim, so records carry `example_output`, `prompt_content`,
  `content_type_id` etc. Records created through the admin form are
  camelCase. Anything reading both shapes needs to handle both.
- **Navigating `/admin/skills/:id/edit` → `/admin/skills/new` does not reset
  the form.** Both routes render `AdminSkillFormManager`, so React reuses the
  component and react-hook-form keeps its old state. Full page reload
  (`navigate` to the URL) is also not enough — the hash change alone won't
  remount. Reload the tab if you need a genuinely blank form.
- Cleaning up after a test submit: filter the record out of `admin_skills`
  rather than clearing the whole key, so the other seeds survive.

## Flows worth driving

- **Admin skill form**: `#/admin/skills/new` — fill 標題 / Slug / 簡介,
  pick 資料類型 + 所屬分類, fill 主要內容, then submit. Redirects to
  `#/admin/skills` on success. Inspect the result via
  `JSON.parse(localStorage.getItem("admin_skills"))`.
- **Public detail page**: `#/skills/<slug>` renders `skillDetail.jsx`.
