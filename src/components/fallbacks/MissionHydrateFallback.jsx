import { SkeletonCircle, SkeletonLine } from './SkeletonPrimitives';

function MissionHydrateFallback() {
  return (
    <div>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <h1 className='mb-3 text-4xl font-bold'>스프린트 미션</h1>
        <p className='text-gray-600'>
          다음 미션 하나만 더 해볼까요?
          <br /> 몇 개의 미션을 완료했는지 확인해보세요.
        </p>
      </header>
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
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
