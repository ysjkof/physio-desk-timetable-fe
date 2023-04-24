import { lazy } from 'react';
import { isProduction } from '../constants/constants';

const CheckAdmin = lazy(() => import('../components/CheckAdmin'));
const TestPage = lazy(() => import('../pages/TestPage'));

const devRoute = [
  {
    path: 'test',
    element: isProduction ? (
      <CheckAdmin>
        <TestPage />
      </CheckAdmin>
    ) : (
      <TestPage />
    ),
  },
];

export default devRoute;
