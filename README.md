# 🚀 QuickTechPro - Professional Remote Tech Services Website

![QuickTechPro](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-blue)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-blue)

A modern, professional website for QuickTechPro offering remote tech services including computer repair, website design, and web application development.

## 🌟 Features

### 🏠 **Homepage**
- Hero section with compelling call-to-action
- Services overview with pricing
- Customer testimonials
- Why choose us section
- Professional design with gradient backgrounds

### 🛠️ **Service Pages**
- **Computer Repair**: Remote troubleshooting, virus removal, performance optimization
- **Website Design**: Portfolio showcase, responsive designs, modern layouts
- **Web Applications**: Custom development, full-stack solutions

### 📄 **Information Pages**
- **About**: Company story, team information, certifications
- **Contact**: Multiple contact methods, emergency support, FAQ
- **Blog**: Tech articles, tutorials, industry insights

### 🎨 **Design Features**
- Fully responsive design
- Modern gradient color schemes
- Interactive components
- Professional typography
- Mobile-first approach
- SEO optimized

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Frontend**: React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Icons**: Unicode/Emoji (React 19 compatible)
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Deployment**: PM2, Nginx, GitHub Actions

## 🚀 Quick Start

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/quicktechpro-website.git
cd quicktechpro-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
quicktechpro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── blog/              # Blog section
│   │   ├── computer-repair/   # Computer repair service
│   │   ├── contact/           # Contact page
│   │   ├── web-applications/  # Web development service
│   │   ├── website-design/    # Website design service
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   └── components/            # Reusable components
│       ├── ContactForm.tsx    # Contact form component
│       ├── Footer.tsx         # Site footer
│       ├── Navbar.tsx         # Navigation bar
│       ├── PricingTable.tsx   # Pricing display
│       └── [other components]
├── public/                    # Static assets
├── .github/workflows/         # GitHub Actions CI/CD
├── ecosystem.config.js        # PM2 configuration
├── deploy.sh                  # Manual deployment script
└── [config files]
```

## 🌐 Deployment

### Automated Deployment (Recommended)

The website includes automated deployment setup:

1. **GitHub Actions**: Automatic deployment on push to main branch
2. **PM2 Configuration**: Production process management
3. **Nginx Setup**: Reverse proxy configuration

### Quick Deployment Guide

1. **Read the Setup Guide**: See `SETUP_GUIDE.md` for detailed instructions
2. **Configure Server**: Set up Ubuntu/CentOS server with Node.js, PM2, Nginx
3. **Push to Git**: Code automatically deploys on git push
4. **SSL Setup**: Automatic HTTPS with Let's Encrypt

```bash
# Push changes (triggers auto-deployment)
git add .
git commit -m "Your changes"
git push origin main
```

## 📞 Contact Information Setup

**⚠️ Important**: Update placeholder contact information before going live.

See `UPDATE_CONTACTS.md` for detailed instructions on updating:
- Phone numbers (`+91-XXXX-XXXXXX`)
- Email addresses (`support@quicktechpro.com`)
- Office address
- WhatsApp numbers

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
./deploy.sh          # Manual deployment to server
```

## 📚 Documentation

- **`SETUP_GUIDE.md`**: Complete deployment guide
- **`DEPLOYMENT.md`**: Server configuration details
- **`UPDATE_CONTACTS.md`**: Contact information update guide

## 🔒 Security Features

- HTTPS/SSL encryption
- Security headers configuration
- Environment variable protection
- Input validation and sanitization
- Secure remote connection protocols

## 🎯 Services Offered

### 💻 Computer Repair (Remote)
- **Starting**: ₹299
- Virus removal, performance optimization
- Software troubleshooting
- Data recovery services
- System diagnostics

### 🎨 Website Design
- **Starting**: ₹9,999
- Responsive design
- Modern layouts
- SEO optimization
- Mobile-first approach

### 🚀 Web Applications
- **Starting**: ₹19,999
- Custom development
- Full-stack solutions
- Database integration
- API development

## 🌟 Key Features

- ✅ 24/7 Emergency Support
- ✅ 15-minute Response Time
- ✅ 100% Satisfaction Guarantee
- ✅ Secure Remote Connections
- ✅ Transparent Pricing
- ✅ Multi-language Support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for QuickTechPro. All rights reserved.

## 📞 Support

- **Website**: [https://quicktechpro.in](https://quicktechpro.in)
- **Email**: support@quicktechpro.in (update with real email)
- **Phone**: +91-XXXX-XXXXXX (update with real number)
- **WhatsApp**: Available for instant support

## 🚀 Live Website

**Production URL**: [https://quicktechpro.in](https://quicktechpro.in)

---

Built with ❤️ by QuickTechPro Team | © 2025 QuickTechPro. All rights reserved.
