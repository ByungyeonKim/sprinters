import { SkeletonCircle, SkeletonLine } from './SkeletonPrimitives';

function MissionHydrateFallback() {
  return (
    <div>
      <header className='mb-10 flex flex-col gap-6 border-b border-gray-200 py-10 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>스프린트 미션</h1>
          <p className='text-gray-600'>
            다음 미션 하나만 더 해볼까요?
            <br /> 몇 개의 미션을 완료했는지 확인해보세요.
          </p>
        </div>
        <div className='shrink-0 rounded-lg bg-gray-50 px-5 py-4 text-sm'>
          <SkeletonLine className='mb-2 h-4 w-48' />
          <div className='flex items-center gap-3'>
            <SkeletonLine className='h-4 w-12 rounded' />
            <SkeletonLine className='h-4 w-14 rounded' />
            <SkeletonLine className='h-4 w-12 rounded' />
          </div>
        </div>
      </header>
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
        {[...Array(15)].map((_, i) => (
          <li key={i} className='flex rounded-lg border border-gray-200 p-4'>
            <div className='flex grow flex-col items-center'>
              <SkeletonCircle className='mb-3 h-16 w-16' />
              <SkeletonLine className='mb-2 h-4 w-16' />
              <SkeletonLine className='h-4 w-20' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MissionHydrateFallback };
