import { Link } from 'react-router';
import { tutorials } from './library-data';

export function meta() {
  return [{ title: '라이브러리 | Sprinters' }];
}

export default function LibraryPage() {
  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <h1 className='mb-3 text-3xl font-bold sm:text-4xl'>라이브러리</h1>
        <p className='text-gray-600'>
          강의 자료와 가이드 문서를 학습할 수 있습니다.
        </p>
      </header>
      <div className='grid gap-4 sm:grid-cols-2'>
        {tutorials.map((tutorial) => (
          <Link
            key={tutorial.slug}
            to={`/library/${tutorial.slug}`}
            prefetch='intent'
            className='group flex flex-col rounded-xl border border-gray-200 p-6 transition-colors hover:border-gray-300 hover:bg-gray-50'
          >
            <h2 className='mb-2 text-lg font-semibold group-hover:text-black'>
              {tutorial.title}
            </h2>
            <p className='mb-4 flex-1 text-sm leading-relaxed text-gray-500'>
              {tutorial.description}
            </p>
            <div className='flex items-center gap-3 text-xs text-gray-400'>
              {tutorial.totalTerms ? (
                <span>{tutorial.totalTerms}개의 용어</span>
              ) : (
                <>
                  <span>{tutorial.difficulty}</span>
                  <span>·</span>
                  <span>{tutorial.chapters}개 챕터</span>
                  <span>·</span>
                  <span>{tutorial.totalSessions}개 세션</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
