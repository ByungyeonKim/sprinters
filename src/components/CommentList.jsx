import { useState, useMemo, useEffect } from 'react';
import { deleteTilComment } from '../services/til-service';
import {
  getOwnedCommentIds,
  removeOwnedCommentId,
} from '../utils/comment';

function getCommentDeleteToken() {
  const key = 'sprintersCommentDeleteToken';
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

function CommentList({ comments, onCommentDeleted }) {
  const [ownedCommentIds, setOwnedCommentIds] = useState(getOwnedCommentIds);

  useEffect(() => {
    setOwnedCommentIds(getOwnedCommentIds());
  }, [comments]);

  const ownedCommentIdSet = useMemo(
    () => new Set(ownedCommentIds),
    [ownedCommentIds],
  );

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
      onCommentDeleted?.();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (!comments?.length) {
    return (
      <p className='text-center text-gray-500'>
        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
      </p>
    );
  }

  return (
    <div className='space-y-6'>
      {comments.map((c) => (
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
  );
}

export { CommentList };
