import { h2, titleBox } from '../shared/content-helpers';

export default {
      title: 'Navigation + 실습 고도화',
      locked: import.meta.env.PROD,
      sessions: [
        {
          title: 'Link 컴포넌트 심화와 usePathname',
          content: `
${h2('link-vs-a', '&lt;Link&gt; vs &lt;a&gt; - 클라이언트 사이드 내비게이션')}

<p>Ch.1에서 <code>&lt;Link&gt;</code>를 처음 사용했습니다. HTML의 <code>&lt;a&gt;</code> 태그와 비슷해 보이지만, 동작 방식이 근본적으로 다릅니다.</p>

<table>
<thead>
<tr><th></th><th><code>&lt;a href="..."&gt;</code></th><th><code>&lt;Link href="..."&gt;</code></th></tr>
</thead>
<tbody>
<tr><td>동작</td><td>브라우저가 페이지 전체를 새로 요청</td><td>필요한 부분만 교체 (클라이언트 사이드 내비게이션)</td></tr>
<tr><td>새로고침</td><td>발생</td><td>발생하지 않음</td></tr>
<tr><td>레이아웃 상태</td><td>초기화됨 (사이드바 열림/닫힘 등 유실)</td><td>유지됨</td></tr>
<tr><td>속도</td><td>느림 (HTML, CSS, JS 전부 다시 로드)</td><td>빠름 (변경된 컴포넌트만 교체)</td></tr>
</tbody>
</table>

<p>직접 확인해 보세요. 루트 레이아웃에서 <code>&lt;Link&gt;</code>를 <code>&lt;a&gt;</code>로 바꿔보면, 페이지를 이동할 때마다 화면이 깜빡이며 전체가 다시 로드됩니다.</p>

${titleBox('info', '핵심 원리', 'Next.js의 <code>&lt;Link&gt;</code>는 클릭 시 브라우저의 기본 동작(전체 페이지 요청)을 막고, JavaScript로 URL을 변경한 뒤 필요한 컴포넌트의 렌더링 결과를 서버에서 가져와 교체합니다. 이것이 <strong>클라이언트 사이드 내비게이션</strong>입니다.')}

${h2('prefetching', 'Prefetching - 미리 로드하기')}

<p><code>&lt;Link&gt;</code>에는 숨겨진 기능이 하나 더 있습니다. 링크가 뷰포트(화면)에 보이면, 해당 페이지의 데이터를 <strong>미리 가져옵니다</strong>. 사용자가 클릭하기 전에 이미 준비가 되어 있으므로, 이동이 거의 즉시 일어납니다.</p>

<pre><code class="language-tsx">// 기본 동작: 뷰포트에 보이면 자동 prefetch
&lt;Link href='/blog'&gt;블로그&lt;/Link&gt;

// prefetch 끄기
&lt;Link href='/blog' prefetch={false}&gt;블로그&lt;/Link&gt;</code></pre>

${titleBox('neutral', 'DevTools에서 확인하기', 'Prefetching은 프로덕션 모드에서만 동작합니다. <code>npm run build && npm start</code>로 프로덕션 서버를 실행한 뒤, 개발자 도구의 네트워크 탭에서 확인해 보세요. 링크가 화면에 보이는 순간, 링크된 페이지의 데이터를 미리 가져오는 요청이 발생하는 것을 확인할 수 있습니다.')}

${h2('use-pathname', 'usePathname - 현재 경로 알아내기')}

<p><code>usePathname()</code>은 현재 URL의 경로 부분을 반환하는 Hook입니다. 현재 페이지를 내비게이션에서 강조하거나, 특정 경로에서만 UI를 다르게 보여주는 등 경로에 따라 동작을 분기할 때 사용합니다.</p>

<pre><code class="language-tsx">'use client';

import { usePathname } from 'next/navigation';

export default function Example() {
  const pathname = usePathname();
  // /blog/nextjs-routing 접속 시 → "/blog/nextjs-routing"
  // /about 접속 시 → "/about"

  return &lt;p&gt;현재 경로: {pathname}&lt;/p&gt;;
}</code></pre>

${titleBox('warn', 'usePathname은 클라이언트 컴포넌트 전용입니다', "Hook을 사용하므로 반드시 <code>'use client'</code>가 필요합니다. 서버 컴포넌트에서는 사용할 수 없습니다.")}

${h2('navlink-component', 'NavLink 컴포넌트 구현')}

<p><code>usePathname</code>과 <code>Link</code>를 조합하면 현재 페이지를 강조하는 내비게이션 링크를 만들 수 있습니다:</p>

<pre><code class="language-tsx">// app/components/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    &lt;Link
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-inherit'}
    &gt;
      {children}
    &lt;/Link&gt;
  );
}</code></pre>

<p><code>pathname.startsWith(href + '/')</code>는 하위 경로도 활성 상태로 표시하기 위한 패턴입니다. 예를 들어 <code>/blog/nextjs-routing</code>에 접속해도 <code>/blog</code> 링크가 활성화됩니다.</p>

<p>참고로, <code>usePathname()</code>은 URL의 path 부분만 반환하며 쿼리 스트링은 포함하지 않습니다. 쿼리 스트링은 <a href="https://nextjs.org/docs/app/api-reference/functions/use-search-params" target="_blank" rel="noopener noreferrer">useSearchParams()</a>를 사용합니다.</p>

          `,
        },
        {
          title: 'URL 상태 관리와 프로그래밍 방식 라우팅',
          content: `
${h2('url-as-state', 'URL을 상태 저장소로 사용하기')}

<p><strong>URL도 하나의 상태 저장소(state store)입니다.</strong></p>

<p>웹을 사용하다 보면 이런 URL을 자주 보게 됩니다.</p>

<pre><code class="language-text">/blog?q=react
/blog?category=nextjs
/blog?page=2</code></pre>

<p>이 URL에는 단순한 주소 이상의 정보가 들어 있습니다. 검색어, 카테고리, 페이지 번호처럼 <strong>현재 화면의 상태</strong>가 담겨 있습니다.</p>

<p>예를 들어 <code>/blog?q=react</code>로 접속하면 "react"를 검색한 상태의 글 목록이 바로 표시됩니다. URL을 그대로 복사해 다른 사람에게 보내면, 상대방도 같은 화면을 보게 됩니다.</p>

<p>이처럼 URL은 단순한 페이지 위치가 아니라 <strong>애플리케이션의 상태를 표현하는 공간</strong>이기도 합니다.</p>

<p>하지만 Ch.2에서는 검색어와 카테고리 상태를 <code>useState</code>로 관리했습니다. 이 방식에는 몇 가지 한계가 있습니다.</p>

<table>
<thead>
<tr><th style="width: 20%"></th><th style="width: 40%"><code>useState</code></th><th style="width: 40%">URL 쿼리 스트링</th></tr>
</thead>
<tbody>
<tr><td>새로고침</td><td>상태 유실</td><td>URL이 곧 상태이므로 유지됨</td></tr>
<tr><td>공유</td><td>현재 상태를 링크로 전달 불가</td><td>URL을 그대로 공유하면 동일한 화면</td></tr>
<tr><td>뒤로 가기</td><td>상태 변경을 추적하지 못함</td><td>브라우저 히스토리에 자동 기록됨</td></tr>
</tbody>
</table>

${h2('use-search-params', 'useSearchParams - URL 쿼리 스트링 읽기')}

<p><code>useSearchParams()</code>는 URL의 쿼리 스트링을 읽을 수 있는 Hook입니다.</p>

<pre><code class="language-tsx">'use client';

import { useSearchParams } from 'next/navigation';

export default function Example() {
  const searchParams = useSearchParams();

  // URL: /blog?category=react&q=서버
  searchParams.get('category'); // "react"
  searchParams.get('q');        // "서버"
  searchParams.get('page');     // null (없는 파라미터)

  return &lt;p&gt;카테고리: {searchParams.get('category')}&lt;/p&gt;;
}</code></pre>

<p>반환값은 읽기 전용 <a href="https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams" target="_blank" rel="noopener noreferrer">URLSearchParams</a> 객체입니다. <code>get()</code>, <code>has()</code>, <code>toString()</code> 등의 메서드를 사용할 수 있습니다.</p>

${titleBox('warn', 'Suspense 경계가 필요할 수 있습니다', '정적으로 렌더링되는 페이지에서 <code>useSearchParams()</code>를 사용하면, 해당 클라이언트 컴포넌트를 <code>&lt;Suspense&gt;</code>로 감싸야 합니다. 그렇지 않으면 프로덕션 빌드 시 오류가 발생합니다. 반대로 페이지가 <code>searchParams</code> prop 등으로 이미 동적으로 렌더링되는 경우에는 Suspense가 필요하지 않습니다.')}

${h2('use-router', 'useRouter - 코드로 페이지 이동하기')}

<p>일반적인 페이지 이동에는 <code>&lt;Link&gt;</code>를 사용합니다. 폼 제출 후 이동하거나 조건에 따라 페이지를 이동해야 할 때처럼 코드 로직으로 이동이 필요할 경우 <code>useRouter()</code>를 사용합니다.</p>

<pre><code class="language-tsx">'use client';

import { useRouter } from 'next/navigation';

export default function Example() {
  const router = useRouter();

  const handleSubmit = () => {
    // 폼 제출 후 목록으로 이동
    router.push('/blog');
  };

  const handleFilter = (category: string) => {
    // URL 쿼리 변경 (히스토리에 추가하지 않음)
    router.replace(\`/blog?category=\${category}\`);
  }

  return (
    &lt;div&gt;
      &lt;button onClick={handleSubmit}&gt;제출 후 이동&lt;/button&gt;
      &lt;button onClick={() =&gt; router.back()}&gt;뒤로 가기&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>push vs replace</h3>

<table>
<thead>
<tr><th>메서드</th><th>동작</th><th>뒤로 가기</th><th>사용 예시</th></tr>
</thead>
<tbody>
<tr><td><code>router.push(url)</code></td><td>새 항목을 히스토리에 추가</td><td>이전 페이지로 돌아감</td><td>페이지 이동</td></tr>
<tr><td><code>router.replace(url)</code></td><td>현재 항목을 교체</td><td>이전 페이지를 건너뜀</td><td>필터/정렬 변경</td></tr>
<tr><td><code>router.back()</code></td><td>히스토리에서 뒤로</td><td>-</td><td>뒤로 가기 버튼</td></tr>
</tbody>
</table>

${titleBox('info', 'push vs replace 언제 무엇을?', '사용자가 "뒤로 가기"를 눌렀을 때 돌아가야 할 의미 있는 페이지가 있다면 <code>push</code>, 필터를 바꿀 때처럼 매번 히스토리에 쌓이면 오히려 불편한 경우 <code>replace</code>를 사용합니다.')}

${h2('searchable-refactor', '실전 패턴: useState에서 URL 상태로')}

<p>Ch.2에서 만든 <code>SearchablePostList</code>의 검색 상태를 URL로 옮기면 어떻게 될까요?</p>

<h3>Before (useState)</h3>
<pre><code class="language-tsx">// 검색어가 컴포넌트 내부 상태에만 존재
const [query, setQuery] = useState('');

// 문제: 새로고침하면 검색어가 사라짐</code></pre>

<h3>After (useSearchParams + useRouter)</h3>
<pre><code class="language-tsx">'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Post = {
  id: number;
  slug: string;
  title: string;
};

export function SearchablePostList({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') ?? '';

  const filtered = posts.filter((post) =&gt;
    post.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.replace(\`/blog?\${params.toString()}\`);
  };

  return (
    &lt;&gt;
      &lt;input
        type='text'
        defaultValue={query}
        onChange={(e) =&gt; handleSearch(e.target.value)}
        placeholder='글 검색...'
      /&gt;
      &lt;ul&gt;
        {filtered.map((post) =&gt; (
          &lt;li key={post.id}&gt;
            &lt;Link href={\`/blog/\${post.slug}\`}&gt;{post.title}&lt;/Link&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/&gt;
  );
}</code></pre>

<p>이제 <code>/blog?q=서버</code>로 접속하면 "서버"가 검색된 상태가 바로 표시됩니다. URL을 공유하면 상대방도 같은 검색 결과를 볼 수 있습니다.</p>

${h2('not-found', 'notFound() - 404 페이지 처리')}

<p>존재하지 않는 글에 접속하면 어떻게 될까요? 현재는 에러가 발생합니다. <code>notFound()</code> 함수로 이를 우아하게 처리할 수 있습니다:</p>

<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

export default async function Post({
  params,
}: {
  params: Promise&lt;{ slug: string }&gt;;
}) {
  const { slug } = await params;
  const res = await fetch(\`http://localhost:4000/posts?slug=\${slug}\`);
  const posts = await res.json();

  if (posts.length === 0) {
    notFound(); // 글이 없으면 404 페이지 표시
  }

  const post = posts[0];

  return (
    &lt;div&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;이 글의 내용이 여기에 표시됩니다.&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p><code>notFound()</code>를 호출하면 가장 가까운 <code>not-found.tsx</code> 파일이 렌더링됩니다:</p>

<pre><code class="language-tsx">// app/blog/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    &lt;div&gt;
      &lt;h2&gt;글을 찾을 수 없습니다&lt;/h2&gt;
      &lt;p&gt;요청한 글이 존재하지 않습니다.&lt;/p&gt;
      &lt;Link href='/blog'&gt;글 목록으로 돌아가기&lt;/Link&gt;
    &lt;/div&gt;
  );
}</code></pre>

${h2('server-search-params', '서버 컴포넌트의 searchParams prop')}

<p><code>useSearchParams</code>는 클라이언트 컴포넌트 전용입니다. 서버 컴포넌트에서 URL 쿼리 스트링을 읽으려면 <code>searchParams</code> prop을 사용합니다:</p>

<pre><code class="language-tsx">// app/blog/page.tsx (서버 컴포넌트)
export default async function Blog({
  searchParams,
}: {
  searchParams: Promise&lt;{ category?: string }&gt;;
}) {
  const { category } = await searchParams;

  // category 값으로 서버에서 바로 필터링된 데이터 조회
  const url = category
    ? \`http://localhost:4000/posts?category=\${category}\`
    : 'http://localhost:4000/posts';

  const res = await fetch(url);
  const posts = await res.json();

  return &lt;div&gt;{/* ... */}&lt;/div&gt;;
}</code></pre>

${titleBox('info', '클라이언트 vs 서버에서 쿼리 읽기', '같은 URL 쿼리를 읽는 두 가지 방법이 있습니다. <strong>페이지 컴포넌트</strong>에서는 <code>searchParams</code> prop으로 읽어 서버에서 바로 데이터를 필터링할 수 있고, <strong>클라이언트 컴포넌트</strong>에서는 <code>useSearchParams()</code> Hook으로 읽어 UI 상태에 반영합니다. 실습에서 이 두 가지를 함께 사용합니다.')}

${h2('navigation-tools', '내비게이션 도구 정리')}

<table>
<thead>
<tr><th>도구</th><th>용도</th><th>환경</th></tr>
</thead>
<tbody>
<tr><td><code>Link</code></td><td>클릭으로 페이지 이동</td><td>서버 / 클라이언트</td></tr>
<tr><td><code>usePathname()</code></td><td>현재 URL 경로 읽기</td><td>클라이언트</td></tr>
<tr><td><code>useSearchParams()</code></td><td>URL 쿼리 스트링 읽기</td><td>클라이언트</td></tr>
<tr><td><code>useRouter()</code></td><td>코드로 페이지 이동 (push, replace, back)</td><td>클라이언트</td></tr>
<tr><td><code>searchParams</code> prop</td><td>페이지에서 URL 쿼리 읽기</td><td>페이지</td></tr>
<tr><td><code>notFound()</code></td><td>404 페이지 표시</td><td>서버 / 클라이언트</td></tr>
<tr><td><code>redirect()</code></td><td>렌더링 중 리다이렉트</td><td>서버 / 클라이언트(렌더링 중)</td></tr>
</tbody>
</table>

${titleBox('neutral', 'Link vs useRouter 언제 무엇을?', '일반적인 페이지 이동에는 항상 <code>&lt;Link&gt;</code>를 사용합니다. Prefetching, 접근성, SEO 등의 이점이 있기 때문입니다. <code>useRouter</code>는 폼 제출 후 리다이렉트, 조건부 이동처럼 <strong>사용자 클릭이 아닌 코드 로직에 의한 이동</strong>이 필요할 때만 사용합니다.')}

${titleBox('neutral', 'redirect vs router.push', "<code>redirect()</code>는 서버 컴포넌트, Server Action, 그리고 클라이언트 컴포넌트의 렌더링 중에 사용할 수 있습니다. 반면 클릭 핸들러처럼 <strong>이벤트에서 이동</strong>해야 할 때는 <code>router.push()</code>나 <code>router.replace()</code>를 사용합니다. Ch.3 실습의 <code>createPost</code> 액션에서 <code>redirect('/blog')</code>를 사용한 것이 서버 리다이렉트의 예시입니다.")}
          `,
        },
        {
          title: '전체 학습 정리',
          content: `
${h2('blog-growth', '블로그 프로젝트 구현 과정')}

<p>4개의 챕터를 거치며 빈 프로젝트에 블로그 기능을 단계적으로 추가했습니다.</p>

<table>
<thead>
<tr><th>챕터</th><th>주제</th><th>블로그에 추가된 것</th></tr>
</thead>
<tbody>
<tr><td>Ch.1</td><td>App Router 기초</td><td>페이지 구조(홈, 블로그, 소개), 레이아웃, 동적 라우트</td></tr>
<tr><td>Ch.2</td><td>서버/클라이언트 컴포넌트</td><td>CategorySidebar, LikeButton, SearchablePostList</td></tr>
<tr><td>Ch.3</td><td>Data Fetching</td><td>json-server 연동, 서버 fetching, loading.tsx, 글 작성 폼</td></tr>
<tr><td>Ch.4</td><td>Navigation</td><td>NavLink, URL 상태 관리, 404 처리</td></tr>
</tbody>
</table>

${h2('chapter-summary', '챕터별 핵심 개념 요약')}

<h3>Ch.1 - 왜 Next.js일까? + App Router 기초</h3>
<table>
<thead>
<tr><th>개념</th><th>한 줄 요약</th></tr>
</thead>
<tbody>
<tr><td>파일 기반 라우팅</td><td><code>app/blog/page.tsx</code> = <code>/blog</code> 경로</td></tr>
<tr><td>layout.tsx</td><td>공통 UI를 감싸는 래퍼, 페이지 이동 시에도 상태 유지</td></tr>
<tr><td>동적 라우트</td><td><code>[slug]</code> 폴더로 가변 URL 처리</td></tr>
<tr><td>Link 컴포넌트</td><td>클라이언트 사이드 내비게이션으로 빠른 페이지 이동</td></tr>
</tbody>
</table>

<h3>Ch.2 - Server / Client Component</h3>
<table>
<thead>
<tr><th>개념</th><th>한 줄 요약</th></tr>
</thead>
<tbody>
<tr><td>서버 컴포넌트</td><td>기본값, 서버에서 실행, 번들에 포함 안 됨</td></tr>
<tr><td>클라이언트 컴포넌트</td><td><code>'use client'</code> 선언, 인터랙션이 필요할 때만 사용</td></tr>
<tr><td>컴포넌트 합성</td><td>서버 컴포넌트를 children으로 넘겨 클라이언트 경계 최소화</td></tr>
<tr><td>직렬화 경계</td><td>서버 → 클라이언트로 넘기는 props는 React가 직렬화할 수 있어야 함</td></tr>
</tbody>
</table>

<h3>Ch.3 - Data Fetching & 렌더링</h3>
<table>
<thead>
<tr><th>개념</th><th>한 줄 요약</th></tr>
</thead>
<tbody>
<tr><td>서버 fetching</td><td>서버 컴포넌트에서 <code>async/await</code>으로 직접 데이터 접근</td></tr>
<tr><td>정적/동적 렌더링</td><td>기본은 정적으로 최적화되며, Dynamic API 사용 시 요청별 렌더링이 필요해질 수 있음</td></tr>
<tr><td>Streaming</td><td><code>loading.tsx</code>와 <code>Suspense</code>로 점진적 UI 표시</td></tr>
<tr><td>캐싱</td><td>fetch 옵션으로 캐시 동작 제어, <code>revalidatePath</code>로 갱신</td></tr>
<tr><td>Server Actions</td><td><code>'use server'</code> 함수로 서버에서 데이터 변경, 폼과 직접 연결</td></tr>
</tbody>
</table>

<h3>Ch.4 - Navigation</h3>
<table>
<thead>
<tr><th>개념</th><th>한 줄 요약</th></tr>
</thead>
<tbody>
<tr><td>Link 심화</td><td>클라이언트 사이드 내비게이션, Prefetching</td></tr>
<tr><td>usePathname</td><td>현재 경로를 읽어 활성 링크 스타일링</td></tr>
<tr><td>useSearchParams</td><td>URL 쿼리 스트링으로 상태 관리 (클라이언트)</td></tr>
<tr><td>searchParams prop</td><td>페이지 컴포넌트에서 URL 쿼리 읽기</td></tr>
<tr><td>useRouter</td><td>코드에서 프로그래밍적 페이지 이동</td></tr>
<tr><td>notFound</td><td>404 페이지 표시, <code>not-found.tsx</code>로 커스터마이징</td></tr>
</tbody>
</table>

${h2('decision-guide', '"무엇을 써야 하지?" 의사결정 가이드')}

<p>Next.js에는 비슷해 보이는 도구가 많습니다. 상황별로 어떤 것을 선택해야 하는지 정리합니다:</p>

<table>
<thead>
<tr><th>하고 싶은 일</th><th>사용할 도구</th><th>비고</th></tr>
</thead>
<tbody>
<tr><td>링크를 렌더링하고 싶다</td><td><code>&lt;Link&gt;</code></td><td>Prefetching + 클라이언트 사이드 내비게이션</td></tr>
<tr><td>현재 경로를 알고 싶다</td><td><code>usePathname()</code></td><td>클라이언트 컴포넌트 전용</td></tr>
<tr><td>URL 쿼리를 읽고 싶다 (클라이언트)</td><td><code>useSearchParams()</code></td><td>클라이언트 컴포넌트 전용</td></tr>
<tr><td>URL 쿼리를 읽고 싶다 (서버)</td><td><code>searchParams</code> prop</td><td>페이지 컴포넌트에서 사용</td></tr>
<tr><td>코드로 페이지를 이동하고 싶다 (클라이언트)</td><td><code>useRouter()</code></td><td>push, replace, back</td></tr>
<tr><td>렌더링 중 리다이렉트하고 싶다</td><td><code>redirect()</code></td><td>Server Action, 서버 컴포넌트, 클라이언트 렌더링 중 사용</td></tr>
<tr><td>404 페이지를 표시하고 싶다</td><td><code>notFound()</code></td><td>가장 가까운 not-found.tsx 렌더링</td></tr>
<tr><td>서버에서 데이터를 가져오고 싶다</td><td>서버 컴포넌트 <code>async/await</code></td><td>fetch, DB 조회 등</td></tr>
<tr><td>사용자 인터랙션이 필요하다</td><td><code>'use client'</code></td><td>최소한의 컴포넌트만 클라이언트로</td></tr>
<tr><td>서버에서 데이터를 변경하고 싶다</td><td>Server Action (<code>'use server'</code>)</td><td>form action 또는 직접 호출</td></tr>
</tbody>
</table>

${h2('practice-preview', '다음 세션: 블로그 고도화 실습')}

<p>마지막 세션에서는 Ch.1~4의 개념을 총동원하여 블로그를 고도화합니다. 구체적으로:</p>

<ol>
<li><strong>db.json 확장</strong> - 카테고리 필드 추가, 글 4개로 확장</li>
<li><strong>NavLink 적용</strong> - 현재 페이지 하이라이트 내비게이션</li>
<li><strong>카테고리 필터링</strong> - URL 기반 필터 (<code>?category=react</code>)</li>
<li><strong>notFound 적용</strong> - 없는 글 접속 시 커스텀 404</li>
<li><strong>최종 정리</strong> - 완성된 구조와 적용 개념 매핑</li>
</ol>

<p>건드릴 파일들:</p>
<pre><code class="language-text">db.json                          카테고리 필드 추가
app/layout.tsx                   NavLink 적용
app/components/NavLink.tsx       새 파일
app/components/CategorySidebar.tsx  Link + useSearchParams로 리팩터링
app/blog/page.tsx                searchParams로 필터링
app/blog/[slug]/page.tsx         notFound() 추가
app/blog/[slug]/not-found.tsx    새 파일</code></pre>
          `,
        },
        {
          title: '블로그 고도화 실습',
          content: `
${h2('what-we-will-build', '이번 세션에서 할 일')}
<p>Ch.1~4에서 배운 개념을 총동원하여 블로그를 고도화합니다. 구체적으로:</p>
<ol>
<li><strong>db.json 확장</strong> - 카테고리 필드 추가, 글 4개로 확장</li>
<li><strong>NavLink 적용</strong> - 세션 1에서 만든 NavLink을 루트 레이아웃에 적용</li>
<li><strong>카테고리 필터링</strong> - Link + useSearchParams + searchParams prop으로 URL 기반 필터</li>
<li><strong>notFound 적용</strong> - 없는 글 접속 시 커스텀 404 페이지</li>
<li><strong>최종 구조 점검</strong> - 적용 개념 매핑과 마무리</li>
</ol>

${h2('step1-expand-db', 'Step 1: db.json 카테고리 추가')}

<p>기존 db.json에 <code>category</code> 필드를 추가하고, 글을 4개로 확장합니다:</p>

<pre><code class="language-json">{
  "posts": [
    {
      "id": 1,
      "slug": "nextjs-routing",
      "title": "Next.js 라우팅 이해하기",
      "category": "nextjs"
    },
    {
      "id": 2,
      "slug": "react-server-components",
      "title": "React 서버 컴포넌트란?",
      "category": "react"
    },
    {
      "id": 3,
      "slug": "react-hooks-guide",
      "title": "React Hooks 완벽 가이드",
      "category": "react"
    },
    {
      "id": 4,
      "slug": "nextjs-data-fetching",
      "title": "Next.js 데이터 가져오기",
      "category": "nextjs"
    }
  ]
}</code></pre>

<p>json-server를 재시작하면 <code>http://localhost:4000/posts?category=react</code>처럼 카테고리별 필터링이 자동으로 지원됩니다.</p>

${titleBox('neutral', '테스트', 'json-server를 재시작한 뒤 <code>http://localhost:4000/posts</code>에 접속하여 4개의 글이 표시되는지 확인합니다. <code>?category=react</code>를 붙이면 React 카테고리 글만 나옵니다.')}

${h2('step2-navlink', 'Step 2: NavLink 적용')}

<p>세션 1에서 배운 <code>NavLink</code> 컴포넌트를 적용해보겠습니다.</p>

<pre><code class="language-tsx">// app/components/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    &lt;Link
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-inherit'}
    &gt;
      {children}
    &lt;/Link&gt;
  );
}</code></pre>

<h3>루트 레이아웃에 적용</h3>

<pre><code class="language-tsx" data-line="16-18">// app/layout.tsx
...

export default function RootLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  return (
    &lt;html lang='ko'&gt;
      &lt;body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      &gt;
        &lt;header&gt;
          &lt;nav&gt;
            &lt;NavLink href='/'&gt;홈&lt;/NavLink&gt;
            &lt;NavLink href='/blog'&gt;글 목록&lt;/NavLink&gt;
            &lt;NavLink href='/about'&gt;소개&lt;/NavLink&gt;
          &lt;/nav&gt;
        &lt;/header&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;footer&gt;Copyright 2026 My Blog&lt;/footer&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

${titleBox('neutral', '테스트', '각 페이지를 이동하며 현재 페이지의 링크가 파란색 볼드체로 표시되는지 확인합니다. <code>/blog/nextjs-routing</code> 같은 하위 경로에서도 "블로그" 링크가 활성 상태여야 합니다.')}

${h2('step3-category-filter', 'Step 3: 카테고리 필터링')}

<p>이 Step이 이번 실습의 핵심입니다. Ch.1~4의 개념이 모두 적용됩니다:</p>
<ul>
<li><strong>Ch.1</strong> - 파일 기반 라우팅 (<code>app/blog/page.tsx</code>)</li>
<li><strong>Ch.2</strong> - 서버/클라이언트 경계 (CategorySidebar는 클라이언트, 페이지는 서버)</li>
<li><strong>Ch.3</strong> - 서버 fetching (<code>fetch</code>로 필터링된 데이터 조회)</li>
<li><strong>Ch.4</strong> - Link + useSearchParams (URL 기반 필터 상태 관리)</li>
</ul>

<h3>CategorySidebar 리팩터링</h3>

<p>Ch.2에서는 <code>useState</code>로 카테고리 열기/닫기를 관리했습니다. 이제 <code>Link</code>와 <code>useSearchParams</code>로 URL 기반 필터링으로 전환합니다:</p>

<pre><code class="language-tsx">// app/components/CategorySidebar.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const categories = [
  { key: 'react', label: 'React' },
  { key: 'nextjs', label: 'Next.js' },
];

export function CategorySidebar() {
  const searchParams = useSearchParams();
  const current = searchParams.get('category');

  return (
    &lt;ul&gt;
      &lt;li&gt;
        &lt;Link
          href='/blog'
          className={!current ? 'font-bold' : undefined}
        &gt;
          전체
        &lt;/Link&gt;
      &lt;/li&gt;
      {categories.map((category) =&gt; (
        &lt;li key={category.key}&gt;
          &lt;Link
            href={\`/blog?category=\${category.key}\`}
            className={current === category.key ? 'font-bold' : undefined}
          &gt;
            {category.label}
          &lt;/Link&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>

<p>변경 전후를 비교하면:</p>
<table>
<thead><tr><th></th><th>Before (Ch.2)</th><th>After (Ch.4)</th></tr></thead>
<tbody>
<tr><td>상태 관리</td><td><code>useState</code> (컴포넌트 내부)</td><td>URL 쿼리 스트링</td></tr>
<tr><td>카테고리 선택</td><td><code>onClick</code> → <code>setState</code></td><td><code>&lt;Link href="?category=..."&gt;</code></td></tr>
<tr><td>새로고침 시</td><td>선택 초기화</td><td>유지됨</td></tr>
<tr><td>URL 공유</td><td>불가</td><td>가능 (<code>/blog?category=react</code>)</td></tr>
</tbody>
</table>

<h3>블로그 페이지에서 searchParams로 필터링</h3>

<p>서버 컴포넌트인 블로그 페이지에서 <code>searchParams</code> prop으로 카테고리를 읽고, 필터링된 데이터를 가져옵니다:</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import Link from 'next/link';
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise&lt;{ category?: string }&gt;;
}) {
  const { category } = await searchParams;

  const url = category
    ? \`http://localhost:4000/posts?category=\${category}\`
    : 'http://localhost:4000/posts';

  const res = await fetch(url);
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
      &lt;Link href='/blog/new'&gt;새 글 작성&lt;/Link&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>흐름을 정리하면:</p>
<ol>
<li>사용자가 사이드바에서 "React" 클릭 → URL이 <code>/blog?category=react</code>로 변경</li>
<li>서버 컴포넌트의 <code>searchParams</code>에서 <code>category</code> 값을 읽음</li>
<li><code>fetch</code> URL에 카테고리 쿼리를 추가하여 필터링된 데이터만 조회</li>
<li>사이드바는 <code>useSearchParams</code>로 현재 카테고리를 읽어 활성 상태 표시</li>
</ol>

${titleBox('info', '서버와 클라이언트의 역할 분담', '데이터 필터링은 <strong>서버</strong>에서 처리합니다 (페이지 컴포넌트의 <code>searchParams</code> → fetch URL). 현재 선택된 카테고리의 <strong>UI 표시</strong>는 <strong>클라이언트</strong>에서 처리합니다 (CategorySidebar의 <code>useSearchParams</code>). 같은 URL 쿼리를 서버와 클라이언트가 각자의 역할에 맞게 사용하는 패턴입니다.')}

${titleBox('neutral', '테스트', '사이드바에서 카테고리를 클릭하며 글 목록이 필터링되는지 확인합니다. URL이 <code>/blog?category=react</code>처럼 변경되고, 새로고침해도 필터 상태가 유지되어야 합니다.')}

${h2('step4-not-found', 'Step 4: notFound 적용')}

<p>존재하지 않는 slug로 접속하면 에러 대신 친절한 404 페이지를 보여줍니다.</p>

<h3>글 상세 페이지에 notFound() 추가</h3>

<pre><code class="language-tsx" data-line="12-14">// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { LikeButton } from '@/app/components/LikeButton';

export default async function Post({
  params,
}: {
  params: Promise&lt;{ slug: string }&gt;;
}) {
  const { slug } = await params;
  const res = await fetch(\`http://localhost:4000/posts?slug=\${slug}\`);
  const posts = await res.json();

  if (posts.length === 0) {
    notFound();
  }

  const post = posts[0];

  return (
    &lt;div&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;이 글의 내용이 여기에 표시됩니다.&lt;/p&gt;
      &lt;LikeButton /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>커스텀 404 페이지</h3>

<pre><code class="language-tsx">// app/blog/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    &lt;div&gt;
      &lt;h2&gt;글을 찾을 수 없습니다&lt;/h2&gt;
      &lt;p&gt;요청한 글이 존재하지 않습니다.&lt;/p&gt;
      &lt;Link href='/blog'&gt;글 목록으로 돌아가기&lt;/Link&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p><code>not-found.tsx</code>는 <code>loading.tsx</code>처럼 Next.js의 <strong>특수 파일</strong>입니다. <code>notFound()</code>가 호출되면 가장 가까운 <code>not-found.tsx</code>를 찾아 렌더링합니다. 블로그 레이아웃 안에서 표시되므로 사이드바도 함께 보입니다.</p>

${titleBox('neutral', '테스트', '브라우저에서 <code>/blog/없는-slug-123</code> 같은 존재하지 않는 경로에 접속합니다. "글을 찾을 수 없습니다" 메시지와 목록으로 돌아가는 링크가 표시되면 성공입니다.')}

${h2('step5-final-review', 'Step 5: 최종 구조 점검')}

<p>4개의 챕터를 거쳐 완성된 프로젝트 구조입니다:</p>

<pre><code class="language-text">app/
├── about/
│   └── page.tsx                  [서버] 소개 페이지
├── blog/
│   ├── [slug]/
│   │   ├── not-found.tsx         커스텀 404
│   │   └── page.tsx              [서버] fetch + notFound()
│   ├── new/
│   │   └── page.tsx              [서버] PostForm import
│   ├── layout.tsx                [서버] 블로그 레이아웃
│   ├── loading.tsx               자동 로딩 UI
│   └── page.tsx                  [서버] searchParams + fetch
├── components/
│   ├── CategorySidebar.tsx       [클라이언트] Link + useSearchParams
│   ├── LikeButton.tsx            [클라이언트] 좋아요 버튼
│   ├── NavLink.tsx               [클라이언트] usePathname + Link
│   ├── PostForm.tsx              [클라이언트] useActionState + 폼
│   └── SearchablePostList.tsx    [클라이언트] 검색 + 목록 표시
├── actions.ts                    [서버] 'use server' - createPost
├── layout.tsx                    [서버] NavLink 내비게이션 + 루트 레이아웃
└── page.tsx                      [서버] 홈 페이지
db.json                           json-server 데이터 (카테고리 포함)</code></pre>

<h3>실습에서 적용한 챕터별 개념</h3>

<table>
<thead>
<tr><th>챕터</th><th>적용한 개념</th><th>적용 위치</th></tr>
</thead>
<tbody>
<tr><td>Ch.1</td><td>파일 기반 라우팅, 레이아웃 시스템</td><td>전체 폴더 구조, layout.tsx</td></tr>
<tr><td>Ch.2</td><td>서버/클라이언트 경계, 컴포넌트 합성</td><td>CategorySidebar, NavLink (클라이언트) + 페이지 (서버)</td></tr>
<tr><td>Ch.3</td><td>서버 fetching, Server Actions</td><td>blog/page.tsx의 fetch, actions.ts</td></tr>
<tr><td>Ch.4</td><td>Link, usePathname, useSearchParams, notFound</td><td>NavLink, CategorySidebar, not-found.tsx</td></tr>
</tbody>
</table>

${h2('wrap-up', '학습을 마무리하며')}

<p>Next.js의 핵심 개념들을 체계적으로 학습하고, 실제 동작하는 블로그 프로젝트를 완성했습니다.</p>

<h3>추천 학습 자료</h3>
<ul>
<li><a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js 공식 문서</a> - 더 깊은 내용 탐색</li>
<li><a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer">Next.js Learn 코스</a> - 공식 대화형 튜토리얼</li>
<li><a href="https://ko.react.dev" target="_blank" rel="noopener noreferrer">React 공식 문서</a> - React 기초 복습</li>
</ul>

<h3>확장 아이디어</h3>
<p>블로그를 더 발전시키고 싶다면:</p>
<ul>
<li><strong>Markdown 지원</strong> - 글 내용을 Markdown으로 작성하고 렌더링</li>
<li><strong>페이지네이션</strong> - 글이 많아졌을 때 페이지 나누기</li>
<li><strong>다크 모드</strong> - CSS 변수와 클라이언트 상태로 테마 전환</li>
<li><strong>댓글 기능</strong> - Server Action으로 댓글 CRUD</li>
<li><strong>메타데이터</strong> - <code>generateMetadata</code>로 SEO 최적화</li>
</ul>
          `,
        },
      ],
};
