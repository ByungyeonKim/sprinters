import { useSyncExternalStore } from 'react';
import { useRevalidator } from 'react-router';
import { LikeButton } from '../../components/LikeButton';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { addTilLike, removeTilLike } from './til-service';
import {
  subscribeOwnedCommentIds,
  getOwnedCommentIds,
  getOwnedCommentIdsServerSnapshot,
  addOwnedCommentId,
  removeOwnedCommentId,
} from '../../utils/comment';

type TilComment = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
};

type CommentSectionProps = {
  tilId: number;
  comments: TilComment[];
  likes: number;
  hasLiked: boolean;
};

function CommentSection({ tilId, comments, likes, hasLiked }: CommentSectionProps) {
  const revalidator = useRevalidator();
  const ownedCommentIds = useSyncExternalStore(
    subscribeOwnedCommentIds,
    getOwnedCommentIds,
    getOwnedCommentIdsServerSnapshot,
  );

  const handleCommentCreated = (commentId: number) => {
    addOwnedCommentId(commentId);
    revalidator.revalidate();
  };

  const handleCommentDeleted = (commentId: number) => {
    removeOwnedCommentId(commentId);
    revalidator.revalidate();
  };

  return (
    <section className='mt-10 border-t border-gray-200 pt-10'>
      <div className='mb-6 flex items-center justify-between'>
        <LikeButton
          key={`${tilId}-${hasLiked}`}
          onLike={(userId: string) => addTilLike({ tilId, userId })}
          onUnlike={(userId: string) => removeTilLike({ tilId, userId })}
          initialCount={likes}
          initialHasLiked={hasLiked}
        />
        <h2 className='text-lg font-bold'>
          댓글({comments?.length || 0})
        </h2>
      </div>

      <CommentForm tilId={tilId} onCommentCreated={handleCommentCreated} />
      <CommentList
        comments={comments}
        ownedCommentIds={ownedCommentIds}
        onCommentDeleted={handleCommentDeleted}
      />
    </section>
  );
}

export { CommentSection };
