import { SkeletonCircle, SkeletonLine } from './SkeletonPrimitives';

function HomeHydrateFallback() {
  return (
    <div>
      <section className='border-b border-gray-200 pt-10 pb-10'>
        <h1 className='mb-8 text-[62px] leading-none font-bold'>
          Always Moving
          <br />
          Forward.
        </h1>
        <p className='mb-8 max-w-lg text-xl text-gray-600'>
          혼자 고민하던 호기심부터
          <br />
          오늘 배운 작은 깨달음까지 기록하고, 공유해보세요.
        </p>
        <div className='flex gap-6'>
          <span className='text-gray-900 underline underline-offset-4'>
            스프린트 미션
            <span className='ml-1 inline-block'>→</span>
          </span>
          <span className='text-gray-900 underline underline-offset-4'>
            Today I Learned
            <span className='ml-1 inline-block'>→</span>
          </span>
        </div>
      </section>

      <section className='pt-12'>
        <div className='grid grid-cols-2 gap-16'>
          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>FE 22기 스프린트 미션 순위</h2>
              <span className='text-sm text-gray-500'>전체보기</span>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {[...Array(10)].map((_, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <span className='basis-9 text-2xl font-bold text-gray-200'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <SkeletonCircle className='h-12 w-12' />
                  <SkeletonLine className='h-4 w-16' />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>스프린터 인기 TIL</h2>
              <span className='text-sm text-gray-500'>전체보기</span>
            </div>
            <div className='space-y-6'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-start gap-4'>
                  <span className='text-2xl font-bold text-gray-200'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className='grow'>
                    <SkeletonLine className='mb-1 h-4 w-18' />
                    <div className='flex justify-between'>
                      <SkeletonLine className='h-6 w-60' />
                      <SkeletonLine className='h-6 w-15.5' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export { HomeHydrateFallback };
