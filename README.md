# GrowX

Full‑stack app: **Express + MongoDB** backend and **Vite + React** frontend.

## Prerequisites

- **Node.js**: recommended **v20+** (works on newer versions too).
- **npm** (ships with Node)
- MongoDB (this repo is configured for MongoDB Atlas via `MONGO_URI`)

## Quick start (Windows / PowerShell)

### 1) Backend

```powershell
cd "c:\Users\saura\Downloads\GrowX-main\GrowX-main"
npm install
npm run dev
```

Backend runs on **`http://localhost:5000`** (health check: **`/api/health`**).

### 2) Frontend (new terminal)

```powershell
cd "c:\Users\saura\Downloads\GrowX-main\GrowX-main\frontend"
npm install
npm run dev
```

Frontend runs on **`http://localhost:5173`**.

## Environment variables

Create/update root `.env` at `GrowX-main/.env`.

Minimum required to start:
- **`PORT`** (default 5000)
- **`FRONTEND_URL`** (usually `http://localhost:5173`)
- **`MONGO_URI`**
- **`SECRET_KEY`** (JWT signing)

Optional but used by features:
- **Email (Nodemailer)**: `MAIL_USER`, `MAIL_PASS`, `MAIL_HOST`, `MAIL_PORT`
- **Cloudinary uploads**: `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- **Firebase**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_WEB_API_KEY`

### Local dev toggle: skip email verification

If you don’t want email verification during local development:
- Set **`SKIP_EMAIL_VERIFICATION=true`**

Note: this auto‑verifies **new signups**. Existing users created when it was `false` will still be unverified in the DB.

## Admin login

Admin login page:
- `http://localhost:5173/admin/login`

Admin credentials come from `.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### Seed the admin user into MongoDB

The `.env` values don’t automatically create an admin user. Run:

```powershell
cd "c:\Users\saura\Downloads\GrowX-main\GrowX-main"
node backend/seed/seedAdmin.js
```

Then log in at `http://localhost:5173/admin/login`.

## Troubleshooting

### “Email Not Verified” on login

This is expected when `SKIP_EMAIL_VERIFICATION=false` and SMTP is not configured/working.
- Use “Resend Verification Email” on the login page (requires working mail config), or
- Set `SKIP_EMAIL_VERIFICATION=true` for local development and sign up again.

### “PayloadTooLargeError: request entity too large”

Happens when uploading large JSON/file payloads (e.g., resume/ATS). The backend is configured to accept larger payloads, but if you still see it:
- restart the backend after changes, and
- reduce the upload size or increase the Express body limit further.

### “Must supply api_key” (profile image / Cloudinary)

Cloudinary env vars must be set in root `.env`:
- `CLOUD_NAME`, `API_KEY`, `API_SECRET`

