import { useState } from 'react';

function DeleteButton({ onDelete, confirmMessage = '삭제하시겠어요?' }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className='text-sm text-gray-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
    >
      {isDeleting ? '삭제 중...' : '삭제'}
    </button>
  );
}

export { DeleteButton };
