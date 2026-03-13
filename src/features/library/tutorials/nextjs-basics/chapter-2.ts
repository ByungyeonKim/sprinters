import nextJsBasicModuleImg from '../../../../assets/next-js-basic-module.webp';
import { box, h2, titleBox } from '../shared/content-helpers';

export default {
  title: 'Server / Client Component',
  sessions: [
    {
      title: '서버 컴포넌트와 클라이언트 컴포넌트',
      content: `
${h2('why-split-into-server-and-client', '왜 컴포넌트를 서버와 클라이언트로 나눌까?')}
<p>Ch.1에서 우리는 CSR의 문제를 살펴보았습니다. 빈 HTML, 큰 번들, API 키 노출... 이 문제들을 해결하려면 <strong>서버가 필요</strong>하다는 결론에 도달했죠. 서버가 해결책이라면, 극단적으로 모든 것을 서버에서 처리하는 게 최선처럼 보일 수도 있습니다:</p>

${box('info', '<strong>"모든 컴포넌트를 서버에서 실행하면 되지 않을까?"</strong>')}

<p>그러면 번들 사이즈 문제도, API 키 노출 문제도 한꺼번에 해결됩니다. 하지만 <strong>서버에서는 할 수 없는 일</strong>이 있습니다:</p>
<ul>
<li>버튼 클릭에 반응하기 (<code>onClick</code>)</li>
<li>입력 폼의 값을 추적하기 (<code>useState</code>)</li>
<li>브라우저 API 사용하기 (<code>localStorage</code>, <code>window</code> 등)</li>
</ul>
<p>이것들이 불가능한 이유는 단순합니다. 서버 컴포넌트의 코드는 서버에서만 실행되고 브라우저에는 <strong>실행 결과만 전달</strong>되기 때문입니다. 코드 자체가 브라우저에 존재하지 않으니, 클릭에 반응하거나 상태를 유지하는 것은 원천적으로 불가능합니다. 그래서 React는 컴포넌트를 두 종류로 나눕니다: <strong>서버 컴포넌트</strong>와 <strong>클라이언트 컴포넌트</strong>.</p>

${h2('what-are-server-components', '서버 컴포넌트')}
<p>App Router에서 모든 컴포넌트는 <strong>기본적으로 서버 컴포넌트</strong>입니다. 아무 지시어도 붙이지 않으면 서버에서 실행됩니다.</p>

${box(
  `info`,
  `<strong>SSR과 서버 컴포넌트는 다릅니다</strong><br/>
<strong>SSR</strong>(Server-Side Rendering)은 HTML을 서버에서 미리 만들어 보내는 렌더링 전략입니다. <strong>서버 컴포넌트</strong>(RSC)는 특정 컴포넌트의 코드를 아예 클라이언트 번들에서 제외할 수 있는 컴포넌트 실행 모델입니다. 실제로 Next.js에서는 클라이언트 컴포넌트도 초기 요청은 서버에서 prerender되어 HTML에 포함될 수 있고, 이후 브라우저가 hydrate와 리렌더링을 담당합니다. 렌더링 전략에 대한 자세한 내용은 Ch.3에서 다룹니다.`,
)}

<h3>핵심 특성 3가지</h3>

<h4>1. 브라우저에 JavaScript를 보내지 않는다</h4>
<p>서버 컴포넌트의 코드는 <strong>클라이언트 번들에 포함되지 않습니다</strong>. 서버에서 실행된 뒤 결과만 클라이언트에 전달되며, 브라우저에서 다시 실행되지 않습니다. (React 자체가 사라지는 것이 아니라, <strong>이 컴포넌트의 코드</strong>가 번들에서 빠지는 것입니다.) 브라우저가 파싱하고 실행할 JS가 줄어들수록 초기 인터랙션은 빨라집니다. 그래서 "기본은 서버 컴포넌트"라는 설계가 성능 관점에서 합리적입니다.</p>
<pre><code class="language-tsx">// app/blog/page.tsx - 서버 컴포넌트 (기본값)
// 이 코드는 서버에서만 실행됩니다. 브라우저에 JS가 전송되지 않습니다.
import { marked } from 'marked'; // 서버 컴포넌트에서만 쓰이면 번들에 포함되지 않음

const posts = [
  {
    id: 1,
    title: 'Next.js 시작하기',
    body: '## 소개\\nNext.js는 **React 기반** 풀스택 프레임워크입니다.',
  },
  {
    id: 2,
    title: 'React 서버 컴포넌트',
    body: '## 개요\\nRSC는 서버에서만 실행되는 *새로운 유형*의 컴포넌트입니다.',
  },
];

export default function Blog() {
  return (
    &lt;main&gt;
      &lt;h1&gt;블로그&lt;/h1&gt;
      {posts.map(post =&gt; (
        &lt;article key={post.id}&gt;
          &lt;h2&gt;{post.title}&lt;/h2&gt;
          &lt;div dangerouslySetInnerHTML={{ __html: marked(post.body) }} /&gt;
        &lt;/article&gt;
      ))}
    &lt;/main&gt;
  );
}</code></pre>

<h4>2. 서버 자원에 직접 접근할 수 있다</h4>
<p>데이터베이스, 파일 시스템, 환경 변수 등 서버 자원에 <strong>직접</strong> 접근할 수 있습니다. CSR에서는 브라우저 → API 라우트 → 데이터베이스로 이어지는 우회 경로가 필수였지만, 서버 컴포넌트는 데이터가 있는 곳에서 바로 실행되므로 <strong>중간 API 계층이 사라집니다</strong>. 민감 정보 역시 서버에만 머물고, 클라이언트에는 렌더링 결과만 전달되므로 노출 위험이 없습니다.</p>
<pre><code class="language-tsx">// 서버 컴포넌트에서는 이런 것들이 가능합니다
import { readFile } from 'fs/promises';
import { db } from '@/lib/database';

export default async function Page() {
  // 파일 시스템 접근
  const content = await readFile('./data/posts.json', 'utf-8');

  // 데이터베이스 직접 쿼리
  const users = await db.query('SELECT * FROM users');

  // 환경 변수 (민감 정보도 안전)
  const apiKey = process.env.SECRET_API_KEY; // 클라이언트에 노출 안 됨

  return &lt;div&gt;{/* ... */}&lt;/div&gt;;
}</code></pre>

${box('info', '<strong>참고:</strong> 데이터 fetching의 구체적인 패턴은 Ch.3에서 자세히 다룹니다. 이 챕터에서는 "서버에서 실행되기 때문에 가능하다"는 점만 기억하세요.')}

<h4>3. 인터랙션은 불가능하다</h4>
<p>서버 컴포넌트는 서버에서 렌더링될 때만 실행되며, 그 실행 결과가 브라우저로 전달됩니다. 즉 서버 컴포넌트의 코드는 <strong>브라우저에서 동작하지 않으므로</strong>, 브라우저에서 유지되는 상태(useState 등)나 클릭 같은 DOM 이벤트에 직접 반응할 수 없습니다. 사용자 인터랙션이 필요한 UI는 클라이언트 컴포넌트로 분리해야 하며, 이를 명시적으로 표시하기 위해 <code>'use client'</code> 지시어가 존재합니다.</p>
<pre><code class="language-tsx">// ❌ 서버 컴포넌트에서 이것들은 동작하지 않습니다
export default function ServerComponent() {
  // ❌ useState - 클라이언트 상태
  const [count, setCount] = useState(0);

  // ❌ useEffect - 브라우저에서 실행되는 사이드이펙트
  useEffect(() =&gt; { /* ... */ }, []);

  // ❌ onClick - 브라우저 이벤트
  return &lt;button onClick={() =&gt; alert('클릭!')}&gt;버튼&lt;/button&gt;;
}</code></pre>

${h2('what-are-client-components', '클라이언트 컴포넌트')}
<p>파일 최상단에 <code>'use client'</code> 지시어를 추가하면 클라이언트 컴포넌트가 됩니다. 이것은 기존 React 컴포넌트와 동일합니다.</p>

<pre><code class="language-tsx">'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      클릭 횟수: {count}
    &lt;/button&gt;
  );
}</code></pre>

${titleBox('warn', '클라이언트 컴포넌트 ≠ "나쁜 것"', '클라이언트 컴포넌트가 없으면 사용자와의 상호작용이 불가능합니다. 버튼, 폼, 토글, 모달 - 모두 클라이언트 컴포넌트가 필요합니다. "서버가 좋고 클라이언트가 나쁜 것"이 아니라, <strong>각자의 역할이 다를 뿐</strong>입니다.')}

${h2('server-first-mental-model', '멘탈 모델: 서버가 기본, 클라이언트는 필요할 때만')}
<p>App Router에서의 사고방식은 이렇습니다:</p>
<pre><code class="language-text">1. 새 컴포넌트를 만든다
2. 인터랙션이 필요한가? (클릭, 입력, 상태 등)
   ├── 아니오 → 서버 컴포넌트 (아무것도 안 해도 됨)
   └── 예   → 'use client' 추가</code></pre>

<p>기존 React에서는 컴포넌트가 기본적으로 브라우저에서 실행된다는 전제가 익숙해서, Next.js(App Router)의 방식이 처음엔 낯설 수 있습니다. 하지만 핵심은 간단합니다. App Router에서는 기본이 서버 컴포넌트이고, 상태 유지나 클릭 같은 인터랙션이 필요한 컴포넌트에만 파일 상단에 <code>'use client'</code>를 선언해 클라이언트 컴포넌트로 전환하면 됩니다.</p>

<h3>Ch.1의 BlogLayout을 다시 살펴봅시다</h3>
<p>Ch.1의 마지막 실습에서 우리는 이런 코드를 작성했습니다:</p>
<pre><code class="language-tsx">'use client';  // ← 레이아웃 전체가 클라이언트 컴포넌트

import { useState } from 'react';

export default function BlogLayout({
  children,
}: Readonly&lt;{ children: React.ReactNode }&gt;) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    &lt;&gt;
      &lt;aside&gt;
        &lt;button onClick={() =&gt; setIsOpen(!isOpen)}&gt;
          카테고리 {isOpen ? '닫기' : '열기'}
        &lt;/button&gt;
        {isOpen &amp;&amp; (
          &lt;ul&gt;
            &lt;li&gt;React&lt;/li&gt;
            &lt;li&gt;Next.js&lt;/li&gt;
            &lt;li&gt;TypeScript&lt;/li&gt;
          &lt;/ul&gt;
        )}
      &lt;/aside&gt;
      {children}
    &lt;/&gt;
  );
}</code></pre>
<p>이 코드의 문제는 무엇일까요? <code>useState</code>가 필요한 것은 카테고리 토글 버튼뿐인데, <strong>레이아웃 전체</strong>에 <code>'use client'</code>를 붙였습니다. 이렇게 하면 레이아웃의 코드 전부가 클라이언트 번들에 포함됩니다.</p>

${h2('server-vs-client-comparison', '비교 테이블: 서버 vs 클라이언트 컴포넌트')}
<table>
<thead><tr><th></th><th>서버 컴포넌트</th><th>클라이언트 컴포넌트</th></tr></thead>
<tbody>
<tr><td><strong>지시어</strong></td><td>없음 (기본값)</td><td><code>'use client'</code></td></tr>
<tr><td><strong>실행 위치</strong></td><td>서버 렌더링에서만</td><td>초기 요청 시 prerender + 브라우저(hydration/재렌더)</td></tr>
<tr><td><strong>JS 번들</strong></td><td>포함 안 됨</td><td>포함됨</td></tr>
<tr><td><strong>상태 (useState)</strong></td><td>❌</td><td>✅</td></tr>
<tr><td><strong>이벤트 (onClick)</strong></td><td>❌</td><td>✅</td></tr>
<tr><td><strong>useEffect</strong></td><td>❌</td><td>✅</td></tr>
<tr><td><strong>서버 자원 접근</strong></td><td>✅ (DB, 파일 등)</td><td>❌</td></tr>
<tr><td><strong>async/await</strong></td><td>✅ (컴포넌트 자체가 async 가능)</td><td>❌ (컴포넌트 자체는 불가)</td></tr>
<tr><td><strong>브라우저 API</strong></td><td>❌</td><td>✅ (window, localStorage 등)</td></tr>
</tbody>
</table>

<p>다음 세션에서는 <code>'use client'</code>가 만드는 <strong>경계</strong>가 무엇이고, 이 경계를 컴포넌트 트리에서 어디에 배치해야 하는지 학습합니다.</p>
          `,
    },
    {
      title: "'use client' 경계와 컴포넌트 설계",
      content: `
${h2(`use-client-creates-boundary`, `'use client'는 "경계"를 만든다`)}
<img src="${nextJsBasicModuleImg}" alt="use client 경계와 모듈 의존성 트리" style="width:100%;aspect-ratio:2752/1536;border-radius:8px;margin:1rem 0;" />
<p><code>'use client'</code>를 단순히 "이 파일을 클라이언트에서 실행해라"로 이해하면 절반만 맞습니다. 정확한 의미는 이렇습니다:</p>

${box('info', '<strong>"이 지점이 클라이언트 경계가 되며, 이 파일이 import하는 모듈들은 클라이언트 번들에 포함된다"</strong>')}

<p><code>'use client'</code>는 파일 단위가 아니라 <strong><a href="https://ko.react.dev/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree" target="_blank" rel="noopener noreferrer">모듈 의존성 트리</a>의 경계</strong>를 만듭니다. 이 경계 아래에서 import된 모든 모듈은, 그 모듈에 <code>'use client'</code>가 없더라도 클라이언트 번들에 포함됩니다.</p>

<h3>경계 전파 규칙</h3>
<pre><code class="language-text">모듈 의존성 트리에서의 import 규칙:

서버 컴포넌트
  ├── import 서버 컴포넌트  ✅ (당연히 가능)
  ├── import 클라이언트 컴포넌트  ✅ (가능 - 경계 생성)
  └── 서버 → 클라이언트 혼합 가능

클라이언트 컴포넌트 ('use client' 경계 아래)
  ├── import 클라이언트 컴포넌트  ✅ (당연히 가능)
  └── import 서버 컴포넌트  ❌ (불가능 - 이미 클라이언트 영역)</code></pre>

<p>핵심 규칙은 하나입니다: <strong>클라이언트 컴포넌트가 import한 것은 모두 클라이언트가 된다.</strong></p>

<p>예시로 살펴봅시다:</p>
<pre><code class="language-tsx">// utils/format.ts - 'use client' 없음
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR');
}</code></pre>

<pre><code class="language-tsx">'use client';

import { formatDate } from '@/utils/format';
// ↑ format.ts에 'use client'가 없지만,
//   클라이언트 컴포넌트에서 import했으므로 클라이언트 번들에 포함됨

export default function PostDate({ date }: { date: string }) {
  return &lt;time&gt;{formatDate(date)}&lt;/time&gt;;
}</code></pre>

${h2('push-boundary-to-leaves', "설계 원칙: 'use client' 경계는 가능한 한 컴포넌트 트리의 끝에 배치한다")}
<p><code>'use client'</code> 경계가 트리 위쪽에 있을수록 더 많은 코드가 클라이언트 번들에 포함됩니다. 반대로 경계를 <strong>가능한 한 컴포넌트 트리의 끝(leaf) 가까이</strong> 내려놓으면 서버 컴포넌트의 이점을 최대로 살릴 수 있습니다.</p>

${box(
  `warn`,
  `<p style="margin:0 0 0.5rem;"><strong>모듈 의존성 트리와 컴포넌트 트리는 무엇이 다른가요?</strong></p>
<p style="margin:0;"><strong>모듈 의존성 트리</strong>는 파일 간 import 관계로 이루어진 의존성 구조입니다. 어떤 파일이 어떤 파일을 import하는지를 기준으로 번들러가 모듈들을 연결합니다. <strong>컴포넌트 트리</strong>는 React가 실행될 때 JSX를 기반으로 만들어지는 컴포넌트 계층 구조입니다.</p>`,
)}

<h3>Before: 전체 레이아웃이 클라이언트</h3>
<pre><code class="language-text">BlogLayout ('use client')      ← 경계가 최상단에!
  ├── 사이드바 (카테고리 목록)      → 클라이언트 번들에 포함
  ├── 토글 버튼 (useState)       → 클라이언트 번들에 포함
  └── children (하위 페이지)     → props로 전달되므로 서버 컴포넌트 유지 가능</code></pre>
<p>Ch.1에서 만든 블로그 레이아웃은 <code>useState</code> 하나 때문에 전체가 클라이언트 컴포넌트가 되었습니다.</p>

<h3>After: 인터랙션 부분만 분리</h3>
<pre><code class="language-text">BlogLayout (서버 컴포넌트)              ← 서버에서 실행
  ├── CategorySidebar ('use client') ← 인터랙션이 필요한 부분만
  │     ├── 토글 버튼 (useState)
  │     └── 카테고리 목록
  └── children (하위 페이지)            ← 서버 컴포넌트 유지 가능</code></pre>

<p>코드로 비교해 봅시다:</p>
<pre><code class="language-tsx">// components/CategorySidebar.tsx
'use client';

import { useState } from 'react';

const categories = ['React', 'Next.js', 'TypeScript'];

export default function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    &lt;aside className="w-60 p-4 border-r"&gt;
      &lt;button onClick={() =&gt; setIsOpen(!isOpen)}&gt;
        카테고리 {isOpen ? '▲' : '▼'}
      &lt;/button&gt;
      {isOpen &amp;&amp; (
        &lt;ul&gt;
          {categories.map(cat =&gt; (
            &lt;li key={cat}&gt;{cat}&lt;/li&gt;
          ))}
        &lt;/ul&gt;
      )}
    &lt;/aside&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/blog/layout.tsx - 서버 컴포넌트로 유지!
import CategorySidebar from '@/components/CategorySidebar';

export default function BlogLayout({
  children,
}: Readonly&lt;{ children: React.ReactNode }&gt;) {
  return (
    &lt;div className="flex"&gt;
      &lt;CategorySidebar /&gt;
      &lt;main className="flex-1 p-6"&gt;{children}&lt;/main&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>이제 <code>BlogLayout</code>은 서버 컴포넌트로 유지되고, <code>'use client'</code> 경계는 정말 인터랙션이 필요한 <code>CategorySidebar</code>에만 적용됩니다.</p>

${h2('decision-flowchart', '판단 플로우차트')}
<p>새 컴포넌트를 만들 때 이 흐름을 따르세요:</p>
<pre><code class="language-text">새 컴포넌트를 만든다
  │
  ├─ onClick, onChange 등 이벤트 핸들러가 필요한가?
  │    └─ Yes → 'use client'
  │
  ├─ useState, useReducer 등 상태가 필요한가?
  │    └─ Yes → 'use client'
  │
  ├─ useEffect, useRef 등 브라우저 Hook이 필요한가?
  │    └─ Yes → 'use client'
  │
  ├─ window, document 등 브라우저 API가 필요한가?
  │    └─ Yes → 'use client'
  │
  └─ 위 모두 아니다
       └─ 서버 컴포넌트로 유지 (아무것도 안 함)</code></pre>

${titleBox('warn', '컴포넌트가 커지면? 분리하라', '하나의 컴포넌트가 "데이터 표시 + 인터랙션"을 모두 담고 있다면, <strong>인터랙션 부분만 별도 클라이언트 컴포넌트로 분리</strong>하세요. 나머지는 서버 컴포넌트로 유지할 수 있습니다. 이것이 "경계를 트리 끝으로 내리는" 핵심 전략입니다.')}

${h2('use-client-summary', '정리')}
<table>
<thead><tr><th>개념</th><th>핵심 내용</th></tr></thead>
<tbody>
<tr><td><code>'use client'</code>의 의미</td><td>이 파일과 아래 모든 import를 클라이언트 번들에 포함</td></tr>
<tr><td>경계 전파</td><td>클라이언트가 import한 모듈은 모두 클라이언트가 됨</td></tr>
<tr><td>설계 원칙</td><td>경계를 가능한 한 컴포넌트 트리의 끝에 배치하기</td></tr>
<tr><td>리팩터링 전략</td><td>인터랙션이 필요한 부분만 별도 컴포넌트로 분리</td></tr>
</tbody>
</table>

<p>그런데 서버 컴포넌트와 클라이언트 컴포넌트를 함께 쓸 때 주의해야 할 제약이 있습니다. 다음 세션에서는 <strong>children/props로 서버 컴포넌트를 전달하는 방법</strong>과 <strong>직렬화 경계</strong>를 학습합니다.</p>
          `,
    },
    {
      title: 'children/props 전달과 직렬화 경계',
      content: `
${h2('cannot-import-server-in-client', '클라이언트에서 서버 컴포넌트를 import할 수 없다')}
<p>이전 세션에서 배운 규칙을 다시 떠올려 봅시다: <strong>클라이언트 컴포넌트가 import한 것은 모두 클라이언트가 된다.</strong></p>
<p>그렇다면 클라이언트 컴포넌트 파일에서 서버 컴포넌트를 import하면 어떻게 될까요?</p>

<pre><code class="language-tsx">'use client';

import ServerComponent from './ServerComponent';
// ⚠️ ServerComponent가 서버 전용 코드(DB 접근 등)를 사용한다면 에러가 발생합니다.
// 서버 전용 기능이 없더라도 클라이언트 번들에 포함되어 서버 컴포넌트의 이점을 잃습니다.

export function ClientWrapper() {
  return (
    &lt;div&gt;
      &lt;ServerComponent /&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>서버 컴포넌트가 DB 접근, 파일 시스템 읽기 등 서버 전용 기능을 사용한다면 클라이언트에서 실행될 수 없으므로 에러가 발생합니다. 서버 전용 기능을 쓰지 않더라도, 클라이언트에서 import하는 순간 해당 코드는 클라이언트 번들에 포함되어 브라우저에서 실행되는 코드로 취급됩니다.</p>

<p>그렇다면 "서버 컴포넌트에서 생성된 콘텐츠를 클라이언트 컴포넌트 안에 넣고 싶을 때"는 어떻게 해야 할까요?</p>

${h2('children-composition-pattern', 'children이나 props로 서버 컴포넌트 전달하기')}
<p>해답은 <strong>import 대신 children(또는 다른 prop)으로 전달</strong>하는 것입니다.</p>

<pre><code class="language-text">import vs children 차이:

❌ import (클라이언트가 서버를 "끌어들임")
  ClientComponent.tsx  →  import ServerComponent  →  ⚠️ 클라이언트로 취급됨

✅ children (서버가 결과를 "건네줌")
  ServerParent.tsx
    └── &lt;ClientComponent&gt;
          &lt;ServerComponent /&gt;   ← children으로 전달
        &lt;/ClientComponent&gt;</code></pre>

<p>이것을 <strong>"택배 상자"</strong>로 비유할 수 있습니다: 클라이언트 컴포넌트는 <strong>택배 상자</strong>입니다. 열기, 닫기, 옮기기 같은 인터랙션을 담당하죠. 서버 컴포넌트의 렌더링 결과는 서버에서 미리 만들어진 <strong>상품</strong>입니다. 그리고 이 상품을 상자에 넣는 건 <strong>물류센터(ServerParent)</strong>가 합니다. 택배 상자는 안에 뭐가 들었는지 알 필요 없이, 그냥 담아서 배송하면 됩니다.</p>

<pre><code class="language-tsx">// components/InteractiveWrapper.tsx
'use client';

import { useState } from 'react';

export function InteractiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setIsVisible(!isVisible)}&gt;
        {isVisible ? '숨기기' : '보이기'}
      &lt;/button&gt;
      {isVisible &amp;&amp; children}
      {/* ↑ children이 서버 컴포넌트여도 OK! */}
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/page.tsx - 서버 컴포넌트
import { InteractiveWrapper } from './components/InteractiveWrapper';
import HeavyContent from './components/HeavyContent'; // 서버 컴포넌트

export default function Home() {
  return (
    &lt;InteractiveWrapper&gt;
      &lt;HeavyContent /&gt;
      {/* ↑ 서버에서 렌더링된 결과가 children으로 전달됨 */}
    &lt;/InteractiveWrapper&gt;
  );
}</code></pre>

${h2('provider-pattern', '실전 패턴 1: Provider 패턴')}
<p>전역 상태나 테마를 제공하는 Provider는 보통 Context API를 사용하므로 클라이언트 컴포넌트여야 합니다. 하지만 Provider 아래의 모든 페이지가 클라이언트가 되면 안 되겠죠?</p>

<pre><code class="language-tsx">// providers/ThemeProvider.tsx
'use client';

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext&lt;{
  theme: 'light' | 'dark';
  toggle: () =&gt; void;
}&gt;({ theme: 'light', toggle: () =&gt; {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState&lt;'light' | 'dark'&gt;('light');
  const toggle = () =&gt; setTheme(t =&gt; (t === 'light' ? 'dark' : 'light'));

  return (
    &lt;ThemeContext.Provider value={{ theme, toggle }}&gt;
      &lt;div data-theme={theme}&gt;{children}&lt;/div&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/layout.tsx - 서버 컴포넌트
import { ThemeProvider } from './providers/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;html lang="ko"&gt;
      &lt;body&gt;
        &lt;ThemeProvider&gt;
          {children}
          {/* ↑ children은 서버 컴포넌트 → 번들에 포함 안 됨 */}
        &lt;/ThemeProvider&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

<p><code>ThemeProvider</code>는 클라이언트 컴포넌트이지만, <code>children</code>으로 전달된 페이지 컴포넌트들은 여전히 서버 컴포넌트로 유지됩니다. Provider가 children을 <strong>import하지 않고 slot으로 받기</strong> 때문입니다.</p>

${h2('interactive-wrapper-pattern', '실전 패턴 2: 인터랙티브 래퍼 패턴')}
<p>스크롤 애니메이션, 드래그 앤 드롭 등 인터랙션이 필요하지만 내부 콘텐츠는 서버에서 렌더링하고 싶을 때 사용합니다.</p>

<pre><code class="language-tsx">// components/Accordion.tsx
'use client';

import { useState } from 'react';

export function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    &lt;div className="border rounded-lg"&gt;
      &lt;button
        className="w-full p-4 text-left font-bold"
        onClick={() =&gt; setIsOpen(!isOpen)}
      &gt;
        {title} {isOpen ? '▲' : '▼'}
      &lt;/button&gt;
      {isOpen &amp;&amp; (
        &lt;div className="p-4 border-t"&gt;{children}&lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/faq/page.tsx - 서버 컴포넌트
import { Accordion } from './components/Accordion';

// 서버에서만 사용하는 데이터
const faqs = [
  { question: 'Next.js란?', answer: 'React 기반 풀스택 프레임워크입니다.' },
  { question: 'App Router란?', answer: '파일 기반 라우팅 시스템입니다.' },
];

export default function FAQ() {
  return (
    &lt;main&gt;
      &lt;h1&gt;자주 묻는 질문&lt;/h1&gt;
      {faqs.map(faq =&gt; (
        &lt;Accordion key={faq.question} title={faq.question}&gt;
          &lt;p&gt;{faq.answer}&lt;/p&gt;
        &lt;/Accordion&gt;
      ))}
    &lt;/main&gt;
  );
}</code></pre>

${h2('serialization-boundary', '직렬화 경계: 서버 → 클라이언트 props 제약')}
<p>서버 컴포넌트에서 클라이언트 컴포넌트로 props를 전달할 때, <strong>React가 직렬화 가능한 값</strong>만 전달할 수 있습니다. 다만 <code>'use server'</code>로 선언한 Server Action(Server Function)은 함수 형태라도 예외적으로 전달할 수 있습니다.</p>

<table>
<thead><tr><th>전달 가능 ✅</th><th>전달 불가 ❌</th></tr></thead>
<tbody>
<tr><td>문자열, 숫자, bigint, 불리언</td><td>일반 함수 (콜백, 이벤트 핸들러)</td></tr>
<tr><td>배열, 일반 객체, Promise</td><td>클래스 인스턴스</td></tr>
<tr><td>null, undefined, 전역 Symbol(<code>Symbol.for</code>)</td><td>임의로 만든 Symbol</td></tr>
<tr><td>Date, Map, Set</td><td></td></tr>
<tr><td>JSX (React 엘리먼트), Server Action</td><td></td></tr>
</tbody>
</table>

<pre><code class="language-tsx">// ❌ 함수를 prop으로 전달하면 에러
// app/page.tsx (서버 컴포넌트)
import { ClientButton } from './components/ClientButton';

export default function Home() {
  const handleClick = () =&gt; console.log('클릭!');
  //                    ↑ 일반 함수는 직렬화 불가능

  return &lt;ClientButton onClick={handleClick} /&gt;;
  //                    ↑ ❌ 에러: 일반 함수를 서버→클라이언트로 전달 불가
}</code></pre>

<pre><code class="language-tsx">// ✅ 해결: 클라이언트 컴포넌트 내부에서 함수를 정의
// components/ClientButton.tsx
'use client';

export function ClientButton() {
  const handleClick = () =&gt; console.log('클릭!');
  //                    ↑ 클라이언트 컴포넌트 안에서 정의하면 OK

  return &lt;button onClick={handleClick}&gt;클릭&lt;/button&gt;;
}</code></pre>

${h2('common-mistakes-and-errors', '흔한 실수와 에러 메시지')}

<h3>실수 1: 서버 컴포넌트에서 Hook 사용</h3>
<pre><code class="language-tsx">// ❌ app/page.tsx (서버 컴포넌트)
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  // Error: useState only works in Client Components.
  // Add the "use client" directive at the top of the file.
  return &lt;div&gt;{count}&lt;/div&gt;;
}</code></pre>
<pre><code class="language-text">에러 메시지:
You're importing a component that needs \`useState\`. This React Hook only works in a
Client Component. To fix, mark the file (or its parent) with the \`"use client"\` directive.</code></pre>
<p><strong>해결:</strong> 파일 최상단에 <code>'use client'</code>를 추가하거나, 상태가 필요한 부분만 별도 클라이언트 컴포넌트로 분리하세요.</p>

<h3>실수 2: 함수를 prop으로 전달</h3>
<pre><code class="language-tsx">// ❌ app/page.tsx (서버 컴포넌트)
import { UserList } from "./components/UserList";

export default function Home() {
  const formatName = (name: string) =&gt; name.toUpperCase();

  return &lt;UserList formatName={formatName} /&gt;;
}</code></pre>
<pre><code class="language-text">에러 메시지:
Uncaught Error: Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server". Or maybe you meant to call this
function rather than return it.</code></pre>
<p><strong>해결:</strong> 함수는 클라이언트 컴포넌트 내부에서 정의하거나, Server Action(<code>'use server'</code>)으로 만들어 전달하세요. Server Action은 Ch.3에서 다룹니다.</p>

${h2('server-only-package', 'server-only 패키지')}
<p>서버에서만 실행되어야 하는 코드가 실수로 클라이언트 번들에 포함되는 것을 <strong>빌드 시점에</strong> 차단할 수 있습니다.</p>

<pre><code class="language-shell">npm install server-only</code></pre>

<pre><code class="language-tsx">// lib/database.ts
import 'server-only';
// ↑ 이 파일을 클라이언트 컴포넌트에서 import하면 빌드 에러 발생

export async function getUsers() {
  // DB 쿼리 등 서버 전용 로직
  return [{ id: 1, name: '홍길동' }];
}</code></pre>

<p>이 파일을 클라이언트 컴포넌트에서 import하면 빌드 시점에 다음 에러가 발생합니다:</p>
<pre><code class="language-text">Error: This module cannot be imported from a Client Component module.
It should only be used from a Server Component.</code></pre>

${box('info', '<strong>언제 사용하나요?</strong> DB 접근, API 키 사용, 파일 시스템 접근 등 민감한 로직이 담긴 모듈에 추가하면 좋습니다. 실수로 클라이언트에 노출되는 것을 방지하는 안전장치입니다.')}

${h2('composition-summary', '정리')}
<table>
<thead><tr><th>패턴</th><th>핵심 아이디어</th></tr></thead>
<tbody>
<tr><td>children/props 전달</td><td>import 대신 children slot이나 다른 prop으로 서버 콘텐츠를 클라이언트 안에 배치</td></tr>
<tr><td>Provider 패턴</td><td>Provider는 클라이언트, children(페이지)은 서버 유지</td></tr>
<tr><td>인터랙티브 래퍼</td><td>인터랙션 셸은 클라이언트, 내부 콘텐츠는 서버</td></tr>
<tr><td>직렬화 제약</td><td>서버→클라이언트 props는 React가 직렬화 가능해야 함</td></tr>
<tr><td><code>server-only</code></td><td>서버 전용 코드의 클라이언트 유입을 빌드 시점에 차단</td></tr>
</tbody>
</table>

<p>다음 세션에서는 이 모든 개념을 종합하여 Ch.1의 블로그 프로젝트를 <strong>리팩터링하고 새 기능을 추가</strong>하는 실습을 진행합니다.</p>
          `,
    },
    {
      title: '블로그 인터랙션 추가 실습',
      content: `
${h2('what-we-will-build', '이번 세션에서 할 일')}
<p>Ch.1에서 만든 블로그 프로젝트에 서버/클라이언트 컴포넌트 설계를 적용합니다. 구체적으로:</p>
<ol>
<li><strong><code>BlogLayout</code> 리팩터링</strong> - 전체 클라이언트 → 서버 컴포넌트 + CategorySidebar 분리</li>
<li><strong>좋아요 버튼 추가</strong> - 서버 페이지에 클라이언트 컴포넌트 배치</li>
<li><strong>검색 기능 추가</strong> - SearchablePostList 클라이언트 컴포넌트</li>
<li><strong>최종 구조 점검</strong> - 서버/클라이언트 경계 확인</li>
</ol>

${h2('step1-refactor-blog-layout', 'Step 1: BlogLayout 리팩터링')}
<p>Ch.1의 블로그 레이아웃은 <code>useState</code> 하나 때문에 전체가 클라이언트 컴포넌트였습니다. 인터랙션이 필요한 사이드바만 분리합니다.</p>

<h3>CategorySidebar 클라이언트 컴포넌트 생성</h3>
<pre><code class="language-tsx">// app/components/CategorySidebar.tsx
'use client';

import { useState } from 'react';

export function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    &lt;&gt;
      &lt;button onClick={() =&gt; setIsOpen(!isOpen)}&gt;
        카테고리 {isOpen ? '닫기' : '열기'}
      &lt;/button&gt;
      {isOpen &amp;&amp; (
        &lt;ul&gt;
          &lt;li&gt;React&lt;/li&gt;
          &lt;li&gt;Next.js&lt;/li&gt;
          &lt;li&gt;TypeScript&lt;/li&gt;
        &lt;/ul&gt;
      )}
    &lt;/&gt;
  );
}</code></pre>

<h3>BlogLayout을 서버 컴포넌트로 전환</h3>
<pre><code class="language-tsx">// app/blog/layout.tsx - 블로그 레이아웃(이제 서버 컴포넌트)
import { CategorySidebar } from '../components/CategorySidebar';

export default function BlogLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  return (
    &lt;&gt;
      &lt;aside&gt;
        &lt;CategorySidebar /&gt;
      &lt;/aside&gt;
      {children}
    &lt;/&gt;
  );
}</code></pre>

<p>사이드바와 본문의 구분감을 위해 약간의 스타일링을 추가하겠습니다.</p>
<pre><code class="language-tsx" data-line="10-11,15">// app/blog/layout.tsx - 블로그 레이아웃(이제 서버 컴포넌트)
import { CategorySidebar } from '../components/CategorySidebar';

export default function BlogLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  return (
    &lt;section className='flex'&gt;
      &lt;aside className='pr-8 mr-8 border-r'&gt;
        &lt;CategorySidebar /&gt;
      &lt;/aside&gt;
      {children}
    &lt;/section&gt;
  );
}</code></pre>

<p>변경 전후를 비교하면:</p>
<table>
<thead><tr><th></th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td><code>BlogLayout</code></td><td>클라이언트 컴포넌트</td><td>서버 컴포넌트</td></tr>
<tr><td><code>CategorySidebar</code></td><td>레이아웃에 인라인</td><td>별도 클라이언트 컴포넌트</td></tr>
</tbody>
</table>

${h2('step2-add-like-button', 'Step 2: 좋아요 버튼 추가')}
<p>블로그 글 상세 페이지에 좋아요 버튼을 추가합니다. 페이지는 서버 컴포넌트로 유지하고, 인터랙션이 필요한 작은 컴포넌트만 클라이언트로 분리하는 구조입니다.</p>

<h3>LikeButton 클라이언트 컴포넌트</h3>
<pre><code class="language-tsx">// app/components/LikeButton.tsx
'use client';

import { useState } from 'react';

export function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    &lt;button onClick={() =&gt; setIsLiked(!isLiked)}&gt;
      {isLiked ? '❤️' : '🤍'}
    &lt;/button&gt;
  );
}</code></pre>

<h3>서버 컴포넌트 페이지에서 사용</h3>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx - 글 상세 페이지(서버 컴포넌트)
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

<p>페이지 자체는 서버 컴포넌트로 렌더링되고, 브라우저에서 실행되는 인터랙션 코드는 <code>LikeButton</code> 컴포넌트뿐입니다.</p>

${h2('step3-add-search', 'Step 3: 검색 기능 추가')}
<p>글 목록을 실시간으로 필터링하는 검색 기능을 추가합니다. 검색은 사용자 입력에 반응해야 하므로 클라이언트 컴포넌트가 필요합니다.</p>

<h3>SearchablePostList 클라이언트 컴포넌트</h3>
<pre><code class="language-tsx">// app/components/SearchablePostList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

type Post = {
  id: number;
  slug: string;
  title: string;
};

export function SearchablePostList({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  const filtered = posts.filter((post) =&gt;
    post.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    &lt;&gt;
      &lt;input
        type='text'
        value={query}
        onChange={(e) =&gt; setQuery(e.target.value)}
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

<h3>서버 컴포넌트 페이지에서 데이터 전달</h3>
<pre><code class="language-tsx">// app/blog/page.tsx - 글 목록 페이지(서버 컴포넌트)
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

${titleBox('warn', '왜 posts를 서버에서 클라이언트로 전달하나요?', '검색 필터링은 사용자 입력에 반응해야 하므로 클라이언트에서 실행되어야 합니다. 따라서, 글 목록 데이터(<code>posts</code>)는 서버에서 준비한 뒤, React가 전달할 수 있는 형태로 클라이언트 컴포넌트에 props로 넘겨줍니다. 이렇게 하면 데이터 조회는 서버에서 처리하고, 검색 같은 인터랙션은 클라이언트에서 처리하는 구조로 역할을 나눌 수 있습니다.')}

${h2('step4-review-project-structure', 'Step 4: 최종 프로젝트 구조 점검')}
<p>완성된 프로젝트의 서버/클라이언트 경계를 확인해볼까요?</p>

<pre><code class="language-text">app/
├── layout.tsx                    [서버] 루트 레이아웃
├── page.tsx                      [서버] 홈 페이지
├── about/
│   └── page.tsx                  [서버] 소개 페이지
└── blog/
    ├── [slug]/
    │   └── page.tsx              [서버] 글 상세 페이지
    ├── layout.tsx                [서버] 블로그 레이아웃 ✅ (리팩터링 결과)
    └── page.tsx                  [서버] 글 목록 페이지 (데이터 준비)
├── components/
│   ├── CategorySidebar.tsx       [클라이언트] 'use client' - 카테고리 토글
│   ├── LikeButton.tsx            [클라이언트] 'use client' - 좋아요 상태
│   └── SearchablePostList.tsx    [클라이언트] 'use client' - 검색 입력</code></pre>

<p>컴포넌트 트리로 보면:</p>
<pre><code class="language-text">RootLayout [서버]
  └── BlogLayout [서버]
        ├── CategorySidebar [클라이언트] ← 'use client' 경계
        └── Blog [서버] 글 목록 페이지
        │     └── SearchablePostList [클라이언트] ← 'use client' 경계
        └── Post [서버] 글 상세 페이지
              └── LikeButton [클라이언트] ← 'use client' 경계</code></pre>

<p><code>'use client'</code> 경계가 모두 <strong>트리의 끝 가까이</strong> 위치한 것을 확인할 수 있습니다.</p>

${h2('design-decisions-in-this-chapter', '이 챕터에서 내린 설계 판단들')}
<table>
<thead><tr><th>설계 판단</th><th>근거</th></tr></thead>
<tbody>
<tr><td>BlogLayout → 서버 컴포넌트</td><td>인터랙션이 필요한 사이드바만 분리하면 레이아웃은 서버 유지 가능</td></tr>
<tr><td>CategorySidebar → 클라이언트</td><td><code>useState</code>로 토글 상태 관리 → 클라이언트 필수</td></tr>
<tr><td>LikeButton → 클라이언트</td><td><code>useState</code> + <code>onClick</code> → 클라이언트 필수</td></tr>
<tr><td>SearchablePostList → 클라이언트</td><td><code>useState</code> + <code>onChange</code>로 실시간 필터링 → 클라이언트 필수</td></tr>
<tr><td>Post → 서버 컴포넌트</td><td>데이터를 표시할 뿐 인터랙션 없음 → 서버 유지</td></tr>
<tr><td><code>posts</code> 데이터를 props로 전달</td><td>검색 필터링이 클라이언트에서 실행되기 때문</td></tr>
</tbody>
</table>

${h2('ch2-summary', 'Ch.2 학습 정리')}

<p>이번 챕터에서는 서버 컴포넌트와 클라이언트 컴포넌트를 <strong>언제, 왜 구분해서 쓰는지</strong>를 집중적으로 다뤘습니다.</p>

<ul>
<li><strong>서버 vs 클라이언트 컴포넌트의 역할 차이</strong> - 서버 컴포넌트는 데이터 표시와 레이아웃을, 클라이언트 컴포넌트는 인터랙션(<code>useState</code>, <code>onClick</code> 등)을 담당합니다.</li>
<li><strong><code>'use client'</code> 경계는 트리 끝에 배치</strong> - 클라이언트 경계를 최대한 작게 만들어서, 서버에서 처리할 수 있는 부분을 최대화하는 설계 원칙을 배웠습니다.</li>
<li><strong>children/props 전달</strong> - Provider 래핑이나 인터랙티브 래퍼에서 <code>children</code>이나 다른 prop을 활용해 서버 컴포넌트를 클라이언트 컴포넌트 안에 배치하는 방법을 익혔습니다.</li>
<li><strong>실습</strong> - BlogLayout 리팩터링, LikeButton, SearchablePostList를 직접 만들며 경계 설계를 연습했습니다.</li>
</ul>

${box('info', '<strong>다음 챕터 예고:</strong> 지금까지는 하드코딩된 배열로 데이터를 다뤘습니다. Ch.3에서는 데이터를 외부 소스에서 가져오는 <strong>Data Fetching</strong> 패턴을 학습합니다.')}
          `,
    },
  ],
};
