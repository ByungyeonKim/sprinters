import { useMatches, useNavigate, useRevalidator } from 'react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

const AUTH_REQUIRED_PATHS = ['/til/new'];

export function useAuth() {
  const matches = useMatches();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const user = matches[0]?.data?.user ?? null;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'INITIAL_SESSION') {
        revalidate();
      }
      if (event === 'SIGNED_OUT' && AUTH_REQUIRED_PATHS.includes(window.location.pathname)) {
        navigate('/til', { replace: true });
      }
    });

    // OAuth 콜백: 리스너 등록 전에 SIGNED_IN이 발생하는 race condition 방지
    // 서버는 아직 쿠키가 없어 user: null로 렌더링했지만, 클라이언트에서 코드 교환 후 쿠키가 설정된 경우
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        revalidate();
      }
    });

    // OAuth 에러 감지 (Supabase 서버 에러 등)
    const params = new URLSearchParams(window.location.search);
    if (params.has('error_description')) {
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, signInWithGitHub, signOut };
}
