# ALPHAS Fraternity Website

**Elite Brotherhood • Leadership • Excellence**

A modern, production-ready website for ALPHAS Fraternity, founded by Melati Achuma Hlakula at Rhodes University, South Africa.

## ✨ Features

- 🎨 **Modern Design** - Responsive, beautiful UI with dark/light theme
- 📱 **Mobile-Friendly** - Works perfectly on all devices
- 📧 **Contact Form** - Secure form with validation and rate limiting
- 🔐 **Admin Panel** - Protected admin area with authentication
- 💾 **SQLite Database** - No server setup needed, file-based database
- ⚡ **Fast & Secure** - Rate limiting, input validation, security headers
- 🛡️ **Production Ready** - Error handling, logging, and best practices

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run setup
```

This will:
- Create the database
- Create all necessary tables
- Create default admin user

### 3. Start Server
```bash
npm start
```

### 4. Access the Website
- **Main Website**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Admin Panel**: http://localhost:3000/admin

## 👥 User Management

### Sign Up System

**Anyone can create an account!** Your team members can sign up themselves:

1. Go to http://localhost:3000/signup
2. Fill in:
   - Username (3-50 characters, letters, numbers, underscores only)
   - Email (optional but recommended)
   - Password (minimum 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the admin panel

### Default Admin (Optional)

If you ran `npm run setup`, a default admin user was created:

- **Username**: `admin`
- **Password**: `admin123`
- **⚠️ Change this password immediately or delete this user after your team signs up!**

### Team Members

All users who sign up get **admin** role by default, meaning they can:
- View contact form submissions
- Access the admin panel
- See team member list
- Manage the website

**Note**: All team members have equal access. You can manually change roles in the database if needed.

## 📁 Project Structure

```
alphas-fraternity/
├── index.html          # Main website
├── login.html          # Admin login page
├── admin.html          # Admin panel (protected)
├── script.js           # Frontend JavaScript
├── styles.css          # Custom styles
├── server.js           # Express server (main backend)
├── database.js         # Database connection & management
├── auth.js             # Authentication system
├── middleware.js       # Security middleware
├── config.js           # Configuration
├── setup.js            # Database setup script
├── package.json        # Dependencies
└── data/               # Database files (auto-created)
    └── alphas.db       # SQLite database
```

## 🔒 Security Features

- ✅ **Rate Limiting** - Prevents spam and brute force attacks
- ✅ **Input Validation** - All inputs are validated and sanitized
- ✅ **Session Management** - Secure session-based authentication
- ✅ **Password Hashing** - Bcrypt password hashing
- ✅ **Security Headers** - XSS protection, content type sniffing prevention
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **CSRF Protection** - Session-based CSRF protection

## 📧 Contact Form

The contact form includes:
- Real-time validation
- Rate limiting (5 submissions per 15 minutes)
- Input sanitization
- Email format validation
- Message length limits
- Automatic spam protection

## 👨‍💼 Admin Panel

Features:
- View all contact submissions
- Statistics dashboard (total, today, this week, this month)
- Secure authentication required
- Auto-refresh every 30 seconds
- Logout functionality

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQL.js (SQLite in JavaScript)
- **Authentication**: Session-based with bcrypt
- **Security**: express-rate-limit, input validation

## 🔧 Configuration

Edit `config.js` to customize:
- Server port
- Email settings
- Security settings
- Message length limits

## 📝 API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/auth/signup` - Create new user account
- `GET /` - Main website
- `GET /login` - Login page
- `GET /signup` - Signup page

### Protected Endpoints (Require Authentication)
- `GET /api/admin/contacts` - Get all contact submissions
- `GET /api/admin/users` - Get all team members (admin only)
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify session
- `POST /api/auth/logout` - Logout
- `GET /admin` - Admin panel

## 🐛 Troubleshooting

### Database Issues
- Make sure the `data/` directory is writable
- Run `npm run setup` again if database is corrupted

### Port Already in Use
- Change the port in `config.js` or set `PORT` environment variable

### Login Not Working
- Make sure you ran `npm run setup` to create the admin user
- Check browser console for errors
- Verify session ID is being stored in localStorage

## 📄 License

© 2025 ALPHAS Fraternity. Founded by Melati Achuma Hlakula. All rights reserved.

## 👤 Author

**Melati Achuma Hlakula**
- Email: hlakulaachuma@icloud.com
- Location: Rhodes University, South Africa

---

**Built with ❤️ for ALPHAS Fraternity**
