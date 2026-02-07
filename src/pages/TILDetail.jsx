import { useState, useEffect, useMemo } from 'react';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  addTilLike,
  createTilComment,
  deleteTilComment,
  deleteTilPost,
  hasUserLikedTil,
  removeTilLike,
} from '../services/tilService';
import { HeartIcon, RefreshIcon, ChevronLeftIcon } from '../components/icons';
import {
  generateSprinterNickname,
  generateSprinterAvatar,
  generateRandomSeed,
} from '../utils/sprinter';
import {
  addOwnedCommentId,
  getOwnedCommentIds,
  removeOwnedCommentId,
} from '../utils/commentOwnership';

function TILDetail() {
  const { post } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nicknameSeed, setNicknameSeed] = useState(generateRandomSeed);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [ownedCommentIds, setOwnedCommentIds] = useState(getOwnedCommentIds);

  const isAuthor = user?.user_metadata?.user_name === post.githubUsername;
  const ownedCommentIdSet = useMemo(
    () => new Set(ownedCommentIds),
    [ownedCommentIds],
  );

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setHasLiked(false);
      return () => {
        isMounted = false;
      };
    }

    hasUserLikedTil({ tilId: post.id, userId: user.id })
      .then((liked) => {
        if (isMounted) {
          setHasLiked(liked);
        }
      })
      .catch((error) => {
        console.error('좋아요 상태 확인 실패:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [user, post.id]);

  const nickname = generateSprinterNickname(nicknameSeed);
  const avatar = generateSprinterAvatar(nicknameSeed);

  const refreshNickname = () => {
    setNicknameSeed(generateRandomSeed());
  };

  const handleToggleLike = async () => {
    if (!user) return;

    try {
      if (hasLiked) {
        await removeTilLike({ tilId: post.id, userId: user.id });
        setHasLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await addTilLike({ tilId: post.id, userId: user.id });
        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
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
      const createdCommentId = await createTilComment({
        tilId: post.id,
        authorName: nickname,
        avatar,
        content: comment.trim(),
        deleteToken: getCommentDeleteToken(),
      });
      setOwnedCommentIds(addOwnedCommentId(createdCommentId));

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
      await deleteTilComment({
        commentId,
        deleteToken: getCommentDeleteToken(),
      });
      setOwnedCommentIds(removeOwnedCommentId(commentId));
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
      await deleteTilPost({ postId: post.id });
      navigate('/til');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

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
            <HeartIcon filled={hasLiked} />
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
              <RefreshIcon />
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
                    {ownedCommentIdSet.has(String(c.id)) && (
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
