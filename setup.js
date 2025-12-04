/**
 * Setup script to initialize the database
 */

const database = require('./database');
const config = require('./config');

console.log('ALPHAS Fraternity - Database Setup');
console.log('===================================\n');

async function setup() {
  try {
    console.log('Initializing database...');
    
    const success = await database.initialize();
    
    if (success) {
      console.log('✓ Database initialized successfully!');
      console.log(`✓ Database file: data/alphas.db\n`);
      
      // Test connection and get row count
      const rows = await database.select('SELECT COUNT(*) as count FROM contacts');
      
      console.log('✓ Connection test successful');
      console.log(`✓ Current submissions in database: ${rows[0].count}\n`);

      // Create default admin user if none exists
      const userRows = await database.select('SELECT COUNT(*) as count FROM users');
      if (userRows[0].count === 0) {
        const bcrypt = require('bcryptjs');
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        await database.query(
          'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
          ['admin', defaultPassword, 'hlakulaachuma@icloud.com', 'admin']
        );
        console.log('✓ Default admin user created');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');
      }
      
      console.log('Setup complete! Your website is ready to use.\n');
      console.log('Next steps:');
      console.log('1. Start the server: npm start');
      console.log('2. Test the contact form on your website');
      console.log('3. View submissions at: http://localhost:3000/admin');
      
      database.close();
      process.exit(0);
    } else {
      console.log('✗ Database initialization failed.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

setup();

