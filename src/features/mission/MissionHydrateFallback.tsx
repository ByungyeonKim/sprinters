import {
  SkeletonCircle,
  SkeletonLine,
} from '../../components/SkeletonPrimitives';

const SKELETON_COUNT = 16;

function MissionGridSkeleton() {
  return (
    <ul className='xs:grid-cols-2 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4'>
      {[...Array(SKELETON_COUNT)].map((_, i) => (
        <li key={i} className='flex rounded-lg border border-gray-200 p-4'>
          <div className='flex grow flex-col items-center'>
            <SkeletonCircle className='mb-3 h-16 w-16' />
            <SkeletonLine className='mb-2 h-4 w-16' />
            <SkeletonLine className='h-4 w-20' />
          </div>
        </li>
      ))}
    </ul>
  );
}

export { MissionGridSkeleton };
