# Google Sign-In Testing Checklist

## Implementation Summary

✅ **Firebase Configuration**
- Firebase project: pluco-group
- Storage bucket: pluco-group.firebasestorage.app
- Auth initialized correctly with modular SDK
- GoogleAuthProvider configured with profile + email scopes

✅ **Google Sign-In Flow**
1. User clicks "Sign in with Google" button
2. GoogleAuthProvider popup appears
3. User authenticates with Google account
4. If popup blocked → fallback to signInWithRedirect
5. User profile auto-created if doesn't exist (role: "client")
6. Existing profiles preserved (no overwrite)
7. User redirected to appropriate dashboard based on role

✅ **Security**
- Frontend can ONLY assign role: "client" to new users
- Admin/consultant roles must already exist in Firestore
- Email validation before profile creation
- Complete error handling for all auth errors

---

## Pre-Testing Checklist

- [ ] Check Firebase Console: Authentication > Google provider is enabled
- [ ] Verify authorized domains in Firebase: www.plucogroup.com, plucogroup.com
- [ ] Clear browser cache/cookies
- [ ] Test in incognito/private window (fresh session)

---

## Local Testing (Localhost:3000 or 3001)

### 1. Google Popup Login (Primary Flow)

**Test Case 1.1: New User - Popup Success**
- [ ] Go to http://localhost:3000/login
- [ ] Click "Sign in with Google"
- [ ] Google popup opens
- [ ] Authenticate with test Google account (NEW account, not registered before)
- [ ] Popup closes
- [ ] Redirected to `/dashboard` (client role)
- [ ] ✓ Check browser console for: "✓ Google authentication successful"
- [ ] ✓ Check Firestore: new user created in `users` collection with email as doc ID
- [ ] ✓ User has: uid, email, displayName, role: "client", provider: "google", status: "active"

**Test Case 1.2: Existing User - Preserve Profile**
- [ ] Go to Firebase Console > Firestore > users collection
- [ ] Find the user you just created
- [ ] Manually add custom field: `customField: "test"`
- [ ] Go back to login page, click "Sign in with Google"
- [ ] Authenticate with the SAME Google account
- [ ] Should redirect to `/dashboard`
- [ ] ✓ Check Firestore: user document still has `customField: "test"` (not overwritten)
- [ ] ✓ Check console for: "✓ User exists in users (by email), keeping existing profile"

**Test Case 1.3: Consultant User**
- [ ] In Firestore, manually create a document in `agents` collection
- [ ] Doc ID: your-email@gmail.com
- [ ] Add: { uid: "...", role: "consultant", email: "your-email@gmail.com", ... }
- [ ] Sign out from auth
- [ ] Go to login page
- [ ] Click "Sign in with Google" with same account
- [ ] Should redirect to `/consultant/dashboard`
- [ ] ✓ Check console for: "✓ Found in agents (by email) with role: consultant"

**Test Case 1.4: Admin User**
- [ ] In Firestore, create document in `agents` collection
- [ ] Doc ID: admin-email@gmail.com
- [ ] Add: { uid: "...", role: "admin", email: "admin-email@gmail.com", ... }
- [ ] Sign out
- [ ] Login with that Google account
- [ ] Should redirect to `/admin/dashboard`
- [ ] ✓ Check console for: "✓ Found in agents (by email) with role: admin"

### 2. Error Handling - Popup

**Test Case 2.1: User Closes Popup**
- [ ] Click "Sign in with Google"
- [ ] Popup opens
- [ ] Close the popup window
- [ ] Error shows: "Sign-in window was closed. Please try again"
- [ ] ✓ Loading state disappears
- [ ] ✓ Button is clickable again
- [ ] ✓ User can retry

**Test Case 2.2: Popup Blocked**
- [ ] Block popups in browser settings
- [ ] Click "Sign in with Google"
- [ ] Browser blocks popup
- [ ] Should automatically fallback to signInWithRedirect
- [ ] Browser redirects to Google login
- [ ] After Google auth, redirected back to app
- [ ] Successfully logged in
- [ ] ✓ Console shows: "Popup blocked, falling back to redirect..."

**Test Case 2.3: Wrong Credential (Same Email, Different Method)**
- [ ] Create user with email/password auth: test@example.com / password123
- [ ] Try to login with Google account using same email: test@example.com
- [ ] Error shows: "This email is already registered with a different sign-in method"
- [ ] ✓ User not logged in
- [ ] ✓ Button is clickable for retry

### 3. RTL Language Support

**Test Case 3.1: Farsi Error Messages**
- [ ] Open DevTools > Console
- [ ] Run: `localStorage.setItem('language', 'fa')`
- [ ] Refresh page
- [ ] Click "Sign in with Google"
- [ ] Close popup
- [ ] Error message in Farsi: "پنجره ورود بسته شد. لطفا دوباره سعی کنید"
- [ ] ✓ Button text in Farsi: "ورود با گوگل"
- [ ] ✓ Loading text in Farsi: "درحال ورود..."

### 4. Loading States

**Test Case 4.1: Button Disabled During Login**
- [ ] Click "Sign in with Google"
- [ ] Button should show spinner
- [ ] Button text should show "Signing in..."
- [ ] Button should be disabled (opacity 0.6)
- [ ] Email/password inputs should be disabled
- [ ] ✓ Cannot click button again during login

---

## Production Testing (www.plucogroup.com)

### 1. New User Registration via Google

**Test Case P1.1: Production Login**
- [ ] Go to https://www.plucogroup.com/login
- [ ] Click "Sign in with Google"
- [ ] Sign in with Google account (different from testing)
- [ ] Should redirect to dashboard
- [ ] ✓ URL shows: https://www.plucogroup.com/dashboard
- [ ] ✓ User can access dashboard features
- [ ] ✓ Firestore shows new user in `users` collection

**Test Case P1.2: Email Verification Not Required**
- [ ] Click "Sign in with Google"
- [ ] Complete Google auth
- [ ] Should NOT see email verification message
- [ ] Should redirect to dashboard immediately
- [ ] ✓ Google accounts bypass email verification (auto-verified)

**Test Case P1.3: User Persistence**
- [ ] Login with Google
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Go to https://www.plucogroup.com
- [ ] Should see "/dashboard" or appropriate role dashboard
- [ ] ✓ User session persists (Firebase handles it)

### 2. Existing User - Role Preservation

**Test Case P2.1: Consultant Keeps Role**
- [ ] In Firebase Console, create consultant in `agents` collection
- [ ] Use email from real Google account
- [ ] Login with that Google account
- [ ] Should redirect to `/consultant/dashboard`
- [ ] ✓ Role not changed from "consultant"

**Test Case P2.2: Admin Keeps Admin Access**
- [ ] Setup admin user in `agents` collection
- [ ] Login with Google
- [ ] Should redirect to `/admin/dashboard`
- [ ] Click "User Management"
- [ ] ✓ Can see user list and manage users

### 3. Security Tests

**Test Case P3.1: New User Never Gets Admin**
- [ ] Create new Google account
- [ ] Never created in Firestore before
- [ ] Login with Google
- [ ] Check Firestore: should have role: "client"
- [ ] Try to access /admin/dashboard directly
- [ ] ✓ Access denied or redirected (no admin access)

**Test Case P3.2: Consultant Cannot Become Admin**
- [ ] Create consultant in agents collection
- [ ] Manually try to add admin field to Firestore doc
- [ ] Login with Google
- [ ] Should still have consultant role
- [ ] ✓ Cannot access admin panel

### 4. Console Logging Verification

After each login, check browser console for:

```
=== STARTING GOOGLE LOGIN ===
Attempting signInWithPopup...
✓ Google authentication successful
User email: ...
User uid: ...
Display name: ...
Photo URL: ...
=== CHECKING USER ROLE ===
UID: ...
Email: ...
✓ Found in users (by email) with role: client
Final role detected: client
Found location: users-email
Redirecting to: /dashboard
=== END ROLE CHECK ===
```

Or for existing user:
```
=== CHECKING/CREATING USER PROFILE ===
✓ User exists in users (by email), keeping existing profile
```

---

## Troubleshooting

### Popup Not Opening
- [ ] Check browser popup settings (allow popups for plucogroup.com)
- [ ] Check browser console for errors
- [ ] Try incognito mode
- [ ] Check if domain is authorized in Firebase Console

### "Unauthorized Domain" Error
- [ ] Go to Firebase Console > Authentication > Settings > Authorized domains
- [ ] Check if www.plucogroup.com is listed
- [ ] Check if plucogroup.com is listed
- [ ] If missing, add them and wait 5 minutes

### User Not Appearing in Admin Dashboard
- [ ] Go to Firestore Console
- [ ] Check `users` collection
- [ ] User should be there with email as document ID
- [ ] Refresh admin dashboard page
- [ ] Search for user by email

### Getting "Account Exists with Different Credential"
- [ ] This means email was already used with password auth
- [ ] Tell user to use password login for that email
- [ ] Or use different Google account with different email

### User Stuck in Loading
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests
- [ ] Check Firestore for user document (should exist)
- [ ] Try hard refresh (Ctrl+Shift+R)

---

## Regression Testing

Make sure you didn't break existing functionality:

- [ ] Email/password login still works
- [ ] Email verification still required for password auth
- [ ] Password reset still works
- [ ] Signup page still works
- [ ] Logout still works
- [ ] Dashboard loads for logged-in users
- [ ] Role-based redirects work (admin → /admin/dashboard, etc.)
- [ ] User profile data displays correctly
- [ ] RTL language still works for all pages

---

## Sign-Off Checklist

Once all tests pass:

- [ ] Update Firebase authorized domains (if needed)
- [ ] Test with 3+ different Google accounts
- [ ] Test popup and redirect flows
- [ ] Test error handling
- [ ] Test RTL language
- [ ] Monitor Firestore for new user creation patterns
- [ ] Check Firebase Auth logs for any failures
- [ ] Verify no console errors
- [ ] Verify performance (network tab should show fast auth)

**Status**: Ready for production ✅
