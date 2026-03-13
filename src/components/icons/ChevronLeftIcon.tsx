function ChevronLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none'>
      <path
        d='M15 18l-6-6 6-6'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export { ChevronLeftIcon };
