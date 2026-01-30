function Archive() {
  const posts = [
    {
      category: 'JavaScript',
      title: '비동기 처리의 이해: Promise와 async/await',
      description: 'JavaScript에서 비동기 처리를 다루는 방법과 Promise, async/await의 차이점을 알아봅니다. 콜백 지옥에서 벗어나 더 깔끔한 코드를 작성하는 방법을 배워봅시다.',
      date: 'Jan 28',
      readTime: '5 min read',
    },
    {
      category: 'React',
      title: 'useEffect 의존성 배열 제대로 이해하기',
      description: 'useEffect의 의존성 배열이 어떻게 동작하는지, 언제 어떤 값을 넣어야 하는지 정리했습니다. 무한 루프를 피하고 올바르게 사용하는 방법을 알아봅니다.',
      date: 'Jan 25',
      readTime: '8 min read',
    },
    {
      category: 'Git',
      title: 'Git 브랜치 전략과 협업 워크플로우',
      description: '팀 프로젝트에서 효율적으로 협업하기 위한 Git 브랜치 전략을 소개합니다. Git Flow, GitHub Flow 등 다양한 전략의 장단점을 비교해봅니다.',
      date: 'Jan 22',
      readTime: '6 min read',
    },
    {
      category: 'React',
      title: 'React Router v7 Data Mode 완벽 가이드',
      description: 'createBrowserRouter를 활용한 모던 라우팅 패턴과 loader, action 사용법을 다룹니다. 데이터 페칭을 라우트 레벨에서 관리하는 방법을 배워봅시다.',
      date: 'Jan 20',
      readTime: '10 min read',
    },
  ]

  return (
    <div className="max-w-[680px] mx-auto">
      <header className="py-10 border-b border-gray-200 mb-10">
        <h1 className="text-4xl font-bold mb-3">주강사 아카이브</h1>
        <p className="text-gray-600">
          수강생들이 궁금해했던 내용을 정리한 공간입니다.
        </p>
      </header>

      <div className="space-y-10">
        {posts.map((post, index) => (
          <article key={index} className="group cursor-pointer">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {post.category}
            </p>
            <h2 className="text-2xl font-bold mb-2 group-hover:underline">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {post.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.readTime}</span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export { Archive }
