import {
  SkeletonAvatarMeta,
  SkeletonLine,
  SkeletonPill,
} from './SkeletonPrimitives';

const SKELETON_COUNT = 3;

function TILHydrateFallback() {
  return (
    <div className='mx-auto max-w-170'>
      <header className='mb-10 flex items-end justify-between border-b border-gray-200 py-10'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>Today I Learned</h1>
          <p className='text-gray-600'>
            오늘 배운 내용을 기록하고 공유하는 공간입니다.
          </p>
        </div>
      </header>
      <div className='space-y-10'>
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <article key={i}>
            <SkeletonAvatarMeta
              className='mb-4'
              firstLineClassName='h-4.5 w-16'
              secondLineClassName='h-4.5 w-12'
            />
            <SkeletonLine className='mb-3 h-8 w-64' />
            <div className='mb-4 space-y-3'>
              <SkeletonLine className='h-5 w-full' />
              <SkeletonLine className='h-5 w-3/4' />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <SkeletonPill className='h-6 w-14' />
                <SkeletonPill className='h-6 w-14' />
              </div>
              <SkeletonLine className='h-5 w-10' />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export { TILHydrateFallback };
