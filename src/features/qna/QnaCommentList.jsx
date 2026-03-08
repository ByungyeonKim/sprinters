import { toast } from 'sonner';
import { deleteQnaComment } from './qna-service';
import { useAuth } from '../../hooks/use-auth';
import { DeleteButton } from '../til/DeleteButton';

function QnaCommentList({ comments, onCommentDeleted }) {
  const { user } = useAuth();

  const handleDelete = async (commentId) => {
    if (!user?.id) return;

    await deleteQnaComment(commentId, user.id);
    toast.success('댓글이 삭제되었습니다.');
    onCommentDeleted?.(commentId);
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
            className='h-10 w-10 shrink-0 rounded-full object-cover'
          />
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <span className='text-sm font-medium'>{c.author}</span>
              <span className='text-sm text-gray-500'>{c.date}</span>
              {user?.id === c.userId && (
                <DeleteButton
                  onDelete={() => handleDelete(c.id)}
                  title='댓글을 삭제하시겠어요?'
                  description='삭제된 댓글은 복구할 수 없습니다.'
                />
              )}
            </div>
            <div
              className='qna-content text-gray-600'
              dangerouslySetInnerHTML={{ __html: c.contentHtml }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { QnaCommentList };
