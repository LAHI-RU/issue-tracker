# Issue Tracker (React + Express + MongoDB)

A modern Issue Tracker with authentication, CRUD issues, status workflow, search/filter, and pagination.

## Tech Stack
- Frontend: React (Vite), Tailwind v4, shadcn/ui, React Query
- Backend: Node.js, Express, MongoDB (Mongoose), JWT Auth
- Tooling: ESLint, Thunder Client / Postman

## Features
- Email/password authentication (JWT)
- Issues CRUD: create, list, detail, edit, delete
- Status workflow: Open -> In Progress -> Resolved -> Closed (with confirmation)
- Dashboard counts by status
- Search + filters (status/priority/severity)
- Debounced search + request cancellation
- Pagination
- Responsive UI + accessible focus states

## Project Structure
```
issue-tracker/
  backend/
  frontend/
```

## Setup (Local)

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### 2) Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs on: http://localhost:5173 (or next available port)

## API Overview
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/issues/stats
- GET /api/issues (search/filter/pagination)
- POST /api/issues
- GET /api/issues/:id
- PATCH /api/issues/:id
- PATCH /api/issues/:id/status
- DELETE /api/issues/:id

## Deployment
- Frontend: Vercel (set VITE_API_BASE_URL to backend URL)
- Backend: Render/Railway (set env vars from backend/.env.example)

## Notes
- .env files are not committed. Use .env.example templates.

---

## How to test / verify quickly

### Auth expiry flow
1) Login
2) In DevTools -> Application -> Local Storage -> edit `token` to something invalid
3) Refresh dashboard

Expected:
- API returns 401
- App shows toast "Session expired..."
- Redirects to /login

### Env template check
- Ensure .env is in .gitignore
- Only .env.example committed

---

## Common mistakes + fixes

1) **No redirect after expiry**
- You did not add the event listener effect in AppLayout
- Or you did not mount AppLayout (ProtectedRoute) for the page

2) **Toast not showing**
- Ensure Toaster from sonner is mounted in AppLayout
- Ensure toastError uses sonner (you already switched)

3) **Accidentally committed .env**
- Remove it from git:
  ```bash
  git rm --cached backend/.env frontend/.env
  ```
