import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import type { Route } from './+types/signout';

function isAuthRequired(path: string): boolean {
  if (path === '/til/new') return true;
  if (/^\/til\/@[^/]+\/\d+\/edit$/.test(path)) return true;
  return false;
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();

  const formData = await request.formData();
  const redirectTo = String(formData.get('redirectTo') || '/');
  const target = isAuthRequired(redirectTo) ? '/' : redirectTo;

  return redirect(target, { headers });
}
