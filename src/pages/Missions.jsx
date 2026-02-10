import { useLoaderData } from 'react-router';
import { Mission } from '../components/Mission';
import { MissionsHeader } from '../components/MissionsHeader';

const RANK_BADGES = [
  {
    emoji: '🥇',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
  },
  {
    emoji: '🥈',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border-gray-300',
  },
  {
    emoji: '🥉',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
  },
];

function Missions() {
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

export { Missions };
