'use client';

import { ReactNode } from 'react';
import { useDashboardTour } from '@/lib/hooks/useDashboardTour';
import { DashboardTour, DashboardRole } from '@/lib/types/dashboardTour';
import TourWelcomeModal from './TourWelcomeModal';
import TourOverlay from './TourOverlay';

interface DashboardTourProviderProps {
  children: ReactNode;
  userId: string | undefined;
  userRole: DashboardRole;
  tour: DashboardTour;
  onTourStart?: () => void;
  onTourExit?: () => void;
  onTourFinish?: () => void;
}

export default function DashboardTourProvider({
  children,
  userId,
  userRole,
  tour,
  onTourStart,
  onTourExit,
  onTourFinish,
}: DashboardTourProviderProps) {
  const {
    currentStep,
    isActive,
    showWelcome,
    isLoading,
    currentStepData,
    isFirstStep,
    isLastStep,
    totalSteps,
    startTour,
    nextStep,
    prevStep,
    exitTour,
    finishTour,
    restartTour,
    setDoNotShowAgain,
    reopenTour,
  } = useDashboardTour(userId, tour.id, userRole, tour.steps);

  // Expose reopen method via window for external access
  if (typeof window !== 'undefined') {
    (window as any).__reopenTour = reopenTour;
  }

  if (isLoading) {
    return <>{children}</>;
  }

  const handleTourStart = () => {
    startTour();
    onTourStart?.();
  };

  const handleTourExit = () => {
    exitTour();
    onTourExit?.();
  };

  const handleTourFinish = () => {
    finishTour();
    onTourFinish?.();
  };

  return (
    <>
      {/* Welcome Modal */}
      <TourWelcomeModal
        isOpen={showWelcome}
        title={tour.title}
        description={tour.description}
        onContinue={handleTourStart}
        onExit={handleTourExit}
        onDoNotShowAgain={setDoNotShowAgain}
      />

      {/* Tour Overlay */}
      {currentStepData && (
        <TourOverlay
          isActive={isActive}
          selector={currentStepData.selector}
          title={currentStepData.title}
          description={currentStepData.description}
          position={currentStepData.position}
          highlightPadding={currentStepData.highlightPadding}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={nextStep}
          onPrev={prevStep}
          onExit={handleTourExit}
          onFinish={handleTourFinish}
          onRestart={restartTour}
        />
      )}

      {/* Expose controls for external use */}
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__dashboardTour = {
                reopenTour: () => window.__reopenTour?.(),
                startTour: () => window.__reopenTour?.(),
              };
            `,
          }}
        />
      )}

      {children}
    </>
  );
}
