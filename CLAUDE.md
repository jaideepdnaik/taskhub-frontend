# TaskHub Frontend

React frontend for TaskHub, a multi-tenant project & task management platform (like a
lightweight Jira/Asana). Each user belongs to one or more **Organizations**. Inside an org
they manage projects and tasks on a Kanban board. The Django REST API lives in a separate
repo (`taskhub-backend`). The API docs are at http://localhost:8000/api/docs/.

## Stack
React 19 · Vite · JavaScript (JSX) · Redux Toolkit · TanStack React Query v5 ·
React Router v7 · Axios · @dnd-kit (Kanban) · oxlint

## Commands
- `npm run dev`: dev server at http://localhost:5173. It proxies `/api` to `http://localhost:8000`, so the backend must be running.
- `npm run build`: production build
- `npm run lint`: oxlint
- **Windows note:** the `&` in this repo's path (`Learnings & Personal`) breaks npm's `.cmd` shims. Run the tools through node instead:
  `node node_modules/vite/bin/vite.js` (dev), `node node_modules/vite/bin/vite.js build`, `node node_modules/oxlint/bin/oxlint src`,
  and `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install <pkg>` for npm.

## Layout
- `src/app/`: `store.js` (Redux), `queryClient.js` and `router.jsx`
- `src/api/client.js`: the Axios instance. It attaches `Bearer` tokens and refreshes once on a 401. **Always use `api` from here. Never call `fetch` or plain `axios` directly.**
- `src/features/<feature>/` holds everything for one feature (auth, orgs, projects, tasks, notifications):
  - `api.js` for request functions
  - `queries.js` for React Query hooks and query keys
  - `*Slice.js` only if the feature has client state
  - components used only by that feature
- `src/components/`: shared, reusable UI (`FormField`, `Modal`, `ConfirmDialog`, `Pagination`, `ErrorState`, `Avatar`, `StatTile`, `BarBreakdown`, `CopyField`)
- `src/hooks/`: shared hooks (`useDebouncedValue`, `useDismiss`)
- `src/utils/`: plain helpers (`time.js` for dates)
- `src/api/errors.js`: `parseApiError(error)` turns a DRF error into `{fields, message}` for forms
- `src/app/listeners.js`: Redux listener middleware for side effects (sets `X-Org-ID`, clears the cache on org switch and logout)
- `src/layouts/`, `src/pages/`: route-level pages, kept thin. They compose feature components.

## State rules (important)
- **Redux Toolkit is for client state only:** the auth session, the current org ID and UI state (modals, the mobile sidebar, theme).
- **Filters for paginated lists live in the URL** (`useSearchParams`), not Redux, so they survive reloads, can be shared and work with Back. See `useProjectFilters` and `useTaskFilters`.
- **React Query is for all server data:** projects, tasks, comments and notifications. Never copy server data into Redux.
- Define query keys in one place per feature, as factories. For example:
  `taskKeys = { all: ['tasks'], list: (projectId, filters) => [...] }`
- Org-scoped keys start with `['org', orgId, ...]` (e.g. `projectKeys`, `taskKeys`). User-level keys start with `['auth', ...]` and survive org switches.
- Notifications are user-level (no `X-Org-ID`); filter them with `?organization=` and include the org id in their keys. The unread count polls every 30s.
- After a mutation, invalidate the related keys. The Kanban drag-and-drop uses optimistic updates (`onMutate`, then roll back in `onError`, then `onSettled` invalidates).

## Multi-tenancy
- The current org lives in Redux and in the URL (`/org/:orgId/...`). The Axios client must send the `X-Org-ID` header on every request.
- Include `orgId` in every query key, so that switching orgs never shows another org's cached data. Clear the cache when the user switches org or logs out.

## Routes
- `/login` and `/register` are public. They return to the original URL (including its query) after signing in.
- `/invitations/accept?token=...` is the backend's invite link (`accept_url`). It needs an account, so signed-out users log in or register first and come back. `/invite/:token` redirects to it.
- `/` redirects to the user's last-used or first org.
- `/orgs/new`: create an organization (where new users with no orgs land)
- `/org/:orgId`: dashboard (stat tiles, overdue tasks, tasks by status/priority, recent activity). `OrgLayout` checks membership before rendering children.
- `/org/:orgId/projects`: the projects list (`?q=&archived=1&page=`)
- `/org/:orgId/projects/:projectId`: project page (details, members, archive/delete)
- `/org/:orgId/projects/:projectId/board`: the Kanban board; `?view=list` shows the filtered list. Task details open in a drawer (`?task=<id>`).
- `/org/:orgId/my-tasks` and `/org/:orgId/notifications`
- `/org/:orgId/settings?tab=members|invitations|general`: members and roles, invitations (owner/admin), rename/leave/delete
- Protected routes go through `ProtectedRoute`. Hide or disable actions the user's role can't perform, such as edit buttons for viewers.
  Use `usePermissions()` (`isAdmin`, `canEdit`, `isOwner`), which mirrors the backend's role matrix. Archived projects are read-only.

## Conventions
- Function components and hooks only. One component per file, named in PascalCase.
- Every data view handles loading, error and empty states.
- Forms show the backend's validation errors next to the matching fields (DRF returns `{field: [messages]}`).
- Lists are paginated on the backend (`?page=`, 20 by default, `?page_size=` up to 100) and responses look like `{count, next, previous, results}`.
- Array query params are sent as repeated keys (`status=a&status=b`), which django-filter expects.
- Windows treats `board.js` and `Board.jsx` as the same file. Don't give a helper module the same name as a component in the same folder.
- Read config from `import.meta.env.VITE_*`. Don't hard-code URLs.
- Keep components small. Move logic into hooks (`useXxx`).

## Working with the backend
- Before building a screen, check the endpoint's shape in `/api/docs/` or in the `schema.yml` provided. Don't guess field names.
- If an endpoint is missing or the wrong shape, say so rather than faking it with mock data.
- The backend runs at http://127.0.0.1:8000. Its OpenAPI schema is at `/api/schema/`, and the source is in `../taskhub-backend` (`apps/*/serializers.py`, `views.py`).
- Backend signals have side effects the cache must follow: removing someone from an org or a project also drops them from its projects and **unassigns their tasks**, so invalidate task data too.

## Workflow
- Work in small steps, one feature or screen at a time.
- Run `npm run lint` and `npm run build` before saying a task is done.
- Don't commit `.env`, `node_modules` or `dist`. Write commit messages in the imperative mood.
- Commit directly to `main`. Split each step into several small, logical commits (e.g. dependencies, API and queries, components, page and route), never one big commit. Each commit should build.

## Roadmap
- [x] 0. Setup: Vite, Redux, React Query, Router, Axios client with JWT refresh, login page
- [x] 1. Register page and an org switcher, with `X-Org-ID` sent on every request
- [x] 2. App shell: sidebar navigation, header with the user menu
- [x] 3. Projects list, create and edit projects, project members
- [x] 4. Kanban board with @dnd-kit and optimistic moves, plus a list view with filters and search
- [x] 5. Task detail drawer with comments and the activity log
- [x] 6. Notifications dropdown and page, My Tasks page
- [x] 7. Dashboard with stats and overdue tasks; org settings for members, roles and invites
- [ ] 8. Production build served by Nginx, environment config for AWS
