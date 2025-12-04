/**
 * Configuration file for ALPHAS Fraternity website
 */

require('dotenv').config();

module.exports = {
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'alphas_fraternity',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    charset: 'utf8mb4'
  },

  // Email configuration
  email: {
    admin: process.env.ADMIN_EMAIL || 'hlakulaachuma@icloud.com',
    siteName: 'ALPHAS Fraternity'
  },

  // Security
  security: {
    enableCSRF: true,
    maxMessageLength: 5000
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    timezone: 'Africa/Johannesburg'
  }
};

