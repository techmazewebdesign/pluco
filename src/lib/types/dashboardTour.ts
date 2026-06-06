// Dashboard Tour Types

export type DashboardRole = 'admin' | 'consultant' | 'customer-service' | 'client' | 'booking';

export interface TourStep {
  id: string;
  selector: string; // CSS selector or data attribute
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
  skipButton?: boolean;
}

export interface DashboardTour {
  id: string; // e.g., 'admin-dashboard-tour', 'consultant-dashboard-tour'
  role: DashboardRole;
  title: string;
  description: string;
  steps: TourStep[];
}

export interface DashboardGuideProgress {
  userId: string;
  role: DashboardRole;
  tourId: string;
  tourCompleted: boolean;
  tourExited: boolean;
  doNotShowAgain: boolean;
  currentStep: number;
  lastViewedStep: number;
  completedTours: string[];
  exitedTours: string[];
  updatedAt: string;
}

export interface TourHighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
