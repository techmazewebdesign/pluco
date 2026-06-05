# Final Test Checklist

## Pre-Testing Setup

### Environment Configuration
- [ ] Verify `.env.local` has all required variables:
  ```
  RESEND_API_KEY=re_xxxxx
  NEXT_PUBLIC_APP_URL=http://localhost:3000 (for local)
  NEXT_PUBLIC_ADMIN_EMAIL=your-email@company.com
  CRON_SECRET=your-secure-secret
  ```
- [ ] Deploy `firestore.rules` to Firestore
- [ ] Test Resend API key is valid (send test email)

### Test Data Setup
- [ ] Create test admin account
- [ ] Create test consultant account with complete profile
- [ ] Create test user/client account
- [ ] Ensure consultant has all profile fields filled (name, email, phone, linkedin, photo, bio, specializations)

---

## ADMIN TEST SUITE

### Test 1: View Consultant Activities Dashboard
**Path:** `/admin/dashboard/consultant-activities`

- [ ] Page loads without errors
- [ ] See list of activities (if any exist)
- [ ] Filter by date range (7 days, 30 days, all)
- [ ] Filter by consultant (dropdown shows consultants)
- [ ] Filter by action type (all types appear: meeting_sent, cancelled, etc.)
- [ ] Clear filters button works
- [ ] Export CSV downloads file with proper format
- [ ] Stats box shows:
  - [ ] Total Activities count
  - [ ] Active Consultants count
  - [ ] Meetings Sent count
  - [ ] Cancellations count

### Test 2: Admin Receives Booking Notifications
**Trigger:** Client books consultation with consultant

- [ ] Email sent to admin email (if configured to receive)
  - [ ] Email contains booking details
  - [ ] Email has professional formatting
  - [ ] Link to booking details works
- [ ] Check activity log:
  - [ ] Action "booking_request" logged
  - [ ] Timestamp correct
  - [ ] Consultant name/email correct
  - [ ] Client name/email correct

### Test 3: Weekly Consultant Report
**Manual Trigger:** Call API endpoint

```bash
curl -X POST http://localhost:3000/api/reports/weekly-consultant-report \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

- [ ] API returns 200 status
- [ ] Response includes summaries array
- [ ] Check email inbox (NEXT_PUBLIC_ADMIN_EMAIL):
  - [ ] Email received with subject "Weekly Consultant Activity Report"
  - [ ] Email contains table with consultant stats
  - [ ] Table shows: Meetings Created, Meetings Sent, Cancellations, Reschedules, Profile Updates
  - [ ] Summary stats correct
  - [ ] Dashboard link in email works

### Test 4: View Consultant Details in Admin
**Path:** `/admin/dashboard/consultants`

- [ ] See all consultants listed
- [ ] Consultant profile setup status shown
- [ ] profileComplete flag visible (true/false)
- [ ] Can see all profile fields

---

## CONSULTANT TEST SUITE

### Test 1: Profile Setup Redirect
**Setup:** Create new consultant, logout, login as consultant

**Path:** `/consultant/dashboard`

- [ ] If profileComplete is false:
  - [ ] Automatically redirected to `/consultant/profile-setup` ✅
  - [ ] Cannot bypass with back button
- [ ] If profileComplete is true:
  - [ ] Dashboard loads normally ✅

### Test 2: Complete Profile Setup
**Path:** `/consultant/profile-setup`

- [ ] Step 1 - Personal Info:
  - [ ] Upload photo works
  - [ ] Photo preview shows
  - [ ] Full name input works
  - [ ] Personal email input works (different from account email)
  - [ ] Phone number input works
  - [ ] "Next" button enabled only when all filled
- [ ] Step 2 - Professional Details:
  - [ ] Years of experience input works
  - [ ] LinkedIn URL input works (with validation)
  - [ ] Certifications text area works
  - [ ] "Next" button transitions to step 3
- [ ] Step 3 - Specializations:
  - [ ] Multi-select for product types works (can select multiple)
  - [ ] All 8 product types displayed:
    - [ ] EU Residency
    - [ ] EU Property
    - [ ] US Green Card
    - [ ] Banking
    - [ ] Dispute Resolution
    - [ ] Contracts
    - [ ] Business
    - [ ] Company Registration
  - [ ] Professional bio textarea works
  - [ ] "Complete Setup" button saves data
  - [ ] Data persists in Firestore under `agents/{email}`
  - [ ] profileComplete flag set to true

### Test 3: Dashboard With Notifications
**Path:** `/consultant/dashboard`

- [ ] Dashboard loads after profile complete
- [ ] Notifications bell icon visible (top right)
- [ ] If unread notifications:
  - [ ] Badge shows count (red circle with number)
  - [ ] Clicking bell goes to `/consultant/dashboard/notifications`
- [ ] If no notifications:
  - [ ] Badge not visible

### Test 4: Manage Bookings
**Path:** `/consultant/dashboard/bookings`

**Prerequisite:** Have at least one booking for this consultant

- [ ] Page loads with list of bookings
- [ ] Filter by status works:
  - [ ] All (shows all)
  - [ ] Pending (shows only pending)
  - [ ] Confirmed (shows only confirmed)
  - [ ] Completed (shows only completed)
- [ ] For each booking card:
  - [ ] Title, client name, date, time, duration visible
  - [ ] Status badge with correct color
  - [ ] Click to expand shows:
    - [ ] Client name and email
    - [ ] Full description
    - [ ] If meetingLink exists: Google Meet link with copy button
    - [ ] If no meetingLink: "Create & Send Google Meet Link" button

### Test 5: Create & Send Google Meet Link
**Path:** `/consultant/dashboard/bookings` → Expand booking → Create Meet Link

**Current Status:** ⚠️ GENERATES URL BUT REQUIRES DECISION (see Technical Report)

- [ ] Click "Create & Send Google Meet Link"
- [ ] Button shows loading state
- [ ] After completion:
  - [ ] Link stored in Firestore under booking.meetingLink
  - [ ] Email sent to client with meet link
  - [ ] Activity logged with action_type "meeting_sent"
  - [ ] Success notification shown
- [ ] Copy button copies link to clipboard
- [ ] Link format: `https://meet.google.com/{random}`
  - ⚠️ **Note:** These links are NOT fully functional without Google API setup

### Test 6: Cancel Booking
**Path:** `/consultant/dashboard/bookings` → Expand booking → Cancel Booking

- [ ] Click "Cancel Booking" button
- [ ] Reason textarea appears
- [ ] "Confirm Cancel" button only enabled with reason
- [ ] After confirmation:
  - [ ] Booking status changed to "cancelled" in Firestore
  - [ ] Activity logged with action_type "meeting_cancelled"
  - [ ] Client receives email notification:
    - [ ] Subject: "Consultation Cancelled"
    - [ ] Includes reason
    - [ ] Professional format
  - [ ] In-app notification created for client
  - [ ] Success notification shown to consultant

### Test 7: View Notifications
**Path:** `/consultant/dashboard/notifications`

- [ ] Page loads
- [ ] All notifications listed
- [ ] Filter by "Unread" shows only unread
- [ ] For each notification:
  - [ ] Title, message, timestamp visible
  - [ ] Unread notifications have blue dot indicator
  - [ ] Click "Mark as read" marks it read (dot disappears)
  - [ ] Click "View Details" goes to related booking
  - [ ] Click "Delete" removes notification
- [ ] Stats show correct unread count

---

## CLIENT/USER TEST SUITE

### Test 1: Browse Consultants
**Path:** `/consultants`

- [ ] Page loads with list of available consultants
- [ ] Only consultants with profileComplete=true and active=true shown
- [ ] For each consultant card:
  - [ ] Photo displayed
  - [ ] Name visible
  - [ ] Rating and review count shown (if available)
  - [ ] Years of experience visible
  - [ ] 3 specializations shown (with +X more if applicable)
  - [ ] Short bio preview (truncated)
  - [ ] "View Profile" button
  - [ ] "Book Now" button

### Test 2: View Consultant Profile
**Path:** `/consultants/[email]`

- [ ] Page loads with full consultant details
- [ ] Professional header with photo
- [ ] Name, rating, experience displayed
- [ ] Contact information:
  - [ ] Personal email with mailto link
  - [ ] Phone number with tel link
  - [ ] LinkedIn with external link
- [ ] About section (bio)
- [ ] Specializations grid showing all selected products
- [ ] Certifications listed with icon
- [ ] "Book a Consultation" button at bottom
- [ ] Back button goes to previous page

### Test 3: Book Consultation
**Path:** `/bookings` (after logged in)

- [ ] Page loads
- [ ] Step 1 - Browse & Select:
  - [ ] Can search by consultant name
  - [ ] Can filter by specialization
  - [ ] Can sort by rating/price/consultations
  - [ ] Select consultant
- [ ] Step 2 - Select Date & Time:
  - [ ] Date picker works
  - [ ] Time picker works
  - [ ] Duration selection works
  - [ ] Only available times shown (if availability set)
- [ ] Step 3 - Booking Details:
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Meeting platform select (Google Meet, Zoom, etc.)
  - [ ] Submit button
- [ ] After submission:
  - [ ] Booking created in Firestore
  - [ ] Status set to "pending"
  - [ ] Consultant receives email notification:
    - [ ] Subject: "New Booking Request from [Client Name]"
    - [ ] Includes date, time, duration, client email
    - [ ] Professional formatting
    - [ ] Dashboard link to view booking
  - [ ] Consultant receives in-app notification
  - [ ] Client redirected to dashboard

### Test 4: View My Bookings
**Path:** `/dashboard/bookings`

- [ ] Page loads
- [ ] Only own bookings shown
- [ ] Filter by status works (all, pending, confirmed, completed)
- [ ] For each booking:
  - [ ] Consultant name
  - [ ] Date and time
  - [ ] Duration
  - [ ] Status badge with correct color
  - [ ] Click to expand:
    - [ ] Consultant details (name, email)
    - [ ] Full description
    - [ ] If meetingLink exists: "Join Google Meet" button with link
    - [ ] Cancel button (if not completed/cancelled)
    - [ ] Platform usage notice (system monitored, must use platform)

### Test 5: Cancel Booking (as Client)
**Path:** `/dashboard/bookings` → Expand booking → Cancel

- [ ] Click "Cancel Consultation" button
- [ ] Reason textarea appears
- [ ] "Confirm Cancel" button only enabled with reason
- [ ] After confirmation:
  - [ ] Booking status changed to "cancelled"
  - [ ] Consultant receives email:
    - [ ] Subject: "Consultation Cancelled"
    - [ ] States "Client cancelled"
    - [ ] Includes reason
  - [ ] Consultant receives in-app notification
  - [ ] Success message shown

### Test 6: Receive Booking Confirmation
**Trigger:** Consultant confirms booking

- [ ] Client receives email:
  - [ ] Subject: "Consultation Confirmed"
  - [ ] Includes consultant name, date, time
  - [ ] Dashboard link
- [ ] In-app notification appears with details
- [ ] Booking status changes to "confirmed"
- [ ] Client can now see status is confirmed

### Test 7: Receive Google Meet Link
**Trigger:** Consultant sends meet link

- [ ] Email received with subject: "Google Meet Link for Your Consultation"
- [ ] Email contains:
  - [ ] Meeting details (date, time, consultant name)
  - [ ] Clickable "Join Google Meet" button
  - [ ] Direct meet link
  - [ ] Compliance notice (consultation monitored)
- [ ] Click email link goes to meet
- [ ] In-app notification in `/dashboard/bookings` shows meet link

---

## EMAIL DELIVERY TESTS

### Test 1: Booking Notification Email
**Trigger:** Client books consultation

Verify email to consultant:
- [ ] Email received within 2 minutes
- [ ] From: `noreply@plucogroup.com` or configured address
- [ ] To: Consultant email address
- [ ] Subject: `New Booking Request from [Client Name]`
- [ ] Contains: Client name, email, date, time, duration
- [ ] Professional HTML formatting
- [ ] No broken images/links
- [ ] Text version readable (plain text fallback)

### Test 2: Cancellation Email
**Trigger:** Consultant or client cancels

Verify email:
- [ ] Received within 1 minute
- [ ] Subject: `Consultation Cancelled`
- [ ] Contains who cancelled (consultant/client)
- [ ] Includes reason
- [ ] Includes original date/time
- [ ] Professional format

### Test 3: Reschedule Email
**Trigger:** Booking rescheduled (if implemented)

Verify email:
- [ ] Subject: `Consultation Rescheduled`
- [ ] Old and new dates shown
- [ ] Who rescheduled shown
- [ ] Reason included

### Test 4: Google Meet Link Email
**Trigger:** Consultant sends meet link

Verify email to client:
- [ ] Subject: `Google Meet Link for Your Consultation`
- [ ] Contains meet link
- [ ] Clickable button to join
- [ ] Professional formatting
- [ ] All details (date, time, consultant)

### Test 5: Weekly Report Email
**Trigger:** Manual cron call

Verify email to admin:
- [ ] Subject: `Weekly Consultant Activity Report`
- [ ] Contains table with consultant stats
- [ ] All metrics calculated correctly
- [ ] HTML table properly formatted
- [ ] Text version has data

---

## ACTIVITY LOGGING TESTS

### Test 1: Meeting Sent Activity
**Trigger:** Consultant sends meet link

Verify in Firestore `consultant_activities`:
```
{
  consultantUid: "xxx"
  consultantEmail: "consultant@email.com"
  consultantName: "John Doe"
  bookingId: "booking123"
  clientEmail: "client@email.com"
  clientName: "Jane Client"
  actionType: "meeting_sent"  ✓
  createdAt: <timestamp>
  ipAddress: <valid IP>
  userAgent: <browser info>
  details: {
    meetLink: "https://meet.google.com/xxx"
    title: "Consultation Title"
    scheduledAt: "2024-06-15T10:00:00Z"
  }
}
```

- [ ] All fields populated correctly
- [ ] IP address captured
- [ ] User agent captured
- [ ] Timestamp correct

### Test 2: Meeting Cancelled Activity
**Trigger:** Consultant cancels booking

Verify in Firestore:
- [ ] actionType: "meeting_cancelled" ✓
- [ ] details includes cancellation reason
- [ ] Timestamp correct

### Test 3: View Activities in Admin Dashboard
**Path:** `/admin/dashboard/consultant-activities`

- [ ] Activities appear in list
- [ ] Consultant name matches activity log
- [ ] Action type icon shows correctly
- [ ] Timestamp shows in correct format
- [ ] Click activity shows full details
- [ ] Filter finds newly created activities

---

## DATA INTEGRITY TESTS

### Test 1: Firestore Collections
Verify all collections exist and have data:
- [ ] `agents` - Contains consultant profile with all fields
- [ ] `consultation_bookings` - Contains booking record
- [ ] `consultant_activities` - Contains activity log entries
- [ ] `notifications` - Contains notification records
- [ ] `users` - Contains user records

### Test 2: Field Validation
For consultant profile:
- [ ] `profileComplete` boolean field exists
- [ ] `profileCompleteAt` timestamp exists
- [ ] `productTypes` array contains product IDs
- [ ] `photo` URL properly stored
- [ ] `personalEmail` differs from account email

For booking:
- [ ] `meetingLink` stored as string
- [ ] `meetingLinkCreatedAt` timestamp
- [ ] `meetingLinkCreatedBy` consultant UID
- [ ] `cancelledReason` optional but captured

### Test 3: No Fake Data
- [ ] No hardcoded test emails in production
- [ ] No dummy consultants in database
- [ ] No mock booking IDs
- [ ] All IDs are real Firestore document IDs
- [ ] All timestamps are real (server-side)

---

## Error Handling TESTS

### Test 1: Missing Email Service
**Setup:** Remove RESEND_API_KEY

- [ ] Booking created successfully (offline function still works)
- [ ] API returns error: "Email service not configured"
- [ ] Activity logged despite email failure
- [ ] User sees error message

### Test 2: Invalid Email Address
**Trigger:** Try to book with invalid email

- [ ] Email validation catches it
- [ ] User shown error message
- [ ] No API call made

### Test 3: Database Connection Loss
**Trigger:** Temporarily disconnect Firebase

- [ ] Clear error messages shown
- [ ] Not a blank error page
- [ ] User can retry

---

## Performance Tests

### Test 1: Page Load Times
- [ ] `/consultants` loads in <3 seconds with 10+ consultants
- [ ] `/consultant/dashboard` loads in <2 seconds
- [ ] `/admin/dashboard/consultant-activities` loads in <3 seconds with filters

### Test 2: Large Dataset
- [ ] Add 100+ activities to consultant_activities
- [ ] Admin dashboard still loads and filters properly
- [ ] CSV export completes in <10 seconds

---

## Security Tests

### Test 1: Authorization
- [ ] Non-authenticated user cannot access consultant dashboard
- [ ] Non-admin cannot access admin dashboard
- [ ] Consultant cannot see other consultant's activities (in theory - firestore rules)
- [ ] Client cannot cancel other client's bookings

### Test 2: Activity Tracking
- [ ] IP address captured in activities
- [ ] User agent captured
- [ ] Timestamps are server-side (cannot be spoofed)

### Test 3: Email Privacy
- [ ] No sensitive data in plain-text emails
- [ ] Links include proper authorization
- [ ] No credentials in email body

---

## Final Checklist Before Deployment

- [ ] All tests from above completed
- [ ] No console errors in browser (check F12)
- [ ] No server-side errors in logs
- [ ] Firestore rules deployed
- [ ] All environment variables set in Vercel
- [ ] RESEND_API_KEY tested and working
- [ ] Email domain whitelisted in Resend (if required)
- [ ] CRON_SECRET generated and stored securely
- [ ] Backup of firestore.rules saved
- [ ] Team knows to use platform (not off-platform)

---

## Post-Deployment Tests (Production)

- [ ] One booking flow end-to-end in production
- [ ] Verify emails delivered to real addresses
- [ ] Admin sees activity logged
- [ ] Weekly report email sends on schedule
- [ ] No 500 errors in Vercel logs
- [ ] Database queries performant

---

## Known Limitations

⚠️ **Google Meet Links:**
- Generated links are placeholder format until Google API integrated
- Consultant should use actual Google Meet link until full integration
- See TECHNICAL_VALIDATION_REPORT.md for setup options

⚠️ **Real-time Updates:**
- Activity log and notifications require page refresh (not real-time subscriptions)
- Can add Firestore real-time listeners in future if needed

---

**Last Updated:** 2024
**Status:** Ready for Testing
**Test Estimated Time:** 2-3 hours for full suite
