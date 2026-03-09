import { useState } from 'react';
import { LibraryHeader } from './LibraryHeader';
import { dictionaryFilters, terms } from './sprinter-dictionary-data';

export function meta() {
  return [{ title: '스프린터 사전 | Sprinters' }];
}

function TermRow({ term }) {
  return (
    <tr data-category={term.category}>
      <td>
        <strong>{term.term}</strong>
        {term.termEn && (
          <>
            <br />
            <span style={{ color: '#6b7280' }}>{term.termEn}</span>
          </>
        )}
      </td>
      <td>{term.description}</td>
      <td>
        <strong>{term.categoryLabel}</strong>
      </td>
    </tr>
  );
}

export default function SprinterDictionary() {
  const [filter, setFilter] = useState('all');

  const filteredTerms =
    filter === 'all' ? terms : terms.filter((t) => t.category === filter);

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
      <LibraryHeader title='스프린터 사전' />

      <div
        className='flex-1 overflow-y-auto'
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className='mx-auto max-w-3xl px-6 pt-10 pb-20'>
          <div className='mb-8 flex flex-wrap gap-2'>
            {dictionaryFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <article className='prose library-content max-w-none'>
            <table>
              <thead>
                <tr>
                  <th>용어</th>
                  <th>설명</th>
                  <th style={{ whiteSpace: 'nowrap' }}>카테고리</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerms.map((t) => (
                  <TermRow key={t.term} term={t} />
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </div>
  );
}
