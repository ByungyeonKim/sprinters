import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TRANSITION_END_PROPERTY = 'opacity';
const TRANSITION_TIMEOUT_MS = {
  entering: 470,
  exiting: 330,
};

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
  const timedPhaseIdRef = useRef(0);

  const setPhaseState = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const startTimedPhase = useCallback(
    (nextPhase) => {
      timedPhaseIdRef.current += 1;
      setPhaseState(nextPhase);
    },
    [setPhaseState],
  );

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
          startTimedPhase('entering');
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [phase, startTimedPhase]);

  useEffect(() => {
    if (phase === 'idle') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) return;

    let cancelled = false;
    const expectedPhase = phase;
    const expectedTimedPhaseId = timedPhaseIdRef.current;

    queueMicrotask(() => {
      if (cancelled) return;

      if (expectedPhase === 'exiting') {
        if (
          phaseRef.current !== expectedPhase ||
          timedPhaseIdRef.current !== expectedTimedPhaseId
        ) {
          return;
        }

        setDisplayedStep(pendingStepRef.current);
        setPhaseState('idle');
        return;
      }

      if (expectedPhase === 'entering') {
        if (
          phaseRef.current !== expectedPhase ||
          timedPhaseIdRef.current !== expectedTimedPhaseId
        ) {
          return;
        }
      } else if (phaseRef.current !== expectedPhase) {
        return;
      }

      setPhaseState('idle');
    });

    return () => {
      cancelled = true;
    };
  }, [phase, setPhaseState]);

  useEffect(() => {
    if (phase !== 'exiting' && phase !== 'entering') return;

    const expectedPhase = phase;
    const expectedTimedPhaseId = timedPhaseIdRef.current;
    const timeoutMs = TRANSITION_TIMEOUT_MS[phase];
    const timer = setTimeout(() => {
      if (
        phaseRef.current !== expectedPhase ||
        timedPhaseIdRef.current !== expectedTimedPhaseId
      ) {
        return;
      }

      if (expectedPhase === 'exiting') {
        setDisplayedStep(pendingStepRef.current);
        setPhaseState('entering-start');
      } else if (expectedPhase === 'entering') {
        setPhaseState('idle');
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [phase, setPhaseState]);

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
          startTimedPhase('exiting');
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
      startTimedPhase,
      updatePendingStep,
    ],
  );

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== TRANSITION_END_PROPERTY) return;

      if (phaseRef.current === 'exiting') {
        setDisplayedStep(pendingStepRef.current);
        setPhaseState('entering-start');
      } else if (phaseRef.current === 'entering') {
        setPhaseState('idle');
      }
    },
    [setPhaseState],
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
