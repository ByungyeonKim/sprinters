import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { Code2 } from 'lucide-react';
import { createQnaQuestion } from './qna-service';
import { serializeQnaContent } from './qna-content';
import { useAuth } from '../../hooks/use-auth';
import { RefreshIcon } from '../../components/icons';
import { CodeAttachModal } from './CodeAttachModal';
import { CodeAttachPreview } from './CodeAttachPreview';
import { useCodeAttachment } from './use-code-attachment';
import {
  generateSprinterNickname,
  generateSprinterAvatar,
  generateRandomSeed,
} from '../../utils/sprinter';

function QuestionForm() {
  const { user } = useAuth();
  const revalidator = useRevalidator();
  const [seed, setSeed] = useState(generateRandomSeed);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    codeBlocks,
    resetCodeBlocks,
    openAddModal,
    handleCodeEdit,
    handleCodeDelete,
    codeModalProps,
  } = useCodeAttachment();

  const nickname = generateSprinterNickname(seed);
  const avatar = generateSprinterAvatar(seed);

  const refreshProfile = () => {
    setSeed(generateRandomSeed());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim() || !user?.id) return;

    setIsSubmitting(true);

    try {
      await createQnaQuestion({
        userId: user.id,
        content: serializeQnaContent(content.trim(), codeBlocks),
        authorName: nickname,
        avatar,
      });

      setContent('');
      resetCodeBlocks();
      refreshProfile();
      revalidator.revalidate();
    } catch (error) {
      console.error('질문 작성 실패:', error);
      alert('질문 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-10 rounded-lg border border-gray-200 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3' suppressHydrationWarning>
          <img
            src={avatar}
            alt={nickname}
            className='h-12 w-12 rounded-full border border-gray-300 object-cover'
            suppressHydrationWarning
          />
          <span className='text-gray-800' suppressHydrationWarning>
            {nickname}
          </span>
        </div>
        <button
          type='button'
          onClick={refreshProfile}
          className='text-gray-400 transition-colors hover:text-gray-600'
          title='프로필 새로고침'
        >
          <RefreshIcon />
        </button>
      </div>
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='익명으로 자유롭게 질문해보세요.'
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
          {isSubmitting ? '작성 중...' : '질문하기'}
        </button>
      </div>
      <CodeAttachModal {...codeModalProps} />
    </form>
  );
}

export { QuestionForm };
