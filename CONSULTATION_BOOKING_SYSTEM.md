# Consultation Booking System - Implementation Plan

## Overview
A complete online consultation booking system with:
- User booking interface
- Consultant role & dashboard
- Admin management
- Google Sheets integration
- Training/Tutorial pages

## Features Implemented

### 1. ✅ Data Models & Types
- Added `ConsultationBooking` interface
- Added `Consultant` interface  
- Added `ConsultantAvailability` interface
- Added `ConsultationReview` interface
- Added `ConsultationRecord` interface
- Added "consultant" role to AgentRole enum
- Updated ROLE_PERMISSIONS with consultant access

### 2. ✅ Consultant Dashboard (`/consultant/dashboard`)
**Features:**
- View overview stats (today's count, upcoming, completed, rating)
- List upcoming consultations with client info
- Quick actions to confirm bookings
- Navigation to detailed pages:
  - `/consultant/dashboard/bookings` - Manage all bookings
  - `/consultant/dashboard/availability` - Set working hours
  - `/consultant/dashboard/reviews` - View client reviews
- Profile settings link
- Logout functionality

**Data:**
- Fetches consultant profile from agents collection
- Loads consultation_bookings filtered by consultantUid
- Calculates real-time stats

## Features to Implement

### 3. User Booking Page (`/bookings`)
**Components:**
- Browse available consultants
  - Filter by specialization, timezone, rating
  - Show consultant details, bio, photo, rating
- Select consultant
- Choose date/time from availability calendar
- Enter consultation details
- Confirm and receive confirmation email

**Database:**
- Creates document in consultation_bookings collection
- Initial status: "pending"
- Email notification sent to consultant

### 4. Consultant Sub-Pages

#### 4a. Bookings Management (`/consultant/dashboard/bookings`)
**Features:**
- List all bookings with filters (pending, confirmed, completed, cancelled)
- View booking details
- Actions:
  - Confirm pending bookings
  - Cancel bookings (with reason)
  - Mark as completed
  - Add meeting link
  - View client info
  - Send message to client

#### 4b. Availability Settings (`/consultant/dashboard/availability`)
**Features:**
- Set working hours per day of week
- Timezone selection
- Break times
- Vacation dates
- Save to Firestore consultantAvailability collection

#### 4c. Reviews & Ratings (`/consultant/dashboard/reviews`)
**Features:**
- Display all reviews from clients
- Show average rating
- Filter by rating (1-5 stars)
- Response option to reviews
- Performance insights

### 5. Admin Consultant Management (`/admin/dashboard/consultants`)
**Features:**
- List all consultants with status
- Add new consultant
  - Form: name, email, role, bio, languages, specializations, timezone, fee
  - Assign temporary password
  - Send invitation email
- Edit consultant details
- Enable/disable consultants
- View consultant stats and ratings
- Export list to Google Sheets
- Quick actions menu

### 6. Login Role Selection
**Current:** Login page directs to user dashboard
**Update:** Add role selection on login:
- Login as User (client)
- Login as Consultant
- Login as Admin

**Implementation:**
- Add role selection UI on login page
- Store selected role in session/localStorage
- Redirect to appropriate dashboard based on role
- Validate role against Firebase Auth custom claims

### 7. Training & Tutorial Pages (`/consultant/training` or `/help/consultant-guide`)
**Sections:**
1. Dashboard Overview
   - Video tour of consultant dashboard
   - Stats explanation

2. Managing Bookings
   - How to confirm/reject bookings
   - Setting up meeting links (Google Meet, Discord, etc.)
   - Recording notes

3. Setting Availability
   - How to set working hours
   - Managing timezone
   - Setting vacation/break times

4. Client Communication
   - Messaging clients
   - Sending reminders
   - Post-consultation follow-up

5. Reviews & Ratings
   - Understanding ratings
   - Responding to reviews
   - Improving performance

6. Google Meet Integration
   - Step-by-step setup
   - Sharing links
   - Best practices

7. Discord Integration
   - Channel setup
   - Sharing meeting links
   - Recording meetings

8. Meeting Recordings
   - How to record consultations
   - Storing recordings
   - Client privacy

9. Case Records
   - Taking consultation notes
   - Recording action items
   - Following up

10. Troubleshooting
    - Common issues
    - Support contact

### 8. Google Sheets Integration
**Features:**
- Export consultation records
- Track consultation outcomes
- Generate reports
- Share with admins

**Endpoints:**
- POST `/api/consultations/export` - Export to Google Sheets
- GET `/api/consultations/reports` - Get reports

### 9. Meeting Link Generation
**Supported Platforms:**
- Google Meet (auto-generate meeting link)
- Discord (paste server/channel link)
- Zoom (paste meeting link)
- Teams (paste meeting link)
- Other (custom link input)

**Implementation:**
- Store platform and link in booking
- Display in booking confirmation
- Send to client via email

### 10. Email Notifications
**Triggers:**
- Booking confirmed
- Booking cancellation
- Meeting reminder (24h, 1h before)
- Consultation completed
- Review reminder
- Availability changed (notify interested clients)

## Database Schema

### Collections

#### `consultation_bookings`
```javascript
{
  id: string (auto)
  clientUid: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  consultantUid: string
  consultantName: string
  title: string
  description?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  scheduledAt: ISO datetime
  duration: number (minutes)
  meetingPlatform: 'google_meet' | 'discord' | 'zoom' | 'teams' | 'other'
  meetingLink?: string
  meetingPassword?: string
  notes?: string
  createdAt: timestamp
  updatedAt?: timestamp
  completedAt?: timestamp
  cancelledAt?: timestamp
  cancelReason?: string
}
```

#### `consultant_availability`
```javascript
{
  id: string (auto)
  consultantUid: string
  dayOfWeek: number (0-6)
  startTime: string (HH:mm)
  endTime: string (HH:mm)
  isAvailable: boolean
  createdAt: timestamp
  updatedAt?: timestamp
}
```

#### `consultation_reviews`
```javascript
{
  id: string (auto)
  bookingId: string
  clientUid: string
  clientName: string
  consultantUid: string
  rating: number (1-5)
  title: string
  comment: string
  wouldRecommend: boolean
  createdAt: timestamp
  updatedAt?: timestamp
}
```

#### `consultation_records`
```javascript
{
  id: string (auto)
  bookingId: string
  consultantUid: string
  clientUid: string
  clientName: string
  startTime: ISO datetime
  endTime: ISO datetime
  duration: number (minutes)
  summary?: string
  notes?: string
  followUpRequired: boolean
  followUpDate?: ISO datetime
  actionItems?: string[]
  attachments?: Array<{name, url, type}>
  createdAt: timestamp
  updatedAt?: timestamp
}
```

#### Update: `agents` (for Consultant role)
```javascript
{
  // existing fields
  role: 'consultant'  // NEW
  bio?: string        // NEW
  timezone?: string   // NEW
  languages?: string[] // NEW
  specializations?: string[] // NEW
  consultationFee?: number // NEW
  currency?: string   // NEW
  averageRating?: number // NEW
  totalConsultations?: number // NEW
}
```

## Firestore Rules

```javascript
// Consultant bookings - only consultant and client can view
match /consultation_bookings/{bookingId} {
  allow read: if request.auth.uid == resource.data.consultantUid ||
                 request.auth.uid == resource.data.clientUid ||
                 hasAdminAccess();
  allow write: if hasAdminAccess() ||
                  (request.auth.uid == resource.data.consultantUid && 
                   request.resource.data.status in ['confirmed', 'completed', 'cancelled', 'no_show']);
  allow create: if request.auth != null;
}

// Consultant availability - public read, consultant write
match /consultant_availability/{docId} {
  allow read: if request.auth != null;
  allow write: if hasAdminAccess() || 
                  request.auth.uid == resource.data.consultantUid;
}

// Consultant reviews - public read, client write
match /consultation_reviews/{reviewId} {
  allow read: if request.auth != null;
  allow create: if request.auth.uid == request.resource.data.clientUid;
  allow update: if request.auth.uid == resource.data.clientUid;
}

// Consultant records - consultant access only
match /consultation_records/{recordId} {
  allow read: if request.auth.uid == resource.data.consultantUid ||
                 hasAdminAccess();
  allow write: if request.auth.uid == resource.data.consultantUid ||
                  hasAdminAccess();
}
```

## API Endpoints (to implement)

### `/api/consultations/create` [POST]
Create new consultation booking

### `/api/consultations/confirm` [POST]
Confirm pending booking

### `/api/consultations/cancel` [POST]
Cancel booking with reason

### `/api/consultations/complete` [POST]
Mark consultation as completed

### `/api/consultations/[id]` [GET]
Get consultation details

### `/api/consultants/list` [GET]
List available consultants (with filtering)

### `/api/consultants/[uid]` [GET]
Get consultant profile and availability

### `/api/consultants/add` [POST] (Admin only)
Add new consultant

### `/api/consultants/update` [PUT] (Admin or self)
Update consultant profile

### `/api/consultations/export` [POST]
Export to Google Sheets

## Files to Create

### Pages
- [ ] `/app/bookings/page.tsx` - Browse and book consultations
- [ ] `/app/bookings/[id]/page.tsx` - Booking confirmation
- [ ] `/app/consultant/dashboard/bookings/page.tsx` - Manage bookings
- [ ] `/app/consultant/dashboard/availability/page.tsx` - Set working hours
- [ ] `/app/consultant/dashboard/reviews/page.tsx` - View reviews
- [ ] `/app/consultant/profile/page.tsx` - Edit profile
- [ ] `/app/admin/dashboard/consultants/page.tsx` - Manage consultants
- [ ] `/app/help/consultant-guide/page.tsx` - Training guide

### API Routes
- [ ] `/api/consultations/create`
- [ ] `/api/consultations/confirm`
- [ ] `/api/consultations/[id]`
- [ ] `/api/consultants/list`
- [ ] `/api/consultants/[uid]`

### Components
- [ ] `ConsultantCard` - Display consultant info
- [ ] `BookingCalendar` - Select date/time
- [ ] `BookingForm` - Create new booking
- [ ] `BookingList` - Display bookings
- [ ] `AvailabilityEditor` - Set working hours
- [ ] `ReviewsDisplay` - Show reviews

## Timeline

**Phase 1** (Done):
- ✅ Data types and interfaces
- ✅ Consultant dashboard structure
- ⏳ Consultant sub-pages

**Phase 2** (Next):
- [ ] User booking interface
- [ ] Consultant availability management
- [ ] Admin consultant management
- [ ] Meeting link integration

**Phase 3**:
- [ ] Email notifications
- [ ] Google Sheets export
- [ ] Training pages
- [ ] Advanced features

## Testing Checklist

- [ ] User can browse consultants
- [ ] User can select date/time and book
- [ ] Consultant receives booking notification
- [ ] Consultant can confirm/cancel booking
- [ ] Consultant can set availability
- [ ] Consultant can add meeting link
- [ ] Client can view booking confirmation
- [ ] Client can leave review after consultation
- [ ] Admin can add/remove consultants
- [ ] Bookings sync to Google Sheets
- [ ] Email notifications sent
- [ ] Training pages accessible and helpful

## Future Enhancements

1. **Video Integration**: Embedded video calls
2. **Payment Processing**: Charge for consultations
3. **Recurring Bookings**: Schedule recurring consultations
4. **Calendar Sync**: Sync with Google Calendar
5. **AI Scheduling**: Auto-suggest optimal times
6. **Multi-language Support**: RTL support for Farsi
7. **Mobile App**: Native mobile application
8. **Analytics Dashboard**: Detailed performance metrics
9. **Certification**: Consultant verification system
10. **Team Consultations**: Multiple consultants per meeting
