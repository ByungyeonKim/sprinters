import { createBrowserRouter } from 'react-router';
import { App } from './App';
import {
  HomeHydrateFallback,
  MissionHydrateFallback,
  TILHydrateFallback,
  TILDetailHydrateFallback,
} from './components/fallbacks';
import {
  loadHomeRoute,
  loadMissionRoute,
  loadTILRoute,
  loadTILNewRoute,
  loadTILDetailRoute,
} from './routes/lazyRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        lazy: loadHomeRoute,
        HydrateFallback: HomeHydrateFallback,
      },
      {
        path: 'mission',
        lazy: loadMissionRoute,
        HydrateFallback: MissionHydrateFallback,
      },
      {
        path: 'til',
        lazy: loadTILRoute,
        HydrateFallback: TILHydrateFallback,
      },
      {
        path: 'til/new',
        lazy: loadTILNewRoute,
      },
      {
        path: 'til/:username/:postNumber',
        lazy: loadTILDetailRoute,
        HydrateFallback: TILDetailHydrateFallback,
      },
    ],
  },
]);
