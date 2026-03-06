import { useLoaderData, useSearchParams } from 'react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { highlightCodeBlocks } from '../../utils/shiki.server';
import { tutorialsBySlug } from './library-data';
import { useCodeCopy } from '../../hooks/use-code-copy';
import { MobileStepSelect } from './MobileStepSelect';
import { StepSidebar } from './StepSidebar';
import { StepNavigation } from './StepNavigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { LibraryHeader } from './LibraryHeader';
import { useHighlightedLibrarySteps } from './use-highlighted-library-steps';
import { useStepTransition } from './use-step-transition';

const highlightedStepContentCache = new Map();

function clampStepIndex(stepParam, maxStep) {
  const parsedStep = Number(stepParam);
  const normalizedStep = Number.isInteger(parsedStep) ? parsedStep : 0;

  return Math.max(0, Math.min(normalizedStep, maxStep));
}

function setStepSearchParam(searchParams, stepIndex) {
  if (stepIndex === 0) {
    searchParams.delete('step');
    return searchParams;
  }

  searchParams.set('step', String(stepIndex));
  return searchParams;
}

function areSearchParamsEqualExceptStep(currentUrl, nextUrl) {
  const currentSearchParams = new URLSearchParams(currentUrl.search);
  const nextSearchParams = new URLSearchParams(nextUrl.search);

  currentSearchParams.delete('step');
  nextSearchParams.delete('step');

  return currentSearchParams.toString() === nextSearchParams.toString();
}

function getHighlightedStepContent(slug, stepIndex, content) {
  const cacheKey = `${slug}:${stepIndex}`;
  const cachedEntry = highlightedStepContentCache.get(cacheKey);

  if (cachedEntry?.source === content) {
    return cachedEntry.promise;
  }

  const promise = highlightCodeBlocks(content);
  highlightedStepContentCache.set(cacheKey, { source: content, promise });
  return promise;
}

function getEagerStepIndices(chapterMeta, currentStep, maxStep) {
  const eagerStepIndices = new Set([currentStep]);
  const currentChapter = chapterMeta.find(
    (chapter) =>
      !chapter.locked &&
      currentStep >= chapter.startIndex &&
      currentStep < chapter.startIndex + chapter.count,
  );

  if (currentChapter) {
    for (
      let stepIndex = currentChapter.startIndex;
      stepIndex < currentChapter.startIndex + currentChapter.count;
      stepIndex += 1
    ) {
      eagerStepIndices.add(stepIndex);
    }
  }

  if (currentStep > 0) {
    eagerStepIndices.add(currentStep - 1);
  }

  if (currentStep < maxStep) {
    eagerStepIndices.add(currentStep + 1);
  }

  return eagerStepIndices;
}

export function meta({ data }) {
  if (!data?.tutorial) {
    return [{ title: 'Sprinters' }];
  }
  const { tutorial, currentStep } = data;
  const step = tutorial.steps[currentStep];
  return [{ title: `${step?.title ?? tutorial.title} | Sprinters` }];
}

export function shouldRevalidate({
  currentUrl,
  currentParams,
  defaultShouldRevalidate,
  nextParams,
  nextUrl,
}) {
  if (
    currentParams.slug === nextParams.slug &&
    currentUrl.pathname === nextUrl.pathname &&
    areSearchParamsEqualExceptStep(currentUrl, nextUrl)
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}

export async function loader({ params, request }) {
  const { slug } = params;
  const meta = tutorialsBySlug[slug];
  if (!meta) {
    throw new Response('Not Found', { status: 404 });
  }

  const mod = await import(`./tutorials/${slug}.js`);
  const tutorial = mod.default;

  // chapters → 플랫 sessions 배열로 변환 + 챕터 메타데이터 구성
  const chapters = tutorial.chapters ?? [];
  const flatSessions = [];
  const chapterMeta = [];
  for (const ch of chapters) {
    const startIndex = flatSessions.length;
    for (const session of ch.sessions) {
      flatSessions.push(session);
    }
    chapterMeta.push({
      title: ch.title,
      startIndex,
      count: ch.sessions.length,
      locked: ch.locked ?? false,
    });
  }

  const firstLockedChapter = chapterMeta.find((ch) => ch.locked);
  const maxStep = firstLockedChapter
    ? firstLockedChapter.startIndex - 1
    : flatSessions.length - 1;

  const url = new URL(request.url);
  const stepIndex = clampStepIndex(url.searchParams.get('step') ?? '', maxStep);
  const eagerStepIndices = getEagerStepIndices(chapterMeta, stepIndex, maxStep);
  const eagerHighlightedStepEntries = await Promise.all(
    [...eagerStepIndices].map(async (index) => [
      index,
      await getHighlightedStepContent(slug, index, flatSessions[index].content),
    ]),
  );
  const deferredStepIndices = flatSessions
    .map((_, index) => index)
    .filter((index) => index <= maxStep && !eagerStepIndices.has(index));
  const deferredHighlightedStepContentsPromise = deferredStepIndices.length
    ? Promise.all(
        deferredStepIndices.map(async (index) => [
          index,
          await getHighlightedStepContent(
            slug,
            index,
            flatSessions[index].content,
          ),
        ]),
      ).then(Object.fromEntries)
    : null;

  return {
    tutorial: { ...tutorial, steps: flatSessions, chapterMeta },
    currentStep: stepIndex,
    eagerHighlightedStepContents: Object.fromEntries(
      eagerHighlightedStepEntries,
    ),
    deferredHighlightedStepContentsPromise,
  };
}

export default function LibraryDetail() {
  const loaderData = useLoaderData();

  return <LibraryDetailContent key={loaderData.tutorial.slug} {...loaderData} />;
}

function LibraryDetailContent({
  tutorial,
  eagerHighlightedStepContents,
  deferredHighlightedStepContentsPromise,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { highlightedStepContents, ensureHighlightedStepContent } =
    useHighlightedLibrarySteps({
      initialHighlightedStepContents: eagerHighlightedStepContents,
      deferredHighlightedStepContentsPromise,
    });
  const maxStep = useMemo(() => {
    const firstLockedIndex =
      tutorial.chapterMeta.find((chapter) => chapter.locked)?.startIndex ??
      tutorial.steps.length;

    return firstLockedIndex - 1;
  }, [tutorial.chapterMeta, tutorial.steps.length]);
  const currentStep = useMemo(
    () => clampStepIndex(searchParams.get('step') ?? '', maxStep),
    [maxStep, searchParams],
  );
  const updateStepUrl = useCallback(
    (nextStep, { replace = false } = {}) => {
      setSearchParams(
        (currentSearchParams) => {
          const nextSearchParams = new URLSearchParams(currentSearchParams);
          return setStepSearchParam(nextSearchParams, nextStep);
        },
        { preventScrollReset: true, replace },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    const normalizedSearchParams = setStepSearchParam(
      new URLSearchParams(searchParams),
      currentStep,
    );

    if (normalizedSearchParams.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(normalizedSearchParams, {
      preventScrollReset: true,
      replace: true,
    });
  }, [currentStep, searchParams, setSearchParams]);

  useEffect(() => {
    const currentTitleStep = tutorial.steps[currentStep];
    document.title = `${currentTitleStep?.title ?? tutorial.title} | Sprinters`;
  }, [currentStep, tutorial.steps, tutorial.title]);

  const {
    contentStyle,
    displayedStep,
    handleStepChange,
    handleTransitionEnd,
    pendingStep,
    transitionClass,
  } = useStepTransition({
    currentStep,
    maxStep,
    ensureStepReady: ensureHighlightedStepContent,
    onStepUrlChange: updateStepUrl,
    scrollContainerRef,
  });

  const step = tutorial.steps[displayedStep];
  const displayedStepContent =
    highlightedStepContents[displayedStep] ?? step.content;
  useCodeCopy(contentRef, [displayedStep, displayedStepContent]);
  const mobileStepSelect = useMemo(
    () => (
      <MobileStepSelect
        steps={tutorial.steps}
        chapterMeta={tutorial.chapterMeta}
        currentStep={pendingStep}
        onStepChange={handleStepChange}
      />
    ),
    [tutorial.steps, tutorial.chapterMeta, pendingStep, handleStepChange],
  );

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
      <LibraryHeader title={tutorial.title}>{mobileStepSelect}</LibraryHeader>

      {/* 본문 */}
      <div className='flex min-h-0 flex-1'>
        <StepSidebar
          steps={tutorial.steps}
          chapterMeta={tutorial.chapterMeta}
          currentStep={pendingStep}
          onStepChange={handleStepChange}
          isOpen={sidebarOpen}
        />

        <div
          ref={scrollContainerRef}
          className='relative flex-1 overflow-x-hidden overflow-y-auto'
          style={{ scrollbarGutter: 'stable' }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className='sticky top-3 left-3 z-10 hidden h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700 lg:flex'
                  aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    {sidebarOpen ? (
                      <>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 4h18M3 12h12M3 20h18'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19 9l-3 3 3 3'
                        />
                      </>
                    ) : (
                      <>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 4h18M3 12h12M3 20h18'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17 9l3 3-3 3'
                        />
                      </>
                    )}
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={6}>
                {sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div
            className={`mx-auto max-w-3xl px-6 pt-10 pb-20 ${transitionClass}`}
            style={contentStyle}
            onTransitionEnd={handleTransitionEnd}
          >
            <article
              ref={contentRef}
              className='prose library-content max-w-none'
            >
              <h1
                className={
                  step.title === '학습 로드맵'
                    ? 'sr-only'
                    : 'border-foreground/70 dark:border-foreground/50 mb-15 border-b-3 pb-4 text-4xl'
                }
              >
                {step.title}
              </h1>
              <div
                className='[&>:first-child]:mt-0'
                dangerouslySetInnerHTML={{ __html: displayedStepContent }}
              />
            </article>
          </div>
        </div>
      </div>

      <StepNavigation
        steps={tutorial.steps}
        currentStep={pendingStep}
        onStepChange={handleStepChange}
        maxStep={maxStep}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}
