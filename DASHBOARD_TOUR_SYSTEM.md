# Dashboard Tour System Documentation

## Overview

A professional, reusable guided tour system for Pluco Group dashboards. Provides step-by-step onboarding with welcome modals, highlighted elements, and persistent user preferences.

**Status:** ✅ Admin Dashboard Tour - Complete and Ready
**Next Dashboards:** Consultant, Customer Service, Client, Booking, FAQ Agent, Inquiry

## Architecture

### Components

```
src/components/tour/
├── TourWelcomeModal.tsx        # Welcome screen with options
├── TourOverlay.tsx             # Highlight overlay with SVG masking
├── GuideMeButton.tsx           # Restart tour button
├── HelpPanel.tsx               # Side panel with help content
└── DashboardTourProvider.tsx   # Context provider and orchestrator
```

### Types & Configuration

```
src/lib/
├── types/
│   └── dashboardTour.ts        # Tour types & interfaces
├── hooks/
│   └── useDashboardTour.ts     # Tour state management hook
└── tours/
    └── adminDashboardTour.ts   # Admin dashboard tour steps
```

### Firestore

```
dashboardGuideProgress/{userId}
├── userId: string
├── role: DashboardRole
├── tourId: string
├── tourCompleted: boolean
├── tourExited: boolean
├── doNotShowAgain: boolean
├── currentStep: number
├── lastViewedStep: number
├── completedTours: string[]
├── exitedTours: string[]
└── updatedAt: string
```

## Components Reference

### TourWelcomeModal

Welcome screen shown on first visit.

**Props:**
```typescript
{
  isOpen: boolean;                    // Show/hide modal
  title: string;                      // Welcome title
  description: string;                // Welcome description
  onContinue: () => void;            // Continue to tour
  onExit: () => void;                // Exit tour
  onDoNotShowAgain: (value: boolean) => void; // Set preference
}
```

**Behavior:**
- Shows on first admin visit
- "Do not show this tour again" checkbox
- Continue Tour / Exit Tour buttons
- Saves preference to Firestore

### TourOverlay

Step-by-step highlight with explanation card.

**Props:**
```typescript
{
  isActive: boolean;
  selector: string;                   // CSS selector for element
  title: string;                      // Step title
  description: string;                // Step explanation
  position?: 'top'|'bottom'|'left'|'right';
  highlightPadding?: number;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onFinish: () => void;
  onRestart: () => void;
}
```

**Features:**
- SVG masked overlay (dimmed background)
- Animated dashed border around element
- Auto-positioning explanation card
- Back/Next/Exit/Finish/Restart buttons
- Progress bar showing tour progress
- Responsive on mobile

### GuideMeButton

Header button to restart tour.

**Props:**
```typescript
{
  onClick: () => void;
  tourCompleted?: boolean;            // Shows if tour was completed
}
```

**Features:**
- Gold (#C9A35A) icon
- Pulse animation if tour not completed
- Tooltip showing function

### HelpPanel

Slide-out side panel with help items.

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  items: HelpItem[];                  // { title, description, icon? }
  title: string;                      // Panel title
}
```

**Features:**
- Slides in from right
- Backdrop to close
- Gradient navy header
- Scrollable content area
- Smooth animations

### DashboardTourProvider

Context provider wrapping dashboard.

**Props:**
```typescript
{
  children: ReactNode;
  userId: string | undefined;
  userRole: DashboardRole;
  tour: DashboardTour;
  onTourStart?: () => void;
  onTourExit?: () => void;
  onTourFinish?: () => void;
}
```

**Responsibilities:**
- Manages tour state via useDashboardTour
- Renders WelcomeModal, Overlay, and children
- Exposes `window.__dashboardTour` for external access
- Persists progress to Firestore

## Hook Reference

### useDashboardTour

Custom hook managing tour logic and Firestore persistence.

```typescript
const {
  // State
  currentStep: number;
  isActive: boolean;
  showWelcome: boolean;
  progress: DashboardGuideProgress | null;
  isLoading: boolean;

  // Current step info
  currentStepData: TourStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;

  // Actions
  startTour: () => void;              // Start from step 0
  nextStep: () => void;               // Go to next
  prevStep: () => void;               // Go to previous
  exitTour: () => void;               // Exit and save state
  finishTour: () => void;             // Complete tour
  restartTour: () => void;            // Restart from step 0
  setDoNotShowAgain: (value: boolean) => void;
  reopenTour: () => void;             // Reopen tour
} = useDashboardTour(userId, tourId, role, steps);
```

**Features:**
- Loads progress from Firestore on mount
- Auto-shows welcome if not completed
- Saves state after each action
- Handles Firestore errors gracefully

## Admin Dashboard Tour

12-step tour explaining all major sections.

### Step 1: Total Clients
- **Selector:** `[data-tour="admin-total-clients"]`
- **Explains:** Card showing total client count

### Step 2: Pending Leads
- **Selector:** `[data-tour="admin-pending-leads"]`
- **Explains:** New leads waiting for review

### Step 3: Active Cases
- **Selector:** `[data-tour="admin-active-cases"]`
- **Explains:** Currently active cases

### Step 4: AI Agents
- **Selector:** `[data-tour="admin-ai-agents"]`
- **Explains:** AI agent status (FAQ chatbot)

### Step 5: Quick Access
- **Selector:** `[data-tour="admin-quick-access"]`
- **Explains:** Quick action buttons overview

### Step 6: Enquiry Bookings
- **Selector:** `[data-tour="admin-enquiry-bookings"]`
- **Explains:** Booking management access

### Step 7: AI Leads
- **Selector:** `[data-tour="admin-ai-leads"]`
- **Explains:** Chatbot lead management

### Step 8: AI Agents Management
- **Selector:** `[data-tour="admin-ai-agents-mgmt"]`
- **Explains:** AI configuration and monitoring

### Step 9: Consultants
- **Selector:** `[data-tour="admin-consultants"]`
- **Explains:** Consultant profile management

### Step 10: User Management
- **Selector:** `[data-tour="admin-user-management"]`
- **Explains:** User account and role control

### Step 11: Notifications
- **Selector:** `[data-tour="admin-notifications"]`
- **Explains:** Important alerts and updates

### Step 12: Help Panel
- **Selector:** `button[title="View help panel"]`
- **Explains:** Help resources access

## Tour Behavior

### First Visit
1. Check `dashboardGuideProgress/{userId}`
2. If not found or `tourCompleted: false` and `doNotShowAgain: false`
3. Show TourWelcomeModal
4. User chooses Continue or Exit
5. If Continue → Start tour from step 0

### During Tour
- User navigates with Next/Back buttons
- Progress saved after each step
- Can exit anytime (saves lastViewedStep)
- Mobile: Card repositions automatically
- Highlight follows element during scroll

### On Finish
- Set `tourCompleted: true`
- Set `completedTours: [..., tourId]`
- Save `updatedAt`
- Show completion message
- Allow Restart from this modal

### Do Not Show Again
- If checked, set `doNotShowAgain: true`
- Welcome modal won't show next visit
- Guide Me button still accessible
- Can be reset if needed (admin only later)

## Integrating Tour into New Dashboard

### Step 1: Create Tour Config

`src/lib/tours/consultantDashboardTour.ts`

```typescript
import { DashboardTour } from '@/lib/types/dashboardTour';

const steps = [
  {
    id: 'consultant-metric-card',
    selector: '[data-tour="consultant-metrics"]',
    title: 'Your Metrics',
    description: 'See your consultation count, ratings, and earnings.',
    position: 'bottom',
  },
  // ... more steps
];

export const consultantDashboardTour: DashboardTour = {
  id: 'consultant-dashboard-tour',
  role: 'consultant',
  title: 'Welcome to your Consultant Dashboard',
  description: 'Learn how to manage your profile and consultations.',
  steps,
};
```

### Step 2: Add Data Attributes

In dashboard component, add `data-tour="..."` to elements:

```tsx
<div data-tour="consultant-metrics" className="...">
  {/* Content */}
</div>
```

### Step 3: Import Tour Provider

```tsx
import DashboardTourProvider from '@/components/tour/DashboardTourProvider';
import { consultantDashboardTour } from '@/lib/tours/consultantDashboardTour';
import GuideMeButton from '@/components/tour/GuideMeButton';
import HelpPanel from '@/components/tour/HelpPanel';
```

### Step 4: Wrap Dashboard with Provider

```tsx
export default function ConsultantDashboard() {
  const { user } = useAuth();
  const [showHelpPanel, setShowHelpPanel] = useState(false);

  const helpItems = [
    { title: 'Metrics', description: '...' },
    // ... more items
  ];

  return (
    <>
      <DashboardTourProvider
        userId={user?.uid}
        userRole="consultant"
        tour={consultantDashboardTour}
      >
        {/* Dashboard content */}
      </DashboardTourProvider>

      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        title="Consultant Dashboard Guide"
        items={helpItems}
      />
    </>
  );
}
```

### Step 5: Add Guide Me Button to Header

```tsx
<GuideMeButton
  onClick={() => (window as any).__dashboardTour?.reopenTour?.()}
/>
```

### Step 6: Add Help Panel Button

```tsx
<button
  onClick={() => setShowHelpPanel(true)}
  title="View help panel"
>
  <BookOpen className="w-5 h-5" />
</button>
```

## Styling & Customization

### Colors
- Navy: `#071C3C` (primary)
- Gold: `#C9A35A` (accent)
- Gray: `#5E6470` (text)
- Light gray: `#F0EDE6` (backgrounds)

### Responsive
- Mobile: Card shows below element
- Tablet: Position-aware card placement
- Desktop: Full-width with auto-positioning

### Animations
- Smooth opacity/scale transitions
- Dashed border animation on highlight
- Pulse on uncompleted tour (Guide Me button)
- Auto-scroll to highlighted element

## Security

### Access Control
- Tour visible only to authenticated users
- Admin tour restricted to `role: 'admin'`
- Each user has own progress document
- Firestore rules: users can read/write own progress

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dashboardGuideProgress/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read, write: if request.auth.token.role == 'admin';
    }
  }
}
```

## Performance

- Lightweight: 1000+ lines total
- No external dependencies (uses Framer Motion already)
- SVG overlay: GPU-accelerated
- Lazy loading: Tour data loaded on mount
- Minimal re-renders: Isolated state

## Testing Checklist

### Basic Functionality
- [ ] Admin visits dashboard → welcome modal shows
- [ ] Continue Tour → tour starts
- [ ] Next button → goes to next step
- [ ] Back button → goes to previous step
- [ ] Exit Tour → closes tour, saves state
- [ ] Finish Tour → completes tour, saves
- [ ] "Do not show again" → prevents modal

### Guide Me Button
- [ ] Button visible in header
- [ ] Pulse animation if not completed
- [ ] Click → reopens tour from step 0
- [ ] No pulse after completion
- [ ] Still works after exiting

### Help Panel
- [ ] Help button in header
- [ ] Click → opens panel
- [ ] Close button → closes panel
- [ ] Backdrop click → closes panel
- [ ] Items display correctly
- [ ] Scrollable if many items

### Highlight & Overlay
- [ ] Element highlight follows selector
- [ ] SVG overlay dims background
- [ ] Dashed border animates
- [ ] Card positions below element
- [ ] Mobile: card repositions
- [ ] Scroll: highlight follows element

### Firestore
- [ ] First visit → creates document
- [ ] Progress saves after each step
- [ ] Reload page → continues from last step
- [ ] Do not show again → persists
- [ ] completedTours → array updated
- [ ] updatedAt → current timestamp

### Mobile
- [ ] Welcome modal responsive
- [ ] Overlay works on mobile viewport
- [ ] Card fits on small screens
- [ ] Touch interactions work
- [ ] Back/Next buttons accessible
- [ ] No horizontal scroll

### Multiple Dashboards
- [ ] Each dashboard has own tour
- [ ] Progress tracked per dashboard
- [ ] Guide Me button works for each
- [ ] Help Panel independent

## Known Limitations

- ⚠️ Tour steps must have valid selectors (no dynamic generation)
- ⚠️ Elements must be in viewport for highlighting
- ⚠️ Heavy animations may impact low-end devices
- ⚠️ RTL (right-to-left) positioning needs adjustment

## Future Enhancements

- Pagination for very long tours (15+ steps)
- Keyboard navigation (arrows, escape)
- Analytics tracking (which steps most used)
- Admin panel to manage tour settings
- Custom themes (colors, fonts)
- Video embeds in tour steps
- Conditional steps based on user role
- Tour templates for quick setup
- Internationalization (multi-language tours)

## Debugging

### Tour not showing
1. Check user UID is loaded
2. Verify `dashboardGuideProgress` document exists
3. Check `tourCompleted` and `doNotShowAgain` flags
4. Inspect browser console for errors

### Highlight misaligned
1. Verify selector is correct
2. Check element is visible
3. Scroll to element manually
4. Element position may have changed

### Progress not saving
1. Check Firestore rules allow write
2. Verify network connectivity
3. Check browser console for Firestore errors
4. Verify user UID matches document

## Support

For issues or improvements:
1. Check troubleshooting above
2. Review component props
3. Check Firestore security rules
4. Test with different user roles
5. Check browser console for errors

## Files & Locations

| File | Purpose |
|------|---------|
| `src/components/tour/TourWelcomeModal.tsx` | Welcome screen |
| `src/components/tour/TourOverlay.tsx` | Highlight overlay |
| `src/components/tour/GuideMeButton.tsx` | Restart button |
| `src/components/tour/HelpPanel.tsx` | Help sidebar |
| `src/components/tour/DashboardTourProvider.tsx` | Provider component |
| `src/lib/hooks/useDashboardTour.ts` | Tour hook |
| `src/lib/types/dashboardTour.ts` | TypeScript types |
| `src/lib/tours/adminDashboardTour.ts` | Admin tour config |
| `src/app/admin/dashboard/page.tsx` | Admin dashboard |
