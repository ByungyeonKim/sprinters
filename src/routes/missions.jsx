import { useLoaderData } from 'react-router';
import { fetchMissionRankStudents } from '../services/student-service';
import { Mission } from '../components/Mission';
import { MissionsHeader } from '../components/MissionsHeader';
import { MissionHydrateFallback } from '../components/fallbacks';

const RANK_BADGES = [
  { emoji: '🥇', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { emoji: '🥈', className: 'bg-gray-100 text-gray-500 border-gray-300' },
  { emoji: '🥉', className: 'bg-orange-100 text-orange-700 border-orange-300' },
];

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../root';

export function meta() {
  const title = '스프린트 미션 | Sprinters';
  const description = '스프린트 미션 진행 상황을 한눈에 파악하고, 순위 경쟁을 해보세요.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/mission` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function clientLoader() {
  const students = await fetchMissionRankStudents();
  return { students };
}

export { MissionHydrateFallback as HydrateFallback };

export default function Missions() {
  const { students } = useLoaderData();

  return (
    <section>
      <MissionsHeader />

      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
        {students.map((student, index) => (
          <Mission
            key={student.id}
            student={student}
            badge={index < 3 ? RANK_BADGES[index] : null}
            rank={index + 1}
          />
        ))}
      </ul>
    </section>
  );
}
