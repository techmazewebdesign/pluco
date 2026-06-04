# PLUCO Group Website - Final Setup Instructions

## What's Working ✅

- Contact form at `/enquire` page
- API endpoint `/api/enquiry`
- Email notifications (Resend configured)
- All form validation
- Success/error messaging

## What Needs Fixing ❌

- Google Apps Script deployment has issues
- Secret authentication failing
- Data not being saved to Google Sheet

## IMMEDIATE ACTION REQUIRED

Your current Google Apps Script deployment is experiencing issues. To fix this, you need to **redeploy with fresh code**. This takes about 5 minutes.

---

## COMPLETE STEP-BY-STEP SETUP

### Phase 1: Create Google Sheet (2 minutes)

1. Go to **[sheets.google.com](https://sheets.google.com)**
2. Click **"+ Create new spreadsheet"**
3. Name it: `PLUCO Leads`
4. Copy the **Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0`
   - **Save this ID** - you'll need it in the next step

5. In the sheet, add these **column headers** in Row 1:
   ```
   A: Date
   B: Full Name  
   C: Email
   D: Phone / WhatsApp
   E: Nationality
   F: Current Country of Residence
   G: Preferred Language
   H: Service Needed
   I: Family Members
   J: Number of Family Members
   K: Urgency
   L: Preferred Contact Method
   M: Short Case Description
   ```

### Phase 2: Create New Google Apps Script (2 minutes)

1. Go to **[script.google.com](https://script.google.com)**
2. Click **"+ New project"**
3. Name it: `PLUCO Form Receiver`
4. **Delete everything** in the `Code.gs` editor
5. **Paste this code:**

```javascript
const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Sheet1"; // Change if your sheet tab has a different name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    const timestamp = new Date().toLocaleString('en-GB', {
      timeZone: 'Europe/Warsaw'
    });
    
    const row = [
      timestamp,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.nationality || '',
      data.country || '',
      data.language || '',
      data.service || '',
      data.familyMembers || '',
      data.numFamilyMembers || '',
      data.urgency || '',
      data.preferredContact || '',
      data.description || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Lead saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. Replace **Line 1:** `PASTE_YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
7. Save (Ctrl+S / Cmd+S)

### Phase 3: Deploy App Script (2 minutes)

1. Click **"Deploy"** → **"New deployment"**
2. Click the **⚙️ icon**, select **"Web app"**
3. Set the following:
   - **Execute as:** Your email address
   - **Who has access:** Anyone
4. Click **"Deploy"**
5. **Copy the deployment URL** - it will look like:
   ```
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```
6. **Save this URL** - you'll need it next

### Phase 4: Update Environment Variables (1 minute)

1. Open `/Users/rooz/Desktop/websites/2048/.env.local`
2. Find this line:
   ```
   GOOGLE_LEADS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbxZDkSxQNuMCB7euRf_tQ5ZT6Y9eRgYeMHdOHF827eAkcgIxXtmO7_mYIPSLA4INRvJHA/exec
   ```
3. Replace it with your new deployment URL from Phase 3
4. Remove or comment out the `GOOGLE_LEADS_SECRET` line (not needed anymore)
5. Save the file

### Phase 5: Restart Dev Server (1 minute)

In your terminal:
```bash
cd /Users/rooz/Desktop/websites/2048
npm run dev
```

Wait for the server to show "Ready in XXXms"

### Phase 6: Test Everything

1. Open **http://localhost:3000/enquire**
2. Fill out the form with test data:
   ```
   Full Name: John Doe
   Email: john@test.com
   Phone: +48123456789
   Service: EU Residency
   Message: This is a test
   ```
3. **Check the consent checkbox** ✓
4. Click **"Send Enquiry"**
5. You should see a thank-you message
6. **Check your "PLUCO Leads" Google Sheet** - a new row should appear within 2 seconds with all the data

---

## Verification Checklist

- [ ] Google Sheet created and named "PLUCO Leads"
- [ ] Sheet has all 13 column headers
- [ ] Spreadsheet ID copied correctly
- [ ] Google Apps Script created
- [ ] Spreadsheet ID pasted into line 1 of Code.gs
- [ ] Code saved in Apps Script
- [ ] New deployment created
- [ ] Deployment URL copied
- [ ] .env.local updated with new deployment URL
- [ ] Dev server restarted
- [ ] Form test submission successful
- [ ] New row appears in Google Sheet
- [ ] Email sent to info@plucogroup.com

---

## Common Issues & Fixes

### Issue: "Script error" appears when submitting form
**Fix:**
1. Open your Google Apps Script project
2. Click **"Execution log"** to see the error
3. Verify line 1 has the correct Spreadsheet ID
4. Check that the sheet tab name matches `SHEET_NAME` in the code

### Issue: Data not appearing in Google Sheet
**Fix:**
1. Verify the Spreadsheet ID is correct in Apps Script
2. Verify the Sheet tab name matches (default is "Sheet1")
3. Run the test again
4. Check the Execution log in Apps Script for errors

### Issue: "Secret mismatch" error still appears
**Fix:**
1. You're using the old deployment URL
2. Delete all old deployments in Apps Script
3. Create a NEW deployment with the updated code
4. Copy the NEW deployment URL
5. Update .env.local with the NEW URL

### Issue: Form shows success but email doesn't arrive
**Fix:** This is separate from Google Sheets - check your Resend API configuration. Forms still work even if emails fail.

---

## After Setup is Complete

Once you've completed all steps and verified data appears in your Google Sheet:

1. ✅ Forms submissions = Data in Google Sheet
2. ✅ Auto-notifications = Emails to info@plucogroup.com
3. ✅ Client confirmation = Auto-emails to client
4. ✅ All field data = Organized in spreadsheet columns

---

## For Production Deployment

When deploying to production (Vercel, etc.):
1. Add the same `.env.local` variables to your hosting platform's environment variables
2. **Do NOT commit `.env.local` to Git** - it contains sensitive credentials
3. The same Google Apps Script deployment URL works for both local and production

---

## Support

If you encounter any issues after following these steps:
1. Check the Execution log in your Google Apps Script
2. Verify all IDs and URLs are copied exactly
3. Make sure you're using the NEW deployment URL (not the old one)
4. Clear browser cache and try again

**The setup should take 10-15 minutes total.**

---

**Status Update:** Your website form is ready to collect leads once you complete this setup!
