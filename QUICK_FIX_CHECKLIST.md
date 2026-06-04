# Quick Fix Checklist - Google Sheets Integration

## The Problem in 30 Seconds
Your contact form works, emails work, BUT Google Sheet doesn't receive data because of a "Secret mismatch" error from your Google Apps Script.

## The Solution in 5 Steps

### Step 1: Create Google Sheet (2 min)
- [ ] Go to sheets.google.com → Create new spreadsheet → Name it "PLUCO Leads"
- [ ] Copy the Spreadsheet ID from the URL
- [ ] Add these headers in Row 1: Date | Full Name | Email | Phone | Nationality | Country | Language | Service | Family Members | Num Members | Urgency | Contact Method | Description

### Step 2: Deploy New Google Apps Script (2 min)
- [ ] Go to script.google.com → New project → Name it "PLUCO Form Receiver"
- [ ] Delete everything in Code.gs
- [ ] Copy the code from `FINAL_SETUP_INSTRUCTIONS.md` section "Phase 2"
- [ ] Replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with your ID from Step 1
- [ ] Save (Ctrl+S)

### Step 3: Deploy as Web App (2 min)
- [ ] Click Deploy → New deployment
- [ ] Type: Web app | Execute as: Your email | Who has access: Anyone
- [ ] Copy the deployment URL (save it!)
- [ ] Confirm deployment

### Step 4: Update .env.local (1 min)
- [ ] Open `.env.local`
- [ ] Find: `GOOGLE_LEADS_WEB_APP_URL=https://script.google.com/macros/s/...`
- [ ] Replace with your new deployment URL from Step 3
- [ ] Remove or comment out `GOOGLE_LEADS_SECRET` line

### Step 5: Restart & Test (1 min)
- [ ] Stop dev server (Ctrl+C)
- [ ] Run: `npm run dev`
- [ ] Go to http://localhost:3000/enquire
- [ ] Submit test form
- [ ] Check Google Sheet for new row
- [ ] ✅ Done!

---

## Status Before vs After

### Before (Current State)
```
Form Submission ✅
Email Sent ✅
Google Sheet ❌ ("Secret mismatch")
```

### After (5-Step Fix)
```
Form Submission ✅
Email Sent ✅
Google Sheet ✅
```

---

## Verification

After completing all 5 steps, you should see:
- Form shows "Thank You" message ✅
- Email arrives at `info@plucogroup.com` ✅
- New row appears in "PLUCO Leads" Google Sheet ✅
- All data correctly populated in Sheet columns ✅

---

## If Something Goes Wrong

**"Secret mismatch" error still appears**
→ You're using the OLD deployment URL
→ Get the NEW URL from your new Apps Script deployment
→ Update .env.local and restart server

**"Script error" when submitting**
→ Your Spreadsheet ID is wrong in Code.gs Line 1
→ Go back to Google Sheet, copy the ID again
→ Update Code.gs Line 1
→ Redeploy

**No rows appear in Sheet**
→ Sheet tab name must match `SHEET_NAME` in Code.gs
→ Usually "Sheet1" (or whatever you named it)
→ Update Code.gs Line 2 if different

---

## Time Required
- **Total:** 10-15 minutes
- **Hardest part:** Finding your Spreadsheet ID (it's in the URL)
- **Easiest part:** Copying and pasting the code

---

## Files to Reference
- `FINAL_SETUP_INSTRUCTIONS.md` - Full detailed guide
- `SETUP_STATUS_REPORT.md` - Current status and what's working

---

## Start Here: Phase 1 - Create Google Sheet
👉 Go to sheets.google.com and create "PLUCO Leads" spreadsheet
