import { useRouteLoaderData } from 'react-router';
import { supabase } from '../lib/supabase';
import type { RootLoaderData } from '../root';

export function useAuth() {
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const user = rootData?.user ?? null;

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
