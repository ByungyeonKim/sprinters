import {
  SkeletonAvatarMeta,
  SkeletonLine,
  SkeletonPill,
} from './SkeletonPrimitives';

function TILDetailHydrateFallback() {
  return (
    <div className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <SkeletonLine className='mb-6 h-4 w-20' />
        <SkeletonLine className='mb-4 h-10 w-96' />
        <div className='flex items-center gap-4'>
          <SkeletonAvatarMeta />
          <div className='flex gap-2'>
            <SkeletonPill className='h-6 w-14' />
            <SkeletonPill className='h-6 w-14' />
          </div>
        </div>
      </header>
      <div className='space-y-4'>
        <SkeletonLine className='h-5 w-full' />
        <SkeletonLine className='h-5 w-full' />
        <SkeletonLine className='h-5 w-3/4' />
        <SkeletonLine className='h-5 w-full' />
        <SkeletonLine className='h-5 w-5/6' />
      </div>
    </div>
  );
}

export { TILDetailHydrateFallback };
