import { Link, useLoaderData } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { highlightCodeBlocks } from '../../utils/shiki.server';
import { tutorialsBySlug } from './library-data';
import { useCodeCopy } from '../../hooks/use-code-copy';
import { StepSidebar } from './StepSidebar';
import { StepNavigation } from './StepNavigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

export function meta({ data }) {
  if (!data?.tutorial) {
    return [{ title: 'Sprinters' }];
  }
  const { tutorial, currentStep } = data;
  const step = tutorial.steps[currentStep];
  return [{ title: `${step?.title ?? tutorial.title} | Sprinters` }];
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
  const stepParam = url.searchParams.get('step') ?? '';
  const stepIndex = Math.max(0, Math.min(Number(stepParam) || 0, maxStep));

  const highlightedSteps = await Promise.all(
    flatSessions.map(async (step) => ({
      ...step,
      content: await highlightCodeBlocks(step.content),
    })),
  );

  return {
    tutorial: { ...tutorial, steps: highlightedSteps, chapterMeta },
    currentStep: stepIndex,
  };
}

function LibraryDetailHeader({
  title,
  steps,
  chapterMeta,
  currentStep,
  onStepChange,
}) {
  return (
    <header className='z-10 border-b border-gray-200 bg-white'>
      <div className='flex h-14 items-center justify-between px-4'>
        <nav className='flex items-center gap-1.5 text-sm'>
          <Link to='/' className='text-gray-500 hover:text-gray-900'>
            Sprinters
          </Link>
          <span className='text-gray-300'>/</span>
          <Link to='/library' className='text-gray-500 hover:text-gray-900'>
            라이브러리
          </Link>
          <span className='text-gray-300'>/</span>
          <span className='truncate font-medium text-gray-900'>{title}</span>
        </nav>
        <a
          href='https://github.com/ByungyeonKim/sprinters'
          target='_blank'
          rel='noopener noreferrer'
          className='text-gray-400 transition-colors hover:text-gray-900'
        >
          <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
          </svg>
        </a>
      </div>

      <div className='border-t border-gray-100 px-4 py-2 lg:hidden'>
        <select
          aria-label='세션 선택'
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'
        >
          {chapterMeta?.length > 0
            ? chapterMeta.map((ch, ci) => (
                <optgroup
                  key={ci}
                  label={`Ch.${ci + 1} ${ch.title}${ch.locked ? ' (공개 예정)' : ''}`}
                >
                  {ch.locked
                    ? null
                    : steps
                        .slice(ch.startIndex, ch.startIndex + ch.count)
                        .map((s, i) => (
                          <option
                            key={ch.startIndex + i}
                            value={ch.startIndex + i}
                          >
                            {ch.startIndex + i + 1}. {s.title}
                          </option>
                        ))}
                </optgroup>
              ))
            : steps.map((s, i) => (
                <option key={i} value={i}>
                  {i + 1}. {s.title}
                </option>
              ))}
        </select>
      </div>
    </header>
  );
}

export default function LibraryDetail() {
  const { tutorial, currentStep: initialStep } = useLoaderData();
  const [pendingStep, setPendingStep] = useState(initialStep);
  const [displayedStep, setDisplayedStep] = useState(initialStep);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'exiting' | 'entering-start' | 'entering'
  const [direction, setDirection] = useState(null); // 'forward' | 'backward' | null
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  useCodeCopy(contentRef, [displayedStep]);

  const step = tutorial.steps[displayedStep];

  // entering-start → entering: 브라우저가 시작 위치를 paint한 뒤 transition 시작
  useEffect(() => {
    if (phase !== 'entering-start') return;
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setPhase('entering');
      });
    });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  // prefers-reduced-motion fallback: transitionend가 발생하지 않으므로 직접 전환
  useEffect(() => {
    if (phase === 'idle') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) return;

    if (phase === 'exiting') {
      setDisplayedStep(pendingStep);
      setPhase('idle');
    } else if (phase === 'entering-start' || phase === 'entering') {
      setPhase('idle');
    }
  }, [phase, pendingStep]);

  // safety timeout: transitionend가 발화하지 않는 엣지 케이스 대비
  useEffect(() => {
    if (phase !== 'exiting' && phase !== 'entering') return;
    const ms = phase === 'exiting' ? 330 : 470;
    const timer = setTimeout(() => {
      if (phase === 'exiting') {
        setDisplayedStep(pendingStep);
        setPhase('entering-start');
      } else if (phase === 'entering') {
        setPhase('idle');
      }
    }, ms);
    return () => clearTimeout(timer);
  }, [phase, direction, pendingStep]);

  const firstLockedIndex =
    tutorial.chapterMeta.find((ch) => ch.locked)?.startIndex ?? Infinity;

  const handleStepChange = useCallback(
    (index) => {
      if (index === pendingStep || index >= firstLockedIndex) return;

      const dir = index > pendingStep ? 'forward' : 'backward';
      setDirection(dir);
      setPendingStep(index);

      if (phase === 'entering-start') {
        // 콘텐츠가 보이지 않는 상태 → 바로 새 콘텐츠로 교체, entering-start 유지
        setDisplayedStep(index);
      } else if (phase !== 'exiting') {
        setPhase('exiting');
      }
      // exiting 중이면 pendingStep·direction만 갱신 → transition이 현재 위치에서 이어감

      const url =
        index === 0
          ? window.location.pathname
          : `${window.location.pathname}?step=${index}`;
      window.history.replaceState(null, '', url);
      scrollContainerRef.current?.scrollTo({ top: 0 });
    },
    [pendingStep, phase, firstLockedIndex],
  );

  const handleTransitionEnd = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) return;

      if (phase === 'exiting') {
        setDisplayedStep(pendingStep);
        setPhase('entering-start');
      } else if (phase === 'entering') {
        setPhase('idle');
      }
    },
    [phase, pendingStep],
  );

  const contentStyle =
    phase === 'exiting'
      ? {
          opacity: 0,
          transform: `translateX(${direction === 'forward' ? '-200px' : '200px'})`,
        }
      : phase === 'entering-start'
        ? {
            opacity: 0,
            transform: `translateX(${direction === 'forward' ? '200px' : '-200px'})`,
            transition: 'none',
          }
        : phase === 'entering'
          ? { opacity: 1, transform: 'translateX(0)' }
          : undefined;

  const transitionClass =
    phase === 'exiting'
      ? 'step-exit-transition'
      : phase === 'entering'
        ? 'step-enter-transition'
        : '';

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
      <LibraryDetailHeader
        title={tutorial.title}
        steps={tutorial.steps}
        chapterMeta={tutorial.chapterMeta}
        currentStep={pendingStep}
        onStepChange={handleStepChange}
      />

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
                        <path strokeLinecap='round' strokeLinejoin='round' d='M3 4h18M3 12h12M3 20h18' />
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-3 3 3 3' />
                      </>
                    ) : (
                      <>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M3 4h18M3 12h12M3 20h18' />
                        <path strokeLinecap='round' strokeLinejoin='round' d='M17 9l3 3-3 3' />
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
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          </div>
        </div>
      </div>

      <StepNavigation
        steps={tutorial.steps}
        currentStep={pendingStep}
        onStepChange={handleStepChange}
        maxStep={firstLockedIndex - 1}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}
