import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Check } from 'lucide-react';
import { useTutorial } from '@/hooks/use-tutorial';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getTooltipPosition(
  targetRect: TargetRect,
  placement: 'top' | 'bottom' | 'left' | 'right',
) {
  const gap = 12;
  const tooltipWidth = 320;

  switch (placement) {
    case 'bottom':
      return {
        top: targetRect.top + targetRect.height + gap,
        left: Math.max(
          8,
          Math.min(
            targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - 8,
          ),
        ),
      };
    case 'top':
      return {
        top: targetRect.top - gap,
        left: Math.max(
          8,
          Math.min(
            targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - 8,
          ),
        ),
        transform: 'translateY(-100%)',
      };
    case 'right':
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width + gap,
        transform: 'translateY(-50%)',
      };
    case 'left':
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left - gap - tooltipWidth,
        transform: 'translateY(-50%)',
      };
  }
}

export function TutorialOverlay() {
  const {
    isActive,
    currentStepData,
    currentStep,
    totalSteps,
    nextStep,
    skipTutorial,
  } = useTutorial();
  const navigate = useNavigate();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const updateTargetRect = useCallback(() => {
    if (!currentStepData) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStepData.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const padding = 6;
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
      setIsTransitioning(false);
    } else {
      setTargetRect(null);
    }
  }, [currentStepData]);

  // Navigate to the step's route if needed, then find the target element
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    if (currentStepData.route) {
      setIsTransitioning(true);
      navigate(currentStepData.route);
    }

    // Poll for the target element (it may not be rendered yet after navigation)
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const el = document.querySelector(currentStepData.targetSelector);
      if (el || attempts >= maxAttempts) {
        clearInterval(interval);
        updateTargetRect();
      }
      attempts++;
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentStepData, navigate, updateTargetRect]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isActive) return;

    const handleUpdate = () => updateTargetRect();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isActive, updateTargetRect]);

  if (!isActive || !currentStepData || isTransitioning) return null;

  const isLastStep = currentStep === totalSteps - 1;
  const tooltipStyle = targetRect
    ? getTooltipPosition(targetRect, currentStepData.placement)
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop with spotlight cutout */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: targetRect
            ? undefined
            : 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={skipTutorial}
      />

      {/* Spotlight overlay using box-shadow technique */}
      {targetRect && (
        <div
          className="absolute rounded-lg transition-all duration-300 pointer-events-none"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className={cn(
          'absolute z-10 w-80 rounded-lg border bg-card p-4 shadow-lg',
          'animate-in fade-in-0 zoom-in-95 duration-200',
        )}
        style={tooltipStyle}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground">
            {currentStepData.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={skipTutorial}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {currentStepData.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} of {totalSteps}
          </span>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={skipTutorial}>
              Skip
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Done
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-3 flex justify-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === currentStep
                  ? 'w-4 bg-primary'
                  : i < currentStep
                    ? 'w-1.5 bg-primary/50'
                    : 'w-1.5 bg-muted-foreground/30',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
