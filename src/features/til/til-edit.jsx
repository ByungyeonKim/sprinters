import { useState } from 'react';
import { useLoaderData, useNavigation, useSubmit, data, redirect } from 'react-router';
import { toast } from 'sonner';
import { fetchTilDetail, syncTags } from './til-service';
import { sanitizeContent } from '../../utils/html.server';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import { EditorHeader, TiptapEditor, FloatingTagInput } from './TilEditor';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function meta({ data }) {
  if (!data?.post) {
    return [{ title: SITE_NAME }];
  }
  const { post } = data;
  const title = `글 수정 | Sprinters`;
  const description = post.title;
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `${SITE_URL}/til/@${post.githubUsername}/${post.postNumber}/edit`,
    },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function loader({ request, params }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/til');
  }

  const post = await fetchTilDetail({
    username: params.username,
    postNumber: params.postNumber,
  });

  const githubUsername = user.user_metadata?.user_name;
  if (post.githubUsername !== githubUsername) {
    throw redirect(`/til/@${post.githubUsername}/${post.postNumber}`);
  }

  return data({ post }, { headers });
}

export async function action({ request, params }) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/til');
  }

  const post = await fetchTilDetail({
    username: params.username,
    postNumber: params.postNumber,
  });

  if (post.githubUsername !== user.user_metadata?.user_name) {
    throw redirect(`/til/@${post.githubUsername}/${post.postNumber}`);
  }

  const formData = await request.formData();
  const title = formData.get('title').trim();
  const content = sanitizeContent(formData.get('content'));
  const rawTags = formData.get('tags') || '';

  const { error: postError } = await supabase
    .from('til_posts')
    .update({ title, content })
    .eq('id', post.id);

  if (postError) throw new Error('게시글 수정에 실패했습니다.');

  await supabase.from('til_tags').delete().eq('til_id', post.id);
  await syncTags(supabase, post.id, rawTags);

  return redirect(`/til/@${post.githubUsername}/${post.postNumber}`, { headers });
}

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

export default function TILEdit() {
  const { post } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags.join(', '));

  const detailPath = `/til/@${post.githubUsername}/${post.postNumber}`;

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
      <EditorHeader cancelTo={detailPath} submitLabel='수정 완료' isSubmitting={isSubmitting} onSave={handleSubmit} />

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

          <TiptapEditor initialContent={post.content} onUpdate={setContent} />
        </div>
      </div>

      <FloatingTagInput tags={tags} onTagsChange={setTags} />
    </div>
  );
}
