# Quick Testing Guide - Google Apps Script Integration

## Prerequisites
- Development server running: `npm run dev`
- `.env.local` configured with your credentials
- Google Apps Script deployed as web app
- Browser console access (F12)

## Test Scenario 1: Successful Form Submission

### Steps
1. Open http://localhost:3000/contact
2. Fill the form:
   - First Name: `John`
   - Last Name: `Smith`
   - Email: `john@example.com`
   - Phone: `+48123456789`
   - Company: `Test Corp`
   - Service of Interest: `International Contracts`
   - Message: `This is a test submission`
3. Click "Send Message"

### Expected Results
✅ Button shows "Sending..." (1-2 seconds)
✅ Success message appears: "Your enquiry has been received. Our private client team will contact you shortly."
✅ New row in "Leads CRM" Google Sheet with:
   - Full Name: John Smith
   - Email: john@example.com
   - Phone: +48123456789
   - Service: International Contracts
   - Message: This is a test submission

### Browser Console
- No errors
- POST request to `/api/leads` should show `200` status
- Response: `{ success: true }`

---

## Test Scenario 2: Missing Required Field

### Steps
1. Open http://localhost:3000/contact
2. Fill only:
   - First Name: `Jane`
   - Email: `jane@example.com`
   - Leave "Service of Interest" empty
3. Click "Send Message"

### Expected Results
✅ Error message appears: "Something went wrong. Please try again or contact us directly."
✅ Button remains clickable for retry
✅ No row added to Google Sheet

### Browser Console
- Check for error message about missing serviceNeeded field
- POST request shows `400` status (Bad Request)

---

## Test Scenario 3: Invalid Email

### Steps
1. Open http://localhost:3000/contact
2. Fill the form:
   - First Name: `Bob`
   - Last Name: `Jones`
   - Email: `invalid-email` (no @ or domain)
   - Service of Interest: `Banking Compliance`
   - Message: `Testing invalid email`
3. Click "Send Message"

### Expected Results
✅ Error message appears
✅ No row added to Google Sheet
✅ Browser console shows validation error

---

## Test Scenario 4: Multiple Submissions

### Steps
1. Submit first form (see Test Scenario 1)
2. After success message, click "Send another message"
3. Form clears and is ready for new submission
4. Submit again with different data

### Expected Results
✅ Both submissions appear in Google Sheet
✅ Each has unique timestamp and data
✅ Form resets properly between submissions

---

## Test Scenario 5: Network Error Handling

### Steps (Requires browser dev tools)
1. Open http://localhost:3000/contact
2. Open DevTools (F12) → Network tab
3. Set network throttling to "Offline"
4. Fill and submit form
5. Restore network connection

### Expected Results
✅ Error message displays immediately
✅ Button remains clickable
✅ User can retry after network is restored

---

## Browser Console Checks

### When submitting successfully
Open DevTools (F12) → Console tab and look for:
```
Form submission successful (or similar success message)
```

### Check network request
1. Open DevTools (F12) → Network tab
2. Submit form
3. Look for request to `/api/leads`
4. Should show:
   - Method: POST
   - Status: 200
   - Response: `{"success":true}`

### Check for errors
If you see any errors, check:
- Is `.env.local` configured?
- Did you restart dev server after adding `.env.local`?
- Are environment variables visible in dev server startup?

---

## Google Sheet Verification

### Check if data was saved
1. Open your "Leads CRM" Google Sheet
2. Look for new rows at the bottom
3. Each row should have:
   - Date/Time
   - Full Name
   - Email
   - Phone
   - Country
   - Service
   - Message
   - Other fields

### Timestamps
- Submissions should have current timestamp
- Multiple submissions should have different times

---

## Common Issues During Testing

### "Missing required fields" error
**Check:**
- Did you fill First Name? ✓
- Did you fill Last Name? ✓
- Did you fill Email? ✓
- Is Email valid format? (john@example.com) ✓
- Did you select a Service? ✓

### Data not appearing in Google Sheet
**Check:**
1. Did you see success message?
2. Is Google Apps Script still deployed?
3. Is the sheet name exactly "Leads CRM"?
4. Check Google Apps Script execution logs

### ".env.local is not found" or env vars undefined
**Solution:**
1. Created `.env.local` in project root?
2. Restarted dev server after adding file?
3. Check file is in: `/Users/rooz/Desktop/websites/2048/.env.local`

### "Something went wrong" without more details
**Debug steps:**
1. Open browser console (F12)
2. Check for errors
3. Check Network tab for response details
4. Look at dev server output for server errors
5. Verify Google Apps Script URL is accessible

---

## Performance Expectations

- Form submission: 1-3 seconds (depends on Google Apps Script response)
- Success message appears: immediately after API responds
- Data in Google Sheet: within 1 second of success message
- Button state change: immediate (Sending... → Send Message)

---

## Test Completion Checklist

- [ ] Form displays and is accessible
- [ ] All form fields work (input, textarea, select)
- [ ] Form submits successfully
- [ ] Success message shows correct text
- [ ] Data appears in Google Sheet
- [ ] Data format is correct
- [ ] Error handling works
- [ ] Button shows loading state
- [ ] Can submit multiple times
- [ ] No console errors
- [ ] Mobile responsive works (optional)

---

## After Successful Testing

1. Note down any issues found
2. All data should be appearing in Google Sheet
3. You're ready to deploy to production
4. Configure env vars in your hosting platform

---

**Testing Status:** Ready for local testing
