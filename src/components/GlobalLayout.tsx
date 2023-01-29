import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { cls } from '../utils/common.utils';
import Initialize from './Initialize';
import Toast from '../_legacy_components/molecules/Toast';
import Loading from '../_legacy_components/atoms/Loading';

const TableAside = lazy(() => import('./GlobalAside'));
const GlobalNavBar = lazy(() => import('./GlobalNavBar'));

export interface IsLoggedIn {
  isLoggedIn?: boolean;
}

function GlobalLayout({ isLoggedIn }: IsLoggedIn) {
  return (
    <div
      className={cls(
        'flex h-screen overflow-hidden',
        isLoggedIn ? '' : 'flex-col'
      )}
    >
      {isLoggedIn ? (
        <Initialize>
          <TableAside />
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
