# Google Apps Script Integration - Implementation Guide

## Overview

Your PLUCO GROUP website contact form is now securely connected to your Google Apps Script Web App that saves leads to the "Leads CRM" Google Sheet. All secrets remain server-side only.

## Files Modified

### 1. Created: `/src/app/api/leads/route.ts`
**Purpose:** Secure server-side API endpoint that:
- Validates form data (required fields: fullName, email, serviceNeeded)
- Validates email format
- Sends data to Google Apps Script Web App (server-side only)
- Passes your secret key securely
- Returns success/error responses

**Key Features:**
- ✅ All environment variables are server-side only
- ✅ Google Apps Script URL never exposed to frontend
- ✅ Secret key never sent to client
- ✅ TypeScript for type safety
- ✅ Comprehensive error handling
- ✅ Email validation

### 2. Updated: `/src/app/contact/page.tsx`
**Changes:**
- Removed `mailto:` functionality
- Added async form submission to `/api/leads` endpoint
- Added `isLoading` state for submission status
- Added `error` state for error messages
- Updated success message to: "Your enquiry has been received. Our private client team will contact you shortly."
- Updated error message to: "Something went wrong. Please try again or contact us directly."
- Added error display with animations
- Updated button to show "Sending..." while submitting
- All styling and design preserved

**Form Field Mapping:**
```
firstName + lastName → fullName
email               → email
phone              → phone
company            → currentCountry
service            → serviceNeeded
message            → shortCaseDescription
"English"          → preferredLanguage
```

### 3. Updated: `.env.example`
**Added:**
```env
# Google Apps Script Web App (for Leads CRM)
GOOGLE_LEADS_WEB_APP_URL=PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
GOOGLE_LEADS_SECRET=PASTE_YOUR_SECRET_KEY_HERE
```

## Setup Instructions

### Step 1: Get Your Google Apps Script URLs

1. Open your Google Apps Script project
2. Click "Deploy" → "New deployment"
3. Select type: "Web app"
4. Execute as: Your account
5. Allow access to: Anyone
6. Copy the deployment URL

### Step 2: Configure Environment Variables

1. In your project root, create or update `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add:
```env
GOOGLE_LEADS_WEB_APP_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
GOOGLE_LEADS_SECRET=your_secret_key_from_gas
```

Replace:
- `{DEPLOYMENT_ID}` with your Google Apps Script deployment ID
- `your_secret_key_from_gas` with your secret key

**⚠️ IMPORTANT:** Never commit `.env.local` to Git

### Step 3: Test Locally

1. Start development server:
```bash
npm run dev
```

2. Open http://localhost:3000/contact

3. Fill the form with test data:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +48123456789
   - Company: Acme Corp
   - Service: International Contracts
   - Message: Test message

4. Click "Send Message"

### Expected Behavior

✅ **Success Flow:**
1. Button shows "Sending..."
2. Button is disabled while sending
3. After 1-2 seconds, success message appears: "Your enquiry has been received. Our private client team will contact you shortly."
4. A new row is added to your "Leads CRM" Google Sheet
5. Data includes: fullName, email, phone, currentCountry, serviceNeeded, etc.

❌ **Error Flow:**
1. If submission fails, error appears below the message field
2. Error text: "Something went wrong. Please try again or contact us directly."
3. User can retry the submission
4. Button text returns to "Send Message"

## How It Works (Security)

### Frontend (Client-Side)
1. User fills form and clicks "Send Message"
2. Form data sent to `/api/leads` (your website's API)
3. No Google Apps Script URL or secret visible to user
4. User only sees: success message or error message

### Backend (Server-Side)
1. `/api/leads` receives form data
2. Validates all required fields
3. Creates payload with secret key
4. Sends to Google Apps Script Web App URL
5. Google Apps Script processes and saves to "Leads CRM" sheet
6. Returns success/error to frontend

### Data Flow
```
User Form
    ↓
POST /api/leads (on your website)
    ↓
Validate data
    ↓
Fetch Google Apps Script URL (with secret)
    ↓
Google Apps Script
    ↓
Save to "Leads CRM" Sheet
    ↓
Return success
    ↓
Display thank you message
```

## API Endpoint Reference

**Endpoint:** `POST /api/leads`

**Request Payload:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+48123456789",
  "currentCountry": "Poland",
  "preferredLanguage": "English",
  "serviceNeeded": "International Contracts",
  "urgency": "",
  "familyMembers": "",
  "numberOfFamilyMembers": "",
  "preferredContactMethod": "",
  "shortCaseDescription": "Test message"
}
```

**Success Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Missing required fields: fullName, email, serviceNeeded"
}
```

## Validation Rules

### Required Fields
- `fullName` - Cannot be empty
- `email` - Must be valid email format (example@domain.com)
- `serviceNeeded` - Cannot be empty

### Optional Fields
- `phone` - Can be empty
- `currentCountry` - Can be empty
- All other fields optional

## Troubleshooting

### Issue: "Missing required fields" error
**Solution:** Ensure you filled in:
- First Name and Last Name (combines to fullName)
- Email Address (valid format)
- Service of Interest

### Issue: "An error occurred" message
**Possible causes:**
1. Environment variables not set correctly
   - Check `.env.local` has both variables
   - Restart dev server after changing .env.local
   
2. Google Apps Script URL is invalid
   - Verify the full URL is copied correctly
   - No extra spaces or characters
   
3. Google Apps Script is not deployed as web app
   - Deploy it again as "Web app"
   - Execute as your account
   - Allow access to "Anyone"

4. Secret key is incorrect
   - Double-check secret key matches your Google Apps Script
   - No extra spaces

### Issue: Data not appearing in Google Sheet
**Solution:**
1. Check Google Apps Script logs in your Apps Script project
2. Verify the sheet name is exactly "Leads CRM"
3. Check that your Google Apps Script is handling the data correctly
4. Verify the POST payload structure matches your expectation

## Environment Variables

### Development (.env.local)
```env
GOOGLE_LEADS_WEB_APP_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb
GOOGLE_LEADS_SECRET=your_secret_key_here
```

### Production (Vercel/Hosting Platform)
Add the same variables in your hosting provider's environment variables section:
1. Navigate to Project Settings → Environment Variables
2. Add both variables
3. Deploy

**Never commit `.env.local` to Git!**

## Testing Checklist

- [ ] `.env.local` created with your credentials
- [ ] Development server running (`npm run dev`)
- [ ] Contact form accessible at http://localhost:3000/contact
- [ ] Form submission successful
- [ ] Data appeared in "Leads CRM" Google Sheet
- [ ] No errors in browser console
- [ ] Success message displays correctly
- [ ] Error handling works (try invalid email)
- [ ] Button shows "Sending..." during submission
- [ ] Can submit multiple times

## Security Notes

✅ **What's Protected:**
- Google Apps Script URL (server-side only)
- Secret key (server-side only)
- No credentials exposed in frontend code
- No credentials in network requests

✅ **Best Practices:**
- Environment variables only
- Never commit `.env.local`
- Different keys for dev/production
- HTTPS enforced in production
- No data logging of credentials

## File Summary

**Created:**
- ✅ `/src/app/api/leads/route.ts` (API endpoint)

**Modified:**
- ✅ `/src/app/contact/page.tsx` (form submission)
- ✅ `.env.example` (environment variables)

**Not Changed:**
- ✓ Page styling and design
- ✓ All other pages and components
- ✓ Global styles and configuration

## Next Steps

1. **Immediate:** Add environment variables to `.env.local`
2. **Test:** Run local tests using the testing checklist
3. **Deploy:** Set environment variables in your hosting platform
4. **Monitor:** Check Google Sheet for incoming leads

## Support

If you encounter issues:
1. Check the Troubleshooting section
2. Verify environment variables are correctly set
3. Check browser console for error messages (F12)
4. Check server logs for API errors
5. Verify Google Apps Script is deployed correctly

---

**Integration Status:** ✅ Complete and Ready for Testing
