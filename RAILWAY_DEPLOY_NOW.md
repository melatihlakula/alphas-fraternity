# 🚀 Deploy to Railway NOW - Step by Step

## ✅ Your Code is on GitHub!
**Repository**: https://github.com/melatihlakula/alphas-fraternity

---

## 🎯 Deploy in 5 Minutes

### Step 1: Sign Up for Railway (1 minute)
1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (use the same account: melatihlakula)
4. Authorize Railway to access your GitHub

### Step 2: Deploy Your Repo (1 minute)
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select **"alphas-fraternity"**
4. Click **"Deploy Now"**
5. Railway will automatically:
   - Detect Node.js
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)

### Step 3: Get Your Free Domain (30 seconds)
1. Wait for deployment to finish (2-3 minutes)
2. Click on your project
3. Go to **"Settings"** tab
4. Scroll to **"Domains"** section
5. Click **"Generate Domain"**
6. Copy your free domain (e.g., `alphas-fraternity-production.up.railway.app`)

### Step 4: Add Environment Variables (2 minutes)
1. In Railway dashboard, go to **"Variables"** tab
2. Click **"New Variable"** and add these one by one:

```
NODE_ENV=production
```

```
OWNER_EMAIL=hlakulaachuma@icloud.com
```

```
OWNER_PHONE=+27655642698
```

```
SMTP_HOST=smtp.gmail.com
```

```
SMTP_PORT=587
```

```
SMTP_SECURE=false
```

```
SMTP_USER=your-email@gmail.com
```
(Replace with your Gmail address)

```
SMTP_PASS=your-gmail-app-password
```
(Get this from Gmail App Passwords - see below)

```
FROM_EMAIL=your-email@gmail.com
```
(Same as SMTP_USER)

```
ALLOWED_ORIGIN=https://your-railway-domain.railway.app
```
(Replace with your actual Railway domain from Step 3)

### Step 5: Setup Database (Automatic!)
Railway will automatically:
- Create the database file
- Initialize tables
- Everything is ready!

**Optional**: If you want to create the admin user, you can:
1. Go to Railway dashboard → **"Deployments"**
2. Click on your deployment
3. Click **"View Logs"**
4. Look for database initialization messages

---

## 📧 Gmail App Password Setup (Required for Email)

### Get Your Gmail App Password:

1. Go to **https://myaccount.google.com/security**
2. Enable **"2-Step Verification"** (if not already enabled)
3. Go to **"App passwords"** (search for it)
4. Click **"Select app"** → Choose **"Mail"**
5. Click **"Select device"** → Choose **"Other"** → Type "Railway"
6. Click **"Generate"**
7. Copy the **16-character password** (looks like: `abcd efgh ijkl mnop`)
8. Use this in Railway as `SMTP_PASS` (remove spaces or keep them, both work)

---

## ✅ Verify Deployment

After deployment completes:

1. **Visit your Railway domain** (from Step 3)
2. **Test the contact form**:
   - Fill out the form
   - Submit
   - Check your email (hlakulaachuma@icloud.com) for notification
3. **Test admin panel**:
   - Go to `https://your-domain.railway.app/admin`
   - Login (if admin user exists)
   - View contact submissions

---

## 🎉 You're Live!

Your website is now accessible at:
**https://your-domain.railway.app**

Share this URL - it's your live website!

---

## 🔧 Troubleshooting

### Deployment Fails?
- Check Railway logs: Dashboard → Deployments → View Logs
- Make sure `package.json` has `start` script (it does!)
- Verify Node.js version (needs 16+)

### Email Not Sending?
- Verify Gmail App Password is correct
- Check spam folder
- Make sure SMTP variables are set correctly
- Check Railway logs for email errors

### Database Issues?
- Database is created automatically
- If needed, check logs for initialization messages
- Railway handles file storage automatically

### CORS Errors?
- Make sure `ALLOWED_ORIGIN` matches your Railway domain exactly
- Include `https://` in the URL
- Restart deployment after adding variable

---

## 💰 Cost: FREE!

Railway gives you **$5 credit/month** free, which is enough for:
- Small websites
- Low traffic
- Personal projects

**You won't be charged** unless you exceed the free tier.

---

## 📝 Quick Reference

**Your GitHub Repo**: https://github.com/melatihlakula/alphas-fraternity

**Railway Dashboard**: https://railway.app/dashboard

**Your Live Site**: https://your-domain.railway.app (after deployment)

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Check Railway logs for errors
- Verify all environment variables are set

**You're all set! Deploy now! 🚀**

