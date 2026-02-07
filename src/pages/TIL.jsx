import { Link, useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function TIL() {
  const { posts } = useLoaderData();
  const { user } = useAuth();

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 flex items-end justify-between border-b border-gray-200 py-10'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>Today I Learned</h1>
          <p className='text-gray-600'>
            오늘 배운 내용을 기록하고 공유하는 공간입니다.
          </p>
        </div>
        {user && (
          <Link
            to='/til/new'
            className='rounded-full bg-violet-600 px-4 py-2 text-sm text-white transition-colors hover:bg-violet-700'
          >
            새 글 작성
          </Link>
        )}
      </header>

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
              {post.content}
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
              <div className='flex items-center gap-4'>
                <button className='flex items-center gap-1 text-gray-500 transition-colors hover:text-red-500'>
                  <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='text-sm'>{post.likes}</span>
                </button>
                <button className='flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900'>
                  <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M8.5 14.5L4 17.5V4.5C4 3.67 4.67 3 5.5 3H18.5C19.33 3 20 3.67 20 4.5V13.5C20 14.33 19.33 15 18.5 15H10L8.5 14.5Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='text-sm'>0</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { TIL };
