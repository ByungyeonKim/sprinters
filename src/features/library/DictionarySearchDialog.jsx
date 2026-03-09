import { useRef, useState } from 'react';
import { Command, defaultFilter } from 'cmdk';
import { Dialog as DialogPrimitive } from 'radix-ui';
import {
  dictionaryCategories,
  getShortTermDescription,
  getTermKeywords,
} from './sprinter-dictionary-data';

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

function getCategoryMaxScore(category, search) {
  return Math.max(
    0,
    ...category.terms.map((term) =>
      searchFilter(term.term, search, getTermKeywords(term)),
    ),
  );
}

function getSortedCategories(search) {
  if (!search) {
    return dictionaryCategories;
  }

  return [...dictionaryCategories].sort(
    (a, b) => getCategoryMaxScore(b, search) - getCategoryMaxScore(a, search),
  );
}

function DictionarySearchList({
  listRef,
  search,
  onSearchChange,
  onSelectTerm,
}) {
  const sortedCategories = getSortedCategories(search);

  return (
    <>
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
        onValueChange={onSearchChange}
      />
      <Command.List ref={listRef} className='cmdk-list'>
        <Command.Empty className='cmdk-empty'>
          검색 결과가 없습니다.
        </Command.Empty>
        {sortedCategories.map((category) => (
          <Command.Group
            key={category.value}
            heading={category.label}
            className='cmdk-group'
          >
            {category.terms.map((term) => (
              <Command.Item
                key={term.term}
                value={term.term}
                keywords={getTermKeywords(term)}
                onSelect={() => onSelectTerm(term)}
                className='cmdk-item'
              >
                <span className='cmdk-item-term'>{term.term}</span>
                <span className='cmdk-item-desc'>
                  {getShortTermDescription(term)}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </>
  );
}

function DictionarySearchDetail({ term, onBack }) {
  return (
    <div className='cmdk-detail'>
      <button type='button' onClick={onBack} className='cmdk-back-button'>
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
          {term.term}
        </DialogPrimitive.Title>
        {term.termEn && (
          <span className='cmdk-detail-term-en'>{term.termEn}</span>
        )}
        <span className='cmdk-detail-category'>{term.categoryLabel}</span>
      </div>
      <DialogPrimitive.Description className='cmdk-detail-description'>
        {term.description}
      </DialogPrimitive.Description>
    </div>
  );
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

  const handleSearchChange = (nextSearch) => {
    setSearch(nextSearch);
    listRef.current?.scrollTo(0, 0);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={handleOpenChange}
      label={selectedTerm ? '용어 상세' : '용어 검색'}
      overlayClassName='cmdk-overlay'
      contentClassName='cmdk-content'
      filter={searchFilter}
      loop
    >
      {selectedTerm ? (
        <DictionarySearchDetail
          term={selectedTerm}
          onBack={() => setSelectedTerm(null)}
        />
      ) : (
        <DictionarySearchList
          listRef={listRef}
          search={search}
          onSearchChange={handleSearchChange}
          onSelectTerm={setSelectedTerm}
        />
      )}
    </Command.Dialog>
  );
}
