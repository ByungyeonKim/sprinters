import { Link } from 'react-router';
import { useState } from 'react';
import { DictionarySearch } from './DictionarySearch';
import { terms } from './tutorials/sprinter-dictionary.js';

export function meta() {
  return [{ title: '스프린터 사전 | Sprinters' }];
}

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '렌더링과 성능', value: '0' },
  { label: 'Next.js와 라우팅', value: '1' },
  { label: '서버·클라이언트 컴포넌트', value: '2' },
];

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

  const filteredTerms = filter === 'all' ? terms : terms.filter((t) => t.category === filter);

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
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
            <span className='font-medium text-gray-900'>스프린터 사전</span>
          </nav>
          <div className='flex items-center gap-3'>
            <DictionarySearch />
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
        </div>
      </header>

      <div className='flex-1 overflow-y-auto' style={{ scrollbarGutter: 'stable' }}>
        <div className='mx-auto max-w-3xl px-6 pt-10 pb-20'>
          <div className='mb-8 flex flex-wrap gap-2'>
            {FILTERS.map((f) => (
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
