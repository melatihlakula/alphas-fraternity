# ALPHAS Fraternity - Setup & Configuration Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root with the following variables:

   ```env
   # Server
   PORT=3000

   # Email Configuration (Required for email notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com

   # Owner Contact Information
   OWNER_EMAIL=hlakulaachuma@icloud.com
   OWNER_PHONE=+27655642698

   # SMS Configuration (Optional - Twilio)
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_FROM=
   ```

3. **Initialize Database**
   ```bash
   npm run setup
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Use this password in `SMTP_PASS`

### Other Email Providers
- **Outlook/Hotmail**: Use `smtp-mail.outlook.com`, port `587`
- **iCloud**: Use `smtp.mail.me.com`, port `587` or `465` (secure)
- **Custom SMTP**: Use your provider's SMTP settings

## SMS Configuration (Optional)

To enable SMS notifications via Twilio:

1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number or use a trial number
4. Add these to your `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM=+1234567890  # Your Twilio number
   OWNER_PHONE=+27655642698  # Where to send notifications
   ```

## Security Features

✅ **Rate Limiting**: Contact form limited to 5 submissions per 15 minutes
✅ **Input Validation**: All inputs are validated and sanitized
✅ **Honeypot**: Bot protection on contact form
✅ **IP Tracking**: All submissions track IP address and user agent
✅ **SQL Injection Protection**: Using parameterized queries
✅ **XSS Protection**: All user inputs are escaped
✅ **Helmet.js**: Security headers configured
✅ **Session Management**: Secure session handling

## Database

- **Location**: `data/alphas.db`
- **Tables**:
  - `contacts`: Contact form submissions
  - `users`: Admin/team member accounts
  - `sessions`: Active user sessions

## Contact Form Flow

1. User submits contact form on website
2. Form data is validated and sanitized
3. Message is stored in database (`contacts` table)
4. Email notification sent to `OWNER_EMAIL`
5. SMS notification sent to `OWNER_PHONE` (if configured)
6. User receives success confirmation

## Admin Panel

- **URL**: `http://localhost:3000/admin`
- **Default Admin** (if created during setup):
  - Username: `admin`
  - Password: `admin123`
  - **⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify SMTP server allows connections
- Check server logs for error messages
- For Gmail, ensure App Password is used (not regular password)

### SMS Not Sending
- Verify Twilio credentials are correct
- Ensure `OWNER_PHONE` includes country code (e.g., +27)
- Check Twilio account has sufficient credits
- Verify `TWILIO_FROM` number is correct

### Database Issues
- Ensure `data/` directory exists and is writable
- Run `npm run setup` to reinitialize database
- Check file permissions on `data/alphas.db`

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000

## Production Deployment

1. **Set Environment Variables** on your hosting platform
2. **Update CORS** in `server.js` to allow only your domain
3. **Use HTTPS** for secure connections
4. **Set up SSL Certificate**
5. **Configure Firewall** to allow only necessary ports
6. **Regular Backups** of `data/alphas.db`
7. **Monitor Logs** for errors and security issues

## Support

For issues or questions, contact: hlakulaachuma@icloud.com

