import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UseStepTransitionOptions } from './library-types';

const TRANSITION_END_PROPERTY = 'opacity';

type TransitionPhase = 'idle' | 'exiting' | 'entering-start' | 'entering';
type TransitionDirection = 'forward' | 'backward';

const TRANSITION_TIMEOUT_MS: Record<string, number> = {
  entering: 470,
  exiting: 330,
};

export function useStepTransition({
  currentStep,
  maxStep,
  ensureStepReady,
  onStepUrlChange,
  scrollContainerRef,
}: UseStepTransitionOptions) {
  const [pendingStep, setPendingStep] = useState(currentStep);
  const [displayedStep, setDisplayedStep] = useState(currentStep);
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [direction, setDirection] = useState<TransitionDirection | null>(null);
  const [isStepPending, setIsStepPending] = useState(false);

  const pendingStepRef = useRef(currentStep);
  const phaseRef = useRef<TransitionPhase>('idle');
  const stepChangeRequestIdRef = useRef(0);
  const timedPhaseIdRef = useRef(0);

  const setPhaseState = useCallback((nextPhase: TransitionPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const startTimedPhase = useCallback(
    (nextPhase: TransitionPhase) => {
      timedPhaseIdRef.current += 1;
      setPhaseState(nextPhase);
    },
    [setPhaseState],
  );

  const updatePendingStep = useCallback((nextStep: number) => {
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

  const requestStepChange = useCallback(
    (nextStep: number, { replace = false, syncUrl = false } = {}) => {
      const requestId = stepChangeRequestIdRef.current + 1;
      stepChangeRequestIdRef.current = requestId;

      void (async () => {
        if (nextStep < 0 || nextStep > maxStep) return;

        const currentPendingStep = pendingStepRef.current;
        if (nextStep === currentPendingStep) return;

        // 즉시 피드백: 사이드바 하이라이트 + URL 업데이트
        const nextDirection =
          nextStep > currentPendingStep ? 'forward' : 'backward';
        setDirection(nextDirection);
        updatePendingStep(nextStep);

        if (syncUrl) {
          onStepUrlChange(nextStep, { replace });
        }

        // 콘텐츠 로딩
        setIsStepPending(true);
        await ensureStepReady(nextStep);

        if (requestId !== stepChangeRequestIdRef.current) return;
        setIsStepPending(false);

        // transition 시작
        const currentPhase = phaseRef.current;

        if (currentPhase === 'entering-start') {
          setDisplayedStep(nextStep);
        } else if (currentPhase !== 'exiting') {
          startTimedPhase('exiting');
        }

        scrollContainerRef.current?.scrollTo({ top: 0 });
      })();
    },
    [
      ensureStepReady,
      maxStep,
      onStepUrlChange,
      scrollContainerRef,
      startTimedPhase,
      updatePendingStep,
    ],
  );

  useEffect(() => {
    if (currentStep === pendingStepRef.current) return;
    requestStepChange(currentStep);
  }, [currentStep, requestStepChange]);

  const handleStepChange = useCallback(
    (nextStep: number) => {
      requestStepChange(nextStep, { syncUrl: true });
    },
    [requestStepChange],
  );

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
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
    isStepPending,
    pendingStep,
    transitionClass,
  };
}
