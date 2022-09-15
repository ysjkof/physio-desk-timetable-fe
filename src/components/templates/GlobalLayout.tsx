import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import useLoginInitialization from '../../hooks/useLoginInitialization';
import Toast from '../molecules/Toast';
const Loading = lazy(() => import('../atoms/Loading'));

const LoggedInGlobalNavBar = lazy(
  () => import('../organisms/LoggedInGlobalNavBar')
);
const LoggedOutGlobalNavBar = lazy(
  () => import('../organisms/LoggedOutGlobalNavBar')
);

export default function GlobalLayout({ isLoggedIn }: { isLoggedIn?: boolean }) {
  let loading = true;
  if (isLoggedIn) {
    loading = useLoginInitialization().loading;
  }

  if (isLoggedIn && loading) return <Loading></Loading>;

  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavBar /> : <LoggedOutGlobalNavBar />}
      <Outlet />
      <Toast />
    </div>
  );
}
