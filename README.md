# TaskHub Frontend

React frontend for TaskHub, a multi-tenant project & task management platform.

**Stack:** React 19 · Vite · Redux Toolkit · React Query · React Router · Axios

## Project layout

```
src/
  app/          # store.js (Redux), queryClient.js (React Query), router.jsx
  api/          # axios client with JWT + automatic token refresh
  features/     # feature slices (auth/ ...); add projects/, tasks/ here
  components/   # shared components (ProtectedRoute, ...)
  layouts/      # AppLayout
  pages/        # route-level pages
```

**State split:** Redux Toolkit holds client state (auth session, current org, UI).
React Query holds server data (projects, tasks) with caching and optimistic updates.

## Local setup

```powershell
npm install
copy .env.example .env
npm run dev          # http://localhost:5173
```

The dev server proxies `/api` to Django at `http://localhost:8000`, so run the backend first.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build into `dist/`
- `npm run lint`: lint with oxlint
