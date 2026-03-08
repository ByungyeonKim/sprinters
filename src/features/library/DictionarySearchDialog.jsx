import { useRef, useState } from 'react';
import { Command, defaultFilter } from 'cmdk';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { terms } from './tutorials/sprinter-dictionary.js';

const CATEGORY_LABELS = [
  '렌더링과 성능',
  'Next.js와 라우팅',
  '서버·클라이언트 컴포넌트',
];

const termsByCategory = Object.groupBy(terms, (term) => term.category);

function searchFilter(value, search, keywords) {
  const valueLower = value.toLowerCase();
  const searchLower = search.toLowerCase();

  if (valueLower === searchLower) return 1;
  if (valueLower.startsWith(searchLower)) return 0.9;

  if (keywords?.length) {
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      if (keywordLower === searchLower) return 0.95;
      if (keywordLower.startsWith(searchLower)) return 0.85;
    }
  }

  return defaultFilter(value, search, keywords);
}

export default function DictionarySearchDialog({ open, onOpenChange }) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [search, setSearch] = useState('');
  const listRef = useRef(null);

  const handleOpenChange = (nextOpen) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
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
            <DialogPrimitive.Title className='cmdk-detail-term'>
              {selectedTerm.term}
            </DialogPrimitive.Title>
            {selectedTerm.termEn && (
              <span className='cmdk-detail-term-en'>{selectedTerm.termEn}</span>
            )}
            <span className='cmdk-detail-category'>
              {selectedTerm.categoryLabel}
            </span>
          </div>
          <DialogPrimitive.Description className='cmdk-detail-description'>
            {selectedTerm.description}
          </DialogPrimitive.Description>
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
          ...(termsByCategory[String(idx)] || []).map((term) =>
            searchFilter(term.term, search, [term.termEn || '']),
          ),
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
      <DialogPrimitive.Title className='sr-only'>
        용어 검색
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className='sr-only'>
        프론트엔드 학습 용어를 검색하고 결과 목록에서 항목을 선택해 상세
        설명을 확인할 수 있습니다.
      </DialogPrimitive.Description>
      <Command.Input
        value={search}
        placeholder='용어 검색...'
        className='cmdk-input'
        onValueChange={(nextSearch) => {
          setSearch(nextSearch);
          listRef.current?.scrollTo(0, 0);
        }}
      />
      <Command.List ref={listRef} className='cmdk-list'>
        <Command.Empty className='cmdk-empty'>
          검색 결과가 없습니다.
        </Command.Empty>
        {sortedGroups.map(({ label, idx }) => (
          <Command.Group key={idx} heading={label} className='cmdk-group'>
            {(termsByCategory[String(idx)] || []).map((term) => (
              <Command.Item
                key={term.term}
                value={term.term}
                keywords={[term.termEn || '']}
                onSelect={() => setSelectedTerm(term)}
                className='cmdk-item'
              >
                <span className='cmdk-item-term'>{term.term}</span>
                <span className='cmdk-item-desc'>
                  {term.description.length > 50
                    ? term.description.slice(0, 50) + '…'
                    : term.description}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
