import { useLoaderData } from 'react-router';

const TOTAL_MISSIONS = 13;

function Mission() {
  const { students } = useLoaderData();

  return (
    <section>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <h1 className='mb-3 text-4xl font-bold'>스프린트 미션</h1>
        <p className='text-gray-600'>
          다음 미션 하나만 더 해볼까요?
          <br /> 몇 개의 미션을 완료했는지 확인해보세요.
        </p>
      </header>

      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {students.map((student) => {
          const completedCount = student.mission;
          const incompleteCount = TOTAL_MISSIONS - completedCount;

          return (
            <li key={student.id}>
              <a
                href={`https://github.com/${student.github}`}
                target='_blank'
                rel='noopener noreferrer'
                className='group relative flex rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-800'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='absolute top-2 right-2 size-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100'
                >
                  <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                  <polyline points='15 3 21 3 21 9' />
                  <line x1='10' y1='14' x2='21' y2='3' />
                </svg>
                <div className='flex grow flex-col items-center'>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className='mb-3 h-16 w-16 rounded-full object-cover'
                  />
                  <div className='mb-2 flex items-center gap-2'>
                    <h2 className='font-semibold'>{student.name}</h2>
                    {student.currentTitle && (
                      <span
                        className={`rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800 ${
                          ['Basic 4', 'React 7', 'Next 13'].includes(
                            student.currentTitle,
                          )
                            ? 'badge-glow'
                            : ''
                        }`}
                      >
                        {student.currentTitle}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <span className='flex items-center gap-1 text-green-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='size-5'
                      >
                        <path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z' />
                        <path
                          d='m9 12 2 2 4-4'
                          transform='scale(1.3) translate(-2.4 -2.4)'
                        />
                      </svg>
                      {completedCount}
                    </span>
                    <span className='flex items-center gap-1 text-rose-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='size-5'
                      >
                        <path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z' />
                        <path
                          d='M6 18L18 6M6 6l12 12'
                          transform='scale(0.65) translate(6.5 6.5)'
                        />
                      </svg>
                      {incompleteCount}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { Mission };
