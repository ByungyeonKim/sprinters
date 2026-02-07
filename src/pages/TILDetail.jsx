import { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  HeartIcon,
  RefreshIcon,
  ChevronLeftIcon,
} from '../components/icons';

const sprinterDescriptors = [
  '열심히뛰는',
  '잠깐쉬는',
  '출발만빠른',
  '방향잃은',
  '오늘도달리는',
  '숨고르는',
  '다시뛰는',
  '스트레칭중인',
  '전력질주중인',
  '커피한잔더마신',
  '새벽4시인',
  '일단커밋한',
  'GPT한테물어본',
  '스택오버플로복붙한',
  '에러메시지구글링중인',
  '어제푸시안한',
  '머지충돌난',
  '코드리뷰피하는',
  'npm install만세번째인',
  '주석으로도망친',
  'TODO만늘어나는',
  '야근각잡은',
  '일단돌아가긴하는',
  '디버깅포기한',
  '리팩토링미룬',
  '테스트코드없는',
  '미션깜빡한',
];

function generateSprinterNickname(seed) {
  const index = seed % sprinterDescriptors.length;
  return `${sprinterDescriptors[index]} 스프린터`;
}

function generateSprinterAvatar(seed) {
  const index = (seed % 10) + 1;
  const paddedIndex = String(index).padStart(2, '0');
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatar/sprinter-${paddedIndex}.png`;
}

function TILDetail() {
  const { post } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nicknameSeed, setNicknameSeed] = useState(() =>
    Math.floor(Math.random() * 100),
  );
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const isAuthor = user?.user_metadata?.user_name === post.githubUsername;

  useEffect(() => {
    if (!user) return;

    supabase
      .from('til_likes')
      .select('id')
      .eq('til_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHasLiked(!!data);
      });
  }, [user, post.id]);

  const nickname = generateSprinterNickname(nicknameSeed);
  const avatar = generateSprinterAvatar(nicknameSeed);

  const refreshNickname = () => {
    setNicknameSeed(Math.floor(Math.random() * 100));
  };

  const handleToggleLike = async () => {
    if (!user) return;

    if (hasLiked) {
      const { error } = await supabase
        .from('til_likes')
        .delete()
        .eq('til_id', post.id)
        .eq('user_id', user.id);

      if (!error) {
        setHasLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } else {
      const { error } = await supabase.from('til_likes').insert({
        til_id: post.id,
        user_id: user.id,
      });

      if (!error) {
        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    }
  };

  const getCommentDeleteToken = () => {
    const key = 'sprintersCommentDeleteToken';
    let token = localStorage.getItem(key);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(key, token);
    }
    return token;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('til_comments').insert({
        til_id: post.id,
        author_name: nickname,
        avatar: avatar,
        content: comment.trim(),
        delete_token: getCommentDeleteToken(),
      });

      if (error) throw error;

      setComment('');
      refreshNickname();
      revalidator.revalidate();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠어요?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('til_comments')
        .delete()
        .eq('id', commentId)
        .eq('delete_token', getCommentDeleteToken());

      if (error) throw error;

      revalidator.revalidate();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('게시글을 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('til_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      navigate('/til');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  const myDeleteToken = getCommentDeleteToken();

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <Link
          to='/til'
          className='mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900'
        >
          <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15 18l-6-6 6-6'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
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
            <button
              onClick={handleDeletePost}
              disabled={isDeleting}
              className='text-sm text-gray-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          )}
        </div>
      </header>

      <article className='prose max-w-none'>
        <MarkdownRenderer content={post.content} />
      </article>

      <section className='mt-10 border-t border-gray-200 pt-10'>
        <div className='mb-6 flex items-center justify-between'>
          <button
            onClick={handleToggleLike}
            disabled={!user}
            className={`flex items-center gap-1 transition-colors ${
              hasLiked
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
            }`}
            title={user ? undefined : '로그인이 필요합니다'}
          >
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill={hasLiked ? 'currentColor' : 'none'}
            >
              <path
                d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-sm'>{likesCount}</span>
          </button>

          <h2 className='text-lg font-bold'>
            댓글({post.comments?.length || 0})
          </h2>
        </div>

        <form onSubmit={handleSubmitComment} className='mb-8'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <img
                src={avatar}
                alt={nickname}
                className='h-12 w-12 rounded-full border border-gray-300 object-cover'
              />
              <span className='text-gray-800'>{nickname}</span>
            </div>
            <button
              type='button'
              onClick={refreshNickname}
              className='text-gray-400 transition-colors hover:text-gray-600'
              title='닉네임 새로고침'
            >
              <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='댓글을 작성해주세요'
            className='w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-gray-500 focus:outline-none'
          />
          <div className='mt-3 flex justify-end'>
            <button
              type='submit'
              disabled={isSubmitting || !comment.trim()}
              className='rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? '작성 중...' : '댓글 남기기'}
            </button>
          </div>
        </form>

        {post.comments?.length > 0 ? (
          <div className='space-y-6'>
            {post.comments.map((c) => (
              <div key={c.id} className='flex gap-3'>
                <img
                  src={c.avatar}
                  alt={c.author}
                  className='h-10 w-10 shrink-0 rounded-full border border-gray-300 object-cover'
                />
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <span className='text-sm font-medium'>{c.author}</span>
                    <span className='text-sm text-gray-500'>{c.date}</span>
                    {c.deleteToken === myDeleteToken && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className='text-sm text-gray-400 transition-colors hover:text-red-500'
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <p className='text-gray-600'>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-500'>
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </p>
        )}
      </section>
    </section>
  );
}

export { TILDetail };
