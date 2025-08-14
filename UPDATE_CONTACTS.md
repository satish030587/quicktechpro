# 📞 Contact Information Update Guide

## Current Placeholder Information

The website currently uses placeholder contact information that needs to be updated with your real details:

### Phone Numbers
- **Current:** `+91-XXXX-XXXXXX`
- **Replace with:** Your actual phone number

### Email Addresses
- **Current:** `support@quicktechpro.com`
- **Replace with:** Your actual email address

### Office Address
- **Current:** `Tech Hub, Bangalore, Karnataka, India`
- **Replace with:** Your actual office address

## 📝 Files to Update

### 1. Main Contact Information
Update these files with your real contact details:

#### `src/components/Navbar.tsx`
- Line ~15: Phone number in contact bar
- Line ~16: Email address in contact bar

#### `src/components/Footer.tsx`
- Line ~25: Phone number
- Line ~26: Email address
- Line ~27: Office address

#### `src/app/contact/page.tsx`
- Line ~12: Phone number in contact methods
- Line ~19: Email address in contact methods
- Line ~26: WhatsApp number
- Line ~87: Office address
- Line ~146: Phone number in hero section
- Line ~159: Emergency hotline number
- Line ~268: Call button phone number

### 2. Social Media Links (Optional)
Update social media links in `src/components/Footer.tsx` and `src/app/contact/page.tsx`:
- Facebook page URL
- Twitter profile URL
- LinkedIn profile URL
- WhatsApp business number

### 3. Business Hours
Update business hours and timezone in:
- `src/app/contact/page.tsx` (line ~89-92)

## 🔧 Quick Update Commands

### Search and Replace (Recommended)
Use your code editor's "Find and Replace" feature:

1. **Phone Number:**
   - Find: `+91-XXXX-XXXXXX`
   - Replace: `+91-YOUR-ACTUAL-NUMBER`

2. **Email Address:**
   - Find: `support@quicktechpro.com`
   - Replace: `your-email@quicktechpro.in`

3. **Office Address:**
   - Find: `Tech Hub, Bangalore, Karnataka, India`
   - Replace: `Your Actual Address`

### Using VS Code
1. Press `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)
2. Enable "Replace in Files"
3. Enter the placeholder text to find
4. Enter your actual information to replace
5. Click "Replace All"

## 📧 Email Setup (Future Enhancement)

When you're ready to set up email functionality:

1. **Configure SMTP** in `.env.production`:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=noreply@quicktechpro.in
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=support@quicktechpro.in
   ```

2. **Domain Email Setup:**
   - Configure email hosting for `quicktechpro.in`
   - Set up `support@quicktechpro.in`
   - Set up `noreply@quicktechpro.in`

## 🔒 WhatsApp Business Setup

1. **Get WhatsApp Business Account:**
   - Register your business number
   - Verify your business

2. **Update WhatsApp Links:**
   - Replace `91XXXXXXXXXX` with your actual number
   - Format: `https://wa.me/91YOURNUMBER`

## ✅ Verification Checklist

After updating contact information:

- [ ] Phone numbers updated in all files
- [ ] Email addresses updated in all files
- [ ] Office address updated
- [ ] WhatsApp links updated
- [ ] Social media links updated (if applicable)
- [ ] Business hours updated
- [ ] Timezone information updated
- [ ] Emergency contact information updated

## 🚀 Deploy Updated Information

After making changes:

```bash
# Commit your changes
git add .
git commit -m "Update contact information with real details"
git push origin main
```

The automated deployment will update your live website within a few minutes!

## 📞 Priority Update Order

1. **Phone Number** - Most critical for customer contact
2. **Email Address** - Essential for support
3. **Office Address** - Important for credibility
4. **WhatsApp Number** - Popular communication method
5. **Social Media** - Optional but recommended

Remember to test all contact methods after updating to ensure they work correctly!
