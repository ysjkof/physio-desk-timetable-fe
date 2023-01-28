import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Initialize } from '../../components';
import Toast from '../molecules/Toast';

const LoggedInGlobalNavBar = lazy(
  () => import('../organisms/LoggedInGlobalNavBar')
);
const LoggedOutGlobalNavBar = lazy(
  () => import('../organisms/LoggedOutGlobalNavBar')
);

export interface IsLoggedIn {
  isLoggedIn?: boolean;
}

export default function GlobalLayout({ isLoggedIn }: IsLoggedIn) {
  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? (
        <Initialize>
          <LoggedInGlobalNavBar />
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
