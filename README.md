# GrowX

Full‑stack app: **Express + MongoDB** backend and **Vite + React** frontend.

## Live app

- **Production:** [https://growx-yp2u.onrender.com](https://growx-yp2u.onrender.com)
- **API health:** [https://growx-yp2u.onrender.com/api/health](https://growx-yp2u.onrender.com/api/health)

## Documentation & config (repo files)

| Topic | File |
|--------|------|
| Live deployment (Render) | [https://growx-yp2u.onrender.com](https://growx-yp2u.onrender.com) |
| Deploy to Render (build/start, env) | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Production issues (email, CORS, Gmail app password) | [PRODUCTION_FIX.md](PRODUCTION_FIX.md) |
| Pre‑launch checklist | [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) |
| Render Blueprint (optional) | [render.yaml](render.yaml) |
| Root environment template | [.env.example](.env.example) |
| Frontend / Vite environment template | [frontend/.env.example](frontend/.env.example) |
| Production Vite defaults (relative `/api` paths) | [frontend/.env.production](frontend/.env.production) |
| Admin dashboard notes | [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md) |
| Resume builder / ATS docs | [RESUME_CHECKER_DOCUMENTATION.md](RESUME_CHECKER_DOCUMENTATION.md), [RESUME_DESIGN_IMPROVEMENTS.md](RESUME_DESIGN_IMPROVEMENTS.md) |
| Quiz feature | [QUIZ_IMPLEMENTATION.md](QUIZ_IMPLEMENTATION.md) |
| Seed admin user (script) | [backend/seed/seedAdmin.js](backend/seed/seedAdmin.js) |
| Admin dashboard completion notes | [ADMIN_DASHBOARD_COMPLETION.md](ADMIN_DASHBOARD_COMPLETION.md) |
| Learning dashboard sidebar | [LEARNING_DASHBOARD_SIDEBAR.md](LEARNING_DASHBOARD_SIDEBAR.md) |

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

Create/update root `.env` at `GrowX-main/.env` and `frontend/.env` for local development.

### Backend (.env) - Required
- **`PORT`** (default 5000)
- **`FRONTEND_URL`** (usually `http://localhost:5173`)
- **`MONGO_URI`**
- **`SECRET_KEY`** (JWT signing)
- **`JWT_SECRET`** (admin authentication)

### Backend (.env) - Optional
- **Email (Nodemailer)**: `MAIL_USER`, `MAIL_PASS`, `MAIL_HOST`, `MAIL_PORT`
- **Cloudinary uploads**: `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- **Firebase Admin**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_WEB_API_KEY`
- **Admin credentials**: `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- **Email verification**: `SKIP_EMAIL_VERIFICATION=true` (for local dev)

### Frontend (frontend/.env) - Required for Google OAuth
```bash
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Endpoints
VITE_API_BASE=http://localhost:5000/api
VITE_USER_API=http://localhost:5000/api/v1/user
# ... other API endpoints
```

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

## Google OAuth Setup

### Step 1: Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. **Enable** Google provider
5. Add authorized domains:
   - `localhost` (local development)
   - `http://localhost:5173` (local development)
   - `https://your-production-url.com` (production)

### Step 2: Google Cloud Console Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `https://your-production-url.com`
5. Add to **Authorized redirect URIs**:
   - `https://your-project.firebaseapp.com/__/auth/handler`

### Step 3: Environment Variables
For **single service deployment** (backend + frontend together):
- Add all `VITE_*` variables to your deployment platform
- Ensure `VITE_FIREBASE_*` variables are available during build

For **separate services**:
- Backend: Firebase Admin SDK variables
- Frontend: `VITE_FIREBASE_*` variables

## Troubleshooting

### Google OAuth Issues

**"Firebase: Error (auth/internal-error)"**
- **Most common cause**: Google provider not enabled in Firebase Console
- **Solution**: Enable Google Authentication in Firebase Console (Step 1 above)
- **Wait time**: Changes may take 5-10 minutes to take effect

**"redirect_uri_mismatch"**
- Check Google Cloud Console authorized redirect URIs
- Ensure production URL is added to authorized origins
- Verify Firebase project ID matches exactly

**Local vs Production Differences**
- Local: Uses `frontend/.env` file
- Production: Uses deployment platform environment variables
- Build-time variables must be set before deployment

### "Email Not Verified" on login

This is expected when `SKIP_EMAIL_VERIFICATION=false` and SMTP is not configured/working.
- Use "Resend Verification Email" on login page (requires working mail config), or
- Set `SKIP_EMAIL_VERIFICATION=true` for local development and sign up again.

### "PayloadTooLargeError: request entity too large"

Happens when uploading large JSON/file payloads (e.g., resume/ATS). The backend is configured to accept larger payloads, but if you still see it:
- restart backend after changes, and
- reduce upload size or increase Express body limit further.

### "Must supply api_key" (profile image / Cloudinary)

Cloudinary env vars must be set in root `.env`:
- `CLOUD_NAME`, `API_KEY`, `API_SECRET`

### Deployment Issues

**Single Service (Backend + Frontend Together)**
- Ensure all `VITE_*` variables are in deployment environment
- Build process needs access to frontend environment variables
- Backend serves frontend from `/frontend/dist`

**Separate Services**
- Frontend: Needs `VITE_*` variables at build time
- Backend: Needs server-side environment variables at runtime
- CORS must be properly configured between services
