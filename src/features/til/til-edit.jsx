import { useState, useRef } from 'react';
import { useLoaderData, useNavigate, data, redirect } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth';
import { fetchTilDetail, updateTilPost } from './til-service';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import { EditorHeader, PreviewToggle, ContentArea, FloatingTagInput } from './TilEditor';

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

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

export default function TILEdit() {
  const { post } = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags.join(', '));
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  const detailPath = `/til/@${post.githubUsername}/${post.postNumber}`;

  const handleTabKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPreview(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPreview(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.info('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTilPost({
        postId: post.id,
        title,
        content,
        rawTags: tags,
      });

      navigate(detailPath);
    } catch (error) {
      console.error('TIL 수정 실패:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <EditorHeader cancelTo={detailPath} submitLabel='수정 완료' isSubmitting={isSubmitting} />

      <div className='mx-auto max-w-prose px-6 pb-16'>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          placeholder='제목을 입력하세요'
          className='mt-14 w-full border-none text-4xl font-bold placeholder:text-gray-300 focus:outline-none'
        />

        <PreviewToggle isPreview={isPreview} onToggle={setIsPreview} />
        <ContentArea
          isPreview={isPreview}
          content={content}
          previewRef={previewRef}
          textareaRef={textareaRef}
          onContentChange={setContent}
          onKeyDown={handleTabKeyDown}
        />
      </div>

      <FloatingTagInput tags={tags} onTagsChange={setTags} />
    </form>
  );
}
