import { useState, useRef } from 'react';
import { useNavigate, data, redirect } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth';
import { createTilPost } from './til-service';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import { EditorHeader, PreviewToggle, ContentArea, FloatingTagInput } from './TilEditor';

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

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

export default function TILNew() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewRef = useRef(null);
  const textareaRef = useRef(null);

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

    const githubUsername = user.user_metadata?.user_name;

    try {
      const { postNumber } = await createTilPost({
        userId: user.id,
        title,
        content,
        rawTags: tags,
      });

      navigate(`/til/@${githubUsername}/${postNumber}`);
    } catch (error) {
      console.error('TIL 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <EditorHeader cancelTo='/til' submitLabel='작성 완료' isSubmitting={isSubmitting} />

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
