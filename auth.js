/**
 * Authentication utilities
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');

class AuthManager {
  // Create session
  async createSession(userId, ipAddress, userAgent) {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await database.query(
      `INSERT INTO sessions (id, user_id, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [sessionId, userId, expiresAt.toISOString(), ipAddress, userAgent]
    );

    return sessionId;
  }

  // Verify session
  async verifySession(sessionId) {
    try {
      const sessions = await database.select(
        'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")',
        [sessionId]
      );

      if (sessions.length === 0) {
        return null;
      }

      const session = sessions[0];
      const users = await database.select('SELECT * FROM users WHERE id = ?', [session.user_id]);

      if (users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      console.error('Session verification error:', error);
      return null;
    }
  }

  // Login user
  async login(username, password, ipAddress, userAgent) {
    try {
      // Normalize username for case-insensitive login
      const normalizedUsername = username.toLowerCase().trim();
      const users = await database.select('SELECT * FROM users WHERE LOWER(username) = ?', [normalizedUsername]);

      if (users.length === 0) {
        return { success: false, message: 'Invalid username or password' };
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return { success: false, message: 'Invalid username or password' };
      }

      // Update last login
      await database.query(
        'UPDATE users SET last_login = datetime("now") WHERE id = ?',
        [user.id]
      );

      // Create session
      const sessionId = await this.createSession(user.id, ipAddress, userAgent);

      return {
        success: true,
        message: 'Login successful',
        sessionId,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  }

  // Logout
  async logout(sessionId) {
    try {
      await database.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  // Hash password
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Sign up new user
  async signup(username, email, password, ipAddress, userAgent) {
    try {
      // Normalize username (lowercase for case-insensitive check)
      const normalizedUsername = username.toLowerCase().trim();
      
      // Check if username already exists (case-insensitive)
      const existingUsers = await database.select(
        'SELECT * FROM users WHERE LOWER(username) = ?', 
        [normalizedUsername]
      );
      if (existingUsers.length > 0) {
        return { success: false, message: 'Username already taken. Please choose a different username.' };
      }

      // Check if email already exists (case-insensitive, if provided)
      if (email) {
        const normalizedEmail = email.toLowerCase().trim();
        const existingEmails = await database.select(
          'SELECT * FROM users WHERE LOWER(email) = ? AND email IS NOT NULL', 
          [normalizedEmail]
        );
        if (existingEmails.length > 0) {
          return { success: false, message: 'Email already registered. Please use a different email.' };
        }
      }

      // Validate password strength
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user (default role is 'admin' for team members)
      // Use normalized username and email
      try {
        await database.query(
          'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
          [normalizedUsername, passwordHash, email ? normalizedEmail : null, 'admin']
        );
      } catch (dbError) {
        // Handle database constraint errors (unique username/email)
        if (dbError.message && dbError.message.includes('UNIQUE constraint')) {
          if (dbError.message.includes('username')) {
            return { success: false, message: 'Username already taken. Please choose a different username.' };
          } else if (dbError.message.includes('email')) {
            return { success: false, message: 'Email already registered. Please use a different email.' };
          }
        }
        throw dbError; // Re-throw if it's a different error
      }

      // Get the new user
      const newUsers = await database.select('SELECT * FROM users WHERE LOWER(username) = ?', [normalizedUsername]);
      if (newUsers.length === 0) {
        return { success: false, message: 'Failed to create user' };
      }

      const user = newUsers[0];

      // Create session automatically
      const sessionId = await this.createSession(user.id, ipAddress, userAgent);

      return {
        success: true,
        message: 'Account created successfully',
        sessionId,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup' };
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      return await database.select('SELECT id, username, email, role, created_at, last_login FROM users ORDER BY created_at DESC');
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }
}

module.exports = new AuthManager();

