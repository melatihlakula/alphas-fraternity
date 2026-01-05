# ⚡ Quick Free Deployment - 5 Minutes!

## 🚀 Easiest Way: Railway (Recommended)

### Step 1: Sign Up (1 minute)
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (free)

### Step 2: Deploy (2 minutes)
1. Click "New Project"
2. Select "Deploy from GitHub repo"
   - OR click "Empty Project" → "Deploy from local directory"
3. Upload your project folder
4. Railway auto-detects Node.js and starts deploying!

### Step 3: Configure (2 minutes)
1. Go to "Variables" tab
2. Add these environment variables:

```
NODE_ENV=production
OWNER_EMAIL=hlakulaachuma@icloud.com
OWNER_PHONE=+27655642698
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
```

3. Wait for deployment to finish
4. Click "Settings" → "Generate Domain"
5. Copy your free domain (e.g., `alphas-fraternity.railway.app`)

### Step 4: Update CORS
1. Go back to "Variables"
2. Add:
```
ALLOWED_ORIGIN=https://alphas-fraternity.railway.app
```
(Replace with your actual Railway domain)

### Step 5: Setup Database
1. Click "Deployments" → Click on your deployment
2. Click "View Logs"
3. In the logs, you'll see database initialization
4. If needed, you can SSH in and run `npm run setup`

**OR** add this to Variables to auto-setup:
```
RUN_SETUP=true
```

### ✅ Done!
Your site is live at: `https://alphas-fraternity.railway.app`

---

## 📧 Gmail Setup (Free Email)

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to "App passwords"
4. Create password for "Mail"
5. Copy the 16-character password
6. Use in Railway variables as `SMTP_PASS`

---

## 🎯 Alternative: Render (Also Free)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repo or upload files
5. Set:
   - Build: `npm install`
   - Start: `npm start`
6. Add environment variables (same as Railway)
7. Deploy!
8. Get free domain: `alphas-fraternity.onrender.com`

**Note**: Render spins down after 15 min inactivity (free tier)

---

## 💡 Pro Tips

1. **Railway** = Always online, easiest
2. **Render** = Free but sleeps (wakes on request)
3. Both give you free HTTPS subdomain
4. No credit card needed for free tier
5. You can upgrade later if needed

---

## ✅ After Deployment

Test your site:
- [ ] Visit your free subdomain
- [ ] Submit contact form
- [ ] Check email for notification
- [ ] Test admin panel login

**You're live! Share your URL! 🎉**

---

## 🆘 Troubleshooting

**Deployment fails?**
- Check logs in Railway/Render dashboard
- Make sure `package.json` has `start` script
- Verify Node.js version (needs 16+)

**Email not sending?**
- Use Gmail App Password (not regular password)
- Check spam folder
- Verify SMTP variables are correct

**Database issues?**
- Railway/Render handle this automatically
- If needed, add `RUN_SETUP=true` to variables

---

**That's it! Your website is live and free! 🚀**

