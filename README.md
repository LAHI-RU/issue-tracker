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

