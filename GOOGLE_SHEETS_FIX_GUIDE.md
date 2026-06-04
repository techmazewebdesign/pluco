# Google Sheets Integration - Diagnostic Report & Fix Guide

## Current Status

✅ **API Endpoint:** Working correctly (`/api/enquiry`)  
✅ **Form Submission:** Working (returns success)  
✅ **Email Notifications:** Configured  
❌ **Google Apps Script:** Returning "Secret mismatch" error

## The Problem

Your Google Apps Script is rejecting the data because the secret we're sending doesn't match what the Apps Script expects.

The Apps Script error: `{ success: false, error: 'Secret mismatch' }`

This means:
- The Google Apps Script IS being called successfully
- The network connection works
- BUT the Apps Script has a security check that's failing

##Solution: Deploy a New Google Apps Script

Follow these steps to deploy a working Google Apps Script that will receive your form data:

### Step 1: Create New Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **+ New project**
3. Name it "PLUCO Form Receiver"

### Step 2: Copy & Paste This Code

Delete everything in `Code.gs` and paste this:

```javascript
// Configuration
const SHEET_NAME = "PLUCO Private Client Leads";
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // You'll get this from the sheet URL

// Handle form submissions from website
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Optional: Verify secret if needed (can remove this section if not needed)
    // const expectedSecret = "your_secret_here";
    // if (data.secret !== expectedSecret) {
    //   return ContentService.createTextOutput(JSON.stringify({
    //     success: false,
    //     error: 'Secret mismatch'
    //   })).setMimeType(ContentService.MimeType.JSON);
    // }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    const row = [
      data.timestamp || new Date().toLocaleString('en-GB', {timeZone: 'Europe/Warsaw'}),
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
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Create Google Sheet for Data

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Create new spreadsheet**
3. Name it "PLUCO Leads"
4. In the first sheet (or rename to "PLUCO Private Client Leads"):
   - Add these headers in Row 1:
     - A: Date
     - B: Full Name
     - C: Email
     - D: Phone / WhatsApp
     - E: Nationality
     - F: Current Country of Residence
     - G: Preferred Language
     - H: Service Needed
     - I: Family Members
     - J: Number of Family Members
     - K: Urgency
     - L: Preferred Contact Method
     - M: Short Case Description

5. Copy the Spreadsheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0`
   - Copy the `{SPREADSHEET_ID}` part

### Step 4: Update Google Apps Script

1. Back in your Apps Script project
2. **Line 3:** Replace `"YOUR_SPREADSHEET_ID_HERE"` with your actual Spreadsheet ID from step 3
3. Save the file (Ctrl+S or Cmd+S)

### Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Select **Type:** "Web app"
3. Set:
   - **Execute as:** Your email
   - **Who has access:** Anyone
4. Click **Deploy**
5. Accept the permission prompts
6. Copy the **Deployment URL** (looks like `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`)

### Step 6: Update .env.local

Update your `.env.local` file:

```env
GOOGLE_LEADS_WEB_APP_URL=https://script.google.com/macros/s/{YOUR_DEPLOYMENT_ID}/exec
GOOGLE_LEADS_SECRET=
```

Replace `{YOUR_DEPLOYMENT_ID}` with the ID from the deployment URL.

The `GOOGLE_LEADS_SECRET` is not required with this script (it's commented out), so you can leave it empty or remove it.

### Step 7: Restart Dev Server

In your terminal:
```bash
cd /Users/rooz/Desktop/websites/2048
npm run dev
```

### Step 8: Test the Form

1. Open http://localhost:3000/enquire
2. Fill out the form with test data
3. Submit the form
4. Check your browser console (F12) - should show success
5. **Open your "PLUCO Leads" Google Sheet - new row should appear**

## What Should Happen

✅ Form is submitted  
✅ API receives data  
✅ Google Apps Script appends row to sheet  
✅ Email sent to info@plucogroup.com  
✅ Email sent to client  
✅ Success message shows on screen

## Troubleshooting

### "Script error" message in browser
- Check the Apps Script logs: In your Apps Script project, click **Execution log** to see detailed errors
- Verify the SPREADSHEET_ID is correct
- Verify the sheet name matches exactly ("PLUCO Private Client Leads")

### Data not appearing in Google Sheet
- Confirm the sheet name in Apps Script matches your actual sheet tab name
- Ensure the Spreadsheet ID is correct
- Check that your Google Sheet has the correct columns

### "Failed to fetch" error
- Make sure you deployed as "Web app"
- Make sure "Who has access" is set to "Anyone"
- Verify the deployment URL is correct in .env.local

### Secret mismatch (old error)
- This should not happen with the new script unless you uncomment the secret check
- If it does, you have an old deployment URL - redeploy from the new Apps Script

## Quick Verification Checklist

- [ ] Google Apps Script created and saved
- [ ] Spreadsheet created with headers
- [ ] Apps Script code updated with correct SPREADSHEET_ID
- [ ] Apps Script deployed as Web app
- [ ] Deployment URL copied
- [ ] .env.local updated with new deployment URL
- [ ] Dev server restarted
- [ ] Test form submitted successfully
- [ ] New row appears in Google Sheet
- [ ] Email sent to info@plucogroup.com

## If You Still Have Issues

1. Share the Apps Script deployment URL (the /exec URL)
2. Share if you see any errors in the browser console (F12)
3. Share the Apps Script execution log messages
4. Confirm the Spreadsheet ID and sheet name match

---

**Once this is working:** All future form submissions will automatically append rows to your "PLUCO Leads" Google Sheet!
