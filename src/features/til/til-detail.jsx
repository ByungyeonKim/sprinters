import {
  Link,
  useLoaderData,
  useNavigate,
  data as routerData,
} from 'react-router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { fetchTilDetail, deleteTilPost } from './til-service';
import { sanitizeContent } from '../../utils/html.server';
import { highlightCodeBlocks } from '../../utils/shiki.server';
import { useAuth } from '../../hooks/use-auth';

import { CommentSection } from './CommentSection';
import { DeleteButton } from './DeleteButton';
import { ChevronLeftIcon } from '../../components/icons';
import { createSupabaseServerClient } from '../../lib/supabase.server';

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function meta({ data }) {
  if (!data?.post) {
    return [{ title: SITE_NAME }];
  }
  const { post } = data;
  const title = `${post.title} | Sprinters`;
  const url = `${SITE_URL}/til/@${post.githubUsername}/${post.postNumber}`;
  return [
    { title },
    { name: 'description', content: post.title },
    { property: 'og:title', content: title },
    { property: 'og:description', content: post.title },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function loader({ request, params }) {
  const { supabase: serverSupabase, headers } =
    createSupabaseServerClient(request);
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  const post = await fetchTilDetail({
    username: params.username,
    postNumber: params.postNumber,
  });
  const sanitizedContent = sanitizeContent(post.content);
  post.content = await highlightCodeBlocks(sanitizedContent);

  let hasLiked = false;
  if (user) {
    const { data: likeData } = await serverSupabase
      .from('til_likes')
      .select('id')
      .eq('til_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle();
    hasLiked = Boolean(likeData);
  }

  return routerData({ post, hasLiked }, { headers });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('copy failed');
  }
}

export default function TILDetail() {
  const { post, hasLiked } = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();
  const articleRef = useRef(null);

  const isAuthor = user?.user_metadata?.user_name === post.githubUsername;

  const handleDeletePost = async () => {
    await deleteTilPost({ postId: post.id });
    toast.success('게시글이 삭제되었습니다.');
    navigate('/til');
  };

  useEffect(() => {
    const articleElement = articleRef.current;
    if (!articleElement) return;

    const resetTimers = new Map();
    const resetCopyButton = (button) => {
      button.dataset.copied = 'false';
      button.setAttribute('aria-label', '코드 복사');
      button.setAttribute('title', '코드 복사');
    };

    const handleCopyClick = async (button) => {
      const preElement = button.closest('pre.shiki');
      const codeElement = preElement?.querySelector('code');
      const codeText = codeElement?.textContent || '';
      if (!codeText) return;

      try {
        await copyTextToClipboard(codeText);
      } catch {
        return;
      }

      button.dataset.copied = 'true';
      button.setAttribute('aria-label', '복사 완료');
      button.setAttribute('title', '복사 완료');

      const existingTimer = resetTimers.get(button);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      const nextTimer = window.setTimeout(() => {
        resetCopyButton(button);
        resetTimers.delete(button);
      }, 1500);

      resetTimers.set(button, nextTimer);
    };

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return;

      const copyButton = event.target.closest('[data-code-copy-button]');
      if (!(copyButton instanceof HTMLButtonElement)) return;
      if (!articleElement.contains(copyButton)) return;

      event.preventDefault();
      void handleCopyClick(copyButton);
    };

    articleElement.addEventListener('click', handleClick);

    return () => {
      articleElement.removeEventListener('click', handleClick);
      resetTimers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [post.content]);

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <Link
          to='/til'
          className='mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900'
        >
          <ChevronLeftIcon />
          목록으로
        </Link>
        <h1 className='mb-4 text-4xl font-bold'>{post.title}</h1>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <img
                src={post.avatar}
                alt={post.author}
                className='h-10 w-10 rounded-full object-cover'
              />
              <div>
                <p className='text-sm font-medium'>{post.author}</p>
                <p className='text-sm text-gray-500'>{post.date}</p>
              </div>
            </div>
            <div className='flex gap-2'>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {isAuthor && (
            <div className='flex items-center gap-2'>
              <Link
                to={`/til/@${post.githubUsername}/${post.postNumber}/edit`}
                className='text-sm text-gray-400 transition-colors hover:text-gray-900'
              >
                수정
              </Link>
              <DeleteButton
                onDelete={handleDeletePost}
                title='게시글을 삭제하시겠어요?'
                description='삭제된 게시글은 복구할 수 없습니다.'
              />
            </div>
          )}
        </div>
      </header>

      <article
        ref={articleRef}
        className='prose til-content max-w-none'
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentSection
        tilId={post.id}
        comments={post.comments}
        likes={post.likes}
        hasLiked={hasLiked}
      />
    </section>
  );
}
