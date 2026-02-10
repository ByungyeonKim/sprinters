import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { LikeButton } from './LikeButton';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import {
  getOwnedCommentIds,
  addOwnedCommentId,
  removeOwnedCommentId,
} from '../utils/comment';

function CommentSection({ tilId, comments, likes }) {
  const revalidator = useRevalidator();
  const [ownedCommentIds, setOwnedCommentIds] = useState(getOwnedCommentIds);

  const handleCommentCreated = (commentId) => {
    addOwnedCommentId(commentId);
    setOwnedCommentIds((prev) => [...prev, commentId]);
    revalidator.revalidate();
  };

  const handleCommentDeleted = (commentId) => {
    removeOwnedCommentId(commentId);
    setOwnedCommentIds((prev) => prev.filter((id) => id !== commentId));
    revalidator.revalidate();
  };

  return (
    <section className='mt-10 border-t border-gray-200 pt-10'>
      <div className='mb-6 flex items-center justify-between'>
        <LikeButton tilId={tilId} initialCount={likes} />
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
