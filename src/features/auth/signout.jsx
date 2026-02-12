import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../../lib/supabase.server';

const AUTH_REQUIRED_PATHS = ['/til/new'];

export async function action({ request }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();

  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo') || '/';
  const target = AUTH_REQUIRED_PATHS.includes(redirectTo) ? '/' : redirectTo;

  return redirect(target, { headers });
}
