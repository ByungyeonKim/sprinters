import { createBrowserRouter } from 'react-router';
import { App } from './App';
import { Home } from './pages/Home';
import { Archive } from './pages/Archive';
import { TIL } from './pages/TIL';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'archive',
        element: <Archive />,
      },
      {
        path: 'til',
        element: <TIL />,
      },
    ],
  },
]);
