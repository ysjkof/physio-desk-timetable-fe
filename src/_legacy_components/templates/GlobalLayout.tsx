import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { cls } from '../../utils/common.utils';
import { Initialize } from '../../components';
import Toast from '../molecules/Toast';

const TableAside = lazy(() => import('../../components/GlobalAside'));

const LoggedOutGlobalNavBar = lazy(
  () => import('../organisms/LoggedOutGlobalNavBar')
);

export interface IsLoggedIn {
  isLoggedIn?: boolean;
}

export default function GlobalLayout({ isLoggedIn }: IsLoggedIn) {
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
          <Outlet />
        </Initialize>
      ) : (
        <>
          <LoggedOutGlobalNavBar />
          <Outlet />
        </>
      )}
      <Toast />
    </div>
  );
}
