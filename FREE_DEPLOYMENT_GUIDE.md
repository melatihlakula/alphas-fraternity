# 🆓 FREE Deployment Options - No Domain Needed!

## ✅ Best Free Options (With Subdomains)

You can launch your website **completely free** using these platforms that provide free subdomains!

---

## 🚀 Option 1: Railway (RECOMMENDED - Easiest)

**Free Tier**: $5 credit/month (enough for small sites)

### Steps:

1. **Sign up**: Go to https://railway.app (use GitHub account)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload files)

3. **Configure**:
   - Railway auto-detects Node.js
   - Add environment variables in dashboard:
     ```
     NODE_ENV=production
     PORT=3000
     OWNER_EMAIL=hlakulaachuma@icloud.com
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     FROM_EMAIL=your-email@gmail.com
     ```

4. **Get Free Domain**:
   - Railway provides: `yourproject.railway.app`
   - Set `ALLOWED_ORIGIN=https://yourproject.railway.app`

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

**Cost**: FREE (with $5 monthly credit)

---

## 🚀 Option 2: Render (Great Free Tier)

**Free Tier**: Free forever (with limitations)

### Steps:

1. **Sign up**: https://render.com (use GitHub)

2. **Create Web Service**:
   - New → Web Service
   - Connect your GitHub repo (or upload)

3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Environment Variables**:
   Add in dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   OWNER_EMAIL=hlakulaachuma@icloud.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

5. **Free Domain**:
   - Render provides: `yourproject.onrender.com`
   - Set `ALLOWED_ORIGIN=https://yourproject.onrender.com`

**Cost**: FREE (spins down after 15 min inactivity, but wakes on request)

---

## 🚀 Option 3: Fly.io (Free Tier)

**Free Tier**: 3 shared VMs free

### Steps:

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up**: https://fly.io (free account)

3. **Deploy**:
   ```bash
   fly launch
   ```
   - Follow prompts
   - Get free domain: `yourproject.fly.dev`

4. **Set Secrets** (environment variables):
   ```bash
   fly secrets set OWNER_EMAIL=hlakulaachuma@icloud.com
   fly secrets set SMTP_HOST=smtp.gmail.com
   fly secrets set SMTP_USER=your-email@gmail.com
   fly secrets set SMTP_PASS=your-app-password
   ```

**Cost**: FREE (generous free tier)

---

## 🚀 Option 4: ngrok (Temporary - For Testing)

**Free Tier**: Free with limitations

### Steps:

1. **Sign up**: https://ngrok.com (free account)

2. **Install**:
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from ngrok.com
   ```

3. **Start your server locally**:
   ```bash
   npm start
   ```

4. **Create tunnel**:
   ```bash
   ngrok http 3000
   ```

5. **Get URL**:
   - ngrok provides: `https://randomstring.ngrok.io`
   - This is your public URL!

**Note**: URL changes each time (unless paid). Good for testing!

**Cost**: FREE (URL changes, 40 connections/min limit)

---

## 🚀 Option 5: Heroku (Free Tier Ended, But Alternatives)

Heroku removed free tier, but similar options:
- **Cyclic**: https://cyclic.sh (free tier)
- **Koyeb**: https://koyeb.com (free tier)

---

## 📋 Quick Comparison

| Platform | Free Domain | Always On | Best For |
|----------|-------------|-----------|----------|
| **Railway** | ✅ Yes | ✅ Yes | Production |
| **Render** | ✅ Yes | ⚠️ Sleeps | Development |
| **Fly.io** | ✅ Yes | ✅ Yes | Production |
| **ngrok** | ✅ Yes | ⚠️ Local | Testing |

---

## 🎯 Recommended: Railway or Fly.io

**For Production Use**: Railway or Fly.io
- Free subdomain included
- Always online
- Easy setup
- No credit card needed (for free tier)

---

## 📝 Setup Steps (Railway Example)

### 1. Prepare Your Code

Make sure you have:
- ✅ `package.json` with start script
- ✅ All files committed (if using Git)
- ✅ `.env` variables documented

### 2. Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub" (or "Empty Project" to upload)

### 3. Configure Environment Variables

In Railway dashboard → Variables tab, add:

```env
NODE_ENV=production
PORT=3000
OWNER_EMAIL=hlakulaachuma@icloud.com
OWNER_PHONE=+27655642698
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
ALLOWED_ORIGIN=https://yourproject.railway.app
```

### 4. Deploy

- Railway auto-detects Node.js
- Runs `npm install` automatically
- Starts with `npm start`
- Provides free HTTPS subdomain

### 5. Access Your Site

- Railway gives you: `https://yourproject.railway.app`
- Share this URL - it's your live website!

---

## 🔧 Important: Update CORS

After deployment, update your `.env` or Railway variables:

```env
ALLOWED_ORIGIN=https://yourproject.railway.app
```

Or if you get the domain later:
```env
ALLOWED_ORIGIN=https://yourproject.railway.app,https://yourdomain.com
```

---

## 📧 Email Setup (Still Free!)

You still need email for notifications. Use **Gmail** (free):

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → App passwords
   - Create password for "Mail"
3. Use in environment variables:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

---

## ✅ After Deployment Checklist

- [ ] Site loads at free subdomain
- [ ] HTTPS working (automatic on these platforms)
- [ ] Contact form submits
- [ ] Email notifications received
- [ ] Admin panel accessible
- [ ] Login works

---

## 🎉 You're Live!

Your website will be accessible at:
- `https://yourproject.railway.app` (or similar)

**Share this URL** - it's your live website, no domain needed!

---

## 💡 Pro Tips

1. **Railway** is easiest - just connect GitHub and deploy
2. **Render** is good but spins down (wakes on first request)
3. **Fly.io** is powerful but requires CLI
4. **ngrok** is great for quick testing

---

## 🆘 Need Help?

All platforms have:
- Free documentation
- Community support
- Step-by-step guides

**You can launch your website completely free!** 🎉

