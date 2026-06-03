# Google Apps Script Integration - Quick Start

## ⚡ 30-Second Setup

1. **Create `.env.local` in project root:**
```bash
echo 'GOOGLE_LEADS_WEB_APP_URL=PASTE_YOUR_URL_HERE' > .env.local
echo 'GOOGLE_LEADS_SECRET=PASTE_YOUR_SECRET_HERE' >> .env.local
```

2. **Replace the placeholders with your actual values**

3. **Restart dev server:**
```bash
npm run dev
```

4. **Test at:** http://localhost:3000/contact

---

## 📋 Checklist

- [ ] Copy Google Apps Script deployment URL
- [ ] Get your secret key from Google Apps Script
- [ ] Create `.env.local` with both values
- [ ] Restart `npm run dev`
- [ ] Fill contact form and submit
- [ ] Check "Leads CRM" Google Sheet for new row
- [ ] See success message: "Your enquiry has been received..."

---

## 🔒 Security Reminders

```
❌ Never commit .env.local
❌ Never share your secret key
❌ Never put secrets in frontend code
✅ All secrets stay server-side only
```

---

## 📊 What to Expect

**On Success:**
1. Button shows "Sending..." (1-3 seconds)
2. Success message appears
3. New row in Google Sheet

**On Error:**
1. Error message displays
2. Button returns to normal
3. Can retry

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| .env not working | Restart dev server after creating .env.local |
| "Something went wrong" | Check .env.local has correct values |
| Data not in sheet | Verify Google Apps Script is deployed |
| Button stays disabled | Check browser console for errors |

---

## 📁 Files Changed

✅ **Created:** `/src/app/api/leads/route.ts`
✅ **Modified:** `/src/app/contact/page.tsx`
✅ **Modified:** `.env.example`

**Nothing else changed. Page design preserved.**

---

## 🚀 Deploy to Production

After testing locally:

1. Set environment variables in Vercel/hosting:
   - `GOOGLE_LEADS_WEB_APP_URL`
   - `GOOGLE_LEADS_SECRET`

2. Restart deployment
3. Test on production URL

---

## 📞 Testing

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:3000/contact

# Fill and submit form
# Check: browser success message + Google Sheet for new row
```

---

## 💡 How It Works

```
User Form → /api/leads (your server) → Google Apps Script → Google Sheet
```

Your secret never leaves your server. ✅

---

## 📖 Full Documentation

- `GOOGLE_APPS_SCRIPT_INTEGRATION.md` - Complete setup guide
- `TESTING_GUIDE.md` - Detailed test scenarios
- `CHANGES_SUMMARY.md` - What changed and why

---

**Status:** Ready for configuration and testing ✅
