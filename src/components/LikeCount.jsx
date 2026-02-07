import { HeartIcon } from './icons';

function LikeCount({ count, size = 'md' }) {
  const sizes = {
    sm: { icon: 'h-3.5 w-3.5', text: 'text-xs' },
    md: { icon: 'h-5 w-5', text: 'text-sm' },
  };

  const { icon, text } = sizes[size];

  return (
    <span className='flex items-center gap-1'>
      <HeartIcon className={icon} />
      <span className={text}>{count}</span>
    </span>
  );
}

export { LikeCount };
