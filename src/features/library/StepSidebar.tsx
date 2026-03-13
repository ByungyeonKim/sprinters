import { memo, useEffect, useRef, useState } from 'react';
import type {
  LibraryChapter,
  LibraryStep,
  LibraryStepChangeHandler,
} from './library-types';

type StepSidebarProps = {
  steps: LibraryStep[];
  chapterMeta?: LibraryChapter[];
  currentStep: number;
  onStepChange: LibraryStepChangeHandler;
  isOpen: boolean;
};

export const StepSidebar = memo(function StepSidebar({
  steps,
  chapterMeta,
  currentStep,
  onStepChange,
  isOpen,
}: StepSidebarProps) {
  const items = chapterMeta?.length
    ? chapterMeta.map((ch, ci) => (
        <ChapterGroup
          key={ci}
          chapter={ch}
          chapterIndex={ci}
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />
      ))
    : steps.map((step, index) => (
        <StepItem
          key={index}
          step={step}
          index={index}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />
      ));

  return (
    <>
      <nav
        className={`hidden shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-[width,border-color] duration-300 lg:block ${isOpen ? 'w-64' : 'w-0 border-r-0'}`}
      >
        <div className='h-full min-w-64'>
          <ol className='h-full overflow-y-auto p-4'>{items}</ol>
        </div>
      </nav>
    </>
  );
});

function ChapterGroup({
  chapter,
  chapterIndex,
  steps,
  currentStep,
  onStepChange,
}: {
  chapter: LibraryChapter;
  chapterIndex: number;
  steps: LibraryStep[];
  currentStep: number;
  onStepChange: LibraryStepChangeHandler;
}) {
  const isCurrentChapter =
    currentStep >= chapter.startIndex &&
    currentStep < chapter.startIndex + chapter.count;
  const [isOpen, setIsOpen] = useState(isCurrentChapter);
  const wasCurrentChapterRef = useRef(isCurrentChapter);

  useEffect(() => {
    if (isCurrentChapter && !wasCurrentChapterRef.current) {
      let cancelled = false;

      queueMicrotask(() => {
        if (!cancelled) {
          setIsOpen(true);
        }
      });

      wasCurrentChapterRef.current = isCurrentChapter;

      return () => {
        cancelled = true;
      };
    }

    wasCurrentChapterRef.current = isCurrentChapter;
  }, [isCurrentChapter]);

  if (chapter.locked) {
    return (
      <li className={chapterIndex > 0 ? 'mt-3' : ''}>
        <div className='flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300'>
          <span className='flex h-6 shrink-0 items-center justify-center rounded-full border border-gray-200 px-2 text-[10px] font-medium tracking-tight text-gray-300'>
            Ch.{chapterIndex + 1}
          </span>
          <span>
            {chapter.title} <span className='text-[11px]'>(공개 예정)</span>
          </span>
        </div>
      </li>
    );
  }

  const chapterSessions = steps.slice(
    chapter.startIndex,
    chapter.startIndex + chapter.count,
  );

  return (
    <li className={chapterIndex > 0 ? 'mt-3' : ''}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
          isCurrentChapter
            ? 'bg-gray-900 font-medium text-white'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`}
      >
        <span
          className={`flex h-6 shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-medium tracking-tight transition-colors ${
            isCurrentChapter
              ? 'bg-gray-500 text-white'
              : 'border border-gray-300 text-gray-400'
          }`}
        >
          Ch.{chapterIndex + 1}
        </span>
        <span>{chapter.title}</span>
        <svg
          className={`ml-auto h-4 w-4 shrink-0 ${isCurrentChapter ? 'text-white' : 'text-gray-400'} transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {isOpen && (
        <ol className='mt-0.5 ml-5 border-l border-gray-200 pl-3'>
          {chapterSessions.map((step, i) => {
            const globalIndex = chapter.startIndex + i;
            const isCurrent = globalIndex === currentStep;
            const isVisited = globalIndex < currentStep;

            return (
              <li key={globalIndex}>
                <button
                  onClick={() => onStepChange(globalIndex)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                    isCurrent
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                      isCurrent
                        ? 'bg-gray-900 text-white'
                        : isVisited
                          ? 'bg-gray-400 text-white'
                          : 'border border-gray-300 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </li>
  );
}

function StepItem({
  step,
  index,
  currentStep,
  onStepChange,
}: {
  step: LibraryStep;
  index: number;
  currentStep: number;
  onStepChange: LibraryStepChangeHandler;
}) {
  const isCurrent = index === currentStep;
  const isVisited = index < currentStep;

  return (
    <li>
      <button
        onClick={() => onStepChange(index)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
          isCurrent
            ? 'bg-gray-100 font-medium text-gray-900'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
            isCurrent
              ? 'bg-gray-900 text-white'
              : isVisited
                ? 'bg-gray-400 text-white'
                : 'border border-gray-300 text-gray-400'
          }`}
        >
          {index + 1}
        </span>
        {step.title}
      </button>
    </li>
  );
}
