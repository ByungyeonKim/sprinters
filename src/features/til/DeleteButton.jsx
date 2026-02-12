import { AlertDialogDestructive } from '../../components/AlertDialogDestructive';

function DeleteButton({ onDelete, title, description }) {
  return (
    <AlertDialogDestructive
      onConfirm={onDelete}
      title={title}
      description={description}
    >
      <button
        className='text-sm text-gray-400 transition-colors hover:text-red-500'
      >
        삭제
      </button>
    </AlertDialogDestructive>
  );
}

export { DeleteButton };
