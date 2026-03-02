import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router';
import { fetchQnaQuestions } from './qna-service';
import { useAuth } from '../../hooks/use-auth';
import { QuestionForm } from './QuestionForm';
import { QuestionCard } from './QuestionCard';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function meta() {
  const title = 'Q&A | Sprinters';
  const description = '익명으로 자유롭게 질문하고 답변하는 공간입니다.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/qna` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export function loader() {
  return { questionsPromise: fetchQnaQuestions() };
}

export default function QnA() {
  const { questionsPromise } = useLoaderData();
  const { user, signInWithGitHub } = useAuth();

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <h1 className='mb-3 text-3xl font-bold sm:text-4xl'>익명 질문</h1>
        <p className='text-gray-600'>
          어떤 질문이든 괜찮아요, <br className='sm:hidden' />
          익명으로 자유롭게 질문해보세요.
        </p>
      </header>

      {user ? (
        <QuestionForm />
      ) : (
        <div className='mb-10 rounded-lg bg-gray-50 p-6 text-center'>
          <p className='mb-3 text-gray-600'>
            로그인을 하면 질문을 작성할 수 있어요.
          </p>
          <button
            onClick={signInWithGitHub}
            className='rounded-full bg-gray-900 px-5 py-2 text-sm text-white'
          >
            GitHub로 로그인
          </button>
        </div>
      )}

      <Suspense
        fallback={
          <div className='space-y-6'>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className='animate-pulse rounded-lg border border-gray-200 p-6'
              >
                <div className='mb-4 flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-gray-200' />
                  <div className='space-y-2'>
                    <div className='h-4 w-24 rounded bg-gray-200' />
                    <div className='h-3 w-16 rounded bg-gray-200' />
                  </div>
                </div>
                <div className='mb-4 space-y-2'>
                  <div className='h-4 w-full rounded bg-gray-200' />
                  <div className='h-4 w-3/4 rounded bg-gray-200' />
                </div>
                <div className='flex gap-4'>
                  <div className='h-4 w-10 rounded bg-gray-200' />
                  <div className='h-4 w-10 rounded bg-gray-200' />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <Await resolve={questionsPromise}>
          {(questions) => (
            <div className='space-y-6'>
              {questions.length === 0 ? (
                <p className='text-center text-gray-500'>
                  아직 질문이 없습니다. 첫 번째 질문을 작성해보세요!
                </p>
              ) : (
                questions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              )}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
