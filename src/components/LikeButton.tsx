import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { HeartIcon } from './icons';

interface Props {
  onLike: (userId: string) => Promise<void> | void;
  onUnlike: (userId: string) => Promise<void> | void;
  initialCount: number;
  initialHasLiked?: boolean;
}

export function LikeButton({ onLike, onUnlike, initialCount, initialHasLiked = false }: Props) {
  const { user } = useAuth();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayHasLiked = user ? hasLiked : false;

  const handleToggleLike = async () => {
    if (isSubmitting || !user) return;
    setIsSubmitting(true);
    try {
      if (hasLiked) {
        await onUnlike(user.id);
        setHasLiked(false);
        setLikesCount((prev: number) => Math.max(0, prev - 1));
      } else {
        await onLike(user.id);
        setHasLiked(true);
        setLikesCount((prev: number) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={!user || isSubmitting}
      className={`flex items-center gap-1 transition-colors ${
        displayHasLiked
          ? 'text-red-500'
          : 'text-gray-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
      }`}
      title={user ? undefined : '로그인이 필요합니다'}
    >
      <HeartIcon filled={displayHasLiked} />
      <span className='text-sm'>{likesCount}</span>
    </button>
  );
}
