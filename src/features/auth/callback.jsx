import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../../lib/supabase.server';

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/';

  if (url.searchParams.has('error_description')) {
    return redirect(`${next}?auth_error=1`);
  }

  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.exchangeCodeForSession(code);
    return redirect(next, { headers });
  }

  return redirect(next);
}
