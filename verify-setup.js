/**
 * Complete setup verification script
 * Run this to verify everything is working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ALPHAS Fraternity Website Setup\n');
console.log('='.repeat(60));

let allGood = true;

// Check required files
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'index.html',
  'login.html',
  'admin.html',
  'server.js',
  'database.js',
  'auth.js',
  'middleware.js',
  'config.js',
  'package.json',
  'script.js',
  'styles.css'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING!`);
    allGood = false;
  }
});

// Check node_modules
console.log('\n📦 Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('  ✅ node_modules exists');
} else {
  console.log('  ❌ node_modules missing - run: npm install');
  allGood = false;
}

// Check database
console.log('\n💾 Checking database...');
const dataDir = path.join(__dirname, 'data');
if (fs.existsSync(dataDir)) {
  console.log('  ✅ data directory exists');
  const dbFile = path.join(dataDir, 'alphas.db');
  if (fs.existsSync(dbFile)) {
    console.log('  ✅ Database file exists');
  } else {
    console.log('  ⚠️  Database file not found (will be created on first run)');
  }
} else {
  console.log('  ⚠️  data directory not found (will be created on first run)');
}

// Check package.json dependencies
console.log('\n📋 Checking package.json dependencies...');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = ['express', 'sql.js', 'bcryptjs', 'cookie-parser', 'cors', 'express-rate-limit', 'uuid'];
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`  ✅ ${dep} (${pkg.dependencies[dep]})`);
    } else {
      console.log(`  ❌ ${dep} - MISSING!`);
      allGood = false;
    }
  });
} catch (error) {
  console.log('  ❌ Error reading package.json');
  allGood = false;
}

// Test database connection
console.log('\n🔌 Testing database connection...');
try {
  const database = require('./database');
  database.initialize().then(success => {
    if (success) {
      console.log('  ✅ Database connection successful');
      
      // Check for admin user
      database.select('SELECT COUNT(*) as count FROM users').then(users => {
        if (users[0].count > 0) {
          console.log('  ✅ Admin user exists');
        } else {
          console.log('  ⚠️  No admin user found - run: node setup.js');
        }
        
        database.close();
        
        console.log('\n' + '='.repeat(60));
        if (allGood) {
          console.log('✅ ALL CHECKS PASSED!');
          console.log('\n🚀 Your website is ready!');
          console.log('   Start server: npm start');
          console.log('   Then visit: http://localhost:3000');
        } else {
          console.log('⚠️  SOME ISSUES FOUND');
          console.log('   Please fix the issues above before starting the server');
        }
        process.exit(0);
      }).catch(err => {
        console.log('  ❌ Error checking users:', err.message);
        database.close();
        process.exit(1);
      });
    } else {
      console.log('  ❌ Database initialization failed');
      database.close();
      process.exit(1);
    }
  });
} catch (error) {
  console.log('  ❌ Database test failed:', error.message);
  console.log('\n⚠️  Please run: npm install');
  process.exit(1);
}

