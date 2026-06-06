# FAQ Chatbot Setup & Implementation Guide

## Overview

The FAQ Chatbot is an AI-powered assistant that answers common questions about Pluco Group services, guides visitors toward bookings/inquiries, and creates leads that integrate with the existing customer-service dashboard.

**Safety First:** The chatbot uses safe language and never guarantees legal outcomes. All responses are reviewed by Claude's safety guidelines.

## Features

- ✅ Floating chat button (bottom-right corner)
- ✅ Conversation history saved in Firestore
- ✅ FAQ quick-start buttons
- ✅ Private inquiry form collection
- ✅ Lead creation and tracking
- ✅ Customer-service dashboard integration
- ✅ Admin visibility and lead management
- ✅ API key security (server-side only)
- ✅ Fallback responses if API fails

## Architecture

### Frontend Components

```
src/components/chatbot/
├── ChatbotWidget.tsx         # Floating button + window manager
├── ChatWindow.tsx            # Main chat UI & message handling
└── InquiryForm.tsx           # Visitor contact info collection
```

### Backend API

```
src/app/api/faq-chat/route.ts # Claude API integration (server-side)
```

### Dashboard Integration

```
src/components/dashboard/ChatbotLeads.tsx  # Customer-service dashboard widget
```

### Types

```
src/lib/types/chatbot.ts      # TypeScript interfaces
```

### Layout Integration

```
src/app/layout.tsx            # Added ChatbotWidget to root layout
```

## Firestore Collections

### chatSessions/{sessionId}
Stores conversation metadata and lead information.

**Fields:**
```
{
  sessionId: string              // Unique session ID
  createdAt: string             // ISO timestamp
  updatedAt: string             // ISO timestamp
  visitorName?: string          // Collected from inquiry form
  visitorEmail?: string         // Collected from inquiry form
  visitorPhone?: string         // Collected from inquiry form (WhatsApp)
  serviceInterest?: string      // Selected service category
  leadStatus: LeadStatus        // 'new' | 'qualified' | 'needs-follow-up' | 'converted'
  assignedTo?: string           // Customer-service staff UID (optional)
  source: 'faq-chatbot'         // Always 'faq-chatbot'
  notes?: string                // Internal notes (optional)
}
```

**Security Rules:**
- Public: Can create new sessions
- Customer-service: Can read all sessions
- Admins: Can read/write all sessions

### chatSessions/{sessionId}/messages/{messageId}
Stores individual messages in a conversation.

**Fields:**
```
{
  role: 'user' | 'assistant' | 'system'  // Message source
  content: string                         // Message text
  createdAt: string                      // ISO timestamp
}
```

**Security Rules:**
- Public: Can create messages (API calls)
- Customer-service: Can read messages
- Admins: Can read/write messages

### bookings (Enhanced)
When a visitor submits an inquiry through the chatbot, a record is created in the bookings collection.

**Additional Fields from Chatbot:**
```
{
  // ... existing booking fields ...
  sessionId: string              // Link to chat session
  source: 'faq-chatbot'         // Indicates source
}
```

## Environment Variables

Add to `.env.local`:

```bash
# Claude API for chatbot
ANTHROPIC_API_KEY=sk_ant_... # Get from https://console.anthropic.com
```

**Important:** Never expose this key in the frontend. The API route handles all Claude calls server-side.

## How It Works

### 1. Visitor Opens Chat
- User clicks the floating chat button (bottom-right)
- `ChatbotWidget` generates or retrieves a `sessionId` from localStorage
- `ChatWindow` loads existing session or creates new one
- Welcome message is displayed with FAQ buttons

### 2. Visitor Asks Questions
- User clicks FAQ button or types a question
- Message is saved to `chatSessions/{sessionId}/messages/{messageId}`
- Request sent to `/api/faq-chat` with conversation history
- Claude API returns a safe, helpful response
- Response is displayed and saved to Firestore

### 3. Visitor Provides Contact Info
- User clicks "Start Private Inquiry" button
- `InquiryForm` collects: name, email, phone, service, nationality, residence country
- Form data updates the `chatSessions/{sessionId}` document
- New booking record created in `bookings` collection
- System message confirms receipt

### 4. Customer-Service Sees New Lead
- Dashboard automatically loads `chatSessions` with `source: 'faq-chatbot'`
- Staff can view lead details, conversation history, and contact info
- Can change lead status: new → qualified → needs-follow-up → converted
- Can view full conversation transcript

### 5. Admin Management
- Admins can see all chatbot leads and conversations
- Can assign leads to customer-service staff
- Can add internal notes
- Can track conversion metrics

## API Route: /api/faq-chat

**Endpoint:** `POST /api/faq-chat`

**Request:**
```json
{
  "sessionId": "session_1717718400000_abc123",
  "userMessage": "Can Pluco help with EU residency?",
  "conversationHistory": [
    { "role": "assistant", "content": "Welcome..." },
    { "role": "user", "content": "Previous question..." }
  ]
}
```

**Response:**
```json
{
  "response": "Yes, Pluco Group specializes in EU residency programs. We help clients from around the world secure residency in EU countries through investment, work, or other qualifying pathways. Each case is unique and depends on your personal situation, nationality, and goals. Would you like to know more about specific EU countries or our consultation process?",
  "sessionId": "session_1717718400000_abc123"
}
```

**System Prompt (Safety):**
- Never guarantees visa/residency/citizenship outcomes
- Uses safe language: "This depends on your personal case"
- Refers to consultation for case-specific advice
- Rejects illegal requests
- Explains that outcomes require team review

## System Prompt Details

The chatbot uses a carefully crafted system prompt that:

1. **Sets Role:** "You are Pluco Assistant, a professional FAQ assistant"
2. **Defines Services:** Lists all Pluco service categories
3. **Enforces Safety:**
   - No guarantees of outcomes
   - No legal advice
   - Encourages private inquiry/consultation
   - Safe language guidelines
   - Rejects illegal requests
4. **Guides Responses:** Asks clarifying questions, suggests next steps

**Current System Prompt Location:** `src/app/api/faq-chat/route.ts` (top of file)

To update the system prompt:
1. Edit the `SYSTEM_PROMPT` constant in `/api/faq-chat/route.ts`
2. Restart the development server
3. Test with the chatbot

## Testing Checklist

### 1. Chat Button & Window
- [ ] Floating button appears bottom-right on all pages
- [ ] Button animates on hover
- [ ] Clicking button opens chat window
- [ ] Chat window has Pluco branding
- [ ] Closing button works
- [ ] Window animates smoothly

### 2. Welcome & FAQ Buttons
- [ ] Welcome message displays on first load
- [ ] 6 FAQ buttons appear below welcome message
- [ ] Clicking FAQ button sends question to chatbot
- [ ] All FAQ buttons work correctly

### 3. Chat Functionality
- [ ] User message appears in chat
- [ ] Loading indicator shows while waiting
- [ ] Assistant response displays
- [ ] Messages are persisted in Firestore
- [ ] Conversation history works across page reloads
- [ ] Chat scrolls to bottom on new messages

### 4. Private Inquiry Form
- [ ] "Start Private Inquiry" button appears
- [ ] Form modal opens
- [ ] All fields are required: name, email, phone, service, nationality, residence
- [ ] Form validates email format
- [ ] Form validates required fields
- [ ] Submit saves to Firestore
- [ ] System message confirms submission
- [ ] Booking record created in `bookings` collection

### 5. Firestore Integration
- [ ] New session created in `chatSessions/{sessionId}`
- [ ] Messages saved to `chatSessions/{sessionId}/messages/{messageId}`
- [ ] Session metadata updated (visitorName, visitorEmail, etc.)
- [ ] Lead status changes tracked
- [ ] Booking record created with correct fields

### 6. Customer-Service Dashboard
- [ ] ChatbotLeads component loads without errors
- [ ] Recent leads display in list (sorted by recency)
- [ ] Lead status badges show correct color
- [ ] Clicking lead shows details on right side
- [ ] Conversation history displays in detail panel
- [ ] Status buttons allow changing lead status
- [ ] Contact details visible and complete
- [ ] Timestamps display correctly

### 7. Security & API
- [ ] ANTHROPIC_API_KEY not exposed in browser
- [ ] API calls only from server (`/api/faq-chat`)
- [ ] Network tab shows no API key in requests
- [ ] Fallback response works if API fails
- [ ] Invalid requests handled gracefully

### 8. Cross-Page Testing
- [ ] Chat works on homepage
- [ ] Chat works on services pages
- [ ] Chat works on contact page
- [ ] Chat works on login page (no auth required)
- [ ] Chat session persists across page navigation
- [ ] Chat button Z-index correct (not hidden by other elements)

### 9. Browser & Mobile
- [ ] Responsive on mobile (max-width: 100vw)
- [ ] Touch interactions work on mobile
- [ ] Chat doesn't overlap critical page content
- [ ] Form fields mobile-friendly
- [ ] Keyboard input works on mobile

### 10. Error Handling
- [ ] Network error shows graceful message
- [ ] API timeout handled
- [ ] Invalid Firestore reads handled
- [ ] Form submission error messages display
- [ ] User can retry after errors

## Monitoring & Analytics

### Firestore Queries to Track:
```javascript
// New chatbot leads today
const today = new Date();
today.setHours(0,0,0,0);
const q = query(
  collection(db, 'chatSessions'),
  where('source', '==', 'faq-chatbot'),
  where('createdAt', '>=', today.toISOString())
);

// Qualified leads (provided contact info)
const qualified = query(
  collection(db, 'chatSessions'),
  where('source', '==', 'faq-chatbot'),
  where('leadStatus', '==', 'qualified')
);

// Conversion rate
const converted = query(
  collection(db, 'chatSessions'),
  where('source', '==', 'faq-chatbot'),
  where('leadStatus', '==', 'converted')
);
```

### Metrics to Track:
- Total chatbot conversations
- Average messages per conversation
- Inquiry form completion rate
- Lead qualification rate
- Conversion rate
- Time from lead to conversion
- Most asked questions (by FAQ button clicks)
- Service interests distribution

## Troubleshooting

### Issue: Chat button doesn't appear
**Solution:**
- Ensure `ChatbotWidget` is imported in `src/app/layout.tsx`
- Check browser console for errors
- Verify z-index is high enough (z-40)
- Check if another element has z-50 that's blocking it

### Issue: Messages not saving to Firestore
**Solution:**
- Verify Firestore rules allow the operations
- Check Firestore authentication is working
- Ensure `db` is properly initialized
- Look for Firestore errors in console

### Issue: Assistant not responding
**Solution:**
- Check `ANTHROPIC_API_KEY` is set in environment
- Verify API key is valid (test in Node REPL)
- Check `/api/faq-chat` receives the request (Network tab)
- Look for 500 errors in API response
- Enable verbose logging in API route

### Issue: Inquiry form not submitting
**Solution:**
- Validate form fields fill correctly
- Check Firestore rules allow creating bookings
- Verify session ID is valid
- Check Firestore errors in console
- Ensure email validation passes

### Issue: Dashboard chatbot leads not loading
**Solution:**
- Verify user has `role: 'customer-service'` custom claim
- Check Firestore rules allow reading `chatSessions`
- Ensure `ChatbotLeads` component is imported
- Check browser console for JavaScript errors
- Verify Firestore data exists with correct structure

## Performance Considerations

- **Session Storage:** LocalStorage stores session ID (small, ~40 bytes)
- **Message History:** Keep in browser memory (loaded from Firestore once)
- **Firestore Reads:** 
  - 1 read per page load (session data)
  - 1 read per conversation load (messages)
  - Multiple reads for customer-service dashboard
  - Consider indexing on `source` and `createdAt`
- **API Calls:** 1 call per user message (rate limit if needed)
- **Firebase Storage:** No images stored (text-only)

## Future Enhancements

1. **Multi-language Support:** Translate chatbot responses
2. **Sentiment Analysis:** Auto-escalate angry/frustrated users
3. **Custom FAQ Training:** Train Claude on Pluco-specific docs
4. **Handoff to Live Chat:** Escalate to human agent
5. **Rich Messages:** Include links, buttons, forms in responses
6. **Analytics Dashboard:** Detailed metrics and insights
7. **A/B Testing:** Test different welcome messages/FAQ buttons
8. **Webhook Notifications:** Alert staff of new qualified leads

## Files Changed Summary

**New Files Created:**
- `src/lib/types/chatbot.ts` - TypeScript types (22 lines)
- `src/components/chatbot/ChatbotWidget.tsx` - Floating button (54 lines)
- `src/components/chatbot/ChatWindow.tsx` - Chat UI & logic (217 lines)
- `src/components/chatbot/InquiryForm.tsx` - Lead collection form (167 lines)
- `src/app/api/faq-chat/route.ts` - Claude API integration (76 lines)
- `src/components/dashboard/ChatbotLeads.tsx` - Admin dashboard (277 lines)
- `FAQ_CHATBOT_SETUP.md` - This documentation

**Files Modified:**
- `src/app/layout.tsx` - Added ChatbotWidget import & JSX
- `firestore.rules` - Added chatSessions rules
- `src/app/customer-service/dashboard/page.tsx` - Added ChatbotLeads section

**Environment Variables:**
- `ANTHROPIC_API_KEY` - Required for Claude API

## Deployment Checklist

- [ ] Set `ANTHROPIC_API_KEY` in Vercel environment variables
- [ ] Verify Firestore rules deployed with `firebase deploy --only firestore:rules`
- [ ] Test chatbot on staging environment
- [ ] Monitor error logs first 24 hours
- [ ] Verify customer-service dashboard loads chatbot leads
- [ ] Announce new chatbot to team
- [ ] Set up lead assignment workflow
- [ ] Train staff on chatbot lead management

## Support & Maintenance

For issues or feature requests:
1. Check troubleshooting section above
2. Review browser console for errors
3. Check Firestore rules and data structure
4. Verify API key is valid
5. Contact development team with error details

## API Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Per-IP rate limit (e.g., 10 requests per minute)
- Per-session rate limit (e.g., 1 request per 2 seconds)
- Daily quota (e.g., 1000 requests per day)

Add to `/api/faq-chat/route.ts` if needed.
