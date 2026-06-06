# Production Deployment Guide - Chatbot & Admin Tour

## Critical Issues Fixed

### ✅ Issue #1: Missing Anthropic SDK
- **Problem:** Build failed - `@anthropic-ai/sdk` not installed
- **Fix:** `npm install @anthropic-ai/sdk`
- **Impact:** Chatbot API route now has all required dependencies

### ✅ Issue #2: TypeScript Errors  
- **Problem:** Invalid CSS property `ringColor` in ChatbotLeads component
- **Fix:** Removed invalid style property
- **Impact:** Build now passes without errors

### ✅ Issue #3: No Debug Logging
- **Problem:** Can't diagnose why components aren't showing
- **Fix:** Added comprehensive console logs to:
  - ChatbotWidget (mount, session, initialization)
  - DashboardTourProvider (initialization state)
  - useDashboardTour (progress loading, welcome trigger)
- **Impact:** Can now debug visibility issues in production

---

## Exact Deployment Steps

### Step 1: Verify Build Passes Locally
```bash
npm run build
```
**Expected output:**
```
✓ Compiled successfully in X.Xs
✓ Type checked
✓ Static routes generated
```

### Step 2: Deploy to Vercel Production
```bash
vercel --prod --confirm
```

**Expected output:**
```
✓ Uploading [==============] 100%
✓ Build completed
✓ Production Deployment URL: https://www.plucogroup.com
```

Takes 3-5 minutes. Monitor progress at: https://vercel.com/your-team/your-project/deployments

### Step 3: Verify in Vercel Dashboard
1. Go to: https://vercel.com → Your Project → Deployments
2. Find latest deployment (should be from this commit: 94424a9)
3. Click deployment → Check "Build Logs"
4. Look for: `✓ Compiled successfully`

### Step 4: Clear Cache & Test Production
```bash
# Hard refresh browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Clear browser cache
Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)

# Refresh again
Cmd+R
```

### Step 5: Verify ANTHROPIC_API_KEY in Vercel
1. Go to: https://vercel.com → Project Settings → Environment Variables
2. Look for `ANTHROPIC_API_KEY`
3. If missing, add it:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...your-key...`
   - Environment: Production
   - Save and redeploy

---

## Exact Locations to Check After Deployment

### ✅ 1. Chatbot on Homepage (https://www.plucogroup.com)

**Where to look:**
- **Location:** Bottom-right corner of page
- **Visual:** Dark navy (#071C3C) circle button with white message icon
- **Size:** 56x56 pixels
- **Z-index:** 50 (visible above everything)

**How to verify:**
1. Open https://www.plucogroup.com
2. Hard refresh (Cmd+Shift+R)
3. Scroll to bottom-right corner
4. You should see a dark navy circle with message bubble icon
5. Open browser console (F12)
6. Look for: `[Chatbot] ChatbotWidget mounted and initializing...`

**Click test:**
- Click the button
- Chat window should slide up from bottom-right
- You should see: "Hello! I'm Pluco Assistant..."
- 6 FAQ buttons should appear below message

---

### ✅ 2. Chatbot on Admin Dashboard (https://www.plucogroup.com/admin/dashboard)

**Where to look:**
- **Location:** Bottom-right corner (same as homepage)
- **Visual:** Dark navy circle
- **Visibility:** Should appear above all dashboard elements (z-index: 50)

**How to verify:**
1. Login to admin account
2. Navigate to /admin/dashboard
3. Look bottom-right corner
4. Should see the same navy chat button
5. Check console (F12):
   - `[Chatbot] ChatbotWidget mounted and initializing...`
   - Should show `sessionId: session_...`

**Click test:**
- Click button → Chat window opens
- Type "Can you help with EU residency?"
- AI should respond with relevant information

---

### ✅ 3. Admin Tour Welcome Modal

**Where to look:**
- **Location:** Center of screen (full-page overlay)
- **Triggers:** First time admin visits /admin/dashboard
- **Visual:** White modal with gradient navy header, 2 buttons, 1 checkbox

**How to verify (First-Time Admin):**
1. Create new admin account (has role: "admin")
2. Login
3. Navigate to /admin/dashboard
4. Modal should appear with:
   - Title: "Welcome to your Pluco Admin Dashboard"
   - Description: "This quick tour will show you..."
   - "Do not show this tour again" checkbox
   - "Continue Tour" button (gold/amber)
   - "Exit Tour" button (gray)
5. Check console (F12):
   - `[Tour] DashboardTourProvider initialized: { tourId: 'admin-dashboard-tour', ... showWelcome: true }`
   - `[useDashboardTour] Showing welcome modal`

**Modal test:**
- Click "Continue Tour" → 12-step guided tour starts
- Click "Back" / "Next" → Navigate between steps
- Click "Finish Tour" → Tour completes, modal closes
- Click "Restart Tour" button → Tour restarts

---

### ✅ 4. Restart Tour Button

**Where to look:**
- **Location:** Admin dashboard header, next to Help button
- **Visual:** Blue circle with question mark icon
- **Position:** To the left of the notification dropdown
- **Behavior:** Animated pulse if tour not completed

**How to verify:**
1. Go to /admin/dashboard
2. Look at top-right header
3. Between "Help" button (book icon) and "Notifications"
4. Should see blue/gold circle with question mark
5. Icon should have pulse animation if tour incomplete
6. Click it → Tour restarts from step 1

---

## Post-Deployment Checklist

### Functional Tests
```
□ Chatbot button appears on homepage (bottom-right)
  └─ Click → Chat window opens
  └─ Type question → AI responds (if API key set)

□ Chatbot button appears on admin dashboard (bottom-right)
  └─ Click → Chat window opens (above tour if active)

□ Admin tour welcome modal appears (first-time admin)
  └─ Modal centered, readable
  └─ "Continue Tour" button works
  └─ "Exit Tour" button works

□ Restart Tour button in header
  └─ Pulse animation visible
  └─ Click → Tour restarts

□ Tour steps work properly
  └─ Back button navigates
  └─ Next button navigates
  └─ Finish button completes
  └─ Elements highlight correctly
  └─ Card positions properly on mobile
```

### Console Verification
```
Open F12 Developer Tools → Console tab and look for:

□ [Chatbot] ChatbotWidget mounted and initializing...
□ [Chatbot] Session ID set and component should be visible
□ [Tour] DashboardTourProvider initialized: { tourId: 'admin-dashboard-tour'...
□ [useDashboardTour] Showing welcome modal
  (OR)
□ [useDashboardTour] First time user, showing welcome
```

### Visual Verification
```
Homepage (https://www.plucogroup.com):
□ Scroll to bottom-right
□ Navy circle button visible
□ Button has message icon
□ Button stays visible while scrolling
□ Z-index high enough (above header, footer, content)

Admin Dashboard (/admin/dashboard):
□ Bottom-right corner has navy chat button
□ Top-right header has blue help button + restart button
□ Restart button has pulse animation
□ All buttons are clickable
□ No overlapping elements
```

### API Verification
```
Chatbot API Status:

Test in browser console:
1. fetch('/api/faq-chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       sessionId: 'test-123',
       userMessage: 'Hello',
       conversationHistory: []
     })
   })

Expected response:
- Status 200 OK
- { response: "Hello! I'm Pluco Assistant..." }

If fails with 401/500:
- Check ANTHROPIC_API_KEY in Vercel env vars
- Verify key is not expired
- Check Vercel build logs
```

---

## Troubleshooting

### Chatbot Button Not Showing

**Check 1: Browser Console**
```javascript
// F12 → Console → Paste:
localStorage.getItem('chatbot_session_id')
// Should return: session_...

// Should see logs:
[Chatbot] ChatbotWidget mounted and initializing...
[Chatbot] Session ID set and component should be visible
```

**Check 2: Hard Refresh Everything**
```
1. Cmd+Shift+R (hard refresh)
2. Cmd+Shift+Delete (clear all cache)
3. Close all tabs of site
4. Open fresh: https://www.plucogroup.com
5. Check bottom-right corner
```

**Check 3: Vercel Deployment**
```
1. Go to https://vercel.com/your-team/your-project
2. Check Deployments tab
3. Latest should be green ✓
4. Click it → Check Build Logs
5. Search for: "@anthropic-ai/sdk"
   Should show: "added 4 packages"
```

**Check 4: Z-Index Issue**
```javascript
// F12 → Elements → Find chat button
// Right-click → Inspect
// Check Styles → z-index
// Should show: z-index: 50 (or higher)
```

### Tour Modal Not Showing

**Check 1: First-Time Admin?**
```
Tour only shows first time admin visits /admin/dashboard
- If they exited tour → must click "Restart Tour" button
- If they checked "Do not show again" → must click button
- Firestore stores this in: dashboardGuideProgress/{userId}
```

**Check 2: Admin Role Detected?**
```javascript
// F12 → Console → Check:
[Tour] DashboardTourProvider initialized: {
  userRole: 'admin',  // Must be 'admin'
  showWelcome: true,  // Should be true on first visit
  ...
}
```

**Check 3: Firestore Permission**
```
Firestore → Collections → dashboardGuideProgress
Should have document: {userId}
  With fields: tourCompleted, tourExited, doNotShowAgain
```

---

## Important Notes

### ANTHROPIC_API_KEY Required
- ✅ Chatbot UI will load without key
- ❌ AI responses will fail without key
- If not set: "Failed to get response" message appears
- **Solution:** Add to Vercel Environment Variables and redeploy

### z-index Values
- Chatbot button: z-50
- Chatbot window: z-50
- Tour overlay: z-40
- Tour modal: Automatic (above everything)

### Security
- API key only used server-side in `/api/faq-chat`
- Never exposed to frontend
- Signed URLs for images (separate from chatbot)
- Firestore rules restrict access by role

### Backward Compatibility
- No changes to existing auth
- No changes to existing dashboards (except tour)
- No changes to public pages (except chatbot)
- All features optional (can exit/dismiss)

---

## Success Indicators

✅ **When everything is working:**

1. Visit homepage → See chat button bottom-right
2. Click chat → Window opens, welcome message appears
3. Type question → AI responds within 2-3 seconds
4. First-time admin visits dashboard → Welcome modal appears
5. Click "Continue Tour" → 12-step tour starts
6. Highlight follows elements → Background dims
7. "Finish Tour" → Tour completes, saved in Firestore
8. Click "Restart Tour" button → Tour runs again
9. Browser console → Clean, no errors
10. Vercel Deployment → Green checkmark, no warnings

---

**You're now ready to deploy! Follow the "Exact Deployment Steps" above.** 🚀
