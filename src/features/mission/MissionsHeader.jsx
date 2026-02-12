import { MissionBadge } from './MissionBadge';
import { InfoIcon } from '../../components/icons';

function MissionsHeader() {
  return (
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
          <InfoIcon className='mt-0.5 size-4 shrink-0 text-gray-400' />
          <p className='text-gray-600'>
            각 과정의 마지막 미션을 달성하면
            <br /> 해당 뱃지를 획득할 수 있어요.
          </p>
        </div>
        <div className='flex items-center gap-3 pl-6'>
          <MissionBadge title='Basic 4' />
          <MissionBadge title='React 7' />
          <MissionBadge title='Next 13' />
        </div>
        <a
          href='https://github.com/codeit-bootcamp-frontend/22-Sprint-Mission/pulls'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-flex items-center gap-1 pl-6 text-gray-500 hover:text-gray-900'
        >
          <span>&rarr;</span>
          <span className='underline underline-offset-2'>
            제출한 미션 확인하기
          </span>
        </a>
      </div>
    </header>
  );
}

export { MissionsHeader };
