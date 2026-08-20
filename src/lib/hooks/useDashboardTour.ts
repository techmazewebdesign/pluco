import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DashboardGuideProgress, DashboardRole, TourStep } from '@/lib/types/dashboardTour';

export function useDashboardTour(
  userId: string | undefined,
  tourId: string,
  role: DashboardRole,
  steps: TourStep[]
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [progress, setProgress] = useState<DashboardGuideProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Firestore
  useEffect(() => {
    console.log('[useDashboardTour] Loading tour progress:', { userId, tourId, role });

    if (!userId) {
      console.log('[useDashboardTour] No userId, skipping load');
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    const loadProgress = async () => {
      try {
        const progressRef = doc(db, 'dashboardGuideProgress', userId);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          const progressData = progressSnap.data() as DashboardGuideProgress;
          console.log('[useDashboardTour] Found existing progress:', progressData);

          if (progressData.tourId !== tourId) {
            const nextProgress: DashboardGuideProgress = {
              userId,
              role,
              tourId,
              tourCompleted: false,
              tourExited: false,
              doNotShowAgain: false,
              currentStep: 0,
              lastViewedStep: 0,
              completedTours: progressData.completedTours || [],
              exitedTours: progressData.exitedTours || [],
              updatedAt: new Date().toISOString(),
            };
            setProgress(nextProgress);
            setCurrentStep(0);
            setIsActive(false);
            setShowWelcome(true);
            return;
          }

          setProgress(progressData);

          // Show welcome if: tour not completed, not exited, and not "do not show again"
          if (
            progressData.tourId === tourId &&
            !progressData.tourCompleted &&
            !progressData.tourExited &&
            !progressData.doNotShowAgain
          ) {
            console.log('[useDashboardTour] Showing welcome modal');
            setShowWelcome(true);
          } else {
            console.log('[useDashboardTour] Not showing welcome:', {
              sameId: progressData.tourId === tourId,
              completed: progressData.tourCompleted,
              exited: progressData.tourExited,
              doNotShowAgain: progressData.doNotShowAgain,
            });
          }
        } else {
          // First time user - show welcome
          console.log('[useDashboardTour] First time user, showing welcome');
          setShowWelcome(true);
          setProgress({
            userId,
            role,
            tourId,
            tourCompleted: false,
            tourExited: false,
            doNotShowAgain: false,
            currentStep: 0,
            lastViewedStep: 0,
            completedTours: [],
            exitedTours: [],
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('[useDashboardTour] Error loading tour progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [userId, tourId, role]);

  // Save progress to Firestore
  const saveProgress = useCallback(
    async (updates: Partial<DashboardGuideProgress>) => {
      if (!userId || !progress) return;

      try {
        const progressRef = doc(db, 'dashboardGuideProgress', userId);
        const updatedProgress = {
          ...progress,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await setDoc(progressRef, updatedProgress, { merge: true });
        setProgress(updatedProgress);
      } catch (error) {
        console.error('Error saving tour progress:', error);
      }
    },
    [userId, progress]
  );

  const startTour = useCallback(() => {
    setShowWelcome(false);
    setIsActive(true);
    setCurrentStep(0);
    saveProgress({
      tourExited: false,
      currentStep: 0,
    });
  }, [saveProgress]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      saveProgress({ currentStep: currentStep + 1 });
    }
  }, [currentStep, steps.length, saveProgress]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      saveProgress({ currentStep: currentStep - 1 });
    }
  }, [currentStep, saveProgress]);

  const exitTour = useCallback(() => {
    setIsActive(false);
    setShowWelcome(false);
    saveProgress({
      tourExited: true,
      currentStep,
    });
  }, [currentStep, saveProgress]);

  const finishTour = useCallback(() => {
    setIsActive(false);
    setShowWelcome(false);
    saveProgress({
      tourCompleted: true,
      currentStep: steps.length - 1,
      completedTours: progress?.completedTours
        ? [...progress.completedTours, tourId]
        : [tourId],
    });
  }, [tourId, steps.length, progress, saveProgress]);

  const restartTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    setShowWelcome(false);
    saveProgress({
      tourCompleted: false,
      tourExited: false,
      currentStep: 0,
    });
  }, [saveProgress]);

  const setDoNotShowAgain = useCallback(
    async (value: boolean) => {
      await saveProgress({
        doNotShowAgain: value,
      });
    },
    [saveProgress]
  );

  const reopenTour = useCallback(() => {
    setIsActive(true);
    setShowWelcome(false);
    setCurrentStep(0);
  }, []);

  return {
    // State
    currentStep,
    isActive,
    showWelcome,
    progress,
    isLoading,

    // Current step data
    currentStepData: steps[currentStep],
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,

    // Actions
    startTour,
    nextStep,
    prevStep,
    exitTour,
    finishTour,
    restartTour,
    setDoNotShowAgain,
    reopenTour,
  };
}
