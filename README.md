# Hospital Management System (MERN)

This repository contains a full Hospital Management System with:

- `backend/` — Express + MongoDB + JWT-based auth
- `frontend/` — Vite + React + Tailwind CSS UI

## Folder Structure

```
backend/
  config/
  controllers/
  database/
  middlewares/
  models/
  routes/
  utils/
frontend/
  public/
  src/
```

## Setup

### Backend

1. Copy `backend/config/config.env.example` to `backend/config/config.env`
2. Fill in MongoDB, JWT, Cloudinary, and frontend URL values

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_BACKEND_URL` if the backend runs on a different host than `http://localhost:4000`

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Production Build

### Build frontend assets

```bash
cd frontend
npm run build
```

### Start backend in production

```bash
cd backend
npm install
npm start
```

## Deployment

### Recommended deploy flow (single deploy target)

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the backend with `NODE_ENV=production`
3. The backend will serve the built frontend from `frontend/dist/`

### Separate frontend and backend hosts

- Deploy `frontend/dist/` to Netlify, Vercel, Firebase Hosting, or another static host
- Deploy backend to Render, Railway, Heroku, or similar Node host
- Set `VITE_BACKEND_URL` in the frontend env file to the backend URL
- Set `FRONTEND_URL` and `DASHBOARD_URL` in the backend env file for CORS

### Default Local URLs

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Environment Variables

Required backend variables in `backend/config/config.env`:

- `MONGO_URI`
- `JWT_SECRET_KEY`
- `JWT_EXPIRES`
- `COOKIE_EXPIRE`
- `BOOTSTRAP_ADMIN_KEY`
- `SYNC_ADMIN_ON_STARTUP`
- `SYNC_ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `DASHBOARD_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Required frontend variable in `frontend/.env`:

- `VITE_BACKEND_URL` (optional; defaults to `http://localhost:4000`)

## Important Notes

- The `Gallery` page and public navigation links have been removed.
- Backend now accepts `FRONTEND_URL` and `DASHBOARD_URL` for CORS, with a localhost fallback in development.
- In production, the backend serves `frontend/dist/index.html` so the app can deploy as a single Node service.

## API Overview

### Authentication

- `POST /api/v1/user/patient/register`
- `POST /api/v1/user/login`
- `GET /api/v1/user/patient/me`
- `GET /api/v1/user/admin/me`
- `GET /api/v1/user/doctor/me`
- `GET /api/v1/user/patient/logout`
- `GET /api/v1/user/admin/logout`
- `GET /api/v1/user/doctor/logout`

### Doctors (Admin)

- `GET /api/v1/user/doctors`
- `POST /api/v1/user/doctor/addnew`
- `GET /api/v1/user/doctor/:id`
- `PUT /api/v1/user/doctor/:id`
- `DELETE /api/v1/user/doctor/:id`

### Appointments

- `POST /api/v1/appointment/post`
- `GET /api/v1/appointment/patient/my`
- `GET /api/v1/appointment/doctor/my`
- `GET /api/v1/appointment/getall`
- `PUT /api/v1/appointment/update/:id`
- `DELETE /api/v1/appointment/delete/:id`

### Messages

- `POST /api/v1/message/send`
- `GET /api/v1/message/getall`

## First Admin (Bootstrap)

If you don’t have an Admin user yet, set `BOOTSTRAP_ADMIN_KEY` in `backend/config/config.env` and call:

- `POST /api/v1/user/admin/bootstrap`

Body includes `bootstrapKey` plus admin fields: `firstName`, `lastName`, `email`, `phone`, `nic`, `dob`, `gender`, `password`.

If an Admin already exists but the password is lost, call the same endpoint with the existing admin email and a new password. The bootstrap key is required, and the endpoint will reset that admin account.

## Render Admin Recovery

If the deployed admin login says "Invalid email or password" and you cannot use the bootstrap key, set these Render environment variables and redeploy:

- `SYNC_ADMIN_ON_STARTUP=true`
- `SYNC_ADMIN_PASSWORD=true`
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=password123`

On startup, the backend will create that admin if missing, or reset that admin password if the email already exists. Turn `SYNC_ADMIN_ON_STARTUP` back to `false` after login is recovered.
