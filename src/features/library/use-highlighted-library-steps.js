import { useCallback, useEffect, useRef, useState } from 'react';

export function useHighlightedLibrarySteps({
  initialHighlightedStepContents,
  deferredHighlightedStepContentsPromise,
}) {
  const [highlightedStepContents, setHighlightedStepContents] = useState(
    initialHighlightedStepContents,
  );
  const highlightedStepContentsRef = useRef(initialHighlightedStepContents);
  const deferredPromiseRef = useRef(deferredHighlightedStepContentsPromise);

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
      if (highlightedStepContentsRef.current[stepIndex] != null) {
        return true;
      }

      const deferredPromise = deferredPromiseRef.current;
      if (!deferredPromise) {
        return false;
      }

      try {
        const resolvedContents = await deferredPromise;
        mergeHighlightedStepContents(resolvedContents);

        if (deferredPromiseRef.current === deferredPromise) {
          deferredPromiseRef.current = null;
        }

        return resolvedContents[stepIndex] != null;
      } catch {
        if (deferredPromiseRef.current === deferredPromise) {
          deferredPromiseRef.current = null;
        }

        return false;
      }
    },
    [mergeHighlightedStepContents],
  );

  return {
    highlightedStepContents,
    ensureHighlightedStepContent,
  };
}
