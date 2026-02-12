import { useMatches } from 'react-router';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const matches = useMatches();
  const user = matches[0]?.data?.user ?? null;

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo:
          window.location.origin +
          '/auth/callback?next=' +
          encodeURIComponent(window.location.pathname),
      },
    });
  }

  return { user, signInWithGitHub };
}
