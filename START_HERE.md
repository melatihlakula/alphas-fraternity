# 🚀 START HERE - ALPHAS Fraternity Website

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
npm run setup
```

This creates:
- Database and tables
- Default admin user (username: `admin`, password: `admin123`)

### Step 3: Start Server
```bash
npm start
```

## 🌐 Access Your Website

Once the server is running, open your browser:

- **Main Website**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Admin Panel**: http://localhost:3000/admin

## 🔑 Default Login Credentials

**⚠️ IMPORTANT: Change these after first login!**

- **Username**: `admin`
- **Password**: `admin123`

## ✅ Verify Everything Works

Run the verification script:
```bash
node verify-setup.js
```

## 📝 What You Can Do

1. **View Website**: Go to http://localhost:3000
2. **Submit Contact Form**: Fill out the form on the main page
3. **Login to Admin**: Use credentials above at /login
4. **View Submissions**: See all contact form submissions in admin panel
5. **View Statistics**: See total, today, this week, this month stats

## 🐛 Troubleshooting

### Server Won't Start
- Make sure port 3000 is not in use
- Check if Node.js is installed: `node --version`
- Run `npm install` again

### Admin Panel Shows "File Not Found"
- Make sure server is running: `npm start`
- Check browser console (F12) for errors
- Try accessing http://localhost:3000/login first

### Can't Login
- Make sure you ran `npm run setup`
- Check username: `admin` and password: `admin123`
- Clear browser localStorage and try again

### Contact Form Not Working
- Check browser console (F12) for errors
- Make sure all required fields are filled
- Message must be at least 10 characters

## 📚 More Information

- See `README.md` for full documentation
- See `TESTING.md` for testing guide

---

**Ready to go!** 🎉

