import { AlertDialogDestructive } from '../../components/AlertDialogDestructive';

type DeleteButtonProps = {
  onDelete: () => void;
  title: string;
  description: string;
};

function DeleteButton({ onDelete, title, description }: DeleteButtonProps) {
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
