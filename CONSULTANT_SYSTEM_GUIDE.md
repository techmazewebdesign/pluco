# Consultant Management & Activity Tracking System

## Overview
This document outlines the complete consultant management system with activity tracking, Google Meet integration, and appointment management features.

---

## Features Implemented

### 1. **Activity Logging & Audit Trail**

#### API Endpoint
- **POST** `/api/consultants/log-activity`
  - Logs all consultant activities
  - Tracks: meeting creation, meeting sent, cancellations, reschedules, profile updates
  - Records: timestamp, IP address, user agent
  - Stored in `consultant_activities` Firestore collection

#### Activity Types Logged
- `meeting_created` - When a Google Meet link is generated
- `meeting_sent` - When meet link is sent to client
- `meeting_cancelled` - When appointment is cancelled
- `meeting_rescheduled` - When appointment is rescheduled
- `profile_updated` - When consultant profile changes
- `availability_set` - When availability is configured

#### Admin Monitoring
- **Page**: `/admin/dashboard/consultant-activities`
- Features:
  - View all consultant activities with detailed timeline
  - Filter by date range (7 days, 30 days, all time)
  - Filter by consultant
  - Filter by action type
  - Export activities as CSV
  - Real-time activity stats (total, per consultant, cancellations count)
  - IP tracking and user agent information

---

### 2. **Google Meet Integration**

#### Create & Send Meet Links
- **API Endpoint**: **POST** `/api/bookings/create-meet-link`
  - Generates unique Google Meet link
  - Stores link in booking record
  - Sends email to client with meet link
  - Logs activity automatically

#### Consultant Dashboard Features
- **Page**: `/consultant/dashboard/bookings`
- Features:
  - View all bookings with detailed filtering
  - Filter by status: pending, confirmed, completed
  - Create Google Meet link with one click
  - Copy meet link to clipboard
  - View client information
  - See meeting details and client notes

#### Email Notification
- Professional HTML email template
- Includes:
  - Meeting details (date, time, topic, consultant name)
  - Direct Google Meet link button
  - Clickable meet link for easy access
  - Compliance notice about platform usage
  - Support contact information

---

### 3. **Appointment Management**

#### Cancel/Reschedule Functionality
- **API Endpoint**: **POST** `/api/bookings/update-booking`
  - Action: cancel or reschedule
  - Performed by: consultant or user
  - Logs reason/details
  - Sends notifications to both parties

#### Consultant Controls
- **Page**: `/consultant/dashboard/bookings`
- Can cancel appointments with reason
- Logs activity automatically
- Both parties notified

#### Client Controls
- **Page**: `/dashboard/bookings`
- View all booked consultations
- Filter by status
- Cancel consultations with reason
- View consultant details
- Join Google Meet when available

#### Notifications Sent On Changes
- **Email**: To both consultant and client
- **In-App**: Notification in dashboard
- **Contents**:
  - Who made the change (consultant or client)
  - Reason for change
  - New time (if rescheduled)
  - Action required (if applicable)

---

### 4. **Weekly Consultant Reports**

#### Report Generation
- **API Endpoint**: **POST** `/api/reports/weekly-consultant-report`
- **Authentication**: CRON_SECRET bearer token
- **Schedule**: Can be triggered via cron job or manual API call

#### Report Contents
- Period: Last 7 days
- Consultant Activity Summary:
  - Total meetings sent
  - Total meetings created
  - Total cancellations
  - Total reschedules
  - Profile updates
  - Individual consultant stats

#### Email Report
- Sent to: Admin email (`NEXT_PUBLIC_ADMIN_EMAIL`)
- Format: Professional HTML table with stats
- Includes:
  - Summary statistics (total consultants, meetings, cancellations)
  - Detailed activity table per consultant
  - Dashboard link for full monitoring
  - CSV export capability for admins

#### Setup Cron Job (Example)
```bash
# Add to your cron scheduler (e.g., Vercel, AWS Lambda, or your server)
# Runs every Monday at 8 AM
0 8 ? * MON curl -X POST https://yoursite.com/api/reports/weekly-consultant-report \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

---

### 5. **Platform Usage Enforcement**

#### Off-Platform Deal Prevention
All emails and notifications include:
- Clear notice: "This consultation is monitored for quality and compliance"
- Explicit instruction: "All consultations must take place through this platform"
- Warning that direct arrangements are not permitted
- All activities logged and audited

#### Monitoring Mechanisms
- All consultant actions logged with timestamps and IP
- Client-facing notice about platform exclusivity
- Activity audit trail for compliance review
- Weekly reports to admin showing all activities

---

## Database Collections

### `consultant_activities`
Stores all consultant activity logs
```
{
  consultantUid: string
  consultantEmail: string
  consultantName: string
  bookingId?: string
  clientUid?: string
  clientEmail?: string
  clientName?: string
  actionType: 'meeting_created' | 'meeting_sent' | 'meeting_cancelled' | 'meeting_rescheduled' | 'profile_updated' | 'availability_set'
  details: any (action-specific data)
  createdAt: timestamp
  ipAddress: string
  userAgent: string
  status: 'active'
}
```

### `consultation_bookings` (Updated)
Enhanced with meeting tracking
```
{
  // ... existing fields ...
  meetingLink?: string (Google Meet URL)
  meetingLinkCreatedAt?: string (when link was created)
  meetingLinkCreatedBy?: string (consultant UID)
  cancelledReason?: string
  cancelledAt?: string
  cancelledBy?: string
  rescheduledReason?: string
  rescheduledAt?: string
  rescheduledBy?: string
  previousScheduledAt?: string
  updatedAt?: string
  updatedBy?: string
}
```

### `notifications` (Updated)
Both consultant and user notifications
```
{
  recipientUid: string
  recipientEmail: string
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'booking_rescheduled' | 'review'
  title: string
  message: string
  link?: string
  data?: any
  read: boolean
  createdAt: timestamp
}
```

---

## User Flows

### Consultant Workflow
1. **Login** → Consultant Dashboard
2. **View Bookings** → Click "Manage Bookings"
3. **Create Meet Link** → Click "Create & Send Google Meet Link"
4. **Client Receives** → Email with meet link and details
5. **If Need to Cancel**:
   - Click booking
   - Click "Cancel Booking"
   - Enter reason
   - Confirm cancellation
   - Client notified via email + in-app notification
6. **Activity Tracked** → Admin can see all actions in activity dashboard

### Client Workflow
1. **Browse Consultants** → `/consultants` page
2. **View Profile** → Click consultant name
3. **Book Consultation** → Fill booking form
4. **Receive Confirmation** → Email with booking details
5. **Receive Meet Link** → Consultant sends Google Meet link via email
6. **View Booking** → Go to `/dashboard/bookings`
7. **Cancel if Needed**:
   - Click booking
   - Click "Cancel Consultation"
   - Enter reason
   - Consultant notified

### Admin Workflow
1. **Monitor Activities** → `/admin/dashboard/consultant-activities`
2. **Filter Activities** → By date, consultant, or action type
3. **Review Audit Trail** → See all consultant actions with IP/user agent
4. **Export Data** → Download CSV for compliance
5. **Receive Weekly Report** → Summary email every week
6. **Check Stats** → Dashboard shows cancellation rates, active consultants, etc.

---

## Security & Compliance

### Firestore Rules
- Only consultants can create/send meet links
- Only clients can cancel their own bookings
- Only consultants can cancel their bookings
- Admins can view all activities
- All changes are logged and immutable

### Activity Tracking
- IP addresses logged
- User agents tracked
- Timestamps recorded (server-side)
- All actions require authentication
- Audit trail cannot be deleted (only by admin)

### Email Compliance
- All emails include platform exclusivity notice
- Consultants cannot provide direct contact for off-platform deals
- Compliance notice in every meeting notification
- Warning about platform-only arrangements

---

## Configuration Required

### Environment Variables
```env
# Email service
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=PLUCO GROUP <noreply@plucogroup.com>
NEXT_PUBLIC_APP_URL=https://www.plucogroup.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@plucogroup.com

# Weekly report scheduling
CRON_SECRET=your_secure_cron_secret
```

### Firestore Setup
- Collections created automatically on first write
- Security rules updated (see firestore.rules)
- Indexes: None required (activities collection has basic queries)

### Cron Job Setup
Choose one method to trigger weekly reports:

**Option 1: Vercel Cron**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/reports/weekly-consultant-report",
    "schedule": "0 8 ? * MON"
  }]
}
```

**Option 2: External Service (EasyCron, GitHub Actions, etc.)**
```bash
POST https://yoursite.com/api/reports/weekly-consultant-report
Authorization: Bearer {CRON_SECRET}
```

---

## Testing the System

### Create a Test Booking
1. Login as user
2. Go to `/bookings`
3. Book a consultation with any consultant
4. Check emails received

### Test Meet Link Creation
1. Login as consultant
2. Go to `/consultant/dashboard/bookings`
3. Click booking → "Create & Send Google Meet Link"
4. Verify email received by client
5. Check activity log in admin dashboard

### Test Cancellation
1. From consultant or client dashboard
2. Click booking → "Cancel Booking/Consultation"
3. Enter reason and confirm
4. Verify:
   - Status changes to "cancelled"
   - Other party receives email
   - Other party receives in-app notification
   - Activity logged in admin dashboard

### Test Weekly Report
```bash
curl -X POST https://yoursite.com/api/reports/weekly-consultant-report \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

---

## Files Created/Modified

### New Files
- `/api/consultants/log-activity/route.ts` - Activity logging
- `/api/bookings/create-meet-link/route.ts` - Meet link generation
- `/api/bookings/update-booking/route.ts` - Cancel/reschedule
- `/api/reports/weekly-consultant-report/route.ts` - Weekly reports
- `/admin/dashboard/consultant-activities/page.tsx` - Admin activity monitor
- `/consultant/dashboard/bookings/page.tsx` - Consultant booking management
- `/consultant/dashboard/notifications/page.tsx` - Notifications (previously created)
- `/dashboard/bookings/page.tsx` - Client booking management

### Modified Files
- `firestore.rules` - Added rules for new collections
- `/consultant/dashboard/page.tsx` - Added notifications bell
- `/bookings/page.tsx` - Added notification email sending

---

## Future Enhancements

1. **Google Calendar Integration** - Sync with consultant's calendar
2. **Automated Reminders** - Email reminders 24h and 1h before meeting
3. **Meeting Recordings** - Automatic recording storage
4. **Ratings & Reviews** - Post-consultation feedback system
5. **Payment Integration** - Handle consultant payments through platform
6. **SMS Notifications** - Add SMS alerts for confirmations
7. **Analytics Dashboard** - Detailed metrics on consultant performance
8. **Scheduling Assistant** - AI-powered scheduling suggestions
9. **Multi-language Support** - Localized email templates
10. **Compliance Reports** - Automated compliance reporting

---

## Support & Troubleshooting

### Issues

**Q: Meet link not being created?**
A: Check that RESEND_API_KEY is configured and valid. Check logs for email errors.

**Q: Weekly report not sending?**
A: Verify CRON_SECRET is correct and matches in API call. Check NEXT_PUBLIC_ADMIN_EMAIL is set.

**Q: Activities not appearing in admin dashboard?**
A: Ensure activities are being created - check booking flow triggers activity logging.

**Q: Notifications not showing?**
A: Verify notifications collection rules in firestore.rules are correct. Check browser console for errors.

---

Generated: 2024
PLUCO GROUP Consultant Management System
