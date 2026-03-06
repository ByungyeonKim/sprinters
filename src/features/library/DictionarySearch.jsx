import { useState, useEffect, useRef } from 'react';
import { useMatches } from 'react-router';
import { Command, defaultFilter } from 'cmdk';
import { terms } from './tutorials/sprinter-dictionary.js';

const CATEGORY_LABELS = [
  '렌더링과 성능',
  'Next.js와 라우팅',
  '서버·클라이언트 컴포넌트',
];

const termsByCategory = Object.groupBy(terms, (t) => t.category);

function searchFilter(value, search, keywords) {
  const valueLower = value.toLowerCase();
  const searchLower = search.toLowerCase();

  if (valueLower === searchLower) return 1;
  if (valueLower.startsWith(searchLower)) return 0.9;

  if (keywords?.length) {
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower === searchLower) return 0.95;
      if (kwLower.startsWith(searchLower)) return 0.85;
    }
  }

  return defaultFilter(value, search, keywords);
}

function SearchModal({ open, onOpenChange }) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [search, setSearch] = useState('');
  const listRef = useRef(null);

  const handleOpenChange = (value) => {
    onOpenChange(value);
    if (!value) {
      setSelectedTerm(null);
      setSearch('');
    }
  };

  const handleBack = () => {
    setSelectedTerm(null);
  };

  if (selectedTerm) {
    return (
      <Command.Dialog
        open={open}
        onOpenChange={handleOpenChange}
        label='용어 상세'
        overlayClassName='cmdk-overlay'
        contentClassName='cmdk-content'
      >
        <div className='cmdk-detail'>
          <button onClick={handleBack} className='cmdk-back-button'>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
            검색으로 돌아가기
          </button>
          <div className='cmdk-detail-header'>
            <h2 className='cmdk-detail-term'>{selectedTerm.term}</h2>
            {selectedTerm.termEn && (
              <span className='cmdk-detail-term-en'>{selectedTerm.termEn}</span>
            )}
            <span className='cmdk-detail-category'>
              {selectedTerm.categoryLabel}
            </span>
          </div>
          <p className='cmdk-detail-description'>{selectedTerm.description}</p>
        </div>
      </Command.Dialog>
    );
  }

  const sortedGroups = search
    ? CATEGORY_LABELS.map((label, idx) => ({
        label,
        idx,
        maxScore: Math.max(
          0,
          ...(termsByCategory[String(idx)] || [])
            .map((t) => searchFilter(t.term, search, [t.termEn || ''])),
        ),
      })).sort((a, b) => b.maxScore - a.maxScore)
    : CATEGORY_LABELS.map((label, idx) => ({ label, idx }));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={handleOpenChange}
      label='용어 검색'
      overlayClassName='cmdk-overlay'
      contentClassName='cmdk-content'
      filter={searchFilter}
      loop
    >
      <Command.Input
        placeholder='용어 검색...'
        className='cmdk-input'
        onValueChange={(v) => {
          setSearch(v);
          listRef.current?.scrollTo(0, 0);
        }}
      />
      <Command.List ref={listRef} className='cmdk-list'>
        <Command.Empty className='cmdk-empty'>
          검색 결과가 없습니다.
        </Command.Empty>
        {sortedGroups.map(({ label, idx }) => (
          <Command.Group key={idx} heading={label} className='cmdk-group'>
            {(termsByCategory[String(idx)] || []).map((t) => (
                <Command.Item
                  key={t.term}
                  value={t.term}
                  keywords={[t.termEn || '']}
                  onSelect={() => setSelectedTerm(t)}
                  className='cmdk-item'
                >
                  <span className='cmdk-item-term'>{t.term}</span>
                  <span className='cmdk-item-desc'>
                    {t.description.length > 50
                      ? t.description.slice(0, 50) + '…'
                      : t.description}
                  </span>
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}

export function DictionarySearch() {
  const [open, setOpen] = useState(false);
  const matches = useMatches();
  const isMac = matches[0]?.data?.isMac ?? true;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
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
      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}
