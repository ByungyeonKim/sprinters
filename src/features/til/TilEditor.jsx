import { Link } from 'react-router';
import { MarkdownRenderer } from './MarkdownRenderer';

export function EditorHeader({ cancelTo, submitLabel, isSubmitting }) {
  return (
    <header className='sticky top-0 z-10 border-b border-gray-200 bg-white'>
      <div className='mx-auto flex h-14 max-w-300 items-center justify-between px-6'>
        <Link to={cancelTo} className='text-sm text-gray-500 hover:text-gray-900'>
          취소
        </Link>
        <button
          type='submit'
          disabled={isSubmitting}
          className='rounded bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </header>
  );
}

export function PreviewToggle({ isPreview, onToggle }) {
  return (
    <div className='mt-6 flex gap-1'>
      <button
        type='button'
        onClick={() => onToggle(false)}
        className={`rounded px-3 py-1 text-sm ${
          !isPreview
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        작성
      </button>
      <button
        type='button'
        onClick={() => onToggle(true)}
        className={`rounded px-3 py-1 text-sm ${
          isPreview
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        미리보기
      </button>
    </div>
  );
}

export function ContentArea({ isPreview, content, previewRef, textareaRef, onContentChange, onKeyDown }) {
  if (isPreview) {
    return (
      <div
        ref={previewRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className='prose mt-4 min-h-64 w-full max-w-none focus:outline-none'
      >
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className='text-gray-400'>미리볼 내용이 없습니다.</p>
        )}
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      id='content'
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder='내용을 입력하세요...'
      className='mt-4 field-sizing-content min-h-64 w-full resize-none border-none text-lg leading-relaxed placeholder:text-gray-300 focus:outline-none'
    />
  );
}

export function FloatingTagInput({ tags, onTagsChange }) {
  return (
    <div className='fixed bottom-4 left-1/2 w-full max-w-prose -translate-x-1/2 px-6'>
      <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg'>
        <input
          type='text'
          id='tags'
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          autoComplete='off'
          placeholder='태그를 입력하세요 (쉼표로 구분)'
          className='w-full border-none text-sm text-gray-500 placeholder:text-gray-300 focus:outline-none'
        />
      </div>
    </div>
  );
}
