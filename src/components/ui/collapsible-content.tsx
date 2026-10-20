import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { CollapsibleOpenContext } from './collapsible-context';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const TRANSITION_SETTLE_BUFFER_MS = 50;

type Phase = 'closed' | 'mounting' | 'opening' | 'open' | 'closing';

interface CollapsibleContentProps {
  id: string;
  open: boolean;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}

export function CollapsibleContent({
  id,
  open,
  triggerRef,
  children,
}: CollapsibleContentProps) {
  const parentIsOpen = useContext(CollapsibleOpenContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusedChildRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
  const [transition, setTransition] = useState<{
    open: boolean;
    phase: Phase;
    revision: number;
  }>(() => ({ open, phase: open ? 'open' : 'closed', revision: 0 }));

  // Keep presence in sync before committing DOM changes. Reversing a closing
  // panel reuses its children; only a completed close discards their state.
  if (transition.open !== open) {
    setTransition({
      open,
      phase: reducedMotion
        ? (open ? 'open' : 'closed')
        : open
          ? (transition.phase === 'closed' ? 'mounting' : 'opening')
          : (transition.phase === 'mounting' ? 'closed' : 'closing'),
      revision: transition.revision + 1,
    });
  } else if (
    reducedMotion &&
    transition.phase !== 'open' &&
    transition.phase !== 'closed'
  ) {
    setTransition({
      open,
      phase: open ? 'open' : 'closed',
      revision: transition.revision + 1,
    });
  }

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const { phase, revision } = transition;
  const isOpen = parentIsOpen && open;

  useLayoutEffect(() => {
    if (!open && parentIsOpen) {
      const active = document.activeElement;
      const focusedChild = focusedChildRef.current;
      if (
        panelRef.current?.contains(active) ||
        (active === document.body && focusedChild && !focusedChild.isConnected)
      ) {
        triggerRef?.current?.focus();
      }
      focusedChildRef.current = null;
    }
  }, [open, parentIsOpen, triggerRef]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || phase === 'open' || phase === 'closed') return;

    // CSS owns the duration. No content size is measured by this component.
    const duration = getComputedStyle(panel).transitionDuration;
    const durationMs = (Number.parseFloat(duration) || 0) *
      (duration.endsWith('ms') ? 1 : 1000);
    const startedAt = performance.now();
    let firstFrame = 0;
    let secondFrame = 0;
    let timer = 0;

    const finish = () => {
      setTransition(current => current.revision === revision
        ? { ...current, phase: current.open ? 'open' : 'closed' }
        : current);
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (
        event.target === panel &&
        event.propertyName === 'grid-template-rows' &&
        event.timeStamp >= startedAt
      ) {
        finish();
      }
    };

    if (durationMs === 0) {
      timer = window.setTimeout(finish, 0);
    } else if (phase === 'mounting') {
      // A painted 0fr state is needed after lazy mounting, without a forced
      // layout read. Cancel both frames if the user closes before they run.
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setTransition(current => current.revision === revision
            ? { ...current, phase: 'opening' }
            : current);
        });
      });
    } else {
      panel.addEventListener('transitionend', onTransitionEnd);
      timer = window.setTimeout(finish, durationMs + TRANSITION_SETTLE_BUFFER_MS);
    }

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(timer);
      panel.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [phase, revision]);

  return (
    <div
      ref={panelRef}
      id={id}
      className="collapsible-content"
      data-state={phase}
      data-expanded={phase === 'opening' || phase === 'open'}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onFocusCapture={event => {
        if (event.currentTarget.contains(event.target)) {
          focusedChildRef.current = event.target as HTMLElement;
        }
      }}
      onBlurCapture={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          focusedChildRef.current = null;
        }
      }}
    >
      <div className="collapsible-clip">
        <div className="collapsible-body">
          <CollapsibleOpenContext.Provider value={isOpen}>
            {phase !== 'closed' && children}
          </CollapsibleOpenContext.Provider>
        </div>
      </div>
    </div>
  );
}
