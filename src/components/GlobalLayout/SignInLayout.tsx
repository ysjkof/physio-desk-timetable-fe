import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import Initialize from '../Initialize';
import { GlobalAside } from '../GlobalAside';

const Loading = lazy(() => import('../Loading'));

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

export default SignInLayout;
