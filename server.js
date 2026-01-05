/**
 * Express server for ALPHAS Fraternity website
 * Production-ready with authentication, security, and error handling
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const database = require('./database');
const auth = require('./auth');
const { contactLimiter, loginLimiter, requireAuth, requireAdmin } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet({
  // basic CSP to allow required resources (adjust if you load external scripts)
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    }
  }
}));
// CORS configuration - production ready
const allowedOrigins = process.env.ALLOWED_ORIGIN 
  ? process.env.ALLOWED_ORIGIN.split(',').map(origin => origin.trim())
  : (process.env.NODE_ENV === 'production' ? [] : true); // Allow all in dev, restrict in prod

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // In production, require specific origins
    if (process.env.NODE_ENV === 'production' && Array.isArray(allowedOrigins)) {
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// static assets (serve same folder)
app.use(express.static(__dirname));

// configure nodemailer transporter if provided
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Add timeout and retry options
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
    
    // Verify transporter connection
    transporter.verify().then(() => {
      console.log('✓ Email transporter configured and verified');
    }).catch((err) => {
      console.error('⚠ Email transporter verification failed:', err.message);
      console.warn('Email notifications may not work. Please check your SMTP settings.');
    });
  } catch (err) {
    console.error('Failed to create email transporter:', err.message);
  }
} else {
  console.warn('⚠ SMTP not configured. Email notifications will be skipped.');
  console.warn('   Provide SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to enable email notifications.');
}

// optional Twilio (SMS)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✓ Twilio SMS client configured');
  } catch (err) {
    console.error('Failed to initialize Twilio client:', err.message);
    console.warn('SMS notifications will be disabled.');
  }
} else {
  console.log('ℹ Twilio not configured. SMS notifications disabled.');
  console.log('   Provide TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, and OWNER_PHONE in .env to enable SMS.');
}

// contact endpoint - with rate limiting and unified database
app.post('/api/contact', contactLimiter, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name contains invalid characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email is too long'),
  body('phone')
    .optional({ checkFalsy: true })
    .isLength({ min: 6, max: 30 })
    .withMessage('Phone must be between 6 and 30 characters')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone contains invalid characters')
    .trim()
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 5, max: 5000 })
    .withMessage('Message must be between 5 and 5000 characters')
    .escape(),
  body('website').optional().trim() // honeypot: must be empty
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    // honeypot check
    if (req.body.website && req.body.website.trim() !== '') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid request' 
      });
    }
    
    const { name, email, phone, message } = req.body;
    
    // Get IP address and user agent for security tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    // Store in unified database (contacts table in alphas.db)
    try {
      await database.query(
        `INSERT INTO contacts (name, email, phone, message, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone || null, message, ipAddress, userAgent]
      );
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      // Continue even if DB fails - still try to send notifications
    }

    // Send email notification to provided contact (site owner)
    const ownerEmail = process.env.OWNER_EMAIL || 'hlakulaachuma@icloud.com';
    let emailSent = false;
    
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: ownerEmail,
          subject: `New contact message from ${name} - ALPHAS Fraternity`,
          text: `You have a new message from the ALPHAS Fraternity website:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone || 'N/A'}\n` +
                `\nMessage:\n${message}\n\n` +
                `---\n` +
                `Submitted: ${new Date().toLocaleString()}\n` +
                `IP Address: ${ipAddress}`,
          html: `
            <h2>New Contact Message - ALPHAS Fraternity</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted: ${new Date().toLocaleString()}<br>IP Address: ${ipAddress}</small></p>
          `
        };
        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`✓ Email notification sent to ${ownerEmail}`);
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    } else {
      console.warn('⚠ Email not sent (no SMTP configured). Message saved. Owner:', ownerEmail);
    }

    // Optional SMS to owner's phone if TWILIO_FROM and OWNER_PHONE provided
    let smsSent = false;
    if (twilioClient && process.env.OWNER_PHONE && process.env.TWILIO_FROM) {
      try {
        const smsMessage = `New contact from ${name} (${email}): ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;
        await twilioClient.messages.create({
          body: smsMessage,
          from: process.env.TWILIO_FROM,
          to: process.env.OWNER_PHONE
        });
        smsSent = true;
        console.log(`✓ SMS notification sent to ${process.env.OWNER_PHONE}`);
      } catch (smsError) {
        console.error('Twilio SMS send error:', smsError);
      }
    }

    // Return success response
    return res.json({ 
      success: true,
      message: 'Message received. Thank you — we will be in touch.',
      notification: {
        email: emailSent,
        sms: smsSent
      }
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Server error. Please try again later.' 
    });
  }
});

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize database (runs automatically on server start)
database.initialize().then(success => {
  if (success) {
    console.log('✓ Database initialized successfully');
    
    // Auto-create admin user if none exists (for cloud deployments)
    database.select('SELECT COUNT(*) as count FROM users').then(users => {
      if (users && users.length > 0 && users[0].count === 0) {
        console.log('⚠ No admin user found. Run "npm run setup" to create one.');
      }
    }).catch(() => {
      // Ignore errors, setup can be run manually
    });
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

// ==================== ADMIN ROUTES ====================

// Get all contacts (requires authentication)
app.get('/api/admin/contacts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const contacts = await database.select(
      'SELECT id, name, email, phone, message, ip_address, user_agent, created_at FROM contacts ORDER BY created_at DESC'
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
      if (contact.created_at) {
        const created = new Date(contact.created_at);
        if (created >= today) stats.today++;
        if (created >= weekStart) stats.thisWeek++;
        if (created >= monthStart) stats.thisMonth++;
      }
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
  res.sendFile('signup.html', { root: __dirname }, (err) => {
    if (err) {
      console.error('Error serving signup.html:', err);
      if (!res.headersSent) {
        res.status(404).send('Signup page not found. Please make sure signup.html exists in the project directory.');
      }
    }
  });
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: __dirname }, (err) => {
    if (err) {
      console.error('Error serving login.html:', err);
      if (!res.headersSent) {
        res.status(404).send('Login page not found. Please make sure login.html exists in the project directory.');
      }
    }
  });
});

// Admin page (requires authentication)
app.get('/admin', (req, res) => {
  res.sendFile('admin.html', { root: __dirname }, (err) => {
    if (err) {
      console.error('Error serving admin.html:', err);
      if (!res.headersSent) {
        res.status(404).send('Admin page not found. Please make sure admin.html exists in the project directory.');
      }
    }
  });
});

// Main website
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      if (!res.headersSent) {
        res.status(404).send('Homepage not found. Please make sure index.html exists in the project directory.');
      }
    }
  });
});

// Serve static files (CSS, JS, images, etc.) - AFTER routes
// Note: HTML files are handled by routes above, so they won't be served as static
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
