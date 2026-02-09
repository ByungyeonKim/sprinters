import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import { addTilLike, hasUserLikedTil, removeTilLike } from '../services/til-service';
import { HeartIcon } from './icons';

function LikeButton({ tilId, initialCount }) {
  const { user } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialCount);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setHasLiked(false);
      return () => {
        isMounted = false;
      };
    }

    hasUserLikedTil({ tilId, userId: user.id })
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
  }, [user, tilId]);

  const handleToggleLike = async () => {
    if (!user) return;

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
        hasLiked
          ? 'text-red-500'
          : 'text-gray-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
      }`}
      title={user ? undefined : '로그인이 필요합니다'}
    >
      <HeartIcon filled={hasLiked} />
      <span className='text-sm'>{likesCount}</span>
    </button>
  );
}

export { LikeButton };
