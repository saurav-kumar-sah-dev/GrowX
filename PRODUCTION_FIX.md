# GrowX Production Issues - SOLVED

## Issues Fixed:

### 1. Email Not Sending - FIXED
- Updated all mailers to handle MAIL_PASS with/without spaces
- Fixed `internship.controller.js` transporter
- Fixed `Interview.controller.js` transporter
- Added proper error logging

### 2. CORS Issues - FIXED
- Added multiple frontend origins to allowedOrigins
- Added localhost:5174 for development

### 3. Security - ADDED
- Helmet security headers
- Rate limiting (100 req/15min)

## Production Setup Instructions:

### 1. Fix Environment Variables on Render

Go to Render Dashboard → Your Backend Service → Environment

**Required Variables:**
```
NODE_ENV=production
PORT=3000

MONGO_URI=mongodb+srv://...your_connection_string...

SECRET_KEY=your_long_random_jwt_secret

# EMAIL - MOST IMPORTANT
MAIL_USER=your_gmail_address@gmail.com
# Remove spaces from App Password!
MAIL_PASS=your_gmail_app_password_no_spaces

FRONTEND_URL=https://growx.onrender.com
ADMIN_EMAIL=admin@example.com
```

### 2. Gmail App Password Setup

**Current App Password (with spaces):** `xxxx xxxx xxxx xxxx`
**Should be:** `xxxxxxxxxxxxxxxx` (no spaces!)

If emails still don't work, generate a NEW App Password:
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not enabled
3. Search "App passwords" or go to: https://myaccount.google.com/apppasswords
4. Create new App Password:
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter "GrowX"
5. Copy the 16-character password
6. Use that password as `MAIL_PASS` (NO SPACES)

### 3. Frontend Environment (for frontend hosting)

```
VITE_API_BASE=https://growx.onrender.com
VITE_USER_API=https://growx.onrender.com/api/v1/user
VITE_JOB_API=https://growx.onrender.com/api/v1/job
VITE_INTERNSHIP_API=https://growx.onrender.com/api/v1/internship
VITE_APPLICATION_API=https://growx.onrender.com/api/v1/application
# ... all other APIs
```

### 4. Redeploy

After fixing environment variables:
1. Go to Render Dashboard
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

Or trigger a new deployment by pushing to your main branch.

## Testing Checklist:

### Test 1: Registration
1. Go to https://growx.onrender.com
2. Click Sign Up
3. Fill form and submit
4. Check console for errors
5. Check email inbox

### Test 2: Login
1. Go to https://growx.onrender.com/login
2. Enter credentials
3. Should redirect to dashboard

### Test 3: Internship Application
1. Login
2. Go to Internship section
3. Fill application form
4. Submit
5. Check for success message

## Debug Commands:

Check Render logs for:
- `Mailer: MAIL_USER or MAIL_PASS not set` → Environment variable missing
- `Email attempt 1 failed: Invalid login` → Wrong password
- `Email sent to xxx` → Email working!

## If Still Not Working:

1. Check Render logs tab
2. Check browser Network tab for API errors
3. Check Browser Console for CORS errors

Common errors:
- `401 Unauthorized` → Cookie/auth issue, check withCredentials
- `CORS not allowed` → Add domain to allowedOrigins
- `Email attempt failed` → Wrong MAIL_PASS
