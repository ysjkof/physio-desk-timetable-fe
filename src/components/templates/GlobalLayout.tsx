import { lazy, Suspense } from 'react';
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

export interface IsLoggedIn {
  isLoggedIn?: boolean;
}

export default function GlobalLayout({ isLoggedIn }: IsLoggedIn) {
  const { loading } = useLoginInitialization({ isLoggedIn });

  if (isLoggedIn && loading) return <Loading />;

  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavBar /> : <LoggedOutGlobalNavBar />}
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <Toast />
    </div>
  );
}
