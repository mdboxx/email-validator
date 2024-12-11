#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root" 
   exit 1
fi

# Configuration variables
APP_NAME="email-validator"
APP_DIR="/var/www/$APP_NAME"
NGINX_AVAILABLE="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"
NODE_VERSION="18"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

log "Starting deployment process..."

# Update system
log "Updating system packages..."
apt update && apt upgrade -y || {
    error "Failed to update system packages"
    exit 1
}

# Install required packages
log "Installing required packages..."
apt install -y curl git build-essential || {
    error "Failed to install required packages"
    exit 1
}

# Install Node.js
log "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
    apt install -y nodejs || {
        error "Failed to install Node.js"
        exit 1
    }
fi

# Install Nginx
log "Installing Nginx..."
apt install -y nginx || {
    error "Failed to install Nginx"
    exit 1
}

# Create application directory
log "Creating application directory..."
mkdir -p "$APP_DIR"
chown -R $SUDO_USER:$SUDO_USER "$APP_DIR"

# Clone repository
log "Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
    warning "Git repository already exists. Pulling latest changes..."
    cd "$APP_DIR" && git pull
else
    # Replace with your actual repository URL
    git clone https://github.com/yourusername/email-validator.git "$APP_DIR" || {
        error "Failed to clone repository"
        exit 1
    }
fi

# Install dependencies
log "Installing Node.js dependencies..."
cd "$APP_DIR"
npm install || {
    error "Failed to install Node.js dependencies"
    exit 1
}

# Build application
log "Building application..."
npm run build || {
    error "Failed to build application"
    exit 1
}

# Install PM2
log "Installing PM2..."
npm install -g pm2 || {
    error "Failed to install PM2"
    exit 1
}

# Configure Nginx
log "Configuring Nginx..."
cat > "$NGINX_AVAILABLE" << EOF
server {
    listen 80;
    server_name $SERVER_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx configuration
rm -f /etc/nginx/sites-enabled/default
ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"

# Test Nginx configuration
nginx -t || {
    error "Nginx configuration test failed"
    exit 1
}

# Restart Nginx
systemctl restart nginx

# Configure firewall
log "Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Setup environment variables
log "Setting up environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    warning "Please configure your environment variables in $APP_DIR/.env"
fi

# Start application with PM2
log "Starting application with PM2..."
cd "$APP_DIR"
pm2 start deployment/ecosystem.config.js || {
    error "Failed to start application with PM2"
    exit 1
}

# Save PM2 process list and configure startup
pm2 save
pm2 startup systemd || {
    error "Failed to setup PM2 startup"
    exit 1
}

# Final steps
log "Deployment completed successfully!"
log "Your application is now accessible at: http://$SERVER_IP"
warning "Remember to:"
echo "1. Configure your environment variables in $APP_DIR/.env"
echo "2. Set up SSL certificate using certbot (recommended)"
echo "3. Configure proper backup strategies"
echo "4. Monitor application logs using 'pm2 logs'"

# Optional: Install Certbot for SSL
read -p "Would you like to install SSL certificate using Certbot? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
    read -p "Enter your domain name: " domain_name
    certbot --nginx -d "$domain_name" || {
        error "Failed to obtain SSL certificate"
        exit 1
    }
    systemctl enable certbot.timer
    log "SSL certificate installed successfully!"
fi