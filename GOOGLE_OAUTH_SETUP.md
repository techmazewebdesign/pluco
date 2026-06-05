# Google OAuth Setup - Complete Guide

## Issue: "This domain is not authorized for Google sign-in"

This error occurs when your domain isn't properly configured in Google Cloud Console or Firebase. Follow these exact steps:

---

## Step 1: Firebase Authentication Setup

### 1.1 Authorized Domains in Firebase

✅ You've already done this, but verify:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **pluco-group**
3. Go to **Authentication > Settings**
4. Scroll to **Authorized domains**
5. Verify these are listed:
   - [ ] `www.plucogroup.com`
   - [ ] `plucogroup.com`
   - [ ] `localhost` (for development)

If any are missing, add them and **wait 5-10 minutes** for propagation.

### 1.2 Enable Google Sign-In

1. In Firebase Console, go to **Authentication > Sign-in method**
2. Click on **Google**
3. Make sure toggle is **ON** (blue)
4. If it says "Default support email not set", set it to your admin email
5. Click **Save**

---

## Step 2: Google Cloud Console OAuth Configuration ⚠️ CRITICAL

This is the most common reason for the "unauthorized domain" error.

### 2.1 Find Your OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. At the top, select project: **pluco-group**
3. In left sidebar, go to **APIs & Services > Credentials**
4. You should see credentials listed
5. Find the one that says:
   - Type: **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: Usually something like "Web client 1" or "Default"

⚠️ If you don't see it, you need to create it:
   - Click **+ Create Credentials > OAuth Client ID**
   - Choose **Web application**
   - Name it something like "pluco-group-web"
   - Under "Authorized JavaScript origins", add:
     - `https://www.plucogroup.com`
     - `https://plucogroup.com`
     - `http://localhost:3000`
     - `http://localhost:3001`
   - Under "Authorized redirect URIs", add (see Step 2.2)

### 2.2 Update Authorized Redirect URIs (MOST IMPORTANT)

This is usually where the issue is:

1. In Google Cloud Console > Credentials
2. Click on your **Web Client OAuth ID**
3. Scroll down to **Authorized redirect URIs**
4. Add these exact URIs:
   ```
   https://www.plucogroup.com/__/auth/handler
   https://plucogroup.com/__/auth/handler
   http://localhost:3000/__/auth/handler
   http://localhost:3001/__/auth/handler
   https://pluco-group.firebaseapp.com/__/auth/handler
   ```

5. Click **Save**
6. **WAIT 5-10 MINUTES** for changes to propagate!

### 2.3 Verify JavaScript Origins (ALSO IMPORTANT)

1. Same OAuth Client ID page
2. Scroll to **Authorized JavaScript origins**
3. Make sure these are listed:
   ```
   https://www.plucogroup.com
   https://plucogroup.com
   http://localhost:3000
   http://localhost:3001
   ```
4. If any are missing, add them and **Save**
5. **WAIT 5-10 MINUTES**

### 2.4 Verify Client ID Matches (for advanced users)

If you want to verify the credentials are correct:

1. Go to Firebase Console > Project Settings > Your apps
2. Find your Web app
3. Copy the config, specifically the `appId`
4. Go back to Google Cloud > Credentials
5. Click your OAuth Client ID
6. The **Client ID** should be visible at the top

---

## Step 3: Test the Configuration

### 3.1 Clear Browser Cache

Before testing:
1. Open DevTools (F12)
2. Settings > Storage
3. Click **Clear site data**
4. Or use: **Ctrl+Shift+Delete** to clear all cache
5. Close browser completely
6. Reopen browser

### 3.2 Test on Local Development

```bash
# Terminal 1: Start dev server
npm run dev

# Opens at http://localhost:3000 or 3001
```

Go to `http://localhost:3000/login`:
1. Click "Sign in with Google"
2. Google popup should open
3. Complete authentication
4. Check browser console for logs

### 3.3 Test on Production

After testing locally and it works:

1. Go to `https://www.plucogroup.com/login`
2. Click "Sign in with Google"
3. Should work without "unauthorized domain" error

---

## Troubleshooting

### Problem 1: Still getting "unauthorized domain" after adding URIs

**Solution:**
1. Clear browser cache completely (Ctrl+Shift+Delete)
2. Wait 10 minutes (Google Cloud needs time to propagate)
3. Try in incognito/private window (fresh session)
4. Check you're on correct domain: www.plucogroup.com (not just plucogroup.com)

### Problem 2: Popup blocked by browser

**Solution:**
- Check browser popup settings
- Allow popups for your domain
- Try different browser
- Code has fallback to redirect mode

### Problem 3: "Account exists with different credential"

**Cause:** Email was already registered with password auth
**Solution:** User needs to use password login for that email, or use different Google account

### Problem 4: Popup opens but closes immediately

**Cause:** Usually CORS issue or domain configuration
**Solution:**
1. Check JavaScript origins are added (not just redirect URIs)
2. Try in incognito mode
3. Clear cache completely

### Problem 5: Works on localhost but not production

**Cause:** 
- www.plucogroup.com not added to authorized origins/redirect URIs
- Or still propagating

**Solution:**
1. Verify www.plucogroup.com is in BOTH:
   - Authorized JavaScript origins
   - Authorized redirect URIs
2. Wait 10 minutes
3. Clear cache and try again

---

## Step-by-Step Configuration Checklist

Use this checklist to verify everything is configured:

### Firebase Console
- [ ] Project: pluco-group selected
- [ ] Authentication > Sign-in method > Google is ON
- [ ] Authentication > Settings > Authorized domains:
  - [ ] www.plucogroup.com
  - [ ] plucogroup.com
  - [ ] localhost

### Google Cloud Console
- [ ] Project: pluco-group selected
- [ ] APIs & Services > Credentials > Found OAuth 2.0 Web Client
- [ ] Authorized JavaScript origins includes:
  - [ ] https://www.plucogroup.com
  - [ ] https://plucogroup.com
  - [ ] http://localhost:3000
  - [ ] http://localhost:3001
- [ ] Authorized redirect URIs includes:
  - [ ] https://www.plucogroup.com/__/auth/handler
  - [ ] https://plucogroup.com/__/auth/handler
  - [ ] http://localhost:3000/__/auth/handler
  - [ ] http://localhost:3001/__/auth/handler
  - [ ] https://pluco-group.firebaseapp.com/__/auth/handler

### Browser
- [ ] Popups enabled for your domain
- [ ] Cache cleared
- [ ] DevTools console shows detailed logs

### Testing
- [ ] Works on localhost
- [ ] Works on https://www.plucogroup.com
- [ ] User created in Firestore `users` collection
- [ ] Role is "client" for new users
- [ ] Existing profiles not overwritten

---

## What the Code Does Now

✅ Enhanced error diagnostics:
- Shows current origin/hostname
- Shows auth domain being used
- Logs which method succeeded (popup or redirect)
- Detailed error output for debugging

✅ Better fallback handling:
- If popup blocked → automatically uses redirect
- If operation not supported → uses redirect

✅ User-friendly errors:
- Shows why authorization failed
- In English and Farsi
- Logs helpful instructions to console if domain error

---

## Key URLs for Configuration

**Firebase Console:**
https://console.firebase.google.com/project/pluco-group/authentication/settings

**Google Cloud Console:**
https://console.cloud.google.com/apis/credentials?project=pluco-group

**Your Login Page:**
- Local: http://localhost:3000/login
- Production: https://www.plucogroup.com/login

---

## If You're Still Stuck

1. **Open DevTools Console (F12)** and click "Sign in with Google"
2. **Copy the logs** - look for error codes and messages
3. Check that error output has:
   ```
   Current origin: https://www.plucogroup.com
   Auth domain: pluco-group.firebaseapp.com
   Error code: auth/unauthorized-domain
   ```
4. **Verify checklist above** - most likely missing redirect URI

---

## Common Mistakes

❌ Don't do:
- Add just the domain, but not the full redirect URI with `/__/auth/handler`
- Forget to wait 5-10 minutes after making changes
- Use HTTP instead of HTTPS (except localhost)
- Only add one domain variation (need both www and non-www)
- Add domains to Firebase but not to Google Cloud Console

✅ Do:
- Add BOTH to Firebase authorized domains AND Google Cloud authorized origins
- Add full redirect URIs with `/__/auth/handler` suffix
- Wait 10 minutes between changes
- Test in incognito window
- Clear cache completely
- Use HTTPS for production domains

---

## Success Indicators

When configured correctly, you should see in console:

```
=== STARTING GOOGLE LOGIN ===
Current origin: https://www.plucogroup.com
Current hostname: www.plucogroup.com
Auth domain: pluco-group.firebaseapp.com
Attempting signInWithPopup...
✓ signInWithPopup succeeded
✓ Google authentication successful
User email: user@gmail.com
User uid: abc123xyz...
```

---

## Support Links

- [Firebase Authentication - Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Google Cloud OAuth 2.0 Configuration](https://console.cloud.google.com/apis/credentials)
- [Firebase Authorized Domains](https://firebase.google.com/docs/hosting/reserved-urls#reserved_domains)

---

**Last Updated:** 2026-06-05
**Status:** Comprehensive Setup Guide
