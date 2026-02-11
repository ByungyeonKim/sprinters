import { useState } from 'react';
import { createTilComment } from '../services/til-service';
import { RefreshIcon } from './icons';
import {
  generateSprinterNickname,
  generateSprinterAvatar,
  generateRandomSeed,
} from '../utils/sprinter';

function getCommentDeleteToken() {
  const key = 'sprintersCommentDeleteToken';
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

function CommentForm({ tilId, onCommentCreated }) {
  const [seed, setSeed] = useState(generateRandomSeed);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nickname = generateSprinterNickname(seed);
  const avatar = generateSprinterAvatar(seed);

  const refreshNickname = () => {
    setSeed(generateRandomSeed());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdCommentId = await createTilComment({
        tilId,
        authorName: nickname,
        avatar,
        content: comment.trim(),
        deleteToken: getCommentDeleteToken(),
      });

      setComment('');
      refreshNickname();
      onCommentCreated?.(createdCommentId);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-8'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3' suppressHydrationWarning>
          <img
            src={avatar}
            alt={nickname}
            className='h-12 w-12 rounded-full border border-gray-300 object-cover'
            suppressHydrationWarning
          />
          <span className='text-gray-800' suppressHydrationWarning>{nickname}</span>
        </div>
        <button
          type='button'
          onClick={refreshNickname}
          className='text-gray-400 transition-colors hover:text-gray-600'
          title='닉네임 새로고침'
        >
          <RefreshIcon />
        </button>
      </div>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='로그인 없이 누구나 작성할 수 있어요. 부적절한 내용은 별도 동의나 사전 안내 없이 삭제될 수 있어요.'
        className='w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-gray-500 focus:outline-none'
      />
      <div className='mt-3 flex justify-end'>
        <button
          type='submit'
          disabled={isSubmitting || !comment.trim()}
          className='rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? '작성 중...' : '댓글 남기기'}
        </button>
      </div>
    </form>
  );
}

export { CommentForm };
