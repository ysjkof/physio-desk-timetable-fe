import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import logoutRoute from './logoutRoute';
import loginRoute from './loginRoute';
import devRoute from './devRoute';
import { ROOT } from './routes';

const NotFound = lazy(() => import('../components/NotFound'));

const router = createBrowserRouter([
  {
    path: ROOT,
    element: <App />,
    children: [...logoutRoute, ...loginRoute, ...devRoute],
    errorElement: <NotFound />,
  },
]);

export default router;
