import { Link } from 'react-router';

function Home() {
  return (
    <div>
      <section className='pb-16 pt-10 border-b border-gray-200'>
        <h1 className='text-[80px] font-bold leading-none mb-8'>
          코드잇 FE
          <br />
          스프린트 저장소
        </h1>
        <p className='text-xl text-gray-600 max-w-lg mb-8'>
          혼자 고민하던 질문부터
          <br />
          오늘 배운 작은 깨달음까지 기록해보세요.
        </p>
        <div className='flex gap-6'>
          <Link
            to='/archive'
            className='group text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors'
          >
            주강사 아카이브
            <span className='inline-block ml-1 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
          <Link
            to='/til'
            className='group text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors'
          >
            Today I Learned
            <span className='inline-block ml-1 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
        </div>
      </section>

      <section className='py-12'>
        <div className='grid grid-cols-2 gap-16'>
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold'>최근 아카이브</h2>
              <Link
                to='/archive'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='space-y-6'>
              {[
                {
                  category: 'JavaScript',
                  title: '비동기 처리의 이해: Promise와 async/await',
                  date: 'Jan 28',
                  readTime: '5 min',
                },
                {
                  category: 'React',
                  title: 'useEffect 의존성 배열 제대로 이해하기',
                  date: 'Jan 25',
                  readTime: '8 min',
                },
                {
                  category: 'Git',
                  title: 'Git 브랜치 전략과 협업 워크플로우',
                  date: 'Jan 22',
                  readTime: '6 min',
                },
              ].map((post, index) => (
                <Link key={index} to='/archive' className='group block'>
                  <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>
                    {post.category}
                  </p>
                  <h3 className='font-semibold mb-1 group-hover:underline'>
                    {post.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {post.readTime} · {post.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between mb-6'>
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
                    <p className='text-xs text-gray-500 mb-1'>{post.author}</p>
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
