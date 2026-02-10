import { useLoaderData } from 'react-router';
import { fetchMissionRankStudents } from '../services/student-service';
import { Mission } from '../components/Mission';
import { MissionsHeader } from '../components/MissionsHeader';
const RANK_BADGES = [
  { emoji: '🥇', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { emoji: '🥈', className: 'bg-gray-100 text-gray-500 border-gray-300' },
  { emoji: '🥉', className: 'bg-orange-100 text-orange-700 border-orange-300' },
];

export function meta() {
  return [
    { title: '스프린트 미션 | Sprinters' },
    { name: 'description', content: '스프린트 미션 진행 상황을 한눈에 파악하고, 순위 경쟁을 해보세요.' },
  ];
}

export async function loader() {
  const students = await fetchMissionRankStudents();
  return { students };
}

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
