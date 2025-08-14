# QuickTechPro Website Deployment Guide

## 🚀 Deployment Setup Instructions

### Prerequisites
- Node.js 18+ installed on your server
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate for HTTPS

### Production Environment Variables
Create a `.env.production` file on your server:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

### Server Setup Commands

#### 1. Install Dependencies
```bash
npm install
npm run build
```

#### 2. Start with PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quicktechpro.in www.quicktechpro.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quicktechpro.in www.quicktechpro.in;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
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
    }
}
```

## 🔄 Automated Deployment

### Option 1: GitHub Actions (Recommended)
1. Push code to GitHub private repository
2. Set up GitHub Actions workflow
3. Configure server secrets

### Option 2: GitLab CI/CD
1. Push code to GitLab private repository
2. Set up CI/CD pipeline
3. Configure deployment variables

### Option 3: Manual Deployment Script
Use the provided `deploy.sh` script for manual deployments.

## 🛡️ Security Checklist
- [ ] Environment variables secured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] PM2 process monitoring
- [ ] Regular backups scheduled
- [ ] Security headers configured

## 📞 Support
For deployment issues, contact: support@quicktechpro.com
