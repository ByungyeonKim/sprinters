function CommentIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none'>
      <path
        d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export { CommentIcon };
