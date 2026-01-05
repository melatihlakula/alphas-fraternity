#!/bin/bash

# Railway Setup Script
# This script helps configure Railway domain and environment variables

echo "🚀 Railway Setup Script"
echo "======================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
    
    # Add to PATH for current session
    export PATH="$HOME/.railway/bin:$PATH"
fi

echo ""
echo "🔐 Please login to Railway:"
railway login

echo ""
echo "🔗 Linking to your project..."
railway link

echo ""
echo "🌐 Generating domain..."
DOMAIN=$(railway domain --generate)
echo "✅ Domain generated: $DOMAIN"

echo ""
echo "⚙️  Setting environment variables..."

railway variables set NODE_ENV=production
railway variables set OWNER_EMAIL=hlakulaachuma@icloud.com
railway variables set OWNER_PHONE=+27655642698
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false

echo ""
echo "📧 Please enter your Gmail address:"
read -p "SMTP_USER: " SMTP_USER
railway variables set SMTP_USER="$SMTP_USER"

echo ""
echo "📧 Please enter your Gmail App Password:"
read -sp "SMTP_PASS: " SMTP_PASS
echo ""
railway variables set SMTP_PASS="$SMTP_PASS"

railway variables set FROM_EMAIL="$SMTP_USER"
railway variables set ALLOWED_ORIGIN="https://$DOMAIN"

echo ""
echo "✅ Setup complete!"
echo "🌐 Your website: https://$DOMAIN"
echo ""
echo "📝 Next: Get Gmail App Password from:"
echo "   https://myaccount.google.com/security"

