import { SkeletonCircle, SkeletonLine } from '../../components/SkeletonPrimitives';

const MISSION_RANK_SKELETON_COUNT = 10;
const POPULAR_TIL_SKELETON_COUNT = 5;

function MissionRankSkeleton() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-bold'>FE 22기 스프린트 미션 순위</h2>
        <span className='text-sm text-gray-500'>전체보기</span>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        {[...Array(MISSION_RANK_SKELETON_COUNT)].map((_, i) => (
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
  );
}

function PopularTilSkeleton() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-bold'>스프린터 인기 TIL</h2>
        <span className='text-sm text-gray-500'>전체보기</span>
      </div>
      <div className='space-y-6'>
        {[...Array(POPULAR_TIL_SKELETON_COUNT)].map((_, i) => (
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
  );
}

export { MissionRankSkeleton, PopularTilSkeleton };
