import { createBrowserRouter } from 'react-router';
import { App } from './App';
import { Home } from './pages/Home';
import { Mission } from './pages/Mission';
import { missionLoader } from './loaders/mission';
import { TIL } from './pages/TIL';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: missionLoader,
        HydrateFallback: () => (
          <div>
            <section className='border-b border-gray-200 pt-10 pb-16'>
              <h1 className='mb-8 text-[80px] leading-none font-bold'>
                코드잇 FE
                <br />
                스프린터 저장소
              </h1>
              <p className='mb-8 max-w-lg text-xl text-gray-600'>
                혼자 고민하던 호기심부터
                <br />
                오늘 배운 작은 깨달음까지 기록하고, 공유해보세요.
              </p>
              <div className='flex gap-6'>
                <span className='text-gray-900 underline underline-offset-4'>
                  스프린트 미션
                  <span className='ml-1 inline-block'>→</span>
                </span>
                <span className='text-gray-900 underline underline-offset-4'>
                  Today I Learned
                  <span className='ml-1 inline-block'>→</span>
                </span>
              </div>
            </section>

            <section className='py-12'>
              <div className='grid grid-cols-2 gap-16'>
                <div>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-lg font-bold'>스프린트 미션 순위</h2>
                    <span className='text-sm text-gray-500'>전체보기</span>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className='flex items-center gap-3'>
                        <span className='basis-9 text-2xl font-bold text-gray-200'>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className='h-12 w-12 animate-pulse rounded-full bg-gray-200' />
                        <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-lg font-bold'>스프린터 인기 TIL</h2>
                    <span className='text-sm text-gray-500'>전체보기</span>
                  </div>
                  <div className='space-y-6'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='flex items-start gap-4'>
                        <span className='text-2xl font-bold text-gray-200'>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className='mb-1 h-4 w-12 animate-pulse rounded bg-gray-200' />
                          <div className='h-6 w-52 animate-pulse rounded bg-gray-200' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ),
      },
      {
        path: 'mission',
        element: <Mission />,
        loader: missionLoader,
        HydrateFallback: () => (
          <div>
            <header className='mb-10 border-b border-gray-200 py-10'>
              <h1 className='mb-3 text-4xl font-bold'>스프린트 미션</h1>
              <p className='text-gray-600'>
                다음 미션 하나만 더 해볼까요?
                <br /> 몇 개의 미션을 완료했는지 확인해보세요.
              </p>
            </header>
            <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {[...Array(15)].map((_, i) => (
                <li
                  key={i}
                  className='flex rounded-lg border border-gray-200 p-4'
                >
                  <div className='flex grow flex-col items-center'>
                    <div className='mb-3 h-16 w-16 animate-pulse rounded-full bg-gray-200' />
                    <div className='mb-2 h-4 w-16 animate-pulse rounded bg-gray-200' />
                    <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        path: 'til',
        element: <TIL />,
      },
    ],
  },
]);
