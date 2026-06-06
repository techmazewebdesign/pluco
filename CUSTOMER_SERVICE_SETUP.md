# Customer Service System Setup Guide

## Overview
The Customer Service system allows dedicated staff to manage customer inquiries, bookings, tickets, and support activities. Customer service users must complete their profile before accessing the dashboard.

## Setup Steps

### Step 1: Add Role Support ✅
Customer service users are identified by the `role: "customer-service"` custom claim in their Firebase Authentication JWT token.

**To add a new customer service user:**
1. Create user account in Firebase Authentication
2. Set custom claim in Firebase Admin SDK or Cloud Functions:
```javascript
await admin.auth().setCustomUserClaims(uid, { role: 'customer-service' });
```

### Step 2: Create Customer Service Profile Page ✅
Located at: `src/app/customer-service/profile/page.tsx`

**Features:**
- Form for basic information (full name, phone, email)
- Professional fields (role title, department, experience level)
- Availability status selector
- Optional notes field
- Saves to `customerServiceProfiles/{uid}` collection
- Sets `profileCompleted: true` flag in users/{uid}

### Step 3: Create Customer Service Dashboard ✅
Located at: `src/app/customer-service/dashboard/page.tsx`

**Features:**
- Profile completion check - redirects to profile if incomplete
- Stats display (total open tickets, urgent, high priority, department)
- Open support tickets assigned to user
- Recent activity feed
- Profile information sidebar
- Logout functionality

### Step 4: Profile Completion Check ✅
Implemented in `/customer-service/dashboard/page.tsx`:
- On page load, checks if `customerServiceProfiles/{uid}` exists
- If missing or `profileCompleted === false`, redirects to `/customer-service/profile`
- Prevents dashboard access until profile is complete

### Step 5: Firestore Collections Structure

#### 5.1 customerServiceProfiles/{uid}
**Purpose:** Stores customer service staff profile information

**Fields:**
```
{
  uid: string                         // Firebase Auth UID
  fullName: string                    // Full name of staff member
  email: string                       // Email address
  phoneWhatsApp: string              // Phone/WhatsApp number
  preferredLanguage: string          // Language preference (e.g., "English", "Farsi")
  department: string                 // Department assignment
                                     // Options: 'leads', 'client-support', 
                                     // 'documents', 'bookings', 'general'
  experienceLevel: string            // Experience level
                                     // Options: 'junior', 'mid', 'senior'
  roleTitle: string                  // Job title (e.g., "Lead Coordinator")
  profilePhoto?: string              // Optional Firebase Storage URL
  availabilityStatus: string         // Current availability
                                     // Options: 'available', 'busy', 'away', 'offline'
  notes?: string                     // Additional notes about staff member
  profileCompleted: boolean          // Whether profile setup is complete
  createdAt: string                  // ISO timestamp when profile created
  updatedAt: string                  // ISO timestamp of last update
}
```

**Security Rules:**
- Customer service users can read/write their own profile
- Admins can read/write all profiles

#### 5.2 supportTickets/{ticketId}
**Purpose:** Stores customer support tickets assigned to customer service staff

**Fields:**
```
{
  id: string                         // Ticket ID
  assignedTo: string                 // Customer service staff UID
  assignedToName: string             // Name of assigned staff
  relatedInquiryId?: string         // Link to related inquiry
  relatedBookingId?: string         // Link to related booking
  relatedClientId?: string          // Link to related client
  title: string                      // Ticket title
  description: string                // Detailed description
  priority: string                   // 'low', 'medium', 'high', 'urgent'
  status: string                     // 'new', 'contacted', 'waiting', 
                                     // 'urgent', 'resolved'
  tags?: string[]                    // Optional tags for categorization
  notes?: string                     // Internal notes
  createdAt: string                  // ISO timestamp
  updatedAt: string                  // ISO timestamp
  resolvedAt?: string               // ISO timestamp when resolved
}
```

**Security Rules:**
- Customer service can read tickets assigned to them
- Customer service can update tickets assigned to them
- Admins can read/write all tickets

#### 5.3 customerServiceActivity/{activityId}
**Purpose:** Logs all actions taken by customer service staff

**Fields:**
```
{
  id: string                         // Activity ID
  userId: string                     // Customer service staff UID
  userName: string                   // Name of staff member
  activityType: string               // Type of activity
                                     // Options: 'inquiry_contacted', 'ticket_created',
                                     // 'ticket_resolved', 'note_added', 'status_changed',
                                     // 'assignment', 'follow_up'
  relatedId?: string                // ID of related ticket/inquiry
  description: string                // Human-readable description
  metadata?: object                  // Additional context data
  timestamp: string                  // ISO timestamp
}
```

**Security Rules:**
- Customer service can read their own activity log
- Customer service can create activity records for themselves
- Admins can read/write all activity

#### 5.4 users/{uid} (Enhanced)
**Purpose:** Main user document with role information

**Additional Fields for Customer Service:**
```
{
  // ... other fields ...
  role: "customer-service"          // Role identifier
  profileCompleted: boolean          // Whether profile setup complete
}
```

**Security Rules:**
- Users can read/write their own document
- Admins can read/write all users

#### 5.5 bookings/{bookingId} (Existing)
**Purpose:** Booking/inquiry records from public forms

**Fields:**
```
{
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  message: string
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled'
  consultantId?: string
  consultantName?: string
  source: 'private_enquiry' | 'consultant_book_now'
  createdAt: string
  updatedAt: string
}
```

**Customer Service Access:**
- Can read all bookings to view assigned inquiries
- Can filter by status to find pending bookings

### Step 6: Firestore Security Rules ✅

**Location:** `firestore.rules` (root directory)

**Key Rules for Customer Service Role:**

1. **Customer Service Profiles:**
   - Can read/write own profile
   - Cannot read other staff profiles

2. **Support Tickets:**
   - Can read tickets assigned to them
   - Can update assigned tickets
   - Cannot read tickets assigned to others

3. **Activity Log:**
   - Can read own activity log
   - Can create activity records for themselves
   - Cannot read other staff's activity

4. **Bookings:**
   - Can read all bookings
   - Cannot create/modify (admins only, except public submissions)

5. **Default Deny:**
   - All other collections denied by default
   - Follows principle of least privilege

## Testing the System

### Test Scenario 1: New Customer Service User
1. Admin creates new user in Firebase Auth (e.g., agent@example.com)
2. Admin sets custom claim: `role: "customer-service"`
3. Agent logs in to app
4. System redirects to `/customer-service/profile` (no profile exists)
5. Agent completes profile form
6. System saves to `customerServiceProfiles/{uid}` with `profileCompleted: true`
7. Agent is redirected to `/customer-service/dashboard`
8. Dashboard loads with stats and assigned tickets

### Test Scenario 2: Existing Customer Service User
1. Customer service user (profile complete) logs in
2. System checks `customerServiceProfiles/{uid}` - exists with `profileCompleted: true`
3. Dashboard loads immediately
4. User sees their profile info, assigned tickets, and activity feed

### Test Scenario 3: Profile Incomplete
1. Customer service user's profile exists but `profileCompleted: false`
2. System redirects to `/customer-service/profile` on any dashboard access
3. User cannot bypass profile completion

## File Structure

```
src/
├── lib/
│   └── types/
│       └── customerService.ts          # Type definitions
├── app/
│   └── customer-service/
│       ├── profile/
│       │   └── page.tsx               # Profile creation/edit page
│       └── dashboard/
│           └── page.tsx               # Main dashboard page
└── storage.rules                       # Firebase Storage rules (separate)

Root/
├── firestore.rules                     # Firestore security rules
└── CUSTOMER_SERVICE_SETUP.md          # This file
```

## Collection Setup Checklist

- [ ] Create `customerServiceProfiles` collection (auto-created on first write)
- [ ] Create `supportTickets` collection (auto-created on first write)
- [ ] Create `customerServiceActivity` collection (auto-created on first write)
- [ ] Deploy `firestore.rules` to Firebase (use Firebase CLI: `firebase deploy --only firestore:rules`)
- [ ] Test with admin user creating first customer service profile
- [ ] Verify Firestore rules with Test Rules feature in Firebase Console

## Next Steps

1. **Create Admin Panel for Customer Service Management:**
   - Allow admins to create/edit customer service users
   - Allow admins to assign departments and experience levels
   - Allow admins to view all staff activity

2. **Implement Ticket Assignment Logic:**
   - Auto-assign support tickets based on department
   - Round-robin assignment by availability
   - Manual assignment by admin

3. **Add Notification System:**
   - Email notifications for assigned tickets
   - In-app notifications for new activity
   - Daily summary emails

4. **Create Reporting Dashboard:**
   - Staff performance metrics
   - Response time analytics
   - Ticket resolution rates
   - Customer satisfaction scores

5. **Implement Multi-language Support:**
   - Route inquiries by preferred language
   - Multi-language ticket interface

## Troubleshooting

### Issue: "Profile not found" redirects infinite loop
**Solution:** Ensure `profileCompleted` field is properly set to `true` after saving profile.

### Issue: Customer service can't see assigned tickets
**Solution:** 
- Verify Firestore rules are deployed
- Check `assignedTo` field matches user's UID exactly
- Ensure user has `role: "customer-service"` custom claim

### Issue: Activity log not saving
**Solution:**
- Verify user has `role: "customer-service"` claim
- Check that `userId` matches user's UID in activity record
- Ensure Firestore rules allow create operation

## References

- [Firebase Custom Claims](https://firebase.google.com/docs/auth/admin-setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [TypeScript Interfaces in `lib/types/customerService.ts`](./src/lib/types/customerService.ts)
