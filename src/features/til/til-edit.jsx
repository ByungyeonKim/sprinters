import { useState, useRef, useEffect } from 'react';
import { Link, useLoaderData, useNavigate, data, redirect } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { MarkdownRenderer } from './MarkdownRenderer';
import { fetchTilDetail, updateTilPost } from './til-service';
import { createSupabaseServerClient } from '../../lib/supabase.server';

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

  useEffect(() => {
    if (isPreview) {
      previewRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [isPreview]);

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
      alert('제목과 내용을 모두 입력해주세요.');
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
      <header className='sticky top-0 z-10 border-b border-gray-200 bg-white'>
        <div className='mx-auto flex h-14 max-w-300 items-center justify-between px-6'>
          <Link
            to={detailPath}
            className='text-sm text-gray-500 hover:text-gray-900'
          >
            취소
          </Link>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </header>

      <div className='mx-auto max-w-prose px-6 pb-16'>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='제목'
          className='mt-8 w-full border-none text-4xl font-bold placeholder:text-gray-300 focus:outline-none'
        />

        <div className='mt-6 flex gap-1'>
          <button
            type='button'
            onClick={() => setIsPreview(false)}
            className={`rounded px-3 py-1 text-sm ${
              !isPreview
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            작성
          </button>
          <button
            type='button'
            onClick={() => setIsPreview(true)}
            className={`rounded px-3 py-1 text-sm ${
              isPreview
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            미리보기
          </button>
        </div>

        {isPreview ? (
          <div
            ref={previewRef}
            tabIndex={0}
            onKeyDown={handleTabKeyDown}
            className='prose mt-4 min-h-64 w-full max-w-none focus:outline-none'
          >
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className='text-gray-400'>미리볼 내용이 없습니다.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleTabKeyDown}
            placeholder='내용을 입력하세요...'
            className='mt-4 field-sizing-content min-h-64 w-full resize-none border-none text-lg leading-relaxed placeholder:text-gray-300 focus:outline-none'
          />
        )}
      </div>

      <div className='fixed bottom-4 left-1/2 w-full max-w-prose -translate-x-1/2 px-6'>
        <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg'>
          <input
            type='text'
            id='tags'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            autoComplete='off'
            placeholder='태그를 입력하세요 (쉼표로 구분)'
            className='w-full border-none text-sm text-gray-500 placeholder:text-gray-300 focus:outline-none'
          />
        </div>
      </div>
    </form>
  );
}
