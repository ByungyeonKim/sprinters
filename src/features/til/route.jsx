import { Suspense } from 'react';
import { Link, useLoaderData, Await } from 'react-router';
import { fetchTilPosts } from './til-service';
import { useAuth } from '../../hooks/use-auth';
import { LikeCount } from '../../components/LikeCount';
import { CommentCount } from '../../components/CommentCount';
import { stripHtml } from '../../utils/html';
import { TilPostsSkeleton } from './TILHydrateFallback';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function meta() {
  const title = 'Today I Learned | Sprinters';
  const description = '오늘 배운 내용을 기록하고 공유하는 공간입니다.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/til` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export function loader() {
  return { postsPromise: fetchTilPosts() };
}

export default function TIL() {
  const { postsPromise } = useLoaderData();
  const { user, signInWithGitHub } = useAuth();

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 flex flex-wrap items-end justify-between border-b border-gray-200 py-10'>
        <div>
          <h1 className='mb-3 text-3xl font-bold sm:text-4xl'>
            Today I Learned
          </h1>
          <p className='text-gray-600'>
            오늘 배운 내용을 기록하고
            <br className='sm:hidden' />
            공유하는 공간입니다.
          </p>
        </div>
        {user && (
          <Link
            to='/til/new'
            className='mt-4 rounded-full bg-violet-600 px-4 py-2 text-sm text-white transition-colors hover:bg-violet-700'
          >
            새 글 작성
          </Link>
        )}
      </header>

      {!user && (
        <div className='mb-10 rounded-lg bg-gray-50 p-6 text-center'>
          <p className='mb-3 text-gray-600'>
            로그인을 하면 TIL을 작성할 수 있어요.
          </p>
          <button
            onClick={signInWithGitHub}
            className='rounded-full bg-gray-900 px-5 py-2 text-sm text-white'
          >
            GitHub로 로그인
          </button>
        </div>
      )}

      <Suspense fallback={<TilPostsSkeleton />}>
        <Await resolve={postsPromise}>
          {(posts) => (
            <div className='space-y-10'>
              {posts.map((post, index) => (
                <article key={index} className='group'>
                  <div className='mb-4 flex items-center gap-3'>
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <div>
                      <p className='text-sm font-medium'>{post.author}</p>
                      <p className='text-sm text-gray-500'>{post.date}</p>
                    </div>
                  </div>
                  <Link to={`/til/@${post.githubUsername}/${post.postNumber}`}>
                    <h2 className='mb-3 text-2xl font-bold group-hover:underline'>
                      {post.title}
                    </h2>
                  </Link>
                  <p className='mb-4 line-clamp-2 leading-relaxed text-gray-600'>
                    {stripHtml(post.content)}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className='flex items-center gap-4 text-gray-500'>
                      <LikeCount count={post.likes} />
                      <CommentCount count={post.comments} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
