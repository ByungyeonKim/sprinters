import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

type SidebarToggleButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function SidebarToggleButton({ isOpen, onToggle }: SidebarToggleButtonProps) {
  const label = isOpen ? '사이드바 닫기' : '사이드바 열기';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className='sticky top-3 left-3 z-10 hidden h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700 lg:flex'
            aria-label={label}
          >
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              {isOpen ? (
                <>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3 4h18M3 12h12M3 20h18' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-3 3 3 3' />
                </>
              ) : (
                <>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3 4h18M3 12h12M3 20h18' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M17 9l3 3-3 3' />
                </>
              )}
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side='right' sideOffset={6}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
