# 🎯 EASY Railway Setup - 5 Minutes

Since Railway needs dashboard access, here's the **easiest way**:

## 🚀 Quick Method (Recommended)

### Step 1: Generate Domain (30 seconds)

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click your project** (jubilant-appreciation or alphas-fraternity)
3. **Click on "web" service**
4. **Go to "Settings" tab**
5. **Scroll to "Networking" section**
6. **Click "Generate Domain"** button
7. **Copy the domain** (e.g., `alphas-fraternity-production.up.railway.app`)

**Your website URL**: `https://your-domain.railway.app`

---

### Step 2: Add Environment Variables (2 minutes)

Still in Railway dashboard:

1. **Click "Variables" tab** (at the top)
2. **Click "New Variable"** button
3. **Add these one by one** (copy-paste each):

```
NODE_ENV
production
```

```
OWNER_EMAIL
hlakulaachuma@icloud.com
```

```
OWNER_PHONE
+27655642698
```

```
SMTP_HOST
smtp.gmail.com
```

```
SMTP_PORT
587
```

```
SMTP_SECURE
false
```

```
SMTP_USER
your-email@gmail.com
```
(Replace with YOUR Gmail address)

```
SMTP_PASS
your-gmail-app-password
```
(Get this from Gmail - see below)

```
FROM_EMAIL
your-email@gmail.com
```
(Same as SMTP_USER)

```
ALLOWED_ORIGIN
https://your-domain.railway.app
```
(Replace with YOUR actual Railway domain from Step 1)

---

### Step 3: Get Gmail App Password (2 minutes)

1. **Go to**: https://myaccount.google.com/security
2. **Enable "2-Step Verification"** (if not already)
3. **Click "App passwords"** (search if needed)
4. **Select app**: Choose **"Mail"**
5. **Select device**: Choose **"Other"** → Type "Railway"
6. **Click "Generate"**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
8. **Paste it** in Railway as `SMTP_PASS` variable

---

## ✅ That's It!

After adding variables, Railway will:
- ✅ Automatically restart your service
- ✅ Apply all settings
- ✅ Your site will be fully functional!

---

## 🧪 Test Everything

1. **Visit your site**: `https://your-domain.railway.app`
2. **Submit contact form**
3. **Check email**: hlakulaachuma@icloud.com (should receive notification)
4. **Test admin**: `https://your-domain.railway.app/admin`

---

## 🆘 Troubleshooting

**Domain not showing?**
- Make sure you're in the "web" service settings
- Look for "Networking" or "Domains" section
- Try refreshing the page

**Variables not saving?**
- Make sure you click "Add" after each variable
- Check that variable name and value are correct
- No spaces around the `=` sign

**Email not working?**
- Verify Gmail App Password is correct
- Check spam folder
- Make sure all SMTP variables are set
- Check Railway logs for errors

---

## 📝 Quick Checklist

- [ ] Domain generated in Railway
- [ ] All 10 environment variables added
- [ ] Gmail App Password obtained
- [ ] SMTP_PASS set correctly
- [ ] ALLOWED_ORIGIN matches your domain
- [ ] Site tested and working

---

**This takes about 5 minutes total! You got this! 💪**

