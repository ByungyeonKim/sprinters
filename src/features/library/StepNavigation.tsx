import { memo } from 'react';
import type { LibraryStep, LibraryStepChangeHandler } from './library-types';

type StepNavigationProps = {
  steps: LibraryStep[];
  currentStep: number;
  onStepChange: LibraryStepChangeHandler;
  maxStep?: number;
  sidebarOpen: boolean;
};

export const StepNavigation = memo(function StepNavigation({
  steps,
  currentStep,
  onStepChange,
  maxStep,
  sidebarOpen,
}: StepNavigationProps) {
  const lastStep = maxStep != null ? maxStep : steps.length - 1;
  const isFirst = currentStep === 0;
  const isLast = currentStep >= lastStep;

  return (
    <div
      className={`pointer-events-none fixed right-0 bottom-0 left-0 z-20 transition-[left] duration-300 ${sidebarOpen ? 'lg:left-64' : 'lg:left-0'}`}
      style={{
        insetInlineEnd: 'calc(16px + calc(100vw - 100%))',
      }}
    >
      <div className='mx-auto flex max-w-236.25 items-center justify-between px-6 py-4'>
        {/* 이전 버튼 */}
        <button
          onClick={() => onStepChange(currentStep - 1)}
          disabled={isFirst}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-colors ${
            isFirst
              ? 'cursor-not-allowed bg-gray-100 text-gray-300'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          ← 이전
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={() => onStepChange(currentStep + 1)}
          disabled={isLast}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-colors ${
            isLast
              ? 'cursor-not-allowed bg-gray-100 text-gray-300'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          다음 →
        </button>
      </div>
    </div>
  );
});
