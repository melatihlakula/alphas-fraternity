# 👥 User Guide - ALPHAS Fraternity Website

## For Team Members

### How to Get Started

#### Option 1: Sign Up (Recommended)
1. Go to http://localhost:3000/signup
2. Create your account:
   - Choose a username (3-50 characters)
   - Enter your email (optional)
   - Create a password (minimum 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in!

#### Option 2: Use Default Admin (If Available)
If the founder set up a default admin account:
- Username: `admin`
- Password: `admin123`
- **⚠️ Change this password immediately!**

### Logging In

1. Go to http://localhost:3000/login
2. Enter your username and password
3. Click "Login"
4. You'll be redirected to the admin panel

### Using the Admin Panel

Once logged in, you can:

#### View Contact Submissions
- See all messages from the contact form
- View statistics (Total, Today, This Week, This Month)
- Click on email addresses to send emails
- Data refreshes automatically every 30 seconds

#### View Team Members
- Click the "Team Members" tab
- See all team members who have access
- View when they joined and last login time

#### Logout
- Click the "Logout" button in the bottom right
- You'll be redirected to the login page

## For the Founder

### Setting Up Your Team

1. **Share the signup link** with your team: http://localhost:3000/signup
2. **Or create accounts for them** using the default admin account
3. **All team members** will have admin access by default

### Managing Users

Currently, all users have equal access. To change roles or remove users, you'll need to:
- Access the database directly, or
- Contact the developer to add user management features

### Security Tips

1. **Change default password** if you used the setup script
2. **Use strong passwords** (minimum 6 characters, but longer is better)
3. **Don't share login credentials** - each team member should have their own account
4. **Logout when done** - especially on shared computers

## Account Requirements

### Username
- 3-50 characters
- Letters, numbers, and underscores only
- Must be unique

### Email
- Optional but recommended
- Must be valid format if provided
- Must be unique if provided

### Password
- Minimum 6 characters
- Longer passwords are more secure
- Use a mix of letters, numbers, and symbols for better security

## Troubleshooting

### Can't Sign Up
- Check username is available (not already taken)
- Verify email format if provided
- Ensure password is at least 6 characters
- Check browser console (F12) for errors

### Can't Login
- Verify username and password are correct
- Check if account exists (try signing up again)
- Clear browser localStorage and try again
- Check server is running

### Forgot Password
- Currently, there's no password reset feature
- Contact the founder to reset your password manually
- Or create a new account with a different username

## Features Available to All Team Members

✅ View all contact form submissions
✅ See statistics dashboard
✅ View team member list
✅ Access admin panel
✅ Logout functionality

---

**Need help?** Contact the founder or check the main README.md file.

