import { Link } from 'react-router';
import { toast } from 'sonner';
import { useRevalidator } from 'react-router';
import { Code2 } from 'lucide-react';
import { deleteQnaQuestion } from './qna-service';
import { extractPlainText, hasCodeBlock } from './qna-content';
import { useAuth } from '../../hooks/use-auth';
import { DeleteButton } from '../til/DeleteButton';
import { LikeCount } from '../../components/LikeCount';
import { CommentCount } from '../../components/CommentCount';

type QnaQuestion = {
  id: string;
  userId: string;
  content: string;
  authorName: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
};

function QuestionCard({ question }: { question: QnaQuestion }) {
  const { user } = useAuth();
  const revalidator = useRevalidator();
  const isOwner = user?.id === question.userId;

  const handleDelete = async () => {
    if (!user?.id) return;
    await deleteQnaQuestion(question.id, user.id);
    toast.success('질문이 삭제되었습니다.');
    revalidator.revalidate();
  };

  const plainText = extractPlainText(question.content);
  const showCodeBadge = hasCodeBlock(question.content);

  return (
    <article className='relative rounded-lg border border-gray-200'>
      <Link to={`/qna/${question.id}`} className='group block p-6'>
        <div className='mb-4 flex items-center gap-3'>
          <img
            src={question.avatar}
            alt={question.authorName}
            className='h-10 w-10 rounded-full border border-gray-300 object-cover'
          />
          <div>
            <p className='text-sm font-medium'>{question.authorName}</p>
            <p className='text-sm text-gray-500'>{question.date}</p>
          </div>
        </div>
        <p className='mb-4 line-clamp-3 whitespace-pre-wrap leading-relaxed text-gray-800 group-hover:underline'>
          {plainText}
        </p>
        <div className='flex items-center gap-4 text-gray-500'>
          <LikeCount count={question.likes} />
          <CommentCount count={question.comments} />
          {showCodeBadge && (
            <span className='inline-flex items-center gap-1 text-xs text-gray-400'>
              <Code2 className='h-3.5 w-3.5' />
              코드 포함
            </span>
          )}
        </div>
      </Link>
      {isOwner && (
        <div className='absolute top-6 right-6'>
          <DeleteButton
            onDelete={handleDelete}
            title='질문을 삭제하시겠어요?'
            description='질문과 관련 댓글이 모두 삭제됩니다.'
          />
        </div>
      )}
    </article>
  );
}

export { QuestionCard };
