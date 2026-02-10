import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';

export function AlertDialogDestructive({ onConfirm, title, description, children }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onConfirm?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='outline' disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
