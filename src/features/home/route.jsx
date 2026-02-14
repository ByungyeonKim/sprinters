import { Suspense } from 'react';
import { Link, useLoaderData, Await } from 'react-router';
import sprintHero from '../../assets/sprint-hero.jpg';
import { fetchMissionRankStudents } from '../mission/student-service';
import { fetchPopularTilPosts } from '../til/til-service';
import { LikeCount } from '../../components/LikeCount';
import { CommentCount } from '../../components/CommentCount';
import { MissionRankSkeleton, PopularTilSkeleton } from './HomeHydrateFallback';

const MISSION_RANK_COUNT = 10;

import { SITE_URL, OG_IMAGE, SITE_NAME, DEFAULT_DESCRIPTION } from '../../root';

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

export function loader() {
  return {
    studentsPromise: fetchMissionRankStudents(),
    popularPostsPromise: fetchPopularTilPosts(5),
  };
}

export default function Home() {
  const { studentsPromise, popularPostsPromise } = useLoaderData();
  return (
    <div>
      <section className='border-b border-gray-200 pb-10'>
        <img
          src={sprintHero}
          alt=''
          className='mb-8 h-64 w-full rounded-2xl object-cover'
        />
        <div className='flex items-baseline justify-between'>
          <h1 className='text-4xl font-bold'>Learn, Write, Share.</h1>
          <p className='text-lg text-gray-600'>
            혼자 고민하던 호기심부터 오늘 배운 작은 깨달음까지 기록하고,
            공유해보세요.
          </p>
        </div>
      </section>

      <section className='pt-12'>
        <div className='grid gap-16 md:grid-cols-2'>
          <Suspense fallback={<MissionRankSkeleton />}>
            <Await resolve={studentsPromise}>
              {(students) => (
                <div>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-lg font-bold'>
                      FE 22기 스프린트 미션 순위
                    </h2>
                    <Link
                      to='/mission'
                      className='text-sm text-gray-500 hover:text-gray-900'
                    >
                      전체보기
                    </Link>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    {students
                      .slice(0, MISSION_RANK_COUNT)
                      .map((student, index) => (
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
              )}
            </Await>
          </Suspense>

          <Suspense fallback={<PopularTilSkeleton />}>
            <Await resolve={popularPostsPromise}>
              {(popularPosts) => (
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
                          <p className='mb-1 text-xs text-gray-500'>
                            {post.author}
                          </p>
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
              )}
            </Await>
          </Suspense>
        </div>
      </section>
    </div>
  );
}
