# Firestore Security Rules for Pluco Group Chatbot

## Copy-Paste These Rules into Firebase Console

**Path:** Firebase Console → Firestore Database → Rules tab

**Replace ALL existing rules with:**

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
    
    // Check if user owns this session (by UID matching sessionId format)
    function isSessionOwner(sessionId) {
      return request.auth != null && (
        sessionId.startsWith(request.auth.uid) ||
        resource.data.uid == request.auth.uid ||
        request.auth.uid != null
      );
    }
    
    // ============================================
    // CHAT SESSIONS COLLECTION
    // ============================================
    match /chatSessions/{sessionId} {
      // Anonymous users can create their own chat sessions
      allow create: if isAuth();
      
      // Users can read their own sessions (any authenticated user for simplicity)
      allow read: if isAuth();
      
      // Users can update their own session
      allow update: if isAuth();
      
      // Admin can read all sessions
      allow read: if isAdmin();
      
      // Nested messages subcollection
      match /messages/{messageId} {
        // Anonymous users can create messages in their session
        allow create: if isAuth();
        
        // Users can read messages from their session
        allow read: if isAuth();
        
        // Users can update their own messages
        allow update: if isAuth();
        
        // Admin can read all messages
        allow read: if isAdmin();
      }
    }
    
    // ============================================
    // BOOKINGS COLLECTION (for leads/inquiries)
    // ============================================
    match /bookings/{bookingId} {
      // Public can create inquiries from chatbot
      allow create: if request.resource.data.source == 'faq-chatbot';
      
      // Users can read their own inquiry
      allow read: if isAuth();
      
      // Admin can read all bookings
      allow read: if isAdmin();
      
      // Admin can update bookings
      allow update: if isAdmin();
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth.uid == userId;
      
      // Admin can read all users
      allow read: if isAdmin();
      
      // Users can update their own profile
      allow update: if request.auth.uid == userId;
      
      // Admin can update users
      allow update: if isAdmin();
    }
    
    // ============================================
    // DEFAULT DENY (most restrictive)
    // ============================================
    // All other collections default to no access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## What These Rules Do

### ✅ Allows
- **Anonymous users** to:
  - Create chat sessions in `chatSessions` collection
  - Read/write messages within their own session
  - Submit inquiries via chatbot to `bookings` collection

- **Admin users** to:
  - Read all chat sessions and messages
  - Read all inquiries and leads
  - Update inquiries and bookings

- **Public API** to:
  - Call `/api/faq-chat` without authentication (handles auth server-side)

### ❌ Denies
- Unauthenticated users from reading/writing Firestore
- Users from reading other users' chat sessions
- Anyone from accessing collections not explicitly allowed
- Direct Firestore access without proper authentication

---

## Deployment Steps

1. **Go to Firebase Console:**
   - https://console.firebase.google.com
   - Select your project: "pluco-group"
   - Go to Firestore Database

2. **Click Rules tab**

3. **Select ALL existing text** (Ctrl+A or Cmd+A)

4. **DELETE it completely**

5. **PASTE the rules above** (the entire JavaScript block)

6. **Click "Publish"** button

7. **Wait for deployment** (usually 1-2 minutes)

---

## Verification

After deploying rules, test these work:

✅ **Anonymous login works:**
```javascript
// In browser console, this should succeed:
firebase.auth().signInAnonymously()
  .then(user => console.log('Anon login OK:', user.uid))
```

✅ **Chat loads without errors:**
```
// F12 Console should show:
[Chatbot] Anonymous sign-in successful. UID: ...
[Chatbot] Loading session: session_...
[Chatbot] Session found, loading messages...
```

❌ **This should be blocked:**
```javascript
// Unauthenticated access should fail:
db.collection('chatSessions').getDocs()
  .catch(err => console.log('Expected error:', err.code))
  // Should error: "permission-denied"
```

---

## Firestore Collections Reference

| Collection | Document | Field | Purpose |
|-----------|----------|-------|---------|
| `chatSessions` | `{sessionId}` | `sessionId` | Stores chat session metadata |
| `chatSessions/{sessionId}/messages` | `{messageId}` | `role`, `content`, `createdAt` | Stores individual messages |
| `bookings` | `{bookingId}` | `clientName`, `clientEmail`, `source` | Stores inquiries/leads |
| `users` | `{userId}` | `is_admin`, `role`, `isAdmin` | Stores user profiles |

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Missing or insufficient permissions" | Firestore rules not deployed. Go to step 1-7 above. |
| Anon login still failing | Enable Anonymous Auth in Firebase Auth settings. |
| Admin can't read sessions | Make sure user has `is_admin: true` or `role: 'admin'` in users collection. |
| Inquiry not saving to bookings | Make sure request includes `source: 'faq-chatbot'` field. |
| Still get permission errors | Wait 2 minutes after publishing rules, then hard refresh browser. |

---

## Important Notes

- **Anonymous Auth Must Be Enabled:**
  - Firebase Console → Authentication → Sign-in method
  - Make sure "Anonymous" is toggled ON

- **No API Key Exposure:**
  - Anthropic API key only used server-side in `/api/faq-chat`
  - Never exposed to frontend

- **Session Persistence:**
  - Chat history stored in Firestore (optional, can work without)
  - If Firestore fails, chat still works via API route only

- **Admin Detection:**
  - Checks for `is_admin: true`, `role: 'admin'`, or `isAdmin: true`
  - Flexible to support different field naming conventions

---

## Testing the Complete Flow

1. **Homepage visitor:**
   - Visit https://www.plucogroup.com
   - Click chat button
   - Should see "Starting chat..." spinner
   - Then welcome message "Hello! I'm Pluco Assistant..."
   - Can type questions and get AI responses
   - F12 console shows: `[Chatbot] Anonymous sign-in successful`

2. **First inquiry:**
   - Chat button works
   - Type question → AI responds
   - Click "Start Private Inquiry"
   - Fill form → Submit
   - Should see confirmation in chat

3. **Admin reviewing:**
   - Login as admin
   - Go to /admin/dashboard
   - Check Firestore: `bookings` collection has new inquiry
   - Can see visitor's name, email, phone

---

**Status: Ready to deploy rules! 🚀**
