import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../../lib/supabase.server';

function isAuthRequired(path) {
  if (path === '/til/new') return true;
  if (/^\/til\/@[^/]+\/\d+\/edit$/.test(path)) return true;
  return false;
}

export async function action({ request }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();

  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo') || '/';
  const target = isAuthRequired(redirectTo) ? '/' : redirectTo;

  return redirect(target, { headers });
}
