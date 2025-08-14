# 📤 Hostinger Upload Guide - Step by Step with Screenshots

## 🎯 Overview
This guide shows you exactly how to upload your QuickTechPro website to Hostinger Premium hosting.

---

## 🚀 Quick Upload Process

### ⚡ Super Quick Method (5 minutes)

1. **Double-click** `build-for-hostinger.bat` in your project folder
2. **Wait** for build to complete (30-60 seconds)
3. **Follow** the on-screen instructions
4. **Upload** files from the `out` folder to Hostinger

---

## 📋 Detailed Step-by-Step Guide

### Step 1: Build Your Website

#### Option A: Use the Batch File (Easiest)
1. Navigate to your project folder: `d:\quicktechpro`
2. Double-click `build-for-hostinger.bat`
3. Wait for the build to complete

#### Option B: Use Command Line
```bash
cd d:\quicktechpro
npm run deploy
```

**Result**: You'll have an `out` folder with all website files ready for upload.

---

### Step 2: Access Hostinger Control Panel

1. **Go to**: [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **Login** with your Hostinger credentials
3. **Find your domain**: Look for `quicktechpro.in` in your hosting list
4. **Click "Manage"** next to your hosting plan

**What you'll see**: Hostinger's hPanel dashboard with various tools

---

### Step 3: Open File Manager

1. **In hPanel**: Look for "File Manager" icon
2. **Click "File Manager"** 
3. **Wait** for File Manager to load

**What you'll see**: A file browser showing your hosting files

---

### Step 4: Navigate to public_html

1. **Double-click** the `public_html` folder
2. **You should see**: The main directory where your website files go

**Current contents might include**:
- `index.html` (default Hostinger page)
- `cgi-bin/` folder
- Other default files

---

### Step 5: Clear Existing Files (Important!)

1. **Select all existing files** in public_html
   - Click the first file
   - Hold `Ctrl+A` to select all
   - OR click each file while holding `Ctrl`

2. **Delete selected files**
   - Right-click → Delete
   - OR click the Delete button
   - Confirm deletion

**Why**: Remove default Hostinger files to avoid conflicts

---

### Step 6: Upload Your Website Files

#### Method A: Drag and Drop (Recommended)

1. **Open Windows Explorer** → Navigate to `d:\quicktechpro\out\`
2. **Select ALL files and folders** in the `out` directory:
   - `index.html`
   - `about/` folder
   - `blog/` folder
   - `computer-repair/` folder
   - `contact/` folder
   - `web-applications/` folder
   - `website-design/` folder
   - `_next/` folder
   - `404.html`
   - All `.svg` files
   - `favicon.ico`

3. **Drag and drop** all selected files into Hostinger File Manager
4. **Wait** for upload to complete (1-5 minutes depending on your internet)

#### Method B: Upload Button

1. **Click "Upload"** in File Manager
2. **Select files** from `d:\quicktechpro\out\`
3. **Select ALL files and folders**
4. **Click "Upload"**
5. **Wait** for completion

---

### Step 7: Verify File Structure

After upload, your `public_html` should contain:

```
public_html/
├── index.html              ← Homepage
├── 404.html               ← Error page
├── favicon.ico            ← Website icon
├── about/
│   └── index.html         ← About page
├── blog/
│   └── index.html         ← Blog page
├── computer-repair/
│   └── index.html         ← Computer repair page
├── contact/
│   └── index.html         ← Contact page
├── web-applications/
│   └── index.html         ← Web apps page
├── website-design/
│   └── index.html         ← Website design page
├── _next/                 ← CSS, JS, and assets
│   ├── static/
│   └── [other files]
├── file.svg               ← Icons
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

---

### Step 8: Test Your Website

1. **Open browser** and go to: `https://quicktechpro.in`
2. **Test all pages**:
   - Homepage: `https://quicktechpro.in`
   - About: `https://quicktechpro.in/about`
   - Services: `https://quicktechpro.in/computer-repair`
   - Contact: `https://quicktechpro.in/contact`
   - Blog: `https://quicktechpro.in/blog`

3. **Check mobile responsiveness**:
   - Open on phone
   - Or use browser's mobile view (F12 → mobile icon)

---

## 🔧 Troubleshooting

### Website Shows "Index of /" or File List
**Problem**: Files uploaded to wrong location
**Solution**: Make sure files are in `public_html`, not a subfolder

### Page Not Found (404 errors)
**Problem**: Missing index.html files in subfolders
**Solution**: Check that each service folder contains `index.html`

### Styles Not Loading (Plain HTML)
**Problem**: `_next` folder missing or incomplete
**Solution**: Re-upload the entire `_next` folder

### Homepage Not Loading
**Problem**: No `index.html` in root
**Solution**: Ensure `index.html` is directly in `public_html`

---

## ⚡ Quick Update Process

When you make changes to your website:

1. **Edit your code** in VS Code
2. **Run build**: Double-click `build-for-hostinger.bat`
3. **Upload only changed files** (or upload all for safety)
4. **Test the website**

---

## 📱 File Manager Mobile App

Hostinger also has a mobile app for quick updates:

1. **Download**: "Hostinger" app from app store
2. **Login**: Use your Hostinger credentials
3. **File Manager**: Access and upload files from your phone

---

## 🎯 Success Checklist

- [ ] Website builds without errors (`npm run deploy`)
- [ ] All files uploaded to `public_html` folder
- [ ] `index.html` exists in root and all subfolders
- [ ] `_next` folder uploaded completely
- [ ] Homepage loads at `https://quicktechpro.in`
- [ ] All service pages accessible
- [ ] Contact form displays correctly
- [ ] Website is mobile responsive
- [ ] All images and icons display
- [ ] No broken links

---

## 🚀 You're Live!

**Your website is now live at**: `https://quicktechpro.in`

**SSL/HTTPS**: Hostinger automatically provides free SSL certificates, so your site will be secure with HTTPS.

**Performance**: Static files load extremely fast on Hostinger's shared hosting.

**Updates**: Simply rebuild and re-upload files when you make changes.

---

## 🔄 Regular Updates

### When You Want to Update Content:

1. **Edit files** in VS Code
2. **Update contact info** if needed
3. **Build**: `npm run deploy`
4. **Upload**: New files from `out` folder
5. **Test**: Check website works correctly

### Backup Strategy:
- Keep your source code in Git repository
- Hostinger provides automatic backups
- Download website files occasionally via File Manager

---

Your professional QuickTechPro website is now serving customers 24/7! 🎉
