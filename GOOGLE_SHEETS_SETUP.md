# Google Sheets Integration Setup Guide

This document explains how to configure the PLUCO GROUP website to send enquiry form submissions to Google Sheets and email notifications via Resend.

## Overview

The enquiry form (`/enquire`) now integrates with:
- **Google Sheets API** - Stores form submissions in "PLUCO Private Client Leads" spreadsheet
- **Resend Email Service** - Sends confirmation emails to clients and notifications to info@plucogroup.com

## Step 1: Create Google Cloud Project

### 1.1 Create a new project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "PLUCO GROUP Website"
4. Click "Create"

### 1.2 Enable APIs
1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click it and press "Enable"

## Step 2: Create Service Account

### 2.1 Create the service account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `pluco-website`
   - Service account ID: (auto-generated)
   - Click "Create and Continue"
4. Skip optional steps, click "Done"

### 2.2 Create and download key
1. In the service accounts list, click on the `pluco-website` account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON"
5. Click "Create" - this downloads a JSON file

**IMPORTANT:** Keep this JSON file safe - it contains sensitive credentials.

### 2.3 Extract credentials from JSON
Open the downloaded JSON file and locate these values:
- `project_id` → `GOOGLE_PROJECT_ID`
- `private_key_id` → `GOOGLE_PRIVATE_KEY_ID`
- `private_key` → `GOOGLE_PRIVATE_KEY` (keep the literal `\n` in the string)
- `client_email` → `GOOGLE_CLIENT_EMAIL`
- `client_id` → `GOOGLE_CLIENT_ID`

## Step 3: Create Google Sheet

### 3.1 Create the spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank spreadsheet"
3. Name it "PLUCO Private Client Leads"

### 3.2 Set up headers
In Row 1, add these column headers (A through M):
- A: Date
- B: Full Name
- C: Email
- D: Phone / WhatsApp
- E: Nationality
- F: Current Country of Residence
- G: Preferred Language
- H: Service Needed
- I: Family Members Included
- J: Number of Family Members
- K: Urgency
- L: Preferred Contact Method
- M: Short Case Description

### 3.3 Get the Sheet ID
1. Open the spreadsheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. This is your `GOOGLE_SHEETS_ID`

### 3.4 Share with service account
1. In the spreadsheet, click "Share"
2. Paste the service account email (the `GOOGLE_CLIENT_EMAIL` from the JSON)
3. Give it "Editor" access
4. Click "Share"

## Step 4: Configure Resend (Email Service)

### 4.1 Get Resend API Key
1. Go to [Resend Console](https://resend.com/api-keys)
2. Create a new API key (or use existing)
3. Copy the key → `RESEND_API_KEY`

### 4.2 Verify sender email
1. In Resend dashboard, go to "Domains"
2. Add your domain (or use a default Resend domain)
3. Verify the sender email will be used in `RESEND_FROM`

## Step 5: Update Environment Variables

### 5.1 Create .env.local
In the project root (`/Users/rooz/Desktop/websites/2048/.env.local`):

```env
# Google Sheets Configuration
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBA...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=pluco-website@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_SHEETS_ID=your_spreadsheet_id

# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=PLUCO GROUP <noreply@plucogroup.com>
```

**Important:** 
- The `GOOGLE_PRIVATE_KEY` must keep the `\n` characters literal in the string
- Wrap the entire key value in quotes
- Don't commit `.env.local` to version control

### 5.2 Verify variables are set
```bash
echo $GOOGLE_SHEETS_ID
echo $RESEND_API_KEY
```

## Step 6: Test the Integration

### 6.1 Start the development server
```bash
cd /Users/rooz/Desktop/websites/2048
npm run dev
```

### 6.2 Test the form
1. Navigate to `http://localhost:3000/enquire`
2. Fill in all required fields
3. Check the consent checkbox
4. Click "Send Enquiry"

### 6.3 Verify submission
1. Check the Google Sheet - new row should appear within seconds
2. Check info@plucogroup.com inbox - notification email should arrive
3. Check sender's email - confirmation email should arrive

## Troubleshooting

### "Failed to submit enquiry" error
- Check browser console (F12) for detailed error
- Verify all environment variables are set: `npm run dev` logs them on startup
- Check that service account has Editor access to the Google Sheet

### Email not received
- Check spam/junk folder
- Verify `RESEND_API_KEY` is valid in Resend dashboard
- Confirm sender email is verified in Resend

### Google Sheets not updated
- Verify `GOOGLE_SHEETS_ID` is correct
- Confirm service account email is shared in the spreadsheet
- Check that column headers match exactly (case-sensitive)

### "private_key" error
- Ensure `GOOGLE_PRIVATE_KEY` includes literal `\n` characters (not actual newlines)
- Key should be wrapped in quotes in .env.local
- Check for copy/paste errors in the JSON

## API Endpoint Details

**Endpoint:** `POST /api/enquiry`

**Request body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+48...",
  "nationality": "UK",
  "country": "Poland",
  "familyMembers": "Yes",
  "numFamilyMembers": "3",
  "service": "EU Residency",
  "language": "English",
  "description": "Looking for residency options",
  "urgency": "Urgent",
  "preferredContact": "Email"
}
```

**Response:**
```json
{
  "success": true
}
```

## Form Flow

1. User fills enquiry form at `/enquire`
2. Clicks "Send Enquiry" button
3. Form data sent to `/api/enquiry` endpoint
4. API appends data to Google Sheet
5. API sends confirmation email to client
6. API sends notification email to info@plucogroup.com
7. User sees thank-you message on screen
8. Email confirmation arrives in client's inbox

## Security Notes

- Never commit `.env.local` to Git
- Service account credentials should be treated as sensitive
- The API endpoint has no authentication - only accessible from the website frontend
- Consider rate-limiting in production
- All form data is sent over HTTPS in production

## Production Deployment

When deploying to production (Vercel, etc.):
1. Set environment variables in the hosting provider's settings
2. Do NOT commit `.env.local`
3. Use the same Google Sheet ID (or create a production Google Sheet)
4. Use production Resend API key
5. Update `RESEND_FROM` domain if needed
