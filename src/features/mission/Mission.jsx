import {
  ExternalLinkIcon,
  MissionCompleteIcon,
  MissionIncompleteIcon,
} from '../../components/icons';
import { MissionBadge } from './MissionBadge';

const TOTAL_MISSIONS = 13;

function Mission({ student, badge, rank }) {
  const completedCount = student.mission;
  const incompleteCount = TOTAL_MISSIONS - completedCount;

  return (
    <li>
      <a
        href={`https://github.com/${student.github}`}
        target='_blank'
        rel='noopener noreferrer'
        className='group relative flex rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-800'
      >
        {badge && (
          <span
            className={`absolute top-2 left-2 rounded-full border px-1.5 py-0.5 text-xs font-semibold ${badge.className}`}
          >
            {badge.emoji} {rank}
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
              <MissionBadge title={student.currentTitle} />
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
}

export { Mission };
