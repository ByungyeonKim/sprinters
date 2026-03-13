import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();
  const requestCookies = parseCookieHeader(request.headers.get('Cookie') ?? '')
    .filter(
      (cookie): cookie is { name: string; value: string } =>
        typeof cookie.value === 'string',
    )
    .map(({ name, value }) => ({ name, value }));

  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return requestCookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );

  return { supabase, headers };
}
