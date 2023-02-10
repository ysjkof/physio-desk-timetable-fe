import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { cls } from '../utils/common.utils';
import Initialize from './Initialize';
import Toast from '../_legacy_components/molecules/Toast';
import { useStore } from '../store';

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
    </div>
  );
}

const OutletWithSuspense = () => (
  <Suspense fallback={<Loading />}>
    <Outlet />
  </Suspense>
);

export default GlobalLayout;
