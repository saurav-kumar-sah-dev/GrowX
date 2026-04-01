# GrowX - Deployment Guide for Render

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas database

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   - **Name:** `growx`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** Node
   - **Build Command:** 
     ```
     npm install && npm run build
     ```
   - **Start Command:** 
     ```
     npm start
     ```
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   PORT=3000
   NODE_ENV=production
   SKIP_EMAIL_VERIFICATION=false
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_long_random_jwt_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   MAIL_USER=your_gmail_address@gmail.com
   MAIL_PASS=your_gmail_app_password
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_admin_password
   FRONTEND_URL=https://growx-platform.onrender.com
   FIREBASE_WEB_API_KEY=your_firebase_web_api_key
   ```

6. **Click "Create Web Service"**

### Step 3: Wait for Deployment
- Render will automatically build and deploy your app
- First deployment takes 5-10 minutes
- You'll get a URL like: `https://growx-platform.onrender.com`

### Step 4: Important - Gmail App Password
For emails to work, you need a Gmail App Password:
1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create a new App Password
4. Update MAIL_PASS in Render with the 16-character app password

### Step 5: Verify Email Sending
Test with: `POST /api/v1/user/test-email` with body `{ "email": "test@example.com" }`

## 📝 Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### MongoDB Atlas Setup
1. Whitelist Render IPs: `0.0.0.0/0` (all IPs)
2. Use connection string with password encoded
3. Enable "Connect from anywhere" in Network Access

## 🎉 Success!
Your app should now be live at: `https://growx-platform.onrender.com`

### Test URLs:
- Frontend: `https://growx-platform.onrender.com`
- Admin Login: `https://growx-platform.onrender.com/admin/login`
- API Health: `https://growx-platform.onrender.com/api/health`

## 🔧 Troubleshooting

### Emails Not Sending
1. Check SKIP_EMAIL_VERIFICATION=false
2. Verify MAIL_PASS is an App Password, not regular password
3. Check Render logs for email errors

### CORS Errors
- Ensure FRONTEND_URL matches your actual URL exactly
