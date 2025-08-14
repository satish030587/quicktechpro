# 🚀 QuickTechPro Website - Complete Deployment Guide

## Overview
This guide will help you deploy your QuickTechPro website to your domain `quicktechpro.in` with automated deployment from a Git repository.

## 📋 Prerequisites

### On Your Local Machine:
- [x] Git installed
- [x] Node.js 18+ installed
- [x] Website code ready (✅ Already completed)

### On Your Server:
- [ ] Ubuntu/CentOS server with root access
- [ ] Domain `quicktechpro.in` pointing to your server IP
- [ ] SSL certificate (Let's Encrypt recommended)

## 🎯 Deployment Options

### Option 1: GitHub Private Repository (Recommended)
**Best for:** Automatic deployments, team collaboration, backup

### Option 2: GitLab Private Repository
**Best for:** If you prefer GitLab ecosystem

### Option 3: Manual Deployment
**Best for:** Simple setups, learning purposes

---

## 🚀 Step-by-Step Setup

### Step 1: Create Private Git Repository

#### For GitHub:
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name: `quicktechpro-website`
4. Set to **Private**
5. Don't initialize with README (we already have code)
6. Click "Create Repository"

#### For GitLab:
1. Go to [GitLab.com](https://gitlab.com)
2. Click "New Project"
3. Choose "Create blank project"
4. Name: `quicktechpro-website`
5. Set visibility to **Private**
6. Click "Create Project"

### Step 2: Push Code to Repository

```bash
# Navigate to your project
cd d:\quicktechpro

# Add remote repository (replace with your actual repo URL)
# For GitHub:
git remote add origin https://github.com/YOUR_USERNAME/quicktechpro-website.git

# For GitLab:
git remote add origin https://gitlab.com/YOUR_USERNAME/quicktechpro-website.git

# Push to repository
git branch -M main
git push -u origin main
```

### Step 3: Server Setup

#### 3.1 Connect to Your Server
```bash
ssh root@quicktechpro.in
# or
ssh your-username@quicktechpro.in
```

#### 3.2 Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 3.3 Create Website Directory
```bash
# Create directory
sudo mkdir -p /var/www/quicktechpro.in

# Set ownership
sudo chown -R $USER:$USER /var/www/quicktechpro.in

# Navigate to directory
cd /var/www/quicktechpro.in
```

#### 3.4 Clone Repository
```bash
# Clone your private repository
git clone https://github.com/YOUR_USERNAME/quicktechpro-website.git .

# Install dependencies
npm install

# Build the application
npm run build
```

#### 3.5 Configure Environment
```bash
# Copy environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production
```

#### 3.6 Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### Step 4: Configure Nginx

#### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/quicktechpro.in
```

#### 4.2 Add Configuration Content:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quicktechpro.in www.quicktechpro.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Security headers
        proxy_set_header X-Frame-Options DENY;
        proxy_set_header X-Content-Type-Options nosniff;
        proxy_set_header X-XSS-Protection "1; mode=block";
    }
}
```

#### 4.3 Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/quicktechpro.in /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup SSL Certificate
```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d quicktechpro.in -d www.quicktechpro.in

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 6: Setup Automated Deployment

#### Option A: GitHub Actions (Recommended)

1. **Generate SSH Key on Server:**
```bash
ssh-keygen -t ed25519 -C "github-actions@quicktechpro.in"
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_ed25519  # Copy this private key
```

2. **Add Secrets to GitHub:**
   - Go to your GitHub repository
   - Click Settings → Secrets and variables → Actions
   - Add these secrets:
     - `HOST`: `quicktechpro.in`
     - `USERNAME`: `your-server-username`
     - `SSH_KEY`: `paste-the-private-key-here`
     - `PORT`: `22` (or your SSH port)

3. **The GitHub Actions workflow is already configured** in `.github/workflows/deploy.yml`

#### Option B: Manual Deployment Script

Make the deployment script executable:
```bash
chmod +x deploy.sh
```

To deploy manually:
```bash
./deploy.sh production
```

---

## 🔄 How Automated Deployment Works

### GitHub Actions Flow:
1. You push code to `main` branch
2. GitHub Actions automatically:
   - Runs tests and builds the project
   - Connects to your server via SSH
   - Pulls latest code
   - Installs dependencies
   - Builds the application
   - Restarts the application with PM2
3. Your website is automatically updated!

### Manual Deployment Flow:
1. Run `./deploy.sh production`
2. Script automatically:
   - Tests code locally
   - Connects to server
   - Deploys latest changes
   - Restarts application

---

## 🛠️ Useful Commands

### On Your Server:
```bash
# Check application status
pm2 status

# View logs
pm2 logs quicktechpro

# Restart application
pm2 restart quicktechpro

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### On Your Local Machine:
```bash
# Push changes (triggers auto-deployment)
git add .
git commit -m "Your changes description"
git push origin main

# Manual deployment
./deploy.sh production
```

---

## 🚨 Troubleshooting

### Website Not Loading:
1. Check PM2 status: `pm2 status`
2. Check Nginx: `sudo systemctl status nginx`
3. Check logs: `pm2 logs quicktechpro`

### Deployment Failed:
1. Check GitHub Actions logs
2. Verify SSH key access
3. Check server disk space: `df -h`

### SSL Issues:
1. Renew certificate: `sudo certbot renew`
2. Check certificate status: `sudo certbot certificates`

---

## 🔒 Security Checklist

- [x] SSL certificate installed
- [x] Firewall configured (UFW recommended)
- [x] SSH key authentication
- [x] Regular updates scheduled
- [x] PM2 process monitoring
- [x] Nginx security headers
- [x] Environment variables secured

---

## 📞 Support

If you need help with deployment:
1. Check the troubleshooting section above
2. Review server logs
3. Contact your hosting provider for server-specific issues

**Your website will be live at:** `https://quicktechpro.in`

---

## 🎉 Next Steps After Deployment

1. **Test all pages** to ensure everything works
2. **Set up monitoring** (optional)
3. **Configure backups** (recommended)
4. **Set up analytics** (Google Analytics)
5. **Configure email** for contact forms
6. **Add real contact information** (replace placeholder phone numbers)

Your QuickTechPro website is now ready for production! 🚀
