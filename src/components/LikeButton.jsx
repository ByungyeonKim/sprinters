import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { addTilLike, removeTilLike } from '../services/til-service';
import { HeartIcon } from './icons';

function LikeButton({ tilId, initialCount, initialHasLiked = false }) {
  const { user } = useAuth();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialCount);

  const displayHasLiked = user ? hasLiked : false;

  const handleToggleLike = async () => {
    try {
      if (hasLiked) {
        await removeTilLike({ tilId, userId: user.id });
        setHasLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await addTilLike({ tilId, userId: user.id });
        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={!user}
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

export { LikeButton };
