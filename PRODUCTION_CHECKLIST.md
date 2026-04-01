# GrowX Production Deployment Checklist

## Environment Variables Required

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGO_URL=your_mongodb_connection_string

# JWT & Security
SECRET_KEY=your_jwt_secret_key_min_32_chars

# Email (REQUIRED FOR EMAILS TO WORK)
MAIL_USER=your_gmail_address@gmail.com
MAIL_PASS=your_gmail_app_password_16_chars

# URLs
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_EMAIL=admin@growx.com

# Skip email verification (DEV ONLY - REMOVE IN PRODUCTION)
# SKIP_EMAIL_VERIFICATION=false
```

### How to get Gmail App Password:
1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create a new App Password
4. Use that 16-character password as `MAIL_PASS`

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_USER_API=https://your-backend-domain.com/api/v1/user
VITE_JOB_API=https://your-backend-domain.com/api/v1/job
VITE_INTERNSHIP_API=https://your-backend-domain.com/api/v1/internship
VITE_APPLICATION_API=https://your-backend-domain.com/api/v1/application
VITE_PROBLEM_API=https://your-backend-domain.com/api/v1/problem
```

## Common Issues & Fixes

### 1. Emails Not Sending
**Cause:** Missing `MAIL_USER` or `MAIL_PASS` environment variables

**Fix:**
- Ensure `.env` file has Gmail credentials
- For Gmail, you MUST use an App Password, not your regular password
- Check server logs for "MAIL_USER or MAIL_PASS not set"

### 2. Job/Internship Application Not Working
**Cause:** Authentication cookie not being sent

**Fix:**
- Ensure frontend is using `axios` with `withCredentials: true`
- Ensure backend CORS allows your frontend origin
- Check browser console for CORS errors

### 3. CORS Errors
**Cause:** Frontend origin not in allowedOrigins array

**Fix:**
- Update `allowedOrigins` in `backend/index.js`
- Add your production domain to the list

## Security Features Added

### Backend Security (backend/index.js)
1. **Helmet** - Security headers
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

2. **Rate Limiting**
   - 100 requests per 15 minutes per IP

3. **CORS** - Properly configured
   - Allowed origins specified
   - Credentials enabled
   - Methods limited

4. **Body Parsers** - Limited size
   - JSON: 10mb limit
   - URL encoded: 10mb limit

## Testing Checklist

### Test Email:
```bash
curl http://localhost:3000/api/health
```

### Test Application:
1. Login to the application
2. Go to any job listing
3. Click "Apply"
4. Check browser network tab for response

### Test Internship:
1. Login to the application
2. Go to Internship section
3. Fill application form
4. Submit and check response

## Build Commands

```bash
# Backend
cd backend
npm install
npm run build  # If using build script

# Frontend
cd frontend
npm install
npm run build
```

## Render.com Deployment

1. Create Web Service for backend
2. Set environment variables in Render dashboard
3. Build command: `npm install`
4. Start command: `node index.js`

## Cloudflare/Railway/Vercel Deployment

Similar process - just ensure environment variables are set correctly in the platform dashboard.
