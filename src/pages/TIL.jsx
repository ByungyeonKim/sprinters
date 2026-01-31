function TIL() {
  const posts = [
    {
      author: '김코딩',
      date: 'Jan 30',
      title: 'React Router v7의 Data Mode 학습',
      content:
        '오늘은 React Router v7에서 새롭게 도입된 Data Mode에 대해 학습했습니다. createBrowserRouter를 사용하면 라우트 단위로 loader와 action을 정의할 수 있어서 데이터 페칭과 뮤테이션을 더 체계적으로 관리할 수 있다는 것을 알게 되었습니다.',
      tags: ['React', 'Router'],
      claps: 12,
    },
    {
      author: '이개발',
      date: 'Jan 29',
      title: 'Tailwind CSS 처음 사용해보기',
      content:
        'Tailwind CSS를 처음 사용해봤는데, 유틸리티 클래스 방식이 처음에는 어색했지만 익숙해지니까 스타일링 속도가 훨씬 빨라졌습니다. 특히 반응형 디자인을 md:, lg: 프리픽스로 쉽게 처리할 수 있어서 좋았습니다.',
      tags: ['CSS', 'Tailwind'],
      claps: 8,
    },
    {
      author: '박프론트',
      date: 'Jan 28',
      title: 'Git 충돌 해결하면서 배운 점',
      content:
        '팀 프로젝트 중 처음으로 merge conflict를 경험했습니다. 처음엔 당황했지만, VSCode의 충돌 해결 UI를 사용하니 생각보다 쉽게 해결할 수 있었습니다. 앞으로는 자주 pull 받아서 충돌을 최소화해야겠습니다.',
      tags: ['Git', '협업'],
      claps: 15,
    },
  ];

  return (
    <div className='mx-auto max-w-170'>
      <header className='mb-10 flex items-end justify-between border-b border-gray-200 py-10'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>Today I Learned</h1>
          <p className='text-gray-600'>
            오늘 배운 내용을 기록하고 공유하는 공간입니다.
          </p>
        </div>
        <button className='rounded-full bg-violet-600 px-4 py-2 text-sm text-white transition-colors hover:bg-violet-700'>
          새 글 작성
        </button>
      </header>

      <div className='space-y-10'>
        {posts.map((post, index) => (
          <article key={index} className='group'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-gray-200' />
              <div>
                <p className='text-sm font-medium'>{post.author}</p>
                <p className='text-sm text-gray-500'>{post.date}</p>
              </div>
            </div>
            <h2 className='mb-3 cursor-pointer text-2xl font-bold group-hover:underline'>
              {post.title}
            </h2>
            <p className='mb-4 leading-relaxed text-gray-600'>{post.content}</p>
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
                <span className='text-sm'>{post.claps}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export { TIL };
