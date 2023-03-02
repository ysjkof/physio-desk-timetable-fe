import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store';
import Initialize from './Initialize';
import Toast from './Toast';
import Confirm from './Confirm';
import Alert from './Alert';

const GlobalAside = lazy(() => import('./GlobalAside/GlobalAside'));
const GlobalNavBar = lazy(() => import('./GlobalNavBar/GlobalNavBar'));
const GlobalFooter = lazy(() => import('./GlobalFooter/GlobalFooter'));
const Loading = lazy(() => import('./Loading'));

function GlobalLayout() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  return (
    <>
      {isLoggedIn ? <SignInLayout /> : <SignOutLayout />}
      <Toast />
      <Confirm />
      <Alert />
    </>
  );
}

const SignInLayout = () => {
  return (
    <main className="flex h-screen overflow-hidden">
      <Initialize>
        <GlobalAside />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Initialize>
    </main>
  );
};

const SignOutLayout = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <GlobalNavBar />
      <Suspense fallback={<Loading />}>
        <main>
          <Outlet />
        </main>
        <GlobalFooter />
      </Suspense>
    </div>
  );
};

export default GlobalLayout;
