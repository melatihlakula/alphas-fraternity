# 🚀 Pre-Launch Checklist - Domain Deployment Ready

## ✅ Code Status: PRODUCTION READY

All critical fixes have been completed. The website is ready for domain deployment.

---

## 🔍 Pre-Launch Verification Steps

### 1. Environment Variables Setup

Create a `.env` file with these variables:

```env
# Server
NODE_ENV=production
PORT=3000

# Domain (set after you buy domain)
ALLOWED_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Email (REQUIRED for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Owner Contact
OWNER_EMAIL=hlakulaachuma@icloud.com
OWNER_PHONE=+27655642698

# SMS (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
```

### 2. Database Setup

```bash
npm run setup
```

✅ Verify: Database created at `data/alphas.db`

### 3. Test Server Locally

```bash
npm start
```

✅ Verify:
- Server starts without errors
- Can access http://localhost:3000
- Contact form works
- Login works
- Admin panel works

### 4. Test Contact Form

1. Submit a test message
2. Check email inbox (hlakulaachuma@icloud.com)
3. Check SMS (if Twilio configured)
4. Verify message appears in admin panel

✅ Verify: All notifications working

---

## 🌐 Domain Deployment Checklist

### Before Going Live

- [ ] **Domain Purchased** and DNS configured
- [ ] **SSL Certificate** installed (HTTPS required)
- [ ] **Environment Variables** set on hosting platform
- [ ] **CORS Updated** with your domain in `.env`:
  ```env
  ALLOWED_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
  ```
- [ ] **Email SMTP** configured and tested
- [ ] **SMS Twilio** configured (optional)
- [ ] **Database Backup** strategy in place
- [ ] **Admin Password** changed from default
- [ ] **Port Configuration** matches hosting (usually 3000 or PORT env var)

### Hosting Platform Setup

#### For VPS/Cloud (DigitalOcean, AWS, etc.):
- [ ] Node.js installed (v16+)
- [ ] PM2 or similar process manager installed
- [ ] Nginx reverse proxy configured (if needed)
- [ ] Firewall allows port 3000 (or configured port)
- [ ] SSL certificate via Let's Encrypt
- [ ] Domain DNS points to server IP

#### For Platform-as-a-Service (Heroku, Railway, etc.):
- [ ] Environment variables set in dashboard
- [ ] Buildpack configured (Node.js)
- [ ] Domain connected
- [ ] SSL enabled (usually automatic)

### Post-Deployment Tests

- [ ] Website loads at your domain
- [ ] HTTPS working (no mixed content warnings)
- [ ] Contact form submits successfully
- [ ] Email notifications received
- [ ] SMS notifications received (if configured)
- [ ] Admin panel accessible and secure
- [ ] Login/logout works
- [ ] All pages load correctly
- [ ] Mobile responsive design works
- [ ] Dark mode toggle works

---

## 🔒 Security Checklist

- [ ] **Admin Password Changed** (from default `admin123`)
- [ ] **HTTPS Enabled** (SSL certificate active)
- [ ] **CORS Configured** (only your domain allowed)
- [ ] **Environment Variables** not exposed in code
- [ ] **Rate Limiting** active (5 submissions per 15 min)
- [ ] **Database Backups** automated
- [ ] **Error Messages** don't expose sensitive info
- [ ] **Session Security** working (sessions expire)

---

## 📧 Email & SMS Configuration

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Create password for "Mail"
3. Use in `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=generated-app-password
   ```

### SMS Setup (Twilio)

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Purchase phone number
4. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   TWILIO_FROM=+1234567890
   OWNER_PHONE=+27655642698
   ```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors After Deployment
**Solution**: Set `ALLOWED_ORIGIN` in `.env` with your domain:
```env
ALLOWED_ORIGIN=https://yourdomain.com
```

### Issue: Email Not Sending
**Solution**: 
- Verify SMTP credentials
- Check spam folder
- Test SMTP connection
- For Gmail, use App Password (not regular password)

### Issue: Database Errors
**Solution**:
- Ensure `data/` directory is writable
- Check file permissions: `chmod 755 data/`
- Run `npm run setup` again

### Issue: Port Already in Use
**Solution**: 
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill`

---

## 📊 Monitoring & Maintenance

### Regular Tasks

- [ ] **Weekly**: Check admin panel for new submissions
- [ ] **Monthly**: Review server logs for errors
- [ ] **Quarterly**: Update dependencies (`npm update`)
- [ ] **As Needed**: Database backups

### Monitoring

- Server uptime
- Contact form submissions
- Error logs
- Email/SMS delivery status

---

## ✅ Final Verification

Before announcing your website:

1. **Test Everything**:
   - [ ] Submit contact form
   - [ ] Check email received
   - [ ] Check SMS received (if configured)
   - [ ] Login to admin panel
   - [ ] View submissions
   - [ ] Test on mobile device
   - [ ] Test dark mode

2. **Security Check**:
   - [ ] Admin password changed
   - [ ] HTTPS working
   - [ ] No console errors
   - [ ] No sensitive data exposed

3. **Performance**:
   - [ ] Pages load quickly
   - [ ] Images optimized
   - [ ] No broken links

---

## 🎉 You're Ready!

Once all items are checked, your website is ready for production!

**Important URLs**:
- Main Site: `https://yourdomain.com`
- Admin Panel: `https://yourdomain.com/admin`
- Login: `https://yourdomain.com/login`

---

**Need Help?** Contact: hlakulaachuma@icloud.com
