# QuickTechPro Website - Hostinger Premium Hosting Deployment Guide

## 🏠 Hostinger Premium Hosting Setup

**Important**: Hostinger Premium is shared hosting, not VPS. This means we need to deploy as static files, not a Node.js server.

### Hosting Environment
- **Type**: Shared hosting (cPanel)
- **Technology**: Static HTML/CSS/JS files
- **No Node.js server**: Files served directly by Apache/Nginx
- **Domain**: quicktechpro.in

### Deployment Strategy
Since Hostinger Premium doesn't support Node.js servers, we'll:
1. Build the Next.js app as static files (`next export`)
2. Upload static files via File Manager or FTP
3. Use Git for version control and manual deployment

## 📁 Static Export Configuration

The project is configured to generate static HTML files that work on shared hosting:

### Build Process
```bash
# Generate static files for hosting
npm run build
npm run export  # Creates 'out/' folder with static files
```

### What Gets Generated
- HTML files for all pages
- CSS and JavaScript bundles
- Optimized images and assets
- All files ready for upload to hosting

## 🛡️ Security Checklist
- [ ] Environment variables secured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] PM2 process monitoring
- [ ] Regular backups scheduled
- [ ] Security headers configured

## 📞 Support
For deployment issues, contact: support@quicktechpro.com
