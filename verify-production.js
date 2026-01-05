/**
 * Production Readiness Verification Script
 * Run this before deploying to your domain
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ALPHAS Fraternity - Production Readiness Check\n');
console.log('='.repeat(50));

let allChecksPassed = true;

// Check 1: Critical Files
console.log('\n1. Checking Critical Files...');
const criticalFiles = [
  'server.js',
  'index.html',
  'login.html',
  'signup.html',
  'admin.html',
  'database.js',
  'auth.js',
  'middleware.js',
  'config.js',
  'package.json',
  'script.js',
  'theme.js'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allChecksPassed = false;
  }
});

// Check 2: Database
console.log('\n2. Checking Database...');
const dbPath = path.join(__dirname, 'data', 'alphas.db');
if (fs.existsSync(dbPath)) {
  console.log('   ✅ Database file exists');
  try {
    const stats = fs.statSync(dbPath);
    console.log(`   ✅ Database size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.log('   ⚠️  Could not read database stats');
  }
} else {
  console.log('   ⚠️  Database not found - run "npm run setup" first');
}

// Check 3: Dependencies
console.log('\n3. Checking Dependencies...');
try {
  const pkg = require('./package.json');
  const deps = Object.keys(pkg.dependencies || {});
  const optionalDeps = Object.keys(pkg.optionalDependencies || {});
  console.log(`   ✅ ${deps.length} dependencies defined`);
  console.log(`   ✅ ${optionalDeps.length} optional dependencies defined`);
  
  // Check if node_modules exists
  if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('   ✅ node_modules directory exists');
  } else {
    console.log('   ⚠️  node_modules not found - run "npm install"');
    allChecksPassed = false;
  }
} catch (err) {
  console.log('   ❌ Error reading package.json');
  allChecksPassed = false;
}

// Check 4: Environment Variables
console.log('\n4. Checking Environment Configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'OWNER_EMAIL'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName} configured`);
    } else {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`   ⚠️  Missing variables: ${missingVars.join(', ')}`);
  }
  
  // Check for production settings
  if (envContent.includes('NODE_ENV=production')) {
    console.log('   ✅ NODE_ENV set to production');
  } else {
    console.log('   ⚠️  NODE_ENV not set to production');
  }
  
  if (envContent.includes('ALLOWED_ORIGIN')) {
    console.log('   ✅ ALLOWED_ORIGIN configured');
  } else {
    console.log('   ⚠️  ALLOWED_ORIGIN not set - CORS will allow all origins');
  }
} else {
  console.log('   ⚠️  .env file not found - create one with required variables');
  console.log('   📝 See SETUP_GUIDE.md for required variables');
}

// Check 5: Code Quality
console.log('\n5. Checking Code Quality...');
try {
  // Check server.js for production readiness
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  
  if (serverContent.includes('process.env.NODE_ENV')) {
    console.log('   ✅ Environment-aware code');
  }
  
  if (serverContent.includes('helmet')) {
    console.log('   ✅ Security headers configured');
  }
  
  if (serverContent.includes('rateLimit')) {
    console.log('   ✅ Rate limiting configured');
  }
  
  if (serverContent.includes('contactLimiter')) {
    console.log('   ✅ Contact form rate limiting');
  }
  
  // Check for localhost hardcoding (should be minimal)
  const localhostMatches = (serverContent.match(/localhost/g) || []).length;
  if (localhostMatches <= 5) { // Allow some in console.log messages
    console.log('   ✅ No problematic localhost hardcoding');
  } else {
    console.log(`   ⚠️  Found ${localhostMatches} localhost references`);
  }
} catch (err) {
  console.log('   ❌ Error checking server.js');
  allChecksPassed = false;
}

// Check 6: API Configuration
console.log('\n6. Checking API Configuration...');
try {
  const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
  
  if (scriptContent.includes('window.location.origin')) {
    console.log('   ✅ API URL uses window.location.origin (production-ready)');
  }
  
  if (scriptContent.includes('apiUrl')) {
    console.log('   ✅ API URL helper function exists');
  }
} catch (err) {
  console.log('   ❌ Error checking script.js');
}

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY\n');

if (allChecksPassed) {
  console.log('✅ All critical checks passed!');
  console.log('\n🎯 Next Steps:');
  console.log('1. Configure .env with your domain and email settings');
  console.log('2. Set ALLOWED_ORIGIN to your domain');
  console.log('3. Test email/SMS notifications');
  console.log('4. Deploy to your hosting platform');
  console.log('5. Update DNS to point to your server');
  console.log('\n📖 See PRE_LAUNCH_CHECKLIST.md for detailed deployment guide');
} else {
  console.log('⚠️  Some checks failed. Please fix issues above before deploying.');
  console.log('\n💡 Common fixes:');
  console.log('- Run: npm install');
  console.log('- Run: npm run setup');
  console.log('- Create .env file with required variables');
}

console.log('\n' + '='.repeat(50));

