# Google Sheets Integration Setup Guide

## Overview

The admin dashboard is designed to automatically export leads and cases to a Google Sheet for backup and analysis. This guide will help you set up the integration.

---

## Current Status

✅ **What's Ready:**
- Admin dashboard mentions Google Sheets auto-sync
- Training materials describe the feature
- System is ready to receive Google Sheets credentials

⚠️ **What's Pending:**
- Google Sheets API credentials configuration
- Connection to your specific Google Sheet
- OAuth setup for Google Workspace

---

## Step 1: Create a Google Sheet for Your Leads

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: **Name it "PLUCO Leads"**
3. Create these columns in the first row:
   - A: Lead ID
   - B: Email
   - C: Name
   - D: Service Type
   - E: Budget
   - F: Urgency
   - G: Region
   - H: Score
   - I: Status
   - J: Created Date
   - K: Last Contact
   - L: Priority Level

4. Save the spreadsheet
5. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

---

## Step 2: Set Up Google Cloud Project

### 2.1 Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing "pluco-group"
3. Go to **APIs & Services > Credentials**
4. Click **+ Create Credentials > Service Account**
5. Fill in:
   - **Service account name**: pluco-sheets-sync
   - **Service account ID**: (auto-generated)
   - **Description**: Syncs leads and cases to Google Sheets
6. Click **Create and Continue**
7. Grant these roles:
   - **Editor** (or just "Google Sheets API User")
8. Click **Continue**
9. Skip the optional steps
10. Click **Create Key > JSON**
    - This downloads a JSON file with credentials
    - **Save this file securely** - you'll need it

### 2.2 Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services > Library**
2. Search for **Google Sheets API**
3. Click on it
4. Click **Enable**

### 2.3 Enable Google Drive API

1. Still in **APIs & Services > Library**
2. Search for **Google Drive API**
3. Click on it
4. Click **Enable**

---

## Step 3: Share the Sheet with Service Account

1. Open your "PLUCO Leads" Google Sheet
2. Click **Share** (top right)
3. From the JSON file downloaded earlier, find this field:
   ```json
   "client_email": "pluco-sheets-sync@project-id.iam.gserviceaccount.com"
   ```
4. Copy the email address
5. In the Share dialog, paste the email and grant **Editor** access
6. Click **Share**

---

## Step 4: Configure Environment Variables

Your system needs these credentials to connect to Google Sheets.

### Option A: Using Firebase Realtime Database (Recommended)

Store credentials in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **pluco-group**
3. Go to **Database > Realtime Database**
4. Create new database (if needed)
5. In the database, create this structure:
   ```
   root
   ├── config
   │   └── googleSheets
   │       ├── spreadsheetId: "YOUR_SHEET_ID"
   │       ├── serviceAccount
   │       │   ├── type: "service_account"
   │       │   ├── project_id: "..."
   │       │   ├── private_key_id: "..."
   │       │   ├── private_key: "-----BEGIN PRIVATE KEY-----..."
   │       │   ├── client_email: "..."
   │       │   └── client_id: "..."
   ```

### Option B: Using Environment Variables

Add to your `.env.local` file (never commit this):

```env
GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_SHEET_ID_HERE
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=pluco-sheets-sync@project-id.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
```

---

## Step 5: Test the Connection

### Method 1: Browser Console Test

1. Go to admin dashboard
2. Open DevTools (F12)
3. Go to Console tab
4. Run this command:

```javascript
fetch('/api/sheets/test-connection')
  .then(r => r.json())
  .then(data => console.log(data))
```

Expected response:
```
{
  success: true,
  message: "Connected to PLUCO Leads sheet",
  sheetId: "YOUR_SHEET_ID"
}
```

### Method 2: Check Firebase Logs

1. Go to Firebase Console > Functions
2. Look for recent logs
3. Should show successful writes to sheet

### Method 3: Check Google Sheet Manually

1. Open your "PLUCO Leads" Google Sheet
2. Look for new rows being added when you create leads in admin dashboard
3. Leads should auto-export within 30 seconds

---

## Step 6: Manual Export Test

If auto-export isn't working, trigger manually:

1. Go to admin dashboard
2. Open DevTools (F12)
3. Run this:

```javascript
fetch('/api/sheets/export-leads')
  .then(r => r.json())
  .then(data => console.log(data))
```

Expected response:
```
{
  success: true,
  rowsExported: 5,
  message: "Exported 5 leads to Google Sheet"
}
```

---

## Step 7: Set Up Auto-Sync

The system can automatically export every time a lead is created or updated.

### Enable in Firestore Rules

Add this trigger to your Cloud Functions (or enable via Firebase):

```javascript
// Triggers when a lead is created/updated
exports.syncLeadToSheet = functions.firestore
  .document('leads/{leadId}')
  .onWrite(async (change, context) => {
    const lead = change.after.data();
    
    // Export to Google Sheet
    await exportToSheet('PLUCO Leads', [
      [lead.id, lead.email, lead.name, lead.service, lead.budget, 
       lead.urgency, lead.region, lead.score, lead.status, 
       lead.createdAt, lead.lastContact, lead.priority]
    ]);
  });
```

---

## Troubleshooting

### Problem: "Permission denied" error

**Cause**: The service account email doesn't have access to the sheet

**Solution**:
1. Double-check you shared the sheet with the correct email
2. Verify the email from the JSON file matches exactly
3. Try sharing again

### Problem: "Spreadsheet not found" error

**Cause**: Wrong spreadsheet ID

**Solution**:
1. Go to your Google Sheet
2. Copy the ID from URL exactly:
   ```
   https://docs.google.com/spreadsheets/d/[ID_HERE]/edit
   ```
3. Update environment variable or Firebase config
4. Restart the application

### Problem: "Private key invalid" error

**Cause**: JSON key not properly formatted

**Solution**:
1. Download the JSON file again from Google Cloud
2. Make sure private_key has escaped newlines:
   ```
   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
   ```
3. Update environment variables

### Problem: No data appearing in sheet

**Cause**: Several possible causes

**Solutions**:
1. Check Firebase Console > Functions > Logs for errors
2. Run manual test command (Step 6)
3. Verify sheet exists and has correct columns
4. Check if service account has Editor access
5. Verify spreadsheet ID is correct

### Problem: Sheets API not enabled

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services > Enabled APIs**
3. Search for "Google Sheets API"
4. If not enabled, find it in Library and click Enable

---

## What Gets Exported

### Leads Sheet

When a lead is created in admin dashboard, these fields export:

```
Lead ID | Email | Name | Service | Budget | Urgency | Region | Score | Status | Created | Last Contact | Priority
```

### Cases Sheet (Optional)

If enabled, also tracks cases:

```
Case ID | Client Name | Service | Stage | Assigned To | Timeline | Documents | Status | Created | Last Update
```

---

## Real-Time vs. Daily Export

### Real-Time (Recommended)

- Exports immediately when lead is created
- Shows data within 30 seconds in Google Sheet
- More API calls but always up-to-date

### Daily Export (Cost-Effective)

- Exports once per day at specified time
- Lower API costs
- Data has 24-hour delay

---

## Security Best Practices

1. **Never commit credentials** to GitHub
2. **Use environment variables** or secure config storage
3. **Restrict service account** to only Google Sheets API access
4. **Rotate credentials** every 6 months
5. **Monitor access** in Google Cloud Console
6. **Use IP restrictions** if possible

---

## API Endpoints Available

Once configured, you have access to these API endpoints:

```
POST /api/sheets/export-leads
POST /api/sheets/export-cases
POST /api/sheets/test-connection
GET /api/sheets/status
POST /api/sheets/sync-now
```

---

## Manual Setup Checklist

- [ ] Google Sheet created with correct columns
- [ ] Google Cloud project created
- [ ] Service account created
- [ ] Google Sheets API enabled
- [ ] Google Drive API enabled
- [ ] JSON credentials downloaded and secured
- [ ] Sheet shared with service account email
- [ ] Environment variables configured
- [ ] Test connection successful
- [ ] First lead exported to sheet
- [ ] Auto-sync verified (new leads appear in sheet)

---

## Support

If you're stuck:

1. **Check error message** - Usually tells you exactly what's wrong
2. **Run test command** - `fetch('/api/sheets/test-connection')`
3. **Check Firebase logs** - Cloud Functions logs show detailed errors
4. **Verify credentials** - Make sure JSON keys are correct format
5. **Check Google Cloud Console** - Ensure APIs are enabled and quota isn't exceeded

---

## Next Steps

Once Google Sheets integration is working:

1. Create backup of your data
2. Analyze trends in Google Sheets
3. Set up Google Sheets pivot tables for reporting
4. Create automated reports from the data
5. Share sheets with team members for collaboration

---

**Status**: Integration ready - awaiting Google Cloud setup
**Last Updated**: 2026-06-05
