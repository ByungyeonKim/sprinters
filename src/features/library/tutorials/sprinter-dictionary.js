export const terms = [
  {
    term: 'CSR',
    termEn: 'Client-Side Rendering',
    description:
      '서버가 빈 HTML 껍데기를 보내고, 브라우저가 JavaScript를 실행해서 화면을 그리는 방식입니다. React 단독 사용 시 기본 동작 방식입니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'SSR',
    termEn: 'Server-Side Rendering',
    description:
      '서버에서 HTML을 미리 생성해 브라우저로 보내는 렌더링 방식입니다. JavaScript가 모두 실행되기 전에도 사용자가 콘텐츠를 먼저 볼 수 있어 첫 화면 표시와 SEO에 유리할 수 있습니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'SSG',
    termEn: 'Static Site Generation',
    description:
      '빌드 시점에 HTML을 미리 생성해 두는 렌더링 방식입니다. 사용자가 요청하면 이미 만들어진 HTML을 바로 전달하므로 응답이 빠르고, CDN에 캐싱하기 좋습니다. 블로그 글이나 문서처럼 자주 바뀌지 않는 콘텐츠에 적합합니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'SPA',
    termEn: 'Single Page Application',
    description:
      '하나의 웹 페이지를 기반으로 JavaScript가 화면을 동적으로 전환하는 애플리케이션 방식입니다. 페이지 이동 시 매번 전체 문서를 새로고침하지 않고 필요한 부분만 업데이트합니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'SEO',
    termEn: 'Search Engine Optimization',
    description:
      '검색 엔진이 웹페이지의 내용을 잘 이해하고, 관련 검색 결과에 적절하게 노출할 수 있도록 개선하는 최적화입니다. 제목, 설명, 구조화된 HTML, 메타데이터 등이 중요한 요소로 사용됩니다. SSR은 페이지의 HTML을 미리 제공할 수 있어, 검색 엔진이 콘텐츠를 더 쉽게 확인하는 데 도움이 될 수 있습니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '하이드레이션',
    termEn: 'Hydration',
    description:
      '서버가 보낸 정적 HTML에 JavaScript 이벤트 핸들러를 연결하는 과정입니다. hydration이 완료되어야 버튼 클릭 같은 상호작용이 가능해집니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '번들',
    termEn: 'Bundle',
    description:
      '여러 JavaScript 파일과 의존성을 하나(또는 소수)의 파일로 묶은 결과물입니다. 번들이 클수록 다운로드와 실행에 시간이 걸립니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '코드 분할',
    termEn: 'Code Splitting',
    description:
      '번들을 페이지별 또는 기능별로 나누어, 현재 필요한 코드만 로드하는 최적화 기법입니다. Next.js는 페이지 단위로 자동 코드 분할을 해줍니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '데이터 워터폴',
    termEn: 'Data Waterfall',
    description:
      'API 요청이 순차적으로 이어져 전체 로딩이 느려지는 현상입니다. A 요청이 끝나야 B를 시작하고, B가 끝나야 C를 시작하는 식으로 대기 시간이 누적됩니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'FCP',
    termEn: 'First Contentful Paint',
    description:
      '사용자가 페이지에 들어온 뒤, 화면에 첫 번째 콘텐츠(예: 텍스트, 이미지)가 보이기까지 걸리는 시간입니다. 이 시간이 짧을수록 사용자는 화면이 더 빨리 나타나고, 덜 답답하게 느껴집니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '트리 쉐이킹',
    termEn: 'Tree Shaking',
    description:
      '빌드 과정에서 실제로 사용되지 않는 코드를 번들에서 제거해 파일 크기를 줄이는 최적화 기법입니다. 나무를 흔들어 필요 없는 잎을 떨어뜨리는 모습에 비유해 붙은 이름입니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '타임스탬프',
    termEn: 'Timestamp',
    description:
      '특정 시점을 나타내는 값입니다. 문자열, 숫자, Date 객체 등 여러 데이터 형식으로 표현될 수 있으며, 타임스탬프 자체는 "시간을 나타내는 개념"이고 어떤 형식으로 담느냐는 별개의 문제입니다. 게시글의 작성일, 수정일 등을 기록할 때 사용됩니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'Suspense / fallback',
    termEn: null,
    description:
      '비동기 작업(데이터 로딩 등) 중에 대체 UI(로딩 스피너 등)를 보여주는 React 기능입니다. <Suspense fallback={<Loading />}> 형태로 사용합니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'ORM',
    termEn: 'Object-Relational Mapping',
    description:
      '데이터베이스 테이블을 프로그래밍 언어의 객체로 매핑해 SQL 대신 코드로 데이터를 다룰 수 있게 해주는 도구입니다. 예를 들어 db.post.findMany() 같은 코드가 내부적으로 SQL 쿼리로 변환됩니다. Prisma, Drizzle 등이 대표적입니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '마운트',
    termEn: 'Mount',
    description:
      '컴포넌트가 처음으로 DOM에 삽입되어 화면에 나타나는 시점을 말합니다. React에서 useEffect(() => {}, [])가 실행되는 시점이 마운트 직후입니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '폴링',
    termEn: 'Polling',
    description:
      '클라이언트가 서버에 일정 간격으로 반복 요청을 보내 새 데이터가 있는지 확인하는 방식입니다. 예를 들어 채팅 앱에서 5초마다 fetch(\'/api/messages\')를 호출해 새 메시지를 확인하는 것이 폴링입니다. WebSocket 같은 실시간 연결 대신 사용하는 단순한 대안입니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: '스트리밍',
    termEn: 'Streaming',
    description:
      '데이터를 한꺼번에 보내는 대신, 준비된 부분부터 나눠서 보내는 전송 방식입니다. Next.js에서는 Suspense를 사용하면 서버가 완성된 HTML 부분부터 브라우저로 전송하고, 나머지는 준비되는 대로 이어서 보냅니다. 사용자는 전체 페이지가 완성될 때까지 기다리지 않고 점진적으로 콘텐츠를 볼 수 있습니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'CDN',
    termEn: 'Content Delivery Network',
    description:
      '전 세계 여러 지역에 서버(엣지 서버)를 배치해서, 사용자와 가장 가까운 서버에서 콘텐츠를 제공하는 시스템입니다. 원본 서버가 멀리 있어도 가까운 CDN 서버에서 캐싱된 파일을 받으므로 응답 속도가 빨라집니다. 정적 파일(HTML, CSS, JS, 이미지)을 제공하는 데 주로 사용됩니다.',
    category: '0',
    categoryLabel: '렌더링과 성능',
  },
  {
    term: 'App Router',
    termEn: null,
    description:
      'Next.js 13부터 도입된 새로운 파일 기반 라우팅 시스템입니다. app/ 디렉토리를 사용하며, 서버 컴포넌트와 중첩 레이아웃을 기본 지원합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: '파일 기반 라우팅',
    termEn: 'File-based Routing',
    description:
      '별도의 라우터 설정 없이 폴더와 파일 구조가 곧 URL 경로가 되는 방식입니다. app/about/page.tsx → /about',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: 'page.tsx',
    termEn: null,
    description:
      '해당 경로의 UI를 정의하는 파일입니다. 이 파일이 있어야 해당 경로가 공개적으로 접근 가능한 페이지가 됩니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: 'layout.tsx',
    termEn: null,
    description:
      '하위 페이지들이 공유하는 껍데기(레이아웃)를 정의하는 파일입니다. 네비게이션 바, 사이드바 등 공통 UI를 배치합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: 'loading.tsx',
    termEn: null,
    description:
      '페이지가 로딩되는 동안 보여줄 대체 UI를 정의하는 파일입니다. React의 Suspense를 내부적으로 활용합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: 'error.tsx',
    termEn: null,
    description:
      '에러 발생 시 보여줄 UI를 정의하는 파일입니다. React의 Error Boundary를 내부적으로 활용하여 에러를 격리합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: '동적 라우트 [slug]',
    termEn: 'Dynamic Route',
    description:
      'URL의 일부를 변수로 받는 라우트입니다. app/posts/[slug]/page.tsx로 만들면 /posts/hello, /posts/world 등 다양한 경로를 하나의 파일로 처리합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: '루트 레이아웃',
    termEn: 'Root Layout',
    description:
      '앱 전체를 감싸는 최상위 레이아웃(app/layout.tsx)입니다. <html>과 <body> 태그를 포함하며, 모든 페이지에 공통으로 적용됩니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: '중첩 레이아웃',
    termEn: 'Nested Layout',
    description:
      '레이아웃 안에 레이아웃이 겹쳐지는 구조입니다. 예를 들어 루트 레이아웃(헤더) 안에 대시보드 레이아웃(사이드바)이 중첩될 수 있습니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: 'default export',
    termEn: null,
    description:
      '파일에서 하나의 기본값을 내보내는 JavaScript 문법입니다. page.tsx, layout.tsx 등 Next.js 규칙 파일은 반드시 default export를 사용해야 합니다.',
    category: '1',
    categoryLabel: 'Next.js와 라우팅',
  },
  {
    term: '서버 컴포넌트',
    termEn: 'Server Component',
    description:
      '서버에서만 실행되어 JavaScript 번들에 포함되지 않는 컴포넌트입니다. DB 조회, 파일 읽기 등 서버 자원에 직접 접근할 수 있고, 번들 크기를 줄여줍니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: '클라이언트 컴포넌트',
    termEn: 'Client Component',
    description:
      '브라우저에서도 실행되어 사용자 상호작용(클릭, 입력 등)을 처리할 수 있는 컴포넌트입니다. useState, useEffect 등 React Hook을 사용할 수 있습니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: "'use client' 지시어",
    termEn: null,
    description:
      "파일 최상단에 'use client'를 선언하면 해당 파일과 그 하위 import가 클라이언트 컴포넌트 경계로 지정됩니다. 상호작용이 필요한 컴포넌트에만 사용합니다.",
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: 'RSC',
    termEn: 'React Server Components',
    description:
      '컴포넌트를 서버용과 클라이언트용으로 구분하는 React의 새로운 아키텍처입니다. Next.js App Router는 RSC를 기반으로 동작합니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: '직렬화',
    termEn: 'Serialization',
    description:
      '데이터를 전송 가능한 형태(JSON 등)로 변환하는 것입니다. 서버 → 클라이언트로 props를 전달할 때 직렬화 가능한 값(문자열, 숫자, 배열 등)만 보낼 수 있습니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: '모듈 의존성 트리',
    termEn: 'Module Dependency Tree',
    description:
      "파일 간 import 관계로 만들어지는 구조입니다. 'use client'가 이 트리에서 서버/클라이언트 경계를 나누는 기준이 됩니다.",
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: '컴포넌트 트리',
    termEn: 'Component Tree',
    description:
      'JSX 기반으로 React가 만드는 컴포넌트 계층 구조입니다. 모듈 의존성 트리와 달리, children으로 전달된 서버 컴포넌트는 클라이언트 컴포넌트 안에서도 서버 컴포넌트로 유지됩니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: '합성',
    termEn: 'Composition',
    description:
      'children prop을 통해 서버 컴포넌트와 클라이언트 컴포넌트를 조합하는 패턴입니다. 클라이언트 컴포넌트가 서버 컴포넌트를 children으로 받으면, 서버 컴포넌트의 장점을 유지할 수 있습니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
  {
    term: 'Provider 패턴',
    termEn: null,
    description:
      'React Context Provider를 클라이언트 컴포넌트로 만들고, 이를 서버 컴포넌트에서 감싸 하위 클라이언트 컴포넌트에 공통 상태를 제공하는 패턴입니다. 테마처럼 여러 컴포넌트가 함께 써야 하는 값을 공유할 때 유용하며, 서버 컴포넌트의 렌더링 이점도 함께 유지할 수 있습니다.',
    category: '2',
    categoryLabel: '서버·클라이언트 컴포넌트',
  },
];

export default {
  slug: 'sprinter-dictionary',
  title: '스프린터 사전',
};
