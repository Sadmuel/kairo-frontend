import {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export interface TutorialStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    targetSelector: '[data-tutorial="dashboard-header"]',
    title: 'Welcome to Kairo!',
    description:
      'This is your dashboard — your daily command center. It shows your progress, schedule, and upcoming events at a glance.',
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'today-progress',
    targetSelector: '[data-tutorial="today-progress"]',
    title: "Today's Progress",
    description:
      "This shows how much of today's schedule you've completed. Aim for 100% to keep your streak alive!",
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'time-blocks',
    targetSelector: '[data-tutorial="time-blocks-widget"]',
    title: 'Time Blocks',
    description:
      'Your day is organized into time blocks. Each block has a time range, todos, and notes. Navigate to the Calendar to manage them!',
    placement: 'top',
    route: '/dashboard',
  },
  {
    id: 'streaks',
    targetSelector: '[data-tutorial="streaks-widget"]',
    title: 'Track Your Streaks',
    description:
      'Complete all your time blocks each day to build a streak. You currently have a 6-day streak going!',
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'calendar',
    targetSelector: '[data-tutorial="nav-calendar"]',
    title: 'Calendar View',
    description:
      'View and manage your daily schedules and events here. You can create one-time or recurring events.',
    placement: 'bottom',
  },
  {
    id: 'todos-page',
    targetSelector: '[data-tutorial="nav-todos"]',
    title: 'Todo Inbox',
    description:
      "Your inbox for tasks that aren't assigned to a specific time block yet.",
    placement: 'bottom',
  },
  {
    id: 'stats',
    targetSelector: '[data-tutorial="nav-stats"]',
    title: 'Statistics',
    description:
      'Track your productivity over time with detailed stats and completion rates.',
    placement: 'bottom',
  },
  {
    id: 'finish',
    targetSelector: '[data-tutorial="dashboard-header"]',
    title: "You're All Set!",
    description:
      'Explore freely! This is a full demo account with real data. Everything you do here works just like a real account.',
    placement: 'bottom',
    route: '/dashboard',
  },
];

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TutorialStep | null;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = TUTORIAL_STEPS.length;
  const currentStepData = isActive ? (TUTORIAL_STEPS[currentStep] ?? null) : null;

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setIsActive(false);
      setCurrentStep(0);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      currentStep,
      totalSteps,
      currentStepData,
      startTutorial,
      nextStep,
      skipTutorial,
    }),
    [isActive, currentStep, totalSteps, currentStepData, startTutorial, nextStep, skipTutorial],
  );

  return (
    <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
  );
}
