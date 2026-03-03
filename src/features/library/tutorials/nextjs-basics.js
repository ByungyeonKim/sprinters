import nextJsBasicImg from '../../../assets/next-js-basic.png';
import ch1MyBlogPracticeImg from '../../../assets/ch1-my-blog-practice.png';

export default {
  slug: 'nextjs-basics',
  title: 'Next.js 기초',
  chapters: [
    {
      title: '왜 Next.js일까? + App Router 기초',
      sessions: [
        {
          title: '학습 로드맵',
          content: `
<h2>Next.js 기초 가이드에 오신 것을 환영합니다!</h2>
<img src="${nextJsBasicImg}" alt="Next.js 기초 튜토리얼" style="max-width:480px;width:100%;aspect-ratio:1/1;border-radius:12px;margin-bottom:2rem;" />

<h2>이 튜토리얼은 누구를 위한 건가요?</h2>
<p>React로 컴포넌트를 만들고, <code>useState</code>와 <code>useEffect</code>로 상태를 다뤄본 적 있는 입문자를 위한 튜토리얼입니다. "React는 어느 정도 알겠는데, 실제 서비스는 어떻게 만들지?"라는 궁금증이 있다면 딱 맞습니다.</p>

<h2>왜 Next.js를 배워야 하나요?</h2>
<p>React만으로도 멋진 UI를 만들 수 있습니다. 하지만 실제 서비스를 배포하려고 하면 몇 가지 벽에 부딪힙니다.</p>
<ul>
<li><strong>검색 엔진이 내 페이지를 못 찾는다</strong> — React SPA는 빈 HTML을 내려주기 때문에 네이버, 구글 등의 검색에 잘 노출되지 않습니다.</li>
<li><strong>첫 화면이 느리다</strong> — 브라우저가 큰 JavaScript 번들을 전부 다운로드하고 실행할 때까지 사용자는 빈 화면을 봅니다.</li>
<li><strong>API 키가 노출된다</strong> — 클라이언트 코드에서 외부 API를 호출하면 민감한 정보가 브라우저에 그대로 드러납니다.</li>
</ul>
<p>Next.js는 이런 문제를 <strong>서버 렌더링, 자동 코드 분할, 서버 컴포넌트</strong> 같은 기능으로 깔끔하게 해결합니다. React 생태계에서 가장 널리 쓰이는 프레임워크인 만큼, 배워두면 실무에서 바로 활용할 수 있습니다.</p>

<h2>무엇을 배우나요?</h2>
<p>이 챕터는 이 로드맵을 포함하여 5개의 세션으로 구성되어 있습니다.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;margin:1.5rem 0;">
<div style="border:1px solid #e5e7eb;border-radius:10px;padding:1.25rem;">
<strong>1. CSR의 동작 원리와 한계</strong>
<p style="margin-top:0.5rem;color:#6b7280;">React SPA가 동작하는 방식을 이해하고, SEO·초기 로딩·데이터 워터폴 등 근본적인 문제점을 살펴봅니다.</p>
</div>
<div style="border:1px solid #e5e7eb;border-radius:10px;padding:1.25rem;">
<strong>2. Next.js의 등장과 프로젝트 시작</strong>
<p style="margin-top:0.5rem;color:#6b7280;">Next.js가 CSR 문제를 어떻게 해결하는지 이해하고, <code>create-next-app</code>으로 첫 프로젝트를 만듭니다.</p>
</div>
<div style="border:1px solid #e5e7eb;border-radius:10px;padding:1.25rem;">
<strong>3. App Router와 파일 기반 라우팅</strong>
<p style="margin-top:0.5rem;color:#6b7280;">App Router의 파일 규칙(<code>page.tsx</code>, <code>layout.tsx</code> 등)과 정적·동적 라우트를 학습합니다.</p>
</div>
<div style="border:1px solid #e5e7eb;border-radius:10px;padding:1.25rem;">
<strong>4. 레이아웃 시스템과 중첩 라우팅</strong>
<p style="margin-top:0.5rem;color:#6b7280;">루트 레이아웃부터 중첩 레이아웃까지 App Router의 레이아웃 시스템을 학습합니다.</p>
</div>
</div>

<h2>선수 지식</h2>
<p>아래 내용을 이미 알고 있다면 바로 시작할 수 있습니다.</p>
<ul>
<li><strong>React 기본 문법</strong> — JSX, 컴포넌트, Hook (<code>useState</code>, <code>useEffect</code>)</li>
<li><strong>JavaScript ES6+</strong> — <code>async/await</code>, 구조 분해, 모듈 시스템</li>
<li><strong>HTML/CSS 기초</strong> — 기본적인 마크업과 스타일링</li>
</ul>
          `,
        },
        {
          title: 'CSR의 동작 원리와 한계',
          content: `
<h2>CSR(Client-Side Rendering)이란?</h2>
<p>React로 만든 SPA(Single Page Application)는 기본적으로 <strong>CSR</strong> 방식으로 동작합니다. 브라우저가 서버에서 빈 HTML을 받고, JavaScript 번들을 다운로드한 뒤, 클라이언트에서 React가 UI를 렌더링하는 방식입니다.</p>

<h3>CSR의 동작 과정</h3>
<p><a href="https://vite.dev/guide/" target="_blank" rel="noopener noreferrer">Vite</a>로 만든 React 앱의 <code>index.html</code>을 살펴봅시다:</p>
<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="ko"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;My React App&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
    &lt;!-- 이 빈 div만 존재. 실제 콘텐츠는 JS가 렌더링 --&gt;
    &lt;script type="module" src="/src/main.tsx"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>브라우저가 이 페이지를 로드하면 다음 과정을 거칩니다:</p>
<pre><code class="language-text">1. 서버 → 빈 HTML 응답 (div#root만 존재)
2. 브라우저 → bundle.js 다운로드 (수백 KB ~ 수 MB)
3. 브라우저 → JavaScript 파싱 및 실행
4. React → Virtual DOM 생성, 실제 DOM에 렌더링
5. 사용자 → 이제서야 콘텐츠를 볼 수 있음</code></pre>
<p>즉, JavaScript가 완전히 로드되고 실행될 때까지 사용자는 <strong>빈 화면</strong>을 보게 됩니다.</p>

<h2>CSR의 문제점들</h2>

<h3>1. SEO(검색 엔진 최적화) 문제</h3>
<p>검색 엔진 크롤러가 CSR 앱을 방문하면 어떤 일이 벌어질까요? 브라우저에서 <strong>우클릭 → 페이지 소스 보기</strong>를 하면 서버가 보내주는 원본 HTML을 확인할 수 있습니다. 검색 엔진 크롤러도 바로 이 HTML을 수집합니다.</p>

<p><strong>CSR 앱</strong>의 소스 보기:</p>
<pre><code class="language-html">&lt;!-- React(CSR) 앱의 페이지 소스 보기 결과 --&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;  &lt;!-- 빈 페이지! 콘텐츠가 없음 --&gt;
    &lt;script src="/bundle.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

<p><strong>Next.js(SSR) 앱</strong>의 소스 보기:</p>
<pre><code class="language-html">&lt;!-- Next.js(SSR) 앱의 페이지 소스 보기 결과 --&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;h1&gt;환영합니다&lt;/h1&gt;
    &lt;p&gt;이 페이지의 모든 콘텐츠가 포함되어 있습니다.&lt;/p&gt;
    &lt;article&gt;...실제 콘텐츠...&lt;/article&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>CSR 앱은 빈 HTML만 내려줍니다. 구글은 JavaScript를 실행해 콘텐츠를 인식할 수 있지만, 렌더링까지 시간이 걸려 인덱싱이 지연되며 네이버 등 다른 검색 엔진은 JS 렌더링을 지원하지 않을 수 있습니다. 반면 SSR 앱은 서버에서 완성된 HTML을 반환하므로 크롤러가 모든 콘텐츠를 즉시 수집할 수 있습니다.</p>

<h3>2. 초기 로딩 성능 문제</h3>
<p>CSR에서는 <strong>전체 앱의 JavaScript를 한 번에 다운로드</strong>해야 합니다. 앱이 커질수록 번들 사이즈도 커지고, 사용자가 첫 콘텐츠를 보기까지(FCP — First Contentful Paint)의 시간이 길어집니다.</p>
<p>이를 완화하기 위해 React가 제공하는 코드 분할 기능을 사용할 수 있습니다:</p>
<ul>
<li><code>React.lazy</code> — 컴포넌트를 <strong>동적으로 import</strong>하여, 해당 컴포넌트가 실제로 렌더링될 때만 번들을 다운로드합니다.</li>
<li><code>Suspense</code> — lazy 컴포넌트가 로드되는 동안 보여줄 <strong>대체 UI(fallback)</strong>를 지정합니다.</li>
</ul>
<p>하지만 근본적인 해결책은 아닙니다:</p>
<pre><code class="language-jsx">import { lazy, Suspense } from 'react';

// 코드 분할: 해당 컴포넌트가 필요할 때만 로드
const AdminPage = lazy(() => import('./pages/AdminPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    &lt;Suspense fallback={&lt;div&gt;로딩 중...&lt;/div&gt;}&gt;
      &lt;Routes&gt;
        &lt;Route path="/admin" element={&lt;AdminPage /&gt;} /&gt;
        &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
<p>이 방법은 라우트 단위로 번들을 나눌 수 있지만 한계가 분명합니다:</p>
<ul>
<li><strong>수동 관리 부담</strong> — 어떤 컴포넌트를 lazy로 분리할지 개발자가 직접 판단하고 설정해야 합니다. 분할 지점이 많아질수록 관리가 복잡해집니다.</li>
<li><strong>공통(초기) 번들은 남습니다</strong> — 라우트를 나눠도 앱이 시작되려면 리액트 런타임, 라우터, 공통 레이아웃/유틸, 공유 라이브러리 같은 "기본 실행 코드"는 초기 로딩에 포함될 수밖에 없습니다. 그래서 페이지를 분리해도 공통 의존성이 커지면 초기 로딩 비용이 함께 커질 수 있습니다.</li>
<li><strong>로딩 상태가 UX로 드러납니다</strong> — 라우트로 이동할 때 필요한 청크를 추가로 받아오는 동안 Suspense의 fallback(<code>"로딩 중…"</code>)이 노출됩니다. 네트워크가 느리면 이 상태가 길어져 전환이 끊기거나 깜빡이는 것처럼 느껴질 수 있고, 결국 "JS를 받아 실행해야 화면이 완성되는 CSR 구조" 자체는 그대로입니다.</li>
</ul>

<h3>3. 서버 없는 구조의 한계</h3>
<p>CSR 앱은 순수 클라이언트에서 동작하므로 여러 구조적 한계가 있습니다.</p>

<h4>API 키 노출 문제</h4>
<p>클라이언트 코드에서 외부 API를 호출하면 API 키가 브라우저에 노출됩니다:</p>
<pre><code class="language-jsx">// 위험! API 키가 브라우저 개발자 도구에서 보임
const res = await fetch('https://api.openai.com/v1/chat', {
  headers: {
    'Authorization': \`Bearer \${import.meta.env.VITE_OPENAI_KEY}\`,
  },
});</code></pre>
<p>빌드 시점에 환경 변수가 번들에 포함되기 때문에 누구나 확인할 수 있습니다.</p>

<h4>데이터 워터폴 문제</h4>
<p>CSR에서 데이터를 가져오려면 컴포넌트가 <strong>마운트(화면에 렌더링)된 후에야</strong> fetch를 시작할 수 있습니다. 부모-자식 관계의 컴포넌트가 각각 데이터를 요청하면 <strong>워터폴(요청이 순차적으로 대기하는 현상)</strong>이 발생합니다:</p>
<pre><code class="language-jsx">function Post({ postId }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // 1단계: 포스트 데이터 요청
    fetch(\`/api/posts/\${postId}\`)
      .then(res => res.json())
      .then(setPost);
  }, [postId]);

  if (!post) return &lt;div&gt;로딩 중...&lt;/div&gt;;

  return (
    &lt;div&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      {/* 포스트가 로드된 후에야 댓글 컴포넌트가 마운트됨 */}
      &lt;Comments postId={postId} /&gt;
    &lt;/div&gt;
  );
}

function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // 2단계: 포스트 로드 후에야 댓글 요청 시작 (워터폴!)
    fetch(\`/api/posts/\${postId}/comments\`)
      .then(res => res.json())
      .then(setComments);
  }, [postId]);

  return comments.map(c => &lt;p key={c.id}&gt;{c.text}&lt;/p&gt;);
}</code></pre>
<pre><code class="language-text">타임라인:
──────────────────────────────────────────────────────
JS 다운로드       ████████
포스트 요청                  ████████
포스트 렌더링                         ██
댓글 요청 (대기!)                       ████████
댓글 렌더링                                      ██
──────────────────────────────────────────────────────
→ 각 요청이 순차적으로 실행 = 느린 사용자 경험</code></pre>

<h2>정리: 왜 서버가 필요한가?</h2>
<p>CSR의 근본적인 한계를 정리하면:</p>
<table>
<thead><tr><th>문제</th><th>원인</th></tr></thead>
<tbody>
<tr><td>SEO 불가</td><td>빈 HTML → 크롤러가 콘텐츠를 인식 못함</td></tr>
<tr><td>느린 초기 로딩</td><td>대용량 JS 번들을 다운로드 후 실행해야 함</td></tr>
<tr><td>보안 취약</td><td>API 키 등 민감 정보가 클라이언트에 노출</td></tr>
<tr><td>데이터 워터폴</td><td>컴포넌트 마운트 후에야 데이터 요청 가능</td></tr>
</tbody>
</table>
<p>이 문제들을 해결하려면 <strong>서버에서 HTML을 미리 렌더링</strong>하고, <strong>서버에서 데이터를 가져와</strong> 클라이언트에 전달하는 방식이 필요합니다. 다음 세션에서 이 역할을 하는 <strong>Next.js</strong>를 알아봅니다.</p>
          `,
        },
        {
          title: 'Next.js의 등장과 프로젝트 시작',
          content: `
<h2>Next.js가 CSR 문제를 해결하는 방법</h2>
<p>이전 세션에서 살펴본 CSR의 한계를 Next.js는 어떻게 해결할까요?</p>

<table>
<thead><tr><th>CSR 문제</th><th>Next.js 해결책</th></tr></thead>
<tbody>
<tr><td>빈 HTML (SEO 불가)</td><td>서버에서 HTML을 미리 렌더링 (SSR/SSG)</td></tr>
<tr><td>대용량 번들 (느린 로딩)</td><td>자동 코드 분할 — 페이지별 필요한 코드만 전송</td></tr>
<tr><td>API 키 노출</td><td>서버 컴포넌트에서 민감 정보 처리</td></tr>
<tr><td>데이터 워터폴</td><td>서버에서 병렬로 데이터 수집 후 완성된 HTML 전송</td></tr>
</tbody>
</table>

<h3>자동 코드 분할이란?</h3>
<p>위 표에서 "자동 코드 분할"이 언급되었는데, 이것이 정확히 무엇이고 왜 중요한지 알아봅시다.</p>
<p>React SPA(CSR)에서는 앱의 모든 코드가 <strong>하나의 커다란 번들</strong>로 묶여 전송됩니다. 홈 페이지에 접속했을 뿐인데, 관리자 페이지·설정 페이지·대시보드 코드까지 전부 다운로드해야 하는 것이죠.</p>
<p>Next.js의 자동 코드 분할은 이 방식을 뒤집습니다. <strong>한 덩어리가 아니라 페이지마다 따로 포장</strong>해서, 사용자가 방문한 페이지에 필요한 코드만 전송합니다.</p>

<h4>이점 1 — 초기 로딩 속도 향상</h4>
<p>다운로드할 JavaScript 양이 줄어들고, 브라우저가 파싱·컴파일해야 하는 코드도 줄어듭니다. 특히 모바일 환경에서 체감 차이가 큽니다.</p>
<pre><code class="language-text">CSR (코드 분할 없음)
  사용자 → 홈 페이지 접속 → bundle.js (500 KB) 전체 다운로드

Next.js (자동 코드 분할)
  사용자 → 홈 페이지 접속 → 홈 전용 코드 (5 KB) + 공유 코드 (84 KB)만 다운로드</code></pre>

<h4>이점 2 — 장애 격리</h4>
<p>대시보드 페이지의 코드에서 에러가 발생하더라도, 홈 페이지나 소개 페이지는 영향을 받지 않습니다. 코드가 페이지별로 분리되어 있기 때문입니다.</p>
<p>단, <strong>공통 레이아웃이나 공유 컴포넌트</strong>에서 에러가 발생하면 여러 페이지에 영향이 퍼질 수 있습니다. 이런 경우에는 다음 세션에서 살펴볼 <code>error.tsx</code> 에러 경계를 활용하여 에러 범위를 격리할 수 있습니다.</p>

<p>가장 좋은 점은 <strong>개발자가 아무 설정도 하지 않아도 된다</strong>는 것입니다. React에서 <code>React.lazy</code>를 수동으로 설정해야 했던 것과 달리, Next.js는 빌드 시 자동으로 처리합니다.</p>

<h3>렌더링 전략 개요</h3>
<p>Next.js는 서버에서 HTML을 미리 렌더링할 수 있습니다. 빌드 시점에 미리 생성하거나, 사용자 요청 시마다 서버에서 생성하는 등 상황에 따라 전략을 선택할 수 있는데, 이 부분은 이후 챕터에서 자세히 다룹니다.</p>

<h2>프로젝트 생성하기</h2>
<p><code>create-next-app</code>으로 새 프로젝트를 만듭니다:</p>
<pre><code class="language-shell">npx create-next-app@latest my-app</code></pre>

<p>설치 과정에서 기본 설정 사용 여부를 묻습니다. <strong>Yes</strong>를 선택하면 TypeScript, ESLint, Tailwind CSS, App Router가 한 번에 적용됩니다:</p>
<pre><code class="language-text">✔ Would you like to use the recommended Next.js defaults?
  › Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router</code></pre>

<p>세부 옵션을 직접 고르려면 <strong>No, customize settings</strong>를 선택하세요:</p>
<pre><code class="language-text">✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a \`src/\` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias? … No</code></pre>

<ul>
<li><strong>TypeScript</strong> — 타입 안정성으로 런타임 에러를 줄여줍니다.</li>
<li><strong>ESLint</strong> — 코드 품질과 일관성을 유지해줍니다. Biome도 선택 가능하지만, 생태계가 더 넓은 ESLint를 권장합니다.</li>
<li><strong>Tailwind CSS</strong> — 별도 CSS 파일 없이 <code>className="text-lg font-bold"</code>처럼 HTML에 직접 스타일을 적용하는 유틸리티 퍼스트 방식의 CSS 프레임워크입니다.</li>
<li><strong>App Router</strong> — Next.js의 최신 라우팅 시스템입니다. 반드시 선택하세요.</li>
</ul>

<h2>프로젝트 구조 이해</h2>
<p>생성된 프로젝트의 디렉토리 구조입니다:</p>
<pre><code class="language-text">my-app/
├── app/                      # App Router 핵심 디렉토리
│   ├── layout.tsx            # 루트 레이아웃 (필수)
│   ├── page.tsx              # 홈 페이지 (/)
│   ├── globals.css           # 글로벌 스타일
│   └── favicon.ico
├── public/                   # 정적 파일 (이미지, 폰트 등)
├── next.config.ts            # Next.js 설정 파일
├── eslint.config.mjs         # ESLint 설정 (flat config)
├── tsconfig.json             # TypeScript 설정
├── postcss.config.mjs
└── package.json</code></pre>

<p>핵심 파일과 폴더의 역할:</p>
<table>
<thead><tr><th>경로</th><th>역할</th></tr></thead>
<tbody>
<tr><td><code>app/</code></td><td>App Router의 핵심. 이 폴더의 구조가 곧 URL 구조</td></tr>
<tr><td><code>app/layout.tsx</code></td><td>모든 페이지를 감싸는 루트 레이아웃 (html, body 태그 포함)</td></tr>
<tr><td><code>app/page.tsx</code></td><td>홈 페이지 (<code>/</code> 경로)</td></tr>
<tr><td><code>public/</code></td><td>정적 파일. <code>/image.png</code>로 바로 접근 가능</td></tr>
<tr><td><code>next.config.ts</code></td><td>리다이렉트, 이미지 도메인 등 Next.js 설정</td></tr>
</tbody>
</table>

<h2>개발 서버 실행과 첫 페이지 수정</h2>
<p>프로젝트 디렉토리로 이동한 뒤 개발 서버를 실행합니다:</p>
<pre><code class="language-shell">cd my-app
npm run dev</code></pre>

<p>브라우저에서 <code>http://localhost:3000</code>에 접근하면 Next.js 기본 페이지가 보입니다.</p>

<p>이제 <code>app/page.tsx</code>를 열어 내용을 수정해 봅시다:</p>
<pre><code class="language-tsx">// app/page.tsx
export default function Home() {
  return (
    &lt;main&gt;
      &lt;h1&gt;안녕하세요!&lt;/h1&gt;
      &lt;p&gt;나의 첫 Next.js 앱입니다.&lt;/p&gt;
    &lt;/main&gt;
  );
}</code></pre>

<p>파일을 저장하면 브라우저가 <strong>자동으로 새로고침</strong>됩니다. 이것이 Fast Refresh입니다. 코드를 수정하면 전체 페이지를 새로고침하지 않고, 변경된 컴포넌트만 즉시 반영하며, 가능한 경우 컴포넌트의 상태(<code>useState</code> 값 등)도 유지됩니다.</p>

<p>다음 세션에서는 App Router의 핵심인 <strong>파일 기반 라우팅</strong>을 학습합니다.</p>
          `,
        },
        {
          title: 'App Router와 파일 기반 라우팅',
          content: `
<h2>App Router란?</h2>
<p><a href="https://github.com/vercel/next.js/discussions/41745" target="_blank" rel="noopener noreferrer">Next.js 13부터 도입</a>된 <strong>App Router</strong>는 <code>app/</code> 디렉토리 기반의 라우팅 시스템입니다. 이전의 Pages Router(<code>pages/</code> 디렉토리)를 대체하며, React Server Components, 중첩 레이아웃, 스트리밍 등 최신 기능을 지원합니다.</p>

<div style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;">
<strong>라우팅이란?</strong> 사용자가 입력한 URL에 따라 어떤 페이지를 보여줄지 결정하는 것을 말합니다. 예를 들어 <code>/about</code>에 접속하면 소개 페이지를, <code>/blog</code>에 접속하면 블로그 목록을 보여주는 규칙이 바로 라우팅입니다.
</div>

<table>
<thead><tr><th>비교</th><th>Pages Router</th><th>App Router</th></tr></thead>
<tbody>
<tr><td>디렉토리</td><td><code>pages/</code></td><td><code>app/</code></td></tr>
<tr><td>기본 컴포넌트</td><td>클라이언트 컴포넌트</td><td>서버 컴포넌트</td></tr>
<tr><td>레이아웃</td><td>수동 구성</td><td>자동 중첩</td></tr>
<tr><td>데이터 페칭</td><td><code>getServerSideProps</code> 등</td><td><code>async</code> 컴포넌트에서 직접</td></tr>
</tbody>
</table>
<p>새 프로젝트라면 App Router를 사용하세요. Pages Router는 레거시 호환용으로만 유지됩니다.</p>

<h2>핵심 파일 규칙</h2>
<p>App Router에서는 특정 이름을 가진 파일들이 <strong>특별한 역할</strong>을 합니다:</p>

<h3><code>page.tsx</code> — 페이지 UI</h3>
<p>해당 경로에서 보여줄 UI를 정의합니다. 이 파일이 있어야 해당 경로에 접근할 수 있습니다.</p>
<pre><code class="language-tsx">// app/about/page.tsx → /about 경로
export default function About() {
  return &lt;h1&gt;소개 페이지&lt;/h1&gt;;
}</code></pre>

<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;">
<strong style="display:block;margin-bottom:0.35rem;">반드시 default export</strong>
<span>Next.js는 <code>page.tsx</code>의 <strong>default export</strong>를 해당 경로의 UI로 사용합니다. named export(<code>export function About</code>)로 작성하면 페이지를 인식하지 못합니다. <code>layout.tsx</code>, <code>loading.tsx</code> 등 다른 특수 파일도 동일한 규칙입니다.</span>
</div>

<h3><code>layout.tsx</code> — 공유 레이아웃</h3>
<p>하위 페이지들이 공유하는 UI를 정의합니다. 내비게이션, 사이드바 등에 사용합니다.</p>
<pre><code class="language-tsx">// app/layout.tsx → 모든 페이지가 공유
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;html lang="ko"&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

<h3><code>loading.tsx</code> — 로딩 UI</h3>
<p>React Suspense를 기반으로 자동 로딩 UI를 제공합니다.</p>
<pre><code class="language-tsx">// app/dashboard/loading.tsx
export default function Loading() {
  return &lt;div&gt;대시보드 로딩 중...&lt;/div&gt;;
}</code></pre>

<h3><code>error.tsx</code> — 에러 UI</h3>
<p>React Error Boundary를 기반으로 에러 발생 시 보여줄 UI를 정의합니다. Error Boundary는 반드시 <strong>클라이언트 컴포넌트</strong>여야 합니다.</p>
<pre><code class="language-tsx">// app/dashboard/error.tsx
'use client' // Error Boundary는 반드시 클라이언트 컴포넌트여야 합니다

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 리포팅 서비스에 에러를 기록합니다
    console.error(error)
  }, [error])

  return (
    &lt;div&gt;
      &lt;h2&gt;문제가 발생했습니다&lt;/h2&gt;
      &lt;button onClick={() =&gt; reset()}&gt;다시 시도&lt;/button&gt;
    &lt;/div&gt;
  )
}</code></pre>

<h3><code>not-found.tsx</code> — 404 페이지</h3>
<pre><code class="language-tsx">// app/not-found.tsx
export default function NotFound() {
  return &lt;h1&gt;페이지를 찾을 수 없습니다&lt;/h1&gt;;
}</code></pre>

<h2>정적 라우트 만들기</h2>
<p>App Router에서 <strong>폴더 이름이 곧 URL 세그먼트</strong>가 됩니다:</p>
<pre><code class="language-text">app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   └── page.tsx          → /blog
└── contact/
    └── page.tsx          → /contact</code></pre>

<p>새 페이지를 추가하려면 <strong>폴더를 만들고 <code>page.tsx</code>를 넣기만</strong> 하면 됩니다:</p>
<pre><code class="language-tsx">// app/about/page.tsx
export default function About() {
  return (
    &lt;main&gt;
      &lt;h1&gt;About Us&lt;/h1&gt;
      &lt;p&gt;우리 팀을 소개합니다.&lt;/p&gt;
    &lt;/main&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/blog/page.tsx
export default function Blog() {
  return (
    &lt;main&gt;
      &lt;h1&gt;블로그&lt;/h1&gt;
      &lt;p&gt;최신 글 목록&lt;/p&gt;
    &lt;/main&gt;
  );
}</code></pre>

<h2>동적 라우트</h2>
<p>URL의 일부를 변수로 사용해야 할 때 대괄호로 폴더명을 감쌉니다:</p>

<h3><code>[slug]</code> — 단일 동적 세그먼트</h3>
<pre><code class="language-text">app/blog/[slug]/page.tsx → /blog/hello-world, /blog/my-first-post 등</code></pre>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
type Props = {
  params: Promise&lt;{ slug: string }&gt;;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  return &lt;h1&gt;블로그 글: {slug}&lt;/h1&gt;;
}</code></pre>

<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;">
<strong style="display:block;margin-bottom:0.35rem;">폴더명 = params 키</strong>
<span>대괄호 안의 이름이 <code>params</code> 객체의 키가 됩니다. <code>[slug]</code>이면 <code>params.slug</code>, <code>[id]</code>이면 <code>params.id</code>로 접근합니다. 프로젝트 맥락에 맞는 이름을 자유롭게 사용하세요 — 예를 들어, 상품 상세 페이지라면 <code>[productId]</code>가 더 직관적입니다.</span>
</div>

<p>다음 세션에서는 이 라우팅 시스템 위에 구축되는 <strong>레이아웃 시스템과 중첩 라우팅</strong>을 학습합니다.</p>
          `,
        },
        {
          title: '레이아웃 시스템과 중첩 라우팅',
          content: `
<h2>루트 레이아웃</h2>
<p><code>app/layout.tsx</code>는 Next.js 앱에서 <strong>필수</strong>인 파일입니다. 모든 페이지를 감싸며, <code>&lt;html&gt;</code>과 <code>&lt;body&gt;</code> 태그를 반드시 포함해야 합니다.</p>

<pre><code class="language-tsx">// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Blog',
  description: '나의 기술 블로그',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;html lang="ko"&gt;
      &lt;body&gt;
        &lt;header&gt;
          &lt;nav&gt;
            &lt;Link href="/"&gt;홈&lt;/Link&gt;
            &lt;Link href="/blog"&gt;블로그&lt;/Link&gt;
            &lt;Link href="/about"&gt;소개&lt;/Link&gt;
          &lt;/nav&gt;
        &lt;/header&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;footer&gt;© 2025 My Blog&lt;/footer&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>
<p>이 레이아웃은 앱의 모든 페이지에 적용됩니다. 헤더와 푸터는 어떤 페이지로 이동하든 항상 표시됩니다.</p>

<h2>중첩 레이아웃</h2>
<p>하위 폴더에 <code>layout.tsx</code>를 추가하면 <strong>자동으로 중첩</strong>됩니다:</p>
<pre><code class="language-text">app/
├── layout.tsx              # 루트 레이아웃 (헤더, 푸터)
├── page.tsx                # 홈 페이지
└── dashboard/
    ├── layout.tsx          # 대시보드 레이아웃 (사이드바)
    ├── page.tsx            # /dashboard
    └── settings/
        └── page.tsx        # /dashboard/settings</code></pre>

<pre><code class="language-tsx">// app/dashboard/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;div className="flex"&gt;
      &lt;aside className="w-64 border-r p-4"&gt;
        &lt;h2&gt;대시보드&lt;/h2&gt;
        &lt;ul&gt;
          &lt;li&gt;&lt;Link href="/dashboard"&gt;개요&lt;/Link&gt;&lt;/li&gt;
          &lt;li&gt;&lt;Link href="/dashboard/settings"&gt;설정&lt;/Link&gt;&lt;/li&gt;
          &lt;li&gt;&lt;Link href="/dashboard/analytics"&gt;분석&lt;/Link&gt;&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/aside&gt;
      &lt;section className="flex-1 p-6"&gt;{children}&lt;/section&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p><code>/dashboard/settings</code>에 접근하면 렌더링 순서는 다음과 같습니다:</p>
<pre><code class="language-text">루트 레이아웃 (헤더, 푸터)
  └── 대시보드 레이아웃 (사이드바)
       └── 설정 페이지 (page.tsx)</code></pre>
<p>레이아웃이 자동으로 감싸지므로, 별도 설정 없이도 <strong>일관된 UI 구조</strong>를 만들 수 있습니다.</p>

<h2>레이아웃의 핵심 특성</h2>

<h3>상태 유지 — 리렌더링되지 않음</h3>
<p>레이아웃은 하위 페이지가 전환되어도 <strong>리렌더링되지 않습니다</strong>. 대시보드 사이드바의 스크롤 위치, 입력 중인 검색어 등의 상태가 유지됩니다.</p>
<pre><code class="language-text">/dashboard → /dashboard/settings 이동 시:
  ✅ 대시보드 레이아웃: 리렌더링 없음 (상태 유지)
  🔄 페이지 컴포넌트만 교체됨</code></pre>

<p><code>template.tsx</code>라는 별도 파일을 사용하면 페이지 전환 시마다 새로 마운트할 수도 있지만, 이는 <a href="https://nextjs.org/docs/app/api-reference/file-conventions/template" target="_blank" rel="noopener noreferrer">공식 문서</a>에서 자세히 확인할 수 있습니다.</p>

<h2>실습: 블로그 프로젝트 레이아웃 구성</h2>
<p>지금까지 배운 내용을 종합하여 블로그 프로젝트의 레이아웃을 구성해 봅시다.</p>
<pre><code class="language-text">app/
├── layout.tsx          # 루트 레이아웃: 헤더(내비게이션) + 푸터
├── page.tsx            # 홈 페이지
├── about/
│   └── page.tsx        # /about
└── blog/
    ├── layout.tsx      # 블로그 레이아웃: 사이드바(카테고리)
    ├── page.tsx        # /blog (글 목록)
    └── [slug]/
        └── page.tsx    # /blog/:slug (글 상세)</code></pre>

<pre><code class="language-tsx">// app/layout.tsx — 루트 레이아웃
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  return (
    &lt;html lang="ko"&gt;
      &lt;body className={&#96;&#36;{geistSans.variable} &#36;{geistMono.variable}&#96;}&gt;
        &lt;header&gt;
          &lt;nav&gt;
            &lt;Link href="/"&gt;My Blog&lt;/Link&gt;
            &lt;Link href="/blog"&gt;글 목록&lt;/Link&gt;
            &lt;Link href="/about"&gt;소개&lt;/Link&gt;
          &lt;/nav&gt;
        &lt;/header&gt;
        {children}
        &lt;footer&gt;© 2025 My Blog. All rights reserved.&lt;/footer&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/page.tsx — 홈 페이지
export default function Home() {
  return (
    &lt;div&gt;
      &lt;h1&gt;환영합니다!&lt;/h1&gt;
      &lt;p&gt;프론트엔드 개발을 기록하는 블로그입니다.&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/blog/page.tsx — 글 목록
import Link from 'next/link';

const posts = [
  { slug: 'nextjs-routing', title: 'Next.js 라우팅 이해하기' },
  { slug: 'react-server-components', title: 'React 서버 컴포넌트란?' },
];

export default function Blog() {
  return (
    &lt;div&gt;
      &lt;h1&gt;글 목록&lt;/h1&gt;
      &lt;ul&gt;
        {posts.map((post) =&gt; (
          &lt;li key={post.slug}&gt;
            &lt;Link href={&#96;/blog/&#36;{post.slug}&#96;}&gt;{post.title}&lt;/Link&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/about/page.tsx — 소개 페이지
export default function About() {
  return (
    &lt;div&gt;
      &lt;h1&gt;소개&lt;/h1&gt;
      &lt;p&gt;프론트엔드 개발을 기록하는 블로그입니다.&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">// app/blog/[slug]/page.tsx — 글 상세
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
    &lt;/div&gt;
  );
}</code></pre>

<pre><code class="language-tsx">'use client';

import { useState } from 'react';

// app/blog/layout.tsx — 블로그 레이아웃
export default function BlogLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    &lt;div className="flex"&gt;
      &lt;aside className="w-60 p-4 border-r"&gt;
        &lt;button onClick={() =&gt; setIsOpen(!isOpen)}&gt;
          카테고리 {isOpen ? '▲' : '▼'}
        &lt;/button&gt;
        {isOpen &amp;&amp; (
          &lt;ul&gt;
            &lt;li&gt;React&lt;/li&gt;
            &lt;li&gt;Next.js&lt;/li&gt;
            &lt;li&gt;TypeScript&lt;/li&gt;
          &lt;/ul&gt;
        )}
      &lt;/aside&gt;
      &lt;main className="flex-1 p-6"&gt;{children}&lt;/main&gt;
    &lt;/div&gt;
  );
}</code></pre>

<p>사이드바의 카테고리를 접은 상태에서 블로그 글을 클릭하면 어떻게 될까요? 레이아웃은 리렌더링되지 않으므로, <strong>카테고리가 접힌 상태가 그대로 유지</strong>됩니다. <code>'use client'</code>는 다음 챕터에서 자세히 배우지만, 여기서는 상태(<code>useState</code>)를 사용하기 위해 필요하다는 것만 알아두세요.</p>
<p>참고로 레이아웃을 클라이언트 컴포넌트로 만드는 것이 항상 바람직한 것은 아닙니다. 여기서는 상태 유지를 직접 확인하기 위한 예시이며, 서버/클라이언트 컴포넌트의 선택 기준은 다음 챕터에서 다룹니다.</p>

<p>결과적으로 <code>/blog/nextjs-routing</code>에 접근하면 다음과 같이 렌더링됩니다:</p>
<img src="${ch1MyBlogPracticeImg}" alt="블로그 중첩 레이아웃 실행 결과" style="max-width:100%;border-radius:8px;margin:1rem 0;border:1px solid #e5e7eb;" />
<ul style="margin-top:0.5rem;">
<li><strong>헤더</strong> (<code>app/layout.tsx</code>) — "My Blog · 글 목록 · 소개" 내비게이션이 모든 페이지에 공통 적용됩니다.</li>
<li><strong>사이드바</strong> (<code>app/blog/layout.tsx</code>) — 카테고리 목록은 블로그 하위 경로에서만 표시되며, 페이지를 이동해도 레이아웃이 리렌더링되지 않아, 펼침/접힘 상태가 유지됩니다.</li>
<li><strong>본문</strong> (<code>app/blog/[slug]/page.tsx</code>) — URL의 <code>slug</code> 값(<code>nextjs-routing</code>)이 동적으로 주입되어 해당 글의 내용을 렌더링합니다.</li>
<li><strong>푸터</strong> (<code>app/layout.tsx</code>) — 루트 레이아웃에 속하므로 모든 페이지 하단에 표시됩니다.</li>
</ul>

<p>이것으로 Chapter 1을 마칩니다. 다음 챕터에서는 <strong>서버 컴포넌트와 클라이언트 컴포넌트</strong>를 학습합니다.</p>
          `,
        },
      ],
    },
    {
      title: 'Server / Client Component',
      locked: true,
      sessions: [
        {
          title: '서버 vs 클라이언트 컴포넌트',
          content: `
<h2>서버 vs 클라이언트 컴포넌트</h2>
<p>App Router에서 모든 컴포넌트는 기본적으로 <strong>서버 컴포넌트</strong>입니다. 클라이언트에서 실행되어야 하는 컴포넌트는 <code>'use client'</code> 지시어를 파일 상단에 추가합니다.</p>
<h3>서버 컴포넌트</h3>
<pre><code class="language-tsx">// app/page.tsx — 서버 컴포넌트 (기본값)
export default async function Home() {
  // 서버에서 직접 데이터를 가져올 수 있음
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return (
    &lt;main&gt;
      &lt;h1&gt;블로그&lt;/h1&gt;
      {posts.map(post =&gt; (
        &lt;article key={post.id}&gt;
          &lt;h2&gt;{post.title}&lt;/h2&gt;
          &lt;p&gt;{post.excerpt}&lt;/p&gt;
        &lt;/article&gt;
      ))}
    &lt;/main&gt;
  );
}</code></pre>
<h3>클라이언트 컴포넌트</h3>
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
<h3>사용 기준</h3>
<table>
<thead><tr><th>서버 컴포넌트</th><th>클라이언트 컴포넌트</th></tr></thead>
<tbody>
<tr><td>데이터 가져오기</td><td>이벤트 핸들러 (onClick 등)</td></tr>
<tr><td>백엔드 리소스 직접 접근</td><td>useState, useEffect 등 Hook</td></tr>
<tr><td>민감한 정보 (API 키 등)</td><td>브라우저 API 사용</td></tr>
</tbody>
</table>
          `,
        },
      ],
    },
    {
      title: 'Data Fetching & 렌더링',
      locked: true,
      sessions: [
        {
          title: '데이터 가져오기',
          content: `
<h2>데이터 가져오기 (Data Fetching)</h2>
<p>App Router에서는 서버 컴포넌트 안에서 직접 <code>async/await</code>를 사용하여 데이터를 가져올 수 있습니다.</p>
<h3>서버 컴포넌트에서 fetch</h3>
<pre><code class="language-tsx">// app/posts/page.tsx
export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600 }, // 1시간마다 재검증
  });
  const posts = await res.json();

  return (
    &lt;ul&gt;
      {posts.map((post) =&gt; (
        &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<h3>캐싱 전략</h3>
<pre><code class="language-typescript">// 기본값: 자동 캐싱 (static)
fetch('https://api.example.com/data');

// 재검증 주기 설정
fetch('https://api.example.com/data', {
  next: { revalidate: 60 }, // 60초
});

// 캐시 비활성화 (dynamic)
fetch('https://api.example.com/data', {
  cache: 'no-store',
});</code></pre>
<h3>Server Actions</h3>
<p>폼 제출이나 데이터 변경에는 Server Actions를 사용합니다:</p>
<pre><code class="language-tsx">'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({
    data: { title, content },
  });
}</code></pre>
<pre><code class="language-tsx">// app/posts/new/page.tsx
import { createPost } from './actions';

export default function NewPostPage() {
  return (
    &lt;form action={createPost}&gt;
      &lt;input name="title" placeholder="제목" /&gt;
      &lt;textarea name="content" placeholder="내용" /&gt;
      &lt;button type="submit"&gt;작성&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
          `,
        },
        {
          title: '동적 라우트와 메타데이터',
          content: `
<h2>동적 라우트</h2>
<p>URL의 일부를 변수로 사용할 때 동적 라우트를 활용합니다.</p>
<h3>기본 동적 라우트</h3>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
type Props = {
  params: Promise&lt;{ slug: string }&gt;;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;{post.content}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
<h3>generateStaticParams</h3>
<p>빌드 시점에 정적으로 생성할 페이지를 지정할 수 있습니다:</p>
<pre><code class="language-tsx">export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) =&gt; ({
    slug: post.slug,
  }));
}</code></pre>
<h3>메타데이터</h3>
<p>SEO를 위한 메타데이터를 설정합니다:</p>
<pre><code class="language-tsx">// 정적 메타데이터
export const metadata = {
  title: '블로그',
  description: '최신 기술 블로그 글',
};

// 동적 메타데이터
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}</code></pre>
          `,
        },
      ],
    },
    {
      title: 'Navigation + 정리 & 미니 실습',
      locked: true,
      sessions: [
        {
          title: '학습 정리와 다음 단계',
          content: `
<h2>축하합니다!</h2>
<p>Next.js의 핵심 개념들을 학습했습니다. 이제 실제 프로젝트에 적용해 보세요.</p>
<h3>학습한 내용 정리</h3>
<ul>
<li>Next.js 프로젝트 생성 및 구조 이해</li>
<li>App Router의 파일 기반 라우팅 시스템</li>
<li>서버 컴포넌트와 클라이언트 컴포넌트 구분</li>
<li>레이아웃 시스템과 중첩 레이아웃</li>
<li>데이터 가져오기와 캐싱 전략</li>
<li>동적 라우트와 메타데이터 설정</li>
</ul>
<h3>추천 학습 자료</h3>
<ul>
<li><a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js 공식 문서</a></li>
<li><a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer">Next.js Learn 코스</a></li>
<li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React 공식 문서</a></li>
</ul>
<h3>실습 과제</h3>
<ol>
<li>블로그 프로젝트를 만들어 보세요 — 글 목록, 상세 페이지, 작성 폼</li>
<li>대시보드 레이아웃을 구성해 보세요 — 사이드바와 중첩 라우팅 활용</li>
<li>Server Actions로 CRUD 기능을 구현해 보세요</li>
</ol>
          `,
        },
      ],
    },
  ],
};
