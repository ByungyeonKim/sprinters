import { useState } from 'react';
import { useNavigation, useSubmit, data, redirect } from 'react-router';
import { toast } from 'sonner';
import { syncTags } from './til-service';
import { sanitizeContent } from '../../utils/html.server';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import { EditorHeader, TiptapEditor, FloatingTagInput } from './TilEditor';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function meta() {
  const title = '새 글 작성 | Sprinters';
  const description = '오늘 배운 내용을 기록해보세요.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/til/new` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function loader({ request }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/til');
  }

  return data(null, { headers });
}

export async function action({ request }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/til');
  }

  const formData = await request.formData();
  const title = formData.get('title').trim();
  const content = sanitizeContent(formData.get('content'));
  const rawTags = formData.get('tags') || '';

  const { data: post, error } = await supabase
    .from('til_posts')
    .insert({ user_id: user.id, title, content })
    .select('id, post_number')
    .single();

  if (error) throw new Error('게시글 저장에 실패했습니다.');

  await syncTags(supabase, post.id, rawTags);

  const username = user.user_metadata?.user_name;
  return redirect(`/til/@${username}/${post.post_number}`, { headers });
}

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

export default function TILNew() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.info('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.set('title', title);
    formData.set('content', content);
    formData.set('tags', tags);

    submit(formData, { method: 'post' });
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <EditorHeader cancelTo='/til' submitLabel='작성 완료' isSubmitting={isSubmitting} onSave={handleSubmit} />

      <div className='mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-14 pb-20'>
        <div className='flex flex-1 flex-col rounded-xl bg-white px-8 py-10 shadow-sm'>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            placeholder='제목을 입력하세요'
            className='w-full border-none text-4xl font-bold placeholder:text-gray-300 focus:outline-none'
          />

          <TiptapEditor onUpdate={setContent} />
        </div>
      </div>

      <FloatingTagInput tags={tags} onTagsChange={setTags} />
    </div>
  );
}
