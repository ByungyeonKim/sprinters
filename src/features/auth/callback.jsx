import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../../lib/supabase.server';

function getSafeNextPath(rawNext) {
  if (typeof rawNext !== 'string') {
    return '/';
  }

  const next = rawNext.trim();
  if (!next.startsWith('/')) {
    return '/';
  }

  // Block protocol-relative redirects and backslash-based bypasses.
  if (next.startsWith('//') || next.includes('\\')) {
    return '/';
  }

  if (next.includes('\n') || next.includes('\r')) {
    return '/';
  }

  return next;
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = getSafeNextPath(url.searchParams.get('next'));

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
