import { startTransition, useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { Code2 } from 'lucide-react';
import { serializeQnaContent } from './qna-content';
import { useAuth } from '../../hooks/use-auth';
import { CodeAttachModal } from './CodeAttachModal';
import { CodeAttachPreview } from './CodeAttachPreview';
import { useCodeAttachment } from './use-code-attachment';

type QnaCommentFormProps = {
  questionId: string;
  onCommentCreated: (comment: {
    id: string;
    userId: string;
    author: string;
    avatar: string;
    content: string;
    contentHtml?: string;
    date: string;
  }) => void;
};

function QnaCommentForm({ questionId, onCommentCreated }: QnaCommentFormProps) {
  const { user } = useAuth();
  const fetcher = useFetcher();
  const [content, setContent] = useState('');
  const {
    codeBlocks,
    resetCodeBlocks,
    openAddModal,
    handleCodeEdit,
    handleCodeDelete,
    codeModalProps,
  } = useCodeAttachment();

  const authorName = user?.user_metadata?.user_name || user?.user_metadata?.name;
  const avatar = user?.user_metadata?.avatar_url;
  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;

    if (fetcher.data.comment) {
      startTransition(() => {
        setContent('');
        resetCodeBlocks();
        onCommentCreated?.(fetcher.data.comment);
      });
      return;
    }

    if (fetcher.data.error) {
      alert(fetcher.data.error);
    }
  }, [
    fetcher.data,
    fetcher.state,
    onCommentCreated,
    resetCodeBlocks,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    const formData = new FormData();
    formData.set('intent', 'create-comment');
    formData.set(
      'content',
      serializeQnaContent(content.trim(), codeBlocks),
    );

    fetcher.submit(formData, {
      method: 'post',
      action: `/qna/${questionId}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='mb-8'>
      <div className='mb-4 flex items-center gap-3'>
        <img
          src={avatar}
          alt={authorName}
          className='h-10 w-10 rounded-full object-cover'
        />
        <span className='text-sm font-medium text-gray-800'>{authorName}</span>
      </div>
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='답변을 작성해보세요.'
        className='w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-gray-500 focus:outline-none'
      />
      {codeBlocks.length > 0 && (
        <div className='mt-3 space-y-2'>
          {codeBlocks.map((block, index) => (
            <CodeAttachPreview
              key={index}
              index={index}
              codeBlock={block}
              onEdit={handleCodeEdit}
              onDelete={handleCodeDelete}
            />
          ))}
        </div>
      )}
      <div className='mt-3 flex items-center justify-between'>
        <button
          type='button'
          onClick={openAddModal}
          className='inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600'
        >
          <Code2 className='h-4 w-4' />
          코드 첨부
        </button>
        <button
          type='submit'
          disabled={isSubmitting || !content.trim()}
          className='rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? '작성 중...' : '댓글 남기기'}
        </button>
      </div>
      <CodeAttachModal {...codeModalProps} />
    </form>
  );
}

export { QnaCommentForm };
