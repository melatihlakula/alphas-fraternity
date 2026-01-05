# 🔧 Railway Setup Guide

Since Railway CLI needs authentication, here's what we need to do:

## Option 1: Quick Setup via Railway Dashboard (Easiest)

### Step 1: Generate Domain
1. Go to: https://railway.app/dashboard
2. Click on your project
3. Click on the **"web"** service
4. Go to **"Settings"** tab
5. Scroll down to **"Networking"** section
6. Click **"Generate Domain"** button
7. Copy the domain (e.g., `alphas-fraternity-production.up.railway.app`)

### Step 2: Add Environment Variables
1. Still in Railway dashboard
2. Click **"Variables"** tab
3. Click **"New Variable"** for each:

**Required Variables:**
```
NODE_ENV = production
OWNER_EMAIL = hlakulaachuma@icloud.com
OWNER_PHONE = +27655642698
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-gmail-app-password
FROM_EMAIL = your-email@gmail.com
ALLOWED_ORIGIN = https://your-generated-domain.railway.app
```

## Option 2: Railway CLI (If you want to use terminal)

### Install Railway CLI:
```bash
curl -fsSL https://railway.app/install.sh | sh
```

### Login:
```bash
railway login
```

### Link Project:
```bash
railway link
```

### Generate Domain:
```bash
railway domain
```

### Add Variables:
```bash
railway variables set NODE_ENV=production
railway variables set OWNER_EMAIL=hlakulaachuma@icloud.com
railway variables set OWNER_PHONE=+27655642698
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-gmail-app-password
railway variables set FROM_EMAIL=your-email@gmail.com
railway variables set ALLOWED_ORIGIN=https://your-domain.railway.app
```

---

## 📧 Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create password for "Mail"
5. Copy 16-character password
6. Use as `SMTP_PASS`

---

**The dashboard method (Option 1) is fastest!**

