import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  useSearchParams,
} from 'react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { createSupabaseServerClient } from './lib/supabase.server';
import './index.css';

export async function loader({ request }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return data({ user }, { headers });
}

export function headers({ loaderHeaders }) {
  return loaderHeaders;
}

export function Layout({ children }) {
  return (
    <html lang='ko'>
      <head>
        <meta charSet='UTF-8' />
        <link rel='icon' type='image/svg+xml' href='/logo.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link
          rel='stylesheet'
          as='style'
          crossOrigin='anonymous'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const SITE_URL = 'https://sprinters-hub.vercel.app';
const OG_IMAGE = `${SITE_URL}/sprinters-og.png`;
const SITE_NAME = 'Sprinters';
const DEFAULT_DESCRIPTION =
  'Learn, Write, Share. 혼자 고민하던 호기심부터 오늘 배운 작은 깨달음까지 기록하고, 공유해보세요.';

export { SITE_URL, OG_IMAGE, SITE_NAME, DEFAULT_DESCRIPTION };

export function meta() {
  return [
    { title: SITE_NAME },
    { name: 'description', content: DEFAULT_DESCRIPTION },
    { property: 'og:title', content: SITE_NAME },
    { property: 'og:description', content: DEFAULT_DESCRIPTION },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('auth_error')) {
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      searchParams.delete('auth_error');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  return (
    <div className='min-h-screen bg-white'>
      <Outlet />
      <Toaster />
    </div>
  );
}
