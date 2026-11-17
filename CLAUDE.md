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

## Layout
- `src/app/`: `store.js` (Redux), `queryClient.js` and `router.jsx`
- `src/api/client.js`: the Axios instance. It attaches `Bearer` tokens and refreshes once on a 401. **Always use `api` from here. Never call `fetch` or plain `axios` directly.**
- `src/features/<feature>/` holds everything for one feature (auth, orgs, projects, tasks, notifications):
  - `api.js` for request functions
  - `queries.js` for React Query hooks and query keys
  - `*Slice.js` only if the feature has client state
  - components used only by that feature
- `src/components/`: shared, reusable UI
- `src/layouts/`, `src/pages/`: route-level pages, kept thin. They compose feature components.

## State rules (important)
- **Redux Toolkit is for client state only:** the auth session, the current org ID and UI state (modals, filters, theme).
- **React Query is for all server data:** projects, tasks, comments and notifications. Never copy server data into Redux.
- Define query keys in one place per feature, as factories. For example:
  `taskKeys = { all: ['tasks'], list: (projectId, filters) => [...] }`
- After a mutation, invalidate the related keys. The Kanban drag-and-drop uses optimistic updates (`onMutate`, then roll back in `onError`, then `onSettled` invalidates).

## Multi-tenancy
- The current org lives in Redux and in the URL (`/org/:orgId/...`). The Axios client must send the `X-Org-ID` header on every request.
- Include `orgId` in every query key, so that switching orgs never shows another org's cached data. Clear the cache when the user switches org or logs out.

## Routes
- `/login`, `/register` and `/invite/:token` are public.
- `/` redirects to the user's last-used or first org.
- `/org/:orgId/projects`: the projects list
- `/org/:orgId/projects/:projectId/board`: the Kanban board. Task details open in a drawer (`?task=<id>`).
- `/org/:orgId/my-tasks`, `/org/:orgId/notifications` and `/org/:orgId/settings` (members and roles)
- Protected routes go through `ProtectedRoute`. Hide or disable actions the user's role can't perform, such as edit buttons for viewers.

## Conventions
- Function components and hooks only. One component per file, named in PascalCase.
- Every data view handles loading, error and empty states.
- Forms show the backend's validation errors next to the matching fields (DRF returns `{field: [messages]}`).
- Lists are paginated on the backend (`?page=`) and responses look like `{count, next, previous, results}`.
- Read config from `import.meta.env.VITE_*`. Don't hard-code URLs.
- Keep components small. Move logic into hooks (`useXxx`).

## Working with the backend
- Before building a screen, check the endpoint's shape in `/api/docs/` or in the `schema.yml` provided. Don't guess field names.
- If an endpoint is missing or the wrong shape, say so rather than faking it with mock data.

## Workflow
- Work in small steps, one feature or screen at a time.
- Run `npm run lint` and `npm run build` before saying a task is done.
- Don't commit `.env`, `node_modules` or `dist`. Write commit messages in the imperative mood, one feature per commit.

## Roadmap
- [x] 0. Setup: Vite, Redux, React Query, Router, Axios client with JWT refresh, login page
- [ ] 1. Register page and an org switcher, with `X-Org-ID` sent on every request
- [ ] 2. App shell: sidebar navigation, header with the user menu
- [ ] 3. Projects list, create and edit projects, project members
- [ ] 4. Kanban board with @dnd-kit and optimistic moves, plus a list view with filters and search
- [ ] 5. Task detail drawer with comments and the activity log
- [ ] 6. Notifications dropdown and page, My Tasks page
- [ ] 7. Dashboard with stats and overdue tasks; org settings for members, roles and invites
- [ ] 8. Production build served by Nginx, environment config for AWS
