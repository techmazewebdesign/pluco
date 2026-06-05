# Vercel Environment Variables Setup

## Quick Setup Instructions

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project "2048"
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Copy and paste each one. The values depend on your setup.

---

## Required Variables (MUST ADD)

### 1. Email Service - Resend API

**Variable Name:** `RESEND_API_KEY`
**Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
**Get Value From:** 
- Go to https://resend.com/api-keys
- Copy your API key
- Format: starts with `re_`

**Variable Name:** `RESEND_FROM`
**Value:** `PLUCO GROUP <noreply@plucogroup.com>`
**Note:** Must match Resend verified sender domain

---

### 2. Application URLs

**Variable Name:** `NEXT_PUBLIC_APP_URL`
**Value:** `https://yoursite.com` (production) or `https://www.plucogroup.com`
**Note:** 
- This is your production domain
- Must start with https://
- Used in email links

**Variable Name:** `NEXT_PUBLIC_ADMIN_EMAIL`
**Value:** `admin@yourcompany.com`
**Note:** 
- Email address where admin receives weekly reports
- Use a real email that will receive messages
- Example: `rooz.ostad@gmail.com`

---

### 3. Cron Job Security

**Variable Name:** `CRON_SECRET`
**Value:** Generate a strong random string
**How to Generate:**
```bash
# Use one of these commands:
# Option 1 (macOS/Linux):
openssl rand -base64 32

# Option 2 (Online):
https://www.random.org/passwords/ (32 characters, all symbols)

# Option 3 (Simple):
aBcDeFgHiJkLmNoPqRsT uVwXyZaBcDeFgHiJkL
```
**Example Value:** `7X#mK9$pL2@wQ4vN6&bZ1tH8yJ3rF5sD`

**Note:** 
- Should be long and random
- Used to authenticate weekly report cron job
- Keep it secret
- Used in Authorization header for report endpoint

---

## Already Configured (DO NOT CHANGE)

These Firebase variables should already be set. Verify they exist but don't modify:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

If any are missing, add them from your Firebase project settings.

---

## Step-by-Step in Vercel UI

### For Each Variable:

1. Click "Add" or "Edit"
2. **Key/Name:** Type the variable name exactly as shown above
3. **Value:** Paste the value
4. **Environments:** Select "Production" (check all that apply)
5. Click "Save"

### Example Screenshot Flow:
```
[Add New Variable]
  Key: RESEND_API_KEY
  Value: re_xxxxxxxxxxx
  Environments: Production ✓ Preview ✓ Development ✓
  [Save]
```

---

## Complete Setup List

Copy this table for reference:

| Variable Name | Example Value | Source |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxx...` | Resend.com API Keys |
| `RESEND_FROM` | `PLUCO GROUP <noreply@plucogroup.com>` | Your email domain |
| `NEXT_PUBLIC_APP_URL` | `https://www.plucogroup.com` | Your domain |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `admin@yourcompany.com` | Your admin email |
| `CRON_SECRET` | `7X#mK9$pL2@wQ4vN6&bZ1tH8yJ3rF5sD` | Generate random |

---

## Verification Checklist

After adding all variables:

- [ ] All 4 new variables added
- [ ] All values filled in (no empty values)
- [ ] No typos in variable names
- [ ] Production environment selected
- [ ] Clicked "Save" for each
- [ ] Refreshed page to see variables listed

---

## Testing the Setup

### Test Resend API Key
```bash
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "admin@yourcompany.com",
    "subject": "Test",
    "html": "Test email"
  }'
```

Expected response: `200` (success)

### Test App URL
Visit: `https://yoursite.com/consultant/dashboard` after deployment

### Test Weekly Report Endpoint
```bash
curl -X POST https://yoursite.com/api/reports/weekly-consultant-report \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Expected: `200` with summary data or `401` if secret wrong

---

## After Adding Variables

1. **Redeploy** your application:
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger auto-deploy

2. **Variables take effect** on next deployment
   - Old deployments won't have access to variables
   - Make sure deployment completes successfully

3. **Verify in logs**:
   - After deployment, functions can access env vars
   - If still error, check function logs in Vercel dashboard

---

## Troubleshooting

### Error: "Email service not configured"
- [ ] Check `RESEND_API_KEY` is set
- [ ] Check it starts with `re_`
- [ ] Verify deployment completed
- [ ] Check Vercel logs for actual error

### Error: "Cron unauthorized"
- [ ] Check `CRON_SECRET` is exactly what you used in curl command
- [ ] Case-sensitive comparison
- [ ] Verify no extra spaces

### Error: "App URL not found"
- [ ] Check `NEXT_PUBLIC_APP_URL` matches your domain
- [ ] Make sure starts with `https://`
- [ ] No trailing slash

### Emails still not working
- [ ] Verify `RESEND_FROM` matches Resend verified domain
- [ ] Check Resend dashboard for bounce/error
- [ ] Verify `NEXT_PUBLIC_ADMIN_EMAIL` is real email
- [ ] Test with sandbox email first

---

## Security Best Practices

✅ **DO:**
- [ ] Keep `CRON_SECRET` private
- [ ] Don't share API keys in chat/email
- [ ] Use strong random secret
- [ ] Regularly rotate Resend API keys
- [ ] Review email configuration monthly

❌ **DON'T:**
- [ ] Commit env vars to git
- [ ] Share API keys in PRs
- [ ] Log API keys to console
- [ ] Use same secret across multiple services
- [ ] Post API keys in public channels

---

## For Development/Testing

If you want to test locally before deploying to production:

### Create `.env.local` file:
```env
RESEND_API_KEY=re_test_key_here
RESEND_FROM=Test <noreply@yoursite.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=your-test-email@gmail.com
CRON_SECRET=test-secret-123
```

### Run locally:
```bash
npm run dev
```

Variables loaded from `.env.local` automatically.

### Then add to Vercel:
Copy the same values to Vercel dashboard (update domain for production).

---

## Complete Environment Variables Summary

**4 Variables to Add:**
1. ✅ `RESEND_API_KEY` - From Resend dashboard
2. ✅ `RESEND_FROM` - Email sender address
3. ✅ `NEXT_PUBLIC_APP_URL` - Your domain
4. ✅ `NEXT_PUBLIC_ADMIN_EMAIL` - Admin email

**Already Set (Don't change):**
- Firebase credentials (7 variables)

**Total: 11 variables** (4 new + 7 Firebase existing)

---

## Deployment Checklist

Before you push/deploy:
- [ ] All 4 variables added to Vercel
- [ ] Verified no typos
- [ ] Tested Resend API key works
- [ ] Admin email is valid and monitored
- [ ] Cron secret generated securely
- [ ] Ready to redeploy

---

## Questions?

If any variable is unclear:
1. Check `PRE_DEPLOYMENT_SUMMARY.md` for detailed info
2. Check `TECHNICAL_VALIDATION_REPORT.md` for setup details
3. Check `CONSULTANT_SYSTEM_GUIDE.md` for configuration

---

**Setup Estimated Time:** 5-10 minutes  
**Verification Time:** 2-3 minutes  
**Redeploy Time:** 2-5 minutes  
**Total:** ~15 minutes

**Status:** Ready to configure ✅
