import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouteLoaderData } from 'react-router';

const loadDictionarySearchDialog = () => import('./DictionarySearchDialog');
const LazyDictionarySearchDialog = lazy(loadDictionarySearchDialog);

let dictionarySearchDialogPromise;

function preloadDictionarySearchDialog() {
  if (!dictionarySearchDialogPromise) {
    dictionarySearchDialogPromise = loadDictionarySearchDialog().catch(
      (error) => {
        dictionarySearchDialogPromise = undefined;
        throw error;
      },
    );
  }

  return dictionarySearchDialogPromise;
}

export function DictionarySearch() {
  const [open, setOpen] = useState(false);
  const [shouldRenderDialog, setShouldRenderDialog] = useState(false);
  const rootData = useRouteLoaderData('root');
  const isMac = rootData?.isMac ?? true;

  const handleWarmDialog = useCallback(() => {
    void preloadDictionarySearchDialog().catch(() => {});
  }, []);

  const handleOpen = useCallback(() => {
    setShouldRenderDialog(true);
    setOpen(true);
    void preloadDictionarySearchDialog().catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        handleOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleOpen]);

  return (
    <>
      <button
        onClick={handleOpen}
        onMouseEnter={handleWarmDialog}
        onFocus={handleWarmDialog}
        onTouchStart={handleWarmDialog}
        className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600'
      >
        <svg
          className='h-4 w-4'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='11' cy='11' r='8' />
          <path d='m21 21-4.3-4.3' />
        </svg>
        <span className='hidden sm:inline'>용어 검색...</span>
        <kbd className='hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-400 sm:inline-flex'>
          {isMac ? '⌘ K' : 'Ctrl K'}
        </kbd>
      </button>

      {shouldRenderDialog ? (
        <Suspense fallback={null}>
          <LazyDictionarySearchDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      ) : null}
    </>
  );
}
