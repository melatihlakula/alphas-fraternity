# 🚀 How to Start the Server

## Step-by-Step Instructions

### Option 1: Using Terminal (Recommended)

1. **Open Terminal** (on Mac: Press `Cmd + Space`, type "Terminal", press Enter)

2. **Navigate to your project folder:**
   ```bash
   cd /Users/macbookpro/alphas-fraternity
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

   OR use npm (easier):
   ```bash
   npm start
   ```

4. **You should see:**
   ```
   🚀 ALPHAS Fraternity server running on http://localhost:3000
   🔐 Login page: http://localhost:3000/login
   📝 Signup page: http://localhost:3000/signup
   👨‍💼 Admin panel: http://localhost:3000/admin
   ```

5. **Open your browser and go to:**
   - **Homepage**: http://localhost:3000
   - **Login**: http://localhost:3000/login
   - **Sign Up**: http://localhost:3000/signup

### Option 2: Using VS Code (If you have it)

1. Open the project folder in VS Code
2. Open the integrated terminal: `View` → `Terminal` (or press `` Ctrl + ` ``)
3. Type: `npm start` or `node server.js`
4. Press Enter

### Option 3: Using Finder (Mac)

1. Open Finder
2. Navigate to: `/Users/macbookpro/alphas-fraternity`
3. Right-click in the folder → `New Terminal at Folder`
4. Type: `npm start` or `node server.js`
5. Press Enter

## 📍 Important Notes

- **The server MUST be running** for the website to work
- **Keep the terminal window open** while using the website
- **To stop the server**: Press `Ctrl + C` in the terminal
- **The server runs on port 3000** by default

## 🔧 First Time Setup

If you haven't set up the database yet, run this first:

```bash
cd /Users/macbookpro/alphas-fraternity
npm install
npm run setup
npm start
```

## ✅ Quick Check

After starting the server, you should see:
- ✓ Database initialized successfully
- 🚀 Server running messages
- No error messages

If you see errors, make sure:
1. You're in the correct directory
2. Dependencies are installed (`npm install`)
3. Database is set up (`npm run setup`)

## 🎯 Your Project Location

**Full path:** `/Users/macbookpro/alphas-fraternity`

**Quick command to get there:**
```bash
cd ~/alphas-fraternity
```

Or the full path:
```bash
cd /Users/macbookpro/alphas-fraternity
```

---

**That's it! Once the server is running, open http://localhost:3000 in your browser!** 🎉

