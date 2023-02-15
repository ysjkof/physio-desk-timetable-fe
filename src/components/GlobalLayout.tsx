import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { cls } from '../utils/common.utils';
import { useStore } from '../store';
import Initialize from './Initialize';
import Toast from './Toast';
import Confirm from './Confirm';
import Alert from './Alert';

const GlobalAside = lazy(() => import('./GlobalAside'));
const GlobalNavBar = lazy(() => import('./GlobalNavBar'));
const Loading = lazy(() => import('./Loading'));

function GlobalLayout() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  return (
    <div
      className={cls(
        'flex h-screen overflow-hidden',
        isLoggedIn ? '' : 'flex-col'
      )}
    >
      {isLoggedIn ? (
        <Initialize>
          <GlobalAside />
          <OutletWithSuspense />
        </Initialize>
      ) : (
        <>
          <GlobalNavBar />
          <OutletWithSuspense />
        </>
      )}
      <Toast />
      <Confirm />
      <Alert />
    </div>
  );
}

const OutletWithSuspense = () => (
  <Suspense fallback={<Loading />}>
    <Outlet />
  </Suspense>
);

export default GlobalLayout;
