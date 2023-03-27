import { lazy } from 'react';

const CheckAdmin = lazy(() => import('../components/CheckAdmin'));
const TestPage = lazy(() => import('../pages/TestPage'));

const devRoute = [
  {
    path: 'test',
    element:
      import.meta.env.MODE === 'development' ? (
        <TestPage />
      ) : (
        <CheckAdmin>
          <TestPage />
        </CheckAdmin>
      ),
  },
];

export default devRoute;
