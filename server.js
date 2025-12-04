/**
 * Express server for ALPHAS Fraternity website
 * Production-ready with authentication, security, and error handling
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const database = require('./database');
const auth = require('./auth');
const { contactLimiter, loginLimiter, requireAuth, requireAdmin } = require('./middleware');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize database
database.initialize().then(success => {
  if (success) {
    console.log('✓ Database initialized successfully');
  } else {
    console.log('⚠ Database initialization had issues, but server will continue');
  }
}).catch(err => {
  console.log('⚠ Database initialization error:', err.message);
});

// ==================== AUTHENTICATION ROUTES ====================

// Signup
app.post('/api/auth/signup', loginLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Normalize and validate username
    const normalizedUsername = username.trim().toLowerCase();
    
    if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 50 characters'
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    // Check for duplicate username (case-insensitive) before processing
    try {
      const database = require('./database');
      const existingUsers = await database.select(
        'SELECT * FROM users WHERE LOWER(username) = ?',
        [normalizedUsername]
      );
      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken. Please choose a different username.'
        });
      }
    } catch (error) {
      // Continue if check fails, auth.js will handle it
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await auth.signup(username, email, password, ipAddress, userAgent);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup'
    });
  }
});

// Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await auth.login(username, password, ipAddress, userAgent);

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Verify session
app.get('/api/auth/verify', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'No session provided'
      });
    }

    const user = await auth.verifySession(sessionId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying session'
    });
  }
});

// Logout (allow logout even if session expired)
app.post('/api/auth/logout', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId || (req.body && req.body.sessionId);
    if (sessionId) {
      await auth.logout(sessionId);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still return success even if logout fails
    res.json({ success: true, message: 'Logged out successfully' });
  }
});

// ==================== CONTACT FORM ====================

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.length > 100) {
      errors.push('Name is too long (max 100 characters)');
    } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      errors.push('Name contains invalid characters');
    }

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email address');
    } else if (email.length > 255) {
      errors.push('Email is too long');
    }

    if (phone && phone.length > 20) {
      errors.push('Phone number is too long');
    }
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      errors.push('Phone number contains invalid characters');
    }

    if (!message || message.trim().length === 0) {
      errors.push('Message is required');
    } else if (message.length > config.security.maxMessageLength) {
      errors.push(`Message is too long (max ${config.security.maxMessageLength} characters)`);
    } else if (message.trim().length < 10) {
      errors.push('Message is too short (minimum 10 characters)');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);
    const sanitizedPhone = phone ? phone.trim().substring(0, 20) : null;
    const sanitizedMessage = message.trim().substring(0, config.security.maxMessageLength);

    // Get additional info
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    // Insert into database
    await database.query(
      `INSERT INTO contacts (name, email, phone, message, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sanitizedName, sanitizedEmail, sanitizedPhone, sanitizedMessage, ipAddress, userAgent]
    );

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all contacts (requires authentication)
app.get('/api/admin/contacts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const contacts = await database.select(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );

    // Calculate statistics
    const stats = {
      total: contacts.length,
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    contacts.forEach(contact => {
      const created = new Date(contact.created_at);
      if (created >= today) stats.today++;
      if (created >= weekStart) stats.thisWeek++;
      if (created >= monthStart) stats.thisMonth++;
    });

    res.json({
      success: true,
      contacts,
      stats
    });
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await auth.getAllUsers();
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// ==================== PAGE ROUTES (BEFORE STATIC) ====================

// Signup page
app.get('/signup', (req, res) => {
  const signupPath = path.join(__dirname, 'signup.html');
  res.sendFile(signupPath, (err) => {
    if (err) {
      console.error('Error serving signup.html:', err);
      res.status(500).send('Error loading signup page');
    }
  });
});

// Login page
app.get('/login', (req, res) => {
  const loginPath = path.join(__dirname, 'login.html');
  res.sendFile(loginPath, (err) => {
    if (err) {
      console.error('Error serving login.html:', err);
      res.status(500).send('Error loading login page');
    }
  });
});

// Admin page (requires authentication)
app.get('/admin', (req, res) => {
  const adminPath = path.join(__dirname, 'admin.html');
  res.sendFile(adminPath, (err) => {
    if (err) {
      console.error('Error serving admin.html:', err);
      res.status(500).send('Error loading admin page');
    }
  });
});

// Main website
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading website');
    }
  });
});

// Serve static files (CSS, JS, images, etc.) - AFTER routes
app.use(express.static(__dirname, {
  maxAge: '1d',
  etag: true,
  index: false
}));

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 ALPHAS Fraternity server running on http://localhost:${PORT}`);
  console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`🔐 Login page: http://localhost:${PORT}/login`);
  console.log(`📝 Signup page: http://localhost:${PORT}/signup`);
  console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`\n⚠️  Default admin credentials (if created):`);
  console.log(`   Username: admin`);
  console.log(`   Password: admin123`);
  console.log(`   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!`);
  console.log(`\n💡 Team members can sign up at: http://localhost:${PORT}/signup`);
});
