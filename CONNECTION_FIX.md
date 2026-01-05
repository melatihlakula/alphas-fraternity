# 🔧 Fix: "Check Your Connection" Error

## Problem
You're seeing error messages like:
- "Failed to send message. Please check your connection and try again."
- "Network error. Please check your connection and try again."

## Root Cause
This happens when you're **NOT accessing the website through the server**. 

### ❌ Wrong Way (Causes Errors)
Opening the HTML file directly:
- `file:///Users/macbookpro/alphas-fraternity/index.html`
- Double-clicking the HTML file
- Opening from Finder

### ✅ Correct Way (Works Perfectly)
Accessing through the server:
- `http://localhost:3000`
- `http://localhost:3000/`
- Server must be running first!

## Solution

### Step 1: Make Sure Server is Running
```bash
cd /Users/macbookpro/alphas-fraternity
node server.js
```

You should see:
```
🚀 ALPHAS Fraternity server running on http://localhost:3000
```

### Step 2: Open Browser to Correct URL

**IMPORTANT:** Type this EXACT URL in your browser:
```
http://localhost:3000
```

**NOT:**
- ❌ `file:///Users/.../index.html`
- ❌ Double-clicking the HTML file
- ❌ Opening from Finder

### Step 3: Verify It's Working

1. Open http://localhost:3000 in your browser
2. The URL bar should show: `http://localhost:3000`
3. All navigation links should work
4. Contact form should work
5. Login/Signup should work

## Quick Check

**If you see in the browser:**
- URL starts with `file://` → ❌ WRONG! Close and open http://localhost:3000
- URL shows `http://localhost:3000` → ✅ CORRECT!

## Troubleshooting

### Server Not Running?
1. Open Terminal
2. Run: `cd /Users/macbookpro/alphas-fraternity`
3. Run: `node server.js`
4. Keep terminal open!

### Still Getting Errors?
1. Make sure server is running (check terminal)
2. Make sure URL is `http://localhost:3000` (not file://)
3. Try refreshing the page (Cmd+R or F5)
4. Check browser console (F12) for specific errors

### Port Already in Use?
If port 3000 is busy:
1. Stop the server (Ctrl+C)
2. Kill any process on port 3000: `lsof -ti:3000 | xargs kill`
3. Restart: `node server.js`

## Summary

✅ **Always access via:** http://localhost:3000  
❌ **Never open HTML files directly**

**The server MUST be running and you MUST use the http:// URL!**

