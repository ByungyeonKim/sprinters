import { Link, useLoaderData } from 'react-router';
import { fetchMissionRankStudents } from '../services/student-service';
import { fetchPopularTilPosts } from '../services/til-service';
import { LikeCount } from '../components/LikeCount';
import { CommentCount } from '../components/CommentCount';
import { HomeHydrateFallback } from '../components/fallbacks';

const MISSION_RANK_COUNT = 10;

import { SITE_URL, OG_IMAGE, SITE_NAME, DEFAULT_DESCRIPTION } from '../root';

export function meta() {
  return [
    { title: SITE_NAME },
    { name: 'description', content: DEFAULT_DESCRIPTION },
    { property: 'og:title', content: SITE_NAME },
    { property: 'og:description', content: DEFAULT_DESCRIPTION },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function clientLoader() {
  const [students, popularPosts] = await Promise.all([
    fetchMissionRankStudents(),
    fetchPopularTilPosts(5),
  ]);

  return { students, popularPosts };
}

export { HomeHydrateFallback as HydrateFallback };

export default function Home() {
  const { students, popularPosts } = useLoaderData();
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
          <Link
            to='/mission'
            className='group text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600'
          >
            스프린트 미션
            <span className='ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
          <Link
            to='/til'
            className='group text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600'
          >
            Today I Learned
            <span className='ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1'>
              →
            </span>
          </Link>
        </div>
      </section>

      <section className='pt-12'>
        <div className='grid gap-16 md:grid-cols-2'>
          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>FE 22기 스프린트 미션 순위</h2>
              <Link
                to='/mission'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {students.slice(0, MISSION_RANK_COUNT).map((student, index) => (
                <a
                  key={student.id}
                  href={`https://github.com/${student.github}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center gap-3'
                >
                  <span className='basis-9 text-2xl font-bold text-gray-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className='h-12 w-12 rounded-full object-cover'
                  />
                  <span className='font-medium group-hover:underline'>
                    {student.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>스프린터 인기 TIL</h2>
              <Link
                to='/til'
                className='text-sm text-gray-500 hover:text-gray-900'
              >
                전체보기
              </Link>
            </div>
            <div className='space-y-6'>
              {popularPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/til/@${post.githubUsername}/${post.postNumber}`}
                  className='group flex items-start gap-4'
                >
                  <span className='text-2xl font-bold text-gray-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className='flex-1'>
                    <p className='mb-1 text-xs text-gray-500'>{post.author}</p>
                    <div className='flex justify-between'>
                      <h3 className='font-semibold group-hover:underline'>
                        {post.title}
                      </h3>
                      <div className='flex items-center gap-3 text-gray-400'>
                        <LikeCount count={post.likes} size='sm' />
                        <CommentCount count={post.comments} size='sm' />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
