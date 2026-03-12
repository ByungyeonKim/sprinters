import ch3NetworkImg from '../../../../assets/ch3-network.png';
import { box, h2, titleBox } from '../shared/content-helpers';

export default {
      title: 'Data Fetching & 렌더링',
      locked: false,
      sessions: [
        {
          title: '데이터 소스와 서버 fetching',
          content: `
${h2('hardcoded-data-limit', '지금까지의 블로그: 하드코딩의 한계')}

<p>지난 챕터에서는 블로그 프로젝트를 서버/클라이언트 컴포넌트 관점에서 정리했습니다. 레이아웃은 서버 컴포넌트로 유지하고, 좋아요 버튼과 검색처럼 인터랙션이 필요한 부분만 클라이언트 컴포넌트로 분리했죠. 또 서버 페이지가 <code>posts</code> 배열을 준비해서 <code>SearchablePostList</code>에 넘기는 흐름도 만들었습니다.</p>

<p>문제는 그 구조 안의 데이터가 현재 <strong>하드코딩 배열</strong>이라는 점입니다. 화면 구조는 좋아졌지만, 실제 서비스처럼 데이터를 추가하거나 수정하고 재사용하기에는 한계가 있죠. 이번 세션에서는 바로 이 문제를 해결합니다. 먼저 지금 코드가 어떤 상태였는지 다시 보겠습니다:</p>

<pre><code class="language-tsx">// app/blog/page.tsx - Ch.2에서 만든 블로그
import { SearchablePostList } from '../components/SearchablePostList';

const posts = [
  { id: 1, slug: 'nextjs-routing', title: 'Next.js 라우팅 이해하기' },
  { id: 2, slug: 'react-server-components', title: 'React 서버 컴포넌트란?' },
];

export default function Blog() {
  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>코드를 보면 <code>posts</code> 배열이 컴포넌트 파일 안에 직접 선언되어 있습니다. 블로그 글은 버튼의 열림 상태처럼 한 사람의 브라우저 안에서만 쓰이는 값이 아닙니다. 여러 사용자가 함께 보는 <strong>공유 데이터</strong>입니다. 이런 데이터는 코드 안에 두는 것이 아니라, <strong>서버가 하나의 원본(source of truth)으로 관리하고 필요할 때 읽어 와야</strong> 합니다. 그래야 누가 접속하든 같은 글을 볼 수 있습니다. 지금 구조에서는 그 원본이 코드 안에 섞여 있어서 한계가 분명합니다:</p>

<ul>
<li><strong>콘텐츠 변경과 코드 배포가 묶입니다.</strong> 글 하나를 추가하려면 코드를 수정하고 다시 배포해야 합니다. 데이터가 바뀔 때마다 배포가 필요한 구조는 실제 서비스에서 쓰기 어렵습니다.</li>
<li><strong>데이터의 기준점이 서버가 아니라 컴포넌트가 됩니다.</strong> 서비스가 커질수록 "이 글의 최신 제목이 무엇인가?"를 판정해야 하는 곳은 화면 코드가 아니라 서버가 읽는 데이터 저장소여야 합니다.</li>
</ul>

${box('info', '공유되는 서비스 데이터의 원본은 <strong>컴포넌트 코드가 아니라 서버가 읽고 관리할 수 있는 곳</strong>에 있어야 합니다 - 파일, 데이터베이스, 또는 API 서버에.')}

<p>즉, 이번 세션의 질문은 이것입니다. <strong>"여러 사용자가 함께 볼 <code>posts</code>의 원본을, 서버는 어디에서 읽어 와야 할까?"</strong></p>

${h2('useeffect-fetch', 'React에서 익숙한 방법: useEffect + fetch')}

<p>React에서는 보통 다음과 같은 방식으로 데이터를 가져옵니다:</p>

<pre><code class="language-tsx">'use client';

import { useState, useEffect } from 'react';
import { SearchablePostList } from '../components/SearchablePostList';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =&gt; {
    async function getPosts() {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }

    getPosts();
  }, []);

  if (loading) return &lt;p&gt;로딩 중...&lt;/p&gt;;

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>익숙한 방식입니다. 하지만 <code>useState</code>, <code>useEffect</code>를 사용하려면 페이지를 클라이언트 컴포넌트로 바꿔야 하고, 그 순간 데이터 fetching 로직과 상태 관리 로직이 모두 클라이언트 코드로 이동합니다. 즉 서버에서 바로 가져와도 될 첫 화면 데이터를 위해 브라우저 쪽 코드가 늘어나고, <code>loading</code> 상태와 effect를 직접 관리해야 하기 때문에 코드도 더 장황해집니다.</p>

${titleBox('neutral', '<code>useEffect + fetch</code>가 항상 나쁜 것은 아닙니다', '사용자 클릭 이후 요청, 실시간 검색, 무한 스크롤, 폴링처럼 <strong>초기 화면 이후</strong>에 발생하는 데이터 요청은 여전히 클라이언트 fetching이 적절할 수 있습니다. 다만 <strong>첫 화면에 꼭 필요한 데이터</strong>라면 서버에서 먼저 가져오는 쪽이 보통 더 유리합니다.')}

${h2('why-server-is-default', '왜 서버가 기본값인가')}

<p><code>useEffect + fetch</code> 방식에는 세 가지 구조적 문제가 있습니다:</p>

<h3>1. 요청 워터폴</h3>
<p>HTML 다운로드 → JS 다운로드 및 실행 → 렌더링 후 <code>fetch</code> 요청 → 응답 → 렌더링. 모든 단계가 <strong>직렬</strong>로 이어집니다. 앞 단계가 끝나야 다음 단계가 시작되므로, 각 단계의 지연이 그대로 누적됩니다. 이런 구조에서는 요청이 순차적으로 이어지면서 <strong>요청 워터폴(Request Waterfall)</strong>이 발생하기 쉽습니다.</p>

<h3>2. 빠른 데이터에도 로딩 UI가 필요</h3>
<p><code>useEffect</code>는 브라우저에서만 실행되므로, 서버에서 바로 가져올 수 있는 데이터라도 반드시 로딩 UI를 거쳐야 합니다. 서버 컴포넌트라면 데이터를 가져와 완성된 HTML을 보낼 수 있는데, <code>useEffect</code> 방식에서는 항상 빈 상태로 시작해 브라우저에서 다시 요청합니다. 검색 엔진 크롤러 역시 이 초기 HTML을 기준으로 페이지를 분석하기 때문에 <strong>실제 콘텐츠를 인식하지 못할 수 있습니다</strong>.</p>

<h3>3. 보안 위험</h3>
<p>모든 클라이언트 <code>fetch</code>가 위험한 것은 아닙니다. 공개되어도 괜찮은 API를 브라우저에서 호출하는 것은 흔한 패턴입니다. 문제는 <strong>비밀 키, DB 접속 정보, 관리자 권한 토큰</strong>처럼 숨겨야 하는 정보를 클라이언트 코드에 넣는 경우입니다. 이런 값은 브라우저 개발자 도구에서 노출될 수 있으므로, 서버에서만 다뤄야 합니다.</p>

<p>서버 컴포넌트는 이 문제들을 <strong>크게 줄여 줍니다</strong>:</p>

<pre><code class="language-text">[useEffect + fetch 방식]
서버 ─── 빈 HTML ──────────────────────────────▶
브라우저      ─── JS 다운로드 ─── 마운트 ────────▶
                                    ─── fetch ────▶
                                             응답 ─── 렌더링 ▶

[서버 컴포넌트 방식]
서버 ─── fetch ─── 완성된 HTML ────────────▶
브라우저                  ─── 콘텐츠 표시 ▶
                              ↑ 훨씬 빠름!</code></pre>

<ul>
<li><strong>클라이언트-서버 워터폴 감소</strong>: 서버에서 데이터를 가져오고 HTML을 완성한 뒤 전송하므로, 브라우저가 마운트된 뒤 다시 첫 요청을 시작하는 구조를 줄일 수 있습니다.</li>
<li><strong>SEO 해결</strong>: 완성된 HTML이 전송되므로, 검색 엔진이 콘텐츠를 바로 인식합니다.</li>
<li><strong>서버 자원 보호</strong>: API 키, DB 접속 정보 등이 서버에만 존재하고 클라이언트에 노출되지 않습니다.</li>
</ul>

${titleBox('neutral', '주의: 서버라고 해서 워터폴이 완전히 사라지지는 않습니다', '서버 컴포넌트 안에서도 여러 <code>await</code>를 순차로 실행하면 서버 쪽 워터폴이 생길 수 있고, 느린 요청이 있으면 해당 경로 렌더링이 잠시 막힐 수 있습니다. Next.js는 서버 요청을 병렬로 처리할 수 있도록 하고, <code>loading.tsx</code>, <code>Suspense</code>, 스트리밍을 통해 느린 요청이 있어도 UI를 점진적으로 보여줄 수 있게 합니다. 이 부분은 다음 세션들에서 이어서 다룹니다.')}

${titleBox('warn', '데이터 fetching은 렌더링의 일부', '서버 컴포넌트에서는 데이터 fetching이 렌더링 이후의 부가 작업이 아니라, <strong>렌더링 과정의 일부</strong>입니다. 데이터를 가져오는 것과 UI를 그리는 것이 하나의 흐름 안에서 함께 일어납니다.')}

${h2('server-component-data-fetching', '서버 컴포넌트에서 데이터 가져오기')}

<p>Ch.2에서 만든 <code>Blog</code> 컴포넌트는 데이터가 코드 안에 있었기 때문에 일반 함수로 충분했습니다. 하지만 외부에서 데이터를 가져오려면 응답을 <strong>기다려야</strong> 합니다. 서버 컴포넌트는 <code>async</code> 함수로 만들 수 있어서, <code>await</code>로 데이터를 기다린 뒤 바로 렌더링할 수 있습니다.</p>

<p>데이터 소스에 따라 세 가지 방식을 살펴보겠습니다:</p>

${titleBox('info', '무엇을 선택하면 될까요?', '<strong>외부 서비스나 별도 백엔드</strong>에서 읽어 오면 <code>fetch</code>, <strong>우리 앱의 핵심 데이터</strong>가 데이터베이스에 있으면 ORM/쿼리로 직접 접근, <strong>정적 문서나 샘플 콘텐츠</strong>를 읽으면 파일 시스템이 보통 가장 단순합니다.')}

<h3>fetch API - 외부/내부 REST API 호출</h3>
<p>가장 보편적인 방식입니다. 외부 API나 별도의 백엔드 서비스에서 데이터를 가져올 때 사용합니다. 다만 우리 서버가 직접 접근할 수 있는 데이터라면 API 라우트를 거치지 않고 바로 DB에 접근하는 것이 더 단순할 수 있습니다.</p>

<pre><code class="language-tsx">// app/blog/page.tsx - 서버 컴포넌트 (async 함수)
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const res = await fetch('http://localhost:4000/posts');
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p><code>useState</code>도, <code>useEffect</code>도 필요 없습니다. 서버에서 데이터를 읽고 바로 렌더링에 사용할 수 있기 때문입니다. Ch.2에서 만든 <code>SearchablePostList</code>를 그대로 재사용하되, 데이터만 외부에서 가져오는 것이 달라졌습니다.</p>

<h3>DB 직접 쿼리 - Prisma, Drizzle 등</h3>
<p>서버 컴포넌트는 서버에서 실행되므로, <strong>데이터베이스에 직접 접근</strong>할 수 있습니다. API 라우트를 따로 만들 필요가 없습니다.</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import { db } from '@/lib/database';
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>이 코드의 <code>db</code> 객체(예: Prisma Client)는 <strong>서버에서만 실행</strong>되므로, DB 접속 정보가 클라이언트에 노출되지 않습니다.</p>

<h3>파일 시스템 - fs/promises로 JSON 파일 읽기</h3>
<p>마크다운 블로그나 정적 데이터를 관리할 때 유용합니다. Node.js의 파일 시스템 API를 그대로 사용할 수 있습니다.</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import { readFile } from 'fs/promises';
import path from 'path';
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const raw = await readFile(filePath, 'utf-8');
  const posts = JSON.parse(raw);

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>비교표: useEffect + fetch vs 서버 컴포넌트</h3>

<table>
<thead>
<tr><th></th><th>useEffect + fetch</th><th>서버 컴포넌트</th></tr>
</thead>
<tbody>
<tr><td><strong>실행 위치</strong></td><td>브라우저</td><td>서버</td></tr>
<tr><td><strong>초기 HTML</strong></td><td>로딩 UI만 포함</td><td>데이터가 포함된 완성된 HTML</td></tr>
<tr><td><strong>로딩 UI</strong></td><td>빠른 데이터에도 항상 필요</td><td>느린 데이터에만 선택적으로 적용</td></tr>
<tr><td><strong>클라이언트 번들</strong></td><td>fetching·상태 관리 로직 포함</td><td>fetching 로직이 번들에 포함되지 않음</td></tr>
<tr><td><strong>보안</strong></td><td>비밀 값은 둘 수 없음</td><td>비밀 값을 서버에만 둘 수 있음</td></tr>
<tr><td><strong>DB 접근</strong></td><td>불가 (API 필요)</td><td>직접 가능</td></tr>
</tbody>
</table>

${box('info', '참고로 Next.js의 <code>fetch</code>는 캐싱과 함께 동작합니다. <code>fetch</code>에 캐싱 옵션을 설정할 수도 있는데, 이 부분은 <strong>세션 4</strong>에서 자세히 살펴보겠습니다.')}

${h2('data-fetching-summary', '정리')}

<table>
<thead>
<tr><th>개념</th><th>핵심 내용</th></tr>
</thead>
<tbody>
<tr><td>하드코딩의 한계</td><td>데이터는 코드 밖(API, DB, 파일)에 있어야 한다</td></tr>
<tr><td>useEffect + fetch</td><td>동작하지만 fetching 로직이 클라이언트로 이동하고, 빠른 데이터에도 로딩 UI가 필요하다</td></tr>
<tr><td>서버 컴포넌트</td><td>async/await으로 서버에서 데이터를 가져와 완성된 HTML을 바로 전달할 수 있다</td></tr>
<tr><td>데이터 소스</td><td>fetch API, DB 직접 쿼리, 파일 시스템 모두 가능</td></tr>
<tr><td>기본값</td><td>App Router에서 데이터 fetching의 기본 위치는 서버</td></tr>
</tbody>
</table>

<p>다음 세션에서는 서버에서 데이터를 가져온 뒤 화면을 <strong>언제</strong> 만들어 둘 것인지 - 빌드 시점에 미리 만드는 정적 렌더링과, 요청마다 만드는 동적 렌더링을 학습합니다.</p>
          `,
        },
        {
          title: '렌더링 전략과 SSG/SSR',
          content: `
${h2('when-to-render', '서버에서 가져왔다 - 그런데 언제 만들지?')}

<p>지난 세션에서 서버 컴포넌트가 데이터를 <strong>어디서</strong> 가져오는지 배웠습니다. 외부 API, 데이터베이스, 파일 시스템 - 어디든 서버에서 직접 접근할 수 있었죠. 이번 세션의 질문은 다릅니다: <strong>"그 데이터로 화면을 언제 만들까?"</strong></p>

<p>생각해 보면 두 가지 시점이 가능합니다:</p>

<ul>
<li><strong>빌드할 때 미리 만들어 둔다</strong> - 블로그 소개 페이지처럼 내용이 거의 안 바뀌는 경우. 미리 HTML을 만들어 CDN에 올려 두면 즉시 응답할 수 있습니다.</li>
<li><strong>요청이 올 때마다 만든다</strong> - 검색 결과나 로그인 후 대시보드처럼 사용자마다 다른 경우. 매 요청마다 서버에서 HTML을 생성합니다.</li>
</ul>

<p>Next.js는 이 두 가지를 <strong>정적 렌더링(Static Rendering)</strong>과 <strong>동적 렌더링(Dynamic Rendering)</strong>이라 부릅니다.</p>

${h2('static-rendering', '정적 렌더링 (Static Rendering)')}

<p>정적 렌더링은 Next.js의 <strong>기본값</strong>입니다. 컴포넌트 안에서 요청 시점 정보(<code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>)를 사용하지 않으면, Next.js는 빌드 시점에 HTML을 미리 생성합니다.</p>

<pre><code class="language-tsx">// app/about/page.tsx
export default function About() {
  return (
    &lt;div&gt;
      &lt;h1&gt;블로그 소개&lt;/h1&gt;
      &lt;p&gt;이 블로그는 웹 개발 경험을 공유하는 공간입니다.&lt;/p&gt;
      &lt;p&gt;React와 Next.js를 중심으로 다양한 주제를 다룹니다.&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>이 페이지는 요청 시점 정보를 전혀 사용하지 않습니다. <code>npm run build</code>를 실행하면 HTML 파일이 미리 만들어지고, 빌드 로그에서 <code>○</code> 표시로 확인할 수 있습니다:</p>

<pre><code class="language-text">Route (app)
┌ ○ /about
└ ○ /blog

○  (Static)  prerendered as static content</code></pre>

<p>미리 만들어진 HTML은 CDN에 캐싱되어 <strong>즉시 응답</strong>할 수 있습니다. 서버가 매번 렌더링할 필요가 없으므로 속도와 비용 모두 유리합니다.</p>

${box('info', '개발 모드(<code>next dev</code>)에서는 코드 변경을 즉시 반영하기 위해 모든 페이지가 요청마다 렌더링됩니다. 정적/동적 구분은 <code>npm run build</code>로 프로덕션 빌드를 할 때 적용되는 최적화입니다.')}

${h2('dynamic-rendering', '동적 렌더링 (Dynamic Rendering)')}

<p>검색 결과 페이지를 생각해 보세요. 사용자가 어떤 검색어를 입력할지는 빌드 시점에 알 수 없습니다. 검색어는 URL의 쿼리 스트링(<code>?q=react</code>)으로 전달되고, 이 값은 <strong>요청이 들어와야</strong> 알 수 있기 때문에 HTML을 미리 만들어 둘 수 없습니다.</p>

<p>Next.js는 다음 함수나 값을 사용하면 자동으로 동적 렌더링으로 전환합니다:</p>

<ul>
<li><code>cookies()</code> - 쿠키 읽기</li>
<li><code>headers()</code> - 요청 헤더 읽기</li>
<li><code>searchParams</code> - URL 쿼리 스트링</li>
</ul>

<pre><code class="language-tsx">// app/blog/search/page.tsx
import { SearchablePostList } from '../../components/SearchablePostList';

export default async function BlogSearch(
  props: { searchParams: Promise&lt;{ q?: string }&gt; }
) {
  const { q } = await props.searchParams;

  const res = await fetch(
    'http://localhost:4000/posts?search=' + (q || '')
  );
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;검색 결과: {q}&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p><code>searchParams</code>를 사용했으므로 이 페이지는 자동으로 동적 렌더링됩니다. 빌드 로그에서 <code>ƒ</code> 표시로 확인할 수 있습니다:</p>

<pre><code class="language-text">Route (app)
┌ ○ /about
├ ○ /blog
└ ƒ /blog/search

ƒ  (Dynamic)  server-rendered on demand</code></pre>

${box('info', '<code>searchParams</code>와 <code>params</code>는 모두 <code>Promise</code> 타입이므로 반드시 <code>await</code>해야 합니다. 동기적으로 접근하면 에러가 발생합니다.')}

${h2('how-nextjs-decides', 'Next.js는 어떻게 판단하는가')}

<p>핵심 규칙은 간단합니다: <strong>기본값은 정적, 요청 시점 함수를 사용하면 자동으로 동적 전환</strong>. 개발자가 직접 "이 페이지는 정적이야" 또는 "이 페이지는 동적이야"라고 선언할 필요가 없습니다.</p>

<table>
<thead>
<tr><th></th><th>정적 렌더링</th><th>동적 렌더링</th></tr>
</thead>
<tbody>
<tr><td><strong>생성 시점</strong></td><td>빌드 시</td><td>요청 시</td></tr>
<tr><td><strong>적합한 상황</strong></td><td>소개 페이지, 블로그 글, 문서</td><td>검색, 대시보드, 인증 후 페이지</td></tr>
<tr><td><strong>응답 속도</strong></td><td>매우 빠름 (CDN)</td><td>서버 처리 시간만큼 소요</td></tr>
<tr><td><strong>데이터 신선도</strong></td><td>빌드 시점 데이터</td><td>항상 최신</td></tr>
<tr><td><strong>빌드 로그</strong></td><td>○ (Static)</td><td>ƒ (Dynamic)</td></tr>
</tbody>
</table>

${titleBox('neutral', '정적인데 데이터가 바뀌면?', '정적 렌더링은 빌드 시점의 데이터를 사용합니다. "블로그 글이 추가되면 어떡하지?"라는 의문이 들 수 있는데, 이 문제는 <strong>세션 4</strong>의 재검증(revalidation)에서 해결합니다.')}

${h2('generate-static-params', 'generateStaticParams - 동적 경로를 미리 만들기')}

<p><code>app/blog/[slug]/page.tsx</code>는 동적 경로입니다. URL에 따라 다른 글을 보여주기 때문입니다. 하지만 slug 목록을 미리 알 수 있다면, 각 경로의 HTML을 <strong>빌드 시점에 미리 만들 수 있습니다</strong>.</p>

<p><code>generateStaticParams</code> 함수를 내보내면 Next.js가 빌드 시 이 함수를 호출해서 생성할 경로 목록을 얻습니다:</p>

<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
import { LikeButton } from '@/app/components/LikeButton';

export async function generateStaticParams() {
  const res = await fetch('http://localhost:4000/posts');
  const posts = await res.json();

  return posts.map((post: { slug: string }) =&gt; ({
    slug: post.slug,
  }));
}

export default async function Post(
  props: { params: Promise&lt;{ slug: string }&gt; }
) {
  const { slug } = await props.params;
  const res = await fetch(&#96;http://localhost:4000/posts?slug=&#36;{slug}&#96;);
  const posts = await res.json();
  const post = posts[0];

  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;LikeButton /&gt;
    &lt;/article&gt;
  );
}</code></pre>

<p>빌드 로그에서 각 slug 경로가 미리 생성된 것을 확인할 수 있습니다:</p>

<pre><code class="language-text">Route (app)
└ ● /blog/[slug]
  ├ /blog/nextjs-routing
  └ /blog/react-server-components

●  (SSG)  prerendered as static HTML (uses generateStaticParams)</code></pre>

${titleBox('neutral', 'generateStaticParams가 반환하지 않은 slug는?', '기본적으로, 빌드 시 생성되지 않은 경로는 <strong>요청 시점에 동적으로 렌더링</strong>됩니다. 새 글이 추가되어도 접속 시 서버에서 생성하므로 404가 발생하지 않습니다.')}

${h2('rendering-summary', '정리')}

<table>
<thead>
<tr><th>개념</th><th>핵심 내용</th></tr>
</thead>
<tbody>
<tr><td>정적 렌더링</td><td>빌드 시 HTML 생성, CDN에서 즉시 제공. Next.js 기본값</td></tr>
<tr><td>동적 렌더링</td><td>요청마다 서버에서 생성. <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> 사용 시 자동 전환</td></tr>
<tr><td>자동 판단</td><td>개발자가 선언하지 않아도 Next.js가 코드를 분석해 결정</td></tr>
<tr><td><code>generateStaticParams</code></td><td>동적 경로의 페이지를 빌드 시 미리 생성</td></tr>
</tbody>
</table>

<p>다음 세션에서는 서버 렌더링의 또 다른 문제를 다룹니다. 데이터를 가져오는 데 3초가 걸리면, 사용자는 3초 동안 빈 화면을 봐야 할까요? <strong>Streaming과 Suspense</strong>로 이 문제를 해결합니다.</p>
          `,
        },
        {
          title: 'Streaming과 Suspense',
          content: `
${h2('slow-data-blocks-page', '문제: 느린 데이터가 전체 페이지를 막는다')}

<p>서버 컴포넌트에서 데이터를 가져오는 것까지 배웠습니다. 그런데 데이터를 가져오는 데 시간이 오래 걸리면 어떻게 될까요?</p>

<p>예를 들어, 블로그 페이지에서 글 목록은 빠르게 가져올 수 있지만 추천 글 데이터는 외부 API에서 가져오느라 3초가 걸린다고 가정해 보겠습니다:</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const res = await fetch('http://localhost:4000/posts');
  const posts = await res.json();

  // 이 요청이 3초 걸린다면?
  const recRes = await fetch('http://localhost:4000/recommendations');
  const recommendations = await recRes.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
      &lt;h2&gt;추천 글&lt;/h2&gt;
      &lt;ul&gt;
        {recommendations.map((rec: { id: number; title: string }) =&gt; (
          &lt;li key={rec.id}&gt;{rec.title}&lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>두 번째 <code>await</code>가 3초 걸리면, 글 목록이 이미 준비되었어도 사용자는 <strong>페이지 전체가 완성될 때까지</strong> 아무것도 볼 수 없습니다:</p>

<pre><code class="language-text">[요청] ─── 글 목록 fetch (0.1초) ─── 추천 글 fetch (3초) ─── HTML 전송
                                                                  ↑
                                                         이 시점에서 사용자가 화면을 봄</code></pre>

<p>글 목록은 0.1초 만에 준비되었는데, 추천 글 때문에 전체가 3초나 기다리는 셈입니다.</p>

${h2('loading-tsx', 'loading.tsx - 페이지 단위 로딩 UI')}

<p>가장 간단한 해결책은 <code>loading.tsx</code> 파일을 추가하는 것입니다. <code>page.tsx</code>와 같은 폴더에 이 파일을 만들면, 데이터를 가져오는 동안 자동으로 로딩 UI를 보여줍니다:</p>

<pre><code class="language-tsx">// app/blog/loading.tsx
export default function Loading() {
  return &lt;p&gt;글 목록을 불러오는 중...&lt;/p&gt;;
}</code></pre>

<p>이제 사용자는 빈 화면 대신 "글 목록을 불러오는 중..." 메시지를 즉시 볼 수 있습니다. 데이터가 준비되면 <code>loading.tsx</code>가 <code>page.tsx</code>의 결과로 자동 교체됩니다.</p>

<pre><code class="language-text">[요청] ─── loading.tsx 즉시 표시
             ─── 데이터 fetch (3초) ─── page.tsx로 교체</code></pre>

${box('info', '<code>loading.tsx</code>는 내부적으로 React의 <code>Suspense</code>를 사용합니다. Next.js가 <code>page.tsx</code>를 <code>&lt;Suspense fallback={&lt;Loading /&gt;}&gt;</code>로 자동 감싸주는 것과 같습니다.')}

${h2('suspense-component', 'Suspense - 컴포넌트 단위 로딩')}

<p><code>loading.tsx</code>에는 한계가 있습니다. 페이지 <strong>전체</strong>를 로딩 UI로 교체하기 때문에, 이미 준비된 글 목록까지 숨겨 버립니다. 글 목록은 바로 보여주고, 느린 추천 글 부분만 로딩 표시를 하고 싶다면 어떻게 해야 할까요?</p>

<p>React의 <code>&lt;Suspense&gt;</code>를 사용하면 <strong>느린 부분만 골라서</strong> 로딩 처리를 할 수 있습니다. 핵심은 느린 데이터를 가져오는 부분을 <strong>별도의 async 서버 컴포넌트로 분리</strong>하는 것입니다:</p>

<pre><code class="language-tsx">// app/blog/components/Recommendations.tsx
export default async function Recommendations() {
  const res = await fetch('http://localhost:4000/recommendations');
  const recommendations = await res.json();

  return (
    &lt;ul&gt;
      {recommendations.map((rec: { id: number; title: string }) =&gt; (
        &lt;li key={rec.id}&gt;{rec.title}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>

<p>이제 페이지에서 이 컴포넌트를 <code>Suspense</code>로 감쌉니다:</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import { Suspense } from 'react';
import { SearchablePostList } from '../components/SearchablePostList';
import Recommendations from './components/Recommendations';

export default async function Blog() {
  const res = await fetch('http://localhost:4000/posts');
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
      &lt;h2&gt;추천 글&lt;/h2&gt;
      &lt;Suspense fallback={&lt;p&gt;추천 글 로딩 중...&lt;/p&gt;}&gt;
        &lt;Recommendations /&gt;
      &lt;/Suspense&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>이제 글 목록은 즉시 표시되고, 추천 글 영역만 "추천 글 로딩 중..."으로 표시됩니다. 추천 데이터가 도착하면 해당 부분만 교체됩니다:</p>

<pre><code class="language-text">[요청] ─── 글 목록 (0.1초) ─── 글 목록 + "추천 글 로딩 중..." 즉시 전송
                                   ─── 추천 글 (3초) ─── 추천 영역만 교체</code></pre>

<p>이것이 <strong>Streaming</strong>입니다. <code>Suspense</code>를 사용하면 Next.js가 완성된 부분부터 브라우저로 전송하고, 나머지는 준비되는 대로 이어서 보냅니다. 사용자는 빈 화면을 기다리는 대신 점진적으로 콘텐츠를 볼 수 있습니다.</p>

${titleBox('neutral', '핵심: async 컴포넌트 분리', '<code>Suspense</code>가 로딩 경계를 만들려면, 느린 <code>await</code>가 <strong>별도의 async 서버 컴포넌트 안</strong>에 있어야 합니다. 같은 컴포넌트 안에서 <code>await</code>한 뒤 <code>Suspense</code>로 감싸는 것은 효과가 없습니다 - 이미 기다린 뒤이므로 감쌀 것이 없기 때문입니다.')}

${h2('parallel-fetching', '병렬 데이터 fetching')}

<p><code>Suspense</code>와 별개로, 서버 컴포넌트 안에서 여러 데이터를 가져올 때 불필요한 순차 실행을 피하는 것도 중요합니다.</p>

<h3>Before - 순차 실행 (느림)</h3>

<pre><code class="language-tsx">export default async function Blog() {
  // 1번이 끝나야 2번이 시작됨
  const posts = await fetch('http://localhost:4000/posts')
    .then(r =&gt; r.json());
  const categories = await fetch('http://localhost:4000/categories')
    .then(r =&gt; r.json());

  // 총 시간: posts 시간 + categories 시간
  // ...
}</code></pre>

<h3>After - 병렬 실행 (빠름)</h3>

<pre><code class="language-tsx">export default async function Blog() {
  // 동시에 시작
  const [posts, categories] = await Promise.all([
    fetch('http://localhost:4000/posts').then(r =&gt; r.json()),
    fetch('http://localhost:4000/categories').then(r =&gt; r.json()),
  ]);

  // 총 시간: 둘 중 더 오래 걸리는 쪽
  // ...
}</code></pre>

<p><code>Promise.all</code>은 모든 요청을 동시에 시작하고, 전부 완료되면 결과를 반환합니다. 서로 의존성이 없는 데이터라면 항상 병렬로 가져오는 것이 좋습니다.</p>

${titleBox('warn', '병렬 fetching vs Suspense', '둘은 다른 문제를 해결합니다. <strong>병렬 fetching</strong>은 같은 컴포넌트에서 여러 데이터를 동시에 요청해 총 대기 시간을 줄입니다. <strong>Suspense</strong>는 완성된 부분부터 사용자에게 먼저 보여줍니다. 상황에 따라 둘을 함께 사용할 수도 있습니다.')}

${h2('streaming-summary', '정리')}

<table>
<thead>
<tr><th>개념</th><th>핵심 내용</th></tr>
</thead>
<tbody>
<tr><td><code>loading.tsx</code></td><td>페이지 전체의 로딩 UI. 파일 하나로 간단하게 적용</td></tr>
<tr><td><code>Suspense</code></td><td>컴포넌트 단위 로딩. 느린 부분만 골라서 로딩 처리</td></tr>
<tr><td>Streaming</td><td>완성된 부분부터 브라우저로 전송. Suspense가 자동으로 활성화</td></tr>
<tr><td>병렬 fetching</td><td><code>Promise.all</code>로 독립적인 데이터를 동시에 요청</td></tr>
</tbody>
</table>

<p>다음 세션에서는 <strong>캐싱</strong>을 다룹니다. 같은 블로그 글 목록을 100명이 요청하면 매번 데이터를 새로 가져와야 할까요? 한 번 가져온 결과를 재사용하는 전략을 배웁니다.</p>
          `,
        },
        {
          title: '캐싱 전략과 revalidation',
          content: `
${h2('why-caching', '왜 캐싱이 필요한가')}

<p>지난 세션에서 느린 데이터를 기다리는 동안에도 사용자에게 화면을 보여주는 방법을 배웠습니다. 이번에는 한 걸음 더 나아가, 같은 데이터를 <strong>매번 새로 가져와야 하는지</strong> 생각해 보겠습니다.</p>

<p>같은 블로그 글 목록을 100명이 동시에 요청한다고 생각해 보세요. 매번 데이터베이스에 쿼리를 보내거나 외부 API를 호출하면, 서버 부하와 비용이 불필요하게 늘어납니다. 글 목록이 1분 전과 달라지지 않았는데도 말이죠.</p>

<p><strong>캐싱</strong>은 한 번 가져온 결과를 일정 기간 재사용하는 것입니다. 핵심 질문은 하나입니다: <strong>"얼마나 오래 재사용해도 괜찮은가?"</strong></p>

<ul>
<li>블로그 소개 페이지 - 거의 안 바뀜 → 오래 캐싱해도 괜찮음</li>
<li>블로그 글 목록 - 가끔 바뀜 → 몇 분 정도 캐싱</li>
<li>실시간 댓글 수 - 자주 바뀜 → 캐싱하면 안 됨</li>
</ul>

${h2('fetch-cache-options', 'fetch 캐싱 옵션')}

<p>Next.js에서 <code>fetch</code>를 사용할 때 캐싱 동작을 제어할 수 있습니다. 기본값은 <strong>캐싱 없음</strong> - 매 요청마다 새로 가져옵니다.</p>

<pre><code class="language-tsx">// 1. 기본값: 매번 새로 요청 (캐싱 없음)
const res = await fetch('http://localhost:4000/posts');

// 2. 한 번 가져오면 계속 재사용
const res = await fetch('http://localhost:4000/posts', {
  cache: 'force-cache',
});

// 3. 60초마다 갱신
const res = await fetch('http://localhost:4000/posts', {
  next: { revalidate: 60 },
});</code></pre>

<table>
<thead>
<tr><th>옵션</th><th>동작</th><th>적합한 상황</th></tr>
</thead>
<tbody>
<tr><td>기본값 (옵션 없음)</td><td>매번 새로 요청</td><td>실시간 데이터</td></tr>
<tr><td><code>cache: 'force-cache'</code></td><td>한 번 가져오면 재배포를 하기 전까지 재사용</td><td>거의 안 바뀌는 데이터</td></tr>
<tr><td><code>next: { revalidate: 초 }</code></td><td>지정 시간 후 백그라운드 갱신</td><td>주기적으로 바뀌는 데이터</td></tr>
</tbody>
</table>

${h2('time-based-revalidation', '시간 기반 재검증')}

<p><code>next: { revalidate: 60 }</code>을 설정하면, 60초 동안은 캐싱된 결과를 사용하고 60초가 지난 뒤 다음 요청이 들어오면 백그라운드에서 데이터를 갱신합니다.</p>

<pre><code class="language-tsx">// app/blog/page.tsx
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const res = await fetch('http://localhost:4000/posts', {
    next: { revalidate: 60 }, // 60초마다 갱신
  });
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>동작 흐름을 정리하면:</p>

<pre><code class="language-text">0초   → 첫 요청: 서버에서 fetch → 결과 캐싱 → HTML 전송
30초  → 요청: 캐싱된 결과 즉시 반환 (fetch 없음)
61초  → 요청: 캐싱된 결과 반환 + 백그라운드에서 새 데이터 fetch
62초  → 요청: 새로 가져온 데이터로 응답</code></pre>

<p>사용자는 항상 빠른 응답을 받습니다. 데이터가 오래되었더라도 일단 캐싱된 결과를 먼저 보여주고, 새 데이터는 백그라운드에서 준비합니다. 이 패턴은 "오래된 데이터를 먼저 보여주면서 갱신한다"는 뜻에서 <strong>stale-while-revalidate</strong>라 불립니다.</p>

${h2('on-demand-revalidation', '요청 기반 재검증 (On-demand)')}

<p>시간 기반 재검증은 "60초마다 갱신"처럼 일정한 주기를 설정합니다. 하지만 글을 새로 작성했을 때 최대 60초를 기다려야 목록에 나타난다면 불편하겠죠.</p>

<p><code>revalidatePath</code>를 사용하면 특정 경로의 캐시를 <strong>즉시</strong> 무효화할 수 있습니다:</p>

<pre><code class="language-tsx">// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;

  await fetch('http://localhost:4000/posts', {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' },
  });

  revalidatePath('/blog'); // /blog 경로의 캐시 즉시 무효화
}</code></pre>

<p>위 코드는 다음 세션에서 배울 <strong>Server Action</strong>입니다. 핵심만 보면, 데이터를 변경한 뒤 <code>revalidatePath('/blog')</code>를 호출해서 해당 경로의 캐시를 무효화합니다. 다음 요청부터 새 데이터를 가져옵니다.</p>

${titleBox('neutral', 'revalidatePath vs revalidateTag', '<code>revalidatePath</code>는 특정 경로의 캐시를 무효화합니다. <code>revalidateTag</code>는 태그를 기준으로 여러 fetch 캐시를 한꺼번에 무효화할 수 있지만, 이 튜토리얼에서는 더 직관적인 <code>revalidatePath</code>를 사용합니다.')}

${h2('use-cache-callout', '한 걸음 더: Next.js 16의 "use cache"')}

<p>지금까지 <code>fetch</code> 옵션으로 캐싱을 제어하는 방법을 배웠습니다. 이 방식은 <strong>개별 HTTP 요청의 응답</strong>을 캐싱합니다. Next.js 16의 <code>"use cache"</code> 지시어는 더 넓은 단위로 캐싱합니다 - <strong>함수나 컴포넌트의 실행 결과 자체</strong>를 캐싱하므로, 여러 fetch 호출과 데이터 가공 로직을 포함한 전체 결과를 한 번에 캐싱할 수 있습니다:</p>

<pre><code class="language-tsx">"use cache";

export async function getPosts() {
  const res = await fetch('http://localhost:4000/posts');
  return res.json();
}</code></pre>

<p><code>'use client'</code>, <code>'use server'</code>와 같은 패턴입니다. 데이터 요청(fetch), 데이터베이스 조회, 또는 계산 비용이 큰 작업의 결과를 재사용하기 위해 사용됩니다. 이 튜토리얼에서는 <code>fetch</code> 옵션 기반 캐싱을 중심으로 설명합니다. <code>"use cache"</code>는 더 큰 프로젝트에서 유용하게 사용할 수 있는 방식입니다.</p>

${box('warn', '<code>"use cache"</code>를 사용하려면 <code>next.config.ts</code>에서 <code>cacheComponents: true</code> 설정이 필요합니다. 이 플래그는 이전의 <code>dynamicIO</code>, <code>useCache</code> 등을 하나로 통합한 것입니다.')}

${h2('caching-summary', '정리')}

<table>
<thead>
<tr><th>개념</th><th>핵심 내용</th></tr>
</thead>
<tbody>
<tr><td>기본값</td><td>Next.js 16에서 <code>fetch</code>는 기본적으로 캐싱하지 않음</td></tr>
<tr><td><code>force-cache</code></td><td>한 번 가져오면 계속 재사용. 거의 안 바뀌는 데이터에 적합</td></tr>
<tr><td>시간 기반 재검증</td><td><code>next: { revalidate: 초 }</code>로 주기적 갱신</td></tr>
<tr><td>요청 기반 재검증</td><td><code>revalidatePath</code>로 데이터 변경 시 즉시 무효화</td></tr>
<tr><td><code>"use cache"</code></td><td>Next.js 16의 새 지시어. 페이지/컴포넌트/함수 단위 캐싱</td></tr>
</tbody>
</table>

<p>다음 세션에서는 지금까지 빠져 있던 마지막 퍼즐을 채웁니다. 데이터를 읽기만 했는데, <strong>글을 추가하거나 수정</strong>하려면 어떻게 해야 할까요? <strong>Server Actions</strong>를 배웁니다.</p>
          `,
        },
        {
          title: 'Server Actions와 화면 갱신',
          content: `
${h2('from-reading-to-writing', '읽기에서 쓰기로')}

<p>지난 세션에서 요청 기반 재검증을 배우면서, <code>revalidatePath</code>와 함께 <code>createPost</code>라는 Server Action 코드를 잠깐 봤습니다. 데이터를 변경한 뒤 캐시를 무효화하는 흐름이었는데, 정작 Server Action 자체는 자세히 다루지 않았습니다.</p>

<p>이번 세션에서 본격적으로 다룹니다. 먼저, 기존 React에서 데이터를 변경하려면 어떻게 했는지 비교해 보겠습니다:</p>

<pre><code class="language-tsx">// 기존 방식: 서버 API를 만들고, 클라이언트에서 fetch
const handleSubmit = async (data: FormData) =&gt; {
  await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: data.get('title') }),
  });
};</code></pre>

<p>서버에 API를 별도로 만들고, 클라이언트에서 <code>fetch</code>로 호출해야 했습니다. Next.js의 <strong>Server Actions</strong>는 이 과정을 훨씬 간단하게 만듭니다.</p>

${h2('what-are-server-actions', 'Server Actions란?')}

<p>Server Action은 <code>'use server'</code> 지시어로 표시된 <strong>서버에서 실행되는 함수</strong>입니다. Ch.2에서 배운 <code>'use client'</code>의 대칭이라고 생각하면 됩니다.</p>

<ul>
<li><code>'use client'</code> → 이 코드는 브라우저에서 실행됩니다</li>
<li><code>'use server'</code> → 이 코드는 서버에서 실행됩니다</li>
</ul>

<p>별도의 API 라우트를 만들 필요 없이, 서버 함수를 클라이언트에서 직접 호출할 수 있습니다. 보통 별도 파일에 정의합니다:</p>

<pre><code class="language-tsx">// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;

  // 서버에서 실행 - DB 접근, API 호출 등 가능
  await fetch('http://localhost:4000/posts', {
    method: 'POST',
    body: JSON.stringify({ title, slug }),
    headers: { 'Content-Type': 'application/json' },
  });
}</code></pre>

<p>이것이 가능한 이유는 <code>'use server'</code> 지시어 때문입니다. 파일 맨 위에 <code>'use server'</code>를 선언하면 Next.js는 이 파일의 export된 함수들을 서버에서 실행되는 함수(Server Action)로 처리합니다.</p>

<p>그래서 클라이언트에서 이 함수를 호출하면 실제로는 브라우저에서 실행되는 것이 아니라, 요청이 서버로 전달되어 서버에서 함수가 실행됩니다. 즉 브라우저에서는 함수 호출처럼 보이지만, 내부적으로는 서버에 요청을 보내고 결과를 받아오는 구조입니다.</p>

${h2('form-with-server-action', '폼에서 Server Action 사용하기')}

<p>Server Action은 HTML <code>&lt;form&gt;</code>의 <code>action</code> 속성에 바로 전달할 수 있습니다:</p>

<pre><code class="language-tsx">// app/blog/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPost() {
  return (
    &lt;div&gt;
      &lt;h1&gt;새 글 작성&lt;/h1&gt;
      &lt;form action={createPost}&gt;
        &lt;div&gt;
          &lt;label htmlFor="title"&gt;제목&lt;/label&gt;
          &lt;input id="title" name="title" placeholder="제목을 입력하세요" /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          &lt;label htmlFor="slug"&gt;Slug&lt;/label&gt;
          &lt;input id="slug" name="slug" placeholder="slug를 입력하세요" /&gt;
        &lt;/div&gt;
        &lt;button type="submit"&gt;작성하기&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>폼이 제출되면:</p>

<ol>
<li>브라우저가 <code>FormData</code>를 서버로 전송</li>
<li>서버에서 <code>createPost</code> 함수 실행 (데이터 저장)</li>
</ol>

<p>별도의 API 라우트도, 클라이언트 <code>fetch</code> 코드도, <code>onSubmit</code> 핸들러도 필요 없습니다. 이 페이지는 서버 컴포넌트이므로 <code>'use client'</code> 선언도 없습니다.</p>

${box('info', 'Server Action은 <code>&lt;form action&gt;</code>뿐 아니라 이벤트 핸들러에서도 호출할 수 있습니다. 하지만 폼과 함께 사용할 때 가장 자연스럽고, JavaScript가 비활성화된 환경에서도 기본 폼 동작으로 작동합니다.')}

${h2('use-action-state', 'useActionState - 제출 상태 관리')}

<p>폼 제출 중 로딩 표시를 하거나, 서버에서 에러 메시지를 반환하고 싶다면 어떻게 해야 할까요? <a href="https://ko.react.dev/reference/react/useActionState" target="_blank" rel="noopener noreferrer"><code>useActionState</code></a> Hook이 이 문제를 해결합니다.</p>

<p>위의 <code>createPost</code>를 수정하여 성공/실패 상태를 반환하도록 만듭니다:</p>

<pre><code class="language-tsx">// app/actions.ts
'use server';

export async function createPost(
  prevState: { error: string | null },
  formData: FormData
) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;

  if (title.length &lt; 2) {
    return { error: '제목은 2글자 이상이어야 합니다.' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.' };
  }

  await fetch('http://localhost:4000/posts', {
    method: 'POST',
    body: JSON.stringify({ title, slug }),
    headers: { 'Content-Type': 'application/json' },
  });
}</code></pre>

<p>그리고 클라이언트 컴포넌트에서 <code>useActionState</code>를 사용합니다:</p>

<pre><code class="language-tsx">// app/components/PostForm.tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/app/actions';

export default function PostForm() {
  const [state, formAction, isPending] = useActionState<
    { error: string | null },
    FormData
  >(createPost, { error: null });

  return (
    &lt;form action={formAction}&gt;
      &lt;div&gt;
        &lt;label htmlFor="title"&gt;제목&lt;/label&gt;
        &lt;input id="title" name="title" placeholder="제목을 입력하세요" /&gt;
      &lt;/div&gt;
      &lt;div&gt;
        &lt;label htmlFor="slug"&gt;Slug&lt;/label&gt;
        &lt;input id="slug" name="slug" placeholder="slug를 입력하세요" /&gt;
      &lt;/div&gt;
      {state.error &amp;&amp; (
        &lt;p style={{ color: 'red' }}&gt;{state.error}&lt;/p&gt;
      )}
      &lt;button type="submit" disabled={isPending}&gt;
        {isPending ? '작성 중...' : '작성하기'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<p><code>useActionState</code>는 세 가지 값을 반환합니다:</p>

<ul>
<li><code>state</code> - Server Action이 반환한 상태 (에러 메시지 등)</li>
<li><code>formAction</code> - <code>&lt;form action&gt;</code>에 전달할 함수</li>
<li><code>isPending</code> - 제출 진행 중 여부 (로딩 표시에 활용)</li>
</ul>

${titleBox('neutral', 'useActionState는 클라이언트 컴포넌트에서만', "<code>useActionState</code>는 React Hook이므로 <code>'use client'</code> 컴포넌트에서만 사용할 수 있습니다. 폼 UI를 별도 클라이언트 컴포넌트로 분리하고, 페이지에서 import하는 패턴이 일반적입니다.")}

<p>다음 세션에서는 지금까지 배운 개념들을 종합하여 Ch.2의 블로그 프로젝트에 <strong>실제 데이터 연동</strong>을 적용하는 실습을 진행합니다.</p>
          `,
        },
        {
          title: '블로그 데이터 연동 실습',
          content: `
${h2('what-we-will-build', '이번 세션에서 할 일')}
<p>Ch.3에서 배운 개념들을 종합하여, Ch.2의 블로그 프로젝트에 실제 데이터 연동을 적용합니다. 구체적으로:</p>
<ol>
<li><strong>json-server 설정</strong> - JSON 파일 하나로 REST API 서버 구축</li>
<li><strong>글 목록 서버 fetching</strong> - 하드코딩 배열을 <code>fetch</code>로 교체</li>
<li><strong>글 상세 페이지 연동</strong> - 동적 라우트에서 서버 데이터 조회</li>
<li><strong>loading.tsx 추가</strong> - 데이터 로딩 중 UI 표시</li>
<li><strong>글 작성 기능</strong> - Server Action + <code>useActionState</code>로 폼 완성</li>
<li><strong>최종 구조 점검</strong> - 프로젝트 구조와 적용 개념 정리</li>
</ol>

${h2('step1-json-server', 'Step 1: json-server 설정')}

<p>이번 챕터에서 <code>http://localhost:4000/posts</code>라는 URL이 계속 등장했습니다. 이제 직접 이 서버를 만들어 봅니다. <a href="https://github.com/typicode/json-server" target="_blank" rel="noopener noreferrer">json-server</a>는 JSON 파일 하나로 REST API를 자동 생성해 주는 개발용 도구입니다.</p>

<p>먼저 <strong>프로젝트 루트</strong>에 <code>db.json</code> 파일을 만듭니다:</p>

<pre><code class="language-json">{
  "posts": [
    {
      "id": 1,
      "slug": "nextjs-routing",
      "title": "Next.js 라우팅 이해하기"
    },
    {
      "id": 2,
      "slug": "react-server-components",
      "title": "React 서버 컴포넌트란?"
    }
  ]
}</code></pre>

<p>Ch.1/Ch.2에서 하드코딩했던 slug와 title을 그대로 사용합니다. 이제 데이터가 코드 안이 아니라 db.json 파일에 저장될 뿐입니다.</p>

<p>json-server를 설치합니다:</p>

<pre><code class="language-shell">npm install -D json-server</code></pre>

<p><code>package.json</code>의 scripts에 실행 명령을 추가합니다:</p>

<pre><code class="language-json">{
  "scripts": {
    "dev": "next dev",
    "json-server": "json-server --watch db.json --port 4000"
  }
}</code></pre>

<p>설정이 끝났습니다. 실행해서 확인해 봅니다:</p>

<pre><code class="language-shell">npm run json-server</code></pre>

<p>브라우저에서 <code>http://localhost:4000/posts</code>에 접속하면 JSON 응답이 표시됩니다. 이것이 세션 1부터 사용해 온 API의 실체입니다.</p>

${titleBox('warn', 'json-server는 개발 전용입니다', 'json-server는 학습과 프로토타이핑을 위한 도구입니다. 실제 서비스에서는 데이터베이스와 백엔드 서버를 사용합니다. 또한 Next.js 개발 서버와 json-server는 <strong>별도의 터미널</strong>에서 각각 실행해야 합니다.')}

${h2('step2-fetch-posts', 'Step 2: 글 목록 서버 fetching')}

<p>세션 1에서 서버 컴포넌트의 <code>fetch</code>를 배웠습니다. 이제 Ch.2에서 만든 블로그 페이지를 직접 변환합니다.</p>

<h3>Before (Ch.2)</h3>
<pre><code class="language-tsx">// app/blog/page.tsx - 하드코딩된 데이터
import { SearchablePostList } from '../components/SearchablePostList';

const posts = [
  { id: 1, slug: 'nextjs-routing', title: 'Next.js 라우팅 이해하기' },
  { id: 2, slug: 'react-server-components', title: 'React 서버 컴포넌트란?' },
];

export default function Blog() {
  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>After</h3>
<pre><code class="language-tsx">// app/blog/page.tsx - 서버에서 데이터 가져오기
import { SearchablePostList } from '../components/SearchablePostList';

export default async function Blog() {
  const res = await fetch('http://localhost:4000/posts');
  const posts = await res.json();

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>달라진 부분은 두 가지입니다:</p>

<ol>
<li><code>function Blog()</code> → <code>async function Blog()</code> (서버 컴포넌트는 async 가능)</li>
<li>하드코딩 배열 → <code>fetch</code>로 외부 데이터 조회</li>
</ol>

<p><code>SearchablePostList</code>는 변경 없이 그대로 재사용됩니다. 데이터가 하드코딩이든 서버에서 가져온 것이든, props로 받는 형태가 같으면 하위 컴포넌트는 신경 쓸 필요가 없습니다.</p>

${titleBox('neutral', '테스트', '터미널 1에서 <code>npm run json-server</code>, 터미널 2에서 <code>npm run dev</code>를 실행한 뒤 <code>/blog</code>에 접속합니다. Ch.2와 동일한 글 목록이 표시되면 성공입니다.')}

${h2('step3-fetch-post-detail', 'Step 3: 글 상세 페이지 데이터 연동')}

<p>Ch.2에서 만든 글 상세 페이지는 URL에 포함된 slug 값을 그대로 화면에 표시하는 간단한 구조였습니다. 이제 이 slug를 이용해 서버에서 실제 글 데이터를 조회하도록 변경해 보겠습니다. 즉 <code>/blog/nextjs-routing</code> 같은 경로로 접속하면, URL의 slug 값을 기준으로 서버에서 해당 글을 찾아 화면에 표시하는 방식입니다.</p>

<h3>Before (Ch.2)</h3>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
import { LikeButton } from '@/app/components/LikeButton';

export default async function Post({
  params,
}: {
  params: Promise&lt;{ slug: string }&gt;;
}) {
  const { slug } = await params;

  return (
    &lt;div&gt;
      &lt;h1&gt;{slug}&lt;/h1&gt;
      &lt;p&gt;이 글의 내용이 여기에 표시됩니다.&lt;/p&gt;
      &lt;LikeButton /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>After</h3>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
import { LikeButton } from '@/app/components/LikeButton';

export default async function Post({
  params,
}: {
  params: Promise&lt;{ slug: string }&gt;;
}) {
  const { slug } = await params;
  const res = await fetch(&#96;http://localhost:4000/posts?slug=&#36;{slug}&#96;);
  const posts = await res.json();
  const post = posts[0];

  return (
    &lt;div&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;이 글의 내용이 여기에 표시됩니다.&lt;/p&gt;
      &lt;LikeButton /&gt;
    &lt;/div&gt;
  );
}</code></pre>

${titleBox('info', '왜 <code>?slug=</code> 쿼리 파라미터를 사용하나요?', 'json-server는 경로 기반 조회(<code>/posts/1</code>)에 숫자 ID를 사용합니다. slug처럼 문자열 필드로 찾을 때는 쿼리 파라미터(<code>?slug=값</code>)를 사용합니다. 결과가 배열로 반환되므로 <code>posts[0]</code>으로 첫 번째 항목을 꺼냅니다.')}

${titleBox('neutral', '테스트', '글 목록에서 링크를 클릭하면 <code>/blog/nextjs-routing</code>으로 이동하고, db.json에 작성한 실제 제목이 표시됩니다.')}

${h2('step4-loading', 'Step 4: loading.tsx로 로딩 UI 추가')}

<p>세션 3에서 배운 것처럼, <code>page.tsx</code>와 같은 폴더에 <code>loading.tsx</code>를 놓으면 데이터를 가져오는 동안 자동으로 표시됩니다:</p>

<pre><code class="language-tsx">// app/blog/loading.tsx
export default function Loading() {
  return &lt;p&gt;불러오는 중...&lt;/p&gt;;
}</code></pre>

${titleBox('neutral', '테스트', '페이지를 새로고침하면 데이터를 가져오는 동안 "불러오는 중..." 메시지가 잠깐 표시됩니다. 네트워크가 빠르면 거의 보이지 않을 수 있습니다.')}

<h3>네트워크 속도 제한으로 로딩 UI 확인하기</h3>

<p>로컬 환경에서는 네트워크가 빨라서 로딩 UI가 순식간에 지나갑니다. 브라우저 개발자 도구의 네트워크 탭을 이용하면 인터넷 속도를 인위적으로 낮춰 로딩 UI를 눈으로 확인할 수 있습니다.</p>

<ol>
<li>브라우저에서 <strong>Cmd + Option + I</strong> (또는 <strong>Ctrl + Shift + I</strong>)를 눌러 개발자 도구를 엽니다.</li>
<li><strong>네트워크</strong> 탭으로 이동합니다.</li>
<li>상단의 <strong>제한 없음</strong> 드롭다운을 클릭하고, <strong>느린 4G</strong>를 선택합니다.</li>
<li>페이지를 새로고침하면 "불러오는 중..." 메시지가 눈에 띄게 표시되어 로딩 UI를 확인하기 쉽습니다.</li>
</ol>

<img src="${ch3NetworkImg}" alt="개발자 도구 네트워크 탭에서 느린 4G로 속도 제한 설정" style="max-width:100%;border-radius:8px;margin:1rem 0;" />

${h2('step5-create-post', 'Step 5: 글 작성 기능')}

<p>글 작성 페이지(<code>/blog/new</code>)를 만들고, <code>createPost</code> Server Action과 <code>PostForm</code>을 적용합니다. 전체 흐름은 다음과 같습니다:</p>

<ol>
<li>사용자가 제목과 slug를 입력하고 폼을 제출</li>
<li>Server Action이 서버에서 유효성 검사 후 json-server에 데이터 저장</li>
<li><code>redirect('/blog')</code>로 목록 페이지로 이동하면 새 글이 표시됨</li>
</ol>

<h3>Server Action 정의</h3>

<pre><code class="language-tsx">// app/actions.ts
'use server';

import { redirect } from 'next/navigation';

export async function createPost(
  prevState: { error: string | null },
  formData: FormData
) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;

  if (title.length &lt; 2) {
    return { error: '제목은 2글자 이상이어야 합니다.' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.' };
  }

  await fetch('http://localhost:4000/posts', {
    method: 'POST',
    body: JSON.stringify({ title, slug }),
    headers: { 'Content-Type': 'application/json' },
  });

  redirect('/blog');
}</code></pre>

<p>유효성 검사에 실패하면 에러 객체를 반환하여 폼에 메시지를 표시하고, 성공하면 json-server에 저장한 뒤 목록 페이지로 이동합니다.</p>

${titleBox('neutral', 'revalidatePath가 없는 이유', 'Server Action 예제에서 <code>revalidatePath</code>를 사용하지 않는 이유가 궁금할 수 있습니다. Step 2~3에서 작성한 <code>fetch</code> 코드를 다시 보면, 별도의 캐시 옵션(<code>cache</code>, <code>next.revalidate</code>)을 설정하지 않았습니다. Next.js 15부터 <code>fetch</code>의 기본 동작은 <a href="https://nextjs.org/blog/next-15#caching-semantics" target="_blank" rel="noopener noreferrer"><strong>캐시하지 않음</strong>(<code>no-store</code>)</a>이므로, 페이지에 접속할 때마다 항상 최신 데이터를 가져옵니다. 따라서 <code>redirect(\'/blog\')</code>만으로 새 글이 반영된 목록을 볼 수 있습니다.')}

<h3>PostForm 클라이언트 컴포넌트</h3>

<pre><code class="language-tsx">// app/components/PostForm.tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/app/actions';

export default function PostForm() {
  const [state, formAction, isPending] = useActionState<
    { error: string | null },
    FormData
  >(createPost, { error: null });

  return (
    &lt;form action={formAction}&gt;
      &lt;div&gt;
        &lt;label htmlFor="title"&gt;제목&lt;/label&gt;
        &lt;input id="title" name="title" placeholder="제목을 입력하세요" /&gt;
      &lt;/div&gt;
      &lt;div&gt;
        &lt;label htmlFor="slug"&gt;Slug&lt;/label&gt;
        &lt;input id="slug" name="slug" placeholder="slug를 입력하세요" /&gt;
      &lt;/div&gt;
      {state.error &amp;&amp; (
        &lt;p style={{ color: 'red' }}&gt;{state.error}&lt;/p&gt;
      )}
      &lt;button type="submit" disabled={isPending}&gt;
        {isPending ? '작성 중...' : '작성하기'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<p><code>useActionState</code>가 반환하는 <code>state.error</code>로 서버의 검사 결과를 바로 표시하고, <code>isPending</code>으로 제출 중 버튼을 비활성화합니다. 세션 5에서 배운 패턴을 그대로 적용한 것입니다.</p>

<h3>글 목록 페이지에 링크 추가</h3>

<p>글 목록 페이지에서 글 작성 페이지로 이동할 수 있도록 링크를 추가합니다:</p>

<pre><code class="language-tsx" data-line="8">export default async function Blog() {
  ...

  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;SearchablePostList posts={posts} /&gt;
      &lt;Link href="/blog/new"&gt;새 글 작성&lt;/Link&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>글 작성 페이지</h3>

<pre><code class="language-tsx">// app/blog/new/page.tsx
import PostForm from '@/app/components/PostForm';

export default function NewPost() {
  return (
    &lt;div&gt;
      &lt;h1&gt;새 글 작성&lt;/h1&gt;
      &lt;PostForm /&gt;
    &lt;/div&gt;
  );
}</code></pre>

${titleBox('neutral', '테스트', '<code>/blog/new</code>에 접속하여 제목과 slug를 입력하고 제출합니다. 글 목록에 새 글이 표시되면 성공입니다. slug에 한글이나 공백을 입력하면 에러 메시지가 표시되는 것도 확인해 보세요.')}

${h2('step6-review-project-structure', 'Step 6: 최종 프로젝트 구조 점검')}

<p>Ch.2에서 Ch.3으로 넘어오면서 프로젝트가 어떻게 변했는지 전체 구조를 확인합니다:</p>

<pre><code class="language-text">app/
├── about/
│   └── page.tsx                [서버] 소개 페이지
├── blog/
│   ├── [slug]/
│   │   └── page.tsx            [서버] fetch로 글 상세 조회
│   ├── new/
│   │   └── page.tsx            [서버] PostForm import
│   ├── layout.tsx              [서버] 블로그 레이아웃
│   ├── loading.tsx             자동 로딩 UI
│   └── page.tsx                [서버] fetch로 글 목록 조회
├── components/
│   ├── CategorySidebar.tsx     [클라이언트] 카테고리 사이드바
│   ├── LikeButton.tsx          [클라이언트] 좋아요 버튼
│   ├── PostForm.tsx            [클라이언트] useActionState + 폼
│   └── SearchablePostList.tsx  [클라이언트] 검색 + 목록 표시
├── actions.ts                  [서버] 'use server' - createPost
├── layout.tsx                  [서버] 루트 레이아웃
└── page.tsx                    [서버] 홈 페이지
db.json                         json-server 데이터</code></pre>

<h3>이 챕터에서 적용한 개념들</h3>

<table>
<thead>
<tr><th>실습 단계</th><th>적용한 Ch.3 개념</th><th>관련 세션</th></tr>
</thead>
<tbody>
<tr><td>json-server 설정</td><td>외부 데이터 소스 구축</td><td>세션 1</td></tr>
<tr><td>글 목록 fetch</td><td>서버 컴포넌트에서 async/await</td><td>세션 1</td></tr>
<tr><td>글 상세 fetch</td><td>동적 라우트 + 서버 fetching</td><td>세션 2</td></tr>
<tr><td>loading.tsx</td><td>Streaming과 로딩 UI</td><td>세션 3</td></tr>
<tr><td>글 작성 폼</td><td>Server Actions + useActionState</td><td>세션 5</td></tr>
</tbody>
</table>

${h2('ch3-wrap-up', 'Ch.3 학습 정리')}

<p>이번 챕터에서는 하드코딩되어 있던 블로그 데이터를 외부로 옮기고, 데이터를 다루는 전체 흐름을 배웠습니다:</p>

<table>
<thead>
<tr><th style="width:15%">세션</th><th style="width:30%">질문</th><th style="width:60%">핵심 개념</th></tr>
</thead>
<tbody>
<tr><td>1. 데이터 소스</td><td>데이터는 어디서 가져오지?</td><td>서버 컴포넌트의 async/await으로 직접 데이터 접근 (fetch, DB, 파일)</td></tr>
<tr><td>2. 렌더링 전략</td><td>화면은 언제 만들지?</td><td>정적 렌더링이 기본, 동적 함수 사용 시 자동 전환</td></tr>
<tr><td>3. 로딩 처리</td><td>느린 데이터는 어떻게?</td><td>loading.tsx(페이지 전체) → Suspense(부분 로딩), Streaming</td></tr>
<tr><td>4. 캐싱</td><td>매번 새로 가져와야 하나?</td><td>fetch 캐싱 옵션, 시간/요청 기반 재검증</td></tr>
<tr><td>5. 데이터 변경</td><td>데이터를 수정하려면?</td><td>'use server' + form action, useActionState(에러·로딩 처리)</td></tr>
<tr><td>6. 블로그 실습</td><td>실제로 적용하면?</td><td>json-server, fetch 연동, 폼 완성</td></tr>
</tbody>
</table>

${titleBox('info', '다음 챕터 예고', '다음 챕터에서는 <strong>내비게이션</strong>의 심화 내용을 배웁니다. <code>&lt;Link&gt;</code>의 동작 원리, <code>usePathname</code>, <code>useSearchParams</code>, <code>useRouter</code> 등 URL 기반 상태 관리를 배우고, Ch.1~4의 모든 개념을 종합하여 블로그를 고도화하는 실습을 진행합니다.')}
          `,
        },
      ],
    };
