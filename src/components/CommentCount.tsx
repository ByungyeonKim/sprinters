import { CommentIcon } from './icons';

interface Props {
  count: number;
  size?: 'sm' | 'md';
}

function CommentCount({ count, size = 'md' }: Props) {
  const sizes = {
    sm: { icon: 'h-3.5 w-3.5', text: 'text-xs' },
    md: { icon: 'h-5 w-5', text: 'text-sm' },
  } as const;

  const { icon, text } = sizes[size];

  return (
    <span className='flex items-center gap-1'>
      <CommentIcon className={icon} />
      <span className={text}>{count}</span>
    </span>
  );
}

export { CommentCount };
