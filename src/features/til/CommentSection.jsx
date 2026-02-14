import { useSyncExternalStore } from 'react';
import { useRevalidator } from 'react-router';
import { LikeButton } from './LikeButton';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import {
  subscribeOwnedCommentIds,
  getOwnedCommentIds,
  getOwnedCommentIdsServerSnapshot,
  addOwnedCommentId,
  removeOwnedCommentId,
} from '../../utils/comment';

function CommentSection({ tilId, comments, likes, hasLiked }) {
  const revalidator = useRevalidator();
  const ownedCommentIds = useSyncExternalStore(
    subscribeOwnedCommentIds,
    getOwnedCommentIds,
    getOwnedCommentIdsServerSnapshot,
  );

  const handleCommentCreated = (commentId) => {
    addOwnedCommentId(commentId);
    revalidator.revalidate();
  };

  const handleCommentDeleted = (commentId) => {
    removeOwnedCommentId(commentId);
    revalidator.revalidate();
  };

  return (
    <section className='mt-10 border-t border-gray-200 pt-10'>
      <div className='mb-6 flex items-center justify-between'>
        <LikeButton key={`${tilId}-${hasLiked}`} tilId={tilId} initialCount={likes} initialHasLiked={hasLiked} />
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
