import { useMatches } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const matches = useMatches();
  const serverUser = matches[0]?.data?.user ?? null;

  const [user, setUser] = useState(serverUser);

  // 서버 데이터 변경 시 동기화 (페이지 네비게이션)
  useEffect(() => {
    setUser(serverUser);
  }, [serverUser?.id]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
      }
    });

    // OAuth 콜백 처리: getSession()은 초기화(코드 교환 포함) 완료를 기다림
    // SIGNED_IN 이벤트가 리스너 등록 전에 발생하는 race condition 방지
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser((prev) => {
        const newUser = session?.user ?? null;
        if (prev?.id === newUser?.id) return prev;
        return newUser;
      });
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

  return {
    user,
    loading: false,
    signInWithGitHub,
    signOut,
  };
}
