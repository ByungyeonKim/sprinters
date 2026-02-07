import { Link, useLoaderData } from 'react-router';

function Home() {
  const { students, popularPosts } = useLoaderData();
  return (
    <div>
      <section className='border-b border-gray-200 pt-10 pb-10'>
        <h1 className='mb-8 text-[62px] leading-none font-bold'>
          Always Moving
          <br />
          Forward.
        </h1>
        <p className='mb-8 max-w-lg text-xl text-gray-600'>
          혼자 고민하던 호기심부터
          <br />
          오늘 배운 작은 깨달음까지 기록하고, 공유해보세요.
        </p>
        <div className='flex gap-6'>
          <Link
            to='/mission'
            className='group text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600'
          >
            스프린트 미션
            <span className='ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
          <Link
            to='/til'
            className='group text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600'
          >
            Today I Learned
            <span className='ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
        </div>
      </section>

      <section className='pt-12'>
        <div className='grid grid-cols-2 gap-16'>
          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>FE 22기 스프린트 미션 순위</h2>
              <Link
                to='/mission'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {students.slice(0, 10).map((student, index) => (
                <a
                  key={student.id}
                  href={`https://github.com/${student.github}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center gap-3'
                >
                  <span className='basis-9 text-2xl font-bold text-gray-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className='h-12 w-12 rounded-full object-cover'
                  />
                  <span className='font-medium group-hover:underline'>
                    {student.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>스프린터 인기 TIL</h2>
              <Link
                to='/til'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='space-y-6'>
              {popularPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/til/@${post.githubUsername}/${post.postNumber}`}
                  className='group flex items-start gap-4'
                >
                  <span className='text-2xl font-bold text-gray-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className='flex-1'>
                    <p className='mb-1 text-xs text-gray-500'>{post.author}</p>
                    <div className='flex justify-between'>
                      <h3 className='font-semibold group-hover:underline'>
                        {post.title}
                      </h3>
                      <div className='flex items-center gap-3 text-xs text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <svg
                            className='h-3.5 w-3.5'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                              stroke='currentColor'
                              strokeWidth='1.5'
                            />
                          </svg>
                          {post.likes}
                        </span>
                        <span className='flex items-center gap-1'>
                          <svg
                            className='h-3.5 w-3.5'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z'
                              stroke='currentColor'
                              strokeWidth='1.5'
                            />
                          </svg>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export { Home };
