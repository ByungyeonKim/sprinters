import { Link, useLoaderData } from 'react-router';

function Home() {
  const { students } = useLoaderData();
  return (
    <div>
      <section className='border-b border-gray-200 pt-10 pb-16'>
        <h1 className='mb-8 text-[80px] leading-none font-bold'>
          코드잇 FE
          <br />
          스프린터 저장소
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

      <section className='py-12'>
        <div className='grid grid-cols-2 gap-16'>
          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>스프린트 미션 순위</h2>
              <Link
                to='/mission'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {students.slice(0, 10).map((student, index) => (
                <Link
                  key={student.id}
                  to='/mission'
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
                </Link>
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
              {[
                {
                  author: '김코딩',
                  title: 'React Router v7의 Data Mode 학습',
                  likes: 12,
                },
                {
                  author: '박프론트',
                  title: 'Git 충돌 해결하면서 배운 점',
                  likes: 15,
                },
                {
                  author: '이개발',
                  title: 'Tailwind CSS 처음 사용해보기',
                  likes: 8,
                },
                {
                  author: '최백엔드',
                  title: 'REST API 설계 원칙 정리',
                  likes: 7,
                },
                {
                  author: '정풀스택',
                  title: 'TypeScript 제네릭 이해하기',
                  likes: 6,
                },
              ].map((post, index) => (
                <Link
                  key={index}
                  to='/til'
                  className='group flex items-start gap-4'
                >
                  <span className='text-2xl font-bold text-gray-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>{post.author}</p>
                    <h3 className='font-semibold group-hover:underline'>
                      {post.title}
                    </h3>
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
