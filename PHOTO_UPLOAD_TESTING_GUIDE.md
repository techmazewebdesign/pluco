# Photo Upload Testing Guide

## Quick Start Testing

### 1. User Profile Photo Upload
**Location**: Dashboard > Profile > Personal tab

**Steps**:
1. Login as a regular user
2. Click "My Profile"
3. Go to "Personal" tab
4. Click on the circular profile photo area
5. Select an image file (JPG, PNG, WEBP - under 5MB)
6. See the upload progress bar
7. Photo should display immediately after upload
8. "Saved successfully" message should appear
9. Refresh the page to confirm photo persists

**Expected Result**: Photo displays, saves to Firestore, and persists after refresh ✅

---

### 2. Family Member Photo Upload
**Location**: Dashboard > Profile > Family Members tab

**Steps**:
1. Go to "Family Members" tab
2. Click "Add Member" button
3. Fill in family member details:
   - Relationship: Select one (e.g., "Spouse / Partner")
   - Full Name: Enter a name
   - Other fields are optional
4. Click on the smaller photo circle
5. Select a photo (JPG, PNG, WEBP - under 5MB)
6. Photo preview should appear
7. Click "Add Member" button
8. Family member should appear in the list with their photo
9. Click "Edit" on that family member
10. Photo should still be there
11. Try replacing the photo and click "Save"

**Expected Result**: Photos upload correctly for new members, persist when editing ✅

---

### 3. Agent/Admin Profile Photo Upload
**Location**: Agent Profile (for agents/admins only)

**Steps**:
1. Login as an agent or admin
2. Click on your name/profile icon
3. Go to "My Profile"
4. Click on the circular photo area
5. Select an image file
6. Photo should upload and display immediately
7. Refresh to confirm persistence

**Expected Result**: Agent photo uploads and persists ✅

---

## Error Testing

### Test 1: Invalid File Type
**Steps**:
1. Try uploading a PDF or text file
2. Should see error: "Please select an image file (JPG, PNG, WEBP)."

**Expected Result**: Error message appears ✅

### Test 2: File Too Large
**Steps**:
1. Try uploading an image > 5MB
2. Should see error: "File is too large. Maximum size is 5MB."

**Expected Result**: Error message appears ✅

### Test 3: Network Error (Simulate)
**Steps**:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Click throttling dropdown, select "Offline"
4. Try uploading a photo
5. Should see appropriate error message about network

**Expected Result**: Error message about network/connection ✅

---

## Browser Console Debugging

**To see detailed logs**:
1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Upload a photo
4. You should see logs like:
   ```
   Uploading to path: profiles/user123/photo.jpg
   Getting download URL...
   Upload successful: {path: "...", url: "https://..."}
   ```

**This confirms**:
- ✅ Upload path is correct
- ✅ Download URL was retrieved
- ✅ File was successfully uploaded to Firebase Storage

---

## Checking Firebase Console

### 1. Verify Photos in Firebase Storage
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project "pluco-group"
3. Go to Storage
4. You should see folders:
   - `profiles/` - with user IDs
     - Each user ID folder contains `photo.jpg/png/webp`
   - `agents/` - with agent IDs
     - Each agent folder contains `photo.jpg/png/webp`

### 2. Verify Photos in Firestore
1. In Firebase Console, go to Firestore
2. Navigate to:
   - `clients/{uid}` - should have `photo` field with download URL
   - `clients/{uid}/family/{memberId}` - should have `photo` field
   - `agents/{uid}` - should have `photo` field

**Example Firestore Document**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photo": "https://storage.googleapis.com/...",
  "photoPath": "profiles/user123/photo.jpg",
  "updatedAt": "2024-06-05T..."
}
```

---

## Common Issues & Solutions

### Issue: Photo Uploads but Doesn't Display
**Possible Causes**:
1. Photo URL not being saved to Firestore
2. Image component not loading the URL
3. CORS issue with Firebase Storage

**Solution**:
1. Check browser console for errors
2. Check Firebase Storage to see if file exists
3. Copy the photo URL into browser address bar - can you see it?
4. Check Firestore document to see if `photo` field has a value

### Issue: "Permission denied" Error
**Possible Causes**:
1. User not logged in
2. Storage rules too restrictive
3. Firebase Storage bucket not configured

**Solution**:
1. Verify you're logged in (check user icon in header)
2. Check storage.rules is deployed to Firebase
3. Check Firebase Console > Storage exists and is enabled

### Issue: Upload Starts But Never Completes
**Possible Causes**:
1. Internet connection issue
2. File is corrupted
3. File is actually larger than 5MB

**Solution**:
1. Check internet connection
2. Try a different image file
3. Use an online file size checker tool

---

## What Changed

### Before Fix
- ❌ Family member photos uploaded with 'new' ID before member creation
- ❌ ID mismatch caused inconsistent storage/database paths
- ❌ Vague error messages
- ❌ Limited debugging information

### After Fix
- ✅ Unique IDs generated upfront
- ✅ Consistent paths for storage and Firestore
- ✅ Clear, actionable error messages
- ✅ Detailed console logging for debugging
- ✅ Better UX with progress indicators

---

## Performance Notes

### Upload Speed
- Typical JPG (1-2MB): 1-3 seconds
- PNG (2-5MB): 2-5 seconds
- Depends on internet speed

### Best Practices
1. Use JPG format for photos (smaller file size)
2. Compress images before upload (e.g., using TinyPNG)
3. Crop to square format for profile photos
4. Target size: 500x500 pixels or larger

---

## Support

If photo uploads aren't working:
1. ✅ Check browser console (F12) for error messages
2. ✅ Verify you're logged in
3. ✅ Try a different image file
4. ✅ Clear browser cache and refresh
5. ✅ Try in a different browser
6. ✅ Check Firebase Storage rules in console
7. Contact support with console error messages
