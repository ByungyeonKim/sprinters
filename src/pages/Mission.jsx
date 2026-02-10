import { useLoaderData } from 'react-router';
import {
  ExternalLinkIcon,
  MissionCompleteIcon,
  MissionIncompleteIcon,
} from '../components/icons';

const TOTAL_MISSIONS = 13;

const GLOW_CLASSES = {
  'Basic 4': 'badge-glow-basic',
  'React 7': 'badge-glow-react',
  'Next 13': 'badge-glow-next',
};

const RANK_BADGES = [
  {
    emoji: '🥇',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
  },
  {
    emoji: '🥈',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border-gray-300',
  },
  {
    emoji: '🥉',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
  },
];

function Mission() {
  const { students } = useLoaderData();

  return (
    <section>
      <header className='mb-10 flex flex-col gap-6 border-b border-gray-200 py-10 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>스프린트 미션</h1>
          <p className='text-gray-600'>
            다음 미션 하나만 더 해볼까요?
            <br /> 몇 개의 미션을 완료했는지 확인해보세요.
          </p>
        </div>
        <div className='shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-sm'>
          <div className='mb-3 flex items-start gap-2'>
            <svg
              className='mt-0.5 size-4 shrink-0 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M12 16v-4' />
              <path d='M12 8h.01' />
            </svg>
            <p className='text-gray-600'>
              각 과정의 마지막 미션을 달성하면
              <br /> 해당 뱃지를 획득할 수 있어요.
            </p>
          </div>
          <div className='flex items-center gap-3 pl-6'>
            <span className='badge-glow-basic rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800'>
              Basic 4
            </span>
            <span className='badge-glow-react rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800'>
              React 7
            </span>
            <span className='badge-glow-next rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800'>
              Next 13
            </span>
          </div>
        </div>
      </header>

      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
        {students.map((student, index) => {
          const completedCount = student.mission;
          const incompleteCount = TOTAL_MISSIONS - completedCount;
          const badge = index < 3 ? RANK_BADGES[index] : null;

          return (
            <li key={student.id}>
              <a
                href={`https://github.com/${student.github}`}
                target='_blank'
                rel='noopener noreferrer'
                className='group relative flex rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-800'
              >
                {badge && (
                  <span
                    className={`absolute top-2 left-2 rounded-full border px-1.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.emoji} {index + 1}
                  </span>
                )}
                <ExternalLinkIcon className='absolute top-2 right-2 size-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100' />
                <div className='flex grow flex-col items-center'>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className='mb-3 h-16 w-16 rounded-full object-cover'
                  />
                  <div className='mb-2 flex items-center gap-2'>
                    <h2 className='font-semibold'>{student.name}</h2>
                    {student.currentTitle && (
                      <span
                        className={`rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800 ${
                          GLOW_CLASSES[student.currentTitle] ?? ''
                        }`}
                      >
                        {student.currentTitle}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <span className='flex items-center gap-1 text-green-500'>
                      <MissionCompleteIcon />
                      {completedCount}
                    </span>
                    <span className='flex items-center gap-1 text-rose-500'>
                      <MissionIncompleteIcon />
                      {incompleteCount}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { Mission };
