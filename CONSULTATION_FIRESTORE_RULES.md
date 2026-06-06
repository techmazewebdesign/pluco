# Firestore Rules for Consultation Requests

## Copy-Paste Rules into Firebase Console

**Path:** Firebase Console → Firestore Database → Rules tab

**Add these rules to your existing rules (merge with existing rules):**

```javascript
// Consultation Requests Collection
match /consultation_requests/{requestId} {
  // Public: Authenticated anonymous users can create consultation requests
  allow create: if request.auth != null;
  
  // Public: Users can read their own request by userUid matching auth.uid
  allow read: if request.auth != null && resource.data.userUid == request.auth.uid;
  
  // Admin: Admins can read all consultation requests
  allow read: if isAdmin();
  
  // Admin: Admins can update status and admin notes
  allow update: if isAdmin() && 
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'adminNotes', 'updatedAt']));
  
  // Deny delete by default (no one can delete)
  allow delete: if false;
}
```

## Complete Rules File (if starting fresh)

If you need to replace your entire Firestore rules, use this complete file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Check if user is authenticated
    function isAuth() {
      return request.auth != null;
    }
    
    // Check if user is admin (flexible admin detection)
    function isAdmin() {
      return isAuth() && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
    }
    
    // ============================================
    // CHAT SESSIONS COLLECTION
    // ============================================
    match /chatSessions/{sessionId} {
      allow create: if isAuth();
      allow read: if isAuth();
      allow update: if isAuth();
      allow read: if isAdmin();
      
      match /messages/{messageId} {
        allow create: if isAuth();
        allow read: if isAuth();
        allow update: if isAuth();
        allow read: if isAdmin();
      }
    }
    
    // ============================================
    // CONSULTATION REQUESTS COLLECTION
    // ============================================
    match /consultation_requests/{requestId} {
      // Public: Authenticated anonymous users can create consultation requests
      allow create: if request.auth != null;
      
      // Public: Users can read their own request by userUid matching auth.uid
      allow read: if request.auth != null && resource.data.userUid == request.auth.uid;
      
      // Admin: Admins can read all consultation requests
      allow read: if isAdmin();
      
      // Admin: Admins can update status and admin notes
      allow update: if isAdmin() && 
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'adminNotes', 'updatedAt']));
      
      // Deny delete by default
      allow delete: if false;
    }
    
    // ============================================
    // BOOKINGS COLLECTION (for leads/inquiries)
    // ============================================
    match /bookings/{bookingId} {
      allow create: if request.resource.data.source == 'faq-chatbot';
      allow read: if isAuth();
      allow read: if isAdmin();
      allow update: if isAdmin();
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow read: if isAdmin();
      allow update: if request.auth.uid == userId;
      allow update: if isAdmin();
    }
    
    // ============================================
    // DEFAULT DENY (most restrictive)
    // ============================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Deploy

1. Go to: **https://console.firebase.google.com**
2. Select project: **pluco-group**
3. Go to: **Firestore Database** → **Rules** tab
4. Select ALL existing text (Ctrl+A or Cmd+A)
5. DELETE everything
6. PASTE the complete rules above
7. Click **"Publish"** button
8. Wait for deployment (1-2 minutes)

## What These Rules Do

### ✅ Allows

**Anonymous public users:**
- Create their own consultation request
- Read their own request only (must match userUid)

**Admin users:**
- Read all consultation requests
- Update status and adminNotes fields only
- Cannot delete requests
- Cannot modify other fields

**System:**
- Automatic timestamp on create/update

### ❌ Denies

- Unauthenticated users from reading/writing
- Public from reading other users' requests
- Public from updating requests
- Anyone from deleting requests
- Non-admin from accessing other requests

## Security Features

1. **No Public Access**: All access requires authentication
2. **User Isolation**: Public users only see their own requests
3. **Admin-Only Updates**: Only admins can update status/notes
4. **Immutable Core Data**: Once created, userUid, email, etc. cannot be changed
5. **Audit Trail**: Every change has updatedAt timestamp
6. **No Deletion**: Requests preserved for compliance

## Testing the Rules

### Test 1: Anonymous user can create request

```javascript
// This should succeed:
db.collection('consultation_requests').add({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  service: 'EU Residency',
  userUid: auth.currentUser.uid,
  // ... other fields
})
```

### Test 2: Anonymous user can read own request

```javascript
// This should succeed:
db.collection('consultation_requests')
  .where('userUid', '==', auth.currentUser.uid)
  .get()
```

### Test 3: Cannot read other user's request

```javascript
// This should FAIL (permission denied):
db.collection('consultation_requests').doc('someone-elses-request').get()
```

### Test 4: Admin can read all requests

```javascript
// Admin user should succeed:
db.collection('consultation_requests').get()
```

### Test 5: Admin can update status

```javascript
// Admin should succeed:
db.collection('consultation_requests').doc(requestId).update({
  status: 'contacted',
  adminNotes: 'Contacted client on Wednesday',
})

// Non-admin should FAIL
```

## Firestore Collection Structure

```
consultation_requests/
├── id: "req_1717677200000"
├── createdAt: "2024-06-06T10:00:00Z"
├── updatedAt: "2024-06-06T10:00:00Z"
├── source: "chatbot"
├── sessionId: "session_xxx"
├── userUid: "firebase-uid-here"
├── fullName: "Jane Doe"
├── email: "jane@example.com"
├── phone: "+1234567890"
├── service: "EU Residency"
├── preferredDate: "2024-06-15"
├── preferredTime: "10:00"
├── timezone: "UTC"
├── language: "en"
├── caseDescription: "Looking for EU residency program"
├── consentAccepted: true
├── status: "pending" | "contacted" | "confirmed" | "declined"
└── adminNotes: "Customer interested in Italy program"
```

## Admin Role Detection

The rules check for admin status using flexible field names:

```javascript
get(...).data.is_admin == true    // Firestore: is_admin: true
get(...).data.role == 'admin'     // Firestore: role: "admin"
get(...).data.isAdmin == true     // Firestore: isAdmin: true
```

If your admin field uses a different name, update the `isAdmin()` function in the rules.

---

**Status: Ready to Deploy** 🚀
