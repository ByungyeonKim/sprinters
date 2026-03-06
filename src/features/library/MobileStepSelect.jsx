import { memo } from 'react';

export const MobileStepSelect = memo(function MobileStepSelect({
  steps,
  chapterMeta,
  currentStep,
  onStepChange,
}) {
  return (
    <div className='border-t border-gray-100 px-4 py-2 lg:hidden'>
      <select
        aria-label='세션 선택'
        value={currentStep}
        onChange={(event) => onStepChange(Number(event.target.value))}
        className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'
      >
        {chapterMeta?.length > 0
          ? chapterMeta.map((chapter, chapterIndex) => (
              <optgroup
                key={chapterIndex}
                label={`Ch.${chapterIndex + 1} ${chapter.title}${chapter.locked ? ' (공개 예정)' : ''}`}
              >
                {chapter.locked
                  ? null
                  : steps
                      .slice(
                        chapter.startIndex,
                        chapter.startIndex + chapter.count,
                      )
                      .map((step, stepOffset) => (
                        <option
                          key={chapter.startIndex + stepOffset}
                          value={chapter.startIndex + stepOffset}
                        >
                          {chapter.startIndex + stepOffset + 1}. {step.title}
                        </option>
                      ))}
              </optgroup>
            ))
          : steps.map((step, index) => (
              <option key={index} value={index}>
                {index + 1}. {step.title}
              </option>
            ))}
      </select>
    </div>
  );
});
