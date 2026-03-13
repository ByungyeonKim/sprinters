import { useCallback, useEffect, useRef, useState } from 'react';

export function useHighlightedLibrarySteps({
  slug,
  initialHighlightedStepContents,
  deferredStepIndices,
  deferredHighlightedStepContentsPromise,
}) {
  const [highlightedStepContents, setHighlightedStepContents] = useState(
    initialHighlightedStepContents,
  );
  const highlightedStepContentsRef = useRef(initialHighlightedStepContents);
  const deferredPromiseRef = useRef(deferredHighlightedStepContentsPromise);
  const deferredStepIndicesRef = useRef(deferredStepIndices ?? []);

  const mergeHighlightedStepContents = useCallback((nextContents) => {
    if (!nextContents) return;

    setHighlightedStepContents((currentContents) => {
      let mergedContents = currentContents;

      for (const [stepIndex, content] of Object.entries(nextContents)) {
        if (mergedContents[stepIndex] === content) {
          continue;
        }

        if (mergedContents === currentContents) {
          mergedContents = { ...currentContents };
        }

        mergedContents[stepIndex] = content;
      }

      return mergedContents;
    });
  }, []);

  useEffect(() => {
    highlightedStepContentsRef.current = highlightedStepContents;
  }, [highlightedStepContents]);

  useEffect(() => {
    deferredStepIndicesRef.current = deferredStepIndices ?? [];
  }, [deferredStepIndices]);

  useEffect(() => {
    if (!deferredHighlightedStepContentsPromise) return;

    let cancelled = false;
    const currentPromise = deferredHighlightedStepContentsPromise;
    deferredPromiseRef.current = currentPromise;

    void currentPromise
      .then((resolvedContents) => {
        if (cancelled) return;

        mergeHighlightedStepContents(resolvedContents);

        if (deferredPromiseRef.current === currentPromise) {
          deferredPromiseRef.current = null;
        }
      })
      .catch(() => {
        if (deferredPromiseRef.current === currentPromise) {
          deferredPromiseRef.current = null;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deferredHighlightedStepContentsPromise, mergeHighlightedStepContents]);

  const ensureHighlightedStepContent = useCallback(
    async (stepIndex) => {
      // 1. 이미 캐시에 있으면 즉시 반환
      if (highlightedStepContentsRef.current[stepIndex] != null) {
        return true;
      }

      // 2. deferred promise가 있으면 먼저 시도
      const deferredPromise = deferredPromiseRef.current;
      const shouldAwaitDeferred = deferredStepIndicesRef.current.includes(
        stepIndex,
      );
      if (deferredPromise && shouldAwaitDeferred) {
        try {
          const resolvedContents = await deferredPromise;
          mergeHighlightedStepContents(resolvedContents);

          if (deferredPromiseRef.current === deferredPromise) {
            deferredPromiseRef.current = null;
          }

          if (resolvedContents[stepIndex] != null) {
            return true;
          }
        } catch {
          if (deferredPromiseRef.current === deferredPromise) {
            deferredPromiseRef.current = null;
          }
        }
      }

      // 3. resource route에서 on-demand fetch
      try {
        const response = await fetch(
          `/library/${slug}/step-content?step=${stepIndex}`,
        );
        if (!response.ok) return false;
        const { highlighted } = await response.json();
        mergeHighlightedStepContents({ [stepIndex]: highlighted });
        return true;
      } catch {
        return false;
      }
    },
    [mergeHighlightedStepContents, slug],
  );

  return {
    highlightedStepContents,
    ensureHighlightedStepContent,
  };
}
