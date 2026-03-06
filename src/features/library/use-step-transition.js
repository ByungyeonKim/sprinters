import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useStepTransition({
  initialStep,
  maxStep,
  ensureStepReady,
  scrollContainerRef,
}) {
  const [pendingStep, setPendingStep] = useState(initialStep);
  const [displayedStep, setDisplayedStep] = useState(initialStep);
  const [phase, setPhase] = useState('idle');
  const [direction, setDirection] = useState(null);

  const pendingStepRef = useRef(initialStep);
  const phaseRef = useRef('idle');
  const stepChangeRequestIdRef = useRef(0);

  const updatePhase = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const updatePendingStep = useCallback((nextStep) => {
    pendingStepRef.current = nextStep;
    setPendingStep(nextStep);
  }, []);

  useEffect(() => {
    if (phase !== 'entering-start') return;

    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          updatePhase('entering');
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [phase, updatePhase]);

  useEffect(() => {
    if (phase === 'idle') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;

      if (phase === 'exiting') {
        setDisplayedStep(pendingStepRef.current);
      }

      updatePhase('idle');
    });

    return () => {
      cancelled = true;
    };
  }, [phase, updatePhase]);

  useEffect(() => {
    if (phase !== 'exiting' && phase !== 'entering') return;

    const timeoutMs = phase === 'exiting' ? 330 : 470;
    const timer = setTimeout(() => {
      if (phase === 'exiting') {
        setDisplayedStep(pendingStepRef.current);
        updatePhase('entering-start');
      } else if (phase === 'entering') {
        updatePhase('idle');
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [phase, updatePhase]);

  const handleStepChange = useCallback(
    (nextStep) => {
      const requestId = stepChangeRequestIdRef.current + 1;
      stepChangeRequestIdRef.current = requestId;

      void (async () => {
        if (nextStep < 0 || nextStep > maxStep) return;

        await ensureStepReady(nextStep);
        if (requestId !== stepChangeRequestIdRef.current) return;

        const currentPendingStep = pendingStepRef.current;
        if (nextStep === currentPendingStep) return;

        const nextDirection =
          nextStep > currentPendingStep ? 'forward' : 'backward';
        const currentPhase = phaseRef.current;

        setDirection(nextDirection);
        updatePendingStep(nextStep);

        if (currentPhase === 'entering-start') {
          setDisplayedStep(nextStep);
        } else if (currentPhase !== 'exiting') {
          updatePhase('exiting');
        }

        const url =
          nextStep === 0
            ? window.location.pathname
            : `${window.location.pathname}?step=${nextStep}`;
        window.history.replaceState(null, '', url);
        scrollContainerRef.current?.scrollTo({ top: 0 });
      })();
    },
    [
      ensureStepReady,
      maxStep,
      scrollContainerRef,
      updatePendingStep,
      updatePhase,
    ],
  );

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) return;

      if (phaseRef.current === 'exiting') {
        setDisplayedStep(pendingStepRef.current);
        updatePhase('entering-start');
      } else if (phaseRef.current === 'entering') {
        updatePhase('idle');
      }
    },
    [updatePhase],
  );

  const contentStyle = useMemo(() => {
    if (phase === 'exiting') {
      return {
        opacity: 0,
        transform: `translateX(${direction === 'forward' ? '-200px' : '200px'})`,
      };
    }

    if (phase === 'entering-start') {
      return {
        opacity: 0,
        transform: `translateX(${direction === 'forward' ? '200px' : '-200px'})`,
        transition: 'none',
      };
    }

    if (phase === 'entering') {
      return { opacity: 1, transform: 'translateX(0)' };
    }

    return undefined;
  }, [direction, phase]);

  const transitionClass =
    phase === 'exiting'
      ? 'step-exit-transition'
      : phase === 'entering'
        ? 'step-enter-transition'
        : '';

  return {
    contentStyle,
    displayedStep,
    handleStepChange,
    handleTransitionEnd,
    pendingStep,
    transitionClass,
  };
}
