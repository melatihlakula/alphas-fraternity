/**
 * Database connection and utility functions
 * Using sql.js - pure JavaScript SQLite, no compilation needed!
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'data', 'alphas.db');
    this.SQL = null;
  }

  async init() {
    if (!this.SQL) {
      this.SQL = await initSqlJs();
    }
  }

  async connect() {
    await this.init();
    
    if (!this.db) {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Load existing database or create new one
      if (fs.existsSync(this.dbPath)) {
        const buffer = fs.readFileSync(this.dbPath);
        this.db = new this.SQL.Database(buffer);
      } else {
        this.db = new this.SQL.Database();
      }
    }
    return this.db;
  }

  async getConnection() {
    if (!this.db) {
      await this.connect();
    }
    return this.db;
  }

  async initialize() {
    try {
      const db = await this.connect();

      // Create contacts table
      db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create users table for authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          email TEXT UNIQUE,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `);

      // Create sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          expires_at DATETIME NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_email ON contacts(email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_created_at ON contacts(created_at)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_username ON users(username)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_session_expires ON sessions(expires_at)`);

      // Create default admin user if no users exist (async)
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
      if (userCount.count === 0) {
        // We'll create the user in setup.js since bcrypt needs to be async
        console.log('⚠ No users found - will create default admin in setup');
      }

      // Save database to file
      this.save();

      return true;
    } catch (error) {
      console.error('Database initialization failed:', error.message);
      return false;
    }
  }

  save() {
    if (this.db) {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    }
  }

  async query(sql, params = []) {
    const db = await this.getConnection();
    const trimmedSql = sql.trim().toUpperCase();
    
    if (trimmedSql.startsWith('SELECT')) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } else {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();
      this.save(); // Save after modifications
      return { changes: db.getRowsModified() };
    }
  }

  // Helper method for SELECT queries
  async select(sql, params = []) {
    return await this.query(sql, params);
  }

  close() {
    if (this.db) {
      this.save();
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
module.exports = new DatabaseManager();
